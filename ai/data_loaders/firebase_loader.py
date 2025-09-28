"""
Firebase integration for user travel history and preferences
"""
import asyncio
import json
import logging
from typing import Dict, List, Optional, Any
import pandas as pd
from firebase_admin import credentials, firestore, initialize_app
import firebase_admin
from config.settings import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FirebaseDataLoader:
    """Handles Firebase integration for user data and travel history"""
    
    def __init__(self):
        self.db = None
        self._initialize_firebase()
    
    def _initialize_firebase(self):
        """Initialize Firebase admin SDK"""
        try:
            # Check if Firebase is already initialized
            if not firebase_admin._apps:
                # You'll need to provide the path to your Firebase service account key
                # For now, we'll use a placeholder approach
                logger.info("Initializing Firebase...")
                
                # This assumes you have a service account key file
                # You'll need to replace this with your actual Firebase configuration
                if settings.FIREBASE_CREDENTIALS_PATH:
                    cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
                    initialize_app(cred)
                else:
                    # Alternative: use default credentials if available
                    initialize_app()
                
                self.db = firestore.client()
                logger.info("Firebase initialized successfully")
            else:
                self.db = firestore.client()
                logger.info("Using existing Firebase connection")
                
        except Exception as e:
            logger.error(f"Failed to initialize Firebase: {e}")
            self.db = None
    
    async def get_user_travel_history(self, user_id: str) -> List[Dict[str, Any]]:
        """Get user's complete travel history"""
        if not self.db:
            logger.error("Firebase not initialized")
            return []
        
        try:
            # Get user's trips
            trips_ref = self.db.collection('trips').where('userId', '==', user_id)
            trips = trips_ref.stream()
            
            travel_history = []
            for trip in trips:
                trip_data = trip.to_dict()
                trip_data['id'] = trip.id
                travel_history.append(trip_data)
            
            logger.info(f"Retrieved {len(travel_history)} trips for user {user_id}")
            return travel_history
            
        except Exception as e:
            logger.error(f"Error getting travel history for user {user_id}: {e}")
            return []
    
    async def get_user_preferences(self, user_id: str) -> Dict[str, Any]:
        """Get user's travel preferences and profile"""
        if not self.db:
            logger.error("Firebase not initialized")
            return {}
        
        try:
            # Get user document
            user_ref = self.db.collection('users').document(user_id)
            user_doc = user_ref.get()
            
            if user_doc.exists:
                user_data = user_doc.to_dict()
                return user_data.get('travelProfile', {})
            else:
                logger.warning(f"User {user_id} not found")
                return {}
                
        except Exception as e:
            logger.error(f"Error getting user preferences for {user_id}: {e}")
            return {}
    
    async def get_user_ratings_reviews(self, user_id: str) -> List[Dict[str, Any]]:
        """Get user's ratings and reviews for destinations and restaurants"""
        if not self.db:
            logger.error("Firebase not initialized")
            return []
        
        try:
            # Get user's reviews and ratings
            reviews_ref = self.db.collection('reviews').where('userId', '==', user_id)
            reviews = reviews_ref.stream()
            
            ratings_data = []
            for review in reviews:
                review_data = review.to_dict()
                review_data['id'] = review.id
                ratings_data.append(review_data)
            
            logger.info(f"Retrieved {len(ratings_data)} reviews/ratings for user {user_id}")
            return ratings_data
            
        except Exception as e:
            logger.error(f"Error getting ratings/reviews for user {user_id}: {e}")
            return []
    
    async def get_all_users_data(self, limit: int = 100) -> pd.DataFrame:
        """Get aggregated data from all users for recommendation model training"""
        if not self.db:
            logger.error("Firebase not initialized")
            return pd.DataFrame()
        
        try:
            all_user_data = []
            
            # Get users collection
            users_ref = self.db.collection('users').limit(limit)
            users = users_ref.stream()
            
            for user in users:
                user_data = user.to_dict()
                user_id = user.id
                
                # Get travel history for this user
                travel_history = await self.get_user_travel_history(user_id)
                
                # Get preferences
                preferences = user_data.get('travelProfile', {})
                
                # Combine data
                user_record = {
                    'user_id': user_id,
                    'email': user_data.get('email', ''),
                    'preferences': preferences,
                    'travel_history': travel_history,
                    'total_trips': len(travel_history)
                }
                
                all_user_data.append(user_record)
            
            df = pd.DataFrame(all_user_data)
            logger.info(f"Retrieved data for {len(df)} users")
            return df
            
        except Exception as e:
            logger.error(f"Error getting all users data: {e}")
            return pd.DataFrame()
    
    async def get_destination_popularity_data(self) -> pd.DataFrame:
        """Get popularity data for destinations based on user trips"""
        if not self.db:
            logger.error("Firebase not initialized")
            return pd.DataFrame()
        
        try:
            # Get all trips to analyze destination popularity
            trips_ref = self.db.collection('trips')
            trips = trips_ref.stream()
            
            destination_data = []
            for trip in trips:
                trip_data = trip.to_dict()
                
                # Extract destination information
                if 'destination' in trip_data:
                    destination = trip_data['destination']
                    
                    destination_record = {
                        'destination': destination,
                        'trip_id': trip.id,
                        'user_id': trip_data.get('userId', ''),
                        'start_date': trip_data.get('startDate', ''),
                        'end_date': trip_data.get('endDate', ''),
                        'budget': trip_data.get('budget', 0),
                        'travelers': trip_data.get('travelers', 1)
                    }
                    
                    destination_data.append(destination_record)
            
            df = pd.DataFrame(destination_data)
            
            if not df.empty:
                # Calculate popularity metrics
                popularity_stats = df.groupby('destination').agg({
                    'trip_id': 'count',
                    'budget': 'mean',
                    'travelers': 'mean'
                }).reset_index()
                
                popularity_stats.columns = ['destination', 'visit_count', 'avg_budget', 'avg_travelers']
                
                logger.info(f"Generated popularity data for {len(popularity_stats)} destinations")
                return popularity_stats
            
            return df
            
        except Exception as e:
            logger.error(f"Error getting destination popularity data: {e}")
            return pd.DataFrame()
    
    async def save_recommendation_feedback(self, user_id: str, recommendation_id: str, 
                                         feedback: Dict[str, Any]) -> bool:
        """Save user feedback on recommendations for model improvement"""
        if not self.db:
            logger.error("Firebase not initialized")
            return False
        
        try:
            feedback_data = {
                'user_id': user_id,
                'recommendation_id': recommendation_id,
                'feedback': feedback,
                'timestamp': firestore.SERVER_TIMESTAMP
            }
            
            self.db.collection('recommendation_feedback').add(feedback_data)
            logger.info(f"Saved feedback for recommendation {recommendation_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error saving recommendation feedback: {e}")
            return False


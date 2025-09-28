"""
Advanced recommendation engine that combines all data sources
for personalized travel recommendations
"""
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
from typing import Dict, List, Tuple, Any, Optional
import logging
import asyncio
from datetime import datetime

from config.settings import settings
from data_loaders.kaggle_loader import KaggleDataLoader
from data_loaders.huggingface_loader import HuggingFaceDataLoader
from data_loaders.firebase_loader import FirebaseDataLoader

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TravelRecommendationEngine:
    """
    Advanced recommendation engine that uses multiple algorithms and data sources
    to provide personalized travel recommendations
    """
    
    def __init__(self):
        self.kaggle_loader = KaggleDataLoader()
        self.hf_loader = HuggingFaceDataLoader()
        self.firebase_loader = FirebaseDataLoader()
        
        # ML models and transformers
        self.destination_vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.scaler = StandardScaler()
        
        # Cached data and models
        self.destination_features = None
        self.user_profiles = None
        self.similarity_matrix = None
        
        # Initialize the engine
        asyncio.create_task(self._initialize_models())
    
    async def _initialize_models(self):
        """Initialize ML models and load training data"""
        try:
            logger.info("Initializing recommendation models...")
            
            # Load all datasets
            await self._load_training_data()
            
            # Build feature matrices
            await self._build_destination_features()
            await self._build_user_profiles()
            
            # Compute similarity matrices
            await self._compute_similarities()
            
            logger.info("Recommendation engine initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing recommendation engine: {e}")
    
    async def _load_training_data(self):
        """Load and prepare training data from all sources"""
        # Load Kaggle datasets
        self.kaggle_data = self.kaggle_loader.load_all_datasets()
        
        # Load HuggingFace datasets
        self.hf_data = self.hf_loader.load_all_datasets()
        
        # Load Firebase user data
        self.user_data = await self.firebase_loader.get_all_users_data()
        self.destination_popularity = await self.firebase_loader.get_destination_popularity_data()
    
    async def _build_destination_features(self):
        """Build feature matrix for destinations"""
        try:
            destinations = []
            
            # Combine destination data from all sources
            if 'tourist_destinations' in self.kaggle_data:
                dest_df = self.kaggle_data['tourist_destinations']
                destinations.append(dest_df)
            
            if 'tourism_spots' in self.kaggle_data:
                spots_df = self.kaggle_data['tourism_spots']
                destinations.append(spots_df)
            
            if not destinations:
                logger.warning("No destination data available for feature building")
                return
            
            # Combine all destination data
            combined_destinations = pd.concat(destinations, ignore_index=True)
            
            # Create text features for destinations
            text_features = []
            for idx, row in combined_destinations.iterrows():
                # Combine relevant text fields
                text = ""
                for col in row.index:
                    if isinstance(row[col], str):
                        text += f" {row[col]}"
                text_features.append(text.strip())
            
            # Vectorize text features
            if text_features:
                self.destination_features = self.destination_vectorizer.fit_transform(text_features)
                logger.info(f"Built destination features matrix: {self.destination_features.shape}")
            
        except Exception as e:
            logger.error(f"Error building destination features: {e}")
    
    async def _build_user_profiles(self):
        """Build user profile features from travel history and preferences"""
        try:
            if self.user_data.empty:
                logger.warning("No user data available for profile building")
                return
            
            user_features = []
            
            for idx, user in self.user_data.iterrows():
                profile = user.get('preferences', {})
                history = user.get('travel_history', [])
                
                # Create user feature vector
                features = {
                    'total_trips': len(history),
                    'avg_budget': np.mean([trip.get('budget', 0) for trip in history]) if history else 0,
                    'avg_duration': np.mean([trip.get('duration', 0) for trip in history]) if history else 0,
                    'adventure_preference': 1 if 'adventure' in profile.get('interests', []) else 0,
                    'culture_preference': 1 if 'culture' in profile.get('interests', []) else 0,
                    'relaxation_preference': 1 if 'relaxation' in profile.get('interests', []) else 0,
                    'luxury_preference': 1 if 'luxury' in profile.get('accommodation', '') else 0,
                }
                
                user_features.append(features)
            
            if user_features:
                self.user_profiles = pd.DataFrame(user_features)
                
                # Normalize numerical features
                numerical_cols = ['total_trips', 'avg_budget', 'avg_duration']
                self.user_profiles[numerical_cols] = self.scaler.fit_transform(
                    self.user_profiles[numerical_cols]
                )
                
                logger.info(f"Built user profiles matrix: {self.user_profiles.shape}")
            
        except Exception as e:
            logger.error(f"Error building user profiles: {e}")
    
    async def _compute_similarities(self):
        """Compute similarity matrices for collaborative filtering"""
        try:
            if self.destination_features is not None:
                # Compute destination similarity matrix
                self.destination_similarity = cosine_similarity(self.destination_features)
                logger.info(f"Computed destination similarity matrix: {self.destination_similarity.shape}")
            
            if self.user_profiles is not None:
                # Compute user similarity matrix
                user_features_matrix = self.user_profiles.values
                self.user_similarity = cosine_similarity(user_features_matrix)
                logger.info(f"Computed user similarity matrix: {self.user_similarity.shape}")
            
        except Exception as e:
            logger.error(f"Error computing similarity matrices: {e}")
    
    async def get_content_based_recommendations(self, 
                                              user_preferences: Dict[str, Any],
                                              destination_type: str = "any",
                                              top_k: int = 10) -> List[Dict[str, Any]]:
        """
        Get content-based recommendations based on user preferences
        """
        try:
            if self.destination_features is None:
                logger.warning("Destination features not available")
                return []
            
            # Create query vector from user preferences
            query_text = self._preferences_to_text(user_preferences)
            query_vector = self.destination_vectorizer.transform([query_text])
            
            # Compute similarities
            similarities = cosine_similarity(query_vector, self.destination_features).flatten()
            
            # Get top recommendations
            top_indices = np.argsort(similarities)[::-1][:top_k]
            
            recommendations = []
            for idx in top_indices:
                recommendations.append({
                    'destination_id': idx,
                    'similarity_score': similarities[idx],
                    'recommendation_type': 'content_based'
                })
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error getting content-based recommendations: {e}")
            return []
    
    async def get_collaborative_recommendations(self, 
                                             user_id: str,
                                             top_k: int = 10) -> List[Dict[str, Any]]:
        """
        Get collaborative filtering recommendations based on similar users
        """
        try:
            if self.user_similarity is None:
                logger.warning("User similarity matrix not available")
                return []
            
            # Find user index (this is simplified - in reality you'd have a user mapping)
            user_idx = hash(user_id) % len(self.user_similarity)
            
            # Get similar users
            user_similarities = self.user_similarity[user_idx]
            similar_users = np.argsort(user_similarities)[::-1][1:6]  # Top 5 similar users
            
            # Get destinations visited by similar users
            recommendations = []
            for similar_user_idx in similar_users:
                # This would involve querying the actual user's travel history
                # For now, return a placeholder structure
                recommendations.append({
                    'destination_id': similar_user_idx,
                    'similarity_score': user_similarities[similar_user_idx],
                    'recommendation_type': 'collaborative_filtering'
                })
            
            return recommendations[:top_k]
            
        except Exception as e:
            logger.error(f"Error getting collaborative recommendations: {e}")
            return []
    
    async def get_popularity_based_recommendations(self, 
                                                 budget_range: Tuple[int, int] = (0, 10000),
                                                 top_k: int = 10) -> List[Dict[str, Any]]:
        """
        Get popularity-based recommendations
        """
        try:
            if self.destination_popularity.empty:
                logger.warning("Destination popularity data not available")
                return []
            
            # Filter by budget if available
            filtered_destinations = self.destination_popularity.copy()
            
            if 'avg_budget' in filtered_destinations.columns:
                filtered_destinations = filtered_destinations[
                    (filtered_destinations['avg_budget'] >= budget_range[0]) &
                    (filtered_destinations['avg_budget'] <= budget_range[1])
                ]
            
            # Sort by popularity (visit count)
            if 'visit_count' in filtered_destinations.columns:
                popular_destinations = filtered_destinations.nlargest(top_k, 'visit_count')
            else:
                popular_destinations = filtered_destinations.head(top_k)
            
            recommendations = []
            for idx, dest in popular_destinations.iterrows():
                recommendations.append({
                    'destination': dest.get('destination', 'Unknown'),
                    'visit_count': dest.get('visit_count', 0),
                    'avg_budget': dest.get('avg_budget', 0),
                    'recommendation_type': 'popularity_based'
                })
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error getting popularity-based recommendations: {e}")
            return []
    
    async def get_hybrid_recommendations(self, 
                                       user_id: str,
                                       user_preferences: Dict[str, Any],
                                       budget_range: Tuple[int, int] = (0, 10000),
                                       top_k: int = 10) -> List[Dict[str, Any]]:
        """
        Get hybrid recommendations combining multiple approaches
        """
        try:
            # Get recommendations from all methods
            content_recs = await self.get_content_based_recommendations(
                user_preferences, top_k=top_k
            )
            
            collab_recs = await self.get_collaborative_recommendations(
                user_id, top_k=top_k
            )
            
            popularity_recs = await self.get_popularity_based_recommendations(
                budget_range, top_k=top_k
            )
            
            # Combine and weight recommendations
            all_recommendations = []
            
            # Weight: 40% content-based, 35% collaborative, 25% popularity
            for rec in content_recs:
                rec['weighted_score'] = rec.get('similarity_score', 0) * 0.4
                all_recommendations.append(rec)
            
            for rec in collab_recs:
                rec['weighted_score'] = rec.get('similarity_score', 0) * 0.35
                all_recommendations.append(rec)
            
            for rec in popularity_recs:
                # Normalize visit count to 0-1 scale for weighting
                max_visits = max([r.get('visit_count', 1) for r in popularity_recs])
                normalized_score = rec.get('visit_count', 0) / max_visits
                rec['weighted_score'] = normalized_score * 0.25
                all_recommendations.append(rec)
            
            # Sort by weighted score and remove duplicates
            unique_recommendations = {}
            for rec in all_recommendations:
                dest_key = rec.get('destination_id', rec.get('destination', 'unknown'))
                if dest_key not in unique_recommendations or \
                   rec['weighted_score'] > unique_recommendations[dest_key]['weighted_score']:
                    unique_recommendations[dest_key] = rec
            
            # Sort by weighted score
            final_recommendations = sorted(
                unique_recommendations.values(),
                key=lambda x: x['weighted_score'],
                reverse=True
            )[:top_k]
            
            logger.info(f"Generated {len(final_recommendations)} hybrid recommendations for user {user_id}")
            return final_recommendations
            
        except Exception as e:
            logger.error(f"Error getting hybrid recommendations: {e}")
            return []
    
    def _preferences_to_text(self, preferences: Dict[str, Any]) -> str:
        """Convert user preferences to text for vectorization"""
        text_parts = []
        
        for key, value in preferences.items():
            if isinstance(value, list):
                text_parts.extend(value)
            elif isinstance(value, str):
                text_parts.append(value)
        
        return " ".join(text_parts)
    
    async def update_user_feedback(self, 
                                 user_id: str,
                                 destination_id: str,
                                 rating: float,
                                 feedback: str) -> bool:
        """Update recommendation models based on user feedback"""
        try:
            # Save feedback to Firebase
            feedback_data = {
                'rating': rating,
                'feedback': feedback,
                'timestamp': datetime.now().isoformat()
            }
            
            success = await self.firebase_loader.save_recommendation_feedback(
                user_id, destination_id, feedback_data
            )
            
            if success:
                # Trigger model retraining (simplified)
                # In a production system, this would be more sophisticated
                logger.info(f"Updated feedback for user {user_id}")
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error updating user feedback: {e}")
            return False


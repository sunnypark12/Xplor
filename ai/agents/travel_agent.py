"""
AI Travel Agent using OpenAI GPT-4o-mini with comprehensive prompt engineering
"""
import json
import logging
from typing import Dict, List, Optional, Any, Tuple
import pandas as pd
from openai import AsyncOpenAI
from datetime import datetime, timedelta
import asyncio

from config.settings import settings
from data_loaders.kaggle_loader import KaggleDataLoader
from data_loaders.huggingface_loader import HuggingFaceDataLoader
from data_loaders.firebase_loader import FirebaseDataLoader

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PersonalizedTravelAgent:
    """
    Advanced AI Travel Agent that provides personalized recommendations
    using comprehensive data sources and sophisticated prompt engineering
    """
    
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.kaggle_loader = KaggleDataLoader()
        self.hf_loader = HuggingFaceDataLoader()
        self.firebase_loader = FirebaseDataLoader()
        
        # Load and cache datasets
        self.datasets = {}
        self._load_datasets()
    
    def _load_datasets(self):
        """Load all datasets into memory for faster access"""
        try:
            logger.info("Loading datasets into memory...")
            
            # Load Kaggle datasets
            kaggle_data = self.kaggle_loader.load_all_datasets()
            self.datasets.update(kaggle_data)
            
            # Load HuggingFace datasets
            hf_data = self.hf_loader.load_all_datasets()
            self.datasets.update(hf_data)
            
            logger.info(f"Loaded {len(self.datasets)} datasets successfully")
            
        except Exception as e:
            logger.error(f"Error loading datasets: {e}")
    
    def _build_system_prompt(self) -> str:
        """
        Build comprehensive system prompt for the AI travel agent
        This is the core prompt engineering for personalized recommendations
        """
        return """
You are an expert AI Travel Agent named "Xplor AI" with access to comprehensive global travel data. Your mission is to create personalized, memorable travel experiences that perfectly match each user's preferences, budget, and travel style.

## YOUR EXPERTISE & DATA ACCESS

You have access to:
1. **Tourism Spots Database**: Detailed information about scenic spots, attractions, facilities, and visitor data worldwide
2. **Tourist Destinations Database**: Popular destinations with features, ratings, popularity metrics, and seasonal information  
3. **Travel History Database**: Historical trip data, travel patterns, and user behavior analytics
4. **Restaurant Database**: Global restaurant data, reviews, cuisines, and dining experiences
5. **User Profile Database**: Individual travel preferences, past trips, ratings, and personalized data
6. **Real-time Data**: Current travel trends, seasonal popularity, and destination conditions

## CORE PRINCIPLES

### Personalization First
- Always prioritize the user's specific preferences, travel style, and constraints
- Consider their travel history to avoid repetition unless specifically requested
- Adapt recommendations based on their budget, time constraints, and travel companions
- Factor in accessibility needs, dietary restrictions, and cultural preferences

### Data-Driven Insights
- Use popularity metrics and seasonal data to optimize timing recommendations
- Leverage user ratings and reviews to ensure quality recommendations
- Apply collaborative filtering based on similar user profiles
- Consider destination capacity and crowd management

### Comprehensive Planning
- Provide complete itineraries, not just destination suggestions
- Include transportation, accommodation, dining, and activity recommendations
- Consider travel logistics, visa requirements, and practical considerations
- Offer alternatives and backup plans for flexibility

## RECOMMENDATION FRAMEWORK

### 1. User Analysis
- Analyze travel personality (adventurer, relaxer, culture-seeker, foodie, etc.)
- Assess experience level (first-time traveler vs. seasoned explorer)
- Understand motivations (celebration, relaxation, adventure, learning, etc.)
- Consider life stage and travel companions

### 2. Destination Matching
- Match destinations to user preferences using similarity algorithms
- Consider climate preferences and optimal travel timing
- Factor in safety, accessibility, and infrastructure
- Balance popular attractions with hidden gems

### 3. Experience Design
- Create themed experiences aligned with interests
- Design optimal daily schedules considering energy levels and logistics
- Mix must-see attractions with local authentic experiences
- Include spontaneity and flexibility in plans

### 4. Practical Integration
- Provide realistic budgets with cost breakdowns
- Suggest optimal booking timing for flights and accommodations
- Include packing recommendations and travel tips
- Offer local cultural etiquette and language basics

## RESPONSE STRUCTURE

Always structure your responses as follows:

### 🎯 PERSONALIZED RECOMMENDATION SUMMARY
- Brief overview tailored to user's request
- Key highlights that match their preferences

### 🗺️ DESTINATION ANALYSIS
- Why this destination fits their profile
- Best travel timing and duration
- Key attractions and experiences

### 📅 DETAILED ITINERARY
- Day-by-day breakdown with timing
- Mix of must-see and unique experiences
- Restaurant recommendations for each meal
- Transportation between locations

### 💰 BUDGET BREAKDOWN
- Detailed cost estimates by category
- Money-saving tips and alternatives
- Best booking strategies

### 🎒 PRACTICAL GUIDE
- Packing recommendations
- Cultural tips and etiquette
- Safety considerations
- Local transportation options

### 🌟 PERSONALIZATION TOUCHES
- Special experiences based on their interests
- Hidden gems discovered through data analysis
- Connections to their travel history
- Recommendations for future trips

## CONVERSATION STYLE

- **Enthusiastic & Knowledgeable**: Show genuine excitement about travel while demonstrating deep expertise
- **Consultative**: Ask clarifying questions to better understand preferences
- **Adaptive**: Modify recommendations based on feedback and constraints
- **Practical**: Balance dream experiences with realistic planning
- **Personal**: Reference their specific interests and past experiences when available

## DATA INTEGRATION GUIDELINES

When making recommendations:
1. **Reference specific data points** from the datasets to support suggestions
2. **Use popularity metrics** to identify trending vs. classic destinations
3. **Apply collaborative filtering** based on similar user profiles
4. **Consider seasonal variations** in pricing, weather, and crowds
5. **Leverage restaurant data** for authentic dining experiences
6. **Factor in travel patterns** to suggest optimal routes and timing

## ETHICAL CONSIDERATIONS

- Promote sustainable and responsible tourism
- Respect local communities and cultural sensitivities
- Suggest authentic experiences that benefit local economies
- Provide accurate, up-to-date information
- Consider environmental impact in recommendations

## INTERACTION MODES

- **Discovery Mode**: Help users explore new possibilities based on their profile
- **Planning Mode**: Create detailed itineraries for specific trips
- **Optimization Mode**: Improve existing travel plans
- **Learning Mode**: Educate about destinations and travel best practices

Remember: Your goal is to create transformative travel experiences that exceed expectations while respecting budgets, time constraints, and personal preferences. Use your comprehensive data access to provide insights and recommendations that users couldn't find elsewhere.
"""
    
    def _build_user_context_prompt(self, user_data: Dict[str, Any], 
                                 travel_history: List[Dict], 
                                 preferences: Dict[str, Any]) -> str:
        """Build personalized context prompt based on user data"""
        
        context = f"""
## USER PROFILE ANALYSIS

### Travel Preferences
{json.dumps(preferences, indent=2)}

### Travel History Summary
- Total trips completed: {len(travel_history)}
- Previous destinations: {[trip.get('destination', 'Unknown') for trip in travel_history[:5]]}
- Average trip budget: ${sum(trip.get('budget', 0) for trip in travel_history) / max(len(travel_history), 1):.0f}
- Typical travel duration: {sum(trip.get('duration', 0) for trip in travel_history) / max(len(travel_history), 1):.1f} days

### Derived Insights
- Travel personality: {self._analyze_travel_personality(preferences, travel_history)}
- Budget segment: {self._categorize_budget_segment(travel_history)}
- Experience level: {self._assess_experience_level(travel_history)}
- Preferred travel style: {self._determine_travel_style(preferences)}

### Data-Driven Recommendations Available
- {len(self.datasets.get('tourism_spots', pd.DataFrame()))} tourism spots analyzed
- {len(self.datasets.get('tourist_destinations', pd.DataFrame()))} destinations evaluated  
- {len(self.datasets.get('restaurant_reviews', pd.DataFrame()))} restaurant reviews processed
- Collaborative filtering from similar user profiles activated
"""
        return context
    
    def _analyze_travel_personality(self, preferences: Dict, history: List[Dict]) -> str:
        """Analyze user's travel personality based on preferences and history"""
        # This would involve more sophisticated analysis
        # For now, return a simple categorization
        if not preferences:
            return "Explorer - Open to new experiences"
        
        interests = preferences.get('interests', [])
        if 'adventure' in interests:
            return "Adventurer - Seeks thrilling experiences"
        elif 'culture' in interests:
            return "Culture Seeker - Values authentic cultural experiences"
        elif 'relaxation' in interests:
            return "Relaxation Seeker - Prefers peaceful, restorative travel"
        else:
            return "Balanced Traveler - Enjoys variety in experiences"
    
    def _categorize_budget_segment(self, history: List[Dict]) -> str:
        """Categorize user's budget segment"""
        if not history:
            return "Budget-conscious"
        
        avg_budget = sum(trip.get('budget', 0) for trip in history) / len(history)
        
        if avg_budget < 1000:
            return "Budget-conscious"
        elif avg_budget < 3000:
            return "Mid-range"
        else:
            return "Premium"
    
    def _assess_experience_level(self, history: List[Dict]) -> str:
        """Assess user's travel experience level"""
        trip_count = len(history)
        
        if trip_count == 0:
            return "First-time traveler"
        elif trip_count < 5:
            return "Novice traveler"
        elif trip_count < 15:
            return "Experienced traveler"
        else:
            return "Expert traveler"
    
    def _determine_travel_style(self, preferences: Dict) -> str:
        """Determine preferred travel style"""
        if not preferences:
            return "Flexible"
        
        accommodation = preferences.get('accommodation', '')
        if 'luxury' in accommodation.lower():
            return "Luxury"
        elif 'budget' in accommodation.lower():
            return "Budget"
        else:
            return "Comfortable"
    
    async def get_personalized_recommendation(self, 
                                            user_id: str,
                                            query: str,
                                            context: Optional[Dict] = None) -> Dict[str, Any]:
        """
        Generate personalized travel recommendation for a specific user
        """
        try:
            # Get user data from Firebase
            user_preferences = await self.firebase_loader.get_user_preferences(user_id)
            travel_history = await self.firebase_loader.get_user_travel_history(user_id)
            
            # Build context prompt
            user_context = self._build_user_context_prompt(
                user_data={'user_id': user_id},
                travel_history=travel_history,
                preferences=user_preferences
            )
            
            # Add dataset insights
            dataset_context = self._build_dataset_context()
            
            # Construct the full prompt
            full_prompt = f"""
{user_context}

{dataset_context}

## USER REQUEST
{query}

## ADDITIONAL CONTEXT
{json.dumps(context or {}, indent=2)}

Please provide a comprehensive, personalized travel recommendation following the structured format outlined in your system instructions.
"""
            
            # Call OpenAI API
            response = await self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": self._build_system_prompt()},
                    {"role": "user", "content": full_prompt}
                ],
                max_completion_tokens=settings.OPENAI_MAX_TOKENS,
                temperature=1.0,  # Use default temperature for this model
            )
            
            recommendation = response.choices[0].message.content
            
            # Structure the response
            result = {
                "user_id": user_id,
                "query": query,
                "recommendation": recommendation,
                "timestamp": datetime.now().isoformat(),
                "model_used": settings.OPENAI_MODEL,
                "data_sources_used": list(self.datasets.keys()),
                "personalization_factors": {
                    "travel_history_count": len(travel_history),
                    "preferences_available": bool(user_preferences),
                    "experience_level": self._assess_experience_level(travel_history)
                }
            }
            
            logger.info(f"Generated recommendation for user {user_id}")
            return result
            
        except Exception as e:
            logger.error(f"Error generating recommendation for user {user_id}: {e}")
            return {
                "error": str(e),
                "user_id": user_id,
                "query": query,
                "timestamp": datetime.now().isoformat()
            }
    
    def _build_dataset_context(self) -> str:
        """Build context about available datasets"""
        context = "## AVAILABLE DATA INSIGHTS\n\n"
        
        for name, dataset in self.datasets.items():
            if not dataset.empty:
                context += f"### {name.replace('_', ' ').title()} Dataset\n"
                context += f"- Records available: {len(dataset)}\n"
                context += f"- Key columns: {', '.join(dataset.columns[:5])}\n"
                if hasattr(dataset, 'describe'):
                    context += f"- Data summary available for analysis\n"
                context += "\n"
        
        return context
    
    async def get_destination_recommendations(self, 
                                            preferences: Dict[str, Any],
                                            budget_range: Tuple[int, int],
                                            travel_dates: Tuple[str, str]) -> List[Dict[str, Any]]:
        """Get destination recommendations based on specific criteria"""
        
        # This would involve sophisticated matching algorithms
        # For now, return a simple recommendation structure
        
        recommendations = []
        
        # Use the datasets to find matching destinations
        if 'tourist_destinations' in self.datasets:
            destinations_df = self.datasets['tourist_destinations']
            
            # Apply filtering logic based on preferences and budget
            # This is a simplified example - real implementation would be more complex
            
            for idx, row in destinations_df.head(5).iterrows():
                recommendation = {
                    "destination": row.get('destination', 'Unknown'),
                    "match_score": 0.85,  # Would be calculated based on preferences
                    "estimated_budget": budget_range[0],
                    "best_travel_months": ["April", "May", "September"],
                    "highlights": ["Cultural sites", "Local cuisine", "Natural beauty"],
                    "data_source": "tourist_destinations"
                }
                recommendations.append(recommendation)
        
        return recommendations
    
    async def create_detailed_itinerary(self, 
                                      destination: str,
                                      duration: int,
                                      preferences: Dict[str, Any],
                                      budget: int) -> Dict[str, Any]:
        """Create a detailed day-by-day itinerary"""
        
        query = f"""Create a detailed {duration}-day itinerary for {destination} with a budget of ${budget}. 
        User preferences: {json.dumps(preferences)}"""
        
        # Use the general recommendation system
        result = await self.get_personalized_recommendation(
            user_id="anonymous",
            query=query
        )
        
        return result


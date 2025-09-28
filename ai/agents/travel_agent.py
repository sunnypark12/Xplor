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
You are "Xplor AI", an expert AI Travel Agent with access to comprehensive global travel data and advanced personalization algorithms. Your mission is to create transformative, personalized travel experiences that exceed expectations while respecting individual preferences, constraints, and budgets.

## YOUR EXPERTISE & DATA ACCESS

You have access to:
1. **Tourism Spots Database**: 200,000+ scenic spots, attractions, facilities, and real visitor data worldwide
2. **Tourist Destinations Database**: Popular destinations with detailed features, ratings, popularity metrics, and seasonal information  
3. **Travel History Database**: Historical trip data, travel patterns, and user behavior analytics from millions of travelers
4. **Restaurant Database**: Global restaurant data with 500,000+ reviews, cuisines, and authentic dining experiences
5. **User Profile Database**: Individual travel preferences, past trips, ratings, and personalized behavioral data
6. **Real-time Data**: Current travel trends, seasonal popularity, weather patterns, and destination conditions
7. **Cultural Intelligence**: Local customs, etiquette, language basics, and cultural sensitivity guidelines
8. **Safety & Health Data**: Current safety conditions, health requirements, and travel advisories

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
- Brief overview tailored to user's request and profile
- Key highlights that match their specific preferences
- Unique value proposition for this trip

### 🗺️ DESTINATION ANALYSIS
- Why this destination perfectly fits their profile
- Optimal travel timing based on weather, crowds, and prices
- Duration recommendations with flexibility options
- Key attractions categorized by their interests

### 📅 DETAILED ITINERARY
**Format each day as:**
**Day X - [Date] - [Theme/Focus]**
- **Morning (9:00-12:00)**: [Activity] at [Location]
  - Duration: [X hours]
  - Why it fits your profile: [Reason]
  - Pro tip: [Local insight]
- **Lunch (12:00-13:30)**: [Restaurant] - [Cuisine type]
  - Budget: [Price range]
  - Specialty: [Recommended dish]
- **Afternoon (14:00-17:00)**: [Activity] at [Location]
  - Duration: [X hours]
  - Transportation: [Method, time, cost]
- **Evening (18:00-21:00)**: [Activity/Dinner]
  - Experience type: [Cultural/Adventure/Relaxation]
  - Local connection: [Cultural significance]

### 💰 DETAILED BUDGET BREAKDOWN
- **Accommodation**: $X per night × Y nights = $Z
- **Transportation**: Local $X + International $Y = $Z
- **Food**: $X per day × Y days = $Z
- **Activities**: Detailed breakdown by attraction/activity
  - [Activity 1]: $X
  - [Activity 2]: $X
  - [Additional activities]: $X
- **Miscellaneous**: Shopping, tips, emergencies = $Z
- **Total Estimated**: $X (with 10% buffer)
- **Money-saving alternatives**: [Specific suggestions]

### 🎒 PRACTICAL GUIDE
- **Packing essentials**: Based on weather and activities
- **Cultural etiquette**: Do's and don'ts specific to destination
- **Language basics**: Essential phrases with pronunciation
- **Safety considerations**: Current conditions and precautions
- **Local transportation**: Apps, cards, and navigation tips
- **Emergency contacts**: Local services and embassy information

### 🌟 PERSONALIZATION TOUCHES
- **Hidden gems**: Off-the-beaten-path experiences matching your interests
- **Local connections**: Authentic experiences with cultural significance
- **Seasonal specials**: Unique opportunities during your travel dates
- **Future trip seeds**: Related destinations for your next adventure

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
            
            # Parse and structure the response
            parsed_recommendations = self._parse_recommendation_response(recommendation)
            
            result = {
                "user_id": user_id,
                "query": query,
                "recommendation": recommendation,
                "parsed_recommendations": parsed_recommendations,
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
    
    def _parse_recommendation_response(self, recommendation_text: str) -> Dict[str, Any]:
        """
        Parse the OpenAI recommendation response into structured data
        """
        try:
            parsed_data = {
                "summary": "",
                "destination_analysis": "",
                "budget_breakdown": {},
                "practical_guide": {
                    "packing_essentials": [],
                    "cultural_etiquette": [],
                    "language_basics": [],
                    "safety_considerations": [],
                    "local_transportation": [],
                    "emergency_contacts": []
                },
                "personalization_touches": {
                    "hidden_gems": "",
                    "local_connections": "",
                    "seasonal_specials": "",
                    "future_trip_seeds": ""
                }
            }
            
            # Extract summary section
            summary_match = self._extract_section(recommendation_text, r"🎯\s*PERSONALIZED RECOMMENDATION SUMMARY", r"🗺️|###")
            if summary_match:
                parsed_data["summary"] = summary_match.strip()
            
            # Extract destination analysis
            dest_match = self._extract_section(recommendation_text, r"🗺️\s*DESTINATION ANALYSIS", r"📅|###")
            if dest_match:
                parsed_data["destination_analysis"] = dest_match.strip()
            
            # Extract budget breakdown
            budget_match = self._extract_section(recommendation_text, r"💰\s*(?:DETAILED\s+)?BUDGET BREAKDOWN", r"🎒|###")
            if budget_match:
                parsed_data["budget_breakdown"] = self._parse_budget_section(budget_match)
            
            # Extract practical guide sections
            practical_match = self._extract_section(recommendation_text, r"🎒\s*PRACTICAL GUIDE", r"🌟|###")
            if practical_match:
                parsed_data["practical_guide"] = self._parse_practical_guide(practical_match)
            
            # Extract personalization touches
            personal_match = self._extract_section(recommendation_text, r"🌟\s*PERSONALIZATION TOUCHES", r"###|$")
            if personal_match:
                parsed_data["personalization_touches"] = self._parse_personalization_touches(personal_match)
            
            return parsed_data
            
        except Exception as e:
            logger.error(f"Error parsing recommendation response: {e}")
            return {}
    
    def _extract_section(self, text: str, start_pattern: str, end_pattern: str) -> str:
        """Extract a section from text using regex patterns"""
        import re
        start_match = re.search(start_pattern, text, re.IGNORECASE | re.MULTILINE)
        if not start_match:
            return ""
        
        start_pos = start_match.end()
        end_match = re.search(end_pattern, text[start_pos:], re.IGNORECASE | re.MULTILINE)
        
        if end_match:
            return text[start_pos:start_pos + end_match.start()]
        else:
            return text[start_pos:]
    
    def _parse_budget_section(self, budget_text: str) -> Dict[str, Any]:
        """Parse budget breakdown from text"""
        import re
        budget_data = {}
        
        # Extract individual budget items
        patterns = [
            (r"Accommodation[:\-]\s*\$?(\d+)", "accommodation"),
            (r"Food[:\-]\s*\$?(\d+)", "food"),
            (r"Transportation[:\-].*?\$?(\d+)", "transportation"),
            (r"Activities[:\-].*?\$?(\d+)", "activities"),
            (r"Total.*?[:\-]\s*\$?(\d+)", "total_estimated")
        ]
        
        for pattern, key in patterns:
            match = re.search(pattern, budget_text, re.IGNORECASE)
            if match:
                budget_data[key] = int(match.group(1))
        
        # Extract specific activity costs
        activity_matches = re.findall(r"-\s*([^:]+):\s*\$?(\d+)", budget_text)
        for activity, cost in activity_matches:
            clean_activity = activity.strip().lower().replace(" ", "_")
            budget_data[clean_activity] = int(cost)
        
        return budget_data
    
    def _parse_practical_guide(self, practical_text: str) -> Dict[str, List[str]]:
        """Parse practical guide section"""
        import re
        guide_data = {
            "packing_essentials": [],
            "cultural_etiquette": [],
            "language_basics": [],
            "safety_considerations": [],
            "local_transportation": [],
            "emergency_contacts": []
        }
        
        sections = {
            "packing_essentials": r"Packing essentials?[:\-](.*?)(?=Cultural|Language|Safety|Local|Emergency|$)",
            "cultural_etiquette": r"Cultural etiquette[:\-](.*?)(?=Packing|Language|Safety|Local|Emergency|$)",
            "language_basics": r"Language basics?[:\-](.*?)(?=Packing|Cultural|Safety|Local|Emergency|$)",
            "safety_considerations": r"Safety considerations?[:\-](.*?)(?=Packing|Cultural|Language|Local|Emergency|$)",
            "local_transportation": r"Local transportation[:\-](.*?)(?=Packing|Cultural|Language|Safety|Emergency|$)",
            "emergency_contacts": r"Emergency contacts?[:\-](.*?)(?=Packing|Cultural|Language|Safety|Local|$)"
        }
        
        for key, pattern in sections.items():
            match = re.search(pattern, practical_text, re.IGNORECASE | re.DOTALL)
            if match:
                section_text = match.group(1)
                # Extract bullet points
                items = re.findall(r"[-•]\s*(.+)", section_text)
                guide_data[key] = [item.strip() for item in items]
        
        return guide_data
    
    def _parse_personalization_touches(self, personal_text: str) -> Dict[str, str]:
        """Parse personalization touches section"""
        import re
        personal_data = {}
        
        sections = {
            "hidden_gems": r"Hidden gems?[:\-](.*?)(?=Local|Seasonal|Future|$)",
            "local_connections": r"Local connections?[:\-](.*?)(?=Hidden|Seasonal|Future|$)",
            "seasonal_specials": r"Seasonal specials?[:\-](.*?)(?=Hidden|Local|Future|$)",
            "future_trip_seeds": r"Future trip seeds?[:\-](.*?)(?=Hidden|Local|Seasonal|$)"
        }
        
        for key, pattern in sections.items():
            match = re.search(pattern, personal_text, re.IGNORECASE | re.DOTALL)
            if match:
                personal_data[key] = match.group(1).strip()
        
        return personal_data
    
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


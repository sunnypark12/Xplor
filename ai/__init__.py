"""
Xplor AI Travel Agent Package

This package provides an advanced AI-powered travel recommendation system
that combines multiple data sources and machine learning techniques to deliver
personalized travel experiences.

Main Components:
- TravelAgent: OpenAI-powered conversational agent with detailed prompt engineering
- RecommendationEngine: ML-based recommendation system using collaborative and content filtering
- DataLoaders: Integration with Kaggle, HuggingFace, and Firebase data sources
- API: FastAPI endpoints for integration with frontend applications

Example Usage:
    from ai.agents.travel_agent import PersonalizedTravelAgent
    from ai.models.recommendation_engine import TravelRecommendationEngine
    
    agent = PersonalizedTravelAgent()
    recommendations = await agent.get_personalized_recommendation(
        user_id="user123",
        query="Plan a 7-day trip to Japan for cherry blossom season"
    )
"""

__version__ = "1.0.0"
__author__ = "Xplor Team"

from .config.settings import settings
from .agents.travel_agent import PersonalizedTravelAgent
from .models.recommendation_engine import TravelRecommendationEngine
from .data_loaders.kaggle_loader import KaggleDataLoader
from .data_loaders.huggingface_loader import HuggingFaceDataLoader
from .data_loaders.firebase_loader import FirebaseDataLoader
from .utils.data_processor import DataProcessor

__all__ = [
    "settings",
    "PersonalizedTravelAgent", 
    "TravelRecommendationEngine",
    "KaggleDataLoader",
    "HuggingFaceDataLoader", 
    "FirebaseDataLoader",
    "DataProcessor"
]


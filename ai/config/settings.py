"""
Configuration settings for the AI Travel Agent
"""
import os
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

class Settings:
    """Configuration settings for the AI Travel Agent system"""
    
    # OpenAI Configuration
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = "gpt-5-mini-2025-08-07"
    OPENAI_MAX_TOKENS: int = 16384
    OPENAI_TEMPERATURE: float = 0.7
    
    # Firebase Configuration
    FIREBASE_CREDENTIALS_PATH: str = os.getenv("FIREBASE_CREDENTIALS_PATH", "../config/firebase.ts")
    FIREBASE_PROJECT_ID: str = os.getenv("FIREBASE_PROJECT_ID", "")
    
    # Kaggle Configuration
    KAGGLE_USERNAME: str = os.getenv("KAGGLE_USERNAME", "")
    KAGGLE_KEY: str = os.getenv("KAGGLE_KEY", "")
    
    # HuggingFace Configuration
    HF_TOKEN: str = os.getenv("HF_TOKEN", "")
    
    # Data Storage Paths
    DATA_CACHE_DIR: str = "./data_cache"
    MODELS_DIR: str = "./models"
    
    # Dataset Configurations
    KAGGLE_DATASETS: Dict[str, str] = {
        "tourism_spots": "ziya07/tourism-informatization-of-scenic-spots-dataset",
        "tourist_destinations": "cosmox23/popular-tourist-destinations-and-their-features", 
        "traveler_trips": "rkiattisak/traveler-trip-data"
    }
    
    HUGGINGFACE_DATASETS: Dict[str, str] = {
        "travel_planner": "osunlp/TravelPlanner",
        "restaurant_reviews": "deelow/restaurant-reviews",
        "restaurant_cooking": "MongoDB/whatscooking.restaurants"
    }
    
    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_RELOAD: bool = True
    
    # Recommendation Engine Settings
    SIMILARITY_THRESHOLD: float = 0.7
    MAX_RECOMMENDATIONS: int = 10
    DIVERSITY_FACTOR: float = 0.3
    
    @classmethod
    def validate_settings(cls) -> bool:
        """Validate that required settings are present"""
        required_settings = ["OPENAI_API_KEY"]
        missing = [setting for setting in required_settings if not getattr(cls, setting)]
        
        if missing:
            raise ValueError(f"Missing required settings: {', '.join(missing)}")
        return True

# Global settings instance
settings = Settings()


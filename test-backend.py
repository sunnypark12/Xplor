#!/usr/bin/env python3
"""
Simple test script to verify the backend is working
"""
import sys
import os
import asyncio
import json

# Add the ai directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'ai'))

async def test_backend():
    """Test the backend components"""
    print("🧪 Testing Xplor AI Backend Components")
    print("=" * 50)
    
    try:
        # Test settings
        print("1. Testing Settings...")
        from config.settings import settings
        print(f"✅ OpenAI Model: {settings.OPENAI_MODEL}")
        print(f"✅ API Host: {settings.API_HOST}:{settings.API_PORT}")
        print(f"✅ OpenAI API Key: {'Set' if settings.OPENAI_API_KEY else 'Not Set'}")
        
        # Test travel agent import
        print("\n2. Testing Travel Agent...")
        from agents.travel_agent import PersonalizedTravelAgent
        agent = PersonalizedTravelAgent()
        print("✅ Travel Agent initialized successfully")
        
        # Test recommendation engine
        print("\n3. Testing Recommendation Engine...")
        from models.recommendation_engine import TravelRecommendationEngine
        engine = TravelRecommendationEngine()
        print("✅ Recommendation Engine initialized successfully")
        
        # Test API endpoints import
        print("\n4. Testing API Endpoints...")
        from api.endpoints import app
        print("✅ FastAPI app imported successfully")
        
        print("\n🎉 All backend components loaded successfully!")
        print("\nNext steps:")
        print("1. Run: cd ai && python run_server.py")
        print("2. Test API at: http://localhost:8000/docs")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nTroubleshooting:")
        print("1. Make sure you're in the Xplor directory")
        print("2. Install dependencies: cd ai && pip install -r requirements.txt")
        print("3. Check your .env file in the ai directory")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_backend())
    sys.exit(0 if success else 1)

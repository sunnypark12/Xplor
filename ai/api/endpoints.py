"""
FastAPI endpoints for the AI Travel Agent
"""
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional, Any, Tuple
import asyncio
import logging
from datetime import datetime

from config.settings import settings
from agents.travel_agent import PersonalizedTravelAgent
from models.recommendation_engine import TravelRecommendationEngine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Xplor AI Travel Agent",
    description="Advanced AI-powered personalized travel recommendations",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=False,  # Set to False when using allow_origins=["*"]
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Initialize AI components
travel_agent = PersonalizedTravelAgent()
recommendation_engine = TravelRecommendationEngine()

# Pydantic models for request/response
class TravelQuery(BaseModel):
    user_id: str
    query: str
    context: Optional[Dict[str, Any]] = None

class RecommendationRequest(BaseModel):
    user_id: str
    destination_type: Optional[str] = "any"
    budget_min: Optional[int] = 0
    budget_max: Optional[int] = 10000
    travel_dates: Optional[Tuple[str, str]] = None
    preferences: Optional[Dict[str, Any]] = {}
    recommendation_type: Optional[str] = "hybrid"  # content, collaborative, popularity, hybrid
    top_k: Optional[int] = 10

class ItineraryRequest(BaseModel):
    destination: str
    duration: int
    budget: Optional[int] = 2000
    user_id: str
    preferences: Optional[Dict[str, Any]] = {}

class FeedbackRequest(BaseModel):
    user_id: str
    destination_id: str
    rating: float
    feedback: str

class TravelResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    timestamp: str

# API Endpoints

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Xplor AI Travel Agent is running",
        "version": "1.0.0",
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/travel/ask", response_model=TravelResponse)
async def ask_travel_agent(query: TravelQuery):
    """
    Ask the AI travel agent a question and get personalized recommendations
    """
    try:
        logger.info(f"Processing travel query for user {query.user_id}")
        
        result = await travel_agent.get_personalized_recommendation(
            user_id=query.user_id,
            query=query.query,
            context=query.context
        )
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return TravelResponse(
            success=True,
            data=result,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error processing travel query: {e}")
        return TravelResponse(
            success=False,
            error=str(e),
            timestamp=datetime.now().isoformat()
        )

@app.post("/api/recommendations", response_model=TravelResponse)
async def get_recommendations(request: RecommendationRequest):
    """
    Get travel recommendations based on user preferences and constraints
    """
    try:
        logger.info(f"Getting {request.recommendation_type} recommendations for user {request.user_id}")
        
        budget_range = (request.budget_min, request.budget_max)
        
        if request.recommendation_type == "content":
            recommendations = await recommendation_engine.get_content_based_recommendations(
                user_preferences=request.preferences,
                destination_type=request.destination_type,
                top_k=request.top_k
            )
        elif request.recommendation_type == "collaborative":
            recommendations = await recommendation_engine.get_collaborative_recommendations(
                user_id=request.user_id,
                top_k=request.top_k
            )
        elif request.recommendation_type == "popularity":
            recommendations = await recommendation_engine.get_popularity_based_recommendations(
                budget_range=budget_range,
                top_k=request.top_k
            )
        else:  # hybrid
            recommendations = await recommendation_engine.get_hybrid_recommendations(
                user_id=request.user_id,
                user_preferences=request.preferences,
                budget_range=budget_range,
                top_k=request.top_k
            )
        
        return TravelResponse(
            success=True,
            data={
                "recommendations": recommendations,
                "recommendation_type": request.recommendation_type,
                "total_count": len(recommendations)
            },
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error getting recommendations: {e}")
        return TravelResponse(
            success=False,
            error=str(e),
            timestamp=datetime.now().isoformat()
        )

@app.options("/api/itinerary/create")
async def create_itinerary_options():
    """Handle CORS preflight for itinerary creation"""
    return {"message": "OK"}

@app.post("/api/itinerary/create", response_model=TravelResponse)
async def create_itinerary(request: ItineraryRequest):
    """
    Create a detailed travel itinerary for a specific destination
    """
    try:
        logger.info(f"Creating itinerary for {request.destination}, {request.duration} days, budget: {request.budget}")
        logger.info(f"Request data: {request.dict()}")
        
        itinerary = await travel_agent.create_detailed_itinerary(
            destination=request.destination,
            duration=request.duration,
            preferences=request.preferences,
            budget=request.budget or 2000
        )
        
        if "error" in itinerary:
            raise HTTPException(status_code=500, detail=itinerary["error"])
        
        return TravelResponse(
            success=True,
            data=itinerary,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error creating itinerary: {e}")
        return TravelResponse(
            success=False,
            error=str(e),
            timestamp=datetime.now().isoformat()
        )

@app.post("/api/feedback", response_model=TravelResponse)
async def submit_feedback(feedback: FeedbackRequest):
    """
    Submit user feedback for recommendation improvement
    """
    try:
        logger.info(f"Processing feedback from user {feedback.user_id}")
        
        success = await recommendation_engine.update_user_feedback(
            user_id=feedback.user_id,
            destination_id=feedback.destination_id,
            rating=feedback.rating,
            feedback=feedback.feedback
        )
        
        return TravelResponse(
            success=success,
            data={"message": "Feedback submitted successfully"} if success else None,
            error="Failed to submit feedback" if not success else None,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error submitting feedback: {e}")
        return TravelResponse(
            success=False,
            error=str(e),
            timestamp=datetime.now().isoformat()
        )

@app.get("/api/destinations/popular", response_model=TravelResponse)
async def get_popular_destinations():
    """
    Get popular destinations based on user data
    """
    try:
        recommendations = await recommendation_engine.get_popularity_based_recommendations(
            budget_range=(0, 10000),
            top_k=20
        )
        
        return TravelResponse(
            success=True,
            data={
                "popular_destinations": recommendations,
                "total_count": len(recommendations)
            },
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error getting popular destinations: {e}")
        return TravelResponse(
            success=False,
            error=str(e),
            timestamp=datetime.now().isoformat()
        )

@app.get("/api/user/{user_id}/recommendations", response_model=TravelResponse)
async def get_user_recommendations(user_id: str, top_k: int = 10):
    """
    Get personalized recommendations for a specific user
    """
    try:
        recommendations = await recommendation_engine.get_hybrid_recommendations(
            user_id=user_id,
            user_preferences={},  # Will be loaded from Firebase
            budget_range=(0, 10000),
            top_k=top_k
        )
        
        return TravelResponse(
            success=True,
            data={
                "user_id": user_id,
                "recommendations": recommendations,
                "total_count": len(recommendations)
            },
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error getting user recommendations: {e}")
        return TravelResponse(
            success=False,
            error=str(e),
            timestamp=datetime.now().isoformat()
        )

@app.get("/api/datasets/status", response_model=TravelResponse)
async def get_datasets_status():
    """
    Get status of loaded datasets
    """
    try:
        # Get dataset information
        kaggle_data = travel_agent.kaggle_loader.load_all_datasets()
        hf_data = travel_agent.hf_loader.load_all_datasets()
        
        status = {
            "kaggle_datasets": {
                name: {"loaded": not df.empty, "records": len(df) if not df.empty else 0}
                for name, df in kaggle_data.items()
            },
            "huggingface_datasets": {
                name: {"loaded": not df.empty, "records": len(df) if not df.empty else 0}
                for name, df in hf_data.items()
            },
            "recommendation_engine_status": "initialized",
            "total_datasets_loaded": len([df for df in kaggle_data.values() if not df.empty]) + 
                                   len([df for df in hf_data.values() if not df.empty])
        }
        
        return TravelResponse(
            success=True,
            data=status,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error getting datasets status: {e}")
        return TravelResponse(
            success=False,
            error=str(e),
            timestamp=datetime.now().isoformat()
        )

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize components on startup"""
    logger.info("Starting Xplor AI Travel Agent API...")
    
    # Validate settings
    try:
        settings.validate_settings()
        logger.info("Settings validated successfully")
    except ValueError as e:
        logger.error(f"Settings validation failed: {e}")
        raise

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down Xplor AI Travel Agent API...")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "endpoints:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.API_RELOAD
    )


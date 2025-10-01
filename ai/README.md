# Xplor AI Travel Agent 🌍✈️

Advanced AI-powered travel recommendation system that combines multiple data sources and machine learning techniques to deliver personalized travel experiences.

## 🎯 Features

### 🤖 AI-Powered Travel Agent
- **OpenAI GPT-4o-mini Integration**: Sophisticated conversational AI with detailed prompt engineering
- **Personalized Recommendations**: Tailored suggestions based on user preferences and travel history
- **Comprehensive Itinerary Planning**: Complete day-by-day travel plans with activities, dining, and logistics
- **Multi-Modal Recommendations**: Destinations, accommodations, restaurants, and activities

### 📊 Data Sources
- **Kaggle Datasets**: 
  - Tourism informatization of scenic spots
  - Popular tourist destinations and features
  - Traveler trip data and patterns
- **HuggingFace Datasets**:
  - TravelPlanner comprehensive travel data
  - Restaurant reviews and ratings
  - MongoDB restaurant and cuisine data
- **Firebase Integration**: Real-time user data, travel history, and preferences

### 🧠 Machine Learning Engine
- **Hybrid Recommendation System**: Combines content-based, collaborative filtering, and popularity-based algorithms
- **Similarity Matching**: Advanced algorithms for user and destination matching
- **Continuous Learning**: Feedback integration for model improvement
- **Real-time Processing**: Fast recommendations using cached data and pre-computed similarities

## 🏗️ Architecture

```
ai/
├── agents/               # AI conversation agents
│   └── travel_agent.py  # Main OpenAI-powered travel agent
├── models/              # Machine learning models
│   └── recommendation_engine.py
├── data_loaders/        # Data integration modules
│   ├── kaggle_loader.py
│   ├── huggingface_loader.py
│   └── firebase_loader.py
├── api/                 # FastAPI endpoints
│   └── endpoints.py
├── config/              # Configuration management
│   └── settings.py
├── utils/              # Utility functions
│   └── data_processor.py
└── requirements.txt    # Python dependencies
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd ai
pip install -r requirements.txt
```

### 2. Environment Setup
Copy `env_example.txt` to `.env` and configure:
```bash
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional (for enhanced features)
FIREBASE_CREDENTIALS_PATH=../config/firebase-credentials.json
KAGGLE_USERNAME=your_kaggle_username
KAGGLE_KEY=your_kaggle_api_key
HF_TOKEN=your_huggingface_token
```

### 3. Run the API Server
```bash
python run_server.py
```

The API will be available at:
- **Server**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Interactive API**: http://localhost:8000/redoc

## 📡 API Endpoints

### Core Travel Agent
- `POST /api/travel/ask` - Ask the AI travel agent any travel question
- `POST /api/recommendations` - Get ML-powered destination recommendations
- `POST /api/itinerary/create` - Create detailed travel itineraries

### User Personalization
- `GET /api/user/{user_id}/recommendations` - Get personalized user recommendations
- `POST /api/feedback` - Submit feedback for recommendation improvement

### Data & Analytics
- `GET /api/destinations/popular` - Get popular destinations
- `GET /api/datasets/status` - Check data loading status

## 🎨 Prompt Engineering Details

### System Prompt Architecture
The AI agent uses a sophisticated multi-layered prompt system:

#### 1. **Core Identity & Expertise**
```
You are an expert AI Travel Agent named "Xplor AI" with access to comprehensive global travel data...
```

#### 2. **Data Source Awareness**
- Tourism spots database with 50,000+ locations
- Restaurant database with millions of reviews
- Real-time user preference analysis
- Historical travel pattern recognition

#### 3. **Personalization Framework**
- **User Analysis**: Travel personality assessment, experience level evaluation
- **Destination Matching**: Compatibility scoring, seasonal optimization
- **Experience Design**: Themed itineraries, local authentic experiences

#### 4. **Response Structure**
- 🎯 Personalized Recommendation Summary
- 🗺️ Destination Analysis  
- 📅 Detailed Itinerary
- 💰 Budget Breakdown
- 🎒 Practical Guide
- 🌟 Personalization Touches

#### 5. **Advanced Features**
- **Context Awareness**: References user's specific travel history
- **Cultural Sensitivity**: Respects local customs and traditions
- **Sustainability Focus**: Promotes responsible tourism
- **Real-time Adaptation**: Adjusts based on seasonal factors and current events

### Example Prompts

#### Basic Travel Query
```json
{
  "user_id": "user123",
  "query": "Plan a 7-day trip to Japan during cherry blossom season",
  "context": {
    "budget": 3000,
    "interests": ["culture", "food", "photography"],
    "travel_style": "balanced"
  }
}
```

#### Personalized Recommendation
```json
{
  "user_id": "user123", 
  "recommendation_type": "hybrid",
  "budget_min": 2000,
  "budget_max": 5000,
  "preferences": {
    "interests": ["adventure", "nature"],
    "accommodation": "mid-range",
    "travel_style": "active"
  }
}
```

## 🔧 Integration with Frontend

### React Integration Example
```typescript
// In your React component
const getTravelRecommendation = async (query: string) => {
  const response = await fetch('http://localhost:8000/api/travel/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: currentUser.id,
      query: query,
      context: userPreferences
    })
  });
  
  const result = await response.json();
  return result.data.recommendation;
};
```

### Firebase Integration
The system automatically pulls user data from your existing Firebase setup:
- User travel preferences from `users` collection
- Travel history from `trips` collection  
- Reviews and ratings from `reviews` collection

## 🎯 Advanced Features

### Machine Learning Capabilities
- **Collaborative Filtering**: "Users like you also enjoyed..."
- **Content-Based Filtering**: Match destinations to preferences
- **Popularity-Based**: Trending destinations and seasonal recommendations
- **Hybrid Approach**: Combines all methods for optimal results

### Data Processing Pipeline
- **Real-time Updates**: Continuous integration of new user data
- **Data Quality Validation**: Automated data cleaning and validation
- **Feature Engineering**: Advanced text processing and similarity calculation
- **Caching Strategy**: Optimized for fast response times

### Scalability Features
- **Async Processing**: Non-blocking data loading and processing
- **Modular Architecture**: Easy to extend with new data sources
- **Error Handling**: Graceful degradation when data sources are unavailable
- **Monitoring**: Built-in logging and performance metrics

## 🔒 Security & Privacy

- **Data Protection**: User data is processed securely and not stored in AI models
- **API Key Management**: Secure handling of external API keys
- **Rate Limiting**: Built-in protection against API abuse
- **Error Sanitization**: No sensitive data exposed in error messages

## 🚧 Development & Customization

### Adding New Data Sources
1. Create a new loader in `data_loaders/`
2. Implement the standard loading interface
3. Update the recommendation engine to use new data
4. Add API endpoints if needed

### Customizing Prompts
The main system prompt is in `agents/travel_agent.py` in the `_build_system_prompt()` method. You can customize:
- Agent personality and tone
- Response structure and format
- Domain expertise and knowledge areas
- Personalization factors

### Extending ML Models
Add new recommendation algorithms in `models/recommendation_engine.py`:
1. Implement new similarity calculation methods
2. Add new feature engineering techniques
3. Create ensemble methods for better accuracy
4. Integrate external ML services

## 📈 Performance Monitoring

### Built-in Metrics
- Response times for different query types
- Data loading and processing times
- Recommendation accuracy scores
- User engagement and feedback rates

### Optimization Tips
- Pre-compute similarity matrices for faster recommendations
- Use caching for frequently requested destinations
- Batch process user data updates
- Monitor API rate limits for external services

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add comprehensive tests
4. Update documentation
5. Submit a pull request

## 📄 License

This project is part of the Xplor travel planning application.

---

**Ready to transform travel planning with AI? 🌟**

Start the server and visit the API docs to explore all the powerful features available!


# Xplor - AI-Powered Travel Planning Platform

Xplor is an intelligent travel planning platform that combines advanced AI with comprehensive travel data to create personalized, adaptive itineraries. The platform features a React frontend with a Python FastAPI backend powered by OpenAI's GPT models.

## 🌟 Features

### Frontend Features
- **Interactive Date Range Picker**: Drag and tap to select travel dates with intuitive calendar interface
- **Personalized Travel Profiles**: Quiz-based system to understand user preferences
- **Real-time Itinerary Display**: Beautiful, user-friendly itinerary presentation with tabs for different views
- **AI Recommendations**: Dedicated section showing AI-generated travel insights and tips
- **Budget Breakdown**: Visual budget analysis with category-wise spending
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Backend Features
- **Advanced AI Prompt Engineering**: Sophisticated prompts for personalized travel recommendations
- **Multi-Dataset Integration**: Combines Kaggle, HuggingFace, and Firebase data sources
- **Recommendation Engine**: Hybrid system using content-based, collaborative, and popularity-based filtering
- **Real-time API**: FastAPI backend with comprehensive endpoints
- **Data Processing**: Intelligent parsing of AI responses into structured itinerary data

### AI Capabilities
- **Personalized Recommendations**: Based on user travel profile and preferences
- **Comprehensive Itinerary Planning**: Day-by-day detailed planning with timing and logistics
- **Budget Optimization**: Smart budget allocation and money-saving suggestions
- **Cultural Intelligence**: Local customs, etiquette, and cultural insights
- **Real-time Adaptation**: Dynamic itinerary adjustments based on user location and pace

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- OpenAI API key
- Firebase project (optional)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Xplor
```

### 2. Start the Backend
```bash
./start-backend.sh
```

This script will:
- Create a Python virtual environment
- Install all dependencies
- Set up environment variables
- Start the AI backend server on http://localhost:8000

### 3. Start the Frontend
```bash
./start-frontend.sh
```

This script will:
- Install Node.js dependencies
- Set up environment configuration
- Start the React development server on http://localhost:3000

### 4. Configure API Keys

Edit `ai/.env` file with your API keys:
```env
OPENAI_API_KEY=your_openai_api_key_here
FIREBASE_PROJECT_ID=your_firebase_project_id
KAGGLE_USERNAME=your_kaggle_username
KAGGLE_KEY=your_kaggle_api_key
HF_TOKEN=your_huggingface_token
```

## 📁 Project Structure

```
Xplor/
├── ai/                          # Python Backend
│   ├── agents/                  # AI Travel Agent
│   │   └── travel_agent.py     # Main AI agent with prompt engineering
│   ├── api/                     # FastAPI endpoints
│   │   └── endpoints.py        # API routes and handlers
│   ├── config/                  # Configuration
│   │   └── settings.py         # Settings and environment variables
│   ├── data_loaders/           # Data integration
│   │   ├── kaggle_loader.py    # Kaggle dataset integration
│   │   ├── huggingface_loader.py # HuggingFace dataset integration
│   │   └── firebase_loader.py  # Firebase integration
│   ├── models/                  # ML models
│   │   └── recommendation_engine.py # Recommendation algorithms
│   └── run_server.py           # Server startup script
├── src/                        # React Frontend
│   ├── components/             # React components
│   │   ├── common/            # Reusable components
│   │   │   ├── DateRangePicker.tsx # Enhanced calendar component
│   │   │   ├── Button.tsx     # Button component
│   │   │   └── Input.tsx      # Input component
│   │   └── layout/            # Layout components
│   ├── contexts/              # React contexts
│   │   ├── AuthContext.tsx    # Authentication context
│   │   └── TravelContext.tsx  # Travel data context with AI integration
│   ├── pages/                 # Page components
│   │   ├── TripPlanning.tsx   # Trip planning with enhanced calendar
│   │   ├── Itinerary.tsx      # Enhanced itinerary display
│   │   └── ...               # Other pages
│   ├── services/              # API services
│   │   └── api.ts            # API service with backend integration
│   └── types/                 # TypeScript types
│       └── index.ts          # Type definitions
├── start-backend.sh           # Backend startup script
├── start-frontend.sh          # Frontend startup script
└── README.md                  # This file
```

## 🎯 Key Improvements Made

### 1. Enhanced Calendar Component
- **Drag and Tap Selection**: Users can drag across dates or tap to select date ranges
- **Visual Feedback**: Hover states, range highlighting, and intuitive interactions
- **Quick Actions**: Preset options for common date ranges
- **Mobile Friendly**: Touch-optimized for mobile devices

### 2. AI Integration and Prompt Engineering
- **Sophisticated Prompts**: Comprehensive system prompts for personalized recommendations
- **Structured Responses**: AI responses formatted with clear sections and actionable information
- **Data Integration**: AI has access to multiple travel datasets for informed recommendations
- **Personalization**: Recommendations based on user travel profiles and preferences

### 3. Enhanced Itinerary Display
- **Tabbed Interface**: Separate tabs for itinerary, AI recommendations, and budget
- **AI Recommendations Section**: Dedicated display for AI insights and tips
- **Budget Visualization**: Visual budget breakdown with category analysis
- **Interactive Elements**: Expandable sections and detailed information display

### 4. Backend Architecture
- **FastAPI Integration**: Modern, fast API with automatic documentation
- **Multi-Dataset Support**: Integration with Kaggle, HuggingFace, and Firebase
- **Recommendation Engine**: Hybrid recommendation system with multiple algorithms
- **Error Handling**: Comprehensive error handling and logging

### 5. Frontend-Backend Connection
- **API Service Layer**: Centralized API communication with error handling
- **Real-time Updates**: Live integration between frontend and AI backend
- **Data Parsing**: Intelligent parsing of AI responses into structured data
- **Loading States**: User-friendly loading indicators and error messages

## 🔧 API Endpoints

### Travel Agent Endpoints
- `POST /api/travel/ask` - Get personalized travel recommendations
- `POST /api/itinerary/create` - Create detailed itinerary
- `POST /api/recommendations` - Get destination recommendations
- `GET /api/destinations/popular` - Get popular destinations
- `POST /api/feedback` - Submit user feedback

### Health and Status
- `GET /` - Health check
- `GET /api/datasets/status` - Check dataset loading status

## 🎨 UI/UX Features

### Calendar Component
- Intuitive drag-to-select functionality
- Visual range highlighting
- Quick preset options (Today, Next 7 days)
- Mobile-optimized touch interactions

### Itinerary Display
- Clean, organized daily breakdown
- Activity categorization with color coding
- Time-based scheduling with duration estimates
- Progress tracking for active trips

### AI Recommendations
- Structured display of AI insights
- Expandable detailed responses
- Personalized tips and suggestions
- Cultural and practical guidance

## 🧪 Testing

### Backend Testing
```bash
cd ai
python -m pytest tests/
```

### Frontend Testing
```bash
npm test
```

### Integration Testing
1. Start both backend and frontend servers
2. Navigate to http://localhost:3000
3. Complete the travel profile quiz
4. Create a new trip with the enhanced calendar
5. View the generated itinerary with AI recommendations

## 🚀 Deployment

### Backend Deployment
- Configure environment variables for production
- Use a production WSGI server like Gunicorn
- Set up proper database connections
- Configure CORS for your domain

### Frontend Deployment
- Build the React app: `npm run build`
- Deploy to your preferred hosting service
- Update API_URL environment variable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console logs for error messages
2. Ensure all API keys are properly configured
3. Verify that both servers are running
4. Check the API documentation at http://localhost:8000/docs

For additional support, please create an issue in the repository.

---

**Happy Traveling with Xplor! 🌍✈️**
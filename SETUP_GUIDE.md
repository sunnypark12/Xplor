# Xplor Setup Guide

## Quick Start (Recommended)

### 1. Start the Backend Server

```bash
# Navigate to the project directory
cd /Users/sunho/Documents/Xplor

# Make the startup script executable (if not already done)
chmod +x start-backend.sh

# Start the backend server
./start-backend.sh
```

The script will:
- Create a Python virtual environment
- Install all required dependencies
- Set up environment variables
- Start the AI backend server on http://localhost:8000

### 2. Start the Frontend Server

Open a new terminal window:

```bash
# Navigate to the project directory
cd /Users/sunho/Documents/Xplor

# Make the startup script executable (if not already done)
chmod +x start-frontend.sh

# Start the frontend server
./start-frontend.sh
```

The script will:
- Install Node.js dependencies
- Set up environment configuration
- Start the React development server on http://localhost:3000

### 3. Test the Application

1. Open your browser and go to http://localhost:3000
2. Complete the travel profile quiz if you haven't already
3. On the Home page, fill out the trip planning form:
   - Enter a destination (e.g., "Tokyo, Japan")
   - Select travel dates using the date range picker (drag or click to select)
   - Choose group size and occasion
   - Enter a budget (optional)
4. Click "Generate my plan"
5. You should be redirected to the Itinerary page with AI-generated recommendations

## Manual Setup (Alternative)

### Backend Setup

```bash
cd ai

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate     # On Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file with your API keys
cp env_example.txt .env
# Edit .env file with your actual API keys

# Start the server
python run_server.py
```

### Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
echo "REACT_APP_API_URL=http://localhost:8000" > .env.local

# Start development server
npm start
```

## Environment Configuration

### Backend (.env file in ai/ directory)

```env
OPENAI_API_KEY=your_openai_api_key_here
FIREBASE_PROJECT_ID=xplor-8f55e
KAGGLE_USERNAME=your_kaggle_username
KAGGLE_KEY=your_kaggle_api_key
HF_TOKEN=your_huggingface_token
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=true
```

### Frontend (.env.local file in root directory)

```env
REACT_APP_API_URL=http://localhost:8000
```

## Testing the Integration

### 1. Backend Health Check

Visit http://localhost:8000 in your browser. You should see:
```json
{
  "message": "Xplor AI Travel Agent is running",
  "version": "1.0.0",
  "status": "healthy",
  "timestamp": "2024-..."
}
```

### 2. API Documentation

Visit http://localhost:8000/docs to see the interactive API documentation.

### 3. Test API Endpoints

You can test the API endpoints directly:

```bash
# Test health endpoint
curl http://localhost:8000/

# Test itinerary creation
curl -X POST "http://localhost:8000/api/itinerary/create" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Tokyo, Japan",
    "duration": 7,
    "budget": 2500,
    "user_id": "test-user",
    "preferences": {
      "interests": ["culture", "food"]
    }
  }'
```

### 4. Frontend Testing

1. **Date Range Selection**: Test the enhanced calendar by dragging across dates or clicking to select a range
2. **Form Validation**: Try submitting without filling required fields
3. **Trip Creation**: Fill out the complete form and test the "Generate my plan" button
4. **Itinerary Display**: Check if the AI-generated itinerary displays correctly with tabs for different sections

## Troubleshooting

### Backend Issues

**Error: "No module named 'dotenv'"**
```bash
cd ai
pip install python-dotenv
```

**Error: "OpenAI API key not found"**
- Make sure you have a `.env` file in the `ai/` directory
- Check that your OpenAI API key is correctly set in the `.env` file

**Error: "Port 8000 already in use"**
```bash
# Find and kill the process using port 8000
lsof -ti:8000 | xargs kill -9
```

### Frontend Issues

**Error: "Module not found"**
```bash
npm install
```

**Error: "Cannot connect to backend"**
- Make sure the backend server is running on http://localhost:8000
- Check that REACT_APP_API_URL is set correctly in .env.local

**Calendar not working**
- The DateRangePicker component should allow drag and tap selection
- Make sure date-fns is installed: `npm install date-fns`

### Integration Issues

**Button doesn't work**
- Check browser console for JavaScript errors
- Verify that the user is logged in
- Make sure both frontend and backend servers are running

**No AI response**
- Check backend logs for OpenAI API errors
- Verify your OpenAI API key has sufficient credits
- Check the API model name is correct (gpt-4o-mini)

## Features Implemented

### ✅ Enhanced Calendar
- Drag and tap date range selection
- Visual feedback and hover states
- Quick action buttons (Today, Next 7 days)
- Mobile-optimized interactions

### ✅ AI Integration
- Sophisticated prompt engineering
- Personalized recommendations based on user profiles
- Comprehensive itinerary generation
- Budget analysis and tips

### ✅ Frontend-Backend Connection
- Real-time API communication
- Proper error handling and loading states
- Structured data parsing from AI responses
- User-friendly feedback and notifications

### ✅ Enhanced UI/UX
- Tabbed itinerary display (Daily, AI Recommendations, Budget)
- Glass morphism design consistency
- Responsive layout for all devices
- Interactive elements and animations

## Next Steps

1. **Test the complete flow**: Home → Trip Planning → Itinerary
2. **Customize AI responses**: Modify prompts in `ai/agents/travel_agent.py`
3. **Add more datasets**: Integrate additional travel data sources
4. **Enhance UI**: Customize the glass card designs and animations
5. **Deploy**: Set up production deployment for both frontend and backend

## Support

If you encounter any issues:
1. Check the console logs (both browser and terminal)
2. Verify all environment variables are set correctly
3. Ensure both servers are running simultaneously
4. Test API endpoints individually using the documentation at http://localhost:8000/docs

# Xplor - Smart Travel Planning & Itinerary Agent

> **Personalized, adaptive travel itinerary app that evolves with the traveler in real-time**

Xplor is an intelligent travel assistant that makes planning seamless, adapts in real-time, and personalizes experiences based on each traveler's style. No more static itineraries - your travel plans evolve with you as your trip unfolds!

## Features

### V1 (MVP) Features
- **Account Creation & Authentication** - Secure user registration with Firebase Auth
- **Personality-Style Travel Quiz** - Understand traveler preferences and create personalized profiles
- **Trip Input & Details Collection** - Comprehensive trip planning with destinations, dates, and constraints
- **Personalized Itinerary Generator** - AI-powered itinerary creation based on user profiles
- **Real-Time Adaptive Itinerary** - Location tracking and automatic schedule adjustments

### V2 (Future) Features
- **Community Itinerary Sharing** - Share and discover travel plans from other users
- **Quest & Rewards System** - Gamified travel with badges and achievements
- **Contextual Outfit Suggestions** - Weather and activity-based packing recommendations

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project (for authentication and database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Xplor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.local.example .env.local
   
   # Edit .env.local with your Firebase configuration
   ```

4. **Configure Firebase**
   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Copy your Firebase config values to `.env.local`

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Open your browser**
   Navigate to http://localhost:3000

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (Button, Input, etc.)
│   └── layout/          # Layout components (Navbar, Sidebar)
├── contexts/            # React Context providers
│   ├── AuthContext.tsx  # Authentication state management
│   └── TravelContext.tsx # Travel data and itinerary management
├── pages/               # Main application pages
│   ├── auth/           # Authentication pages (Login, Register)
│   ├── Dashboard.tsx   # User dashboard
│   ├── Quiz.tsx        # Travel personality quiz
│   ├── TripPlanning.tsx # Trip input and planning
│   ├── Itinerary.tsx   # Itinerary display and management
│   └── Profile.tsx     # User profile and settings
├── types/              # TypeScript type definitions
├── config/             # Configuration files (Firebase, etc.)
└── App.tsx             # Main application component
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

# API Keys (for future integrations)
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
REACT_APP_WEATHER_API_KEY=your_weather_api_key
```

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Custom CSS with CSS Variables (Design System)
- **Routing**: React Router v6
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **State Management**: React Context API
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## User Flow

1. **Landing Page** - Introduction to Xplor's features and benefits
2. **Authentication** - Sign up or sign in to access the platform
3. **Travel Quiz** - Complete personality assessment for personalized recommendations
4. **Dashboard** - Overview of trips, statistics, and quick actions
5. **Trip Planning** - Input destination, dates, and travel preferences
6. **Itinerary Generation** - AI-powered creation of personalized daily plans
7. **Real-Time Adaptation** - Location tracking and automatic schedule adjustments

## Firebase Setup

### Authentication Setup
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable Email/Password authentication
3. (Optional) Configure additional providers (Google, etc.)

### Firestore Setup
1. Go to Firebase Console → Firestore Database
2. Create database in production mode
3. Set up security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Itineraries can only be accessed by the owner
    match /itineraries/{itineraryId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Deploy
firebase deploy
```

## 🧪 Development

### Available Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Custom CSS with BEM-like naming conventions
- Responsive design mobile-first approach

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Contact the development team

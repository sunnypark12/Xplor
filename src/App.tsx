import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { TravelProvider } from './contexts/TravelContext';
import { useAuth } from './contexts/AuthContext';

// Import pages
import Landing from './pages/Landing';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import TripPlanning from './pages/TripPlanning';
import PlannedTrip from './pages/PlannedTrip';
import Itinerary from './pages/Itinerary';
import HowItWorks from './pages/HowItWorks';

// Layout component
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

// Smart Route component that redirects based on user state
const SmartRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/" />;
  }
  
  // Debug: Log user state
  console.log('SmartRoute - User:', user);
  console.log('SmartRoute - Travel Profile:', user.travelProfile);
  
  // If user doesn't have travel profile (null, undefined, or empty), redirect to quiz
  const hasCompletedProfile = user.travelProfile && 
    typeof user.travelProfile === 'object' && 
    Object.keys(user.travelProfile).length > 0;
    
  if (!hasCompletedProfile) {
    console.log('SmartRoute - Redirecting to quiz');
    return <Navigate to="/quiz" replace />;
  }
  
  console.log('SmartRoute - Allowing access to protected route');
  return <>{children}</>;
};

// Public Route component (redirect to appropriate page if logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (user) {
    // Debug: Log user state
    console.log('PublicRoute - User logged in:', user);
    console.log('PublicRoute - Travel Profile:', user.travelProfile);
    
    // Check if user has completed travel profile
    const hasCompletedProfile = user.travelProfile && 
      typeof user.travelProfile === 'object' && 
      Object.keys(user.travelProfile).length > 0;
    
    if (!hasCompletedProfile) {
      console.log('PublicRoute - No travel profile, redirecting to quiz');
      return <Navigate to="/quiz" replace />;
    } else {
      console.log('PublicRoute - Has travel profile, redirecting to dashboard');
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  console.log('PublicRoute - User not logged in, showing public content');
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
        <Route path="/how-it-works" element={<PublicRoute><HowItWorks /></PublicRoute>} />
        
        {/* Protected Routes */}
        <Route path="/home" element={
          <SmartRoute>
            <Home />
          </SmartRoute>
        } />
        
        <Route path="/dashboard" element={
          <SmartRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </SmartRoute>
        } />
        
        <Route path="/quiz" element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        } />
        
        {/* Test route to check if Quiz loads */}
        <Route path="/test-quiz" element={<Quiz />} />
        
        {/* Test route for PlannedTrip */}
        <Route path="/test-planned-trip" element={
          <Layout>
            <PlannedTrip />
          </Layout>
        } />
        
        <Route path="/plan-trip" element={
          <SmartRoute>
            <Layout>
              <TripPlanning />
            </Layout>
          </SmartRoute>
        } />
        
        <Route path="/itinerary/:id" element={
          <SmartRoute>
            <Layout>
              <Itinerary />
            </Layout>
          </SmartRoute>
        } />
        
        <Route path="/itinerary/current" element={
          <SmartRoute>
            <Layout>
              <TripPlanning />
            </Layout>
          </SmartRoute>
        } />
        
        <Route path="/planned-trip" element={
          <SmartRoute>
            <Layout>
              <PlannedTrip />
            </Layout>
          </SmartRoute>
        } />
        
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <TravelProvider>
        <div className="App">
          <AppRoutes />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </TravelProvider>
    </AuthProvider>
  );
}

export default App;

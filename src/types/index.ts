// User Types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  travelProfile?: TravelProfile;
}

// Travel Profile from Quiz
export interface TravelProfile {
  adventureLevel: 'low' | 'medium' | 'high'; // Adventure vs. relaxation
  explorationStyle: 'foodie' | 'cultural' | 'nature' | 'mixed'; // Primary interest
  budgetLevel: 'budget' | 'moderate' | 'luxury'; // Budget preference
  pacePreference: 'slow' | 'moderate' | 'fast'; // Travel pace
  groupDynamic: 'solo' | 'couple' | 'family' | 'friends'; // Group type
  travelerType?: string; // New personality type
  quizResponses?: QuizResponse[]; // Store quiz responses
  createdAt: Date;
}

// Trip Planning Types
export interface TripInput {
  destination: string;
  startDate: Date;
  endDate: Date;
  travelers: number;
  specialInterests: string[];
  constraints: TripConstraint[];
  budget?: number;
  accommodation?: string;
  occasion?: string;
}

export interface TripConstraint {
  type: 'mobility' | 'dietary' | 'time' | 'other';
  description: string;
}

// AI Recommendation Types
export interface BudgetBreakdown {
  [key: string]: number;
}

export interface ParsedRecommendations {
  summary: string;
  destination_analysis: string;
  budget_breakdown: BudgetBreakdown;
  practical_guide: {
    packing_essentials: string[];
    cultural_etiquette: string[];
    language_basics: string[];
    safety_considerations: string[];
    local_transportation: string[];
    emergency_contacts: string[];
  };
  personalization_touches: {
    hidden_gems: string;
    local_connections: string;
    seasonal_specials: string;
    future_trip_seeds: string;
  };
}

// Itinerary Types
export interface Itinerary {
  id: string;
  userId: string;
  tripInput: TripInput;
  days: ItineraryDay[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  aiResponse?: string; // Raw AI response
  parsedData?: any; // Legacy parsed AI data
  parsedRecommendations?: ParsedRecommendations; // New structured recommendations
}

export interface ItineraryDay {
  date: Date;
  activities: Activity[];
  meals: Meal[];
  transportation: Transportation[];
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  location: Location;
  startTime: Date;
  endTime: Date;
  estimatedDuration: number; // in minutes
  category: 'sightseeing' | 'adventure' | 'cultural' | 'relaxation' | 'shopping' | 'other';
  priority: 'low' | 'medium' | 'high';
  isCompleted?: boolean;
  actualStartTime?: Date;
  actualEndTime?: Date;
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  location: Location;
  scheduledTime: Date;
  estimatedDuration: number;
  cuisine?: string;
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  isCompleted?: boolean;
}

export interface Transportation {
  id: string;
  from: Location;
  to: Location;
  mode: 'walking' | 'driving' | 'transit' | 'taxi' | 'other';
  departureTime: Date;
  arrivalTime: Date;
  estimatedDuration: number;
  actualDuration?: number;
}

export interface Location {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  placeId?: string; // Google Places ID
}

// Real-time Tracking
export interface UserLocation {
  coordinates: {
    lat: number;
    lng: number;
  };
  timestamp: Date;
  accuracy?: number;
}

export interface ItineraryUpdate {
  type: 'delay' | 'skip' | 'extend' | 'weather' | 'traffic';
  affectedActivityId: string;
  newStartTime?: Date;
  newEndTime?: Date;
  reason: string;
  timestamp: Date;
}

// Quiz Types
export interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'scale' | 'ranking';
  options: QuizOption[];
  category: string;
  backgroundImage?: string;
}

export interface QuizOption {
  id: string;
  text: string;
  value: string | number;
  image?: string;
  personalities?: string[];
}

export interface QuizResponse {
  questionId: string;
  selectedOptions: string[];
  scaleValue?: number;
  ranking?: string[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Context Types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

export interface TravelContextType {
  currentItinerary: Itinerary | null;
  travelProfile: TravelProfile | null;
  userLocation: UserLocation | null;
  loading: boolean;
  createItinerary: (tripInput: TripInput) => Promise<void>;
  updateItinerary: (update: ItineraryUpdate) => Promise<void>;
  saveTravelProfile: (profile: TravelProfile) => Promise<void>;
  updateUserLocation: (location: UserLocation) => void;
}

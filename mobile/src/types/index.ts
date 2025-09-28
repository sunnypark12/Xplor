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
  adventureLevel: 'low' | 'medium' | 'high';
  explorationStyle: 'foodie' | 'cultural' | 'nature' | 'mixed';
  budgetLevel: 'budget' | 'moderate' | 'luxury';
  pacePreference: 'slow' | 'moderate' | 'fast';
  groupDynamic: 'solo' | 'couple' | 'family' | 'friends';
  personality?: string;
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
}

export interface TripConstraint {
  type: 'mobility' | 'dietary' | 'time' | 'other';
  description: string;
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
  estimatedDuration: number;
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
  placeId?: string;
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

// Context Types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
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



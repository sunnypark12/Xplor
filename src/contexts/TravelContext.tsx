import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { doc, setDoc, getDoc, updateDoc, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Itinerary, TravelProfile, UserLocation, TripInput, ItineraryUpdate, TravelContextType } from '../types';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const TravelContext = createContext<TravelContextType | undefined>(undefined);

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (context === undefined) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
};

interface TravelProviderProps {
  children: ReactNode;
}

export const TravelProvider: React.FC<TravelProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [currentItinerary, setCurrentItinerary] = useState<Itinerary | null>(null);
  const [travelProfile, setTravelProfile] = useState<TravelProfile | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(false);

  // Load user's travel profile
  useEffect(() => {
    if (user) {
      loadTravelProfile();
      loadActiveItinerary();
    } else {
      setTravelProfile(null);
      setCurrentItinerary(null);
    }
  }, [user]);

  const loadTravelProfile = async () => {
    if (!user) return;
    
    try {
      const userDocRef = doc(db, 'users', user.id);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists() && userDoc.data().travelProfile) {
        setTravelProfile(userDoc.data().travelProfile);
      }
    } catch (error) {
      console.error('Error loading travel profile:', error);
    }
  };

  const loadActiveItinerary = async () => {
    if (!user) return;
    
    try {
      // Set up real-time listener for active itinerary
      const itinerariesRef = collection(db, 'itineraries');
      // Note: In a real implementation, you'd query for user's active itinerary
      // For now, we'll just listen to changes
      
      // This is a simplified version - you'd want to add proper querying
      console.log('Setting up itinerary listener for user:', user.id);
    } catch (error) {
      console.error('Error loading active itinerary:', error);
    }
  };

  const saveTravelProfile = async (profile: TravelProfile) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      setLoading(true);
      const userDocRef = doc(db, 'users', user.id);
      await updateDoc(userDocRef, { travelProfile: profile });
      
      setTravelProfile(profile);
      toast.success('Travel profile saved!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save travel profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createItinerary = async (tripInput: TripInput) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      setLoading(true);
      
      // Generate basic itinerary structure
      const newItinerary: Omit<Itinerary, 'id'> = {
        userId: user.id,
        tripInput,
        days: generateItineraryDays(tripInput, travelProfile),
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };
      
      // Save to Firestore
      const itineraryRef = await addDoc(collection(db, 'itineraries'), newItinerary);
      
      const savedItinerary: Itinerary = {
        ...newItinerary,
        id: itineraryRef.id
      };
      
      setCurrentItinerary(savedItinerary);
      toast.success('Itinerary created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create itinerary');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateItinerary = async (update: ItineraryUpdate) => {
    if (!currentItinerary) throw new Error('No active itinerary');
    
    try {
      // Apply the update logic here
      const updatedItinerary = applyItineraryUpdate(currentItinerary, update);
      
      // Save to Firestore
      const itineraryRef = doc(db, 'itineraries', currentItinerary.id);
      await updateDoc(itineraryRef, {
        days: updatedItinerary.days,
        updatedAt: new Date()
      });
      
      setCurrentItinerary(updatedItinerary);
      toast.success('Itinerary updated!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update itinerary');
      throw error;
    }
  };

  const updateUserLocation = (location: UserLocation) => {
    setUserLocation(location);
    
    // Check if we need to trigger any automatic itinerary updates
    if (currentItinerary) {
      checkForLocationBasedUpdates(location, currentItinerary);
    }
  };

  // Helper function to generate basic itinerary days
  const generateItineraryDays = (tripInput: TripInput, profile: TravelProfile | null) => {
    // This is a simplified version - in a real app, you'd use AI/ML or complex algorithms
    const days = [];
    const startDate = new Date(tripInput.startDate);
    const endDate = new Date(tripInput.endDate);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push({
        date: new Date(d),
        activities: [],
        meals: [],
        transportation: []
      });
    }
    
    return days;
  };

  // Helper function to apply itinerary updates
  const applyItineraryUpdate = (itinerary: Itinerary, update: ItineraryUpdate): Itinerary => {
    // Implementation would depend on the type of update
    // For now, return the original itinerary
    return { ...itinerary, updatedAt: new Date() };
  };

  // Helper function to check for location-based updates
  const checkForLocationBasedUpdates = (location: UserLocation, itinerary: Itinerary) => {
    // Check if user is running late, ahead of schedule, etc.
    // This would trigger automatic rescheduling
    console.log('Checking for location-based updates', location, itinerary);
  };

  // Geolocation tracking
  useEffect(() => {
    if (!navigator.geolocation) return;
    
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: UserLocation = {
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          timestamp: new Date(),
          accuracy: position.coords.accuracy
        };
        updateUserLocation(location);
      },
      (error) => {
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [currentItinerary]);

  const value: TravelContextType = {
    currentItinerary,
    travelProfile,
    userLocation,
    loading,
    createItinerary,
    updateItinerary,
    saveTravelProfile,
    updateUserLocation
  };

  return (
    <TravelContext.Provider value={value}>
      {children}
    </TravelContext.Provider>
  );
};



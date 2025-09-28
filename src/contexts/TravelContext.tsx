import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { doc, setDoc, getDoc, updateDoc, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Itinerary, TravelProfile, UserLocation, TripInput, ItineraryUpdate, TravelContextType } from '../types';
import { useAuth } from './AuthContext';
import TravelApiService from '../services/api';
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
  const { user, refreshUserData } = useAuth();
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
      
      // Update local state
      setTravelProfile(profile);
      
      // Refresh user data in AuthContext to ensure routing works correctly
      // This ensures SmartRoute can detect the updated travel profile
      await refreshUserData();
      
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
      toast.loading('Creating your personalized itinerary... This may take up to 2 minutes for complex trips.', { id: 'create-itinerary' });
      
      // Add progress updates
      setTimeout(() => {
        toast.loading('Analyzing your travel preferences...', { id: 'create-itinerary' });
      }, 10000);
      
      setTimeout(() => {
        toast.loading('Generating activities and recommendations...', { id: 'create-itinerary' });
      }, 30000);
      
      setTimeout(() => {
        toast.loading('Almost done! Finalizing your itinerary...', { id: 'create-itinerary' });
      }, 60000);
      
      // Calculate trip duration
      const duration = Math.ceil((tripInput.endDate.getTime() - tripInput.startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Build comprehensive query using travel profile
      const query = TravelApiService.buildTripQuery(tripInput, travelProfile);
      
      // Get AI-generated itinerary
      const aiResponse = await TravelApiService.createItinerary(
        tripInput.destination,
        duration,
        tripInput.budget || 2000,
        user.id,
        {
          travelProfile,
          specialInterests: tripInput.specialInterests,
          constraints: tripInput.constraints,
          accommodation: tripInput.accommodation,
          travelers: tripInput.travelers
        }
      );
      
      console.log('AI Response received:', aiResponse);
      
      // Parse AI response into structured data
      const parsedItinerary = TravelApiService.parseItineraryResponse(aiResponse.recommendation);
      
      console.log('Parsed itinerary:', parsedItinerary);
      
      // Create enhanced itinerary structure
      const newItinerary: Omit<Itinerary, 'id'> = {
        userId: user.id,
        tripInput,
        days: generateEnhancedItineraryDays(tripInput, parsedItinerary, travelProfile),
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        aiResponse: aiResponse.recommendation,
        parsedData: parsedItinerary
      };
      
      console.log('Attempting to save itinerary to Firestore:', newItinerary);
      
      // Save to Firestore
      const itineraryRef = await addDoc(collection(db, 'itineraries'), newItinerary);
      
      console.log('Firestore save successful, document ID:', itineraryRef.id);
      
      const savedItinerary: Itinerary = {
        ...newItinerary,
        id: itineraryRef.id
      };
      
      console.log('Setting current itinerary:', savedItinerary);
      setCurrentItinerary(savedItinerary);
      toast.success('Your personalized itinerary is ready!', { id: 'create-itinerary' });
    } catch (error: any) {
      console.error('Error creating itinerary:', error);
      
      // More specific error messages based on error type
      let errorMessage = 'Failed to create itinerary. Please try again.';
      
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = 'The AI is taking longer than usual to create your itinerary. This can happen with complex trips. Please try again in a moment.';
      } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error occurred while creating your itinerary. Please try again.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid trip details provided. Please check your inputs and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, { 
        id: 'create-itinerary',
        duration: 6000 // Show error longer for timeout cases
      });
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

  // Helper function to generate enhanced itinerary days from AI response
  const generateEnhancedItineraryDays = (tripInput: TripInput, parsedData: any, profile: TravelProfile | null) => {
    console.log('Generating enhanced itinerary days from parsed data:', parsedData);
    
    const days = [];
    const startDate = new Date(tripInput.startDate);
    const endDate = new Date(tripInput.endDate);
    let dayIndex = 0;
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const aiDay = parsedData.days?.[dayIndex];
      console.log(`Processing day ${dayIndex + 1}:`, aiDay);
      
      const dayData = {
        date: new Date(d),
        activities: [],
        meals: [],
        transportation: []
      };
      
      // Handle activities - check if it's the new format or old format
      if (aiDay?.activities) {
        if (Array.isArray(aiDay.activities) && aiDay.activities.length > 0) {
          if (typeof aiDay.activities[0] === 'object' && aiDay.activities[0].title) {
            // New enhanced format
            dayData.activities = aiDay.activities.map((activity: any, index: number) => ({
              id: `activity-${dayIndex}-${index}`,
              name: activity.title || activity.name || 'Activity',
              description: activity.description || activity.location || '',
              location: {
                name: activity.location || '',
                address: '',
                coordinates: { lat: 0, lng: 0 }
              },
              startTime: parseTimeString(activity.time, d) || new Date(d.getTime() + (9 + index * 3) * 60 * 60 * 1000),
              endTime: parseTimeString(activity.time, d, true) || new Date(d.getTime() + (12 + index * 3) * 60 * 60 * 1000),
              estimatedDuration: 180,
              category: inferActivityCategory(activity.title || activity.name || '', profile),
              priority: 'medium' as const,
              isCompleted: false
            }));
          } else {
            // Legacy string format
            dayData.activities = aiDay.activities.map((activity: string, index: number) => ({
              id: `activity-${dayIndex}-${index}`,
              name: activity.split(' - ')[0] || activity,
              description: activity,
              location: {
                name: extractLocationFromActivity(activity),
                address: '',
                coordinates: { lat: 0, lng: 0 }
              },
              startTime: new Date(d.getTime() + (9 + index * 3) * 60 * 60 * 1000),
              endTime: new Date(d.getTime() + (12 + index * 3) * 60 * 60 * 1000),
              estimatedDuration: 180,
              category: inferActivityCategory(activity, profile),
              priority: 'medium' as const,
              isCompleted: false
            }));
          }
        }
      }
      
      // Handle meals - similar format checking
      if (aiDay?.meals) {
        if (Array.isArray(aiDay.meals) && aiDay.meals.length > 0) {
          if (typeof aiDay.meals[0] === 'object' && aiDay.meals[0].name) {
            // New enhanced format
            dayData.meals = aiDay.meals.map((meal: any, index: number) => ({
              id: `meal-${dayIndex}-${index}`,
              name: meal.name || 'Meal',
              type: inferMealType(meal.name || '', index),
              location: {
                name: meal.location || '',
                address: '',
                coordinates: { lat: 0, lng: 0 }
              },
              scheduledTime: parseTimeString(meal.time, d) || new Date(d.getTime() + (12 + index * 6) * 60 * 60 * 1000),
              estimatedDuration: 90,
              cuisine: meal.cuisine || extractCuisineFromMeal(meal.name || ''),
              isCompleted: false
            }));
          } else {
            // Legacy string format
            dayData.meals = aiDay.meals.map((meal: string, index: number) => ({
              id: `meal-${dayIndex}-${index}`,
              name: meal.split(' - ')[0] || meal,
              type: inferMealType(meal, index),
              location: {
                name: extractLocationFromActivity(meal),
                address: '',
                coordinates: { lat: 0, lng: 0 }
              },
              scheduledTime: new Date(d.getTime() + (12 + index * 6) * 60 * 60 * 1000),
              estimatedDuration: 90,
              cuisine: extractCuisineFromMeal(meal),
              isCompleted: false
            }));
          }
        }
      }
      
      days.push(dayData);
      dayIndex++;
    }
    
    console.log('Generated enhanced days:', days);
    return days;
  };
  
  // Helper function to parse time strings
  const parseTimeString = (timeStr: string, baseDate: Date, isEndTime = false): Date | null => {
    if (!timeStr) return null;
    
    // Extract time from strings like "9:00 AM" or "9:00 AM - 11:00 AM"
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!timeMatch) return null;
    
    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const period = timeMatch[3]?.toUpperCase();
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    const result = new Date(baseDate);
    result.setHours(hours, minutes, 0, 0);
    
    // If it's end time and we have a range, try to parse the end time
    if (isEndTime && timeStr.includes(' - ')) {
      const endTimeMatch = timeStr.match(/- (\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (endTimeMatch) {
        let endHours = parseInt(endTimeMatch[1]);
        const endMinutes = parseInt(endTimeMatch[2]);
        const endPeriod = endTimeMatch[3]?.toUpperCase();
        
        if (endPeriod === 'PM' && endHours !== 12) endHours += 12;
        if (endPeriod === 'AM' && endHours === 12) endHours = 0;
        
        result.setHours(endHours, endMinutes, 0, 0);
      } else {
        // Default to 2 hours later
        result.setTime(result.getTime() + 2 * 60 * 60 * 1000);
      }
    }
    
    return result;
  };

  // Helper functions for parsing AI data
  const extractLocationFromActivity = (activity: string): string => {
    const atMatch = activity.match(/at (.+?)(?:\s-|$)/);
    return atMatch ? atMatch[1].trim() : 'Location TBD';
  };

  const inferActivityCategory = (activity: string, profile: TravelProfile | null): 'sightseeing' | 'adventure' | 'cultural' | 'relaxation' | 'shopping' | 'other' => {
    const activityLower = activity.toLowerCase();
    if (activityLower.includes('museum') || activityLower.includes('temple') || activityLower.includes('cultural')) return 'cultural';
    if (activityLower.includes('hike') || activityLower.includes('adventure') || activityLower.includes('climb')) return 'adventure';
    if (activityLower.includes('spa') || activityLower.includes('relax') || activityLower.includes('beach')) return 'relaxation';
    if (activityLower.includes('shop') || activityLower.includes('market')) return 'shopping';
    if (activityLower.includes('view') || activityLower.includes('sight') || activityLower.includes('tower')) return 'sightseeing';
    return 'other';
  };

  const inferMealType = (meal: string, index: number): 'breakfast' | 'lunch' | 'dinner' | 'snack' => {
    const mealLower = meal.toLowerCase();
    if (mealLower.includes('breakfast')) return 'breakfast';
    if (mealLower.includes('lunch')) return 'lunch';
    if (mealLower.includes('dinner')) return 'dinner';
    // Infer from index
    if (index === 0) return 'breakfast';
    if (index === 1) return 'lunch';
    return 'dinner';
  };

  const extractCuisineFromMeal = (meal: string): string => {
    const cuisineKeywords = ['japanese', 'italian', 'french', 'chinese', 'thai', 'indian', 'mexican', 'korean'];
    const mealLower = meal.toLowerCase();
    for (const cuisine of cuisineKeywords) {
      if (mealLower.includes(cuisine)) {
        return cuisine.charAt(0).toUpperCase() + cuisine.slice(1);
      }
    }
    return 'Local';
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

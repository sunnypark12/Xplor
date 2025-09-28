import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { doc, setDoc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import * as Location from 'expo-location';
import { db } from '../config/firebase';
import type {
  Itinerary,
  TravelProfile,
  UserLocation,
  TripInput,
  ItineraryUpdate,
  TravelContextType
} from '../types';
import { useAuth } from './AuthContext';

const TravelContext = createContext<TravelContextType | undefined>(undefined);

export const useTravel = () => {
  const ctx = useContext(TravelContext);
  if (!ctx) throw new Error('useTravel must be used within a TravelProvider');
  return ctx;
};

interface Props { children: ReactNode }

export const TravelProvider: React.FC<Props> = ({ children }) => {
  const { user } = useAuth();
  const [currentItinerary, setCurrentItinerary] = useState<Itinerary | null>(null);
  const [travelProfile, setTravelProfile] = useState<TravelProfile | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadTravelProfile();
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
      if (userDoc.exists() && (userDoc.data() as any).travelProfile) {
        setTravelProfile((userDoc.data() as any).travelProfile);
      }
    } catch (e) {
      console.warn('Failed to load travel profile', e);
    }
  };

  const saveTravelProfile = async (profile: TravelProfile) => {
    if (!user) throw new Error('No user logged in');
    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.id);
      await updateDoc(userDocRef, { travelProfile: profile });
      setTravelProfile(profile);
    } finally {
      setLoading(false);
    }
  };

  const generateItineraryDays = (tripInput: TripInput, profile: TravelProfile | null) => {
    const days: any[] = [];
    const start = new Date(tripInput.startDate);
    const end = new Date(tripInput.endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push({ date: new Date(d), activities: [], meals: [], transportation: [] });
    }
    return days;
  };

  const createItinerary = async (tripInput: TripInput) => {
    if (!user) throw new Error('No user logged in');
    setLoading(true);
    try {
      const newItinerary: Omit<Itinerary, 'id'> = {
        userId: user.id,
        tripInput,
        days: generateItineraryDays(tripInput, travelProfile),
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };
      const ref = await addDoc(collection(db, 'itineraries'), newItinerary as any);
      setCurrentItinerary({ ...newItinerary, id: ref.id });
    } finally {
      setLoading(false);
    }
  };

  const applyItineraryUpdate = (itinerary: Itinerary, update: ItineraryUpdate): Itinerary => {
    return { ...itinerary, updatedAt: new Date() };
  };

  const updateItinerary = async (update: ItineraryUpdate) => {
    if (!currentItinerary) throw new Error('No active itinerary');
    const updated = applyItineraryUpdate(currentItinerary, update);
    const itineraryRef = doc(db, 'itineraries', currentItinerary.id);
    await updateDoc(itineraryRef, { days: updated.days, updatedAt: new Date() } as any);
    setCurrentItinerary(updated);
  };

  const updateUserLocation = (location: UserLocation) => {
    setUserLocation(location);
  };

  useEffect(() => {
    let watcher: Location.LocationSubscription | null = null;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      watcher = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, timeInterval: 10000, distanceInterval: 25 },
        (pos) => {
          const loc: UserLocation = {
            coordinates: { lat: pos.coords.latitude, lng: pos.coords.longitude },
            timestamp: new Date(),
            accuracy: pos.coords.accuracy
          };
          updateUserLocation(loc);
        }
      );
    })();
    return () => { watcher?.remove(); };
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

  return <TravelContext.Provider value={value}>{children}</TravelContext.Provider>;
};



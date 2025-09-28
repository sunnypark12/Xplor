import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import type { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

interface Props { children: ReactNode }

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const data = userDoc.data() as any;
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || data.displayName,
        photoURL: firebaseUser.photoURL || data.photoURL,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        travelProfile: data.travelProfile
      };
    }
    const newUser: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || '',
      createdAt: new Date(),
      travelProfile: undefined
    };
    await setDoc(userDocRef, { ...newUser, createdAt: new Date(), travelProfile: null });
    return newUser;
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    try {
      const { user: fbUser } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(fbUser, { displayName });
      const newUser: User = {
        id: fbUser.uid,
        email: fbUser.email || '',
        displayName,
        createdAt: new Date()
      };
      await setDoc(doc(db, 'users', fbUser.uid), { ...newUser, createdAt: new Date() });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    const userDocRef = doc(db, 'users', user.id);
    await updateDoc(userDocRef, data as any);
    setUser(prev => (prev ? { ...prev, ...data } : prev));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          const u = await convertFirebaseUser(fbUser);
          setUser(u);
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile: updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};



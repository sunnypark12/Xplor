import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJN6fPYU0DXqlwCV-5ehDXBfbeJZXacmY",
  authDomain: "xplor-8f55e.firebaseapp.com",
  databaseURL: "https://xplor-8f55e-default-rtdb.firebaseio.com",
  projectId: "xplor-8f55e",
  storageBucket: "xplor-8f55e.firebasestorage.app",
  messagingSenderId: "218055696627",
  appId: "1:218055696627:web:e519a75cd6088edb489786"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

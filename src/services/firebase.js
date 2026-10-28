import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase Client Configuration.
 * Accesses credentials strictly from Vite environment variables.
 * Never hardcode secrets in source code.
 */
const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

let app = null;
let auth = null;
let db = null;

// Only initialize Firebase if API key is present
if (FIREBASE_CONFIG.apiKey) {
  try {
    app = initializeApp(FIREBASE_CONFIG);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.warn('Firebase initialization skipped or failed:', error.message);
  }
} else {
  console.info('Firebase credentials unconfigured. Operating in local mode.');
}

export { app, auth, db };

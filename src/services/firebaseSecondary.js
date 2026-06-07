import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const SECONDARY_NAME = 'Secondary';

function getSecondaryApp() {
  const existing = getApps().find((a) => a.name === SECONDARY_NAME);
  if (existing) return existing;
  return initializeApp(firebaseConfig, SECONDARY_NAME);
}

export function getSecondaryAuth() {
  return getAuth(getSecondaryApp());
}

import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const SETTINGS_DOC = doc(db, 'settings', 'platform');

export function usePlatformSettings() {
  const [demoMode, setDemoModeState] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(SETTINGS_DOC, (snap) => {
      setDemoModeState(snap.exists() ? Boolean(snap.data().demoMode) : false);
      setLoading(false);
    });
    return unsub;
  }, []);

  const setDemoMode = async (value) => {
    await setDoc(SETTINGS_DOC, { demoMode: value }, { merge: true });
  };

  return { demoMode, setDemoMode, loading };
}

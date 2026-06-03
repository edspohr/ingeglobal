import React, { createContext, useContext } from 'react';
import { usePlatformSettings } from '../hooks/usePlatformSettings';

const PlatformContext = createContext({ demoMode: false, setDemoMode: () => {} });

export const PlatformProvider = ({ children }) => {
  const { demoMode, setDemoMode, loading } = usePlatformSettings();
  return (
    <PlatformContext.Provider value={{ demoMode, setDemoMode, loading }}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => useContext(PlatformContext);

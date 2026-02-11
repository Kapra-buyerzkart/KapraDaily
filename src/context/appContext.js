import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState } from 'react';
import { getProfile } from '../api';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  const loadProfile = React.useCallback(async () => {
    try {
      const response = await getProfile();
      if (response?.success && response?.data) {
        setProfile(response.data);
      }
    } catch (error) {
      console.log('Profile fetch error:', error);
    }
  }, []);

  const logout = React.useCallback(async () => {
    await AsyncStorage.clear();
    setProfile(null);
  }, []);

  const value = React.useMemo(() => ({
    logout,
    loadProfile,
    profile
  }), [logout, loadProfile, profile]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

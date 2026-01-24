import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState } from 'react';
import { getProfile } from '../api';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  const loadProfile = async () => {
    try {
      const response = await getProfile();
      console.log('responsennn', response)
      if (response?.success && response?.data) {
        setProfile(response.data);
      } else {
        console.log('Failed to load profilennn:', response.message);
      }
    } catch (error) {
      console.log('Profile fetch error:', error);
    }
  };

  const logout = async () => {
    await AsyncStorage.clear();
  }

  const value = {
    logout,
    loadProfile,
    profile
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

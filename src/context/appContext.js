import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState } from 'react';
import { getProfile } from '../api';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [locationNotFetched, setLocationNotFetched] = useState(false);

  /* ---------------- LOAD PROFILE FROM API + MERGE ---------------- */
  const loadProfile = async () => {
    try {
      const response = await getProfile();

      if (response?.success && response?.data) {
        const storedProfile = await AsyncStorage.getItem('profile');
        const localProfile = storedProfile ? JSON.parse(storedProfile) : {};

        const mergedProfile = {
          ...localProfile,
          ...response.data, // API data overrides local
        };

        // Ensure pincode is normalized to the area ID
        if (response.data.pincodeAreaId && !response.data.pincode) {
          mergedProfile.pincode = response.data.pincodeAreaId;
        }

        await AsyncStorage.setItem('profile', JSON.stringify(mergedProfile));
        if (mergedProfile.pincode) {
          await AsyncStorage.setItem('pincodeAreaId', mergedProfile.pincode.toString());
        }
        setProfile(mergedProfile);
        console.log('profilee', mergedProfile);
      }
    } catch (error) {
      console.log('Profile fetch error:', error);
    }
  };

  /* ---------------- LOAD / CREATE GUEST PROFILE ---------------- */
  const loadProfileTwo = async () => {
    const storedProfile = await AsyncStorage.getItem('profile');

    const defaultProfile = {
      guestId: Math.floor(Math.random() * 9000000000) + 1000000000,
      pincode: 105,
      pinAddress: 'Kakkanad',
    };

    const mergedProfile = storedProfile
      ? { ...defaultProfile, ...JSON.parse(storedProfile) }
      : defaultProfile;

    await AsyncStorage.setItem('profile', JSON.stringify(mergedProfile));
    if (mergedProfile.pincode) {
      await AsyncStorage.setItem('pincodeAreaId', mergedProfile.pincode.toString());
    }
    setProfile(mergedProfile);
  };

  /* ---------------- EDIT PINCODE (SAFE MERGE) ---------------- */
  const editPincode = async (item) => {
    const storedProfile = await AsyncStorage.getItem('profile');
    const existingProfile = storedProfile ? JSON.parse(storedProfile) : {};

    const updatedProfile = {
      ...existingProfile,
      pincode: item?.pincodeAreaId,
      pinAddress: item?.areaName ?? existingProfile.pinAddress,
    };

    await AsyncStorage.setItem('profile', JSON.stringify(updatedProfile));
    if (item?.pincodeAreaId) {
      await AsyncStorage.setItem('pincodeAreaId', item.pincodeAreaId.toString());
    }
    setProfile(updatedProfile);
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = async () => {
    await AsyncStorage.clear();
    // setProfile(null);
  };

  const value = React.useMemo(() => ({
    logout,
    loadProfile,
    loadProfileTwo,
    profile,
    editPincode,
    locationNotFetched,
    setLocationNotFetched,
  }));

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

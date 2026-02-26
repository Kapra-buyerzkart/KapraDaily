import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useCallback, useMemo } from 'react';
import { getProfile } from '../api';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [locationNotFetched, setLocationNotFetched] = useState(false);
  const [isStoreUnavailable, setIsStoreUnavailable] = useState(false);
  const [storeUnavailableData, setStoreUnavailableData] = useState({ image: null, text: '' });

  const setStoreUnavailable = useCallback((flag, data = null) => {
    setIsStoreUnavailable(prevFlag => {
      if (prevFlag === flag) return prevFlag;
      return flag;
    });

    if (data) {
      setStoreUnavailableData(prevData => {
        if (prevData?.image === data.image && prevData?.text === data.text) return prevData;
        return data;
      });
    } else if (!flag) {
      setStoreUnavailableData(prevData => {
        if (prevData?.image === null && prevData?.text === '') return prevData;
        return { image: null, text: '' };
      });
    }
  }, []);

  /* ---------------- LOAD PROFILE FROM API + MERGE ---------------- */
  const loadProfile = useCallback(async () => {
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
        setProfile(prev => {
          if (JSON.stringify(prev) === JSON.stringify(mergedProfile)) return prev;
          return mergedProfile;
        });
        console.log('profilee', mergedProfile);
      }
    } catch (error) {
      console.log('Profile fetch error:', error);
    }
  }, []);

  /* ---------------- LOAD / CREATE GUEST PROFILE ---------------- */
  const loadProfileTwo = useCallback(async () => {
    const storedProfile = await AsyncStorage.getItem('profile');
    const storedPincodeAreaId = await AsyncStorage.getItem('pincodeAreaId');

    const defaultProfile = {
      guestId: Math.floor(Math.random() * 9000000000) + 1000000000,
      pincode: storedPincodeAreaId ? parseInt(storedPincodeAreaId) : null,
      pinAddress: 'Kakkanad',
    };

    const mergedProfile = storedProfile
      ? { ...defaultProfile, ...JSON.parse(storedProfile) }
      : defaultProfile;

    await AsyncStorage.setItem('profile', JSON.stringify(mergedProfile));
    if (mergedProfile.pincode) {
      await AsyncStorage.setItem('pincodeAreaId', mergedProfile.pincode.toString());
    }
    setProfile(prev => {
      if (JSON.stringify(prev) === JSON.stringify(mergedProfile)) return prev;
      return mergedProfile;
    });
  }, []);

  /* ---------------- EDIT PINCODE (SAFE MERGE) ---------------- */
  const editPincode = useCallback(async (item) => {
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
  }, []);

  /* ---------------- LOGOUT ---------------- */
  // const logout = useCallback(async () => {
  //   await AsyncStorage.clear();
  //   // setProfile(null);
  // }, []);

  const logout = async () => {
    await AsyncStorage.clear();

    setProfile(prev => {
      if (!prev) return null;

      const { pincode, ...rest } = prev;  // 🔥 remove pincode
      return rest;
    });

    // setLocationNotFetched(false);
  };

  const value = useMemo(() => ({
    logout,
    loadProfile,
    loadProfileTwo,
    profile,
    editPincode,
    locationNotFetched,
    setLocationNotFetched,
    isStoreUnavailable,
    storeUnavailableData,
    setStoreUnavailable,
  }), [
    logout,
    loadProfile,
    loadProfileTwo,
    profile,
    editPincode,
    locationNotFetched,
    isStoreUnavailable,
    storeUnavailableData,
    setStoreUnavailable
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

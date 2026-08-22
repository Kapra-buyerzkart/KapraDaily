import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import logger from '../utils/logger';
import secureStore from '../utils/secureStore';
import { InteractionManager, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { getProfile } from '../api';
import { clearTokens } from '../api/tokenService';
import { clearKshopeSession } from '../kshope/api/session';
import { getGeneralSettingsApi, getAppUpdateCheckApi } from '../api/userService';
import { setLogoutHandler, resetNetworkState } from '../api/networkUtils';
import * as NavigationService from '../api/NavigationService';
import { oneSignalLogin, oneSignalLogout } from '../services/OneSignalService';
import { queryClient } from '../queryClient';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const isLoggingOutRef = useRef(false);
  const [profile, setProfile] = useState(null);
  const [locationNotFetched, setLocationNotFetched] = useState(false);
  const [isStoreUnavailable, setIsStoreUnavailable] = useState(false);
  const [storeUnavailableData, setStoreUnavailableData] = useState({ image: null, text: '' });
  const [generalSettings, setGeneralSettings] = useState({});
  const [updateInfo, setUpdateInfo] = useState(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  const checkForUpdates = useCallback(async () => {
    try {
      const currentVersion = DeviceInfo.getVersion();
      logger.log('currentVersion=======>', currentVersion);
      const platform = Platform.OS.toUpperCase();

      const response = await getAppUpdateCheckApi(currentVersion, platform);

      if (response && response.success && response.data) {
        const remoteVersion = response.data.versionCode || response.data.version;
        logger.log('remoteVersion=======>', remoteVersion);
        if (!remoteVersion || !currentVersion) return;

        const rParts = remoteVersion.split('.').map(Number);
        const cParts = currentVersion.split('.').map(Number);
        let isUpdateRequired = false;

        for (let i = 0; i < Math.max(rParts.length, cParts.length); i++) {
          const r = rParts[i] || 0;
          const c = cParts[i] || 0;
          if (r > c) {
            isUpdateRequired = true;
            break;
          }
          if (r < c) {
            break;
          }
        }

        if (isUpdateRequired) {
          setUpdateInfo(response.data);
          setIsUpdateModalVisible(true);
        }
      }
    } catch (error) {
      logger.log('App update check failed (silent):', error);
    }
  }, []);

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

  const loadSettings = useCallback(async () => {
    try {
      const response = await getGeneralSettingsApi();
      if (response && response.success && response.data?.items) {
        const items = response.data.items;
        const settingsMap = {};
        items.forEach(item => {
          settingsMap[item.stName] = item.stValue;
        });
        setGeneralSettings(settingsMap);
        return settingsMap;
      }
    } catch (error) {
      logger.error('Error fetching general settings:', error);
    }
    return {};
  }, []);

  const loadProfileTwo = useCallback(async () => {
    const storedProfile = await secureStore.getItem('profile');
    const storedPincodeAreaId = await secureStore.getItem('pincodeAreaId');

    const defaultProfile = {
      guestId: Math.floor(Math.random() * 9000000000) + 1000000000,
      pincode: storedPincodeAreaId ? parseInt(storedPincodeAreaId) : null,
      pinAddress: null,
    };

    const mergedProfile = storedProfile
      ? { ...defaultProfile, ...JSON.parse(storedProfile) }
      : defaultProfile;

    await secureStore.setItem('profile', JSON.stringify(mergedProfile));
    if (mergedProfile.pincode) {
      await secureStore.setItem('pincodeAreaId', mergedProfile.pincode.toString());
    }
    setProfile(prev => {
      if (JSON.stringify(prev) === JSON.stringify(mergedProfile)) return prev;
      return mergedProfile;
    });
  }, []);

  const loadProfile = useCallback(async () => {
    let localProfile = {};
    try {
      const storedProfile = await secureStore.getItem('profile');
      if (storedProfile) {
        localProfile = JSON.parse(storedProfile);
        if (localProfile?.custId) setProfile(localProfile);
      }
    } catch (error) {
      logger.log('Stored profile hydrate failed:', error);
      localProfile = {};
    }

    try {
      const response = await getProfile();
      logger.log('me response', response);

      if (response?.success && response?.data) {
        const mergedProfile = {
          ...localProfile,
          ...response.data,
        };

        if (response.data.pincodeAreaId && !response.data.pincode) {
          mergedProfile.pincode = response.data.pincodeAreaId;
        }

        await secureStore.setItem('profile', JSON.stringify(mergedProfile));
        if (mergedProfile.pincode) {
          await secureStore.setItem('pincodeAreaId', mergedProfile.pincode.toString());
        }
        setProfile(prev => {
          if (JSON.stringify(prev) === JSON.stringify(mergedProfile)) return prev;
          return mergedProfile;
        });
        logger.log('profilee', mergedProfile);
      } else {
        await loadProfileTwo();
      }
    } catch (error) {
      logger.log('Profile fetch error:', error);
      await loadProfileTwo();
    }
  }, [loadProfileTwo]);

  const editPincode = useCallback(async (item) => {
    const storedProfile = await secureStore.getItem('profile');
    const existingProfile = storedProfile ? JSON.parse(storedProfile) : {};

    const updatedProfile = {
      ...existingProfile,
      pincode: item?.pincodeAreaId,
      pinAddress: item?.areaName ?? existingProfile.pinAddress,
    };

    await secureStore.setItem('profile', JSON.stringify(updatedProfile));
    if (item?.pincodeAreaId) {
      await secureStore.setItem('pincodeAreaId', item.pincodeAreaId.toString());
    }
    setStoreUnavailable(false);
    setProfile(updatedProfile);
  }, [setStoreUnavailable]);

  const logout = useCallback(async (isExpired = false) => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;
    setTimeout(() => { isLoggingOutRef.current = false; }, 3000);

    try {
      if (isExpired) {
        import('react-native-simple-toast').then(Toast => {
          Toast.default.show('Session expired, please login again.', Toast.default.LONG);
        });
      }
      
      resetNetworkState();

      await clearTokens();
      await clearKshopeSession();
      await secureStore.multiRemove(['profile', 'pincodeAreaId', 'selectedAddressId']);

      await AsyncStorage.clear();
      logger.log('🔒 [LOGOUT] secureStore + AsyncStorage cleared (tokens, profile, location data removed)');

      queryClient.clear();

      setLocationNotFetched(false);

      oneSignalLogout();

      NavigationService.reset('LoginScreen', { type: 'login' });

      const freshProfile = {
        guestId: Math.floor(Math.random() * 9000000000) + 1000000000,
      };

      await secureStore.setItem('profile', JSON.stringify(freshProfile));
      setProfile(freshProfile);

    } catch (error) {
      logger.log('Logout error:', error);
    }
  }, []);

  useEffect(() => {
    setLogoutHandler(logout);
  }, [logout]);

  useEffect(() => {
    if (profile?.custId) {
      logger.log('🔔 [SYNC] Registering OneSignal ExternalId:', profile.custId);
      oneSignalLogin({
        externalId: String(profile.custId),
        tags: {
          customer_name: profile.custName || '',
          phone: profile.phoneNo || '',
        }
      });
    }
  }, [profile?.custId]);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      loadSettings();
      checkForUpdates();
    });
    return () => task.cancel();
  }, [loadSettings, checkForUpdates]);

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
    updateInfo,
    isUpdateModalVisible,
    setIsUpdateModalVisible,
    checkForUpdates,
    generalSettings,
    loadSettings,
  }), [
    logout,
    loadProfile,
    loadProfileTwo,
    profile,
    editPincode,
    locationNotFetched,
    isStoreUnavailable,
    storeUnavailableData,
    setStoreUnavailable,
    generalSettings,
    loadSettings,
    updateInfo,
    isUpdateModalVisible,
    checkForUpdates,
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

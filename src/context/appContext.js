import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import logger from '../utils/logger';
import secureStore from '../utils/secureStore';
import { InteractionManager, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { getProfile } from '../api';
import { clearTokens } from '../api/tokenService';
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
      const platform = Platform.OS.toUpperCase(); // ANDROID or IOS

      const response = await getAppUpdateCheckApi(currentVersion, platform);

      if (response && response.success && response.data) {
        const remoteVersion = response.data.versionCode || response.data.version;
        logger.log('remoteVersion=======>', remoteVersion);
        if (!remoteVersion || !currentVersion) return;

        // Semver version comparison
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
      // User said: "if error no need to show anything"
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

  /* ---------------- LOAD / CREATE GUEST PROFILE ---------------- */
  // Declared before `loadProfile` because `loadProfile` closes over it AND
  // lists it in its dependency array. As a `const` declared afterwards, that
  // dependency array read hit the temporal dead zone.
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

  /* ---------------- LOAD PROFILE FROM API + MERGE ---------------- */
  // Startup path. RootNavigator holds the whole app on a loader until `profile`
  // is set, so anything awaited here is directly on the cold-start critical
  // path. The locally-persisted profile is therefore published FIRST (a local
  // Keychain read, sub-millisecond once the access token cache is warm) so the
  // UI can paint, and the network refresh is folded in when it lands. The
  // merge, persistence and fallback semantics below are unchanged.
  const loadProfile = useCallback(async () => {
    // ── Fast path: paint from the last known profile ──────────────────────
    let localProfile = {};
    try {
      const storedProfile = await secureStore.getItem('profile');
      if (storedProfile) {
        localProfile = JSON.parse(storedProfile);
        // Only unblock early for a profile that already carries an identity.
        // A partial/guest snapshot is left for the API round-trip to resolve,
        // so a logged-in user is never briefly shown as logged out.
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
          ...response.data, // API data overrides local
        };

        // Ensure pincode is normalized to the area ID
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
        await loadProfileTwo(); // Fallback to guest profile if API response is not successful
      }
    } catch (error) {
      logger.log('Profile fetch error:', error);
      await loadProfileTwo(); // Fallback to guest profile
    }
  }, [loadProfileTwo]);

  /* ---------------- EDIT PINCODE (SAFE MERGE) ---------------- */
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
    setProfile(updatedProfile);
  }, []);

  // useCallback is load-bearing here, not decoration: `logout` is in the
  // dependency array of the context-value useMemo below. As a bare function it
  // got a new identity every render, so the memo never hit, every AppContext
  // consumer re-rendered on every provider render, and the setLogoutHandler
  // effect below re-ran each time. Deps are empty because everything this
  // closes over is either a ref, a module import, or a stable state setter.
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
      
      // Clear network state (queues, isRefreshing flags)
      resetNetworkState();

      // Tokens, profile, and selectedAddressId live in secureStore (Keychain),
      // not AsyncStorage, so they need an explicit clear.
      await clearTokens();
      await secureStore.multiRemove(['profile', 'pincodeAreaId', 'selectedAddressId']);

      // Clear remaining (non-sensitive) local storage: manualOverride,
      // manualRegion, manualAddress, etc.
      await AsyncStorage.clear();
      logger.log('🔒 [LOGOUT] secureStore + AsyncStorage cleared (tokens, profile, location data removed)');

      // Also clear the in-memory query cache so no still-mounted screen keeps
      // serving the previous session's (e.g. wallet/dashboard) data between
      // this clear and the navigation reset below.
      queryClient.clear();

      // Reset in-memory location state so LocationFetchingNewScreen starts fresh
      setLocationNotFetched(false);

      // Unlink OneSignal identity and clear badges
      oneSignalLogout();

      // Navigate to login
      NavigationService.reset('LoginScreen', { type: 'login' });

      // Set a fresh guest profile (no pincode, no location data)
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

  /**
   * Sync Profile with OneSignal External ID
   */
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

  // Neither of these gates first paint: general settings only refine an
  // already-rendered store state, and the update modal is deliberately shown
  // late. Running them on mount put two network calls (plus DeviceInfo, plus
  // their JSON parsing and state commits) in direct contention with the
  // profile fetch and the homepage query that DO gate first paint.
  // InteractionManager defers them until after the first frames have settled.
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

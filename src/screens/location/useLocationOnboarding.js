import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState, Linking, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

import { AppContext } from '../../context/appContext';
import { getAddressListApi } from '../../api/addressService';
import { getAreasByPincode } from '../../api';
import { GOOGLE_MAPS_API_KEY } from '../../globals/secrets';
import secureStore from '../../utils/secureStore';
import {
  AUTO_NAVIGATE_TIMEOUT_MS,
  DEFAULT_AREA,
  FAST_PATH_DELAY_MS,
  MIN_STEP_DURATION_MS,
  STEPS,
} from './locationConstants';

const normalizeString = str => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/([tdfpghkz])h/g, '$1')
    .replace(/(.)\1+/g, '$1');
};

const isFuzzyMatch = (saved, gps) => {
  if (!saved || !gps) return false;
  const sNorm = normalizeString(saved);
  const gNorm = normalizeString(gps);
  if (sNorm.length < 3) return false;
  if (gNorm.includes(sNorm) || sNorm.includes(gNorm)) return true;

  let max = 0;
  const dp = Array(sNorm.length + 1)
    .fill(0)
    .map(() => Array(gNorm.length + 1).fill(0));
  for (let i = 1; i <= sNorm.length; i++) {
    for (let j = 1; j <= gNorm.length; j++) {
      if (sNorm[i - 1] === gNorm[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        if (dp[i][j] > max) max = dp[i][j];
      } else {
        dp[i][j] = 0;
      }
    }
  }
  return max >= Math.ceil(sNorm.length * 0.8);
};

const LOCATION_PERMISSION =
  Platform.OS === 'android'
    ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

// Owns the app's real location-resolution pipeline (GPS, reverse geocoding,
// saved-address matching, pincode-area lookup) — relocated from the old
// LocationFetchingNewScreen.js with the same business logic and API
// contracts, plus a small step state machine that drives the new animated
// progress UI.
export default function useLocationOnboarding(navigation) {
  const { profile, editPincode, setLocationNotFetched } = useContext(AppContext);

  const [step, setStep] = useState(STEPS.GPS);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [resolvedArea, setResolvedArea] = useState(null);
  const [addressComponent, setAddressComponent] = useState(null);

  const [showAreaPicker, setShowAreaPicker] = useState(false);
  const [listOfLocations, setListOfLocations] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [showSearchSheet, setShowSearchSheet] = useState(false);
  const [showPermissionSheet, setShowPermissionSheet] = useState(false);
  const [permissionSheetMode, setPermissionSheetMode] = useState('PRIMING');

  const [isFastPath, setIsFastPath] = useState(false);

  const userInteractedRef = useRef(false);
  const timeoutRef = useRef(null);
  const pendingTimeoutsRef = useRef([]);
  const stepStartTimesRef = useRef({ [STEPS.GPS]: Date.now() });
  const showAreaPickerRef = useRef(false);

  useEffect(() => {
    showAreaPickerRef.current = showAreaPicker;
  }, [showAreaPicker]);

  const navigateAfterLocation = useCallback(() => {
    if (profile?.custId) {
      navigation.reset({ index: 0, routes: [{ name: 'AuthSuccessScreen' }] });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen', params: { type: 'login' } }],
      });
    }
  }, [profile, navigation]);

  const startAutoNavigateTimer = useCallback(() => {
    // Safety net: only force-navigates when the multi-area picker is the
    // thing blocking progress (all other paths already have their own
    // internal GPS/network timeouts, some of which run longer than this).
    timeoutRef.current = setTimeout(() => {
      setLocationNotFetched(false);
      if (!userInteractedRef.current && showAreaPickerRef.current) {
        navigateAfterLocation();
      }
    }, AUTO_NAVIGATE_TIMEOUT_MS);
  }, [navigateAfterLocation, setLocationNotFetched]);

  const stopAutoNavigateTimer = useCallback(() => {
    userInteractedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const openLocationSettings = useCallback(() => {
    if (Platform.OS !== 'android') return;
    Linking.openSettings().catch(() => {});
    Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS').catch(() => {});
    Linking.openURL('package:com.android.settings').catch(() => {});
  }, []);

  // ---- Step machine ----

  const advanceFromGps = useCallback(() => {
    const startedAt = stepStartTimesRef.current[STEPS.GPS] ?? Date.now();
    const wait = Math.max(MIN_STEP_DURATION_MS - (Date.now() - startedAt), 0);
    const id = setTimeout(() => {
      setCompletedSteps(prev => (prev.includes(STEPS.GPS) ? prev : [...prev, STEPS.GPS]));
      stepStartTimesRef.current[STEPS.FINDING_STORES] = Date.now();
      setStep(STEPS.FINDING_STORES);
    }, wait);
    pendingTimeoutsRef.current.push(id);
  }, []);

  // Real resolution (editPincode) has already happened by the time this is
  // called — DELIVERY_TIME/PREPARING are short cosmetic beats before SUCCESS.
  const proceedToSuccess = useCallback(area => {
    setResolvedArea(area ?? null);
    const startedAt = stepStartTimesRef.current[STEPS.FINDING_STORES] ?? Date.now();
    const floorWait = Math.max(MIN_STEP_DURATION_MS - (Date.now() - startedAt), 0);

    const id1 = setTimeout(() => {
      setCompletedSteps(prev => (prev.includes(STEPS.FINDING_STORES) ? prev : [...prev, STEPS.FINDING_STORES]));
      setStep(STEPS.DELIVERY_TIME);

      const id2 = setTimeout(() => {
        setCompletedSteps(prev => (prev.includes(STEPS.DELIVERY_TIME) ? prev : [...prev, STEPS.DELIVERY_TIME]));
        setStep(STEPS.PREPARING);

        const id3 = setTimeout(() => {
          setCompletedSteps(prev => (prev.includes(STEPS.PREPARING) ? prev : [...prev, STEPS.PREPARING]));
          setStep(STEPS.SUCCESS);
        }, MIN_STEP_DURATION_MS);
        pendingTimeoutsRef.current.push(id3);
      }, MIN_STEP_DURATION_MS);
      pendingTimeoutsRef.current.push(id2);
    }, floorWait);
    pendingTimeoutsRef.current.push(id1);
  }, []);

  // A location resolved via manual search bypasses GPS entirely — make sure
  // the progress card doesn't strand step 1 as permanently "in progress".
  const forceAdvancePastGps = useCallback(() => {
    setCompletedSteps(prev => (prev.includes(STEPS.GPS) ? prev : [...prev, STEPS.GPS]));
    stepStartTimesRef.current[STEPS.FINDING_STORES] = Date.now();
    setStep(prev => (prev === STEPS.GPS ? STEPS.FINDING_STORES : prev));
  }, []);

  // ---- GPS / geocoding pipeline (verbatim logic from the old screen) ----

  const getLocationPincodeAreas = useCallback(
    async (postcode, formattedAddress) => {
      try {
        let addressList = [];
        try {
          const addressRes = await getAddressListApi();
          addressList = Array.isArray(addressRes?.data)
            ? addressRes.data
            : addressRes?.data?.items || addressRes?.data || [];
        } catch (addrErr) {
          // Guest user or address list failure — fall through to pincode lookup.
        }

        if (addressList.length > 0) {
          const matchingAddress = addressList.find(addr => {
            const pinMatch =
              postcode && String(addr.pincode || addr.pin) === String(postcode);
            if (pinMatch) return true;
            if (formattedAddress) {
              if (addr.areaName && isFuzzyMatch(addr.areaName, formattedAddress)) return true;
              if (
                addr.pincodeAreaName &&
                isFuzzyMatch(addr.pincodeAreaName, formattedAddress)
              )
                return true;
              const line2Norm = normalizeString(addr.addLine2);
              if (
                line2Norm.length > 3 &&
                normalizeString(formattedAddress).includes(line2Norm)
              )
                return true;
            }
            return false;
          });

          if (matchingAddress) {
            const addressId =
              matchingAddress.custAddressId ||
              matchingAddress.addressId ||
              matchingAddress.id;
            if (addressId) {
              await secureStore.setItem('selectedAddressId', String(addressId));
            }
            const areaPayload = {
              pincodeAreaId: matchingAddress.pincodeAreaId,
              areaName:
                matchingAddress.areaName ||
                matchingAddress.pincodeAreaName ||
                matchingAddress.area_name ||
                matchingAddress.addLine2,
            };
            await editPincode(areaPayload);
            proceedToSuccess(areaPayload);
            return;
          }
        }

        if (!postcode || String(postcode).trim().length === 0) {
          await editPincode(DEFAULT_AREA);
          proceedToSuccess(DEFAULT_AREA);
          return;
        }

        const area = await getAreasByPincode(postcode);

        if (area?.data?.length > 1) {
          if (area.data.find(obj => obj?.pincodeAreaId == profile?.pincode)) {
            proceedToSuccess({ pincodeAreaId: profile?.pincode });
          } else {
            setListOfLocations(area.data);
            setShowAreaPicker(true);
          }
        } else if (area?.data?.length === 1) {
          await editPincode(area.data[0]);
          proceedToSuccess(area.data[0]);
        } else {
          await editPincode(DEFAULT_AREA);
          proceedToSuccess(DEFAULT_AREA);
        }
      } catch (error) {
        await editPincode(DEFAULT_AREA);
        proceedToSuccess(DEFAULT_AREA);
      }
    },
    [profile, editPincode, proceedToSuccess],
  );

  const reverseGeocode = useCallback(
    async (latitude, longitude) => {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
      try {
        const response = await axios.get(url, { timeout: 10000 });
        const formattedAddress = response.data.results[0]?.formatted_address;
        setAddressComponent(response.data.results[0]);

        let postalCode = null;
        if (response.data.results) {
          for (const res of response.data.results) {
            const pCode = res.address_components?.find(c =>
              c.types.includes('postal_code'),
            )?.long_name;
            if (pCode) {
              postalCode = pCode;
              break;
            }
          }
        }

        await getLocationPincodeAreas(postalCode, formattedAddress);
      } catch (error) {
        await editPincode(DEFAULT_AREA);
        proceedToSuccess(DEFAULT_AREA);
      }
    },
    [getLocationPincodeAreas, editPincode, proceedToSuccess],
  );

  const fetchLocation = useCallback(() => {
    const onSuccess = position => {
      advanceFromGps();
      reverseGeocode(position.coords.latitude, position.coords.longitude);
    };

    const onFinalError = async () => {
      advanceFromGps();
      await editPincode(DEFAULT_AREA);
      proceedToSuccess(DEFAULT_AREA);
    };

    Geolocation.getCurrentPosition(
      onSuccess,
      () => {
        Geolocation.getCurrentPosition(onSuccess, onFinalError, {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
        });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }, [advanceFromGps, reverseGeocode, editPincode, proceedToSuccess]);

  // ---- Permission flow ----

  const requestLocationPermission = useCallback(async () => {
    const result = await request(LOCATION_PERMISSION);
    if (result !== RESULTS.GRANTED && result !== RESULTS.LIMITED) {
      setPermissionSheetMode('BLOCKED');
      setShowPermissionSheet(true);
      return;
    }
    const gpsEnabled = await DeviceInfo.isLocationEnabled();
    if (!gpsEnabled) {
      setPermissionSheetMode('GPS_OFF');
      setShowPermissionSheet(true);
      return;
    }
    fetchLocation();
  }, [fetchLocation]);

  const initPermissionFlow = useCallback(async () => {
    const result = await check(LOCATION_PERMISSION);
    if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
      const gpsEnabled = await DeviceInfo.isLocationEnabled();
      if (!gpsEnabled) {
        setPermissionSheetMode('GPS_OFF');
        setShowPermissionSheet(true);
        return;
      }
      fetchLocation();
      return;
    }
    if (result === RESULTS.BLOCKED) {
      setPermissionSheetMode('BLOCKED');
      setShowPermissionSheet(true);
      return;
    }
    // First-time / not-yet-asked: prime with the custom sheet before the
    // native OS prompt.
    setPermissionSheetMode('PRIMING');
    setShowPermissionSheet(true);
  }, [fetchLocation]);

  const onPrimaryPermissionPress = useCallback(async () => {
    setShowPermissionSheet(false);
    if (permissionSheetMode === 'BLOCKED') {
      openSettings().catch(() => {});
      return;
    }
    if (permissionSheetMode === 'GPS_OFF') {
      openLocationSettings();
      return;
    }
    await requestLocationPermission();
  }, [permissionSheetMode, openLocationSettings, requestLocationPermission]);

  const onChooseManuallyPress = useCallback(() => {
    setShowPermissionSheet(false);
    setShowSearchSheet(true);
  }, []);

  // ---- Area picker / manual search callbacks ----

  const onAreaPickerSkip = useCallback(async () => {
    stopAutoNavigateTimer();
    const areaToPass = listOfLocations?.[0] ?? DEFAULT_AREA;
    await editPincode(areaToPass);
    setShowAreaPicker(false);
    proceedToSuccess(areaToPass);
  }, [listOfLocations, editPincode, proceedToSuccess, stopAutoNavigateTimer]);

  const onAreaPickerApply = useCallback(async () => {
    if (!selectedLocation) {
      Toast.show('Please select an area', Toast.SHORT);
      return;
    }
    stopAutoNavigateTimer();
    await editPincode(selectedLocation);
    setShowAreaPicker(false);
    setSelectedLocation(null);
    proceedToSuccess(selectedLocation);
  }, [selectedLocation, editPincode, proceedToSuccess, stopAutoNavigateTimer]);

  const onManualPlaceSelected = useCallback(
    async (data, details) => {
      stopAutoNavigateTimer();
      const newRegion = {
        latitude: Number(details.geometry.location.lat),
        longitude: Number(details.geometry.location.lng),
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setAddressComponent(details);
      setShowSearchSheet(false);
      await AsyncStorage.setItem('manualOverride', 'true');
      await AsyncStorage.setItem('manualRegion', JSON.stringify(newRegion));
      await AsyncStorage.setItem('manualAddress', JSON.stringify(details));
      forceAdvancePastGps();
      reverseGeocode(newRegion.latitude, newRegion.longitude);
    },
    [stopAutoNavigateTimer, forceAdvancePastGps, reverseGeocode],
  );

  const onSkipAll = useCallback(async () => {
    stopAutoNavigateTimer();
    const areaToPass = listOfLocations?.length > 0 ? listOfLocations[0] : DEFAULT_AREA;
    await editPincode(areaToPass);
    setLocationNotFetched(false);
    navigateAfterLocation();
  }, [listOfLocations, editPincode, setLocationNotFetched, navigateAfterLocation, stopAutoNavigateTimer]);

  // ---- Mount / lifecycle ----

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const savedOverride = await AsyncStorage.getItem('manualOverride');
      const storedPincodeAreaId = await secureStore.getItem('pincodeAreaId');

      if (savedOverride === 'true' || storedPincodeAreaId) {
        if (cancelled) return;
        setIsFastPath(true);
        const savedAddress = await AsyncStorage.getItem('manualAddress');
        if (savedAddress) setAddressComponent(JSON.parse(savedAddress));
        const id = setTimeout(() => {
          setLocationNotFetched(false);
          navigateAfterLocation();
        }, FAST_PATH_DELAY_MS);
        pendingTimeoutsRef.current.push(id);
        return;
      }

      if (cancelled) return;
      stepStartTimesRef.current[STEPS.GPS] = Date.now();
      initPermissionFlow();
      startAutoNavigateTimer();
    };

    init();

    return () => {
      cancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      // Intentionally read live: pendingTimeoutsRef accumulates ids pushed
      // by callbacks (fetchLocation, proceedToSuccess, ...) for the whole
      // lifetime of the hook, not just this effect.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      pendingTimeoutsRef.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async nextState => {
      if (nextState !== 'active') return;
      if (step !== STEPS.GPS) return;

      const savedOverride = await AsyncStorage.getItem('manualOverride');
      const storedPincodeAreaId = await secureStore.getItem('pincodeAreaId');
      if (savedOverride === 'true' || storedPincodeAreaId) return;

      const result = await check(LOCATION_PERMISSION);
      const gpsEnabled = await DeviceInfo.isLocationEnabled();
      if ((result === RESULTS.GRANTED || result === RESULTS.LIMITED) && gpsEnabled) {
        setShowPermissionSheet(false);
        fetchLocation();
      }
    });
    return () => subscription.remove();
  }, [step, fetchLocation]);

  return {
    step,
    completedSteps,
    resolvedArea,
    addressComponent,
    isFastPath,

    showAreaPicker,
    setShowAreaPicker,
    listOfLocations,
    selectedLocation,
    setSelectedLocation,
    onAreaPickerSkip,
    onAreaPickerApply,

    showSearchSheet,
    setShowSearchSheet,
    onManualPlaceSelected,

    showPermissionSheet,
    setShowPermissionSheet,
    permissionSheetMode,
    onPrimaryPermissionPress,
    onChooseManuallyPress,

    onSkipAll,
    stopAutoNavigateTimer,
    navigateAfterLocation,
  };
}

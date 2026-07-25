import { useState, useEffect, useRef, useContext } from 'react';
import {
  Platform,
  PermissionsAndroid,
  Linking,
  AppState,
  Alert,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { openSettings } from 'react-native-permissions';

import { AppContext } from '../context/appContext';
import { useCart } from '../context/CartContext';
import { getAreasByPincode } from '../api';
import { getAddressListApi } from '../api/addressService';
import { GOOGLE_MAPS_API_KEY } from '../globals/secrets';
import { normalizeString, isFuzzyMatch } from '../utils/addressMatch';

export const useLocationFetching = ({ navigation }) => {
  const { profile, editPincode, setLocationNotFetched } =
    useContext(AppContext);
  const { showConfirmation } = useCart();

  const [addressComponent, setAddressComponent] = useState(null);
  const [locationSelectionModal, setLocationSelectionModal] = useState(false);
  const [locationSearchModal, setLocationSearchModal] = useState(false);
  const [listOfLocations, setListOfLocations] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [dummy, setDummy] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);

  const [region, setRegion] = useState({
    latitude: 10.0224066,
    longitude: 76.3041375,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
  });

  const userInteractedRef = useRef(false);
  const timeoutRef = useRef(null);
  // Single-flight + mount guards. Async work here (geolocation callbacks,
  // network promises, timers, the AppState re-fetch) can resolve AFTER the user
  // has already left this screen. Without these guards a late resolution calls
  // navigateAfterLocation() again and resets the stack back to AuthSuccessScreen
  // even though the user is now on Home — the "app jumps to AuthSuccess" bug.
  const hasNavigatedRef = useRef(false);
  const isMountedRef = useRef(true);
  const pendingTimeoutsRef = useRef([]);

  // setTimeout wrapper that (a) is tracked so it can be cleared on unmount and
  // (b) no-ops its callback if the screen has already unmounted.
  const registerTimeout = (fn, delay) => {
    const id = setTimeout(() => {
      pendingTimeoutsRef.current = pendingTimeoutsRef.current.filter(
        t => t !== id,
      );
      if (isMountedRef.current) fn();
    }, delay);
    pendingTimeoutsRef.current.push(id);
    return id;
  };

  const navigateAfterLocation = () => {
    // Bail if we've already navigated away or the screen has unmounted, so a
    // stale async callback can't pull the user back to AuthSuccessScreen.
    if (hasNavigatedRef.current || !isMountedRef.current) return;
    hasNavigatedRef.current = true;
    if (profile?.custId) {
      navigation.reset({ index: 0, routes: [{ name: 'AuthSuccessScreen' }] });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen', params: { type: 'login' } }],
      });
    }
  };

  // Leave the location screen without a pincode so the app continues and the
  // header shows "Select Location". Used when the user denies permission / GPS.
  const continueWithoutLocation = () => {
    stopAutoNavigateTimer();
    setShowConfirm(false);
    setLocationNotFetched(true);
    navigateAfterLocation();
  };

  const openLocationSettings = () => {
    if (Platform.OS !== 'android') return;

    // Try all safe fallback options
    Linking.openSettings().catch(() => {});
    Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS').catch(
      () => {},
    );
    Linking.openURL('package:com.android.settings').catch(() => {});
  };

  const startAutoNavigateTimer = () => {
    timeoutRef.current = setTimeout(() => {
      // Navigate only if user has NOT interacted
      setLocationNotFetched(false);
      if (!userInteractedRef.current && showConfirm) {
        navigateAfterLocation();
      }
    }, 10000); // 10 seconds
  };

  const stopAutoNavigateTimer = () => {
    // Stop the 10-sec auto navigation when the user interacts
    userInteractedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const funSetAddComponent = value => {
    setAddressComponent(value);
    setDummy(!dummy);
  };

  const reverseGeocode = async (latitude, longitude) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await axios.get(url, { timeout: 10000 });

      const formattedAddress = response.data.results[0]?.formatted_address;
      const geocodeResult = response.data.results[0];
      funSetAddComponent(geocodeResult);

      // Find postal code checking all results (not just results[0])
      let postalCode = null;
      if (response.data.results) {
        for (const res of response.data.results) {
          const pCode = res.address_components?.find(component =>
            component.types.includes('postal_code'),
          )?.long_name;
          if (pCode) {
            postalCode = pCode;
            break;
          }
        }
      }

      // Await the full area-matching flow before clearing loading
      await getLocationPincodeAreas(postalCode, formattedAddress);
    } catch (error) {
      // No hard-coded fallback: land on home with no pincode so the header
      // shows "Select Location".
      setLocationNotFetched(true);
      navigateAfterLocation();
    }
  };

  const getLocationPincodeAreas = async (postcode, formattedAddress) => {
    try {
      // Fetch user's saved addresses to check for a matching pincode
      let addressList = [];
      try {
        const addressRes = await getAddressListApi();
        addressList = Array.isArray(addressRes?.data)
          ? addressRes.data
          : addressRes?.data?.items || addressRes?.data || [];
      } catch (addrErr) {
        // No saved addresses (e.g. guest user) — continue without a match
      }

      // Step 1: Try matching against user's saved addresses
      if (addressList.length > 0) {
        const matchingAddress = addressList.find(addr => {
          // 1. Match by exact pincode
          const pinMatch =
            postcode && String(addr.pincode || addr.pin) === String(postcode);
          if (pinMatch) {
            return true;
          }

          // 2. Dynamic fuzzy match (non-hardcoded) using area details
          if (formattedAddress) {
            if (
              addr.areaName &&
              isFuzzyMatch(addr.areaName, formattedAddress)
            ) {
              return true;
            }
            if (
              addr.pincodeAreaName &&
              isFuzzyMatch(addr.pincodeAreaName, formattedAddress)
            ) {
              return true;
            }
            // Fallback to match normalized sublocality in addLine2 (e.g. Thripunithura)
            const line2Norm = normalizeString(addr.addLine2);
            if (
              line2Norm.length > 3 &&
              normalizeString(formattedAddress).includes(line2Norm)
            ) {
              return true;
            }
          }
          return false;
        });

        if (matchingAddress) {
          const addressId =
            matchingAddress.custAddressId ||
            matchingAddress.addressId ||
            matchingAddress.id;
          if (addressId) {
            await AsyncStorage.setItem('selectedAddressId', String(addressId));
          }
          await editPincode({
            pincodeAreaId: matchingAddress.pincodeAreaId,
            areaName:
              matchingAddress.areaName ||
              matchingAddress.pincodeAreaName ||
              matchingAddress.area_name ||
              matchingAddress.addLine2,
          });

          setShowConfirm(false);
          registerTimeout(() => {
            setLocationNotFetched(false);
            navigateAfterLocation();
          }, 2000);
          return;
        }
      }

      // Step 2: Guard against null/empty postcode
      if (!postcode || String(postcode).trim().length === 0) {
        // No hard-coded fallback: land on home with no pincode so the header
        // shows "Select Location".
        setShowConfirm(false);
        setLocationNotFetched(true);
        navigateAfterLocation();
        return;
      }

      // Step 3: Look up areas by postal code
      let area = await getAreasByPincode(postcode);

      if (area?.data?.length > 1) {
        // Multiple stores/areas — check if user's current pincodeAreaId is among them
        if (area?.data?.find(obj => obj?.pincodeAreaId == profile?.pincode)) {
          registerTimeout(() => {
            if (!userInteractedRef.current) {
              setLocationNotFetched(false);
              navigateAfterLocation();
            }
          }, 2000);
        } else {
          setShowConfirm(true);
          setListOfLocations(area?.data);
        }
      } else if (area?.data?.length == 1) {
        setShowConfirm(false);
        await editPincode(area.data[0]);
        registerTimeout(() => {
          setLocationNotFetched(false);
          navigateAfterLocation();
        }, 2000);
      } else {
        // No areas found for this pincode (user is outside delivery zone):
        // land on home with no pincode so the header shows "Select Location".
        setShowConfirm(false);
        setLocationNotFetched(true);
        navigateAfterLocation();
      }
    } catch (error) {
      // No hard-coded fallback: land on home with no pincode so the header
      // shows "Select Location".
      setShowConfirm(false);
      setLocationNotFetched(true);
      navigateAfterLocation();
    }
  };

  const fetchLocation = () => {
    const onSuccess = position => {
      setRegion({
        latitude: position?.coords?.latitude,
        longitude: position?.coords?.longitude,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      });

      reverseGeocode(position.coords.latitude, position.coords.longitude);
    };

    const onFinalError = error => {
      // No hard-coded fallback location: land on home with no pincode so the
      // header shows "Select Location" and the user can pick manually.
      setLocationNotFetched(true);
      navigateAfterLocation();
    };

    // Cached / coarse location first (WiFi/cell — very fast on cold start)
    Geolocation.getCurrentPosition(
      onSuccess,
      error => {
        // Escalate to high accuracy, but still accept a recent fix
        // (maximumAge: 0 forces a brand-new fix that times out indoors/cold-start)
        Geolocation.getCurrentPosition(onSuccess, onFinalError, {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 60000,
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 600000, // allow cached location up to 10 minutes old
      },
    );
  };

  const requestLocationPermission = async () => {
    try {
      // First ask permission
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required',
          message: 'This app needs to access your location',
        },
      );

      // Now check the real final status after requesting
      const isGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (!isGranted) {
        showConfirmation({
          title: 'Location Permission Required',
          message:
            'You can continue without location, but enabling it lets us show nearby stores automatically.',
          confirmText: 'Open Settings',
          onConfirm: () => openSettings(),
          cancelText: 'Continue without location',
          onCancel: () => continueWithoutLocation(),
          // Force a choice: back / tapping outside must not strand the user on
          // the location-fetching GIF. Only the two buttons dismiss it.
          dismissible: false,
        });
        return;
      }

      const gpsEnabled = await DeviceInfo.isLocationEnabled();

      if (!gpsEnabled) {
        showConfirmation({
          title: 'Location Services Off',
          message: 'Please enable GPS/location services to continue.',
          confirmText: 'Open Location Settings',
          onConfirm: () => openLocationSettings(),
          cancelText: 'Continue without location',
          onCancel: () => continueWithoutLocation(),
          // Force a choice: back / tapping outside must not strand the user on
          // the location-fetching GIF. Only the two buttons dismiss it.
          dismissible: false,
        });
        return;
      }

      fetchLocation();
    } catch (err) {}
  };

  useEffect(() => {
    const init = async () => {
      const savedOverride = await AsyncStorage.getItem('manualOverride');
      const storedPincodeAreaId = await AsyncStorage.getItem('pincodeAreaId');
      if (savedOverride === 'true' || storedPincodeAreaId) {
        setManualOverride(true);
        const savedRegion = await AsyncStorage.getItem('manualRegion');
        const savedAddress = await AsyncStorage.getItem('manualAddress');
        if (savedRegion) setRegion(JSON.parse(savedRegion));
        if (savedAddress) setAddressComponent(JSON.parse(savedAddress));

        registerTimeout(() => {
          setLocationNotFetched(false);
          navigateAfterLocation();
        }, 1000);
        return;
      }

      if (Platform.OS === 'android') {
        const isGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (isGranted) {
          fetchLocation();
        } else {
          requestLocationPermission();
        }
      } else {
        fetchLocation();
      }
      startAutoNavigateTimer();
    };

    init();

    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      pendingTimeoutsRef.current.forEach(clearTimeout);
      pendingTimeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextState => {
        if (nextState === 'active') {
          // Already navigated away (or unmounting): don't start another location
          // flow that would reset back to AuthSuccessScreen from Home.
          if (hasNavigatedRef.current || !isMountedRef.current) return;
          const savedOverride = await AsyncStorage.getItem('manualOverride');
          const storedPincodeAreaId = await AsyncStorage.getItem(
            'pincodeAreaId',
          );
          if (savedOverride === 'true' || storedPincodeAreaId) {
            return; // Skip auto-fetching: a location is already persisted/chosen
          }

          const gpsEnabled = await DeviceInfo.isLocationEnabled();
          const permission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          if (Platform.OS === 'ios') {
            if (gpsEnabled) {
              fetchLocation();
            }
          }
          if (permission && gpsEnabled) {
            fetchLocation();
          }
        }
      },
    );

    return () => subscription.remove();
  }, []);

  // ---- Handlers exposed to the screen ----

  const onSkip = () => {
    stopAutoNavigateTimer();
    // Skip without setting a location: land on home with no pincode so
    // the header shows "Select Location".
    setShowConfirm(false);
    setLocationNotFetched(true);
    navigateAfterLocation();
  };

  const onSearchIconPress = () => {
    stopAutoNavigateTimer();
    setLocationSearchModal(true);
  };

  const onConfirmPress = () => {
    stopAutoNavigateTimer();
    setConfirmLoading(true);
    setLocationSelectionModal(true);
    setTimeout(() => setConfirmLoading(false), 400);
  };

  const onCloseSearchModal = () => {
    stopAutoNavigateTimer();
    setLocationSearchModal(false);
  };

  const onCloseSelectionModal = () => {
    stopAutoNavigateTimer();
    setLocationSelectionModal(false);
  };

  const onPlaceSelected = async (data, details = null) => {
    stopAutoNavigateTimer();
    const newRegion = {
      latitude: Number(details.geometry.location.lat),
      longitude: Number(details.geometry.location.lng),
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
    setRegion(newRegion);
    funSetAddComponent(details);
    reverseGeocode(
      Number(details.geometry.location.lat),
      Number(details.geometry.location.lng),
    );
    setLocationSearchModal(false);
    setManualOverride(true);
    await AsyncStorage.setItem('manualOverride', 'true');
    await AsyncStorage.setItem('manualRegion', JSON.stringify(newRegion));
    await AsyncStorage.setItem('manualAddress', JSON.stringify(details));
  };

  const onSelectArea = item => {
    stopAutoNavigateTimer();
    setSelectedLocation(item);
  };

  const onSkipAreaSelection = async () => {
    stopAutoNavigateTimer();
    let areaToPass = null;
    if (listOfLocations) {
      areaToPass = listOfLocations[0];
    }
    if (areaToPass) {
      await editPincode(areaToPass);
    }

    setLocationSelectionModal(false);
    setLocationNotFetched(false);
    navigateAfterLocation();
  };

  const onApplyArea = async () => {
    if (selectedLocation === null) {
      Alert.alert('Alert', 'Please select an area');
      return;
    }
    // Show a loader inside the Apply button while the pincode is saved. On
    // success we navigate away (screen unmounts); on failure we restore it.
    setApplyLoading(true);
    try {
      await editPincode(selectedLocation);
      setSelectedLocation(null);
      setLocationSelectionModal(false);
      setLocationNotFetched(false);
      navigateAfterLocation();
    } catch (error) {
      setApplyLoading(false);
      Alert.alert('Alert', 'Something went wrong. Please try again.');
    }
  };

  return {
    addressComponent,
    showConfirm,
    confirmLoading,
    applyLoading,
    locationSelectionModal,
    locationSearchModal,
    listOfLocations,
    selectedLocation,
    onSkip,
    onSearchIconPress,
    onConfirmPress,
    onCloseSearchModal,
    onCloseSelectionModal,
    onPlaceSelected,
    onSelectArea,
    onSkipAreaSelection,
    onApplyArea,
  };
};

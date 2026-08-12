import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import Toast from 'react-native-simple-toast';
import axios from 'axios';

import { addAddressApi, updateAddressApi } from '@/api/addressService';
import { getAreasByPincode } from '@/api';
import { AppContext } from '@/context/appContext';
import { useAddresses } from '@/hooks/useAddresses';
import { GOOGLE_MAPS_API_KEY } from '@/globals/secrets';
import secureStore from '@/utils/secureStore';
import { validatePhoneNumbers } from '@/utils/validation';

import { DEFAULT_COORDS, REGION_DELTA } from './constants';

const geolocationError = error => {
  if (error.code === 1) return 'Permission denied';
  if (error.code === 2) return 'Position unavailable';
  if (error.code === 3) return 'Timeout';
  return 'Failed to fetch location';
};

const useAddLocation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { refreshAddresses } = useAddresses();
  const { editPincode } = useContext(AppContext);

  const isMountedRef = useRef(true);
  const didResolveInitialRef = useRef(false);
  const mapRef = useRef(null);
  const searchRef = useRef(null);

  const editAddress = route.params?.address;
  const isEditMode = !!editAddress;
  const apiKey = GOOGLE_MAPS_API_KEY;

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [pincodeAreaId, setPincodeAreaId] = useState(
    editAddress?.pincodeAreaId || null,
  );

  const [custName, setCustName] = useState(editAddress?.custName || '');
  const [addLine1, setAddLine1] = useState(editAddress?.addLine1 || '');
  const [addLine2, setAddLine2] = useState(editAddress?.addLine2 || '');
  const [landmark, setLandmark] = useState(editAddress?.landmark || '');
  const [phone, setPhone] = useState(editAddress?.phone || '');
  const [pincode, setPincode] = useState(editAddress?.pincode || '');
  const [addressType, setAddressType] = useState(
    editAddress?.addressType || 'HOME',
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(!isEditMode);
  const [isAreasLoading, setIsAreasLoading] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [region, setRegion] = useState({
    latitude: Number(editAddress?.latitude) || DEFAULT_COORDS.latitude,
    longitude: Number(editAddress?.longitude) || DEFAULT_COORDS.longitude,
    ...REGION_DELTA,
  });

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const reverseGeocode = useCallback(
    async (lat, lng) => {
      if (!isMountedRef.current) return;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
      try {
        setIsGeocoding(true);
        const response = await axios.get(url, { timeout: 8000 });
        if (response.data.results && response.data.results.length > 0) {
          const components = response.data.results[0].address_components;
          const pick = type =>
            components.find(c => c.types.includes(type))?.long_name || '';

          const streetNumber = pick('street_number');
          const routeName = pick('route');
          const sublocality2 = pick('sublocality_level_2');
          const sublocality1 = pick('sublocality_level_1');
          const neighborhood = pick('neighborhood');
          const locality = pick('locality');
          const postalCode = pick('postal_code');

          setAddLine1(
            `${streetNumber} ${routeName}`.trim() ||
              sublocality2 ||
              sublocality1 ||
              '',
          );
          setAddLine2((sublocality1 || neighborhood || locality).trim());
          if (postalCode) setPincode(postalCode);
        }
      } catch (error) {
        console.error('Reverse geocode error', error);
      } finally {
        if (isMountedRef.current) setIsGeocoding(false);
      }
    },
    [apiKey],
  );

  const getCurrentLocation = useCallback(
    (showLoader = false) => {
      if (showLoader) setIsLoading(true);

      const onSuccess = position => {
        if (!isMountedRef.current) return;
        const { latitude, longitude } = position.coords;
        const newRegion = { latitude, longitude, ...REGION_DELTA };

        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 600);

        if (!isEditMode) setIsInitialLoading(false);
        reverseGeocode(latitude, longitude);
        if (showLoader) setIsLoading(false);
      };

      const onFinalError = error => {
        if (!isMountedRef.current) return;
        if (!isEditMode) setIsInitialLoading(false);
        if (showLoader) setIsLoading(false);
        Toast.show(geolocationError(error), Toast.SHORT);
      };

      Geolocation.getCurrentPosition(
        onSuccess,
        () => {
          Geolocation.getCurrentPosition(
            onSuccess,
            () => {
              Geolocation.getCurrentPosition(onSuccess, onFinalError, {
                enableHighAccuracy: false,
                timeout: 15000,
                maximumAge: 60000,
              });
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
          );
        },
        { enableHighAccuracy: false, timeout: 1000, maximumAge: 600000 },
      );
    },
    [isEditMode, reverseGeocode],
  );

  const requestLocationPermission = useCallback(async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      return true;
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This app needs access to your location to help you set the delivery address.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }, []);

  useEffect(() => {
    if (didResolveInitialRef.current) return;
    didResolveInitialRef.current = true;

    const resolveInitialLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        getCurrentLocation();
      } else {
        setIsInitialLoading(false);
        Toast.show('Location permission denied', Toast.SHORT);
      }
    };

    if (
      isEditMode &&
      editAddress?.latitude != null &&
      editAddress?.longitude != null
    ) {
      setIsInitialLoading(false);
    } else {
      resolveInitialLocation();
    }
  }, [editAddress, getCurrentLocation, isEditMode, requestLocationPermission]);

  const fetchAreas = useCallback(
    async pin => {
      try {
        setIsAreasLoading(true);
        const response = await getAreasByPincode(pin);
        if (response && response.success && Array.isArray(response.data)) {
          const formattedAreas = response.data.map(area => ({
            label: area.areaName,
            value: area.pincodeAreaId || area.id,
          }));
          setItems(formattedAreas);
          if (formattedAreas.length > 0 && !isEditMode) {
            setPincodeAreaId(formattedAreas[0].value);
          }
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error('Error fetching areas:', error);
        setItems([]);
      } finally {
        setIsAreasLoading(false);
      }
    },
    [isEditMode],
  );

  useEffect(() => {
    if (pincode && pincode.length === 6) {
      fetchAreas(pincode);
    } else {
      setItems([]);
      if (!isEditMode) setPincodeAreaId(null);
    }
  }, [fetchAreas, isEditMode, pincode]);

  const onRegionChange = useCallback(() => setIsDragging(true), []);

  const onRegionChangeComplete = useCallback(
    newRegion => {
      setRegion(newRegion);
      setIsDragging(false);
      reverseGeocode(newRegion.latitude, newRegion.longitude);
    },
    [reverseGeocode],
  );

  const onPlaceSelected = useCallback(
    (data, details) => {
      if (!details) return;
      const description = data.description || details.formatted_address || '';
      searchRef.current?.setAddressText(description);

      const lat = details.geometry.location.lat;
      const lng = details.geometry.location.lng;
      const newRegion = { latitude: lat, longitude: lng, ...REGION_DELTA };

      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 600);
      reverseGeocode(lat, lng);
    },
    [reverseGeocode],
  );

  const handleSave = useCallback(async () => {
    if (!custName || !addLine1 || !phone || !pincode || !pincodeAreaId) {
      Toast.show('Please fill all required fields', Toast.SHORT);
      return;
    }
    if (!validatePhoneNumbers(phone)) {
      Toast.show('Please enter a valid 10-digit phone number', Toast.SHORT);
      return;
    }

    const selectedAreaName =
      items.find(i => i.value === pincodeAreaId)?.label || '';

    const payload = {
      custName,
      addLine1,
      addLine2,
      landmark,
      phone,
      country: 'India',
      state: 'Kerala',
      district: 'Ernakulam',
      pincode,
      pincodeAreaId,
      pincodeAreaName: selectedAreaName,
      latitude: Number(region.latitude),
      longitude: Number(region.longitude),
      addressType,
      isDefaultBillingAddress: true,
      isDefaultShippingAddress: true,
    };

    setIsLoading(true);
    try {
      const response = isEditMode
        ? await updateAddressApi(editAddress.addressId, payload)
        : await addAddressApi(payload);

      if (response && response.success !== false) {
        Toast.show(
          isEditMode ? 'Address updated' : 'Address added',
          Toast.SHORT,
        );

        await editPincode({ pincodeAreaId, areaName: selectedAreaName });

        const savedAddressId =
          response?.data?.custAddressId ||
          response?.data?.addressId ||
          response?.data?.id;
        if (savedAddressId) {
          await secureStore.setItem(
            'selectedAddressId',
            String(savedAddressId),
          );
        }

        await refreshAddresses();
        navigation.goBack();
      } else {
        Toast.show(response?.message || 'Failed to save address', Toast.SHORT);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      Toast.show('An error occurred', Toast.SHORT);
    } finally {
      setIsLoading(false);
    }
  }, [
    addLine1,
    addLine2,
    addressType,
    custName,
    editAddress,
    editPincode,
    isEditMode,
    items,
    landmark,
    navigation,
    phone,
    pincode,
    pincodeAreaId,
    refreshAddresses,
    region,
  ]);

  return {
    apiKey,
    isEditMode,
    mapRef,
    searchRef,
    region,
    isDragging,
    onRegionChange,
    onRegionChangeComplete,
    onPlaceSelected,
    getCurrentLocation,
    form: {
      custName,
      setCustName,
      addLine1,
      setAddLine1,
      addLine2,
      setAddLine2,
      landmark,
      setLandmark,
      phone,
      setPhone,
      pincode,
      setPincode,
      addressType,
      setAddressType,
    },
    area: {
      open,
      setOpen,
      items,
      setItems,
      pincodeAreaId,
      setPincodeAreaId,
      isAreasLoading,
    },
    status: { isLoading, isInitialLoading, isGeocoding },
    onBack: () => navigation.goBack(),
    handleSave,
  };
};

export default useAddLocation;

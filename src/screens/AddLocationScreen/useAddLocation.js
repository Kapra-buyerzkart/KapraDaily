import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import Geolocation from '@react-native-community/geolocation';
import Toast from 'react-native-simple-toast';
import axios from 'axios';

import { addAddressApi, updateAddressApi } from '@/api/addressService';
import { getAreasByPincode } from '@/api';
import { AppContext } from '@/context/appContext';
import { useAddresses } from '@/hooks/useAddresses';
import { GOOGLE_MAPS_API_KEY } from '@/globals/secrets';
import secureStore from '@/utils/secureStore';

import { DEFAULT_COORDS, REGION_DELTA } from './constants';
import {
  ADDRESS_MESSAGES,
  FORM_OPTIONS,
  PINCODE_LENGTH,
  buildDefaultValues,
} from './validationSchema';

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

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    ...FORM_OPTIONS,
    defaultValues: buildDefaultValues(editAddress),
  });

  const addLine1 = watch('addLine1');
  const addLine2 = watch('addLine2');
  const pincode = watch('pincode');

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

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

  const applyValue = useCallback(
    (name, value) =>
      setValue(name, value, {
        shouldDirty: true,
        shouldValidate: value !== '' && value !== null && value !== undefined,
      }),
    [setValue],
  );

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

          applyValue(
            'addLine1',
            `${streetNumber} ${routeName}`.trim() ||
              sublocality2 ||
              sublocality1 ||
              '',
          );
          applyValue(
            'addLine2',
            (sublocality1 || neighborhood || locality).trim(),
          );
          if (postalCode) applyValue('pincode', postalCode);
        }
      } catch (error) {
        console.error('Reverse geocode error', error);
      } finally {
        if (isMountedRef.current) setIsGeocoding(false);
      }
    },
    [apiKey, applyValue],
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
            applyValue('pincodeAreaId', formattedAreas[0].value);
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
    [applyValue, isEditMode],
  );

  useEffect(() => {
    if (pincode && pincode.length === PINCODE_LENGTH) {
      fetchAreas(pincode);
    } else {
      setItems([]);
      if (!isEditMode) setValue('pincodeAreaId', null);
    }
  }, [fetchAreas, isEditMode, pincode, setValue]);

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

  const onValid = useCallback(
    async values => {
      const selectedAreaName =
        items.find(i => i.value === values.pincodeAreaId)?.label || '';

      const payload = {
        custName: values.custName.trim(),
        addLine1: values.addLine1.trim(),
        addLine2: values.addLine2.trim(),
        landmark: values.landmark.trim(),
        phone: values.phone,
        country: 'India',
        state: 'Kerala',
        district: 'Ernakulam',
        pincode: values.pincode,
        pincodeAreaId: values.pincodeAreaId,
        pincodeAreaName: selectedAreaName,
        latitude: Number(region.latitude),
        longitude: Number(region.longitude),
        addressType: values.addressType,
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

          await editPincode({
            pincodeAreaId: values.pincodeAreaId,
            areaName: selectedAreaName,
          });

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
          Toast.show(
            response?.message || 'Failed to save address',
            Toast.SHORT,
          );
        }
      } catch (error) {
        console.error('Error saving address:', error);
        Toast.show('An error occurred', Toast.SHORT);
      } finally {
        if (isMountedRef.current) setIsLoading(false);
      }
    },
    [
      editAddress,
      editPincode,
      isEditMode,
      items,
      navigation,
      refreshAddresses,
      region,
    ],
  );

  const onInvalid = useCallback(() => {
    Toast.show(ADDRESS_MESSAGES.submitBlocked, Toast.SHORT);
  }, []);

  const handleSave = useCallback(
    () => handleSubmit(onValid, onInvalid)(),
    [handleSubmit, onInvalid, onValid],
  );

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
      control,
      errors,
      addLine1,
      addLine2,
    },
    area: {
      open,
      setOpen,
      items,
      setItems,
      isAreasLoading,
    },
    status: { isLoading, isInitialLoading, isGeocoding, isValid },
    onBack: () => navigation.goBack(),
    handleSave,
  };
};

export default useAddLocation;

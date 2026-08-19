import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Fonts as FONTS } from '../../assets/theme/fonts';

import {
  addAddressApi,
  updateAddressApi,
} from '../../api/services/addressService';
import { getAreasByPincode } from '../../api/services';
import { useAddresses } from '../../hooks/useAddresses';
import { validatePhoneNumbers } from '../../utils/validation';
import { colors } from '../../assets/theme/colours';
import CustomLoader from '../../components/LoadingIndicator'; // Using existing Loader
import styles from './styles';
import { hp } from '../../utils/responsive';

import { GOOGLE_MAPS_API_KEY } from '../../../../globals/secrets';

const AddLocationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { refreshAddresses } = useAddresses();
  const isMountedRef = useRef(true);

  const editAddress = route.params?.address;
  const isEditMode = !!editAddress;

  const [open, setOpen] = useState(false);
  const [pincodeAreaId, setPincodeAreaId] = useState<number | null>(
    editAddress?.pincodeAreaId || null,
  );
  const [items, setItems] = useState<any[]>([]);

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
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  const googleAutocompleteRef = useRef<any>(null);
  const defaultCoords = { latitude: 10.0205, longitude: 76.3052 };

  const [region, setRegion] = useState<Region>({
    latitude: Number(editAddress?.latitude) || defaultCoords.latitude,
    longitude: Number(editAddress?.longitude) || defaultCoords.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const [markerPosition, setMarkerPosition] = useState({
    latitude: Number(editAddress?.latitude) || defaultCoords.latitude,
    longitude: Number(editAddress?.longitude) || defaultCoords.longitude,
  });

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      setHasLocationPermission(true);
      return true;
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
      setHasLocationPermission(isGranted);
      return isGranted;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    if (!isMountedRef.current) return;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      setIsGeocoding(true);
      const response = await axios.get(url, { timeout: 8000 });
      if (response.data.results && response.data.results.length > 0) {
        const result = response.data.results[0];
        const components = result.address_components;

        const streetNumber =
          components.find((c: any) => c.types.includes('street_number'))
            ?.long_name || '';
        const routeName =
          components.find((c: any) => c.types.includes('route'))?.long_name ||
          '';
        const sublocality2 =
          components.find((c: any) => c.types.includes('sublocality_level_2'))
            ?.long_name || '';
        const sublocality1 =
          components.find((c: any) => c.types.includes('sublocality_level_1'))
            ?.long_name || '';
        const neighborhood =
          components.find((c: any) => c.types.includes('neighborhood'))
            ?.long_name || '';
        const locality =
          components.find((c: any) => c.types.includes('locality'))
            ?.long_name || '';
        const postalCode =
          components.find((c: any) => c.types.includes('postal_code'))
            ?.long_name || '';

        setAddLine1(
          `${streetNumber} ${routeName}`.trim() ||
            sublocality2 ||
            sublocality1 ||
            '',
        );
        setAddLine2(`${sublocality1 || neighborhood || locality}`.trim());
        if (postalCode) setPincode(postalCode);
      }
    } catch (error) {
      console.error('Reverse geocode error', error);
    } finally {
      if (isMountedRef.current) setIsGeocoding(false);
    }
  };

  const getCurrentLocation = useCallback(
    (showLoader = false) => {
      if (showLoader) setIsLoading(true);
      console.log('📍 [GEOLOCATION] Fetching current position...');

      const onSuccess = (position: any) => {
        if (!isMountedRef.current) return;
        const { latitude, longitude } = position.coords;
        console.log('📍 [GEOLOCATION] Position received:', latitude, longitude);
        setRegion(prev => ({
          ...prev,
          latitude,
          longitude,
        }));
        setMarkerPosition({ latitude, longitude });
        // Don't block initial screen load on network reverse-geocoding.
        if (!isEditMode) setIsInitialLoading(false);
        reverseGeocode(latitude, longitude);
        if (showLoader) setIsLoading(false);
      };

      const onFinalError = (error: any) => {
        if (!isMountedRef.current) return;
        console.error('📍 [GEOLOCATION] All attempts failed:', error.message);
        setIsInitialLoading(false);
        if (showLoader) setIsLoading(false);
        Toast.show('Failed to fetch location', Toast.SHORT);
      };

      // Tiered logic:
      // 1. Fast path: try cached location first (usually instant)
      Geolocation.getCurrentPosition(
        onSuccess,
        () => {
          console.log(
            '📍 [GEOLOCATION] Cached location failed, trying high accuracy...',
          );
          // 2. Refine with high accuracy
          Geolocation.getCurrentPosition(
            onSuccess,
            error => {
              console.warn(
                '📍 [GEOLOCATION] High accuracy failed, trying low accuracy...',
                error.message,
              );
              // 3. Final fallback: low accuracy
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
    [isEditMode],
  );

  useEffect(() => {
    if (isEditMode) {
      setIsInitialLoading(false);
    } else {
      requestLocationPermission().then(granted => {
        if (granted) getCurrentLocation();
        else setIsInitialLoading(false);
      });
    }
  }, [isEditMode, getCurrentLocation]);

  useEffect(() => {
    if (pincode && pincode.length === 6) {
      fetchAreas(pincode);
    }
  }, [pincode]);

  const fetchAreas = async (pin: string) => {
    try {
      setIsAreasLoading(true);
      const response = await getAreasByPincode(pin);
      if (response && response.success && Array.isArray(response.data)) {
        const formattedAreas = response.data.map((area: any) => ({
          label: area.areaName,
          value: area.pincodeAreaId || area.id,
        }));
        setItems(formattedAreas);
        if (formattedAreas.length === 1 && !isEditMode) {
          setPincodeAreaId(formattedAreas[0].value);
        }
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
    } finally {
      setIsAreasLoading(false);
    }
  };

  const handleSave = async () => {
    if (!custName || !addLine1 || !phone || !pincode || !pincodeAreaId) {
      Toast.show('Please fill all required fields', Toast.SHORT);
      return;
    }

    if (!validatePhoneNumbers(phone)) {
      Toast.show('Invalid phone number', Toast.SHORT);
      return;
    }

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
      pincodeAreaName: items.find(i => i.value === pincodeAreaId)?.label || '',
      latitude: markerPosition.latitude,
      longitude: markerPosition.longitude,
      addressType,
      isDefaultBillingAddress: true,
      isDefaultShippingAddress: true,
    };

    setIsLoading(true);
    try {
      const addressId =
        editAddress?.custAddressId || editAddress?.addressId || editAddress?.id;
      const response = isEditMode
        ? await updateAddressApi(addressId, payload)
        : await addAddressApi(payload);

      if (response && response.success !== false) {
        Toast.show(
          isEditMode ? 'Address updated' : 'Address saved',
          Toast.SHORT,
        );
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
  };

  return (
    <SafeAreaView edges={['top']} style={styles.mainContainer}>
      {/* Map Section */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation={hasLocationPermission}
          showsMyLocationButton={false}
        >
          <Marker
            coordinate={markerPosition}
            draggable
            onDragEnd={(e: any) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setMarkerPosition({ latitude, longitude });
              setRegion(r => ({ ...r, latitude, longitude }));
              reverseGeocode(latitude, longitude);
            }}
          >
            <Ionicons name="location" size={40} color={colors.themeTeal} />
          </Marker>
        </MapView>
        <TouchableOpacity
          style={styles.reCenterButton}
          onPress={() => getCurrentLocation(true)}
        >
          <Ionicons name="locate" size={24} color={colors.themeTeal} />
        </TouchableOpacity>
        {isGeocoding && (
          <View style={styles.geocodingBanner}>
            <ActivityIndicator size="small" color={colors.themeTeal} />
            <Text style={styles.geocodingText}>
              Fetching address details...
            </Text>
          </View>
        )}
      </View>

      <View style={styles.searchAbsoluteContainer}>
        <GooglePlacesAutocomplete
          ref={googleAutocompleteRef}
          placeholder="Search Location"
          textInputProps={{
            placeholderTextColor: '#000000',
            color: '#000000',
            returnKeyType: 'search',
          }}
          onPress={(data, details = null) => {
            if (details?.geometry?.location) {
              const lat = details.geometry.location.lat;
              const lng = details.geometry.location.lng;
              setRegion(prev => ({ ...prev, latitude: lat, longitude: lng }));
              setMarkerPosition({ latitude: lat, longitude: lng });
              reverseGeocode(lat, lng);
            }
          }}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: 'en',
            components: 'country:in',
          }}
          fetchDetails={true}
          enablePoweredByContainer={false}
          keyboardShouldPersistTaps="handled"
          renderLeftButton={() => (
            <View style={{ justifyContent: 'center', paddingLeft: 10 }}>
              <Ionicons name="search" size={20} color={colors.themeTeal} />
            </View>
          )}
          styles={{
            container: {
              flex: 0,
              top: hp('5%'),
            },
            textInputContainer: {
              backgroundColor: colors.white,
              borderRadius: 10,
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              borderWidth: 1,
              borderColor: '#EEE',
            },
            textInput: {
              height: 45,
              color: colors.black,
              fontSize: 16,
              fontFamily: FONTS.poppins.regular,
              backgroundColor: 'transparent',
            },
            listView: {
              backgroundColor: colors.white,
              borderRadius: 10,
              marginTop: 5,
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              zIndex: 1000,
            },
          }}
        />
      </View>

      {/* Form Section */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.detailedAddressContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* <View style={styles.upperDivider} /> */}

          <View style={styles.dragInfoContainer}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={colors.red}
            />
            <Text style={[styles.dragInfoText, { color: colors.red }]}>
              Press and hold the location marker, then drag it to your exact
              location
            </Text>
          </View>

          <View style={styles.topView}>
            <TouchableOpacity
              style={styles.backButtonContainer}
              onPress={() => navigation.goBack()}
            >
              <AntDesign name="arrowleft" size={24} color={colors.black} />
            </TouchableOpacity>
            <Text style={styles.addLocationText}>
              {isEditMode ? 'Edit Address' : 'Add New Address'}
            </Text>
          </View>

          <View style={styles.innerView}>
            <Ionicons
              name="location-outline"
              size={30}
              color={colors.themeTeal}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.fetchingLocation} numberOfLines={1}>
                {addLine1 || (isGeocoding ? 'Fetching...' : 'Select Location')}
              </Text>
              <Text style={styles.addressLineText}>{addLine2 || ''}</Text>
            </View>
          </View>

          <Text style={styles.saveAsText}>Save As</Text>
          <View style={styles.addressTypesContainer}>
            {['HOME', 'OFFICE', 'OTHER'].map(type => (
              <TouchableOpacity
                key={type}
                onPress={() => setAddressType(type)}
                style={[
                  styles.addressTypeContainer,
                  addressType === type && styles.selectedAddressType,
                ]}
              >
                <MaterialCommunityIcons
                  name={
                    type === 'HOME'
                      ? 'home'
                      : type === 'OFFICE'
                      ? 'briefcase'
                      : 'map-marker'
                  }
                  size={18}
                  color={
                    addressType === type ? colors.white : colors.themeDarkGray
                  }
                />
                <Text
                  style={[
                    styles.addressTypeText,
                    addressType === type && styles.selectedTypeText,
                  ]}
                >
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>House / Flat / Block No</Text>
            <TextInput
              style={styles.input}
              value={addLine1}
              onChangeText={setAddLine1}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Apartment / Road / Area</Text>
            <TextInput
              style={styles.input}
              value={addLine2}
              onChangeText={setAddLine2}
            />
          </View>

          <View style={styles.pincodeContainer}>
            <View style={{ width: '48%' }}>
              <Text style={styles.label}>Pincode</Text>
              <TextInput
                style={styles.input}
                value={pincode}
                onChangeText={setPincode}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
            <View style={{ width: '48%' }}>
              <Text style={styles.label}>Area</Text>
              <DropDownPicker
                open={open}
                value={pincodeAreaId}
                items={items}
                setOpen={setOpen}
                setValue={setPincodeAreaId}
                setItems={setItems}
                placeholder="Select Area"
                loading={isAreasLoading}
                style={{ borderColor: colors.themeLightGray }}
                dropDownContainerStyle={{ borderColor: colors.themeLightGray }}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={custName}
              onChangeText={setCustName}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <TouchableOpacity disabled={isLoading} onPress={handleSave}>
            <LinearGradient
              colors={[colors.themeTeal, colors.themeDarkTeal]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradientStyle}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>
                  {isEditMode ? 'Update' : 'Save'} Address
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      {isInitialLoading && <CustomLoader isVisible={true} />}
    </SafeAreaView>
  );
};

export default AddLocationScreen;

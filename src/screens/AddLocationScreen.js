import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
import MapView from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { FONTS } from '../styles/typography';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import LinearGradient from 'react-native-linear-gradient';
import { addAddressApi, updateAddressApi } from '../api/addressService';
import { getAreasByPincode } from '../api';
import Toast from 'react-native-simple-toast';
import { useAddresses } from '../hooks/useAddresses';
import axios from 'axios';
import { validatePhoneNumbers } from '../utils/validation';
import { GOOGLE_MAPS_API_KEY } from '../globals/secrets';
import Geolocation from '@react-native-community/geolocation';
import CustomLoader from '../components/CustomLoader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import icons from '@/assets/icons';
import { AppContext } from '../context/appContext';
import secureStore from '../utils/secureStore';
import {
  INK,
  SURFACE,
  HAIRLINE,
  ACCENT,
  RADIUS,
  SPACE,
  TYPE,
  GUTTER,
  MAX_FONT_SCALE,
} from '@/styles/homeTheme';

const MAP_HEIGHT = hp('45%');
const SHEET_TOP = hp('30%');

const PIN_H = wp('10%');
const PIN_SHADOW_H = wp('1.5%');

const BORDER = 'rgba(17,19,26,0.12)';

const ADDRESS_TYPES = [
  {
    key: 'HOME',
    label: 'Home',
    icon: require('../assets/images/home_primary_color.png'),
  },
  {
    key: 'OFFICE',
    label: 'Office',
    icon: require('../assets/images/office_primary_color.png'),
  },
  {
    key: 'OTHER',
    label: 'Other',
    icon: require('../assets/images/location_five.png'),
  },
];

const DropdownArrowDown = () => (
  <Ionicons name="chevron-down" size={wp('4%')} color={INK.muted} />
);
const DropdownArrowUp = () => (
  <Ionicons name="chevron-up" size={wp('4%')} color={ACCENT.primary} />
);
const DropdownTick = () => (
  <Ionicons name="checkmark" size={wp('4%')} color={ACCENT.primary} />
);

const Field = ({ label, required, wrapperStyle, inputStyle, ...inputProps }) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.inputWrapper, wrapperStyle]}>
      <Text
        style={[styles.label, focused && styles.labelFocused]}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        numberOfLines={1}
      >
        {label}
        {required ? <Text style={styles.requiredMark}> *</Text> : null}
      </Text>
      <TextInput
        placeholderTextColor={INK.muted}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        {...inputProps}
        style={[styles.input, focused && styles.inputFocused, inputStyle]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
};

const AddLocationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { refreshAddresses } = useAddresses();
  const { editPincode } = React.useContext(AppContext);
  const isMountedRef = useRef(true);
  const mapRef = useRef(null);
  const googleAutocompleteRef = useRef(null);

  const editAddress = route.params?.address;
  const isEditMode = !!editAddress;

  const [open, setOpen] = useState(false);
  const [pincodeAreaId, setPincodeAreaId] = useState(
    editAddress?.pincodeAreaId || null,
  );
  const [items, setItems] = useState([]);

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

  const defaultCoords = { latitude: 10.0205, longitude: 76.3052 };
  const apiKey = GOOGLE_MAPS_API_KEY;

  const [region, setRegion] = useState({
    latitude: Number(editAddress?.latitude) || defaultCoords.latitude,
    longitude: Number(editAddress?.longitude) || defaultCoords.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (
      isEditMode &&
      editAddress?.latitude != null &&
      editAddress?.longitude != null
    ) {
      setIsInitialLoading(false);
    } else {
      handleInitialLocation();
    }
  }, []);

  const handleInitialLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      getCurrentLocation();
    } else {
      setIsInitialLoading(false);
      Toast.show('Location permission denied', Toast.SHORT);
    }
  };

  const requestLocationPermission = async () => {
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
  };

  const getCurrentLocation = (showLoader = false) => {
    if (showLoader) setIsLoading(true);

    const onSuccess = position => {
      if (!isMountedRef.current) return;
      const { latitude, longitude } = position.coords;
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

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
      const msg =
        error.code === 1
          ? 'Permission denied'
          : error.code === 2
          ? 'Position unavailable'
          : error.code === 3
          ? 'Timeout'
          : 'Failed to fetch location';
      Toast.show(msg, Toast.SHORT);
    };

    Geolocation.getCurrentPosition(
      onSuccess,
      () => {
        Geolocation.getCurrentPosition(
          onSuccess,
          error => {
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
  };

  const onRegionChangeComplete = newRegion => {
    setRegion(newRegion);
    setIsDragging(false);
    reverseGeocode(newRegion.latitude, newRegion.longitude);
  };

  const onRegionChange = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    if (pincode && pincode.length === 6) {
      fetchAreas(pincode);
    } else {
      setItems([]);
      if (!isEditMode) setPincodeAreaId(null);
    }
  }, [pincode]);

  const fetchAreas = async pin => {
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
  };

  const reverseGeocode = async (lat, lng) => {
    if (!isMountedRef.current) return;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    try {
      setIsGeocoding(true);
      const response = await axios.get(url, { timeout: 8000 });
      if (response.data.results && response.data.results.length > 0) {
        const components = response.data.results[0].address_components;
        const streetNumber =
          components.find(c => c.types.includes('street_number'))?.long_name ||
          '';
        const routeName =
          components.find(c => c.types.includes('route'))?.long_name || '';
        const sublocality2 =
          components.find(c => c.types.includes('sublocality_level_2'))
            ?.long_name || '';
        const sublocality1 =
          components.find(c => c.types.includes('sublocality_level_1'))
            ?.long_name || '';
        const neighborhood =
          components.find(c => c.types.includes('neighborhood'))?.long_name ||
          '';
        const locality =
          components.find(c => c.types.includes('locality'))?.long_name || '';
        const postalCode =
          components.find(c => c.types.includes('postal_code'))?.long_name ||
          '';

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
  };

  const handleSave = async () => {
    if (!custName || !addLine1 || !phone || !pincode || !pincodeAreaId) {
      Toast.show('Please fill all required fields', Toast.SHORT);
      return;
    }
    if (!validatePhoneNumbers(phone)) {
      Toast.show('Please enter a valid 10-digit phone number', Toast.SHORT);
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

        const selectedAreaName =
          items.find(i => i.value === pincodeAreaId)?.label || '';
        await editPincode({
          pincodeAreaId: pincodeAreaId,
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
    <>
      <CustomLoader
        visible={isInitialLoading}
        text="Fetching your location..."
      />

      <SafeAreaView
        edges={['top']}
        style={[
          styles.mainContainer,
          Platform.OS === 'android' && { paddingBottom: insets.bottom },
        ]}
      >
        {}
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={region}
            onRegionChange={onRegionChange}
            onRegionChangeComplete={onRegionChangeComplete}
            showsUserLocation={true}
            showsMyLocationButton={false}
          />

          <View style={styles.fixedPinContainer} pointerEvents="none">
            <Image
              source={require('../assets/images/location_four.png')}
              style={[
                styles.fixedPinImage,
                isDragging && styles.fixedPinLifted,
              ]}
            />
            <View
              style={[styles.pinShadow, isDragging && styles.pinShadowLifted]}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Use my current location"
            style={styles.reCenterButton}
            onPress={() => getCurrentLocation(true)}
          >
            <Ionicons name="locate" size={wp('5%')} color={ACCENT.primary} />
          </TouchableOpacity>
        </View>

        {}
        <View style={styles.searchLayer}>
          <View style={styles.searchAbsoluteContainer}>
            <GooglePlacesAutocomplete
              ref={googleAutocompleteRef}
              onFail={error =>
                Alert.alert('Google Places Error', String(error))
              }
              placeholder="Search for an area, street or landmark"
              textInputProps={{
                placeholderTextColor: INK.muted,
                color: INK.strong,
                returnKeyType: 'search',
                maxFontSizeMultiplier: MAX_FONT_SCALE,
              }}
              renderLeftButton={() => (
                <Ionicons
                  name="search"
                  size={wp('4.4%')}
                  color={INK.muted}
                  style={styles.searchIcon}
                />
              )}
              fetchDetails={true}
              onPress={(data, details = null) => {
                if (details) {
                  const description =
                    data.description || details.formatted_address || '';
                  googleAutocompleteRef.current?.setAddressText(description);

                  const lat = details.geometry.location.lat;
                  const lng = details.geometry.location.lng;
                  const newRegion = {
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  };

                  setRegion(newRegion);
                  mapRef.current?.animateToRegion(newRegion, 600);
                  reverseGeocode(lat, lng);
                }
              }}
              query={{ key: apiKey, language: 'en', components: 'country:in' }}
              styles={{
                container: { flex: 0 },
                textInputContainer: {
                  backgroundColor: SURFACE.base,
                  borderRadius: RADIUS.md,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: BORDER,
                  height: hp('5.8%'),
                  paddingHorizontal: SPACE.md,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowColor: '#0B1020',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.1,
                  shadowRadius: 16,
                  elevation: 6,
                },
                textInput: {
                  ...TYPE.label,
                  fontFamily: FONTS.gilroy.regular,
                  color: INK.strong,
                  height: hp('5.8%'),
                  flex: 1,
                  paddingVertical: 0,
                  paddingHorizontal: 0,
                  backgroundColor: 'transparent',
                },
                description: {
                  ...TYPE.label,
                  fontFamily: FONTS.gilroy.regular,
                  color: INK.base,
                },
                predefinedPlacesDescription: { color: INK.base },
                listView: {
                  backgroundColor: SURFACE.base,
                  borderRadius: RADIUS.md,
                  marginTop: SPACE.sm,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: BORDER,
                  overflow: 'hidden',
                  shadowColor: '#0B1020',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.1,
                  shadowRadius: 16,
                  elevation: 6,
                  position: 'absolute',
                  top: hp('6%'),
                  width: '100%',
                  zIndex: 100,
                },
                row: {
                  paddingHorizontal: SPACE.md,
                  paddingVertical: SPACE.md,
                  minHeight: hp('6%'),
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: SURFACE.base,
                },
                separator: {
                  height: StyleSheet.hairlineWidth,
                  backgroundColor: HAIRLINE,
                },
                loader: {
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  height: 20,
                },
              }}
            />
          </View>

          {isGeocoding && !isInitialLoading && (
            <View style={styles.geocodingBanner}>
              <ActivityIndicator size="small" color={ACCENT.primary} />
              <Text
                style={styles.geocodingText}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                Fetching address…
              </Text>
            </View>
          )}
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.sheet}>
            {}
            <View style={styles.grabHandle} />
            <View style={styles.topView}>
              <TouchableOpacity
                style={styles.backButtonContainer}
                onPress={() => navigation.goBack()}
                accessibilityRole="button"
                accessibilityLabel="Go back"
                hitSlop={40}
              >
                <Image source={icons.backArrowNew} style={styles.backIcon} />
              </TouchableOpacity>
              <Text
                style={styles.addLocationText}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                {isEditMode ? 'Edit location' : 'Add location'}
              </Text>
            </View>

            <ScrollView
              style={styles.detailedAddressContainer}
              contentContainerStyle={styles.detailedAddressContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.innerView}>
                <View style={styles.locationWell}>
                  <Image
                    style={styles.locationIcon}
                    source={require('../assets/images/location_four.png')}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={styles.fetchingLocation}
                    numberOfLines={2}
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                  >
                    {addLine1 ||
                      (isGeocoding || isInitialLoading
                        ? 'Fetching Location...'
                        : 'Address not found')}
                  </Text>
                  {!!addLine2 && (
                    <Text
                      style={styles.addressLineText}
                      numberOfLines={1}
                      maxFontSizeMultiplier={MAX_FONT_SCALE}
                    >
                      {addLine2}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.delboyContainer}>
                <Image
                  style={styles.delBoyImage}
                  source={require('../assets/images/del_boy.png')}
                />
                <View style={styles.detailedLocationContainer}>
                  <Text
                    style={styles.detailedLocationText}
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                  >
                    Detailed location for helping our
                  </Text>
                  <Text
                    style={[
                      styles.detailedLocationText,
                      styles.detailedLocationEmphasis,
                    ]}
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                  >
                    delivery boy
                  </Text>
                </View>
              </View>

              <Text
                style={styles.saveAsText}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                Save as
              </Text>
              <View style={styles.addressTypesContainer}>
                {ADDRESS_TYPES.map(({ key, label, icon }, index) => {
                  const active = addressType === key;
                  const isLast = index === ADDRESS_TYPES.length - 1;
                  return (
                    <TouchableOpacity
                      key={key}
                      activeOpacity={0.85}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      accessibilityLabel={`Save as ${label}`}
                      onPress={() => setAddressType(key)}
                      style={[
                        styles.addressTypeContainer,
                        isLast && { marginRight: 0 },
                        active && styles.addressTypeContainerActive,
                      ]}
                    >
                      <Image
                        style={[
                          styles.addressTypeIcon,
                          active && styles.addressTypeIconActive,
                        ]}
                        source={icon}
                      />
                      <Text
                        style={[
                          styles.addressTypeText,
                          active && styles.addressTypeTextActive,
                        ]}
                        maxFontSizeMultiplier={MAX_FONT_SCALE}
                        numberOfLines={1}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Field
                label="Full Address House / Flat / Block no"
                required
                value={addLine1}
                onChangeText={setAddLine1}
              />

              <Field
                label="Appartment / Road / Area"
                value={addLine2}
                onChangeText={setAddLine2}
              />

              <View style={[styles.pincodeContainer, { zIndex: 10 }]}>
                <Field
                  label="PIN Code"
                  required
                  wrapperStyle={styles.pincodeField}
                  value={pincode}
                  onChangeText={setPincode}
                  keyboardType="numeric"
                  maxLength={6}
                />
                <View style={styles.areaField}>
                  <DropDownPicker
                    open={open}
                    value={pincodeAreaId}
                    items={items}
                    setOpen={setOpen}
                    setValue={setPincodeAreaId}
                    setItems={setItems}
                    placeholder="PIN Code Area"
                    listMode="SCROLLVIEW"
                    placeholderStyle={styles.dropdownPlaceholder}
                    loading={isAreasLoading}
                    style={styles.dropdown}
                    textStyle={styles.dropdownText}
                    dropDownContainerStyle={styles.dropdownContainer}
                    listItemLabelStyle={styles.dropdownText}
                    selectedItemLabelStyle={styles.dropdownSelectedText}
                    ArrowDownIconComponent={DropdownArrowDown}
                    ArrowUpIconComponent={DropdownArrowUp}
                    TickIconComponent={DropdownTick}
                  />
                  {}
                  <Text
                    style={styles.label}
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                    numberOfLines={1}
                  >
                    Area
                    <Text style={styles.requiredMark}> *</Text>
                  </Text>
                </View>
              </View>

              <Field
                label="Land mark / Delivery instruction"
                wrapperStyle={styles.landmarkWrapper}
                inputStyle={styles.landmarkInput}
                placeholder="eg. Near Lulu Mall"
                value={landmark}
                onChangeText={setLandmark}
                multiline
              />

              <Field
                label="Customer name"
                required
                value={custName}
                onChangeText={setCustName}
              />

              <Field
                label="Phone number"
                required
                placeholder="Enter mobile number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
              />

              <TouchableOpacity
                activeOpacity={0.9}
                disabled={isLoading}
                onPress={handleSave}
                accessibilityRole="button"
                accessibilityState={{ disabled: isLoading, busy: isLoading }}
                accessibilityLabel={
                  isEditMode ? 'Update address' : 'Save address'
                }
                style={[styles.saveButton, isLoading && styles.saveButtonBusy]}
              >
                <LinearGradient
                  colors={[ACCENT.primary, '#FF7B3A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradientStyle}
                >
                  {isLoading ? (
                    <ActivityIndicator color={INK.onDark} />
                  ) : (
                    <Text
                      style={styles.buttonText}
                      maxFontSizeMultiplier={MAX_FONT_SCALE}
                    >
                      {isEditMode ? 'UPDATE ADDRESS' : 'SAVE ADDRESS'}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default AddLocationScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: SURFACE.base,
  },

  mapContainer: {
    width: wp('100%'),
    height: MAP_HEIGHT,
    position: 'absolute',
    top: 0,
  },
  map: {
    flex: 1,
  },

  fixedPinContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    top: MAP_HEIGHT / 2 - (PIN_H + PIN_SHADOW_H / 2 + 2),
    zIndex: 10,
  },
  fixedPinImage: {
    width: wp('8%'),
    height: PIN_H,
    resizeMode: 'contain',
    tintColor: ACCENT.primary,
  },
  fixedPinLifted: {
    transform: [{ translateY: -6 }],
  },
  pinShadow: {
    width: wp('4%'),
    height: PIN_SHADOW_H,
    borderRadius: wp('2%'),
    backgroundColor: 'rgba(0,0,0,0.18)',
    marginTop: 2,
    alignSelf: 'center',
  },
  pinShadowLifted: {
    width: wp('3%'),
    height: wp('1%'),
    backgroundColor: 'rgba(0,0,0,0.10)',
  },

  reCenterButton: {
    position: 'absolute',
    bottom: MAP_HEIGHT - SHEET_TOP + SPACE.md,
    right: GUTTER,
    backgroundColor: SURFACE.base,
    width: wp('11%'),
    height: wp('11%'),
    borderRadius: RADIUS.pill,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER,
    shadowColor: '#0B1020',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },

  searchLayer: {
    zIndex: 999,
    elevation: 10,
  },
  searchAbsoluteContainer: {
    width: wp('100%') - GUTTER * 2,
    alignSelf: 'center',
    marginTop: SPACE.md,
    zIndex: 999,
    elevation: 10,
  },
  searchIcon: {
    marginRight: SPACE.sm,
  },
  geocodingBanner: {
    alignSelf: 'center',
    marginTop: SPACE.sm,
    backgroundColor: SURFACE.base,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACE.xs,
    paddingHorizontal: SPACE.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER,
    shadowColor: '#0B1020',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  geocodingText: {
    marginLeft: SPACE.sm,
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.medium,
    color: INK.base,
  },

  sheet: {
    flex: 1,
    backgroundColor: SURFACE.base,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    marginTop: SHEET_TOP,
    paddingTop: SPACE.sm,
    shadowColor: '#0B1020',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  grabHandle: {
    width: wp('11%'),
    height: 4,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(17,19,26,0.14)',
    alignSelf: 'center',
  },
  detailedAddressContainer: {
    flex: 1,
    paddingHorizontal: GUTTER,
  },
  detailedAddressContent: {
    paddingBottom: hp('4%'),
  },
  topView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.md,
    paddingBottom: SPACE.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: HAIRLINE,
  },
  backButtonContainer: {
    paddingRight: SPACE.xs,
  },
  backIcon: {
    resizeMode: 'contain',
    tintColor: INK.strong,
  },
  addLocationText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.65%'),
    color: INK.strong,
    flex: 1,
    marginLeft: wp('3%'),
    letterSpacing: -0.3,
  },

  innerView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE.tint,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.md,
    marginTop: SPACE.base,
  },
  locationWell: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: RADIUS.pill,
    backgroundColor: ACCENT.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACE.md,
  },
  locationIcon: {
    width: wp('4%'),
    height: wp('5%'),
    resizeMode: 'contain',
    tintColor: ACCENT.primary,
  },
  fetchingLocation: {
    color: INK.strong,
    fontFamily: FONTS.gilroy.semiBold,
    ...TYPE.body,
  },
  addressLineText: {
    color: INK.muted,
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.regular,
    marginTop: 2,
  },

  delboyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE.sunken,
    borderRadius: RADIUS.md,
    paddingVertical: SPACE.sm,
    paddingHorizontal: SPACE.md,
    marginTop: SPACE.md,
  },
  delBoyImage: {
    width: wp('11%'),
    height: hp('4.5%'),
    resizeMode: 'contain',
  },
  detailedLocationContainer: {
    marginLeft: SPACE.md,
    flex: 1,
  },
  detailedLocationText: {
    fontFamily: FONTS.gilroy.regular,
    ...TYPE.caption,
    color: INK.base,
  },
  detailedLocationEmphasis: {
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
  },

  saveAsText: {
    fontFamily: FONTS.gilroy.medium,
    ...TYPE.label,
    color: INK.muted,
    marginTop: SPACE.lg,
    marginBottom: SPACE.sm,
  },
  addressTypesContainer: {
    flexDirection: 'row',
    marginBottom: SPACE.xl,
  },
  addressTypeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACE.sm,
    paddingVertical: SPACE.sm,
    marginRight: SPACE.sm,
    minHeight: hp('5%'),
  },
  addressTypeContainerActive: {
    borderWidth: 1,
    borderColor: ACCENT.primary,
    backgroundColor: SURFACE.tint,
  },
  addressTypeIcon: {
    width: wp('4%'),
    height: wp('4%'),
    resizeMode: 'contain',
    tintColor: INK.muted,
  },
  addressTypeIconActive: {
    tintColor: ACCENT.primary,
  },
  addressTypeText: {
    fontFamily: FONTS.gilroy.medium,
    ...TYPE.label,
    color: INK.base,
    marginLeft: SPACE.xs,
  },
  addressTypeTextActive: {
    fontFamily: FONTS.gilroy.semiBold,
    color: ACCENT.primary,
  },

  inputWrapper: {
    marginBottom: SPACE.lg,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    top: -hp('0.95%'),
    left: SPACE.md,
    backgroundColor: SURFACE.base,
    paddingHorizontal: SPACE.xs,
    ...TYPE.caption,
    color: INK.muted,
    zIndex: 1,
    fontFamily: FONTS.gilroy.medium,
  },
  labelFocused: {
    color: ACCENT.primary,
  },
  requiredMark: {
    color: ACCENT.primary,
  },
  input: {
    minHeight: hp('5.8%'),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACE.base,
    paddingVertical: SPACE.sm,
    ...TYPE.label,
    color: INK.strong,
    fontFamily: FONTS.gilroy.regular,
  },
  inputFocused: {
    borderWidth: 1,
    borderColor: ACCENT.primary,
    backgroundColor: SURFACE.tint,
  },
  landmarkWrapper: {
    marginBottom: SPACE.lg,
  },
  landmarkInput: {
    minHeight: hp('8%'),
    textAlignVertical: 'top',
  },

  pincodeContainer: {
    flexDirection: 'row',
  },
  pincodeField: {
    flex: 1,
    marginRight: SPACE.md,
  },
  areaField: {
    flex: 1,
    marginBottom: SPACE.lg,
    position: 'relative',
  },
  dropdown: {
    minHeight: hp('5.8%'),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACE.base,
    backgroundColor: SURFACE.base,
  },
  dropdownContainer: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER,
    borderRadius: RADIUS.sm,
    backgroundColor: SURFACE.base,
  },
  dropdownText: {
    ...TYPE.label,
    fontFamily: FONTS.gilroy.regular,
    color: INK.strong,
  },
  dropdownSelectedText: {
    fontFamily: FONTS.gilroy.semiBold,
    color: ACCENT.primary,
  },
  dropdownPlaceholder: {
    ...TYPE.label,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
  },

  saveButton: {
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    marginTop: SPACE.sm,
    marginBottom: SPACE.lg,
    shadowColor: ACCENT.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 6,
  },
  saveButtonBusy: {
    opacity: 0.7,
  },
  buttonGradientStyle: {
    height: hp('6.2%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: INK.onDark,
    fontFamily: FONTS.gilroy.bold,
    ...TYPE.body,
    letterSpacing: 0.6,
  },
});

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import MapView from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  addAddressApi,
  updateAddressApi,
  getAreasByPincode,
} from '../../api/services/addressService';
import { useAddresses } from '../../hooks/useAddresses';
import { validatePhoneNumbers } from '../../utils/validation';
import {
  UI_COLORS,
  UI_SPACING,
  MAX_FONT_SCALE,
  hitSlopTo,
  wp,
} from '../../theme/tokens';
import { AppText, IconDisc } from '../../components/atoms';
import styles, { placesStyles } from './styles';

const GOOGLE_MAPS_API_KEY = 'AIzaSyDhItv0zoWdQbDh-5jjKLAEjwRDDrFNc1Y';
const DEFAULT_COORDS = { latitude: 10.0205, longitude: 76.3052 };
const ADDRESS_TYPES = [
  { key: 'HOME', label: 'Home', icon: 'home' },
  { key: 'OFFICE', label: 'Office', icon: 'briefcase' },
  { key: 'OTHER', label: 'Other', icon: 'map-marker' },
];

const IS_ANDROID = Platform.OS === 'android';

const useStableCallback = <T extends (...args: any[]) => any>(fn: T) => {
  const ref = useRef(fn);
  ref.current = fn;
  return useCallback((...args: any[]) => ref.current(...args), []) as T;
};

const SectionTitle = memo<{ title: string; hint?: string }>(
  ({ title, hint }) => (
    <View style={styles.sectionTitleWrap}>
      <View style={styles.sectionTitleRow}>
        <View style={styles.sectionTitleBar} />
        <AppText variant="labelStrong" numberOfLines={1}>
          {title}
        </AppText>
      </View>
      {hint ? (
        <AppText variant="micro" tone="muted" style={styles.sectionTitleHint}>
          {hint}
        </AppText>
      ) : null}
    </View>
  ),
);

const FieldLabel = memo<{
  label: string;
  required?: boolean;
  isActive?: boolean;
  style?: any;
}>(({ label, required, isActive, style }) => (
  <Text
    maxFontSizeMultiplier={MAX_FONT_SCALE}
    numberOfLines={1}
    style={[styles.fieldLabel, isActive && styles.fieldLabelActive, style]}
  >
    {label}
    {required ? <Text style={styles.fieldRequired}> *</Text> : null}
  </Text>
));

type FieldProps = React.ComponentProps<typeof TextInput> & {
  label: string;
  required?: boolean;
  wrapperStyle?: any;
  inputStyle?: any;
};

const Field = memo<FieldProps>(
  ({ label, required, wrapperStyle, inputStyle, ...inputProps }) => {
    const [focused, setFocused] = useState(false);
    const onFocus = useCallback(() => setFocused(true), []);
    const onBlur = useCallback(() => setFocused(false), []);

    return (
      <View style={[styles.fieldWrapper, wrapperStyle]}>
        <FieldLabel label={label} required={required} isActive={focused} />
        <TextInput
          placeholderTextColor={UI_COLORS.textFaint}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
          accessibilityLabel={label}
          underlineColorAndroid="transparent"
          autoCorrect={false}
          {...inputProps}
          style={[styles.input, focused && styles.inputFocused, inputStyle]}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </View>
    );
  },
);

type MapPanelProps = {
  mapRef: React.MutableRefObject<MapView | null>;
  initialRegion: any;
  hasLocationPermission: boolean;
  isDragging: boolean;
  isGeocoding: boolean;
  isInitialLoading: boolean;
  topInset: number;
  onMapReady: () => void;
  onRegionChange: () => void;
  onRegionChangeComplete: (region: any) => void;
  onPlaceSelected: (lat: number, lng: number) => void;
  onRecenter: () => void;
  onBack: () => void;
};

const MapPanel = memo<MapPanelProps>(
  ({
    mapRef,
    initialRegion,
    hasLocationPermission,
    isDragging,
    isGeocoding,
    isInitialLoading,
    topInset,
    onMapReady,
    onRegionChange,
    onRegionChangeComplete,
    onPlaceSelected,
    onRecenter,
    onBack,
  }) => {
    const placesQuery = useMemo(
      () => ({
        key: GOOGLE_MAPS_API_KEY,
        language: 'en',
        components: 'country:in',
      }),
      [],
    );

    const textInputProps = useMemo(
      () => ({
        placeholderTextColor: UI_COLORS.textFaint,
        returnKeyType: 'search' as const,
        maxFontSizeMultiplier: MAX_FONT_SCALE,
        underlineColorAndroid: 'transparent' as const,
      }),
      [],
    );

    const handlePlacePress = useCallback(
      (_data: any, details: any = null) => {
        const loc = details?.geometry?.location;
        if (loc) onPlaceSelected(loc.lat, loc.lng);
      },
      [onPlaceSelected],
    );

    const renderLeftButton = useCallback(
      () => (
        <Ionicons
          name="search"
          size={wp('4.4%')}
          color={UI_COLORS.textMuted}
          style={styles.searchIcon}
        />
      ),
      [],
    );

    return (
      <>
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={initialRegion}
            onMapReady={onMapReady}
            onRegionChange={onRegionChange}
            onRegionChangeComplete={onRegionChangeComplete}
            showsUserLocation={hasLocationPermission}
            showsMyLocationButton={false}
            moveOnMarkerPress={false}
            toolbarEnabled={false}
          />

          <View style={styles.pinWrap} pointerEvents="none">
            <View
              style={[styles.pinCallout, isDragging && styles.pinCalloutHidden]}
            >
              <AppText variant="captionStrong" numberOfLines={1}>
                Order will be delivered here
              </AppText>
              <AppText variant="micro" tone="muted" numberOfLines={1}>
                Move the map to set exact spot
              </AppText>
              <View style={styles.pinCalloutTail} />
            </View>

            <Ionicons
              name="location"
              size={wp('11%')}
              color={UI_COLORS.primary}
              style={[styles.pinIcon, isDragging && styles.pinIconLifted]}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Use my current location"
            hitSlop={hitSlopTo(44)}
            style={styles.recenterButton}
            onPress={onRecenter}
          >
            <Ionicons
              name="locate"
              size={wp('4.2%')}
              color={UI_COLORS.textPrimary}
            />
            <AppText variant="captionStrong">Use current location</AppText>
          </TouchableOpacity>
        </View>

        <View
          pointerEvents="box-none"
          style={[styles.overlay, { top: topInset }]}
        >
          <View pointerEvents="box-none" style={styles.overlayRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={hitSlopTo(44)}
              onPress={onBack}
              style={styles.floatingButton}
            >
              <Ionicons
                name="arrow-back"
                size={wp('5.2%')}
                color={UI_COLORS.textPrimary}
              />
            </TouchableOpacity>

            <View style={styles.searchLayer}>
              <GooglePlacesAutocomplete
                placeholder="Search area, street or landmark"
                textInputProps={textInputProps}
                onPress={handlePlacePress}
                query={placesQuery}
                fetchDetails
                debounce={300}
                enablePoweredByContainer={false}
                keyboardShouldPersistTaps="handled"
                renderLeftButton={renderLeftButton}
                styles={placesStyles}
              />

              {isGeocoding && !isInitialLoading ? (
                <View style={styles.geocodingBanner}>
                  <ActivityIndicator size="small" color={UI_COLORS.textMuted} />
                  <AppText variant="caption" tone="secondary">
                    Fetching address…
                  </AppText>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </>
    );
  },
);

const AddLocationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { refreshAddresses, clearSelectedAddress } = useAddresses();
  const insets = useSafeAreaInsets();

  const isMountedRef = useRef(true);
  const mapRef = useRef<MapView | null>(null);

  const editAddress = route.params?.address;
  const isEditMode = !!editAddress;

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [pincodeAreaId, setPincodeAreaId] = useState<number | null>(
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
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  const initialRegion = useRef({
    latitude: Number(editAddress?.latitude) || DEFAULT_COORDS.latitude,
    longitude: Number(editAddress?.longitude) || DEFAULT_COORDS.longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  }).current;

  const targetRegionRef = useRef(initialRegion);
  const isMapReadyRef = useRef(false);
  const isDraggingRef = useRef(false);
  const markerRef = useRef({
    latitude: initialRegion.latitude,
    longitude: initialRegion.longitude,
  });
  const geocodeAbortRef = useRef<AbortController | null>(null);
  const geocodeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialLoadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const editedFieldsRef = useRef<Record<string, boolean>>({});
  const fetchedPincodeRef = useRef<string | null>(
    editAddress?.pincode || null,
  );

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      geocodeAbortRef.current?.abort();
      if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
      if (initialLoadTimerRef.current) {
        clearTimeout(initialLoadTimerRef.current);
      }
    };
  }, []);

  const requestLocationPermission = useCallback(async () => {
    if (!IS_ANDROID) {
      Geolocation.requestAuthorization();
      setHasLocationPermission(true);
      return true;
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
      if (isMountedRef.current) setHasLocationPermission(isGranted);
      return isGranted;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }, []);

  const reverseGeocode = useStableCallback(async (lat: number, lng: number) => {
    if (!isMountedRef.current) return;

    geocodeAbortRef.current?.abort();
    const controller = new AbortController();
    geocodeAbortRef.current = controller;

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
    try {
      setIsGeocoding(true);
      const response = await axios.get(url, {
        timeout: 8000,
        signal: controller.signal,
      });
      if (!isMountedRef.current || controller.signal.aborted) return;

      const result = response.data?.results?.[0];
      if (result) {
        const components = result.address_components || [];
        const pick = (type: string) =>
          components.find((c: any) => c.types.includes(type))?.long_name || '';

        const streetNumber = pick('street_number');
        const routeName = pick('route');
        const sublocality2 = pick('sublocality_level_2');
        const sublocality1 = pick('sublocality_level_1');
        const neighborhood = pick('neighborhood');
        const locality = pick('locality');
        const postalCode = pick('postal_code');

        const edited = editedFieldsRef.current;
        if (!edited.addLine1) {
          setAddLine1(
            `${streetNumber} ${routeName}`.trim() ||
              sublocality2 ||
              sublocality1 ||
              '',
          );
        }
        if (!edited.addLine2) {
          setAddLine2(`${sublocality1 || neighborhood || locality}`.trim());
        }
        if (postalCode && !edited.pincode) setPincode(postalCode);
      }
    } catch (error: any) {
      if (!axios.isCancel?.(error) && error?.name !== 'CanceledError') {
        console.error('Reverse geocode error', error?.message);
      }
    } finally {
      if (isMountedRef.current && geocodeAbortRef.current === controller) {
        setIsGeocoding(false);
      }
    }
  });

  const scheduleGeocode = useStableCallback((lat: number, lng: number) => {
    editedFieldsRef.current = {};
    if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
    geocodeTimerRef.current = setTimeout(() => reverseGeocode(lat, lng), 350);
  });

  const moveTo = useStableCallback((latitude: number, longitude: number) => {
    targetRegionRef.current = {
      ...targetRegionRef.current,
      latitude,
      longitude,
    };
    markerRef.current = { latitude, longitude };
    if (isMapReadyRef.current) {
      mapRef.current?.animateToRegion(targetRegionRef.current, 400);
    }
    scheduleGeocode(latitude, longitude);
  });

  const handleMapReady = useStableCallback(() => {
    isMapReadyRef.current = true;
    mapRef.current?.animateToRegion(targetRegionRef.current, 0);
  });

  const handleRegionChange = useStableCallback(() => {
    if (isDraggingRef.current) return;
    isDraggingRef.current = true;
    setIsDragging(true);
  });

  const handleRegionChangeComplete = useStableCallback((nextRegion: any) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
    }
    targetRegionRef.current = nextRegion;

    const moved =
      Math.abs(nextRegion.latitude - markerRef.current.latitude) > 1e-5 ||
      Math.abs(nextRegion.longitude - markerRef.current.longitude) > 1e-5;
    if (!moved) return;

    markerRef.current = {
      latitude: nextRegion.latitude,
      longitude: nextRegion.longitude,
    };
    scheduleGeocode(nextRegion.latitude, nextRegion.longitude);
  });

  const onEditField = useStableCallback(
    (field: string, setter: (value: string) => void) => (value: string) => {
      editedFieldsRef.current[field] = true;
      setter(value);
    },
  );

  const handleAddLine1Change = useMemo(
    () => onEditField('addLine1', setAddLine1),
    [onEditField],
  );
  const handleAddLine2Change = useMemo(
    () => onEditField('addLine2', setAddLine2),
    [onEditField],
  );
  const handlePincodeChange = useMemo(
    () => onEditField('pincode', setPincode),
    [onEditField],
  );

  const endInitialLoading = useStableCallback(() => {
    if (initialLoadTimerRef.current) {
      clearTimeout(initialLoadTimerRef.current);
      initialLoadTimerRef.current = null;
    }
    if (isMountedRef.current) setIsInitialLoading(false);
  });

  const getCurrentLocation = useStableCallback((showLoader = false) => {
    if (showLoader) setIsLoading(true);

    const onSuccess = (position: any) => {
      if (!isMountedRef.current) return;
      const { latitude, longitude } = position.coords;
      moveTo(latitude, longitude);
      if (!isEditMode) endInitialLoading();
      if (showLoader) setIsLoading(false);
    };

    const onFinalError = (error: any) => {
      if (!isMountedRef.current) return;
      console.error('Geolocation failed:', error?.message);
      endInitialLoading();
      if (showLoader) setIsLoading(false);
      Toast.show('Failed to fetch location', Toast.SHORT);
    };

    Geolocation.getCurrentPosition(
      onSuccess,
      () =>
        Geolocation.getCurrentPosition(
          onSuccess,
          () =>
            Geolocation.getCurrentPosition(onSuccess, onFinalError, {
              enableHighAccuracy: false,
              timeout: 15000,
              maximumAge: 60000,
            }),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
        ),
      { enableHighAccuracy: false, timeout: 1000, maximumAge: 600000 },
    );
  });

  useEffect(() => {
    if (isEditMode) {
      endInitialLoading();
      return;
    }
    initialLoadTimerRef.current = setTimeout(endInitialLoading, 12000);
    requestLocationPermission().then(granted => {
      if (!isMountedRef.current) return;
      if (granted) getCurrentLocation();
      else endInitialLoading();
    });
  }, [
    isEditMode,
    getCurrentLocation,
    requestLocationPermission,
    endInitialLoading,
  ]);

  const fetchAreas = useStableCallback(async (pin: string) => {
    try {
      setIsAreasLoading(true);
      const response = await getAreasByPincode(pin);
      if (!isMountedRef.current) return;
      if (response?.success && Array.isArray(response.data)) {
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
      if (isMountedRef.current) setIsAreasLoading(false);
    }
  });

  useEffect(() => {
    if (pincode?.length !== 6) return;
    if (fetchedPincodeRef.current === pincode && items.length) return;
    fetchedPincodeRef.current = pincode;
    fetchAreas(pincode);
  }, [pincode, items.length, fetchAreas]);

  const handleSave = useStableCallback(async () => {
    if (isLoading) return;

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
      latitude: markerRef.current.latitude,
      longitude: markerRef.current.longitude,
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
        if (!isEditMode) await clearSelectedAddress();
        await refreshAddresses();
        navigation.goBack();
        return;
      }
      Toast.show(response?.message || 'Failed to save address', Toast.SHORT);
    } catch (error) {
      console.error('Error saving address:', error);
      Toast.show('An error occurred', Toast.SHORT);
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  });

  const goBack = useStableCallback(() => navigation.goBack());
  const recenter = useStableCallback(() => getCurrentLocation(true));

  const isResolving = isGeocoding || isInitialLoading;
  const saveLabel = isEditMode ? 'Update address' : 'Save address';
  const topInset = Math.max(insets.top, UI_SPACING.sm) + UI_SPACING.sm;

  const modalContentStyle = useMemo(
    () => [styles.dropdownContainer, { paddingTop: insets.top + 12 }],
    [insets.top],
  );
  const footerStyle = useMemo(
    () => [
      styles.footer,
      { paddingBottom: Math.max(insets.bottom, UI_SPACING.lg) },
    ],
    [insets.bottom],
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={UI_COLORS.card} />

      <MapPanel
        mapRef={mapRef}
        initialRegion={initialRegion}
        hasLocationPermission={hasLocationPermission}
        isDragging={isDragging}
        isGeocoding={isGeocoding}
        isInitialLoading={isInitialLoading}
        topInset={topInset}
        onMapReady={handleMapReady}
        onRegionChange={handleRegionChange}
        onRegionChangeComplete={handleRegionChangeComplete}
        onPlaceSelected={moveTo}
        onRecenter={recenter}
        onBack={goBack}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        enabled={!IS_ANDROID}
        behavior={IS_ANDROID ? undefined : 'padding'}
      >
        <View style={styles.sheet}>
          <View style={styles.grabHandle} />

          <View style={styles.sheetHeader}>
            <AppText variant="heading" numberOfLines={1}>
              {isEditMode ? 'Edit location' : 'Confirm location'}
            </AppText>
            <AppText
              variant="caption"
              tone="muted"
              numberOfLines={1}
              style={styles.sheetSubtitle}
            >
              Drag the map above to fine-tune your spot
            </AppText>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="none"
            removeClippedSubviews={false}
            nestedScrollEnabled
          >
            <View style={styles.resolvedCard}>
              <IconDisc tone="neutral" size={wp('10%')}>
                <Ionicons
                  name="location-outline"
                  size={wp('5%')}
                  color={UI_COLORS.textSecondary}
                />
              </IconDisc>

              <View style={styles.resolvedCopy}>
                <AppText
                  variant="micro"
                  tone="muted"
                  style={styles.resolvedEyebrow}
                >
                  {isResolving ? 'LOCATING…' : 'SELECTED LOCATION'}
                </AppText>
                <AppText variant="bodyStrong" numberOfLines={2}>
                  {addLine1 ||
                    (isResolving ? 'Fetching location…' : 'Address not found')}
                </AppText>
                {addLine2 ? (
                  <AppText
                    variant="caption"
                    tone="muted"
                    numberOfLines={1}
                    style={styles.resolvedLine2}
                  >
                    {addLine2}
                  </AppText>
                ) : null}
              </View>
            </View>

            <View style={styles.sectionCard}>
              <SectionTitle title="Save this address as" />

              <View style={styles.typeRow}>
                {ADDRESS_TYPES.map(type => {
                  const selected = addressType === type.key;
                  return (
                    <TouchableOpacity
                      key={type.key}
                      activeOpacity={0.85}
                      onPress={() => setAddressType(type.key)}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      accessibilityLabel={`Save as ${type.label}`}
                      style={[
                        styles.typeChip,
                        selected && styles.typeChipActive,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={type.icon}
                        size={wp('4%')}
                        color={
                          selected ? UI_COLORS.textPrimary : UI_COLORS.textFaint
                        }
                      />
                      <AppText
                        variant={selected ? 'labelStrong' : 'label'}
                        tone={selected ? 'primary' : 'muted'}
                        numberOfLines={1}
                      >
                        {type.label}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.sectionCard}>
              <SectionTitle
                title="Address details"
                hint="Used by the rider to reach your door"
              />

              <Field
                label="Full Address House / Flat / Block no"
                required
                value={addLine1}
                onChangeText={handleAddLine1Change}
              />

              <Field
                label="Appartment / Road / Area"
                value={addLine2}
                onChangeText={handleAddLine2Change}
              />

              <View style={styles.pincodeRow}>
                <Field
                  label="PIN Code"
                  required
                  value={pincode}
                  onChangeText={handlePincodeChange}
                  wrapperStyle={styles.pincodeField}
                  keyboardType="numeric"
                  maxLength={6}
                />

                <View style={styles.areaWrap}>
                  <FieldLabel
                    label="Area"
                    required
                    isActive={open}
                    style={styles.areaLabel}
                  />
                  <DropDownPicker
                    open={open}
                    value={pincodeAreaId}
                    items={items}
                    setOpen={setOpen}
                    setValue={setPincodeAreaId}
                    setItems={setItems}
                    placeholder="PIN Code Area"
                    loading={isAreasLoading}
                    listMode="MODAL"
                    modalTitle="Select Area"
                    style={[styles.dropdown, open && styles.dropdownOpen]}
                    textStyle={styles.dropdownText}
                    placeholderStyle={styles.dropdownPlaceholder}
                    listItemLabelStyle={styles.dropdownText}
                    selectedItemLabelStyle={styles.dropdownSelectedText}
                    modalContentContainerStyle={modalContentStyle}
                  />
                </View>
              </View>

              <Field
                label="Land mark / Delivery instruction"
                value={landmark}
                onChangeText={setLandmark}
                placeholder="eg. Near Lulu Mall"
                inputStyle={styles.landmarkInput}
                multiline
              />
            </View>

            <View style={styles.sectionCard}>
              <SectionTitle title="Contact details" />

              <Field
                label="Customer name"
                required
                value={custName}
                onChangeText={setCustName}
              />

              <Field
                label="Phone number"
                required
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
          </ScrollView>

          <View style={footerStyle}>
            <TouchableOpacity
              activeOpacity={0.9}
              disabled={isLoading}
              onPress={handleSave}
              accessibilityRole="button"
              accessibilityLabel={saveLabel}
              accessibilityState={{ disabled: isLoading, busy: isLoading }}
              style={[styles.saveButton, isLoading && styles.saveButtonBusy]}
            >
              {isLoading ? (
                <ActivityIndicator color={UI_COLORS.onPrimary} />
              ) : (
                <>
                  <AppText variant="cta" tone="onDark">
                    {saveLabel}
                  </AppText>
                  <Ionicons
                    name="arrow-forward"
                    size={wp('4.4%')}
                    color={UI_COLORS.onPrimary}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AddLocationScreen;

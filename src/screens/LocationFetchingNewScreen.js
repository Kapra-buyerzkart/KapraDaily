import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  Platform,
  Modal,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  Linking,
  AppState,
  ImageBackground,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { BlurView } from '@react-native-community/blur';

import { getFontontSize } from '../globals/GroFunctions';
import { AppContext } from '../context/appContext';
import { useCart } from '../context/CartContext';
import { areaListPincodeWise, getAreasByPincode } from '../api';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-simple-toast';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'react-native';
import AuthButton from '../components/AuthButton';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAddressListApi } from '../api/addressService';
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

  // Direct normalized check
  if (gNorm.includes(sNorm) || sNorm.includes(gNorm)) {
    return true;
  }

  // Longest Common Substring check for minor spelling variations
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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LocationFetchingNewScreen = ({ navigation }) => {
  const { profile, editPincode, setLocationNotFetched } =
    React.useContext(AppContext);
  const { showStatus, showConfirmation } = useCart();

  const [loading, setLoading] = useState(false);
  const [addressComponent, setAddressComponent] = useState(null);
  const [locationSelectionModal, setLocationSelectionModal] = useState(false);
  const [locationSearchModal, setLocationSearchModal] = useState(false);
  const [listOfLocations, setListOfLocations] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [dummy, setDummy] = useState(false);
  // const [locationNotFetched, setLocationNotFetched] = useState(false);
  const [appActive, setAppActive] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);

  const [region, setRegion] = useState({
    latitude: 10.0224066,
    longitude: 76.3041375,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
  });

  const userInteractedRef = useRef(false);
  const timeoutRef = useRef(null);

  const navigateAfterLocation = () => {
    if (profile?.custId) {
      navigation.reset({ index: 0, routes: [{ name: 'AuthSuccessScreen' }] });
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'LoginScreen', params: { type: 'login' } }] });
    }
  };

  useEffect(() => {
    const init = async () => {
      // Single source of truth for "do we already have a location?":
      // `pincodeAreaId` is written by every location-picking path in the app
      // (editPincode in appContext.js, used by both LocationModal and this
      // screen's own flows), and is wiped by logout()'s AsyncStorage.clear().
      // `manualOverride` is kept as an additional check to cover the brief
      // window during an in-progress manual search (see onPress handler
      // below) before editPincode has had a chance to persist the new pick.
      const savedOverride = await AsyncStorage.getItem('manualOverride');
      const storedPincodeAreaId = await AsyncStorage.getItem('pincodeAreaId');
      if (savedOverride === 'true' || storedPincodeAreaId) {
        setManualOverride(true);
        const savedRegion = await AsyncStorage.getItem('manualRegion');
        const savedAddress = await AsyncStorage.getItem('manualAddress');
        if (savedRegion) setRegion(JSON.parse(savedRegion));
        if (savedAddress) setAddressComponent(JSON.parse(savedAddress));

        setTimeout(() => {
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
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // useEffect(() => {
  //   const subscription = AppState.addEventListener('change', nextState => {
  //     if (nextState === 'active') {
  //       setAppActive(prev => !prev);   // 🔥 toggle state → forces re-run of useEffect
  //     }
  //   });

  //   return () => subscription.remove();
  // }, []);

  const openLocationSettings = () => {
    if (Platform.OS !== 'android') return;

    // Try all safe fallback options
    Linking.openSettings().catch(() => {});
    Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS').catch(
      () => {},
    );
    Linking.openURL('package:com.android.settings').catch(() => {});
  };

  const checkLocationServicesAndPermission = async () => {
    try {
      // ---- 1. CHECK APP PERMISSION ----
      const permission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

      let result = await check(permission);

      // console.log('result', result)

      if (result === RESULTS.DENIED) {
        result = await request(permission);
      }

      if (result === RESULTS.BLOCKED || result === RESULTS.UNAVAILABLE) {
        showConfirmation({
          title: 'Location Permission Off',
          message:
            'Please enable location permission for Kapra Daily to continue.',
          confirmText: 'Open Settings',
          onConfirm: () => openSettings(),
        });
        return false;
      }

      // ---- 2. CHECK IF LOCATION SERVICES / GPS IS ENABLED ----
      const gpsEnabled = await DeviceInfo.isLocationEnabled();

      if (!gpsEnabled) {
        showConfirmation({
          title: 'Location Services Off',
          message: 'Please enable GPS/location services to continue.',
          confirmText: 'Open Settings',
          onConfirm: () => openLocationSettings(),
        });
        return false;
      }

      // ---- 3. EVERYTHING OK → Fetch Location ----
      fetchLocation();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextState => {
        if (nextState === 'active') {
          const savedOverride = await AsyncStorage.getItem('manualOverride');
          const storedPincodeAreaId = await AsyncStorage.getItem('pincodeAreaId');
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

  // useEffect(() => {
  //   const subscription = AppState.addEventListener('change', async nextState => {
  //     if (nextState === 'active') {

  //       // Check location permission
  //       const permissionGranted = await PermissionsAndroid.check(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //       );

  //       if (!permissionGranted) {
  //         return; // user still didn't allow permission
  //       }

  //       // 🔥 Check GPS every time user returns from Settings
  //       const gpsEnabled = await DeviceInfo.isLocationEnabled();
  //       console.log('gpsEnabled', gpsEnabled)
  //       if (!gpsEnabled) {
  //         Alert.alert(
  //           'GPS is Off',
  //           'Please enable GPS/location services to continue.',
  //           [
  //             { text: 'Open Location Settings', onPress: () => openLocationSettings() }
  //           ]
  //         );
  //         return;
  //       }

  //       // If both are OK -> fetch location
  //       fetchLocation();
  //     }
  //   });

  //   return () => subscription.remove();
  // }, []);

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
    // 🛑 Stop the 10-sec auto navigation when user interacts
    userInteractedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // const requestLocationPermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       {
  //         title: 'Location Access Required',
  //         message: 'This app needs to access your location',
  //       }
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       fetchLocation();
  //     } else {
  //       Alert.alert('Location Permission Denied');
  //     }
  //   } catch (err) { }
  // };

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

      // 🔥 Now check the REAL final status (important!)
      const isGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      // ----------------- ⛔ USER DENIED -----------------
      if (!isGranted) {
        showConfirmation({
          title: 'Location Permission Required',
          message:
            'Please enable location permission for the app to function properly.',
          confirmText: 'Open Settings',
          onConfirm: () => openSettings(),
        });
        return;
      }

      // ----------------- 🔥 PERMISSION GRANTED -----------------
      const gpsEnabled = await DeviceInfo.isLocationEnabled();

      if (!gpsEnabled) {
        showConfirmation({
          title: 'Location Services Off',
          message: 'Please enable GPS/location services to continue.',
          confirmText: 'Open Location Settings',
          onConfirm: () => openLocationSettings(),
        });
        return;
      }

      fetchLocation();
    } catch (err) {
      console.log(err);
    }
  };

  // const fetchLocation = () => {
  //     setLoading(true);

  //     const onSuccess = (position) => {
  //         setRegion({
  //             latitude: position?.coords?.latitude,
  //             longitude: position?.coords?.longitude,
  //             latitudeDelta: 0.008,
  //             longitudeDelta: 0.008,
  //         });
  //         reverseGeocode(position.coords.latitude, position.coords.longitude);
  //     };

  //     const onFinalError = (error) => {
  //         console.log('Location fetch final error', error);
  //         setLoading(false); // Make sure loader is removed on failure
  //         Toast.show('Failed to fetch location automatically.', Toast.SHORT);
  //     };

  //     // Try high accuracy first, fallback to low accuracy
  //     Geolocation.getCurrentPosition(
  //         onSuccess,
  //         (error) => {
  //             console.log('High accuracy failed, trying low accuracy...', error);
  //             Geolocation.getCurrentPosition(
  //                 onSuccess,
  //                 onFinalError,
  //                 { enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 }
  //             );
  //         },
  //         { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  //     );
  // };

  const fetchLocation = () => {
    setLoading(true);

    const onSuccess = position => {
      console.log(
        '📍 [LOCATION] GPS success:',
        position.coords.latitude,
        position.coords.longitude,
      );
      setRegion({
        latitude: position?.coords?.latitude,
        longitude: position?.coords?.longitude,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      });

      // Do NOT setLoading(false) here — let reverseGeocode → getLocationPincodeAreas handle it
      reverseGeocode(position.coords.latitude, position.coords.longitude);
    };

    const onFinalError = async error => {
      console.log('📍 [LOCATION] All location attempts failed', error);
      // Fallback auto navigation if location fails
      await editPincode({
        areaName: 'Panampilly Nagar',
        pincodeAreaId: 262,
        pincodeId: 32,
        tags: null,
      });
      setTimeout(() => {
        setLocationNotFetched(true);
        navigateAfterLocation();
      }, 2000);
      setLoading(false);
    };

    // 1️⃣ Cached / coarse location first (WiFi/cell — very fast on cold start)
    Geolocation.getCurrentPosition(
      onSuccess,
      error => {
        console.log(
          '📍 [LOCATION] Cached/coarse failed, trying high accuracy...',
          error,
        );
        // 2️⃣ Escalate to high accuracy, but still accept a recent fix
        //    (maximumAge: 0 forces a brand-new fix that times out indoors/cold-start)
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

  const reverseGeocode = async (latitude, longitude) => {
    const apiKey = 'AIzaSyDhItv0zoWdQbDh-5jjKLAEjwRDDrFNc1Y';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    try {
      const response = await axios.get(url, { timeout: 10000 });
      console.log('📍 [GEOCODE] Response status:', response.data.status);

      const formattedAddress = response.data.results[0]?.formatted_address;
      var addressComponent = response.data.results[0];
      funSetAddComponent(addressComponent);

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

      console.log(
        '📍 [GEOCODE] Postal code:',
        postalCode,
        '| Address:',
        formattedAddress,
      );

      // Await the full area-matching flow before clearing loading
      await getLocationPincodeAreas(postalCode, formattedAddress);
      setLoading(false);
    } catch (error) {
      console.log('📍 [GEOCODE] Reverse geocode error:', error);
      // Fallback: navigate with default area on geocode failure
      setLoading(false);
      await editPincode({
        areaName: 'Panampilly Nagar',
        pincodeAreaId: 262,
        pincodeId: 32,
        tags: null,
      });
      setTimeout(() => {
        setLocationNotFetched(true);
        navigateAfterLocation();
      }, 2000);
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
        console.log('📍 [MATCH] Saved addresses found:', addressList.length);
      } catch (addrErr) {
        console.log(
          '📍 [MATCH] Error fetching address list (guest user?):',
          addrErr,
        );
      }

      // --- Step 1: Try matching against user's saved addresses ---
      if (addressList.length > 0) {
        const matchingAddress = addressList.find(addr => {
          // 1. Match by exact pincode
          const pinMatch =
            postcode && String(addr.pincode || addr.pin) === String(postcode);
          if (pinMatch) {
            console.log(
              '📍 [MATCH] Pincode match found:',
              addr.pincode,
              '===',
              postcode,
            );
            return true;
          }

          // 2. Dynamic fuzzy match (non-hardcoded) using area details
          if (formattedAddress) {
            if (
              addr.areaName &&
              isFuzzyMatch(addr.areaName, formattedAddress)
            ) {
              console.log('📍 [MATCH] Fuzzy areaName match:', addr.areaName);
              return true;
            }
            if (
              addr.pincodeAreaName &&
              isFuzzyMatch(addr.pincodeAreaName, formattedAddress)
            ) {
              console.log(
                '📍 [MATCH] Fuzzy pincodeAreaName match:',
                addr.pincodeAreaName,
              );
              return true;
            }
            // Fallback to match normalized sublocality in addLine2 (e.g. Thripunithura)
            const line2Norm = normalizeString(addr.addLine2);
            if (
              line2Norm.length > 3 &&
              normalizeString(formattedAddress).includes(line2Norm)
            ) {
              console.log('📍 [MATCH] addLine2 match:', addr.addLine2);
              return true;
            }
          }
          return false;
        });

        if (matchingAddress) {
          console.log(
            '📍 [MATCH] ✅ Matching saved address found! pincodeAreaId:',
            matchingAddress.pincodeAreaId,
            'postcode:',
            postcode,
          );
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
          setTimeout(() => {
            setLocationNotFetched(false);
            navigateAfterLocation();
          }, 2000);
          return;
        }
        console.log(
          '📍 [MATCH] No matching saved address found, proceeding to area lookup...',
        );
      }

      // --- Step 2: Guard against null/empty postcode ---
      if (!postcode || String(postcode).trim().length === 0) {
        console.log(
          '📍 [AREAS] ⚠️ Postcode is null/empty — cannot look up areas. Falling back to default.',
        );
        setShowConfirm(false);
        await editPincode({
          areaName: 'Panampilly Nagar',
          pincodeAreaId: 262,
          pincodeId: 32,
          tags: null,
        });
        setTimeout(() => {
          setLocationNotFetched(true);
          navigateAfterLocation();
        }, 2000);
        return;
      }

      // --- Step 3: Look up areas by postal code ---
      console.log('📍 [AREAS] Looking up areas for postcode:', postcode);
      let area = await getAreasByPincode(postcode);
      console.log(
        '📍 [AREAS] API response — areas found:',
        area?.data?.length || 0,
        'data:',
        JSON.stringify(area?.data),
      );

      if (area?.data?.length > 1) {
        // Multiple stores/areas — check if user's current pincodeAreaId is among them
        console.log(
          '📍 [AREAS] Multiple areas found:',
          area.data.length,
          '| Current profile.pincode:',
          profile?.pincode,
        );
        if (area?.data?.find(obj => obj?.pincodeAreaId == profile?.pincode)) {
          console.log(
            '📍 [AREAS] ✅ User already has a matching pincodeAreaId, auto-navigating...',
          );
          setTimeout(() => {
            if (!userInteractedRef.current) {
              setLocationNotFetched(false);
              navigateAfterLocation();
            }
          }, 2000);
        } else {
          console.log('📍 [AREAS] Showing area picker modal...');
          setShowConfirm(true);
          setListOfLocations(area?.data);
        }
      } else if (area?.data?.length == 1) {
        console.log(
          '📍 [AREAS] ✅ Single area found, auto-selecting:',
          area.data[0]?.areaName,
        );
        setShowConfirm(false);
        await editPincode(area.data[0]);
        setTimeout(() => {
          setLocationNotFetched(false);
          navigateAfterLocation();
        }, 2000);
      } else {
        // No areas found for this pincode (user is outside delivery zone)
        console.log(
          '📍 [AREAS] ❌ No areas found for postcode:',
          postcode,
          '— falling back to default.',
        );
        setShowConfirm(false);
        await editPincode({
          areaName: 'Panampilly Nagar',
          pincodeAreaId: 262,
          pincodeId: 32,
          tags: null,
        });
        setTimeout(() => {
          setLocationNotFetched(true);
          navigateAfterLocation();
        }, 2000);
      }
    } catch (error) {
      console.log('📍 [AREAS] ❌ API error:', error);
      setShowConfirm(false);
      await editPincode({
        areaName: 'Panampilly Nagar',
        pincodeAreaId: 262,
        pincodeId: 32,
        tags: null,
      });
      setTimeout(() => {
        setLocationNotFetched(true);
        navigateAfterLocation();
      }, 2000);
    }
  };

  const funSetLoading = () => {
    setLoading(false);
    setDummy(!dummy);
  };

  const funSetAddComponent = value => {
    setAddressComponent(value);
    setDummy(!dummy);
  };

  if (!addressComponent) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <FastImage
          source={require('../assets/gifs/location-fetching.gif')}
          style={styles.loaderGif}
          resizeMode={FastImage.resizeMode.cover}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.maninContainer}>
      {/* {console.log('userInteractedRef', userInteractedRef)} */}
      <ImageBackground
        style={styles.backgroundImage}
        resizeMode="cover"
        source={require('../assets/images/location-background.png')}
      >
        <View
          style={[
            styles.iconMainCon,
            {
              top:
                Platform.OS == 'ios'
                  ? windowHeight * 0.01
                  : windowHeight * 0.03,
            },
          ]}
        >
          <AuthButton
            FirstColor={'#D80000'}
            SecondColor={'#FF7148'}
            OnPress={async () => {
              stopAutoNavigateTimer();
              let areaToPass = null;
              if (listOfLocations && listOfLocations.length > 0) {
                areaToPass = listOfLocations[0];
              } else {
                areaToPass = {
                  areaName: 'Panampilly Nagar',
                  pincodeAreaId: 262,
                  pincodeId: 32,
                  tags: null,
                };
              }
              if (areaToPass) {
                await editPincode(areaToPass);
              }
              setLocationNotFetched(false);
              navigateAfterLocation();
            }}
            FSize={14}
            ButtonText={'Skip'}
            ButtonWidth={20}
            ButtonHeight={3}
          />
          <TouchableOpacity
            style={styles.iconCmnCon}
            onPress={() => {
              stopAutoNavigateTimer();
              setLocationSearchModal(true);
            }}
          >
            {/* {showIcon('search', colours.kapraOrangeLight, windowWidth * 0.05)} */}
            <Image
              source={require('../assets/icons/search.png')}
              style={{
                height: windowWidth * 0.05,
                width: windowWidth * 0.05,
              }}
            />
          </TouchableOpacity>
        </View>

        <Image
          resizeMode="contain"
          source={require('../assets/images/location-fetching-icon.png')}
        />
        <View style={styles.innerContainer}>
          <Text style={styles.yourlocationText}>Your location</Text>
          <Text style={styles.addressText}>
            {(() => {
              const sub2 = addressComponent?.address_components?.find(c =>
                c.types.includes('sublocality_level_2'),
              )?.long_name;

              const sub1 = addressComponent?.address_components?.find(c =>
                c.types.includes('sublocality_level_1'),
              )?.long_name;

              const sublocality = addressComponent?.address_components?.find(
                c => c.types.includes('sublocality'),
              )?.long_name;

              const locality = addressComponent?.address_components?.find(c =>
                c.types.includes('locality'),
              )?.long_name;

              if (sub2 && sub1) {
                return `${sub2} : ${sub1}`;
              } else {
                return `${sublocality || ''} : ${locality || ''}`;
              }
            })()}
          </Text>
          <Text style={styles.addressText}>
            {
              addressComponent?.address_components?.find(c =>
                c.types.includes('administrative_area_level_1'),
              )?.long_name
            }
            {'  pin : '}
            {
              addressComponent?.address_components?.find(c =>
                c.types.includes('postal_code'),
              )?.long_name
            }
          </Text>
        </View>
        {showConfirm && (
          <AuthButton
            FirstColor={'#F04B1B'}
            SecondColor={'#FF7148'}
            OnPress={() => {
              stopAutoNavigateTimer();
              setLocationSelectionModal(true);
              // setShowConfirm(false);
            }}
            ButtonText={'Confirm'}
            ButtonWidth={80}
            ButtonHeight={5}
          />
        )}
        {/* Location Search Modal */}
        <Modal animationType="slide" visible={locationSearchModal} transparent>
          <KeyboardAvoidingView behavior="position" enabled>
            <BlurView
              style={styles.blurStyle}
              blurType="light"
              blurAmount={1}
              overlayColor={Platform.OS == 'ios' ? undefined : 'transparent'}
              reducedTransparencyFallbackColor="black"
            />
            <View
              style={[
                styles.updateModalView1,
                {
                  height: windowHeight * 0.37,
                  marginTop: windowHeight * 0.63,
                  paddingTop: 0,
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.fontStyle1}>Search your area</Text>
                <TouchableOpacity
                  style={styles.iconCmnCon}
                  onPress={() => {
                    stopAutoNavigateTimer();
                    setLocationSearchModal(false);
                  }}
                >
                  {/* {showIcon('close', colours.kapraOrangeLight, windowWidth * 0.05)} */}
                  <Image
                    source={require('../assets/icons/close.png')}
                    style={{
                      height: windowWidth * 0.05,
                      width: windowWidth * 0.05,
                    }}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.locationSearch2}>
                <GooglePlacesAutocomplete
                  placeholder={'Search a new location'}
                  textInputProps={styles.searchTextCon}
                  styles={styles.searchTextIn}
                  debounce={200}
                  renderRow={rowData => {
                    const title = rowData.structured_formatting.main_text;
                    const address =
                      rowData.structured_formatting.secondary_text;
                    return (
                      <View>
                        <View style={{ flexDirection: 'row' }}>
                          <View style={styles.iconCmnCon}>
                            {/* {showIcon('address', colours.kapraOrangeLight, 15)} */}
                            <Image
                              tintColor={'#F04B1B'}
                              source={require('../assets/icons/address.png')}
                              style={{
                                height: 15,
                                width: 15,
                              }}
                            />
                          </View>
                          <View style={{ marginLeft: 10 }}>
                            <Text
                              style={[styles.fontStyle3, { paddingBottom: 2 }]}
                            >
                              {title}
                            </Text>
                            <Text
                              style={[styles.fontStyle5, { color: '#151515' }]}
                            >
                              {address}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  }}
                  onPress={async (data, details = null) => {
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
                    setManualOverride(true); // Save to AsyncStorage
                    await AsyncStorage.setItem('manualOverride', 'true');
                    await AsyncStorage.setItem(
                      'manualRegion',
                      JSON.stringify(newRegion),
                    );
                    await AsyncStorage.setItem(
                      'manualAddress',
                      JSON.stringify(details),
                    );
                  }}
                  query={{
                    key: 'AIzaSyDhItv0zoWdQbDh-5jjKLAEjwRDDrFNc1Y',
                    language: 'en',
                    components: 'country:IN',
                  }}
                  fetchDetails={true}
                  listViewDisplayed={false}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Pincode Locations Modal */}
        <Modal
          animationType="slide"
          visible={locationSelectionModal}
          transparent
        >
          <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>
            <BlurView
              style={styles.blurStyle}
              blurType="light"
              blurAmount={1}
              overlayColor={Platform.OS == 'ios' ? undefined : 'transparent'}
              reducedTransparencyFallbackColor="black"
            />
            <View
              style={[
                styles.updateModalView1,
                {
                  // paddingBottom: Platform.OS === "android" ? insets.bottom + 20 : 0, // ensures safe spacing above nav bar
                  paddingTop: 10,
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.fontStyle1}>Choose your area</Text>
                <TouchableOpacity
                  style={styles.iconCmnCon}
                  onPress={() => {
                    stopAutoNavigateTimer();
                    setLocationSelectionModal(false);
                  }}
                >
                  {/* {showIcon('close', colours.kapraOrangeLight, windowWidth * 0.05)} */}
                  <Image
                    source={require('../assets/icons/close.png')}
                    style={{
                      height: windowWidth * 0.05,
                      width: windowWidth * 0.05,
                    }}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <FlatList
                  data={listOfLocations}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.locationCon}
                      onPress={() => {
                        stopAutoNavigateTimer();
                        setSelectedLocation(item);
                      }}
                    >
                      <Text style={styles.fontStyle2}>{item?.areaName}</Text>
                      {selectedLocation &&
                        selectedLocation?.pincodeAreaId ==
                          item?.pincodeAreaId && (
                          <View>
                            {/* {showIcon('tick', colours.kapraOrange, windowWidth * 0.05)} */}
                            <Image
                              tintColor={'#FF7148'}
                              source={require('../assets/icons/tick.png')}
                              style={{
                                height: windowWidth * 0.05,
                                width: windowWidth * 0.05,
                              }}
                            />
                          </View>
                        )}
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </ScrollView>

              {listOfLocations && listOfLocations.length > 1 && (
                <View
                  style={{
                    flexDirection: 'row',
                    width: windowWidth * 0.9,
                    justifyContent: 'space-between',
                    marginTop: 5,
                  }}
                >
                  <AuthButton
                    FirstColor={'#D71920'}
                    SecondColor={'#F97C80'}
                    OnPress={async () => {
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
                    }}
                    ButtonText={'Skip'}
                    ButtonWidth={44}
                    ButtonHeight={5}
                  />
                  <AuthButton
                    FirstColor={'#F04B1B'}
                    SecondColor={'#FF7148'}
                    OnPress={async () => {
                      // stopAutoNavigateTimer();
                      if (selectedLocation !== null) {
                        await editPincode(selectedLocation);
                        setSelectedLocation(null);
                        setLocationSelectionModal(false);
                        setLocationNotFetched(false);
                        navigateAfterLocation();
                      } else {
                        Alert.alert('Alert', 'Please select an area');
                      }
                    }}
                    ButtonText={'Apply'}
                    ButtonWidth={44}
                    ButtonHeight={5}
                  />
                </View>
              )}
            </View>
          </SafeAreaView>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  secondCon: {
    position: 'absolute',
    width: windowWidth,
    height: windowHeight,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  iconMainCon: {
    position: 'absolute',
    width: windowWidth,
    height: windowHeight * (7 / 100),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: windowWidth * (5 / 100),
    top:
      Platform.OS == 'ios'
        ? windowHeight * (65 / 100)
        : windowHeight * (69 / 100),
  },
  iconCmnCon: {
    width: windowHeight * (5 / 100),
    height: windowHeight * (5 / 100),
    backgroundColor: '#FFFFFF',
    marginLeft: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 3,

    // Android Shadow
    elevation: 5,
  },

  // // Modal Styles
  blurStyle: {
    width: windowWidth,
    height: windowHeight,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: null,
    overflow: 'hidden',
  },
  updateModalView1: {
    height: windowHeight * (35 / 100),
    marginTop: windowHeight * (65 / 100),
    paddingTop: windowHeight * (1 / 100),
    paddingBottom: windowHeight * (2 / 100),
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  updateModalView1: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalHeader: {
    width: windowWidth,
    height: windowHeight * (7 / 100),
    paddingHorizontal: windowWidth * (5 / 100),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#F04B1B',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  locationSearch2: {
    width: windowWidth,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    height: windowHeight * (30 / 100),

    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 3,

    // Android Shadow
    elevation: 5,
  },
  searchTextCon: {
    placeholderTextColor: '#626262',
    returnKeyType: 'search',
    color: '#000000',
    fontFamily: 'Lexend-SemiBold',
    backgroundColor: '#F5F5F5',
  },
  searchTextIn: {
    textInput: {
      height: windowHeight * (6 / 100),
      width: windowWidth * (90 / 100),
      color: '#626262',
      fontFamily: 'Lexend-SemiBold',
      fontSize: getFontontSize(13),
    },
    listView: {
      borderRadius: 5,
      backgroundColor: '#ffffff',
      height: windowHeight * (20 / 100),
      width: windowWidth,
    },
    row: {
      borderRadius: 5,
    },
  },
  locationCon: {
    width: windowWidth * (90 / 100),
    height: windowHeight * (5 / 100),
    paddingHorizontal: windowWidth * (5 / 100),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FDEBE6',
    marginTop: 10,
    borderRadius: 5,
  },

  // Fonts
  fontStyle1: {
    fontFamily: 'Lexend-Bold',
    fontSize: getFontontSize(18),
    color: '#ffffff',
  },
  fontStyle2: {
    fontFamily: 'Lexend-Medium',
    fontSize: getFontontSize(16),
    color: '#F04B1B',
  },
  fontStyle3: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(15),
    color: '#525252',
  },
  fontStyle5: {
    fontFamily: 'Lexend-Regular',
    fontSize: getFontontSize(12),
    color: '#626262',
  },

  animation: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top:
      Platform.OS == 'ios'
        ? windowHeight * (42 / 100)
        : windowHeight * (46 / 100),
    height: windowHeight * (4 / 100),
  },

  firstCon: {
    position: 'absolute',
    width: windowWidth,
    height: windowHeight,
    alignItems: 'center',
  },
  lottieCon2: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:
      Platform.OS == 'ios'
        ? windowHeight * (43 / 100)
        : windowHeight * (44 / 100),
    height: windowHeight * (4 / 100),
  },
  // addressCon: {
  //   position: 'absolute',
  //   width: windowWidth,
  //   height: windowHeight * (25 / 100),
  //   top: Platform.OS == 'ios' ? windowHeight * (72 / 100) : windowHeight * (76 / 100),
  //   paddingHorizontal: windowWidth * (10 / 100),
  //   paddingVertical: windowHeight * (4.5 / 100),
  //   backgroundColor: colours.primaryWhite,
  // },
  addressCon: {
    position: 'absolute',
    bottom: 0, // ⬅️ instead of top
    width: windowWidth,
    paddingHorizontal: windowWidth * 0.1,
    // paddingTop: windowHeight * 0.02,
    // paddingBottom: windowHeight * 0.03,
    paddingVertical: windowHeight * 0.04,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  headerFont: {
    fontFamily: 'Montserrat-BoldItalic',
    fontSize: getFontontSize(18),
    color: '#ffffff',
  },
  fontStyle4: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: getFontontSize(14),
    color: '#44B74B',
    textDecorationLine: 'underline',
  },

  maninContainer: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    alignItems: 'center',
  },
  yourlocationText: {
    color: '#F25000',
    fontFamily: 'Poppins-ExtraBold',
    fontSize: getFontontSize(15),
    marginTop: windowHeight * (3.2 / 100),
    marginBottom: windowHeight * (1 / 100),
  },
  addressText: {
    color: '#4D4D4D',
    fontFamily: 'Poppins-Light',
    fontSize: getFontontSize(14),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: windowWidth,
    height: windowHeight,
  },
  loaderGif: {
    width: windowWidth,
    height: windowHeight,
  },
});

export default LocationFetchingNewScreen;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';
import { FONTS } from '../styles/typography';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import { GOOGLE_MAPS_API_KEY } from '../globals/secrets';

Geocoder.init(GOOGLE_MAPS_API_KEY);

export default function LocationFetchingScreen() {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    getLocation();
  }, []);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      return (
        (await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        )) === PermissionsAndroid.RESULTS.GRANTED
      );
    } else if (Platform.OS === 'ios') {
      const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      return result === RESULTS.GRANTED;
    }
    return true;
  };

  const getLocation = async () => {
    const granted = await requestPermission();

    if (!granted) {
      setLoading(false);
      // Fallback to MainTabs if permission is denied
      setTimeout(() => {
        navigation.replace('AuthSuccessScreen');
      }, 1000);
      return;
    }

    // Safety timeout in case Geolocation hangs without calling success/error
    const safetyTimeout = setTimeout(() => {
      console.log('Geolocation safety timeout reached in screen');
      setLoading(false);
      navigation.replace('AuthSuccessScreen');
    }, 10000); // 10s absolute safety

    Geolocation.getCurrentPosition(
      async position => {
        clearTimeout(safetyTimeout);
        try {
          const { latitude, longitude } = position.coords;

          const geo = await Geocoder.from(latitude, longitude);
          const data = geo.results[0];

          const area = data.address_components.find(c =>
            c.types.includes('sublocality'),
          )?.long_name;

          const locality = data.address_components.find(c =>
            c.types.includes('locality'),
          )?.long_name;

          const state = data.address_components.find(c =>
            c.types.includes('administrative_area_level_1'),
          )?.long_name;

          const pincode = data.address_components.find(c =>
            c.types.includes('postal_code'),
          )?.long_name;

          setAddress({ area, locality, state, pincode });
          setTimeout(() => {
            navigation.replace('AuthSuccessScreen');
          }, 3000);
        } catch (e) {
          console.log('Geocoding error:', e);
          // Fallback to MainTabs on error
          navigation.replace('AuthSuccessScreen');
        } finally {
          setLoading(false);
        }
      },
      error => {
        clearTimeout(safetyTimeout);
        console.log('Geolocation error:', error);
        setLoading(false);
        // Fallback to MainTabs on error
        navigation.replace('AuthSuccessScreen');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 },
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <Image
          source={require('../assets/gifs/location-fetching.gif')}
          style={styles.loaderGif}
          resizeMode="contain"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.maninContainer}>
      <ImageBackground
        style={styles.backgroundImage}
        resizeMode="cover"
        source={require('../assets/images/location-background.png')}
      >
        <Image
          resizeMode="contain"
          source={require('../assets/images/location-fetching-icon.png')}
        />
        <View style={styles.innerContainer}>
          <Text style={styles.yourlocationText}>Your location</Text>
          <Text style={styles.addressText}>
            {address?.area} : {address?.locality}
          </Text>
          <Text
            style={[
              styles.addressText,
              {
                marginTop: hp('0.5%'),
              },
            ]}
          >
            {address?.state} pin : {address?.pincode}
          </Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  maninContainer: {
    flex: 1,
    backgroundColor: 'white',
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
    fontFamily: FONTS.gilroy.extraBold,
    fontSize: wp('4%'),
    marginTop: hp('5%'),
    marginBottom: hp('1.5%'),
  },
  addressText: {
    color: '#4D4D4D',
    fontFamily: FONTS.gilroy.light,
    fontSize: wp('3.72%'),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loaderGif: {
    width: wp('100%'),
    height: hp('100%'),
  },
});

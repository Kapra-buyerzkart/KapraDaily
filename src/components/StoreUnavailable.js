import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { FONTS } from '../styles/typography';
import CONFIG from '../globals/config';

const StoreUnavailable = ({ image, text, onChangeLocation }) => {
  const navigation = useNavigation();

  const handleChangeLocation = () => {
    if (onChangeLocation) {
      onChangeLocation();
    } else {
      navigation.navigate('SearchScreen', { type: 'location' });
    }
  };

  return (
    <View style={styles.unavailableContainer}>
      {image ? (
        <Image
          source={{ uri: `${CONFIG.image_base_url}${image}` }}
          style={styles.unavailableImage}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.fallbackIconContainer}>
          <Ionicons
            name="storefront-outline"
            size={wp('30%')}
            color="#FF7B3A"
          />
        </View>
      )}
      <Text style={styles.unavailableText}>
        {text || "Service not available in your area yet. We're coming soon!"}
      </Text>

      <TouchableOpacity
        style={styles.changeLocationButton}
        onPress={handleChangeLocation}
      >
        <Text style={styles.changeLocationButtonText}>Change Location</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  unavailableContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('5%'),
    backgroundColor: '#FFFFFF',
  },
  unavailableImage: {
    width: wp('70%'),
    height: hp('25%'),
    marginBottom: hp('2%'),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  fallbackIconContainer: {
    marginBottom: hp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('25%'),
  },
  unavailableText: {
    fontFamily: FONTS.outfit.light,
    fontSize: wp('3.7%'),
    color: '#333',
    textAlign: 'center',
    marginHorizontal: wp('5%'),
  },
  changeLocationButton: {
    marginTop: hp('3%'),
    backgroundColor: '#FF7B3A',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('8%'),
    borderRadius: wp('2%'),
  },
  changeLocationButtonText: {
    fontFamily: FONTS.outfit.bold,
    fontSize: wp('4%'),
    color: '#FFFFFF',
  },
});

export default StoreUnavailable;

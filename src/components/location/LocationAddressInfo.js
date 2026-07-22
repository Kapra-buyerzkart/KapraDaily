import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { getFontontSize } from '../../globals/GroFunctions';
import { getLocalityLine, getStatePinLine } from '../../utils/addressFormat';

const windowHeight = Dimensions.get('window').height;

const LocationAddressInfo = ({ geocodeResult }) => (
  <>
    <Image
      resizeMode="contain"
      source={require('../../assets/images/location-fetching-icon.png')}
    />
    <View style={styles.innerContainer}>
      <Text style={styles.yourlocationText}>Your location</Text>
      <Text style={styles.addressText}>{getLocalityLine(geocodeResult)}</Text>
      <Text style={styles.addressText}>{getStatePinLine(geocodeResult)}</Text>
    </View>
  </>
);

const styles = StyleSheet.create({
  innerContainer: {
    alignItems: 'center',
  },
  yourlocationText: {
    color: '#F25000',
    fontFamily: 'Gilroy-Heavy',
    fontSize: getFontontSize(15),
    marginTop: windowHeight * (3.2 / 100),
    marginBottom: windowHeight * (1 / 100),
  },
  addressText: {
    color: '#4D4D4D',
    fontFamily: 'Gilroy-Light',
    fontSize: getFontontSize(14),
  },
});

export default LocationAddressInfo;

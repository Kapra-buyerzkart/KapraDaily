import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import AuthButton from '../AuthButton';
import {
  sharedLocationStyles,
  windowWidth,
  windowHeight,
} from './sharedLocationStyles';

const LocationHeaderActions = ({ onSkip, onSearchPress }) => (
  <View
    style={[
      styles.iconMainCon,
      {
        top: Platform.OS == 'ios' ? windowHeight * 0.01 : windowHeight * 0.03,
      },
    ]}
  >
    <AuthButton
      FirstColor={'#D80000'}
      SecondColor={'#FF7148'}
      OnPress={onSkip}
      FSize={14}
      ButtonText={'Skip'}
      ButtonWidth={20}
      ButtonHeight={3}
    />
    <TouchableOpacity style={sharedLocationStyles.iconCmnCon} onPress={onSearchPress}>
      <Image
        source={require('../../assets/icons/search.png')}
        style={{
          height: windowWidth * 0.05,
          width: windowWidth * 0.05,
        }}
      />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
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
});

export default LocationHeaderActions;

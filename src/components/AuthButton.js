import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getFontontSize } from '../globals/GroFunctions';
import BallPulse from './BallPulse';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function AuthButton({
  BackgroundColor,
  OnPress,
  ButtonText,
  ButtonWidth,
  ButtonHeight,
  FirstColor,
  SecondColor,
  FSize,
  FColor,
  disabled,
  Font2,
  loading,
}) {
  const width = windowWidth * (ButtonWidth / 100);
  const height = ButtonHeight
    ? windowHeight * (ButtonHeight / 100)
    : windowHeight * 0.06;

  return (
    <View
      style={{
        borderRadius: 10,
        overflow: 'visible',
      }}
    >
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={[
          FirstColor ? FirstColor : '#4B3057',
          SecondColor ? SecondColor : '#4B3057',
        ]}
        style={[
          styles.buttonStyle,
          {
            width,
            height,
            borderRadius: 10,
            backgroundColor: BackgroundColor || 'transparent',
          },
        ]}
      >
        <TouchableOpacity
          disabled={disabled || loading}
          onPress={OnPress}
          activeOpacity={0.8}
          style={{
            width,
            height,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            borderRadius: 10,
            overflow: 'visible',
          }}
        >
          {loading ? (
            <BallPulse color={FColor || '#ffffff'} size="small" />
          ) : (
            <Text
              style={[
                Font2 ? styles.buttonText : styles.buttonText1,
                {
                  color: FColor || '#ffffff',
                  fontSize: FSize ? getFontontSize(FSize) : getFontontSize(18),
                },
              ]}
            >
              {ButtonText}
            </Text>
          )}
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  buttonText: {
    fontFamily: 'Gilroy-Bold',
  },
  buttonText1: {
    fontFamily: 'Gilroy-Bold',
  },
});

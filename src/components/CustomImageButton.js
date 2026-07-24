import React from 'react';
import {
  TouchableOpacity,
  Text,
  ImageBackground,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import icons from '../assets/icons';
import { FONTS } from '../styles/typography';
import { COLORS } from '../styles/colors';

const CustomImageButton = ({
  title,
  onPress,
  disabled = false,
  isLoading = false,
  style,
  leftIcon,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[styles.touchable, disabled && styles.disabled, style]}
    >
      <ImageBackground
        source={icons.buttonBackground}
        style={styles.background}
        imageStyle={styles.image}
        resizeMode="stretch"
      >
        {isLoading ? (
          <ActivityIndicator color={COLORS.lavenderText} size="small" />
        ) : (
          <Text style={[styles.text, textStyle]} numberOfLines={1}>
            {title}
          </Text>
        )}
        {leftIcon}
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default CustomImageButton;

const styles = StyleSheet.create({
  touchable: {
    alignSelf: 'flex-start',
  },
  background: {
    minHeight: 48,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
  },
  image: {
    borderRadius: 14,
    flexDirection: 'row',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: COLORS.lavenderText,
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: 15,
  },
});

import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { FONTS } from '../styles/typography';
import { PURPLE_BUTTON_GRADIENT } from '../styles/gradients';
import { COLORS } from '../styles/colors';

const GradientButton = ({
  title,
  onPress,
  disabled = false,
  isLoading = false,
  colors = PURPLE_BUTTON_GRADIENT,
  variant = 'gradient',
  borderRadius = 14,
  style,
  textStyle,
}) => {
  const isSoft = variant === 'soft';

  return (
    <View
      style={[
        styles.shadowWrapper,
        isSoft && styles.softShadow,
        { borderRadius },
        style,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        disabled={disabled || isLoading}
        style={[styles.touchable, { borderRadius }]}
      >
        {isSoft ? (
          <View
            style={[styles.soft, { borderRadius }, disabled && styles.disabled]}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.lavenderText} size="small" />
            ) : (
              <Text
                style={[styles.text, styles.softText, textStyle]}
                numberOfLines={1}
              >
                {title}
              </Text>
            )}
          </View>
        ) : (
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.gradient,
              { borderRadius },
              disabled && styles.disabled,
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={[styles.text, textStyle]} numberOfLines={1}>
                {title}
              </Text>
            )}
          </LinearGradient>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default GradientButton;

const styles = StyleSheet.create({
  shadowWrapper: {
    shadowColor: '#711BA5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 10,
  },
  softShadow: {
    shadowColor: COLORS.lavenderBorder,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  touchable: {
    backgroundColor: '#711BA5',
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soft: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lavender,
    borderWidth: 1.5,
    borderColor: COLORS.lavenderBorder,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: 15,
  },
  softText: {
    color: COLORS.lavenderText,
  },
});

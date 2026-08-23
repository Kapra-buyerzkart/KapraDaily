import React from 'react';
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../theme/colours';
import { Fonts } from '../theme/fonts';
import { verticalScale, moderateScale, scale } from '../assets/styles';

interface CustomGradientButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

const CustomGradientButton: React.FC<CustomGradientButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  icon,
  disabled = false,
  loading = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.container, disabled && styles.disabled, style]}
    >
      <LinearGradient
        colors={[colors.tealButton || '#FF6A00', colors.themeTeal || '#F25000']}
        start={{ x: 0.1, y: 1 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <>
            {icon}
            <Text style={[styles.text, textStyle]}>{title}</Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: verticalScale(50),
    borderRadius: verticalScale(25),
    overflow: 'hidden',
    width: '100%',
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    gap: scale(10),
    borderRadius: verticalScale(25),
  },
  text: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.gilroyBold,
    color: colors.themeWhite,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default CustomGradientButton;

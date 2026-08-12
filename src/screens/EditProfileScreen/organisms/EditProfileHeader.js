import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import icons from '@/assets/icons';
import EditText from '@/screens/cart/components/atoms/CartText';
import {
  CART_COLORS,
  CART_SPACING,
  hitSlopTo,
  hp,
  wp,
} from '@/styles/cartTheme';

const EditProfileHeader = ({ onBack, backgroundStyle, borderStyle }) => {
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      style={[
        styles.header,
        backgroundStyle,
        { paddingTop: insets.top + CART_SPACING.sm },
      ]}
    >
      <TouchableOpacity
        onPress={onBack}
        style={styles.backBtn}
        hitSlop={hitSlopTo(wp('6%'))}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Image source={icons.backArrowNew} style={styles.backIcon} />
      </TouchableOpacity>

      <View style={styles.titleBlock}>
        <EditText variant="title" numberOfLines={1} accessibilityRole="header">
          Edit Profile
        </EditText>
      </View>

      <Animated.View style={[styles.border, borderStyle]} />
    </Animated.View>
  );
};

export default React.memo(EditProfileHeader);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
    paddingHorizontal: CART_SPACING.lg,
    paddingBottom: hp('1.2%'),
  },
  backBtn: {
    padding: CART_SPACING.xs,
  },
  backIcon: {
    resizeMode: 'contain',
    tintColor: CART_COLORS.textPrimary,
  },
  titleBlock: {
    flex: 1,
    marginLeft: CART_SPACING.xs,
    justifyContent: 'center',
  },
  border: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: CART_COLORS.border,
  },
});

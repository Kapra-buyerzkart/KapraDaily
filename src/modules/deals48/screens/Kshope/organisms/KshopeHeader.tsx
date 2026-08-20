import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcons } from '../../../assets/icons';
import SearchField from '../molecules/SearchField';
import { PressableScale, ShopText } from '../atoms';
import { GUTTER } from '../styles';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  hitSlopTo,
  wp,
} from '@/styles/cartTheme';

const AVATAR = wp('9.5%');

interface KshopeHeaderProps {
  name?: string;
  backgroundStyle: any;
  borderStyle: any;
  onProfile: () => void;
  onCart: () => void;
  onNotifications: () => void;
  onSearch: () => void;
}

const KshopeHeader: React.FC<KshopeHeaderProps> = ({
  name,
  backgroundStyle,
  borderStyle,
  onProfile,
  onCart,
  onNotifications,
  onSearch,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      style={[
        styles.bar,
        backgroundStyle,
        { paddingTop: insets.top + CART_SPACING.sm },
      ]}
    >
      <View style={styles.topRow}>
        <PressableScale
          to={0.97}
          onPress={onProfile}
          contentStyle={styles.identity}
          accessibilityRole="button"
          accessibilityLabel="Open profile"
        >
          <View style={styles.avatar}>
            <AppIcons.User size={wp('4.6%')} color={CART_COLORS.primary} />
          </View>
          <View style={styles.identityCopy}>
            <ShopText variant="micro" tone="muted">
              Shopping as
            </ShopText>
            <ShopText variant="labelStrong" tone="primary" numberOfLines={1}>
              {name || 'Guest'}
            </ShopText>
          </View>
        </PressableScale>

        <View style={styles.actions}>
          <PressableScale
            to={0.9}
            onPress={onCart}
            contentStyle={styles.action}
            hitSlop={hitSlopTo(wp('3%'))}
            accessibilityRole="button"
            accessibilityLabel="Cart"
          >
            <AppIcons.Bag size={wp('5%')} color={CART_COLORS.textPrimary} />
          </PressableScale>
          <PressableScale
            to={0.9}
            onPress={onNotifications}
            contentStyle={styles.action}
            hitSlop={hitSlopTo(wp('3%'))}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <AppIcons.Bell size={wp('5%')} color={CART_COLORS.textPrimary} />
          </PressableScale>
        </View>
      </View>

      <View style={styles.searchRow}>
        <SearchField placeholder="Search product" onPress={onSearch} />
      </View>

      <Animated.View style={[styles.border, borderStyle]} />
    </Animated.View>
  );
};

export default React.memo(KshopeHeader);

const styles = StyleSheet.create({
  bar: {
    paddingBottom: CART_SPACING.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: GUTTER,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm + 2,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: CART_RADIUS.pill,
    backgroundColor: CART_COLORS.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityCopy: {
    maxWidth: wp('45%'),
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.xs,
  },
  action: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: CART_RADIUS.pill,
    backgroundColor: CART_COLORS.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CART_COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRow: {
    paddingHorizontal: GUTTER,
    paddingTop: CART_SPACING.md,
  },
  border: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: CART_COLORS.borderStrong,
  },
});

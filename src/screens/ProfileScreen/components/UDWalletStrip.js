import { View, Text, Pressable, Image } from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { styles } from '../styles';
import icons from '@/assets/icons';
import { INK, MAX_FONT_SCALE } from '@/styles/homeTheme';
import { PRESS_IN, PRESS_OUT } from '../motion';

// `me/bwallet` resolves after first paint, so the strip has to be able to draw
// itself without it. It renders a real 0.00 rather than a spinner — that is
// what a new account's balance looks like anyway, and a placeholder that only
// ever flashes for one frame costs more than it tells anyone.
//
// Same two-decimal treatment BCoinScreen uses for the same number, so the
// balance doesn't change shape between here and the screen this leads to.
const formatCoins = wallet => Number(wallet?.bCoins || 0).toFixed(2);

// `bCoinValue` is the rupee worth of one coin. Only drawn when the API actually
// sent a positive rate — a "₹0.00" next to a real balance reads as the coins
// being worthless rather than as the rate being missing.
const formatWorth = wallet => {
  const rate = Number(wallet?.bCoinValue);
  if (!rate || Number.isNaN(rate)) return null;
  return `₹${(Number(wallet?.bCoins || 0) * rate).toFixed(2)}`;
};

export default function UDWalletStrip({ walletData, onPress }) {
  const wallet = walletData?.wallet;
  const balance = formatCoins(wallet);
  const worth = formatWorth(wallet);

  const scale = useSharedValue(1);
  const stripStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(0.98, PRESS_IN);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, PRESS_OUT);
      }}
      accessibilityRole="button"
      accessibilityLabel={`UD Wallet, ${balance} UD Coins`}
    >
      <Animated.View style={[styles.walletStrip, stripStyle]}>
        <View style={styles.walletCoinWell}>
          <Image source={icons.udCoinNew} style={styles.walletCoin} />
        </View>

        <View style={styles.walletText}>
          <Text
            style={styles.walletLabel}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            UD WALLET
          </Text>
          <View style={styles.walletBalanceRow}>
            <Text
              style={styles.walletBalance}
              numberOfLines={1}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {balance}
            </Text>
            <Text
              style={styles.walletUnit}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              UD Coins
            </Text>
            {!!worth && (
              <Text
                style={styles.walletWorth}
                numberOfLines={1}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                · {worth}
              </Text>
            )}
          </View>
        </View>

        <Ionicons name="chevron-forward" color={INK.faint} size={wp('3.8%')} />
      </Animated.View>
    </Pressable>
  );
}

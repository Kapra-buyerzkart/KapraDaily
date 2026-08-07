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
import { useCountUp } from '@/hooks/useCountUp';
import { BALANCE_COUNT_UP, PRESS_IN, PRESS_OUT } from '../motion';

const formatCoins = coins => Number(coins || 0).toFixed(2);

const coinRate = wallet => {
  const rate = Number(wallet?.bCoinValue);
  return !rate || Number.isNaN(rate) ? null : rate;
};

export default function UDWalletStrip({ walletData, onPress }) {
  const wallet = walletData?.wallet;
  const coins = Number(wallet?.bCoins || 0);
  const rate = coinRate(wallet);

  const counted = useCountUp(coins, BALANCE_COUNT_UP);
  const balance = formatCoins(counted);
  const worth = rate === null ? null : `₹${(counted * rate).toFixed(2)}`;

  const settled = formatCoins(coins);

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
      accessibilityLabel={`UD Wallet, ${settled} UD Coins`}
    >
      <Animated.View style={[styles.walletStrip, stripStyle]}>
        <View style={styles.walletCoinWell}>
          <Image source={icons.udCoinUpdated} style={styles.walletCoin} />
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

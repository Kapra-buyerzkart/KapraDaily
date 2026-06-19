import React from 'react';
import { Text, Image } from 'react-native';
import Reanimated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import styles from '../styles';

const SCROLL_RANGE = 120;

const CoinBar = ({ bCoins, scrollY }) => {
  const subtitleAnimStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [1, 0],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [0, -20],
      Extrapolation.CLAMP,
    );
    return { opacity, transform: [{ translateY }] };
  });

  const pillAnimStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [1, 0],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [0, -25],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [1, 0.95],
      Extrapolation.CLAMP,
    );
    return { opacity, transform: [{ translateY }, { scale }] };
  });

  const separatorAnimStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  return (
    <Reanimated.View>
      <Reanimated.View style={styles.coinBar}>
        <Reanimated.View style={subtitleAnimStyle}>
          <Text style={styles.coinBarText}>
            Use UD-Coins to Book Your Tickets
          </Text>
        </Reanimated.View>
        <Reanimated.View style={[styles.coinBadge, pillAnimStyle]}>
          <Image
            source={require('../../../assets/images/coin.png')}
            style={styles.coinIcon}
            resizeMode="contain"
          />
          <Text style={styles.coinAmount}>{bCoins || 0} </Text>
        </Reanimated.View>
      </Reanimated.View>
      <Reanimated.View style={[styles.tabSeparator, separatorAnimStyle]} />
    </Reanimated.View>
  );
};

export default CoinBar;

import React, { useEffect } from 'react';
import { View, Text, Dimensions, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import AnimatedPressable from '@/components/AnimatedPressable';
import icons from '@/assets/icons';
import styles from '../styles';

const CARD_WIDTH = Dimensions.get('window').width - 40;
const SHIMMER_START = -120;
const SHIMMER_END = CARD_WIDTH + 40;

const ClaimBanner = ({ onPress }) => {
  const flip = useSharedValue(0);
  const glow = useSharedValue(0);
  const sweep = useSharedValue(SHIMMER_START);

  useEffect(() => {
    flip.value = withRepeat(
      withSequence(
        withDelay(
          2200,
          withTiming(360, {
            duration: 1100,
            easing: Easing.inOut(Easing.cubic),
          }),
        ),
        withTiming(0, { duration: 0 }),
      ),
      -1,
      false,
    );
    glow.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
    if (Platform.OS !== 'ios') {
      sweep.value = withRepeat(
        withSequence(
          withDelay(
            1600,
            withTiming(SHIMMER_END, {
              duration: 900,
              easing: Easing.inOut(Easing.quad),
            }),
          ),
          withTiming(SHIMMER_START, { duration: 0 }),
        ),
        -1,
        false,
      );
    }
  }, [flip, glow, sweep]);

  const coinStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 800 }, { rotateY: `${flip.value}deg` }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.16 + glow.value * 0.2,
    transform: [{ scale: 1 + glow.value * 0.3 }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sweep.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(80).duration(400)}
      style={styles.bannerWrap}
    >
      <AnimatedPressable
        style={styles.bannerCard}
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole="button"
        accessibilityLabel="Use your UD Coins to claim your tickets"
      >
        {Platform.OS !== 'ios' && (
          <Animated.View
            style={[styles.bannerShimmer, shimmerStyle]}
            pointerEvents="none"
          >
            <LinearGradient
              colors={[
                'rgba(255,255,255,0)',
                'rgba(255,255,255,0.14)',
                'rgba(255,255,255,0)',
              ]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.bannerShimmerGradient}
            />
          </Animated.View>
        )}
        <View style={styles.bannerCoinWrap}>
          <Animated.View style={[styles.bannerCoinGlow, glowStyle]} />
          <Animated.Image
            source={icons.udcoin}
            style={[styles.bannerCoin, coinStyle]}
          />
        </View>
        <Text style={styles.bannerText}>
          Use the <Text style={styles.bannerHighlight}>UD Coins</Text> to claim
          your tickets
        </Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color="rgba(255,255,255,0.55)"
        />
      </AnimatedPressable>
    </Animated.View>
  );
};

export default React.memo(ClaimBanner);

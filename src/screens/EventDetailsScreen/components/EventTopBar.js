import React from 'react';
import { View, Text, ImageBackground, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { BlurView } from '@sbaiahmed1/react-native-blur';
import AnimatedPressable from '@/components/AnimatedPressable';
import COLORS from '@/styles/colors';
import icons from '@/assets/icons';
import { getHeaderPaddingTop } from '@/utils/headerLayout';
import styles, {
  GLASS_BLUR_ROUNDS,
  TOP_BAR_FADE_END,
  TOP_BAR_FADE_START,
} from '../styles';

const MID = (TOP_BAR_FADE_START + TOP_BAR_FADE_END) / 2;

// Native blur crashes on low-end Android devices, so we fall back to a solid tint.
const IS_ANDROID = Platform.OS === 'android';

const EventTopBar = ({ insets, scrollY, progress, title, onBack, onShare }) => {
  const surfaceStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [TOP_BAR_FADE_START, TOP_BAR_FADE_END],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const logoStyle = useAnimatedStyle(() => {
    const t = interpolate(
      scrollY.value,
      [TOP_BAR_FADE_START, MID],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return {
      opacity: 1 - t,
      transform: [{ translateY: -6 * t }],
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    const t = interpolate(
      scrollY.value,
      [MID, TOP_BAR_FADE_END],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return {
      opacity: t,
      transform: [{ translateY: 10 * (1 - t) }],
    };
  });

  const progressStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [TOP_BAR_FADE_START, TOP_BAR_FADE_END],
      [0, 1],
      Extrapolation.CLAMP,
    ),
    transform: [{ scaleX: Math.max(0.001, progress.value) }],
  }));

  return (
    <View
      pointerEvents="box-none"
      style={[styles.topBar, { paddingTop: getHeaderPaddingTop(insets) }]}
    >
      <Animated.View
        pointerEvents="none"
        style={[styles.topBarSurface, surfaceStyle]}
      >
        {IS_ANDROID ? (
          <View style={styles.topBarSurfaceFallback} />
        ) : (
          <BlurView
            style={styles.topBarSurfaceBlur}
            blurType="dark"
            blurAmount={24}
            blurRounds={GLASS_BLUR_ROUNDS}
            overlayColor="rgba(9,4,18,0.42)"
          />
        )}
      </Animated.View>

      <AnimatedPressable
        onPress={onBack}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <ImageBackground
          source={icons.arrowbg}
          style={styles.topBarButton}
          imageStyle={styles.topBarButtonBg}
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.white} />
        </ImageBackground>
      </AnimatedPressable>

      <View style={styles.topBarCenter} pointerEvents="none">
        <Animated.Image
          source={icons.udenticketconimage}
          style={[styles.topBarLogo, logoStyle]}
        />
        <Animated.View style={[styles.topBarTitleWrap, titleStyle]}>
          <Text style={styles.topBarTitle} numberOfLines={1}>
            {title}
          </Text>
        </Animated.View>
      </View>

      {/* <AnimatedPressable
        onPress={onShare}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Share this event"
      >
        <ImageBackground
          source={icons.arrowbg}
          style={styles.topBarButton}
          imageStyle={styles.topBarButtonBg}
        >
          <Ionicons name="share-social-outline" size={19} color={COLORS.white} />
        </ImageBackground>
      </AnimatedPressable> */}

      <View style={styles.topBarProgressTrack} pointerEvents="none">
        <Animated.View style={[styles.topBarProgressFill, progressStyle]} />
      </View>
    </View>
  );
};

export default React.memo(EventTopBar);

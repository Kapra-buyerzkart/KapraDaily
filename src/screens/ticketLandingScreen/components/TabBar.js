import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  withSpring,
  withTiming,
  Extrapolation,
} from 'react-native-reanimated';
import { BlurView } from '@react-native-community/blur';
import styles from '../styles';

const TABS = ['Tickets', 'My Vouchers'];
const STICKY_START = 80;
const STICKY_END = 130;

// Each tab is its own component so hooks aren't called inside .map()
const AnimatedTab = ({ label, isActive, onPress, indicatorAnimStyle }) => {
  const scale = useSharedValue(1);
  const activeProgress = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    activeProgress.value = withTiming(isActive ? 1 : 0, { duration: 200 });
  }, [isActive, activeProgress]);

  const tabScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    alignItems: 'center',
  }));

  const activeTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      activeProgress.value,
      [0, 1],
      ['rgba(255,255,255,0.45)', '#FFFFFF'],
    ),
    fontSize: 16,
    fontFamily: isActive ? 'Poppins-Bold' : 'Poppins-Medium',
  }));

  const handlePress = () => {
    scale.value = withTiming(0.97, { duration: 75 }, () => {
      scale.value = withTiming(1, { duration: 75 });
    });
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.tab}
      onPress={handlePress}
      activeOpacity={1}
    >
      <Reanimated.View style={tabScaleStyle}>
        <Reanimated.Text style={activeTextStyle}>{label}</Reanimated.Text>
        {isActive && (
          <Reanimated.View style={[styles.tabDot, indicatorAnimStyle]} />
        )}
      </Reanimated.View>
    </TouchableOpacity>
  );
};

const TabBar = ({ activeTab, onTabChange, scrollY, insets }) => {
  const insetsTop = insets?.top ?? 0;
  const indicatorScale = useSharedValue(1);
  const indicatorOpacity = useSharedValue(1);

  const handleTabChange = index => {
    // Reset indicator then spring it in on the newly active tab
    indicatorScale.value = 0.8;
    indicatorOpacity.value = 0.5;
    indicatorScale.value = withSpring(1, { damping: 18, stiffness: 180 });
    indicatorOpacity.value = withSpring(1, { damping: 18, stiffness: 180 });
    onTabChange(index);
  };

  const indicatorAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: indicatorScale.value }],
    opacity: indicatorOpacity.value,
  }));

  // Container background + safe-area padding: transparent → near-opaque dark on sticky
  const containerBgStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollY.value,
      [STICKY_START, STICKY_END],
      ['rgba(0,0,0,0)', 'rgba(0,0,0,0.95)'],
    );
    const borderBottomColor = interpolateColor(
      scrollY.value,
      [STICKY_START, STICKY_END],
      ['rgba(255,255,255,0)', 'rgba(255,255,255,0.06)'],
    );
    const paddingTop = interpolate(
      scrollY.value,
      [STICKY_START, STICKY_END],
      [0, insetsTop],
      Extrapolation.CLAMP,
    );
    return {
      backgroundColor,
      borderBottomColor,
      borderBottomWidth: 1,
      paddingTop,
    };
  });

  // Blur overlay fades in as tabs become sticky
  const blurOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [STICKY_START, STICKY_END],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  // Subtle red ambient glow matching the background gradient
  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [STICKY_START, STICKY_END],
      [0, 0.15],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <Reanimated.View style={[styles.tabOuterContainer, containerBgStyle]}>
      {/* iOS blur glass effect */}
      {Platform.OS === 'ios' && (
        <Reanimated.View
          style={[StyleSheet.absoluteFill, blurOpacityStyle]}
          pointerEvents="none"
        >
          {/* <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={8}
          /> */}
        </Reanimated.View>
      )}

      {/* Subtle red ambient glow (matches the screen's right-side red gradient) */}
      <Reanimated.View
        style={[styles.stickyRedGlow, glowStyle]}
        pointerEvents="none"
      />

      {/* Tabs row */}
      <View style={styles.tabContainer}>
        {TABS.map((tab, index) => (
          <AnimatedTab
            key={tab}
            label={tab}
            isActive={activeTab === index}
            onPress={() => handleTabChange(index)}
            indicatorAnimStyle={indicatorAnimStyle}
          />
        ))}
      </View>
    </Reanimated.View>
  );
};

export default TabBar;

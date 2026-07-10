import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Canvas } from '@shopify/react-native-skia';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Circle as SvgCircle, Path as SvgPath } from 'react-native-svg';

import AnimatedPressable from '../../components/AnimatedPressable';
import useLocationOnboarding from './useLocationOnboarding';
import LocationMarker from './LocationMarker';
import RippleEffect from './RippleEffect';
import FloatingGroceries from './FloatingGroceries';
import LocationProgressCard from './LocationProgressCard';
import LocationPermissionSheet from './LocationPermissionSheet';
import LocationAreaPickerSheet from './LocationAreaPickerSheet';
import LocationSearchSheet from './LocationSearchSheet';
import LocationSuccessAnimation from './LocationSuccessAnimation';
import { LOCATION_COLORS, LOCATION_FONTS } from './locationTheme';
import {
  MARKER_CANVAS_SIZE,
  STEPS,
  SUBTITLE_TEXT,
  SUCCESS_EXIT_DURATION_MS,
  SUCCESS_HOLD_MS,
  SUCCESS_TITLE_TEXT,
  TITLE_CHAR_STAGGER_MS,
  TITLE_TEXT,
} from './locationConstants';

const SearchIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <SvgCircle cx={7} cy={7} r={5.5} stroke={LOCATION_COLORS.primary} strokeWidth={1.6} />
    <SvgPath
      d="M11.2 11.2L14.5 14.5"
      stroke={LOCATION_COLORS.primary}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </Svg>
);

const AnimatedTitle = ({ isSuccess }) => {
  const successOpacity = useSharedValue(0);

  useEffect(() => {
    successOpacity.value = withTiming(isSuccess ? 1 : 0, { duration: 260 });
  }, [isSuccess, successOpacity]);

  const successStyle = useAnimatedStyle(() => ({ opacity: successOpacity.value }));
  const originalStyle = useAnimatedStyle(() => ({ opacity: 1 - successOpacity.value }));

  return (
    <View style={styles.titleWrap}>
      <Animated.View style={[styles.titleLayer, originalStyle]}>
        <View style={styles.charRow}>
          {TITLE_TEXT.split('').map((char, index) => (
            <Animated.Text
              key={index}
              entering={FadeIn.delay(index * TITLE_CHAR_STAGGER_MS).duration(220)}
              style={styles.titleText}
            >
              {char === ' ' ? ' ' : char}
            </Animated.Text>
          ))}
        </View>
      </Animated.View>
      <Animated.Text style={[styles.titleText, styles.titleLayer, successStyle]}>
        {SUCCESS_TITLE_TEXT}
      </Animated.Text>
    </View>
  );
};

const LocationScreen = ({ navigation }) => {
  const loc = useLocationOnboarding(navigation);

  const permissionSheetRef = useRef(null);
  const areaPickerSheetRef = useRef(null);
  const searchSheetRef = useRef(null);

  const exitProgress = useSharedValue(0);

  useEffect(() => {
    if (loc.showPermissionSheet) permissionSheetRef.current?.open();
    else permissionSheetRef.current?.close();
  }, [loc.showPermissionSheet]);

  useEffect(() => {
    if (loc.showAreaPicker) areaPickerSheetRef.current?.open();
    else areaPickerSheetRef.current?.close();
  }, [loc.showAreaPicker]);

  useEffect(() => {
    if (loc.showSearchSheet) searchSheetRef.current?.open();
    else searchSheetRef.current?.close();
  }, [loc.showSearchSheet]);

  useEffect(() => {
    if (loc.step !== STEPS.SUCCESS) return undefined;
    const id = setTimeout(() => {
      exitProgress.value = withTiming(
        1,
        { duration: SUCCESS_EXIT_DURATION_MS },
        finished => {
          if (finished) runOnJS(loc.navigateAfterLocation)();
        },
      );
    }, SUCCESS_HOLD_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.step]);

  const exitStyle = useAnimatedStyle(() => ({
    opacity: 1 - exitProgress.value,
    transform: [{ scale: 1 + exitProgress.value * 0.05 }],
  }));

  if (loc.isFastPath) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.fastPathMarkerWrap}>
          <Canvas style={styles.canvas}>
            <LocationMarker />
          </Canvas>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FloatingGroceries />

      <Animated.View style={[styles.content, exitStyle]}>
        <View style={styles.topBar}>
          <AnimatedPressable style={styles.topBarButton} onPress={loc.onSkipAll}>
            <Text style={styles.topBarButtonText}>Skip</Text>
          </AnimatedPressable>
          <AnimatedPressable
            style={styles.searchButton}
            onPress={() => loc.setShowSearchSheet(true)}
          >
            <SearchIcon />
          </AnimatedPressable>
        </View>

        <View style={styles.centerWrap}>
          {loc.step === STEPS.SUCCESS ? (
            <LocationSuccessAnimation />
          ) : (
            <Canvas style={styles.canvas}>
              <RippleEffect />
              <LocationMarker />
            </Canvas>
          )}

          <AnimatedTitle isSuccess={loc.step === STEPS.SUCCESS} />

          <Animated.Text
            entering={FadeIn.delay(500).duration(320)}
            style={styles.subtitle}
          >
            {SUBTITLE_TEXT}
          </Animated.Text>
        </View>

        <View style={styles.cardWrap}>
          <LocationProgressCard step={loc.step} completedSteps={loc.completedSteps} />
        </View>
      </Animated.View>

      <LocationPermissionSheet
        ref={permissionSheetRef}
        mode={loc.permissionSheetMode}
        onPrimaryPress={loc.onPrimaryPermissionPress}
        onChooseManually={loc.onChooseManuallyPress}
        onClose={() => loc.setShowPermissionSheet(false)}
      />
      <LocationAreaPickerSheet
        ref={areaPickerSheetRef}
        locations={loc.listOfLocations}
        selected={loc.selectedLocation}
        onSelect={loc.setSelectedLocation}
        onSkip={loc.onAreaPickerSkip}
        onApply={loc.onAreaPickerApply}
        onClose={() => loc.setShowAreaPicker(false)}
      />
      <LocationSearchSheet
        ref={searchSheetRef}
        onPlaceSelected={loc.onManualPlaceSelected}
        onClose={() => loc.setShowSearchSheet(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LOCATION_COLORS.background,
  },
  content: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  topBarButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  topBarButtonText: {
    fontFamily: LOCATION_FONTS.medium,
    fontSize: 14,
    color: LOCATION_COLORS.textSecondary,
  },
  searchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: LOCATION_COLORS.secondaryBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  canvas: {
    width: MARKER_CANVAS_SIZE,
    height: MARKER_CANVAS_SIZE,
  },
  titleWrap: {
    width: '100%',
    height: 32,
    justifyContent: 'center',
    marginTop: 8,
  },
  titleLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  charRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: LOCATION_FONTS.bold,
    fontSize: 22,
    color: LOCATION_COLORS.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: LOCATION_FONTS.medium,
    fontSize: 14,
    lineHeight: 20,
    color: LOCATION_COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
  cardWrap: {
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  fastPathMarkerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LocationScreen;

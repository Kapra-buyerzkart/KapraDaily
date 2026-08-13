import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  BackHandler,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { BlurView } from '@sbaiahmed1/react-native-blur';

import { ModalManager, generateModalId } from './ModalManager';

export const MODAL_POSITION = {
  CENTER: 'center',
  BOTTOM: 'bottom',
  TOP: 'top',
};
export const MODAL_ANIMATION_PRESET = {
  FADE: 'fade',
  SLIDE: 'slide',
  SCALE: 'scale',
};

const DRAG_CLOSE_DISTANCE = 100;
const DRAG_CLOSE_VELOCITY = 800;

const CustomModal = forwardRef((props, ref) => {
  const {
    children,
    onClose,
    closeOnBackdropPress = true,
    closeOnBackPress = true,
    animationDuration = 300,
    position = MODAL_POSITION.CENTER,
    animationPreset,
    backdropOpacity = 0.5,
    blurBackdrop = false,
    blurAmount = 10,
    gestureEnabled = true,
    queue,
    width,
    maxHeight,
    containerStyle,
    contentStyle,
    scrollable = true,
    statusBarStyle = 'light-content',
    statusBarBackgroundColor = '#000000',
    disableStatusBarTint = false,
  } = props;

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const id = useRef(generateModalId()).current;

  const isOpenRef = useRef(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const hasFinalizedRef = useRef(true);
  const closeTimeoutRef = useRef(null);

  const progress = useSharedValue(0);
  const dragY = useSharedValue(0);

  const resolvedPreset = useMemo(
    () =>
      animationPreset ??
      (position === MODAL_POSITION.CENTER
        ? MODAL_ANIMATION_PRESET.SCALE
        : MODAL_ANIMATION_PRESET.SLIDE),
    [animationPreset, position],
  );

  const finalizeClose = useCallback(() => {
    if (hasFinalizedRef.current) return;
    hasFinalizedRef.current = true;
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsMounted(false);
    ModalManager.unmount(id);
    ModalManager.releaseQueue(queue, id);
    onClose?.();
  }, [id, onClose, queue]);

  const close = useCallback(() => {
    if (!isOpenRef.current) return;
    isOpenRef.current = false;
    setIsInteractive(false);
    progress.value = withTiming(
      0,
      { duration: animationDuration, easing: Easing.in(Easing.cubic) },
      finished => {
        if (finished) {
          runOnJS(finalizeClose)();
        }
      },
    );
    closeTimeoutRef.current = setTimeout(
      finalizeClose,
      animationDuration + 50,
    );
  }, [animationDuration, finalizeClose, progress]);

  const open = useCallback(() => {
    const performOpen = () => {
      if (isOpenRef.current) return;
      isOpenRef.current = true;
      hasFinalizedRef.current = false;
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      dragY.value = 0;
      setIsMounted(true);
      setIsInteractive(true);
      progress.value = withTiming(1, {
        duration: animationDuration,
        easing: Easing.out(Easing.cubic),
      });
    };

    ModalManager.requestOpen(queue, id, performOpen);
  }, [animationDuration, dragY, id, progress, queue]);

  const toggle = useCallback(() => {
    if (isOpenRef.current) {
      close();
    } else {
      open();
    }
  }, [close, open]);

  useImperativeHandle(ref, () => ({ open, close, toggle }), [
    open,
    close,
    toggle,
  ]);

  useEffect(() => {
    if (Platform.OS !== 'android') return undefined;

    const onBackPress = () => {
      if (!isOpenRef.current) return false;
      if (closeOnBackPress) {
        close();
      }
      return true;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );
    return () => subscription.remove();
  }, [close, closeOnBackPress]);

  const keyboard = useAnimatedKeyboard();
  const keyboardAnimatedStyle = useAnimatedStyle(() => {
    if (position === MODAL_POSITION.TOP) {
      return { transform: [{ translateY: 0 }] };
    }
    const shiftFactor = position === MODAL_POSITION.BOTTOM ? 1 : 0.5;
    return {
      transform: [{ translateY: -keyboard.height.value * shiftFactor }],
    };
  });

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .enabled(gestureEnabled && position !== MODAL_POSITION.CENTER)
        .onUpdate(event => {
          if (position === MODAL_POSITION.BOTTOM) {
            dragY.value = Math.max(0, event.translationY);
          } else if (position === MODAL_POSITION.TOP) {
            dragY.value = Math.min(0, event.translationY);
          }
        })
        .onEnd(event => {
          const pastDistance = Math.abs(dragY.value) > DRAG_CLOSE_DISTANCE;
          const pastVelocity = Math.abs(event.velocityY) > DRAG_CLOSE_VELOCITY;
          if (pastDistance || pastVelocity) {
            runOnJS(close)();
          } else {
            dragY.value = withSpring(0, { damping: 18, stiffness: 220 });
          }
        }),
    [close, dragY, gestureEnabled, position],
  );

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0, 1],
      [0, backdropOpacity],
      Extrapolation.CLAMP,
    ),
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => {
    const opacity = progress.value;
    const transform = [{ translateY: dragY.value }];

    if (resolvedPreset === MODAL_ANIMATION_PRESET.SLIDE) {
      const offscreenDistance =
        position === MODAL_POSITION.TOP ? -windowHeight : windowHeight;
      const distance =
        position === MODAL_POSITION.CENTER
          ? windowHeight * 0.25
          : offscreenDistance;
      const translateY = interpolate(
        progress.value,
        [0, 1],
        [distance, 0],
        Extrapolation.CLAMP,
      );
      transform.push({ translateY });
    } else if (resolvedPreset === MODAL_ANIMATION_PRESET.SCALE) {
      const scale = interpolate(
        progress.value,
        [0, 1],
        [0.85, 1],
        Extrapolation.CLAMP,
      );
      transform.push({ scale });
    }

    return { opacity, transform };
  });

  const containerPositionStyle = useMemo(() => {
    switch (position) {
      case MODAL_POSITION.TOP:
        return { justifyContent: 'flex-start' };
      case MODAL_POSITION.BOTTOM:
        return { justifyContent: 'flex-end' };
      default:
        return { justifyContent: 'center' };
    }
  }, [position]);

  const radiusStyle = useMemo(() => {
    switch (position) {
      case MODAL_POSITION.BOTTOM:
        return { borderTopLeftRadius: 24, borderTopRightRadius: 24 };
      case MODAL_POSITION.TOP:
        return { borderBottomLeftRadius: 24, borderBottomRightRadius: 24 };
      default:
        return { borderRadius: 24 };
    }
  }, [position]);

  const safeAreaStyle = useMemo(() => {
    switch (position) {
      case MODAL_POSITION.BOTTOM:
        return { paddingBottom: Math.max(insets.bottom, 12) };
      case MODAL_POSITION.TOP:
        return { paddingTop: Math.max(insets.top, 12) };
      default:
        return null;
    }
  }, [insets.bottom, insets.top, position]);

  const resolvedWidth =
    width ??
    (position === MODAL_POSITION.CENTER ? windowWidth * 0.88 : windowWidth);
  const resolvedMaxHeight = maxHeight ?? windowHeight * 0.85;
  const showDragHandle = gestureEnabled && position !== MODAL_POSITION.CENTER;

  const renderModalNode = useCallback(
    () => (
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents={isInteractive ? 'box-none' : 'none'}
      >
        <Animated.View
          style={[styles.backdrop, backdropAnimatedStyle]}
          pointerEvents="auto"
        >
          {blurBackdrop ? (
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="dark"
              blurAmount={blurAmount}
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.backdropFill]} />
          )}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeOnBackdropPress ? close : undefined}
            accessibilityRole="button"
            accessibilityLabel="Close modal"
          />
        </Animated.View>

        <View
          style={[styles.container, containerPositionStyle]}
          pointerEvents="box-none"
        >
          <Animated.View style={keyboardAnimatedStyle}>
            <Animated.View
              style={[
                styles.contentWrapper,
                { width: resolvedWidth, maxHeight: resolvedMaxHeight },
                contentAnimatedStyle,
              ]}
            >
              {}
              <View
                style={[
                  styles.contentBox,
                  radiusStyle,
                  safeAreaStyle,
                  containerStyle,
                ]}
              >
                {showDragHandle && (
                  <GestureDetector gesture={pan}>
                    <View style={styles.handleHitArea}>
                      <View style={styles.handle} />
                    </View>
                  </GestureDetector>
                )}
                {scrollable ? (
                  <ScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={[styles.scrollContent, contentStyle]}
                  >
                    {children}
                  </ScrollView>
                ) : (
                  <View style={contentStyle}>{children}</View>
                )}
              </View>
            </Animated.View>
          </Animated.View>
        </View>
      </View>
    ),
    [
      backdropAnimatedStyle,
      blurAmount,
      blurBackdrop,
      children,
      close,
      closeOnBackdropPress,
      containerPositionStyle,
      containerStyle,
      contentAnimatedStyle,
      contentStyle,
      isInteractive,
      keyboardAnimatedStyle,
      pan,
      radiusStyle,
      resolvedMaxHeight,
      resolvedWidth,
      safeAreaStyle,
      scrollable,
      showDragHandle,
    ],
  );

  const statusBarMeta = useMemo(
    () => ({
      statusBarStyle,
      statusBarBackgroundColor,
      disableStatusBarTint,
    }),
    [disableStatusBarTint, statusBarBackgroundColor, statusBarStyle],
  );

  useEffect(() => {
    if (!isMounted) return;
    ModalManager.mount(id, renderModalNode, statusBarMeta);
  }, [id, isMounted, renderModalNode, statusBarMeta]);

  useEffect(
    () => () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      ModalManager.unmount(id);
      ModalManager.cancelQueueRequest(queue, id);
      ModalManager.releaseQueue(queue, id);
    },
    [id, queue],
  );

  return null;
});

CustomModal.displayName = 'CustomModal';

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropFill: {
    backgroundColor: '#000000',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  contentWrapper: {},
  contentBox: {
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  scrollContent: {
    flexGrow: 1,
  },
  handleHitArea: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DADADA',
  },
});

export default React.memo(CustomModal);

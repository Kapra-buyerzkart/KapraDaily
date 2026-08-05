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

// Drag distance (px) / release velocity (px/s) past which a swipe is
// treated as "let go" rather than "snap back" by the gesture-to-close handle.
const DRAG_CLOSE_DISTANCE = 100;
const DRAG_CLOSE_VELOCITY = 800;

/**
 * CustomModal
 *
 * A from-scratch modal built only from Views, Pressable, Reanimated and a
 * Portal registry (ModalManager + ModalProvider) — no RN Modal, no
 * react-native-modal, no react-native-paper Modal.
 *
 * Control is entirely imperative: nothing about whether the modal is open
 * lives in props. A parent gets a ref and calls `.open()` / `.close()` /
 * `.toggle()`. This means re-rendering the parent screen never
 * accidentally remounts or flickers the modal, and the same component can
 * be triggered from several places without lifting state up.
 *
 * Despite being declared wherever the developer wants (e.g. inside a deeply
 * nested screen), the actual visual output is teleported to <ModalProvider />
 * mounted once at the app root, so it always paints above everything else.
 */
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
    // When false, children are rendered directly instead of inside the
    // built-in ScrollView. Use for content that manages its own scrolling
    // (nested ScrollView/FlatList) to avoid nested-scroll gesture conflicts.
    scrollable = true,
    statusBarStyle = 'light-content',
    statusBarBackgroundColor = '#000000',
    disableStatusBarTint = false,
  } = props;

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Stable identity for this instance inside the ModalManager portal registry.
  const id = useRef(generateModalId()).current;

  // Logical open/closed state, read synchronously from imperative handlers
  // (a React state value would be stale inside those callbacks).
  const isOpenRef = useRef(false);
  // Whether this instance currently has a node registered in the portal.
  // Stays true for the full duration of the close animation so the exit
  // transition can play before the node is actually removed.
  const [isMounted, setIsMounted] = useState(false);
  // Whether the backdrop/content should still capture touches. Flips to
  // false the instant close() is called — separate from isMounted, which
  // stays true until the exit animation finishes — so a modal that's
  // mid-close never blocks taps to whatever is behind/above it. Guards
  // against e.g. a native <Modal> (a loading spinner shown right after
  // confirming) mounting concurrently and starving the Reanimated
  // withTiming completion callback below, which would otherwise leave a
  // full-screen, invisible, touch-absorbing backdrop mounted indefinitely.
  const [isInteractive, setIsInteractive] = useState(false);
  // Guards finalizeClose against running twice (once from the animation's
  // finished callback, once from the fallback timer below).
  const hasFinalizedRef = useRef(true);
  const closeTimeoutRef = useRef(null);

  // 0 = fully closed, 1 = fully open. Drives every animated style below.
  const progress = useSharedValue(0);
  // Extra offset (px) applied on top of `progress` while the user drags
  // the gesture handle; reset to 0 on every fresh open.
  const dragY = useSharedValue(0);

  const resolvedPreset = useMemo(
    () =>
      animationPreset ??
      (position === MODAL_POSITION.CENTER
        ? MODAL_ANIMATION_PRESET.SCALE
        : MODAL_ANIMATION_PRESET.SLIDE),
    [animationPreset, position],
  );

  // --- Imperative open / close / toggle -------------------------------

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
    // Fallback: guarantee the portal node is torn down even if the
    // animation above never reports finished:true (e.g. interrupted by a
    // concurrently-mounting native <Modal>).
    closeTimeoutRef.current = setTimeout(
      finalizeClose,
      animationDuration + 50,
    );
  }, [animationDuration, finalizeClose, progress]);

  const open = useCallback(() => {
    const performOpen = () => {
      // Guards against double-tap / repeated open() calls re-triggering
      // the enter animation or stacking duplicate portal entries.
      if (isOpenRef.current) return;
      isOpenRef.current = true;
      hasFinalizedRef.current = false;
      // Cancel any fallback teardown timer left over from a close() that
      // was interrupted by this reopen — otherwise it fires later and
      // force-unmounts this fresh open with no animation and no user
      // action, since finalizeClose's re-entrancy guard was just reset above.
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

    // When part of a queue, ModalManager decides whether this instance may
    // open immediately or has to wait for the current holder to close.
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

  // --- Android hardware back button -----------------------------------

  useEffect(() => {
    if (Platform.OS !== 'android') return undefined;

    const onBackPress = () => {
      if (!isOpenRef.current) return false;
      if (closeOnBackPress) {
        close();
      }
      // Swallow the press either way while open, so the screen behind a
      // visible modal never navigates away underneath it.
      return true;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );
    return () => subscription.remove();
  }, [close, closeOnBackPress]);

  // --- Keyboard avoidance (Reanimated, no KeyboardAvoidingView) -------
  // useAnimatedKeyboard tracks keyboard height on the UI thread so content
  // shifts up smoothly with the keyboard instead of jumping when it's
  // already fully shown/hidden.

  const keyboard = useAnimatedKeyboard();
  const keyboardAnimatedStyle = useAnimatedStyle(() => {
    if (position === MODAL_POSITION.TOP) {
      // Top-anchored modals sit clear of the keyboard already.
      return { transform: [{ translateY: 0 }] };
    }
    const shiftFactor = position === MODAL_POSITION.BOTTOM ? 1 : 0.5;
    return {
      transform: [{ translateY: -keyboard.height.value * shiftFactor }],
    };
  });

  // --- Gesture-to-close (drag handle only, never the scrollable body) -

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

  // --- Animated styles --------------------------------------------------

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

  // --- Derived layout (responsive width / height / safe area / radius) -

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

  // --- The actual node handed to the portal ----------------------------
  // Recreated only when something that affects what's drawn changes —
  // never on every animation frame, since Reanimated mutates shared
  // values on the UI thread without needing a JS re-render.
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
              {/* Content box. This sized layer sits above the backdrop, so it
                already blocks taps from falling through to the backdrop's
                close Pressable — it must be a plain View, NOT a Pressable/
                Touchable: wrapping a ScrollView/FlatList in a touchable steals
                the scroll gesture (no scrolling on iOS, erratic on Android). */}
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

  // Presentation hints for the portal host — it can't paint behind
  // Android's status bar from inside the absolute-fill backdrop (the OS
  // owns that layer), so it tints the status bar itself instead.
  const statusBarMeta = useMemo(
    () => ({
      statusBarStyle,
      statusBarBackgroundColor,
      disableStatusBarTint,
    }),
    [disableStatusBarTint, statusBarBackgroundColor, statusBarStyle],
  );

  // Push the latest node into the portal registry while open, so any prop
  // change (new children, resized window, etc.) is reflected immediately.
  useEffect(() => {
    if (!isMounted) return;
    ModalManager.mount(id, renderModalNode, statusBarMeta);
  }, [id, isMounted, renderModalNode, statusBarMeta]);

  // Final safety net: if the owning component unmounts while a modal is
  // still registered (e.g. the parent screen unmounts mid-animation),
  // make sure it doesn't leak in the portal registry or block a queue.
  useEffect(
    () => () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      ModalManager.unmount(id);
      ModalManager.cancelQueueRequest(queue, id);
      ModalManager.releaseQueue(queue, id);
    },
    [id, queue],
  );

  // CustomModal never renders anything in its own place in the tree —
  // its entire visual output lives in the portal (see renderModalNode).
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

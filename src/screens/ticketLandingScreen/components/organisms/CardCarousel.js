import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, Animated, StyleSheet, Vibration } from 'react-native';
import {
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { hp } from '../../../../utils/responsive';

import {
  ARROW_MIN_GAP,
  ARROW_PILL_HEIGHT,
  CARD_HEIGHT,
  CARD_WIDTH,
  CLAIM_GAP,
  FALLBACK_ARC_APEX_Y,
  SCREEN_WIDTH,
  STACK_VISIBLE,
  SWIPE_THRESHOLD,
  UNMEASURED_ARROW_GAP,
} from '../../constants';
import { ClaimButton } from '../atoms';
import { ArrowPill, StackCard } from '../molecules';

const CardCarousel = ({ fadeAnim, onClaim, vouchers, arcApexY }) => {
  const cards = useMemo(() => vouchers ?? [], [vouchers]);

  const cardCount = cards.length;
  const [activeIndex, setActiveIndex] = useState(0);

  // The pill straddles the apex of the backdrop's curve. `arcApexY` is that
  // apex in window coordinates, so measuring the stack the same way keeps both
  // sides of the subtraction in one coordinate space (which also cancels out
  // any list scroll offset) instead of mixing layout with screen dimensions.
  const stackRef = useRef(null);
  const [arrowMarginTop, setArrowMarginTop] = useState(null);
  const alignArrowsToArc = useCallback(() => {
    stackRef.current?.measureInWindow((x, y, width, height) => {
      if (!height) {
        // Nothing to align against: fall back rather than leave the arrows and
        // the claim button hidden.
        setArrowMarginTop(gap => gap ?? UNMEASURED_ARROW_GAP);
        return;
      }
      const pillTop = (arcApexY ?? FALLBACK_ARC_APEX_Y) - ARROW_PILL_HEIGHT / 2;
      setArrowMarginTop(Math.max(ARROW_MIN_GAP, pillTop - (y + height)));
    });
  }, [arcApexY]);

  // The backdrop is measured on its own layout pass, so the apex usually lands
  // after the stack has already reported in: realign whenever it changes.
  useEffect(() => {
    if (arcApexY == null) return;
    alignArrowsToArc();
  }, [arcApexY, alignArrowsToArc]);

  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const hapticFired = useSharedValue(false);

  const triggerHaptic = useCallback(() => {
    Vibration.vibrate(10);
  }, []);

  // The drag values are reset after the new card has been committed (see the
  // layout effect below). Resetting them here recentred the card on the UI
  // thread a frame before React swapped its contents, so the card that had just
  // been flung away flashed back into place still showing the old voucher.
  const transitionRef = useRef(null);

  const advance = useCallback(() => {
    // A lone card has nothing to swap to, so the index never changes and the
    // layout effect below would never fire: recentre it here instead.
    if (cardCount < 2) {
      dragX.value = 0;
      dragY.value = 0;
      return;
    }
    transitionRef.current = 'next';
    setActiveIndex(i => (i + 1) % cardCount);
  }, [cardCount, dragX, dragY]);

  useLayoutEffect(() => {
    const transition = transitionRef.current;
    if (!transition) return;
    transitionRef.current = null;

    if (transition === 'prev') {
      dragX.value = -SCREEN_WIDTH;
      dragY.value = 0;
      dragX.value = withSpring(0, { damping: 16, stiffness: 160 });
      return;
    }

    dragX.value = 0;
    dragY.value = 0;
  }, [activeIndex, dragX, dragY]);

  const handleNext = useCallback(() => {
    if (cardCount < 2) return;
    dragX.value = withTiming(
      -SCREEN_WIDTH * 1.4,
      { duration: 220 },
      finished => {
        if (finished) runOnJS(advance)();
      },
    );
    dragY.value = withTiming(-30, { duration: 220 });
  }, [advance, cardCount, dragX, dragY]);

  const handlePrev = useCallback(() => {
    if (cardCount < 2) return;
    transitionRef.current = 'prev';
    setActiveIndex(i => (i - 1 + cardCount) % cardCount);
  }, [cardCount]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(() => {
          hapticFired.value = false;
        })
        .onUpdate(event => {
          dragX.value = event.translationX;
          dragY.value = event.translationY;
          const passedThreshold =
            Math.abs(event.translationX) > SWIPE_THRESHOLD;
          if (passedThreshold && !hapticFired.value) {
            hapticFired.value = true;
            runOnJS(triggerHaptic)();
          }
        })
        .onEnd(event => {
          const shouldDismiss =
            Math.abs(event.translationX) > SWIPE_THRESHOLD ||
            Math.abs(event.velocityX) > 800;

          if (shouldDismiss) {
            const direction = event.translationX < 0 ? -1 : 1;
            dragX.value = withTiming(
              direction * SCREEN_WIDTH * 1.4,
              { duration: 220 },
              finished => {
                if (finished) runOnJS(advance)();
              },
            );
            dragY.value = withTiming(event.translationY * 0.5, {
              duration: 220,
            });
          } else {
            dragX.value = withSpring(0, { damping: 16, stiffness: 180 });
            dragY.value = withSpring(0, { damping: 16, stiffness: 180 });
          }
        }),
    [advance, dragX, dragY, hapticFired, triggerHaptic],
  );

  const handleClaim = useCallback(
    () => onClaim(cards[activeIndex]),
    [onClaim, cards, activeIndex],
  );

  if (cardCount === 0) return null;

  const stackSlots = [];
  for (
    let stackIndex = Math.min(STACK_VISIBLE, cardCount) - 1;
    stackIndex >= 0;
    stackIndex -= 1
  ) {
    const item = cards[(activeIndex + stackIndex) % cardCount];
    const isTop = stackIndex === 0;
    const card = (
      <StackCard
        key={stackIndex}
        item={item}
        stackIndex={stackIndex}
        dragX={dragX}
        dragY={dragY}
        isTop={isTop}
      />
    );
    stackSlots.push(
      isTop ? (
        <GestureDetector gesture={panGesture} key="top-gesture">
          {card}
        </GestureDetector>
      ) : (
        card
      ),
    );
  }

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={styles.carouselWrapper}>
        <View
          ref={stackRef}
          onLayout={alignArrowsToArc}
          collapsable={false}
          style={styles.stackContainer}
        >
          {stackSlots}
        </View>
      </View>

      {/* Kept hidden until the arc has been measured so the arrows and the
          claim button below them never flash at an unaligned position. */}
      <View style={arrowMarginTop == null && styles.hiddenUntilAligned}>
        <View style={{ marginTop: arrowMarginTop ?? ARROW_MIN_GAP }}>
          <ArrowPill onPrev={handlePrev} onNext={handleNext} />
        </View>

        <View style={styles.claimWrapper}>
          <ClaimButton onPress={handleClaim} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  carouselWrapper: {
    alignItems: 'center',
    marginTop: hp(3),
  },
  stackContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenUntilAligned: {
    opacity: 0,
  },
  claimWrapper: {
    alignItems: 'center',
    marginTop: CLAIM_GAP,
  },
});

export default React.memo(CardCarousel);

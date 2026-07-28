import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Image,
  Text,
  Animated,
  TouchableOpacity,
  Platform,
  Dimensions,
  StyleSheet,
  Vibration,
} from 'react-native';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
  FadeInDown,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { hp } from '../../../utils/responsive';
import { getVoucherImageSource } from '@/components/events/imageUtils';
import images from '@/assets/images';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const STACK_VISIBLE = 3;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;
const STACK_SCALE_STEP = 0.06;
const STACK_Y_STEP = 16;
const CARD_WIDTH = SCREEN_WIDTH * 0.72;
const CARD_HEIGHT = CARD_WIDTH * 0.62;

const CURVE_APEX_RATIO = 610 / 932;
const ARROW_PILL_HEIGHT = 48;
const ARROW_MIN_GAP = 16;
const CLAIM_GAP = 28;
const ARROW_PILL_OVERLAP = hp((60 / 932) * 100);

const StackCard = React.memo(({ item, stackIndex, dragX, dragY, isTop }) => {
  const imageSource = getVoucherImageSource(item);
  const zIndex = isTop ? 10 : STACK_VISIBLE - stackIndex;

  const transformStyle = useAnimatedStyle(() => {
    if (isTop) {
      const rotate = interpolate(
        dragX.value,
        [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        [-12, 0, 12],
        Extrapolation.CLAMP,
      );
      return {
        transform: [
          { translateX: dragX.value },
          { translateY: dragY.value * 0.4 },
          { rotate: `${rotate}deg` },
        ],
      };
    }

    const dragProgress = interpolate(
      Math.abs(dragX.value) + Math.abs(dragY.value) * 0.5,
      [0, SWIPE_THRESHOLD * 1.1],
      [0, 1],
      Extrapolation.CLAMP,
    );

    const scale = interpolate(
      dragProgress,
      [0, 1],
      [
        1 - stackIndex * STACK_SCALE_STEP,
        1 - (stackIndex - 1) * STACK_SCALE_STEP,
      ],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      dragProgress,
      [0, 1],
      [stackIndex * STACK_Y_STEP, (stackIndex - 1) * STACK_Y_STEP],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    if (!isTop) return { opacity: 0 };
    const progress = interpolate(
      Math.abs(dragX.value),
      [0, SWIPE_THRESHOLD],
      [0, 0.7],
      Extrapolation.CLAMP,
    );
    return { opacity: progress };
  });

  return (
    <Reanimated.View
      entering={FadeInDown.delay(stackIndex * 90)
        .springify()
        .damping(16)}
      style={[styles.stackCardSlot, { zIndex }]}
    >
      <Reanimated.View style={[styles.stackCardVisual, transformStyle]}>
        {isTop && (
          <Reanimated.View
            pointerEvents="none"
            style={[styles.stackCardGlow, glowStyle]}
          />
        )}
        <Image
          source={imageSource}
          style={styles.cardImage}
          resizeMode="cover"
        />
        {!!item?.discountTitle && (
          <View style={styles.stackDiscountBadge}>
            <Text style={styles.stackDiscountBadgeText}>
              {item.discountTitle}
            </Text>
          </View>
        )}
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item?.title}
        </Text>
      </Reanimated.View>
    </Reanimated.View>
  );
});

const ArrowButton = React.memo(({ iconName, onPress }) => {
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withTiming(0.85, { duration: 70 }, () => {
      scale.value = withTiming(1, { duration: 90 });
    });
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.arrowButton}
      onPress={handlePress}
      activeOpacity={0.6}
    >
      <Reanimated.View style={pressStyle}>
        <MaterialIcons name={iconName} size={28} color="#FFFFFF" />
      </Reanimated.View>
    </TouchableOpacity>
  );
});

const CardCarousel = ({ fadeAnim, onClaim, vouchers }) => {
  const cards = useMemo(() => vouchers ?? [], [vouchers]);

  const cardCount = cards.length;
  const [activeIndex, setActiveIndex] = useState(0);

  // Distance from the bottom of the card stack down to the curve apex. Measured
  // in window coordinates because the stack's screen position depends on the
  // safe-area inset and the header/tab heights above it.
  const stackRef = useRef(null);
  const [arrowMarginTop, setArrowMarginTop] = useState(null);
  const handleStackLayout = useCallback(() => {
    stackRef.current?.measureInWindow((x, y, width, height) => {
      if (!height) return;
      const pillTop = SCREEN_HEIGHT * CURVE_APEX_RATIO - ARROW_PILL_HEIGHT / 2;
      setArrowMarginTop(Math.max(ARROW_MIN_GAP, pillTop - (y + height)));
    });
  }, []);

  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const claimScale = useSharedValue(1);
  const hapticFired = useSharedValue(false);

  const triggerHaptic = useCallback(() => {
    Vibration.vibrate(10);
  }, []);

  const advance = useCallback(() => {
    setActiveIndex(i => (cardCount ? (i + 1) % cardCount : 0));
    dragX.value = 0;
    dragY.value = 0;
  }, [cardCount, dragX, dragY]);

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
    setActiveIndex(i => (i - 1 + cardCount) % cardCount);
    dragX.value = -SCREEN_WIDTH;
    dragY.value = 0;
    dragX.value = withSpring(0, { damping: 16, stiffness: 160 });
  }, [cardCount, dragX, dragY]);

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

  const handleClaimPressIn = () => {
    claimScale.value = withTiming(0.92, { duration: 90 });
  };
  const handleClaimPressOut = () => {
    claimScale.value = withSpring(1, { damping: 12, stiffness: 220 });
  };
  const claimButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: claimScale.value }],
  }));

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
          onLayout={handleStackLayout}
          style={styles.stackContainer}
        >
          {stackSlots}
        </View>
      </View>

      <View
        style={[
          styles.arrowContainer,
          {
            marginTop:
              arrowMarginTop ?? (Platform.OS === 'ios' ? hp(11) : hp(10)),
          },
        ]}
      >
        <View style={styles.arrowPill}>
          <ArrowButton iconName="keyboard-arrow-left" onPress={handlePrev} />
          <View style={styles.arrowDivider} />
          <ArrowButton iconName="keyboard-arrow-right" onPress={handleNext} />
        </View>
      </View>

      <View style={styles.claimWrapper}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={handleClaimPressIn}
          onPressOut={handleClaimPressOut}
          onPress={() => onClaim(cards[activeIndex])}
        >
          <Reanimated.View style={claimButtonStyle}>
            <Image
              source={images.claimbutton}
              style={styles.claimButton}
              resizeMode="contain"
            />
          </Reanimated.View>
        </TouchableOpacity>
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
  stackCardSlot: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  stackCardVisual: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#161616',
  },
  stackCardGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#9A5CFF',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  stackDiscountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  stackDiscountBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Gilroy-Bold',
  },
  cardTitle: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Gilroy-Bold',
  },
  arrowContainer: {
    alignItems: 'center',
  },
  arrowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30,
    paddingHorizontal: 6,
    top: -ARROW_PILL_OVERLAP,
  },
  arrowButton: {
    padding: 10,
  },
  arrowDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  claimWrapper: {
    alignItems: 'center',
    marginTop: CLAIM_GAP,
  },
  claimButton: {
    width: 96,
    height: 100,
  },
});

export default React.memo(CardCarousel);

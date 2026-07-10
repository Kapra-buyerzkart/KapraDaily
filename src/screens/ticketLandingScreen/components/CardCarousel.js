import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Image,
  Text,
  Animated,
  TouchableOpacity,
  Platform,
  Dimensions,
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
import LinearGradient from 'react-native-linear-gradient';
import { hp } from '../../../utils/responsive';
import styles from '../styles';
import CONFIG from '../../../globals/config';

const PLACEHOLDER_IMAGE = require('../../../assets/images/movieTicket/voucher.png');
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STACK_VISIBLE = 3;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;
const STACK_SCALE_STEP = 0.06;
const STACK_Y_STEP = 16;

const getCardImageSource = item => {
  if (item?.imageUrl) return { uri: CONFIG.image_base_url + item.imageUrl };
  if (item?.cardImage) return item.cardImage;
  if (item?.image) return item.image;
  return PLACEHOLDER_IMAGE;
};

const StackCard = ({ item, stackIndex, dragX, dragY, isTop }) => {
  const imageSource = getCardImageSource(item);
  const zIndex = isTop ? 10 : STACK_VISIBLE - stackIndex;

  // Transform lives on its own inner view (never on the view that also carries
  // `entering`) — Reanimated warns that a layout-mount animation and a
  // per-frame transform style fight over the same `transform` prop otherwise.
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
      [1 - stackIndex * STACK_SCALE_STEP, 1 - (stackIndex - 1) * STACK_SCALE_STEP],
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
      entering={FadeInDown.delay(stackIndex * 90).springify().damping(16)}
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
          defaultSource={PLACEHOLDER_IMAGE}
        />
        {!!item?.discountTitle && (
          <View style={styles.stackDiscountBadge}>
            <Text style={styles.stackDiscountBadgeText}>
              {item.discountTitle}
            </Text>
          </View>
        )}
        <Text style={styles.cardTitle}>{item?.title}</Text>
      </Reanimated.View>
    </Reanimated.View>
  );
};

const ArrowButton = ({ iconName, onPress }) => {
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
};

const CardCarousel = ({ fadeAnim, onClaim, vouchers }) => {
  const cards = useMemo(() => vouchers ?? [], [vouchers]);

  const cardCount = cards.length;
  const [activeIndex, setActiveIndex] = useState(0);

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
    dragX.value = withTiming(-SCREEN_WIDTH * 1.4, { duration: 220 }, finished => {
      if (finished) runOnJS(advance)();
    });
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
          const passedThreshold = Math.abs(event.translationX) > SWIPE_THRESHOLD;
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
            dragY.value = withTiming(event.translationY * 0.5, { duration: 220 });
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
  for (let stackIndex = Math.min(STACK_VISIBLE, cardCount) - 1; stackIndex >= 0; stackIndex -= 1) {
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
    <>
      <Animated.View style={[styles.carouselWrapper, { opacity: fadeAnim }]}>
        <View style={styles.stackContainer}>{stackSlots}</View>
      </Animated.View>

      <View
        style={[
          styles.arrowContainer,
          { marginTop: Platform.OS === 'ios' ? hp(14) : hp(17) },
        ]}
      >
        <View style={styles.arrowPill}>
          <ArrowButton iconName="keyboard-arrow-left" onPress={handlePrev} />
          <View style={styles.arrowDivider} />
          <ArrowButton iconName="keyboard-arrow-right" onPress={handleNext} />
        </View>
      </View>

      <Image
        source={require('../../../assets/images/movieTicket/Subtract.png')}
        style={styles.subtractImage}
        resizeMode="contain"
      />

      <View style={styles.claimWrapper}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={handleClaimPressIn}
          onPressOut={handleClaimPressOut}
          onPress={() => onClaim(cards[activeIndex])}
        >
          <Reanimated.View style={claimButtonStyle}>
            <LinearGradient
              colors={['#F5D680', '#D4A843', '#C49A38']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.claimButton}
            >
              <Text style={styles.claimText}>Claim</Text>
            </LinearGradient>
          </Reanimated.View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default CardCarousel;

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { Fonts } from '../theme/fonts';
import FallbackImage from './FallbackImage';
import { cartPillSlideIn, cartPillSlideOut } from '../animations/cartItemPop';

const CAPSULE_BG = '#F25000';
const MAX_VISIBLE_THUMBNAILS = 3;

const THUMBNAIL_SIZE = 40;
const THUMBNAIL_RING = 2;
const THUMBNAIL_RADIUS = 12;

const CARD_OVERLAP = 22;
const CARD_STEP = THUMBNAIL_SIZE - CARD_OVERLAP;
const CARD_TILT = 6;
const CARD_SCALE_STEP = 0.04;

const CAPSULE_HEIGHT = 64;
const CAPSULE_RADIUS = 18;

const CAPSULE_PADDING_H = 12;
const STACK_GAP = 18;
const ARROW_GAP = 18;

const STACK_COMPACT_SCALE = 0.82;

const STACK_WIDTH = THUMBNAIL_SIZE + CARD_STEP * (MAX_VISIBLE_THUMBNAILS - 1);

const COMPACT_WIDTH = Math.ceil(
  STACK_WIDTH * STACK_COMPACT_SCALE + CAPSULE_PADDING_H * 2,
);

const BOUNCE_SPRING = { damping: 9, stiffness: 220, mass: 0.6 };

const fanRotation = (index: number, total: number) =>
  total <= 1 ? 0 : (index - (total - 1) / 2) * CARD_TILT;

const cardStackStyle = (index: number, total: number) => ({
  marginLeft: index === 0 ? 0 : -CARD_OVERLAP,
  zIndex: total - index,
  elevation: total - index,
  transform: [
    { rotate: `${fanRotation(index, total)}deg` },
    { scale: 1 - index * CARD_SCALE_STEP },
  ],
});

interface FloatingCartButtonProps {
  bottom?: number;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ bottom }) => {
  const navigation = useNavigation<any>();
  const { cartItems = [] } = useCart();
  const insets = useSafeAreaInsets();

  const itemCount = cartItems?.length || 0;
  const prevCountRef = useRef(itemCount);
  const phaseRef = useRef(itemCount > 0 ? 'expanded' : 'idle');
  const [contentWidth, setContentWidth] = useState(COMPACT_WIDTH + 170);
  const maxExpandedWidth = wp('92%');

  const bounceScale = useSharedValue(1);
  const widthProgress = useSharedValue(itemCount > 0 ? 1 : 0);
  const textProgress = useSharedValue(itemCount > 0 ? 1 : 0);
  const arrowProgress = useSharedValue(itemCount > 0 ? 1 : 0);
  const stackPulse = useSharedValue(1);
  const arrowPulse = useSharedValue(1);
  const countOpacity = useSharedValue(1);

  function settleExpanded() {
    phaseRef.current = 'expanded';
  }

  function revealContent() {
    textProgress.value = withTiming(1, {
      duration: 180,
      easing: Easing.out(Easing.cubic),
    });
    arrowProgress.value = withDelay(
      70,
      withTiming(
        1,
        { duration: 170, easing: Easing.out(Easing.back(1.4)) },
        finished => {
          if (finished) runOnJS(settleExpanded)();
        },
      ),
    );
  }

  function runExpandSequence() {
    phaseRef.current = 'expanding';
    bounceScale.value = withSequence(
      withTiming(1.12, { duration: 90, easing: Easing.out(Easing.quad) }),
      withSpring(1, BOUNCE_SPRING),
    );
    widthProgress.value = withDelay(
      110,
      withTiming(
        1,
        { duration: 250, easing: Easing.out(Easing.cubic) },
        finished => {
          if (finished) runOnJS(revealContent)();
        },
      ),
    );
  }

  function pulseExpanded() {
    bounceScale.value = withSequence(
      withTiming(1.05, { duration: 90 }),
      withSpring(1, BOUNCE_SPRING),
    );
    stackPulse.value = withSequence(
      withTiming(1.14, { duration: 100 }),
      withSpring(1, BOUNCE_SPRING),
    );
    arrowPulse.value = withSequence(
      withTiming(1.25, { duration: 100 }),
      withSpring(1, BOUNCE_SPRING),
    );
    countOpacity.value = withSequence(
      withTiming(0.35, { duration: 90 }),
      withTiming(1, { duration: 130 }),
    );
  }

  useEffect(() => {
    const prevCount = prevCountRef.current;

    if (itemCount > 0 && prevCount === 0) {
      phaseRef.current = 'compact';
      runExpandSequence();
    } else if (itemCount > prevCount) {
      const currentPhase = phaseRef.current;
      if (currentPhase === 'expanded') {
        pulseExpanded();
      } else if (currentPhase === 'compact') {
        runExpandSequence();
      }
    } else if (itemCount < prevCount && itemCount > 0) {
      countOpacity.value = withSequence(
        withTiming(0.35, { duration: 90 }),
        withTiming(1, { duration: 120 }),
      );
    }

    prevCountRef.current = itemCount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemCount]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const expandedWidth = Math.min(
      Math.max(contentWidth, COMPACT_WIDTH),
      maxExpandedWidth,
    );
    const width = interpolate(
      widthProgress.value,
      [0, 1],
      [COMPACT_WIDTH, expandedWidth],
      Extrapolation.CLAMP,
    );
    return {
      width,
      transform: [{ scale: bounceScale.value }],
    };
  });

  const stackAnimatedStyle = useAnimatedStyle(() => {
    const baseScale = interpolate(
      widthProgress.value,
      [0, 1],
      [STACK_COMPACT_SCALE, 1],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ scale: baseScale * stackPulse.value }],
    };
  });

  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      widthProgress.value,
      [0, 0.5],
      [1, 0],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        scale: interpolate(
          widthProgress.value,
          [0, 0.5],
          [1, 0.6],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textProgress.value,
    transform: [
      { translateX: interpolate(textProgress.value, [0, 1], [-14, 0]) },
    ],
  }));

  const countAnimatedStyle = useAnimatedStyle(() => ({
    opacity: countOpacity.value,
  }));

  const arrowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: arrowProgress.value,
    transform: [
      {
        scale:
          interpolate(
            arrowProgress.value,
            [0, 1],
            [0.4, 1],
            Extrapolation.CLAMP,
          ) * arrowPulse.value,
      },
    ],
  }));

  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  const previewItems = cartItems.slice(0, MAX_VISIBLE_THUMBNAILS);
  const extraCount = cartItems.length - MAX_VISIBLE_THUMBNAILS;
  const fallbackImage = require('../assets/images/logos/noimage.png');

  const getImageSource = (item: any) =>
    item?.productImage ? { uri: item.productImage } : fallbackImage;

  const goToCart = () => navigation.navigate('KshopeCart');

  const renderThumbnailStack = () => {
    const cardCount = previewItems.length + (extraCount > 0 ? 1 : 0);

    return (
      <View style={styles.stackContainer}>
        {previewItems.map((item: any, index: number) => (
          <View
            key={item.cartItemId || item.productId || index}
            style={[styles.card, cardStackStyle(index, cardCount)]}
          >
            <FallbackImage
              source={getImageSource(item)}
              resizeMode="cover"
              style={styles.productImage}
            />
          </View>
        ))}
        {extraCount > 0 && (
          <View
            style={[
              styles.card,
              styles.extraCard,
              cardStackStyle(cardCount - 1, cardCount),
              { zIndex: cardCount + 1, elevation: cardCount + 1 },
            ]}
          >
            <Text style={styles.extraBadgeText}>+{extraCount}</Text>
          </View>
        )}
      </View>
    );
  };

  const bottomOffset =
    bottom !== undefined ? bottom : insets.bottom > 0 ? insets.bottom : hp('1%');

  return (
    <Animated.View
      entering={cartPillSlideIn}
      exiting={cartPillSlideOut}
      style={[styles.outerContainer, { bottom: bottomOffset }]}
    >
      <TouchableOpacity activeOpacity={0.9} onPress={goToCart}>
        <Animated.View style={[styles.capsule, containerAnimatedStyle]}>
          <View style={styles.clip}>
            <View style={styles.stackSlot}>
              <Animated.View style={stackAnimatedStyle}>
                {renderThumbnailStack()}
              </Animated.View>
              <Animated.View
                style={[styles.compactBadge, badgeAnimatedStyle]}
                pointerEvents="none"
              >
                <Text style={styles.compactBadgeText}>{itemCount}</Text>
              </Animated.View>
            </View>

            <Animated.View style={[styles.viewOne, textAnimatedStyle]}>
              <Text style={styles.viewCartText} numberOfLines={1}>
                View cart
              </Text>
              <Animated.Text
                style={[styles.itemsText, countAnimatedStyle]}
                numberOfLines={1}
              >
                {cartItems.length} items
              </Animated.Text>
            </Animated.View>

            <Animated.View style={arrowAnimatedStyle}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={goToCart}
                style={styles.arrowButton}
              >
                <MaterialIcons
                  name="chevron-right"
                  size={26}
                  color={CAPSULE_BG}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </TouchableOpacity>

      <View
        style={styles.measureRow}
        pointerEvents="none"
        onLayout={e => {
          const measured = Math.ceil(e.nativeEvent.layout.width);
          setContentWidth(prev => (prev !== measured ? measured : prev));
        }}
      >
        <View style={styles.stackSlot}>{renderThumbnailStack()}</View>
        <View style={styles.viewOne}>
          <Text style={styles.viewCartText} numberOfLines={1}>
            View cart
          </Text>
          <Text style={styles.itemsText} numberOfLines={1}>
            {cartItems.length} items
          </Text>
        </View>
        <View style={styles.arrowButton}>
          <MaterialIcons name="chevron-right" size={26} color={CAPSULE_BG} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 9999,
  },
  capsule: {
    alignSelf: 'center',
    height: CAPSULE_HEIGHT,
    borderRadius: CAPSULE_RADIUS,
    backgroundColor: CAPSULE_BG,
    shadowColor: '#7A2400',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
  },
  clip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: CAPSULE_RADIUS,
    overflow: 'hidden',
    paddingLeft: CAPSULE_PADDING_H,
    paddingRight: CAPSULE_PADDING_H,
  },
  stackSlot: {
    marginRight: STACK_GAP,
  },
  stackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    height: THUMBNAIL_SIZE,
    width: THUMBNAIL_SIZE,
    borderRadius: THUMBNAIL_RADIUS,
    backgroundColor: '#FFFFFF',
    shadowColor: '#5A1B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  productImage: {
    height: '100%',
    width: '100%',
    borderRadius: THUMBNAIL_RADIUS,
    borderWidth: THUMBNAIL_RING,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },
  extraCard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraBadgeText: {
    color: CAPSULE_BG,
    fontFamily: Fonts.gilroySemiBold,
    fontSize: 12,
  },
  compactBadge: {
    position: 'absolute',
    bottom: -2,
    right: -6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 3,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: CAPSULE_BG,
    zIndex: MAX_VISIBLE_THUMBNAILS + 2,
    elevation: MAX_VISIBLE_THUMBNAILS + 2,
  },
  compactBadgeText: {
    color: CAPSULE_BG,
    fontFamily: Fonts.gilroySemiBold,
    fontSize: 11,
  },
  viewOne: {
    flexShrink: 1,
    justifyContent: 'center',
  },
  viewCartText: {
    fontSize: 17,
    lineHeight: 21,
    color: '#FFFFFF',
    fontFamily: Fonts.gilroySemiBold,
    letterSpacing: 0.2,
  },
  itemsText: {
    color: '#FFFFFF',
    fontFamily: Fonts.gilroyRegular,
    fontSize: 13,
    lineHeight: 16,
    opacity: 0.85,
    marginTop: 3,
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: ARROW_GAP,
  },
  measureRow: {
    position: 'absolute',
    opacity: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: CAPSULE_PADDING_H,
    paddingRight: CAPSULE_PADDING_H,
  },
});

export default React.memo(FloatingCartButton);

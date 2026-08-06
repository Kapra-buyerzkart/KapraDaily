import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
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
import { FONTS } from '../styles/typography';
import { useCart } from '../context/CartContext';
import CONFIG from '../globals/config';
import CachedImage from './CachedImage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cartPillSlideIn, cartPillSlideOut } from '../animations/cartItemPop';

const ARROW_BUTTON_BG = '#F57333';
const CAPSULE_BG = '#F25000';
const MAX_VISIBLE_THUMBNAILS = 3;

const CAPSULE_HEIGHT = 60;
const COMPACT_WIDTH = 100;
const STACK_COMPACT_SCALE = 0.82;
const BOUNCE_SPRING = { damping: 9, stiffness: 220, mass: 0.6 };

const SelectedProducts = () => {
  const navigation = useNavigation();
  const { cartItems } = useCart();
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

  const getImageSource = item => {
    if (item.featuredImage) {
      return { uri: `${CONFIG.image_base_url}${item.featuredImage}` };
    }
    if (item.productImage) {
      return { uri: `${CONFIG.image_base_url}${item.productImage}` };
    }
    if (item.image) {
      return item.image;
    }
    return require('../assets/images/udenDealNotfound.png');
  };

  const goToCart = () => navigation.navigate('CartScreen');

  const renderThumbnailStack = () => (
    <View style={styles.stackContainer}>
      {previewItems.map((item, index) => (
        <CachedImage
          key={item.productId || item.id || index}
          source={getImageSource(item)}
          resizeMode="cover"
          style={[
            styles.productImage,
            index !== 0 && styles.productImageOverlap,
          ]}
        />
      ))}
      {extraCount > 0 && (
        <View
          style={[
            styles.productImage,
            styles.productImageOverlap,
            styles.extraBadge,
          ]}
        >
          <Text style={styles.extraBadgeText}>+{extraCount}</Text>
        </View>
      )}
    </View>
  );

  return (
    <Animated.View
      entering={cartPillSlideIn}
      exiting={cartPillSlideOut}
      style={{ marginBottom: insets.bottom > 0 ? insets.bottom : hp('1%') }}
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
                <MaterialIcons name="chevron-right" size={26} color="#FFFFFF" />
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
          <MaterialIcons name="chevron-right" size={26} color="#FFFFFF" />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  capsule: {
    alignSelf: 'center',
    height: CAPSULE_HEIGHT,
    borderRadius: 16,
    backgroundColor: CAPSULE_BG,
  },
  clip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: CAPSULE_HEIGHT / 2,
    overflow: 'hidden',
    paddingLeft: 6,
    paddingRight: 6,
  },
  stackSlot: {
    marginRight: 10,
  },
  stackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    height: 40,
    width: 40,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: CAPSULE_BG,
    backgroundColor: '#fff',
  },
  productImageOverlap: {
    marginLeft: -8,
  },
  extraBadge: {
    backgroundColor: '#FFFFFF',
    borderColor: CAPSULE_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraBadgeText: {
    color: CAPSULE_BG,
    fontFamily: FONTS.gilroy.semiBold,
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
  },
  compactBadgeText: {
    color: CAPSULE_BG,
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: 11,
  },
  viewOne: {
    flexShrink: 1,
    justifyContent: 'center',
  },
  viewCartText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.semiBold,
  },
  itemsText: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.regular,
    fontSize: 14,
    opacity: 0.9,
    marginTop: 2,
  },
  arrowButton: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: ARROW_BUTTON_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  measureRow: {
    position: 'absolute',
    opacity: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 6,
    paddingRight: 6,
  },
});

export default React.memo(SelectedProducts);

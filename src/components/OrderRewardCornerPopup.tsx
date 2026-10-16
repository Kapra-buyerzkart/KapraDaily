import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { FONTS } from '../styles/typography';
import { impactTick } from '../utils/haptics';
import {
  checkSpinWinEligibility,
  isOrderSpinClaimed,
  extractCampaignAndRewards,
} from '../api/spinWheelService';

interface OrderRewardCornerPopupProps {
  orderId?: string | number | null;
  orderNumber?: string | number | null;
  onPress: () => void;
  bottomOffset?: number;
  rightOffset?: number;
}

const OrderRewardCornerPopup: React.FC<OrderRewardCornerPopupProps> = ({
  orderId,
  orderNumber,
  onPress,
  bottomOffset = hp('2.5%'),
  rightOffset = wp('4%'),
}) => {
  const [isEligible, setIsEligible] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  // Micro-motion animations
  const scale = useSharedValue(0.4);
  const opacity = useSharedValue(0);
  const floatY = useSharedValue(0);
  const cardTilt = useSharedValue(0);

  useEffect(() => {
    let isMounted = true;
    const targetOrderId = orderId || orderNumber;

    if (!targetOrderId) {
      setIsEligible(false);
      return;
    }

    const checkEligibility = async () => {
      // 1. First check if order spin is already claimed locally
      const claimed = await isOrderSpinClaimed(targetOrderId);
      if (claimed) {
        if (isMounted) setIsEligible(false);
        return;
      }

      // 2. Call GET /api/v1/rewards/spin-win/eligible?orderId={orderId}
      try {
        const response: any = await checkSpinWinEligibility(targetOrderId);
        if (!isMounted) return;

        const campaignInfo = extractCampaignAndRewards(response);
        const data = response?.data !== undefined ? response.data : response;

        const spinsAvailable =
          typeof data?.spinsAvailable === 'number'
            ? data.spinsAvailable
            : typeof data?.spinsCount === 'number'
            ? data.spinsCount
            : (data?.canSpin || data?.isEligible ? 1 : 0);

        const hasPrizeAllocation =
          (spinsAvailable > 0 || (Array.isArray(campaignInfo.rewards) && campaignInfo.rewards.length > 0)) &&
          data?.isEligible !== false;

        if (hasPrizeAllocation) {
          setIsEligible(true);
        } else {
          setIsEligible(false);
        }
      } catch (err) {
        if (isMounted) setIsEligible(false);
      }
    };

    checkEligibility();

    return () => {
      isMounted = false;
    };
  }, [orderId, orderNumber]);

  useEffect(() => {
    if (isEligible && !isDismissed) {
      // Spring entrance
      scale.value = withSpring(1, { damping: 14, stiffness: 130 });
      opacity.value = withTiming(1, { duration: 350 });

      // Subtle float motion
      floatY.value = withRepeat(
        withSequence(
          withTiming(-4, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );

      // Subtle card tilt
      cardTilt.value = withRepeat(
        withSequence(
          withTiming(-2, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
          withTiming(2, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        true,
      );
    }
  }, [isEligible, isDismissed]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: floatY.value },
    ],
    opacity: opacity.value,
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${cardTilt.value}deg` }],
  }));

  if (!isEligible || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    impactTick();
    opacity.value = withTiming(0, { duration: 200 }, () => {
      // Dismiss callback
    });
    setIsDismissed(true);
  };

  const handleCardPress = () => {
    impactTick();
    onPress();
  };

  return (
    <Animated.View
      style={[
        styles.floatingContainer,
        { bottom: bottomOffset, right: rightOffset },
        animatedStyle,
      ]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleCardPress}
        style={styles.cardWrapper}
        accessibilityRole="button"
        accessibilityLabel="Claim your spin and win reward"
      >
        {/* Dismiss 'X' Button on top-right */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleDismiss}
          style={styles.dismissButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Dismiss reward card"
        >
          <Ionicons name="close" size={12} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Tilted Graphic Reward Card */}
        <Animated.View style={[styles.rewardGraphicCard, cardAnimatedStyle]}>
          <LinearGradient
            colors={['#FF6B35', '#E64A19', '#BF360C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.cardShine} />

          {/* Frosted gift hub */}
          <View style={styles.giftIconHub}>
            <MaterialCommunityIcons name="gift-open" size={24} color="#FFFFFF" />
          </View>

          {/* Perforated / Dashed line indicator */}
          <View style={styles.perforationRow}>
            <Text style={styles.perforationText}>• • • SPIN HERE • • •</Text>
          </View>
        </Animated.View>

        {/* Bottom Title & Subtitle Badge */}
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <MaterialCommunityIcons
              name="star-four-points"
              size={11}
              color="#FBBF24"
            />
            <Text style={styles.titleText}>SPIN & WIN</Text>
          </View>
          <Text style={styles.subtitleText}>Reveal a reward</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    zIndex: 9999,
    elevation: 12,
  },
  cardWrapper: {
    width: 126,
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 8,
    paddingBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272A',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  dismissButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(24, 24, 27, 0.92)',
    borderWidth: 1.5,
    borderColor: '#52525B',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  rewardGraphicCard: {
    width: 106,
    height: 82,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  giftIconHub: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  perforationRow: {
    marginTop: 6,
  },
  perforationText: {
    fontFamily: FONTS.gilroy?.semiBold || 'System',
    fontSize: 7.5,
    color: '#FFE0B2',
    letterSpacing: 0.5,
  },
  textContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  titleText: {
    fontFamily: FONTS.gilroy?.bold || 'System',
    fontSize: 11,
    fontWeight: '800',
    color: '#FDE68A',
    letterSpacing: 0.4,
  },
  subtitleText: {
    fontFamily: FONTS.gilroy?.medium || 'System',
    fontSize: 9.5,
    color: '#E4E4E7',
    marginTop: 2,
  },
});

export default OrderRewardCornerPopup;

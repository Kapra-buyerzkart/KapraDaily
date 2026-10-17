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
import Svg, { Circle, G, Path } from 'react-native-svg';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { FONTS } from '../styles/typography';
import { impactTick, successTick } from '../utils/haptics';
import {
  isOrderSpinClaimed,
  getOrderSpinReward,
  playSpinWin,
  markOrderSpinClaimed,
  mapBackendRewardToPrize,
} from '../api/spinWheelService';
import SpinWheelBanner from './SpinWheelBanner';

const MINI_WHEEL_SIZE = wp('15%');
const MINI_RADIUS = MINI_WHEEL_SIZE / 2;

// 8 Segments for the miniature wheel graphic
const MINI_COLORS = [
  '#059669',
  '#EA580C',
  '#7C3AED',
  '#D97706',
  '#0D9488',
  '#E11D48',
  '#0284C7',
  '#16A34A',
];

const OrderSpinBanner = ({ orderId, orderNumber, onPressSpin }) => {
  const isFocused = useIsFocused();
  const [isClaimed, setIsClaimed] = useState(false);
  const [claimedReward, setClaimedReward] = useState(null);

  // Motion Graphics Animation Values
  const wheelRotation = useSharedValue(0);
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.45);
  const starRotation = useSharedValue(0);
  const arrowNudge = useSharedValue(0);
  const cardScale = useSharedValue(0.95);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    // Check claim status when orderId changes or screen regains focus
    checkClaimStatus();
  }, [orderId, isFocused]);

  useEffect(() => {
    // 1. Entrance spring animation
    cardScale.value = withSpring(1, { damping: 15, stiffness: 120 });
    cardOpacity.value = withTiming(1, { duration: 400 });

    // 2. Hypnotic continuous rotation of mini wheel (Motion Graphic)
    wheelRotation.value = withRepeat(
      withTiming(360, {
        duration: 7000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    // 3. Ambient breathing glow behind card
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.45, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    // 4. Playful star twinkle wobble
    starRotation.value = withRepeat(
      withSequence(
        withTiming(15, { duration: 600, easing: Easing.inOut(Easing.quad) }),
        withTiming(-15, { duration: 600, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );

    // 5. Arrow button nudge inviting interaction
    arrowNudge.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 500, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 500, easing: Easing.in(Easing.quad) }),
      ),
      -1,
      true,
    );
  }, []);

  const checkClaimStatus = async () => {
    if (!orderId) return;
    const claimed = await isOrderSpinClaimed(orderId);
    setIsClaimed(claimed);
    if (claimed) {
      const reward = await getOrderSpinReward(orderId);
      setClaimedReward(reward?.prize || null);
    }
  };


  const handlePressCard = async () => {
    if (isClaimed) return;
    impactTick();
    if (typeof onPressSpin === 'function') {
      onPressSpin();
    } else {
      try {
        const targetOrderId = orderId
          ? isNaN(Number(orderId))
            ? orderId
            : Number(orderId)
          : undefined;
        const response = await playSpinWin({
          orderId: targetOrderId,
        });
        const respData =
          response?.data !== undefined ? response.data : response;
        const rewardObj = respData?.prize || respData?.reward || respData;
        const mappedPrize = mapBackendRewardToPrize(rewardObj, 0);
        if (targetOrderId) {
          await markOrderSpinClaimed(targetOrderId, mappedPrize);
        }
        setClaimedReward(mappedPrize);
        setIsClaimed(true);
        successTick();
      } catch (err) {
        console.log('OrderSpinBanner playSpinWin error:', err);
      }
    }
  };

  // Reanimated Animated Styles
  const wheelAnimStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${wheelRotation.value}deg` }],
  }));

  const glowAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  const starAnimStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${starRotation.value}deg` }],
  }));

  const arrowAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: arrowNudge.value }],
  }));

  const containerAnimStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  // Render Slices for Mini Wheel Graphic
  const renderMiniWheelSlices = () => {
    const sliceAngle = 360 / 8;
    return MINI_COLORS.map((color, i) => {
      const startAngle = (i * sliceAngle * Math.PI) / 180;
      const endAngle = ((i + 1) * sliceAngle * Math.PI) / 180;
      const x1 = MINI_RADIUS + MINI_RADIUS * Math.sin(startAngle);
      const y1 = MINI_RADIUS - MINI_RADIUS * Math.cos(startAngle);
      const x2 = MINI_RADIUS + MINI_RADIUS * Math.sin(endAngle);
      const y2 = MINI_RADIUS - MINI_RADIUS * Math.cos(endAngle);
      const d = `M ${MINI_RADIUS} ${MINI_RADIUS} L ${x1} ${y1} A ${MINI_RADIUS} ${MINI_RADIUS} 0 0 1 ${x2} ${y2} Z`;
      return <Path key={`slice-${i}`} d={d} fill={color} />;
    });
  };

  if (isClaimed && claimedReward) {
    // Claimed State Ribbon
    return (
      <Animated.View style={[styles.wrapper, containerAnimStyle]}>
        <View style={styles.claimedCard}>
          <LinearGradient
            colors={['#FFF5F0', '#FFF1E9', '#FFE6D9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.claimedInner}>
            <View style={styles.claimedIconBubble}>
              <MaterialCommunityIcons
                name="gift-open"
                size={22}
                color="#F25000"
              />
            </View>
            <View style={styles.claimedInfo}>
              <View style={styles.claimedTagRow}>
                <Text style={styles.claimedTag}>ORDER GIFT CLAIMED</Text>
              </View>
              <Text style={styles.claimedPrizeName}>
                {claimedReward.label || 'Assured Reward'}
              </Text>
              <Text style={styles.claimedCodeDesc}>
                {claimedReward.description || 'Valid on your next checkout'}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  }

  // Active / Unclaimed State using identical SpinWheelBanner design
  return (
    <Animated.View style={[styles.wrapper, containerAnimStyle]}>
      <SpinWheelBanner
        title="Try your luck!"
        subtitle="Win Extra Discounts, UD Coins"
        badgeText="ORDER GIFT"
        badgeIcon="gift"
        spinsCount={1}
        style={{ marginHorizontal: 0, marginTop: 4, marginBottom: 8 }}
        onPress={handlePressCard}
      />
    </Animated.View>
  );
};

export default OrderSpinBanner;

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: hp('1.8%'),
    position: 'relative',
  },
  ambientGlow: {
    position: 'absolute',
    top: -4,
    left: 4,
    right: 4,
    bottom: -4,
    backgroundColor: '#F25000',
    borderRadius: 20,
    opacity: 0.35,
    ...Platform.select({
      ios: {
        shadowColor: '#F25000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cardContainer: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(242, 80, 0, 0.35)',
    backgroundColor: '#180F0A',
    ...Platform.select({
      ios: {
        shadowColor: '#F25000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  topAccentBar: {
    height: 2.5,
    width: '100%',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.6%'),
    paddingHorizontal: wp('3.5%'),
  },
  miniWheelContainer: {
    width: MINI_WHEEL_SIZE,
    height: MINI_WHEEL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: wp('3%'),
  },
  miniWheelWrapper: {
    width: MINI_WHEEL_SIZE,
    height: MINI_WHEEL_SIZE,
    borderRadius: MINI_RADIUS,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#FF7A00',
  },
  miniPointer: {
    position: 'absolute',
    top: -7,
    alignSelf: 'center',
    zIndex: 10,
  },
  textColumn: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('0.4%'),
    flexWrap: 'nowrap',
  },
  badgeGradient: {
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    marginRight: 6,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: 9.5,
    color: '#FFFFFF',
    marginLeft: 3,
    paddingRight: 2,
    includeFontPadding: false,
  },
  orderTag: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: 9.5,
    color: '#FDBA74',
    letterSpacing: 0.1,
    flexShrink: 1,
  },
  titleText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.8%'),
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  subtitleText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('2.9%'),
    color: '#FED7AA',
    marginTop: 2,
    lineHeight: 15,
  },
  actionColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp('2%'),
  },
  actionCircle: {
    width: wp('9.5%'),
    height: wp('9.5%'),
    borderRadius: wp('4.75%'),
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#F25000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.45,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  actionPrompt: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('2.4%'),
    color: '#FFA767',
    marginTop: 3,
    letterSpacing: 0.6,
  },

  // Claimed State Styles
  claimedCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFC4A8',
    overflow: 'hidden',
    backgroundColor: '#FFF5F0',
  },
  claimedInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.4%'),
    paddingHorizontal: wp('3.5%'),
  },
  claimedIconBubble: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: '#FFE3D4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3%'),
  },
  claimedInfo: {
    flex: 1,
  },
  claimedTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  claimedTag: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('2.5%'),
    color: '#F25000',
    letterSpacing: 0.4,
  },
  claimedPrizeName: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.6%'),
    color: '#431407',
    marginTop: 1,
  },
  claimedCodeDesc: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('2.8%'),
    color: '#7C2D12',
  },
  copyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F25000',
    marginLeft: 6,
  },
  copyPillText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('2.8%'),
    color: '#F25000',
    marginRight: 4,
  },
});

import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { wp, hp } from '../../../utils/responsive';
import images from '@/assets/images';

const DASH = '____';
const OPEN_SPRING = { damping: 14, stiffness: 180, mass: 0.9 };

const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const PaymentFailedModal = ({
  visible,
  quantity = 1,
  eventName = '',
  itemLabel = 'event ticket',
  primaryButtonLabel = 'Try Again',
  onBack,
  onRetry,
}) => {
  const scale = useSharedValue(0.88);
  const opacity = useSharedValue(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      scale.value = withSpring(1, OPEN_SPRING);
      opacity.value = withTiming(1, { duration: 260 });
    } else if (mounted) {
      scale.value = withTiming(0.88, { duration: 200 });
      opacity.value = withTiming(0, { duration: 180 }, finished => {
        if (finished) runOnJS(setMounted)(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (Platform.OS !== 'android' || !visible) return undefined;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack?.();
      return true;
    });
    return () => sub.remove();
  }, [visible, onBack]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!mounted) return null;

  const plural = quantity > 1 ? 's' : '';
  const subject = eventName ? `${eventName} ${itemLabel}` : itemLabel;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View style={[styles.backdrop, backdropStyle]} />

      <View style={styles.centeredWrapper} pointerEvents="box-none">
        <Animated.View style={[styles.cardWrapper, cardStyle]}>
          <ImageBackground
            source={images.errormodalbg}
            style={styles.card}
            resizeMode="stretch"
          >
            <View style={styles.crossCircle}>
              <Text style={styles.crossMark}>✕</Text>
            </View>

            <Text style={styles.failedText}>Failed</Text>
            <Text style={styles.subtitleText}>
              Your booking for {subject} could not be completed. Please try
              again.
            </Text>

            <View style={styles.detailsBox}>
              <Row label="Date" value={DASH} />
              <Row label="Total UD Coins used" value={DASH} />
              <Row label="Total Amount paid" value={DASH} />
              <View style={[styles.row, styles.rowLast]}>
                <Text style={styles.rowLabel}>Status</Text>
                <View style={styles.statusRow}>
                  <View style={styles.statusDot}>
                    <Text style={styles.statusDotCross}>✕</Text>
                  </View>
                  <Text style={[styles.rowValue, styles.statusValue]}>
                    Failed
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity
                hitSlop={40}
                style={styles.backBtn}
                onPress={onBack}
                activeOpacity={0.75}
              >
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.retryBtn}
                onPress={onRetry}
                activeOpacity={0.85}
              >
                <Text style={styles.retryBtnText}>{primaryButtonLabel}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </Animated.View>
      </View>
    </View>
  );
};

const RED = '#F5222D';

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  centeredWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(6),
  },
  cardWrapper: {
    alignSelf: 'stretch',
  },

  card: {
    paddingHorizontal: wp(6),
    paddingTop: hp(4),
    paddingBottom: hp(3),
    alignItems: 'center',
  },

  crossCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: RED,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
    shadowColor: RED,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 16,
    elevation: 12,
  },
  crossMark: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 42,
  },

  failedText: {
    fontSize: 30,
    fontFamily: 'Gilroy-Bold',
    color: RED,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: hp(0.8),
  },
  subtitleText: {
    fontSize: 13,
    fontFamily: 'Gilroy-Regular',
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: hp(2.5),
  },

  detailsBox: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 20,
    paddingHorizontal: wp(4),
    paddingVertical: wp(2),
    paddingTop: hp(0.3),
    marginBottom: hp(2.5),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(1.3),
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    fontSize: 13,
    fontFamily: 'Gilroy-Regular',
    color: 'rgba(255,255,255,0.5)',
  },
  rowValue: {
    fontSize: 13,
    fontFamily: 'Gilroy-Medium',
    color: 'rgba(255,255,255,0.9)',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: RED,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDotCross: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 14,
  },
  statusValue: {
    color: RED,
    fontFamily: 'Gilroy-Bold',
  },

  btnRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    gap: wp(3),
  },
  backBtn: {
    flex: 1,
    paddingVertical: hp(1.6),
    borderRadius: 12,
    backgroundColor: '#3A0D0D',
    borderWidth: 1,
    borderColor: 'rgba(245,34,45,0.45)',
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: 14,
    fontFamily: 'Gilroy-Medium',
    color: '#FFFFFF',
  },
  retryBtn: {
    flex: 1,
    paddingVertical: hp(1.6),
    borderRadius: 12,
    backgroundColor: RED,
    alignItems: 'center',
  },
  retryBtnText: {
    fontSize: 14,
    fontFamily: 'Gilroy-Bold',
    color: '#FFFFFF',
  },
});

export default React.memo(PaymentFailedModal);

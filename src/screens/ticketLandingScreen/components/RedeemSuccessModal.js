import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import { wp, hp } from '../../../utils/responsive';
import icons from '@/assets/icons';

export const preloadRedeemSuccessAssets = () => {};

const Row = ({ label, value, valueStyle }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={[styles.rowValue, valueStyle]}>{value}</Text>
  </View>
);

const RedeemSuccessModal = ({
  visible,
  quantity = 1,
  coinsUsed = 0,
  amountPaid = '₹394',
  itemLabel = 'voucher',
  secondaryButtonLabel = 'My Vouchers',
  onBack,
  onSecondaryAction,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.88)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 70,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.88,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          setMounted(false);
          scaleAnim.setValue(0.88);
          opacityAnim.setValue(0);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Plain overlay has no native surface of its own, so the hardware back
  // button no longer gets swallowed for free the way RN's Modal did it.
  useEffect(() => {
    if (Platform.OS !== 'android' || !visible) return undefined;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack?.();
      return true;
    });
    return () => sub.remove();
  }, [visible, onBack]);

  const dateStr = useMemo(
    () =>
      new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    [],
  );

  if (!mounted) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Dark backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]} />

      {/* Centered card */}
      <View style={styles.centeredWrapper} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.cardWrapper,
            { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
          ]}
        >
          <ImageBackground
            source={require('../../../assets/images/movieTicket/successBg.png')}
            style={styles.card}
            resizeMode="stretch"
          >
            {/* Purple checkmark circle */}
            {/* <View style={styles.checkCircle}>
              <Text style={styles.checkMark}>✓</Text>
            </View> */}

            <Image source={icons.tickmark} style={styles.checkIcon} />
            <Text style={styles.successText}>SUCCESS</Text>
            <Text style={styles.subtitleText}>
              Your booking for {quantity} {itemLabel}
              {quantity > 1 ? 's' : ''} has been{'\n'}successfully completed
            </Text>

            <View style={styles.detailsBox}>
              <Row label="Date" value={dateStr} />
              <Row label="Total UD-Coins used" value={String(coinsUsed)} />
              <Row label="Total Amount paid" value={amountPaid} />
              <View style={[styles.row, styles.rowLast]}>
                <Text style={styles.rowLabel}>Status</Text>
                <View style={styles.statusRow}>
                  <View style={styles.statusDot}>
                    {/* <Image source={require('../../../assets/images/movieTicket/success.png')}/> */}
                    <Text style={styles.statusDotCheck}>✓</Text>
                  </View>
                  <Text style={[styles.rowValue, styles.statusValue]}>
                    Success
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
                style={styles.vouchersBtn}
                onPress={onSecondaryAction}
                activeOpacity={0.85}
              >
                <Text style={styles.vouchersBtnText}>
                  {secondaryButtonLabel}
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </Animated.View>
      </View>
    </View>
  );
};

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

  checkCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#5B2BE0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
    shadowColor: '#5B2BE0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 16,
    elevation: 12,
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '700',
    lineHeight: 44,
  },

  successText: {
    fontSize: 30,
    fontFamily: 'Gilroy-Bold',
    color: '#6E34C0',
    textAlign: 'center',
    letterSpacing: 2,
    marginVertical: hp(1),
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
    backgroundColor: '#5B2BE0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDotCheck: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 14,
  },
  statusValue: {
    color: '#7B5CE6',
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
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: 14,
    fontFamily: 'Gilroy-Medium',
    color: '#555555',
  },
  vouchersBtn: {
    flex: 1,
    paddingVertical: hp(1.6),
    borderRadius: 12,
    backgroundColor: '#5B2BE0',
    alignItems: 'center',
  },
  vouchersBtnText: {
    fontSize: 14,
    fontFamily: 'Gilroy-Bold',
    color: '#FFFFFF',
  },
});

export default React.memo(RedeemSuccessModal);

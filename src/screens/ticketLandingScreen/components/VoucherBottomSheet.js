import React, { useRef, useState, useEffect } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  View,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { wp, hp } from '../../../utils/responsive';
import CONFIG from '../../../globals/config';

const { height, width } = Dimensions.get('window');

const htmlBaseStyle = {
  color: 'rgba(255,255,255,0.6)',
  fontSize: 13,
  fontFamily: 'Gilroy-Regular',
  lineHeight: 20,
};

const SNAP_FULL = Platform.OS === 'ios' ? height * 0.05 : 0;

const REDEEM_BOTTOM_OFFSET = 0;

const BMS_URL = 'https://in.bookmyshow.com';

const openInChrome = async () => {
  const chromeAndroid = `intent://${BMS_URL.replace(
    'https://',
    '',
  )}#Intent;scheme=https;package=com.android.chrome;end`;
  const chromeIOS = `googlechrome://navigate?url=${encodeURIComponent(
    BMS_URL,
  )}`;
  const chromeUrl = Platform.OS === 'ios' ? chromeIOS : chromeAndroid;
  let canChrome = false;
  try {
    canChrome = await Linking.canOpenURL(chromeUrl);
  } catch (e) {
    // iOS rejects canOpenURL when the scheme isn't in LSApplicationQueriesSchemes
    canChrome = false;
  }
  Linking.openURL(canChrome ? chromeUrl : BMS_URL).catch(() => {});
};

const Accordion = ({ title, items, html }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.accordion}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setOpen(v => !v)}
        activeOpacity={0.7}
      >
        <Text style={styles.accordionTitle}>{title}</Text>
        <MaterialIcons
          name={open ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color="#FFFFFF"
        />
      </TouchableOpacity>
      <View style={styles.divider} />
      {open && (
        <View style={styles.accordionBody}>
          {html ? (
            <RenderHtml
              contentWidth={width * 0.9}
              source={{ html }}
              baseStyle={htmlBaseStyle}
            />
          ) : (
            items.map((item, i) => (
              <View key={i} style={styles.accordionRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.accordionText}>{item}</Text>
              </View>
            ))
          )}
        </View>
      )}
    </View>
  );
};

const toImageSource = value =>
  typeof value === 'string' ? { uri: CONFIG.image_base_url + value } : value;

const VoucherBottomSheet = ({ visible, onClose, voucher }) => {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const translateY = useRef(new Animated.Value(height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      translateY.setValue(height);
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: SNAP_FULL,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setModalVisible(false);
      });
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, { dy }) => Math.abs(dy) > 4,
      onPanResponderMove: (_, { dy }) => {
        if (dy > 0) translateY.setValue(SNAP_FULL + dy);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (vy > 0.5 || dy > height * 0.25) {
          onCloseRef.current();
        } else {
          Animated.spring(translateY, {
            toValue: SNAP_FULL,
            tension: 70,
            friction: 12,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const handleCopy = () => {
    Clipboard.setString(voucher?.voucherCode ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!voucher) return null;

  const daysLeft = voucher.codeExpiryDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(voucher.codeExpiryDate) - new Date()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  const formatDate = iso =>
    new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const voucherDetails = [
    `Denomination: ₹${voucher.denomination}`,
    `Status: ${voucher.codeStatus}`,
    `Purchased on: ${formatDate(voucher.purchasedAt)}`,
    `Valid till: ${formatDate(voucher.codeExpiryDate)}`,
  ];

  const safeBottom = insets.bottom > 0 ? insets.bottom : 20;

  return (
    <>
      <Modal
        transparent
        visible={modalVisible}
        animationType="none"
        onRequestClose={onClose}
      >
        <Animated.View
          style={[styles.backdropOverlay, { opacity: backdropOpacity }]}
          pointerEvents="none"
        />

        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <View style={styles.handleArea} {...panResponder.panHandlers}>
            <View style={styles.handle} />
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: REDEEM_BOTTOM_OFFSET + safeBottom + hp(8) },
            ]}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.brandRow}>
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.7}
                style={styles.backBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Image
                source={toImageSource(voucher.imageUrl)}
                style={styles.brandLogo}
                resizeMode="contain"
              />
              <Text style={styles.brandName}>{voucher.title}</Text>
            </View>

            <Image
              source={toImageSource(voucher.imageUrl)}
              style={styles.cardImage}
              resizeMode="cover"
            />

            <View style={styles.badge}>
              <Text style={styles.badgeText}>{daysLeft} days left</Text>
            </View>

            <Text style={styles.discountTitle}>₹{voucher.denomination}</Text>
            <Text style={styles.discountSubtitle}>
              {voucher.title} Gift Voucher
            </Text>

            <View style={styles.codeRow}>
              <Text style={styles.codeText} numberOfLines={1}>
                {voucher.voucherCode}
              </Text>
              <TouchableOpacity onPress={handleCopy} activeOpacity={0.7}>
                <MaterialIcons
                  name={copied ? 'check' : 'content-copy'}
                  size={20}
                  color={copied ? '#5B2BE0' : '#888888'}
                />
              </TouchableOpacity>
            </View>

            <Accordion title="Details" items={voucherDetails} />
            {voucher.shortDescription && (
              <Accordion title="Description" html={voucher.shortDescription} />
            )}
            {voucher.howToUse && (
              <Accordion title="How to Redeem" html={voucher.howToUse} />
            )}
            {voucher.termsConditions && (
              <Accordion
                title="Terms & Conditions"
                html={voucher.termsConditions}
              />
            )}
            <View style={styles.redeemWrapper}>
              <TouchableOpacity
                style={styles.redeemBtn}
                activeOpacity={0.85}
                onPress={() => {
                  openInChrome();
                }}
              >
                <MaterialIcons name="open-in-new" size={20} color="#FFFFFF" />
                <Text style={styles.redeemText}>Redeem Now</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>

        {/* <RedeemSuccessModal
        visible={successVisible}
        quantity={1}
        coinsUsed={0}
        amountPaid={voucher?.discountTitle ?? ''}
        onBack={() => setSuccessVisible(false)}
        onMyVouchers={() => {
          setSuccessVisible(false);
          onClose();
        }}
      /> */}
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height,
    backgroundColor: '#0D0D1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },

  handleArea: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp(5),
    paddingTop: hp(1),
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: hp(2),
  },
  backBtn: {
    padding: 2,
  },
  brandLogo: {
    width: 36,
    height: 36,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  brandName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: 'Gilroy-Bold',
  },

  cardImage: {
    width: '100%',
    height: hp(22),

    resizeMode: 'contain',
    borderRadius: 14,
    marginBottom: hp(1.5),
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: hp(1),
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Gilroy-Medium',
  },

  discountTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontFamily: 'Gilroy-Bold',
    marginBottom: 4,
  },
  discountSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontFamily: 'Gilroy-Regular',
    marginBottom: hp(2),
  },

  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A2E',
    borderRadius: 10,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    marginBottom: hp(2.5),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  codeText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontFamily: 'Gilroy-Medium',
    letterSpacing: 0.5,
    flex: 1,
    marginRight: 8,
  },

  accordion: {
    marginBottom: hp(1),
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(1.2),
  },
  accordionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Gilroy-Medium',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  accordionBody: {
    paddingTop: hp(1),
    paddingBottom: hp(0.5),
    gap: 6,
  },
  accordionRow: {
    flexDirection: 'row',
    gap: 6,
  },
  bullet: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    lineHeight: 20,
  },
  accordionText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontFamily: 'Gilroy-Regular',
    lineHeight: 20,
    flex: 1,
  },
  redeemWrapper: {
    paddingTop: 20,
  },
  redeemBtn: {
    backgroundColor: '#5B2BE0',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.7),
    gap: 8,
    marginTop: 20,
  },
  redeemText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Gilroy-Bold',
  },
});

export default VoucherBottomSheet;

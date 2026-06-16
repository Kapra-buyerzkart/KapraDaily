import React, { useEffect, useRef, useState } from 'react';
import { getVoucherQuoteApi } from '../../../api/voucherService';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { wp, hp } from '../../../utils/responsive';
import RedeemSuccessModal, {
  preloadRedeemSuccessAssets,
} from './RedeemSuccessModal';
import RenderHtml from 'react-native-render-html';
import CONFIG from '../../../globals/config';

const { width, height } = Dimensions.get('window');

const UdenTicketModal = ({ visible, onClose, voucher, bCoins = 0 }) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [quantity, setQuantity] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = key =>
    setOpenAccordion(prev => (prev === key ? null : key));

  const denomination = voucher?.denomination ?? 0;
  const maxQty = voucher?.availableCount;
  const PLACEHOLDER_IMAGE = require('../../../assets/images/movieTicket/voucher.png');
  const giftCardUri = voucher?.imageUrl
    ? { uri: CONFIG.image_base_url + voucher.imageUrl }
    : PLACEHOLDER_IMAGE;

  console.log(denomination, '====');
  useEffect(() => {
    preloadRedeemSuccessAssets();
  }, []);

  useEffect(() => {
    setQuantity(1);
  }, [voucher?.voucherId]);

  console.log(voucher, 'voucher ======>');

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setModalVisible(false);
      });
    }
  }, [visible]);

  const decreaseQty = () => setQuantity(q => Math.max(1, q - 1));
  const increaseQty = () => setQuantity(q => Math.min(maxQty, q + 1));

  const handleBuyNow = async () => {
    try {
      const quote = await getVoucherQuoteApi(voucher?.voucherId, quantity);
      console.log('voucher quote ====>', quote);
    } catch (err) {
      console.log('voucher quote error ====>', err);
    }
  };

  return (
    <>
      <Modal
        transparent
        visible={modalVisible}
        animationType="none"
        onRequestClose={onClose}
      >
        <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]} />

        <View style={styles.modalWrapper} pointerEvents="box-none">
          <Animated.View
            style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
          >
            <ImageBackground
              source={require('../../../assets/images/movieTicket/ticketbg.png')}
              style={styles.card}
              resizeMode="stretch"
            >
              {/* Title */}
              <Image
                source={require('../../../assets/images/movieTicket/udentcketPurple.png')}
                style={styles.titleImage}
                resizeMode="contain"
              />

              {/* Gift card image */}
              <Image
                source={giftCardUri}
                style={styles.giftCard}
                resizeMode="cover"
              />

              {/* Quantity selector */}
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={[
                    styles.qtyBtn,
                    quantity <= 1 && styles.qtyBtnDisabled,
                  ]}
                  onPress={decreaseQty}
                  activeOpacity={0.7}
                  disabled={quantity <= 1}
                >
                  <Text
                    style={[
                      styles.qtyBtnText,
                      quantity <= 1 && styles.qtyBtnTextDisabled,
                    ]}
                  >
                    −
                  </Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{quantity}</Text>
                <TouchableOpacity
                  style={[
                    styles.qtyBtn,
                    quantity >= maxQty && styles.qtyBtnDisabled,
                  ]}
                  onPress={increaseQty}
                  activeOpacity={0.7}
                  disabled={quantity >= maxQty}
                >
                  <Text
                    style={[
                      styles.qtyBtnText,
                      quantity >= maxQty && styles.qtyBtnTextDisabled,
                    ]}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </View>

              {/* UD-Coin banner */}
              <ImageBackground
                source={require('../../../assets/icons/wrap.png')}
                style={styles.coinBanner}
                resizeMode="stretch"
              >
                <Text style={styles.coinBannerText}>Use your</Text>
                <Image
                  source={require('../../../assets/icons/singleCoin.png')}
                  style={styles.coinInline}
                  resizeMode="contain"
                />
                <Text style={styles.coinBannerHighlight}>UD-Coin</Text>
                <Text style={styles.coinBannerText}>to claim your ticket</Text>
              </ImageBackground>

              {/* Accordion: Description & Terms */}
              {(voucher?.shortDescription || voucher?.termsConditions) && (
                <View style={styles.accordionContainer}>
                  {voucher?.shortDescription && (
                    <View style={styles.accordionItem}>
                      <TouchableOpacity
                        style={styles.accordionHeader}
                        onPress={() => toggleAccordion('description')}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.accordionTitle}>Description</Text>
                        <Text style={styles.accordionArrow}>
                          {openAccordion === 'description' ? '▲' : '▼'}
                        </Text>
                      </TouchableOpacity>
                      {openAccordion === 'description' && (
                        <ScrollView
                          style={styles.accordionContent}
                          nestedScrollEnabled
                        >
                          <RenderHtml
                            contentWidth={width * 0.78}
                            source={{ html: voucher.shortDescription }}
                          />
                        </ScrollView>
                      )}
                    </View>
                  )}
                  {voucher?.termsConditions && (
                    <View style={styles.accordionItem}>
                      <TouchableOpacity
                        style={styles.accordionHeader}
                        onPress={() => toggleAccordion('terms')}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.accordionTitle}>
                          Terms & Conditions
                        </Text>
                        <Text style={styles.accordionArrow}>
                          {openAccordion === 'terms' ? '▲' : '▼'}
                        </Text>
                      </TouchableOpacity>
                      {openAccordion === 'terms' && (
                        <ScrollView
                          style={styles.accordionContent}
                          nestedScrollEnabled
                        >
                          <RenderHtml
                            contentWidth={width * 0.78}
                            source={{ html: voucher.termsConditions }}
                          />
                        </ScrollView>
                      )}
                    </View>
                  )}
                </View>
              )}

              {/* Price row + BUY NOW */}
              <View style={styles.priceRow}>
                <View style={styles.priceLeft}>
                  <View style={styles.priceMainRow}>
                    <Text style={styles.priceCurrent}>₹{denomination}</Text>
                    <Text style={styles.priceStrike}>₹{denomination}</Text>
                  </View>
                  <View style={styles.usingRow}>
                    <Text style={styles.usingText}>Using </Text>
                    <Image
                      source={require('../../../assets/icons/coins.png')}
                      style={styles.coinsStack}
                      resizeMode="contain"
                    />
                    <Text style={styles.usingAmount}> {bCoins}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.buyNowBtn}
                  onPress={handleBuyNow}
                >
                  <Text style={styles.buyNowText}>BUY NOW</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>

            {/* Close button */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      <RedeemSuccessModal
        visible={successVisible}
        quantity={quantity}
        coinsUsed={quantity * 3}
        amountPaid="₹394"
        onBack={() => {
          setSuccessVisible(false);
          onClose();
        }}
        onMyVouchers={() => {
          setSuccessVisible(false);
          onClose();
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 120 : 120,
  },
  sheet: {
    width: width * 0.88,
    alignItems: 'center',
  },

  // Perforated edge
  perforated: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    zIndex: 1,
  },
  perforatedTop: {
    marginBottom: -8,
  },
  perforatedBottom: {
    marginTop: -8,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#1a1a2e',
  },

  // White card body
  card: {
    alignSelf: 'stretch',
    borderRadius: 4,
    overflow: 'hidden',
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(2.5),
  },

  // Title
  titleImage: {
    width: '60%',
    height: hp(7),
    alignSelf: 'center',
    marginBottom: hp(1.5),
  },

  // Gift card image
  giftCard: {
    width: '100%',
    height: hp(22),
    borderRadius: 12,
    marginBottom: hp(2),
  },

  // Quantity
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(1.8),
    gap: wp(6),
  },
  qtyBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    fontSize: 20,
    color: '#333333',
    fontFamily: 'Poppins-Medium',
    lineHeight: 24,
  },
  qtyBtnDisabled: {
    borderColor: '#CCCCCC',
    backgroundColor: '#F5F5F5',
  },
  qtyBtnTextDisabled: {
    color: '#BBBBBB',
  },
  qtyValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#111111',
    minWidth: 28,
    textAlign: 'center',
  },

  // UD-Coin banner
  coinBanner: {
    overflow: 'hidden',
    paddingVertical: hp(0.9),
    paddingHorizontal: wp(5),
    marginBottom: hp(1.8),
    marginHorizontal: -wp(5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  coinInline: {
    width: 20,
    height: 20,
  },
  coinBannerText: {
    color: '#000000',
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
  },
  coinBannerHighlight: {
    color: '#F9A833',
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
  },

  // Accordion
  accordionContainer: {
    marginBottom: hp(1.8),
    // borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 0.2,
    borderColor: '#E0E0E0',
  },
  accordionItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ffffffff',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.2),
    backgroundColor: '#ffffffff',
  },
  accordionTitle: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#333333',
  },
  accordionArrow: {
    fontSize: 10,
    color: '#000000ff',
  },
  accordionContent: {
    maxHeight: hp(18),
    paddingHorizontal: wp(3),
    paddingBottom: hp(1),
    backgroundColor: '#FFFFFF',
  },

  // Price row
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLeft: {
    flex: 1,
  },
  priceMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceCurrent: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#111111',
  },
  priceStrike: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  usingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  usingText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#555555',
  },
  coinsStack: {
    width: 22,
    height: 18,
  },
  usingAmount: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#333333',
  },

  // BUY NOW
  buyNowBtn: {
    backgroundColor: '#5B2BE0',
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.3),
    borderRadius: 10,
  },
  buyNowText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.5,
  },

  // Close button
  closeBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(30,30,30,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(1.9),
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
  },
});

export default UdenTicketModal;

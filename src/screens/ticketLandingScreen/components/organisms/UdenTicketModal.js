import React, { useEffect, useRef, useState } from 'react';
import { useVoucherPayment } from '../../../../hooks/useVoucherPayment';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  LayoutAnimation,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { wp, hp } from '../../../../utils/responsive';
import RedeemSuccessModal, {
  preloadRedeemSuccessAssets,
} from './RedeemSuccessModal';
import SafeRenderHtml from '../../../../components/SafeRenderHtml';
import CONFIG from '../../../../globals/config';
import { getVoucherQuoteApi } from '../../../../api/voucherService';
import COLORS from '@/styles/colors';
import BallPulse from '@/components/BallPulse';

const { width, height } = Dimensions.get('window');

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AnimatedButton = ({
  style,
  onPress,
  disabled,
  children,
  onPressIn,
  onPressOut,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = e => {
    Animated.spring(scale, {
      toValue: 0.93,
      useNativeDriver: true,
      speed: 40,
    }).start();
    onPressIn?.(e);
  };

  const handlePressOut = e => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
    onPressOut?.(e);
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={0.85}
        style={style}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

const UdenTicketModal = ({
  visible,
  onClose,
  voucher,
  bCoins = 0,
  initialQuoteData = null,
  onPurchaseSettled,
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const descArrowAnim = useRef(new Animated.Value(0)).current;
  const termsArrowAnim = useRef(new Animated.Value(0)).current;
  const reasonAnim = useRef(new Animated.Value(0)).current;
  const qtyPopAnim = useRef(new Animated.Value(1)).current;
  const priceAnim = useRef(new Animated.Value(0)).current;
  const giftCardAnim = useRef(new Animated.Value(0)).current;
  const coinPulseAnim = useRef(new Animated.Value(1)).current;
  const closeRotateAnim = useRef(new Animated.Value(0)).current;
  const [quantity, setQuantity] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [quoteData, setQuoteData] = useState(initialQuoteData);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const { handleBuyNow, successVisible, paidAmount, resetPayment } =
    useVoucherPayment(onPurchaseSettled);

  useEffect(() => {
    if (successVisible) onClose();
  }, [successVisible]);

  const arrowAnimFor = key =>
    key === 'description' ? descArrowAnim : termsArrowAnim;

  const toggleAccordion = key => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.timing(arrowAnimFor(key), {
      toValue: openAccordion === key ? 0 : 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
    setOpenAccordion(prev => (prev === key ? null : key));
  };

  const denomination = voucher?.denomination ?? 0;
  const maxQty = voucher?.availableCount;
  const isOutOfStock = !maxQty || maxQty <= 0;
  const coinEligible = quoteData?.coinEligible;
  const PLACEHOLDER_IMAGE = require('../../../../assets/images/movieTicket/voucher.png');
  const giftCardUri = voucher?.imageUrl
    ? { uri: CONFIG.image_base_url + voucher.imageUrl }
    : PLACEHOLDER_IMAGE;

  useEffect(() => {
    preloadRedeemSuccessAssets();
  }, []);

  useEffect(() => {
    setQuantity(1);
    setQuoteData(initialQuoteData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voucher?.voucherId]);

  // Only adopt a real seed quote. The parent clears it to null while the claim
  // request is in flight, and applying that null blanked the price row.
  useEffect(() => {
    if (initialQuoteData) setQuoteData(initialQuoteData);
  }, [initialQuoteData]);

  useEffect(() => {
    if (!visible || !voucher?.voucherId) return;
    let cancelled = false;
    const fetchQuote = async () => {
      setQuoteLoading(true);
      try {
        const res = await getVoucherQuoteApi(
          voucher.voucherId,
          quantity,
          bCoins,
        );
        if (!cancelled && res?.success) setQuoteData(res.data);
      } catch (_) {
      } finally {
        if (!cancelled) setQuoteLoading(false);
      }
    };
    fetchQuote();
    return () => {
      cancelled = true;
    };
  }, [quantity, voucher?.voucherId, bCoins, visible]);
  const ORANGE = '#FF6A00';

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
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 65,
          friction: 9,
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
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 220,
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

  const disabledReason = isOutOfStock
    ? 'This voucher is currently out of stock.'
    : coinEligible === false
    ? quoteData?.message ||
      "You don't have enough UD Coins to redeem this voucher."
    : null;

  useEffect(() => {
    Animated.timing(reasonAnim, {
      toValue: disabledReason ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [disabledReason]);

  useEffect(() => {
    qtyPopAnim.setValue(0.7);
    Animated.spring(qtyPopAnim, {
      toValue: 1,
      friction: 4,
      tension: 220,
      useNativeDriver: true,
    }).start();
  }, [quantity]);

  // Driven by the quote itself, not by the loading flag: keying it to both made
  // the price fade out and back in twice per refetch.
  useEffect(() => {
    priceAnim.setValue(0);
    Animated.timing(priceAnim, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [quoteData, priceAnim]);

  useEffect(() => {
    if (visible) {
      giftCardAnim.setValue(0);
      Animated.timing(giftCardAnim, {
        toValue: 1,
        duration: 420,
        delay: 120,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(coinPulseAnim, {
          toValue: 1.15,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(coinPulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const handleClosePressIn = () => {
    Animated.spring(closeRotateAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
    }).start();
  };

  const handleClosePressOut = () => {
    Animated.spring(closeRotateAnim, {
      toValue: 0,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();
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
            style={[
              styles.sheet,
              {
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            <ImageBackground
              source={require('../../../../assets/images/movieTicket/ticketbg.png')}
              style={styles.card}
              resizeMode="stretch"
            >
              {}
              <Image
                source={require('../../../../assets/images/movieTicket/udentcketPurple.png')}
                style={styles.titleImage}
                resizeMode="contain"
              />

              {}
              <Animated.View
                style={{
                  opacity: giftCardAnim,
                  transform: [
                    {
                      scale: giftCardAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.94, 1],
                      }),
                    },
                  ],
                }}
              >
                <ImageBackground
                  imageStyle={{ borderRadius: 20 }}
                  source={giftCardUri}
                  style={styles.giftCard}
                  resizeMode="contain"
                >
                  <View style={styles.giftCardTextContainer}>
                    <Text style={{ color: COLORS.white }}>Expires on</Text>
                    <Text style={styles.giftCardText}>
                      {voucher?.expireDate?.replace(/-/g, ' ')}
                    </Text>
                  </View>
                </ImageBackground>
              </Animated.View>

              {}
              <View style={styles.qtyRow}>
                <AnimatedButton
                  style={[
                    styles.qtyBtn,
                    quantity <= 1 && styles.qtyBtnDisabled,
                  ]}
                  onPress={decreaseQty}
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
                </AnimatedButton>
                <Animated.Text
                  style={[
                    styles.qtyValue,
                    { transform: [{ scale: qtyPopAnim }] },
                  ]}
                >
                  {quantity}
                </Animated.Text>
                <AnimatedButton
                  style={[
                    styles.qtyBtn,
                    quantity >= maxQty && styles.qtyBtnDisabled,
                  ]}
                  onPress={increaseQty}
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
                </AnimatedButton>
              </View>

              {}
              <ImageBackground
                source={require('../../../../assets/icons/wrap.png')}
                style={styles.coinBanner}
                resizeMode="stretch"
              >
                <Text style={styles.coinBannerText}>Use your</Text>

                <Animated.Image
                  source={require('../../../../assets/icons/udcoin.png')}
                  style={{
                    width: wp('6%'),
                    height: wp('6%'),
                    transform: [{ scale: coinPulseAnim }],
                  }}
                  resizeMode="contain"
                />

                <Text style={styles.coinBannerHighlight}>UD Coin</Text>
                <Text style={styles.coinBannerText}>to claim your ticket</Text>
              </ImageBackground>

              {}
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
                        <Animated.Text
                          style={[
                            styles.accordionArrow,
                            {
                              transform: [
                                {
                                  rotate: descArrowAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '180deg'],
                                  }),
                                },
                              ],
                            },
                          ]}
                        >
                          ▼
                        </Animated.Text>
                      </TouchableOpacity>
                      {openAccordion === 'description' && (
                        <Animated.View style={{ opacity: descArrowAnim }}>
                          <ScrollView
                            style={styles.accordionContent}
                            nestedScrollEnabled
                          >
                            <SafeRenderHtml
                              contentWidth={width * 0.78}
                              source={{ html: voucher.shortDescription }}
                            />
                          </ScrollView>
                        </Animated.View>
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
                        <Animated.Text
                          style={[
                            styles.accordionArrow,
                            {
                              transform: [
                                {
                                  rotate: termsArrowAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '180deg'],
                                  }),
                                },
                              ],
                            },
                          ]}
                        >
                          ▼
                        </Animated.Text>
                      </TouchableOpacity>
                      {openAccordion === 'terms' && (
                        <Animated.View style={{ opacity: termsArrowAnim }}>
                          <ScrollView
                            style={styles.accordionContent}
                            nestedScrollEnabled
                          >
                            <SafeRenderHtml
                              contentWidth={width * 0.78}
                              source={{ html: voucher.termsConditions }}
                            />
                          </ScrollView>
                        </Animated.View>
                      )}
                    </View>
                  )}

                  {}
                </View>
              )}

              {disabledReason && (
                <Animated.View
                  style={[
                    styles.disabledReasonBanner,
                    {
                      opacity: reasonAnim,
                      transform: [
                        {
                          translateY: reasonAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-6, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Text style={styles.disabledReasonIcon}>⚠</Text>
                  <Text style={styles.disabledReasonText}>
                    {disabledReason}
                  </Text>
                </Animated.View>
              )}

              <View style={styles.priceRow}>
                <View style={styles.priceLeft}>
                  {quoteLoading && !quoteData ? (
                    <BallPulse size="small" color="#5B2BE0" />
                  ) : (
                    <Animated.View
                      style={{
                        opacity: priceAnim,
                        transform: [
                          {
                            translateY: priceAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [6, 0],
                            }),
                          },
                        ],
                      }}
                    >
                      <View style={styles.priceMainRow}>
                        <Text style={styles.priceCurrent}>
                          ₹{quoteData ? quoteData.amountPayable : denomination}
                        </Text>
                        {quoteData &&
                          quoteData.amountPayable < quoteData.totalValue && (
                            <Text style={styles.priceStrike}>
                              ₹{quoteData.totalValue}
                            </Text>
                          )}
                      </View>

                      {quoteData && quoteData.coinsApplied > 0 && (
                        <View style={styles.usingRow}>
                          <Text style={styles.usingText}>Using </Text>
                          <Image
                            source={require('../../../../assets/icons/udcoin.png')}
                            style={{ width: wp('6%'), height: wp('6%') }}
                            resizeMode="contain"
                          />
                          <Text style={styles.usingAmount}>
                            {quoteData?.coinsApplied}
                          </Text>
                        </View>
                      )}
                    </Animated.View>
                  )}
                </View>

                <AnimatedButton
                  style={[
                    styles.buyNowBtn,
                    (isOutOfStock || quoteLoading || coinEligible === false) &&
                      styles.buyNowBtnDisabled,
                  ]}
                  onPress={() =>
                    handleBuyNow({
                      voucherId: voucher?.voucherId,
                      quantity,
                      bCoins,
                      voucherName: voucher?.name,
                    })
                  }
                  disabled={
                    isOutOfStock || quoteLoading || coinEligible === false
                  }
                >
                  <Text style={styles.buyNowText}>
                    {isOutOfStock ? 'OUT OF STOCK' : 'BUY NOW'}
                  </Text>
                </AnimatedButton>
              </View>
            </ImageBackground>

            {}
            <AnimatedButton
              style={styles.closeBtn}
              onPress={onClose}
              onPressIn={handleClosePressIn}
              onPressOut={handleClosePressOut}
            >
              <Animated.Text
                style={[
                  styles.closeBtnText,
                  {
                    transform: [
                      {
                        rotate: closeRotateAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '90deg'],
                        }),
                      },
                    ],
                  },
                ]}
              >
                ✕
              </Animated.Text>
            </AnimatedButton>
          </Animated.View>
        </View>
      </Modal>

      {/* Held back until this sheet has finished dismissing: two native modals
          transitioning at once flashes black on Android. */}
      <RedeemSuccessModal
        visible={successVisible && !modalVisible}
        quantity={quantity}
        coinsUsed={0}
        amountPaid={`₹${paidAmount}`}
        onBack={() => {
          resetPayment();
          onClose();
        }}
        onSecondaryAction={() => {
          resetPayment();
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet: {
    width: width * 0.88,
    alignItems: 'center',
  },

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

  card: {
    alignSelf: 'stretch',
    borderRadius: 4,
    overflow: 'hidden',
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(2.5),
  },

  titleImage: {
    width: '60%',
    height: hp(7),
    alignSelf: 'center',
    marginBottom: hp(1.5),
  },

  giftCard: {
    width: '100%',
    height: hp(22),
    borderRadius: 12,
    marginBottom: hp(2),
  },

  giftCardTextContainer: {
    position: 'absolute',
    bottom: hp(1),
    right: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftCardText: {
    color: COLORS.white,
  },

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
    fontFamily: 'Gilroy-Medium',
    lineHeight: 24,
  },
  qtyBtnDisabled: {
    borderColor: '#CCCCCC',
    backgroundColor: '#F5F5F5',
  },
  tokenBadgeIcon: {
    width: wp('6%'),
    height: wp('6%'),
    borderRadius: wp('3%'),
    backgroundColor: '#FF6A00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnTextDisabled: {
    color: '#BBBBBB',
  },
  qtyValue: {
    fontSize: 20,
    fontFamily: 'Gilroy-Bold',
    color: '#111111',
    minWidth: 28,
    textAlign: 'center',
  },
  noCoins: {
    color: COLORS.error,
    fontSize: 12,
    fontFamily: 'Gilroy-Medium',
    fontStyle: 'italic',
  },

  noCoinsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(2),
  },

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
    fontFamily: 'Gilroy-Medium',
  },
  coinBannerHighlight: {
    color: '#FF6A00',
    fontSize: 13,
    fontFamily: 'Gilroy-Bold',
  },

  accordionContainer: {
    marginBottom: hp(1.8),
    overflow: 'hidden',
    borderWidth: 0.4,
    borderRadius: 15,
    borderColor: '#1A1A1A80',
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
    fontFamily: 'Gilroy-Bold',
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

  disabledReasonBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F9A833',
    paddingVertical: hp(0.9),
    paddingHorizontal: wp(3),
    marginBottom: hp(1.5),
    gap: 6,
  },
  disabledReasonIcon: {
    fontSize: 13,
    color: '#E07F2B',
  },
  disabledReasonText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Gilroy-Medium',
    color: '#8A5A1E',
  },

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
    fontFamily: 'Gilroy-Bold',
    color: '#111111',
  },
  priceStrike: {
    fontSize: 14,
    fontFamily: 'Gilroy-Medium',
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  usingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 2,
  },
  usingText: {
    fontSize: 13,
    fontFamily: 'Gilroy-Regular',
    color: '#555555',
  },
  coinsStack: {
    width: 22,
    height: 18,
  },
  usingAmount: {
    fontSize: 13,
    fontFamily: 'Gilroy-Medium',
    color: '#333333',
  },

  buyNowBtn: {
    backgroundColor: '#5B2BE0',
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.3),
    borderRadius: 10,
  },
  buyNowBtnDisabled: {
    backgroundColor: '#AAAAAA',
  },
  buyNowText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Gilroy-Bold',
    letterSpacing: 0.5,
  },

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
    fontFamily: 'Gilroy-Medium',
  },
});

export default UdenTicketModal;

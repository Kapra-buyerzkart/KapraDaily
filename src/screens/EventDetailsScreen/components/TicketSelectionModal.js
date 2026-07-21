import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import AnimatedPressable from '@/components/AnimatedPressable';
import COLORS from '@/styles/colors';
import icons from '@/assets/icons';
import { wp, hp } from '../../../utils/responsive';
import { getDashboardDataApi } from '../../../api/userService';
import { checkTicketAvailabilityApi } from '../../../api/eventService';
import logger from '../../../utils/logger';
import { formatPrice } from '../utils';

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PRESS_IN_SPRING = {
  stiffness: 500,
  damping: 26,
  mass: 0.6,
  overshootClamping: true,
};
const PRESS_OUT_SPRING = { stiffness: 220, damping: 14, mass: 0.6 };

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TicketRow = React.memo(
  ({
    category,
    quantity,
    expanded,
    checking,
    onToggleDetails,
    onAdd,
    onIncrease,
    onDecrease,
  }) => {
    const maxQty = category.maxTicketsPerOrder ?? 0;
    const soldOut = (category.availableInventory ?? 0) <= 0;

    return (
      <View style={styles.row}>
        <Text style={styles.categoryName} numberOfLines={1}>
          {category.categoryName}
        </Text>

        <View style={styles.divider} />

        <View style={styles.rowBottom}>
          <AnimatedPressable
            style={styles.moreDetailsBtn}
            onPress={() => onToggleDetails(category.ticketCategoryId)}
            hitSlop={8}
          >
            <Text style={styles.moreDetailsText}>More details</Text>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={14}
              color={COLORS.purple}
            />
          </AnimatedPressable>

          <Text style={styles.price}>{formatPrice(category.price)}</Text>

          {quantity > 0 ? (
            <View style={styles.stepper}>
              <AnimatedPressable
                style={[
                  styles.stepperBtn,
                  checking && styles.stepperBtnDisabled,
                ]}
                onPress={() => onDecrease(category.ticketCategoryId, quantity)}
                disabled={checking}
                hitSlop={8}
              >
                <Text style={styles.stepperBtnText}>−</Text>
              </AnimatedPressable>
              {checking ? (
                <ActivityIndicator
                  size="small"
                  color={COLORS.purple}
                  style={styles.stepperValue}
                />
              ) : (
                <Text style={styles.stepperValue}>{quantity}</Text>
              )}
              <AnimatedPressable
                style={[
                  styles.stepperBtn,
                  (quantity >= maxQty || checking) && styles.stepperBtnDisabled,
                ]}
                onPress={() =>
                  onIncrease(category.ticketCategoryId, maxQty, quantity)
                }
                disabled={quantity >= maxQty || checking}
                hitSlop={8}
              >
                <Text style={styles.stepperBtnText}>+</Text>
              </AnimatedPressable>
            </View>
          ) : (
            <AnimatedPressable
              style={[
                styles.addBtn,
                (soldOut || checking) && styles.addBtnDisabled,
              ]}
              onPress={() => onAdd(category.ticketCategoryId)}
              disabled={soldOut || checking}
            >
              {checking ? (
                <ActivityIndicator size="small" color={COLORS.purple} />
              ) : (
                <Text
                  style={[
                    styles.addBtnText,
                    soldOut && styles.addBtnTextDisabled,
                  ]}
                >
                  {soldOut ? 'Sold out' : 'Add'}
                </Text>
              )}
            </AnimatedPressable>
          )}
        </View>

        {expanded && !!category.description && (
          <Text style={styles.descriptionText}>{category.description}</Text>
        )}
      </View>
    );
  },
);

const TicketSelectionModal = ({
  visible,
  onClose,
  ticketCategories = [],
  onBuyNow,
  submitting = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [bCoins, setBCoins] = useState(0);
  const [checkingIds, setCheckingIds] = useState({});

  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);
  const closeScale = useSharedValue(1);
  const closeRotation = useSharedValue(0);

  const categories = useMemo(
    () =>
      [...ticketCategories].sort(
        (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
      ),
    [ticketCategories],
  );

  useEffect(() => {
    if (!visible) return;
    getDashboardDataApi()
      .then(res => {
        if (res?.data?.wallet?.bCoins !== undefined) {
          setBCoins(res.data.wallet.bCoins);
        }
      })
      .catch(err => logger.error('Failed to fetch bCoins:', err?.message));
  }, [visible]);

  const handleAnimatedClose = useCallback(() => {
    setModalVisible(false);
    setQuantities({});
    setExpandedId(null);
    setCheckingIds({});
  }, []);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      scale.value = withTiming(1, { duration: 200 });
      opacity.value = withTiming(1, { duration: 200 });
      backdropOpacity.value = withTiming(1, { duration: 200 });
    } else if (modalVisible) {
      scale.value = withTiming(0.95, { duration: 160 });
      opacity.value = withTiming(0, { duration: 160 });
      backdropOpacity.value = withTiming(0, { duration: 160 }, finished => {
        if (finished) runOnJS(handleAnimatedClose)();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const sheetStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const handleClosePressIn = () => {
    closeScale.value = withSpring(0.93, PRESS_IN_SPRING);
    closeRotation.value = withSpring(1, PRESS_IN_SPRING);
  };

  const handleClosePressOut = () => {
    closeScale.value = withSpring(1, PRESS_OUT_SPRING);
    closeRotation.value = withSpring(0, PRESS_OUT_SPRING);
  };

  const closeBtnScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: closeScale.value }],
  }));

  const closeIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${closeRotation.value * 90}deg` }],
  }));

  const toggleDetails = useCallback(id => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(prev => (prev === id ? null : id));
  }, []);

  // Every stepper action re-checks live availability for the target quantity
  // before the count actually changes, so a sold-out-in-the-meantime category
  // can never be over-selected.
  const checkAvailability = useCallback(async (id, quantity) => {
    try {
      const res = await checkTicketAvailabilityApi(id, quantity);
      const data = res?.data ?? res;
      return data?.available ?? data?.isAvailable ?? true;
    } catch (err) {
      logger.error('Failed to check ticket availability:', err?.message);
      return false;
    }
  }, []);

  const applyIfAvailable = useCallback(
    async (id, nextQty, notifyIfUnavailable = false) => {
      setCheckingIds(prev => ({ ...prev, [id]: true }));
      const available = await checkAvailability(id, nextQty);
      setCheckingIds(prev => ({ ...prev, [id]: false }));
      if (available) {
        setQuantities(prev => ({ ...prev, [id]: nextQty }));
      } else if (notifyIfUnavailable) {
        Toast.show('Requested quantity is not available.', Toast.LONG);
      }
    },
    [checkAvailability],
  );

  const handleAdd = useCallback(
    id => {
      applyIfAvailable(id, 1, true);
    },
    [applyIfAvailable],
  );

  const handleIncrease = useCallback(
    (id, maxQty, currentQty) => {
      const nextQty = Math.min(currentQty + 1, maxQty);
      if (nextQty === currentQty) return;
      applyIfAvailable(id, nextQty, true);
    },
    [applyIfAvailable],
  );

  const handleDecrease = useCallback(
    (id, currentQty) => {
      const nextQty = Math.max(currentQty - 1, 0);
      if (nextQty === currentQty) return;
      applyIfAvailable(id, nextQty);
    },
    [applyIfAvailable],
  );

  const selectedLines = useMemo(
    () =>
      categories
        .map(cat => ({ cat, qty: quantities[cat.ticketCategoryId] || 0 }))
        .filter(line => line.qty > 0),
    [categories, quantities],
  );

  const { totalTickets, totalPrice } = useMemo(() => {
    const tickets = selectedLines.reduce((sum, { qty }) => sum + qty, 0);
    const price = selectedLines.reduce(
      (sum, { cat, qty }) => sum + cat.price * qty,
      0,
    );
    return { totalTickets: tickets, totalPrice: price };
  }, [selectedLines]);

  const handleBuyNow = useCallback(() => {
    const payload = { lines: selectedLines, totalPrice, totalTickets };
    logger.log('[TicketSelectionModal] onBuyNow payload:', payload);
    onBuyNow?.(payload);
  }, [onBuyNow, selectedLines, totalPrice, totalTickets]);

  return (
    <Modal
      transparent
      visible={modalVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.backdrop, backdropStyle]} />

      <View style={styles.modalWrapper} pointerEvents="box-none">
        <Animated.View style={[styles.sheet, sheetStyle]}>
          <ImageBackground
            source={require('../../../assets/images/movieTicket/ticketbg.png')}
            style={styles.card}
            resizeMode="stretch"
          >
            <Image
              source={require('../../../assets/images/movieTicket/udentcketPurple.png')}
              style={styles.titleImage}
              resizeMode="contain"
            />
            <Text style={styles.heading}>Select your ticket</Text>

            <ScrollView
              style={styles.list}
              showsVerticalScrollIndicator={true}
              bounces={false}
            >
              {categories.map(cat => (
                <TicketRow
                  key={cat.ticketCategoryId}
                  category={cat}
                  quantity={quantities[cat.ticketCategoryId] || 0}
                  expanded={expandedId === cat.ticketCategoryId}
                  checking={!!checkingIds[cat.ticketCategoryId]}
                  onToggleDetails={toggleDetails}
                  onAdd={handleAdd}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                />
              ))}
            </ScrollView>

            <View style={styles.footer}>
              <View style={styles.footerLeft}>
                {totalTickets > 0 ? (
                  <>
                    <Text style={styles.footerPrice}>
                      {formatPrice(totalPrice)}
                    </Text>
                    <View style={styles.footerCoinRow}>
                      <Text style={styles.footerCoinLabel}>Using </Text>
                      <Image
                        source={icons.udcoin}
                        style={styles.footerCoinIcon}
                      />
                      <Text style={styles.footerCoinValue}>{bCoins}</Text>
                    </View>
                  </>
                ) : (
                  <Text style={styles.footerEmptyText}>Select a ticket</Text>
                )}
              </View>

              <AnimatedPressable
                style={[
                  styles.buyNowBtn,
                  (totalTickets === 0 || submitting) &&
                    styles.buyNowBtnDisabled,
                ]}
                onPress={handleBuyNow}
                disabled={totalTickets === 0 || submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={styles.buyNowText}>BUY NOW</Text>
                )}
              </AnimatedPressable>
            </View>
          </ImageBackground>

          {/* Close button floats below the card, same treatment as UdenTicketModal:
              the button scales down on press while the icon rotates inside it. */}
          <Animated.View style={closeBtnScaleStyle}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              onPressIn={handleClosePressIn}
              onPressOut={handleClosePressOut}
              activeOpacity={0.85}
            >
              <Animated.View style={closeIconStyle}>
                <Ionicons name="close" size={22} color={COLORS.white} />
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
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
    maxHeight: SCREEN_HEIGHT * 0.8,
    alignItems: 'center',
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
    marginBottom: hp(0.5),
  },
  heading: {
    color: COLORS.gray900,
    fontSize: 17,
    fontFamily: 'Gilroy-Bold',
    textAlign: 'center',
    marginBottom: hp(1.6),
  },
  list: {
    maxHeight: hp(38),
  },

  row: {
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 14,
    marginBottom: 14,
  },
  categoryName: {
    color: COLORS.gray900,
    fontSize: 15,
    fontFamily: 'Gilroy-Bold',
    textTransform: 'capitalize',
  },
  divider: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderBottomColor: COLORS.gray300,
    marginTop: 12,
  },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  moreDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  moreDetailsText: {
    color: COLORS.purple,
    fontSize: 13,
    fontFamily: 'Gilroy-SemiBold',
  },
  price: {
    color: COLORS.gray900,
    fontSize: 15,
    fontFamily: 'Gilroy-Bold',
  },
  descriptionText: {
    color: COLORS.gray700,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Gilroy-Medium',
    paddingBottom: 14,
  },

  addBtn: {
    borderWidth: 1,
    borderColor: COLORS.purple,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  addBtnDisabled: {
    borderColor: COLORS.gray400,
  },
  addBtnText: {
    color: COLORS.purple,
    fontSize: 14,
    fontFamily: 'Gilroy-Bold',
  },
  addBtnTextDisabled: {
    color: COLORS.gray500,
  },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: {
    borderColor: COLORS.gray400,
  },
  stepperBtnText: {
    color: COLORS.purple,
    fontSize: 16,
    fontFamily: 'Gilroy-Bold',
    lineHeight: 18,
  },
  stepperValue: {
    color: COLORS.gray900,
    fontSize: 15,
    fontFamily: 'Gilroy-Bold',
    minWidth: 16,
    textAlign: 'center',
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.gray300,
    paddingTop: 16,
    marginTop: 4,
  },
  footerLeft: {
    flex: 1,
  },
  footerPrice: {
    color: COLORS.gray900,
    fontSize: 20,
    fontFamily: 'Gilroy-Bold',
  },
  footerEmptyText: {
    color: COLORS.gray600,
    fontSize: 14,
    fontFamily: 'Gilroy-Medium',
  },
  footerCoinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  footerCoinLabel: {
    color: COLORS.gray600,
    fontSize: 12,
    fontFamily: 'Gilroy-Medium',
  },
  footerCoinIcon: {
    width: 14,
    height: 14,
    marginRight: 3,
  },
  footerCoinValue: {
    color: COLORS.gray800,
    fontSize: 12,
    fontFamily: 'Gilroy-Bold',
  },

  buyNowBtn: {
    backgroundColor: COLORS.purple,
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  buyNowBtnDisabled: {
    backgroundColor: COLORS.gray400,
  },
  buyNowText: {
    color: COLORS.white,
    fontSize: 14,
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
});

export default React.memo(TicketSelectionModal);

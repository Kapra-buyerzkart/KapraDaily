import { useState, useEffect, useCallback, useContext, useRef, useMemo } from 'react';
import Toast from 'react-native-simple-toast';
import { useCart } from '../context/CartContext';
import {
  getAvailableCouponsApi,
  getAvailableGiftCardsApi,
} from '../api/cartService';
import { getDashboardDataApi } from '../api/userService';
import { LoaderContext } from '../context/loaderContext';
import { getCouponRecommendations } from '../utils/couponRecommendation';

const DEFAULT_OFFERS = [
  {
    id: '2',
    name: 'Coupon',
    content: 'View All Coupons',
    applyCliked: false,
    image: require('../assets/images/coupon-two.png'),
  },
  {
    id: '3',
    name: 'UD Coin',
    content: '1000.00',
    applyCliked: false,
    image: require('../assets/images/bcoin_two.png'),
  },
  {
    id: '4',
    name: 'Gift Card',
    content: 'View All Gift Cards',
    applyCliked: false,
    image: require('../assets/images/gift_two.png'),
  },
];

export const useOffers = (deliveryHook, addressHook) => {
  const {
    cartSummary,
    cartTotal,
    cartItems,
    applyCoupon,
    removeCoupon,
    applyGiftCard,
    removeGiftCard,
    applyBCoins,
    removeBCoins,
    getCartSummary,
  } = useCart();
  const { showLoader } = useContext(LoaderContext);

  const [offers, setOffers] = useState(DEFAULT_OFFERS);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [isGiftCard, setIsGiftCard] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [availableGiftCards, setAvailableGiftCards] = useState([]);
  const [appliedCouponCode, setAppliedCouponCode] = useState(null);
  const [appliedGiftCardCode, setAppliedGiftCardCode] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const isApplyingRef = useRef(false);

  const selectedAddress = addressHook?.addresses?.find(a => a.selected);
  const selectedPincodeAreaId = selectedAddress?.pincodeAreaId;
  const lastFetchedPincodeRef = useRef(null);

  const fetchRewards = useCallback(async () => {
    try {
      const addr = addressHook?.addresses?.find(a => a.selected);
      const pincodeAreaId = addr?.pincodeAreaId;
      const [couponsRes, giftCardsRes] = await Promise.all([
        getAvailableCouponsApi(pincodeAreaId),
        getAvailableGiftCardsApi(pincodeAreaId),
      ]);

      if (couponsRes?.data) {
        const coupons =
          couponsRes.data.items ||
          (Array.isArray(couponsRes.data) ? couponsRes.data : []);
        setAvailableCoupons(coupons);
      }
      if (giftCardsRes?.data) {
        const giftCards =
          giftCardsRes.data.items ||
          (Array.isArray(giftCardsRes.data) ? giftCardsRes.data : []);
        setAvailableGiftCards(giftCards);
      }
    } catch (error) {
      console.error('Error fetching available rewards:', error);
    }
  }, [addressHook?.addresses]);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  // Re-fetch rewards when delivery location/pincodeAreaId changes
  useEffect(() => {
    if (
      selectedPincodeAreaId &&
      selectedPincodeAreaId !== lastFetchedPincodeRef.current
    ) {
      lastFetchedPincodeRef.current = selectedPincodeAreaId;
      fetchRewards();
    }
  }, [selectedPincodeAreaId, fetchRewards]);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await getDashboardDataApi();
        if (response?.success && response?.data?.wallet) {
          const bCoins = response.data.wallet.bCoins || 0;
          setOffers(prev =>
            prev.map(offer =>
              offer.id === '3'
                ? {
                    ...offer,
                    content: `Available UD Coin: ${parseFloat(bCoins).toFixed(
                      2,
                    )}`,
                    applyCliked: cartSummary?.bcoinsAppliedValue > 0,
                  }
                : offer,
            ),
          );
        }
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      }
    };
    fetchWalletData();
  }, [cartSummary?.bcoinsAppliedValue]);

  useEffect(() => {
    if (cartSummary) {
      setOffers(prev =>
        prev.map(item =>
          item.id === '3'
            ? { ...item, applyCliked: cartSummary.bcoinsAppliedValue > 0 }
            : item,
        ),
      );
    }
  }, [cartSummary, cartSummary?.bcoinsAppliedValue]);

  const couponCodeFromSummary =
    cartSummary?.couponCode || cartSummary?.appliedCouponCode || null;
  const giftCardCodeFromSummary =
    cartSummary?.giftCode || cartSummary?.giftCardCode || null;

  // Auto-sync coupon state with backend cartSummary (e.g. if cart items changed and coupon was invalidated)
  useEffect(() => {
    if (cartSummary) {
      const summaryCode =
        cartSummary.couponCode || cartSummary.appliedCouponCode || null;
      const summaryAmount = Number(cartSummary.couponAmount || 0);

      if (summaryAmount === 0 && !summaryCode && appliedCouponCode) {
        // Backend dropped the coupon due to cart changes
        setAppliedCouponCode(null);
      } else if (summaryCode && summaryCode !== appliedCouponCode) {
        setAppliedCouponCode(summaryCode);
      }
    }
  }, [cartSummary, appliedCouponCode]);

  const isCouponApplied =
    !!appliedCouponCode ||
    !!couponCodeFromSummary ||
    (cartSummary?.couponAmount ?? 0) > 0;

  const isGiftCardApplied =
    !!appliedGiftCardCode ||
    !!giftCardCodeFromSummary ||
    (cartSummary?.giftCardAmount ?? 0) > 0;

  // Compute live cart value for recommendation calculations
  const cartValue = useMemo(() => {
    if (cartSummary?.subTotal != null) return Number(cartSummary.subTotal);
    if (cartTotal != null) return Number(cartTotal);
    return (cartItems || []).reduce((sum, item) => {
      const price = item.specialPrice || item.unitPrice || item.price || 0;
      return sum + price * (item.quantity || 1);
    }, 0);
  }, [cartSummary?.subTotal, cartTotal, cartItems]);

  const activeCouponCode = appliedCouponCode || couponCodeFromSummary;
  const activeCouponDiscount = cartSummary?.couponAmount || 0;

  // Smart coupon recommendation engine evaluation
  const recommendations = useMemo(() => {
    return getCouponRecommendations({
      coupons: availableCoupons,
      cartValue,
      appliedCouponCode: activeCouponCode,
      appliedDiscountAmount: activeCouponDiscount,
    });
  }, [
    availableCoupons,
    cartValue,
    activeCouponCode,
    activeCouponDiscount,
  ]);

  const updateOfferState = useCallback((offerId, applied) => {
    setOffers(prev =>
      prev.map(item =>
        item.id === offerId ? { ...item, applyCliked: applied } : item,
      ),
    );
  }, []);

  const onApplyOffer = useCallback(
    async offerId => {
      if (offerId === '2') {
        setIsGiftCard(false);
        setCouponCode('');
        fetchRewards();
        setShowCouponModal(true);
        return;
      }

      if (offerId === '3') {
        const bCoinOffer = offers.find(o => o.id === '3');
        const contentValue = bCoinOffer?.content || '0';
        const availableBCoinsMatch = contentValue.match(/(\d+\.?\d*)/);
        const availableBCoins = availableBCoinsMatch
          ? parseFloat(availableBCoinsMatch[0])
          : 0;
        if (availableBCoins <= 0) {
          alert('No UD Coins available to apply');
          return;
        }
        try {
          showLoader(true);
          const result = await applyBCoins(availableBCoins);
          showLoader(false);
          if (result.success) {
            updateOfferState(offerId, true);
            const selectedAddr = addressHook?.addresses?.find(a => a.selected);
            getCartSummary(
              deliveryHook?.deliveryMode,
              deliveryHook?.selectedSlot,
              null,
              selectedAddr?.pincodeAreaId,
            );
          } else {
            Toast.show(
              result.message || 'Failed to apply UD Coins',
              Toast.LONG,
            );
          }
        } catch (error) {
          showLoader(false);
          Toast.show('An unexpected error occurred', Toast.LONG);
        }
        return;
      }

      if (offerId === '4') {
        setIsGiftCard(true);
        setCouponCode('');
        fetchRewards();
        setShowCouponModal(true);
        return;
      }

      updateOfferState(offerId, true);
    },
    [
      offers,
      applyBCoins,
      showLoader,
      updateOfferState,
      fetchRewards,
      addressHook?.addresses,
      deliveryHook?.deliveryMode,
      deliveryHook?.selectedSlot,
      getCartSummary,
    ],
  );

  const onRejectOffer = useCallback(
    async offerId => {
      if (offerId === '2') {
        try {
          showLoader(true);
          const res = await removeCoupon();
          showLoader(false);
          if (res.success) {
            updateOfferState(offerId, false);
            setAppliedCouponCode(null);
            const selectedAddr = addressHook?.addresses?.find(a => a.selected);
            getCartSummary(
              deliveryHook?.deliveryMode,
              deliveryHook?.selectedSlot,
              null,
              selectedAddr?.pincodeAreaId,
            );
          } else {
            Toast.show(res.message || 'Failed to remove coupon', Toast.LONG);
          }
        } catch (error) {
          showLoader(false);
          Toast.show('Failed to remove coupon', Toast.LONG);
        }
        return;
      }

      if (offerId === '4') {
        try {
          showLoader(true);
          const res = await removeGiftCard();
          showLoader(false);
          if (res.success) {
            updateOfferState(offerId, false);
            setAppliedGiftCardCode(null);
            const selectedAddr = addressHook?.addresses?.find(a => a.selected);
            getCartSummary(
              deliveryHook?.deliveryMode,
              deliveryHook?.selectedSlot,
              null,
              selectedAddr?.pincodeAreaId,
            );
          } else {
            Toast.show(res.message || 'Failed to remove gift card', Toast.LONG);
          }
        } catch (error) {
          showLoader(false);
          Toast.show('Failed to remove gift card', Toast.LONG);
        }
        return;
      }

      if (offerId === '3') {
        try {
          showLoader(true);
          const result = await removeBCoins();
          showLoader(false);
          if (result.success) {
            updateOfferState(offerId, false);
            const selectedAddr = addressHook?.addresses?.find(a => a.selected);
            getCartSummary(
              deliveryHook?.deliveryMode,
              deliveryHook?.selectedSlot,
              null,
              selectedAddr?.pincodeAreaId,
            );
          } else {
            Toast.show(
              result.message || 'Failed to remove UD Coins',
              Toast.LONG,
            );
          }
        } catch (error) {
          showLoader(false);
          Toast.show('Failed to remove UD Coins', Toast.LONG);
        }
        return;
      }

      updateOfferState(offerId, false);
    },
    [
      removeCoupon,
      removeGiftCard,
      removeBCoins,
      showLoader,
      updateOfferState,
      addressHook?.addresses,
      deliveryHook?.deliveryMode,
      deliveryHook?.selectedSlot,
      getCartSummary,
    ],
  );

  /**
   * One-Tap Apply Interaction:
   * Direct inline coupon application without opening separate screens or typing codes.
   */
  const handleOneTapApply = useCallback(
    async codeToApply => {
      const code = String(codeToApply || '').trim();
      if (!code) return { success: false, message: 'Invalid coupon code' };

      if (isApplyingRef.current) {
        return { success: false, message: 'Application in progress' };
      }
      isApplyingRef.current = true;
      setIsApplyingCoupon(true);

      try {
        const result = await applyCoupon(code);
        if (result && result.success) {
          updateOfferState('2', true);
          setAppliedCouponCode(code);
          const selectedAddr = addressHook?.addresses?.find(a => a.selected);
          const summaryRes = await getCartSummary(
            deliveryHook?.deliveryMode,
            deliveryHook?.selectedSlot,
            null,
            selectedAddr?.pincodeAreaId,
          );
          const saved =
            summaryRes?.data?.couponAmount ||
            cartSummary?.couponAmount ||
            result?.data?.couponAmount ||
            0;
          const msg =
            saved > 0
              ? `Coupon applied! You saved ₹${Math.round(saved)}.`
              : 'Coupon applied successfully!';
          Toast.show(msg, Toast.SHORT);
          return { success: true, savedAmount: saved };
        } else {
          const errMsg = result?.message || 'Failed to apply coupon';
          if (!errMsg.toLowerCase().includes('modified')) {
            Toast.show(errMsg, Toast.LONG);
          }
          return { success: false, message: errMsg };
        }
      } catch (err) {
        const errMsg = err?.message || 'Failed to apply coupon';
        Toast.show(errMsg, Toast.LONG);
        return { success: false, message: errMsg };
      } finally {
        isApplyingRef.current = false;
        setIsApplyingCoupon(false);
      }
    },
    [
      applyCoupon,
      updateOfferState,
      addressHook?.addresses,
      deliveryHook?.deliveryMode,
      deliveryHook?.selectedSlot,
      getCartSummary,
      cartSummary?.couponAmount,
    ],
  );

  /**
   * One-Tap Remove:
   * Removes currently applied coupon and restores totals.
   */
  const handleRemoveCoupon = useCallback(async () => {
    if (isApplyingRef.current) return { success: false };
    isApplyingRef.current = true;
    setIsApplyingCoupon(true);
    try {
      const res = await removeCoupon();
      if (res && res.success) {
        updateOfferState('2', false);
        setAppliedCouponCode(null);
        const selectedAddr = addressHook?.addresses?.find(a => a.selected);
        await getCartSummary(
          deliveryHook?.deliveryMode,
          deliveryHook?.selectedSlot,
          null,
          selectedAddr?.pincodeAreaId,
        );
        Toast.show('Coupon removed', Toast.SHORT);
        return { success: true };
      } else {
        Toast.show(res?.message || 'Failed to remove coupon', Toast.LONG);
        return { success: false, message: res?.message };
      }
    } catch (err) {
      Toast.show('Failed to remove coupon', Toast.SHORT);
      return { success: false, message: err?.message };
    } finally {
      isApplyingRef.current = false;
      setIsApplyingCoupon(false);
    }
  }, [
    removeCoupon,
    updateOfferState,
    addressHook?.addresses,
    deliveryHook?.deliveryMode,
    deliveryHook?.selectedSlot,
    getCartSummary,
  ]);

  /**
   * One-Tap Switch:
   * Smoothly replaces currently applied coupon with a better unlocked offer.
   */
  const handleSwitchCoupon = useCallback(
    async newCode => {
      const code = String(newCode || '').trim();
      if (!code) return { success: false };

      if (isApplyingRef.current) return { success: false };
      isApplyingRef.current = true;
      setIsApplyingCoupon(true);
      try {
        let res = await applyCoupon(code);
        if (!res || !res.success) {
          // If server requires explicitly removing the previous coupon first
          await removeCoupon();
          res = await applyCoupon(code);
        }

        if (res && res.success) {
          updateOfferState('2', true);
          setAppliedCouponCode(code);
          const selectedAddr = addressHook?.addresses?.find(a => a.selected);
          const summaryRes = await getCartSummary(
            deliveryHook?.deliveryMode,
            deliveryHook?.selectedSlot,
            null,
            selectedAddr?.pincodeAreaId,
          );
          const saved =
            summaryRes?.data?.couponAmount ||
            cartSummary?.couponAmount ||
            0;
          const msg =
            saved > 0
              ? `Coupon switched! You saved ₹${Math.round(saved)}.`
              : 'Coupon switched successfully!';
          Toast.show(msg, Toast.SHORT);
          return { success: true, savedAmount: saved };
        } else {
          Toast.show(res?.message || 'Failed to switch coupon', Toast.LONG);
          return { success: false, message: res?.message };
        }
      } catch (err) {
        Toast.show(err?.message || 'Failed to switch coupon', Toast.LONG);
        return { success: false, message: err?.message };
      } finally {
        isApplyingRef.current = false;
        setIsApplyingCoupon(false);
      }
    },
    [
      applyCoupon,
      removeCoupon,
      updateOfferState,
      addressHook?.addresses,
      deliveryHook?.deliveryMode,
      deliveryHook?.selectedSlot,
      getCartSummary,
      cartSummary?.couponAmount,
    ],
  );

  const handleApplyCoupon = useCallback(
    async codeOverride => {
      const codeToApply =
        typeof codeOverride === 'string' ? codeOverride : couponCode;
      if (!codeToApply?.trim()) return;

      if (isApplyingRef.current) {
        console.log('⏳ [OFFERS] Apply already in progress...');
        return;
      }
      isApplyingRef.current = true;
      showLoader(true);

      try {
        const result = isGiftCard
          ? await applyGiftCard(codeToApply)
          : await applyCoupon(codeToApply);

        if (result.success) {
          setShowCouponModal(false);
          updateOfferState(isGiftCard ? '4' : '2', true);
          if (isGiftCard) {
            setAppliedGiftCardCode(codeToApply);
          } else {
            setAppliedCouponCode(codeToApply);
          }
          const selectedAddr = addressHook?.addresses?.find(a => a.selected);
          getCartSummary(
            deliveryHook?.deliveryMode,
            deliveryHook?.selectedSlot,
            null,
            selectedAddr?.pincodeAreaId,
          );
        } else {
          const errorMsg =
            result.message ||
            (isGiftCard
              ? 'Failed to apply gift card'
              : 'Failed to apply coupon');
          console.log('❌ [OFFERS] Apply failed:', {
            code: codeToApply,
            isGiftCard,
            message: errorMsg,
            status: result?.status,
            result,
          });
          if (errorMsg.toLowerCase().includes('modified')) {
            console.log('🚫 [OFFERS] Suppressing modified Toast:', errorMsg);
          } else {
            Toast.show(errorMsg, Toast.LONG);
          }
        }
      } catch (error) {
        console.log('❌ [OFFERS] Apply threw:', {
          code: codeToApply,
          isGiftCard,
          message: error?.message || error?.Message || error,
          status: error?.response?.status,
          data: error?.response?.data || error?.data,
          error,
        });
        Toast.show(
          error?.message ||
            (isGiftCard
              ? 'Failed to apply gift card'
              : 'Failed to apply coupon'),
          Toast.LONG,
        );
      } finally {
        isApplyingRef.current = false;
        showLoader(false);
      }
    },
    [
      couponCode,
      isGiftCard,
      applyGiftCard,
      applyCoupon,
      updateOfferState,
      addressHook?.addresses,
      deliveryHook?.deliveryMode,
      deliveryHook?.selectedSlot,
      getCartSummary,
      showLoader,
    ],
  );

  const handleCouponClick = useCallback(
    code => {
      setCouponCode(code);
      handleApplyCoupon(code);
    },
    [handleApplyCoupon],
  );

  return {
    offers,
    showCouponModal,
    setShowCouponModal,
    couponCode,
    setCouponCode,
    isGiftCard,
    availableCoupons,
    availableGiftCards,
    onApplyOffer,
    onRejectOffer,
    handleApplyCoupon,
    handleCouponClick,
    appliedCouponCode: appliedCouponCode || couponCodeFromSummary,
    appliedGiftCardCode: appliedGiftCardCode || giftCardCodeFromSummary,
    isCouponApplied,
    isGiftCardApplied,

    // Smart coupon recommendation values and actions:
    bestCoupon: recommendations.bestCoupon,
    betterCoupon: recommendations.betterCoupon,
    extraSavings: recommendations.extraSavings,
    unlockableCoupon: recommendations.unlockableCoupon,
    eligibleCoupons: recommendations.eligibleCoupons,
    allValidCoupons: recommendations.allValidCoupons,
    totalCouponsCount: recommendations.totalCount,
    isApplyingCoupon,
    handleOneTapApply,
    handleRemoveCoupon,
    handleSwitchCoupon,
    fetchRewards,
    cartValue,
  };
};


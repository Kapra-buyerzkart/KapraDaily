import { useState, useEffect, useCallback, useContext, useRef } from 'react';
import Toast from 'react-native-simple-toast';
import { useCart } from '../context/CartContext';
import {
  getAvailableCouponsApi,
  getAvailableGiftCardsApi,
} from '../api/cartService';
import { getDashboardDataApi } from '../api/userService';
import { LoaderContext } from '../context/loaderContext';

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

const DEFAULT_GIFT_CARDS = [
  { id: '1', code: 'GIFT500', description: 'Gift Card worth ₹500' },
  { id: '2', code: 'BDAY1000', description: 'Birthday Gift Card worth ₹1000' },
];

export const useOffers = (deliveryHook, addressHook) => {
  const {
    cartSummary,
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
  const isApplyingRef = useRef(false);

  const fetchRewards = useCallback(async () => {
    try {
      const [couponsRes, giftCardsRes] = await Promise.all([
        getAvailableCouponsApi(),
        getAvailableGiftCardsApi(),
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
  }, []);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

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
  }, []);

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
  }, [cartSummary]);

  const couponCodeFromSummary =
    cartSummary?.couponCode || cartSummary?.appliedCouponCode || null;
  const giftCardCodeFromSummary =
    cartSummary?.giftCode || cartSummary?.giftCardCode || null;

  const isCouponApplied =
    !!appliedCouponCode ||
    !!couponCodeFromSummary ||
    (cartSummary?.couponAmount ?? 0) > 0;

  const isGiftCardApplied =
    !!appliedGiftCardCode ||
    !!giftCardCodeFromSummary ||
    (cartSummary?.giftCardAmount ?? 0) > 0;

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
    [offers, applyBCoins, showLoader, updateOfferState, fetchRewards],
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
    [removeCoupon, removeGiftCard, removeBCoins, showLoader, updateOfferState],
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
  };
};

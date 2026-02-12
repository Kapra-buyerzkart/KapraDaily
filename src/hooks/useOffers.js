import { useState, useEffect, useCallback, useContext } from 'react';
import { Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { getAvailableCouponsApi } from '../api/cartService';
import { getDashboardDataApi } from '../api/userService';
import { LoaderContext } from '../context/loaderContext';

const DEFAULT_OFFERS = [
    {
        id: '1',
        name: "Smart point",
        content: "get flat 50%",
        applyCliked: false,
        image: require('../assets/images/smart_point_two.png')
    },
    {
        id: '2',
        name: "Coupon",
        content: "get flat 50%",
        applyCliked: false,
        image: require('../assets/images/coupon-two.png')
    },
    {
        id: '3',
        name: "B-Coin",
        content: "1000.00",
        applyCliked: false,
        image: require('../assets/images/bcoin_two.png')
    },
    {
        id: '4',
        name: "Gift Card",
        content: "Add Gift Card",
        applyCliked: false,
        image: require('../assets/images/gift_two.png')
    },
];

const DEFAULT_GIFT_CARDS = [
    { id: '1', code: 'GIFT500', description: 'Gift Card worth ₹500' },
    { id: '2', code: 'BDAY1000', description: 'Birthday Gift Card worth ₹1000' },
];

export const useOffers = () => {
    const { cartSummary, applyCoupon, removeCoupon, applyGiftCard, removeGiftCard, applyBCoins, removeBCoins } = useCart();
    const { showLoader } = useContext(LoaderContext);

    const [offers, setOffers] = useState(DEFAULT_OFFERS);
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [isGiftCard, setIsGiftCard] = useState(false);
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [availableGiftCards] = useState(DEFAULT_GIFT_CARDS);

    // Fetch available coupons on mount
    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                showLoader(true);
                const response = await getAvailableCouponsApi();
                if (response?.data) {
                    setAvailableCoupons(response.data);
                }
            } catch (error) {
                console.error('Error fetching available coupons:', error);
            } finally {
                showLoader(false);
            }
        };
        fetchCoupons();
    }, []);

    // Fetch wallet data and update B-Coin offer content
    useEffect(() => {
        const fetchWalletData = async () => {
            try {
                const response = await getDashboardDataApi();
                if (response?.success && response?.data?.wallet) {
                    const bCoins = response.data.wallet.bCoins || 0;
                    setOffers(prev => prev.map(offer =>
                        offer.id === '3'
                            ? {
                                ...offer,
                                content: `${parseFloat(bCoins).toFixed(2)}`,
                                applyCliked: cartSummary?.bcoinsAppliedValue > 0
                            }
                            : offer
                    ));
                }
            } catch (error) {
                console.error('Error fetching wallet data:', error);
            }
        };
        fetchWalletData();
    }, []);

    // Sync B-Coin applied state with cart summary
    useEffect(() => {
        if (cartSummary) {
            setOffers(prev => prev.map(item =>
                item.id === '3'
                    ? { ...item, applyCliked: cartSummary.bcoinsAppliedValue > 0 }
                    : item
            ));
        }
    }, [cartSummary]);

    const updateOfferState = useCallback((offerId, applied) => {
        setOffers(prev => prev.map(item =>
            item.id === offerId ? { ...item, applyCliked: applied } : item
        ));
    }, []);

    const onApplyOffer = useCallback(async (offerId) => {
        if (offerId === '2') {
            setIsGiftCard(false);
            setCouponCode('');
            setShowCouponModal(true);
            return;
        }

        if (offerId === '3') {
            const bCoinOffer = offers.find(o => o.id === '3');
            const availableBCoins = parseFloat(bCoinOffer?.content || '0');
            if (availableBCoins <= 0) {
                alert("No B-Coins available to apply");
                return;
            }
            try {
                showLoader(true);
                const result = await applyBCoins(availableBCoins);
                showLoader(false);
                if (result.success) {
                    updateOfferState(offerId, true);
                } else {
                    Alert.alert("Error", result.message || "Failed to apply B-Coins");
                }
            } catch (error) {
                showLoader(false);
                Alert.alert("Error", "An unexpected error occurred");
            }
            return;
        }

        if (offerId === '4') {
            setIsGiftCard(true);
            setCouponCode('');
            setShowCouponModal(true);
            return;
        }

        updateOfferState(offerId, true);
    }, [offers, applyBCoins, showLoader, updateOfferState]);

    const onRejectOffer = useCallback(async (offerId) => {
        if (offerId === '2') {
            const res = await removeCoupon();
            if (res.success) updateOfferState(offerId, false);
            return;
        }

        if (offerId === '4') {
            const res = await removeGiftCard();
            if (res.success) updateOfferState(offerId, false);
            return;
        }

        if (offerId === '3') {
            try {
                showLoader(true);
                const result = await removeBCoins();
                showLoader(false);
                if (result.success) {
                    updateOfferState(offerId, false);
                } else {
                    Alert.alert("Error", result.message || "Failed to remove B-Coins");
                }
            } catch (error) {
                showLoader(false);
                Alert.alert("Error", "Failed to remove B-Coins");
            }
            return;
        }

        updateOfferState(offerId, false);
    }, [removeCoupon, removeGiftCard, removeBCoins, showLoader, updateOfferState]);

    const handleApplyCoupon = useCallback(async (codeOverride) => {
        const codeToApply = typeof codeOverride === 'string' ? codeOverride : couponCode;
        if (!codeToApply?.trim()) return;

        const result = isGiftCard
            ? await applyGiftCard(codeToApply)
            : await applyCoupon(codeToApply);

        if (result.success) {
            setShowCouponModal(false);
            updateOfferState(isGiftCard ? '4' : '2', true);
        } else {
            alert(result.message || "Failed to apply");
        }
    }, [couponCode, isGiftCard, applyGiftCard, applyCoupon, updateOfferState]);

    const handleCouponClick = useCallback((code) => {
        setCouponCode(code);
        handleApplyCoupon(code);
    }, [handleApplyCoupon]);

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
    };
};

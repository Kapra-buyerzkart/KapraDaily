import { useState, useCallback, useEffect } from 'react';
import {
    applyBCoinApi, removeBCoinApi,
    applyCouponApi, removeCouponApi,
    applyGiftCardApi, removeGiftCardApi,
    getAvailableCouponsApi, getAvailableGiftCardsApi
} from '../api/services/cartService';
import Toast from 'react-native-simple-toast';


export const useOffers = (deliveryHook: any, addressHook: any, cartSummary: any, getCartSummary: any, profile: any, refreshCart: any, showLoader?: (show: boolean) => void) => {
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [isGiftCard, setIsGiftCard] = useState(false);
    const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
    const [availableGiftCards, setAvailableGiftCards] = useState<any[]>([]);
    const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
    const [appliedGiftCardCode, setAppliedGiftCardCode] = useState<string | null>(null);

    const selectedAddress = addressHook.addresses.find((a: any) => a.selected);

    const fetchOfferData = useCallback(async () => {
        try {
            const [couponsRes, giftCardsRes] = await Promise.all([
                getAvailableCouponsApi(selectedAddress?.pincodeAreaId),
                getAvailableGiftCardsApi(selectedAddress?.pincodeAreaId)
            ]);
            if (couponsRes?.success) setAvailableCoupons(couponsRes.data?.items || []);
            if (giftCardsRes?.success) setAvailableGiftCards(giftCardsRes.data?.items || []);
        } catch (err) {
            console.error('Error fetching offer data:', err);
        }
    }, [selectedAddress?.pincodeAreaId]);

    useEffect(() => {
        fetchOfferData();
    }, [fetchOfferData]);

    useEffect(() => {
        if (cartSummary) {
            setAppliedCouponCode(cartSummary.couponCode || cartSummary.coupon || cartSummary.appliedCoupon || cartSummary.appliedCouponCode || null);
            setAppliedGiftCardCode(cartSummary.giftCardCode || cartSummary.giftCard || cartSummary.appliedGiftCard || null);
        }
    }, [cartSummary]);

    const handleApplyOffer = async (code: string, isGiftCard: boolean) => {
        if (!code) return;
        const pincodeAreaId = selectedAddress?.pincodeAreaId;
        const deliveryMode = deliveryHook?.deliveryMode || 'express';
        const slotId = deliveryHook?.selectedSlot;

        if (!cartSummary?.cartVersion) {
            Toast.show('Cart session expired, please refresh', Toast.SHORT);
            return;
        }

        try {
            if (showLoader) showLoader(true);
            let res;
            const version = cartSummary.cartVersion;
            const cartId = cartSummary.cartId;

            if (isGiftCard) {
                res = await applyGiftCardApi(code, version, pincodeAreaId, cartId);
            } else {
                res = await applyCouponApi(code, version, pincodeAreaId, cartId);
            }

            if (res?.success) {
                if (isGiftCard) setAppliedGiftCardCode(code);
                else setAppliedCouponCode(code);

                const newVersion = res?.data?.cartVersion || res?.data?.version || res?.cartVersion || res?.data?.cart?.cartVersion || res?.data?.cart?.version || null;
                await getCartSummary(deliveryMode, slotId, newVersion, null, pincodeAreaId);
                Toast.show(`${isGiftCard ? 'Gift Card' : 'Coupon'} applied successfully`, Toast.SHORT);
            } else {
                Toast.show(res?.message || `Failed to apply ${isGiftCard ? 'gift card' : 'coupon'}`, Toast.SHORT);
            }
        } catch (error) {
            console.error('Error applying offer:', error);
            Toast.show('An error occurred while applying the offer', Toast.SHORT);
        } finally {
            if (showLoader) showLoader(false);
        }
    };

    const handleApplyCoupon = useCallback((code: string) => {
        handleApplyOffer(code, isGiftCard);
        setShowCouponModal(false);
    }, [handleApplyOffer, isGiftCard]);

    const onApplyOffer = async (offerId: string) => {
        const pincodeAreaId = selectedAddress?.pincodeAreaId;
        const deliveryMode = deliveryHook?.deliveryMode || 'express';
        const slotId = deliveryHook?.selectedSlot;

        if (offerId === '2') {
            setIsGiftCard(false);
            setShowCouponModal(true);
        } else if (offerId === '4') {
            setIsGiftCard(true);
            setShowCouponModal(true);
        } else if (offerId === '3') {
            try {
                const bcoinsToApply = profile?.totalBCoins || profile?.bCoins || profile?.walletBalance || 0;

                if (bcoinsToApply <= 0) {
                    Toast.show('No UD-coinsavailable to apply', Toast.SHORT);
                    return;
                }

                if (!cartSummary?.cartVersion) {
                    Toast.show('Cart session expired, please refresh', Toast.SHORT);
                    return;
                }

                if (showLoader) showLoader(true);
                const version = cartSummary.cartVersion;
                const cartId = cartSummary.cartId;

                const res = await applyBCoinApi(bcoinsToApply, version, cartId);

                if (res?.success) {
                    const newVersion = res?.data?.cartVersion || res?.data?.version || res?.cartVersion || res?.data?.cart?.cartVersion || res?.data?.cart?.version || null;
                    await getCartSummary(deliveryMode, slotId, newVersion, null, pincodeAreaId);
                    Toast.show('UD-coinsapplied successfully', Toast.SHORT);
                } else {
                    Toast.show(res?.message || 'Failed to apply UD-Coins', Toast.SHORT);
                }
            } catch (error) {
                console.error('Error applying BCoin:', error);
                Toast.show('An error occurred', Toast.SHORT);
            } finally {
                if (showLoader) showLoader(false);
            }
        }
    };

    const onRejectOffer = useCallback(async (offerType: string) => {
        const pincodeAreaId = selectedAddress?.pincodeAreaId;
        const deliveryMode = deliveryHook?.deliveryMode || 'express';
        const slotId = deliveryHook?.selectedSlot;

        try {
            if (showLoader) showLoader(true);
            let res;
            const version = cartSummary?.cartVersion;
            const cartId = cartSummary?.cartId;

            if (offerType === '2') {
                res = await removeCouponApi(version, cartId);
                if (res?.success) {
                    setAppliedCouponCode(null);
                    Toast.show('Coupon removed', Toast.SHORT);
                }
            } else if (offerType === '3') {
                res = await removeBCoinApi(version, cartId);
                if (res?.success) {
                    Toast.show('UD-coinsremoved', Toast.SHORT);
                }
            } else if (offerType === '4') {
                res = await removeGiftCardApi(version, cartId);
                if (res?.success) {
                    setAppliedGiftCardCode(null);
                    Toast.show('Gift card removed', Toast.SHORT);
                }
            }

            if (res?.success) {
                const newVersion = res?.data?.cartVersion || res?.data?.version || res?.cartVersion || res?.data?.cart?.cartVersion || res?.data?.cart?.version || null;
                await getCartSummary(deliveryMode, slotId, newVersion, null, pincodeAreaId);
            } else {
                Toast.show(res?.message || 'Failed to remove offer', Toast.SHORT);
            }
        } catch (err: any) {
            console.error('Error removing offer:', err);
            Toast.show('Failed to remove offer', Toast.SHORT);
        } finally {
            if (showLoader) showLoader(false);
        }
    }, [cartSummary, getCartSummary, selectedAddress, deliveryHook, refreshCart]);



    const handleCouponClick = useCallback((coupon: any) => {
        handleApplyCoupon(coupon.code || coupon.couponCode);
    }, [handleApplyCoupon]);

    return {
        showCouponModal,
        setShowCouponModal,
        couponCode,
        setCouponCode,
        isGiftCard,
        availableCoupons,
        availableGiftCards,
        appliedCouponCode,
        appliedGiftCardCode,
        onApplyOffer,
        onRejectOffer,
        handleApplyCoupon,
        handleCouponClick,
    };
};

import { useMemo, useCallback, useRef, useEffect, useContext } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useOffers } from './useOffers';
import { useDeliverySlot } from './useDeliverySlot';
import { useAddresses } from './useAddresses';
import { useUser } from '../context/UserContext';
import { LoaderContext } from '../context/loaderContext';

export const useCartScreen = () => {
    const navigation = useNavigation<any>();
    const { cartItems, loadCart, cartSummary, getCartSummary, clearCart, error: cartError, fetchAddresses } = useCart();

    const { profile } = useUser();
    const { showLoader } = useContext(LoaderContext);
    const deliveryHook = useDeliverySlot();
    const addressHook = useAddresses();
    const offersHook = useOffers(deliveryHook, addressHook, cartSummary, getCartSummary, profile, loadCart, showLoader);

    const frontendBillCalculations = useMemo(() => {
        let mrpTotal = 0;
        let itemTotal = 0;
        cartItems.forEach(item => {
            const quantity = item.quantity || 1;
            const specialPrice = item.specialPrice || item.unitPrice || item.price || 0;
            const mrpPrice = item.mrp || item.mrpPrice || specialPrice;
            itemTotal += specialPrice * quantity;
            mrpTotal += mrpPrice * quantity;
        });
        const savings = mrpTotal - itemTotal;
        const deliveryCharge = (itemTotal > 0 && itemTotal < 500) ? 0 : 0;
        const toPay = itemTotal + deliveryCharge;
        return {
            mrpTotal,
            itemTotal,
            savings,
            deliveryCharge,
            couponDiscount: 0,
            giftCardAmount: 0,
            bcoinsAppliedValue: 0,
            totalBtokens: 0,
            totalSavings: savings,
            toPay
        };
    }, [cartItems]);

    const billCalculations = useMemo(() => {
        if (cartSummary) {
            const getVal = (primary: string, ...fallbacks: string[]) => {
                if (cartSummary[primary] !== undefined) return cartSummary[primary];
                for (const f of fallbacks) {
                    if (cartSummary[f] !== undefined) return cartSummary[f];
                }
                return undefined;
            };

            const subTotal = getVal('subTotal', 'subtotal', 'itemTotal', 'item_total') ?? frontendBillCalculations.itemTotal;
            const productDiscount = getVal('discountTotal', 'productDiscount', 'product_discount', 'discountAmount', 'savings') ?? 0;
            const deliveryCharge = getVal('deliveryCharge', 'deliveryAmount', 'delivery_amount', 'shippingFee') ?? 0;
            const totalTax = getVal('taxTotal', 'totalTax', 'taxAmount', 'tax_total') ?? 0;
            const grandTotal = getVal('grandTotal', 'totalAmount', 'grand_total', 'toPay') ?? frontendBillCalculations.toPay;

            return {
                mrpTotal: (subTotal || 0) + (productDiscount || 0),
                itemTotal: subTotal,
                savings: productDiscount,
                deliveryCharge: deliveryCharge,
                couponDiscount: getVal('couponDiscount', 'couponAmount', 'appliedCouponAmount', 'discountCoupon', 'couponAppliedValue') ?? 0,
                giftCardAmount: getVal('giftCardAmount', 'giftcardValue', 'appliedGiftCardAmount') ?? 0,
                bcoinsAppliedValue: getVal('bCoinAppliedValue', 'bcoinsAppliedValue', 'appliedBcoins', 'bcoinValue', 'bcoinDiscount', 'bCoinAmount', 'bCoinDiscount') ?? 0,
                totalTax: totalTax,
                totalBtokens: getVal('totalBtokens', 'totalBtoken', 'bTokenTotal') ?? 0,
                totalSavings: getVal('discountTotal', 'totalDiscount', 'totalSavings') ?? productDiscount,
                toPay: grandTotal
            };
        }
        return frontendBillCalculations;
    }, [cartSummary, frontendBillCalculations]);

    const isInitialMount = useRef(true);
    const selectedAddress = useMemo(() => addressHook.addresses.find(a => a.selected), [addressHook.addresses]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initCart = async () => {
                try {
                    await addressHook.refreshAddresses();
                    const loadResult: any = await loadCart();

                    if (!isActive) return;

                    const bootstrapVersion = loadResult?.cartVersion;
                    await getCartSummary(deliveryHook.deliveryMode, deliveryHook.selectedSlot, bootstrapVersion);
                } catch (err) {
                    console.error('❌ [FOCUS] Error:', err);
                } finally {
                    if (isActive) {
                        isInitialMount.current = false;
                    }
                }
            };

            initCart();
            return () => { isActive = false; };
        }, [loadCart, getCartSummary])
    );

    useEffect(() => {
        if (isInitialMount.current || !selectedAddress) return;

        const refreshCartData = async () => {
            const loadResult = await loadCart();
            const latestVersion = loadResult?.cartVersion || loadResult?.cart?.cartVersion;

            await getCartSummary(deliveryHook.deliveryMode, deliveryHook.selectedSlot, latestVersion, null, selectedAddress?.pincodeAreaId);
            await deliveryHook.fetchSlots(selectedAddress?.pincodeAreaId);
        };

        refreshCartData();
    }, [deliveryHook.selectedDeliveryType, deliveryHook.selectedSlot, selectedAddress?.id]);

    return {
        cartItems,
        cartSummary,
        billCalculations,
        loadCart,
        getCartSummary,
        clearCart,
        cartError,
        fetchAddresses,
        navigation,

        ...offersHook,
        ...deliveryHook,
        ...addressHook,
    };
};

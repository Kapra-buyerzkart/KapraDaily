import { useMemo, useCallback, useRef, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useOffers } from './useOffers';
import { useDeliverySlot } from './useDeliverySlot';
import { useAddresses } from './useAddresses';

export const useCartScreen = () => {
    const navigation = useNavigation();
    const { cartItems, loadCart, cartTotal, cartCount, cartSummary, getCartSummary, clearCart } = useCart();

    // ─── Composed hooks ───
    const offersHook = useOffers();
    const deliveryHook = useDeliverySlot();
    const addressHook = useAddresses();

    // ─── Bill calculations ───
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
        const deliveryCharge = itemTotal >= 500 ? 0 : 40;
        const totalSavings = savings + (deliveryCharge === 0 ? 40 : 0);
        const toPay = itemTotal + deliveryCharge;
        return { mrpTotal, itemTotal, savings, deliveryCharge, couponDiscount: 0, totalSavings, toPay };
    }, [cartItems]);

    const billCalculations = useMemo(() => {
        if (cartSummary) {
            return {
                mrpTotal: cartSummary.subTotal + (cartSummary.productDiscount || 0),
                itemTotal: cartSummary.subTotal || frontendBillCalculations.itemTotal,
                savings: cartSummary.productDiscount || 0,
                deliveryCharge: cartSummary.deliveryAmount || 0,
                couponDiscount: cartSummary.couponAmount || 0,
                giftCardAmount: cartSummary.giftCardAmount || 0,
                bcoinsAppliedValue: cartSummary.bcoinsAppliedValue || 0,
                totalTax: cartSummary.totalTax || 0,
                totalBtokens: cartSummary.totalBtokens || 0,
                totalSavings: cartSummary.totalDiscount || 0,
                toPay: cartSummary.grandTotal || frontendBillCalculations.toPay
            };
        }
        return frontendBillCalculations;
    }, [cartSummary, frontendBillCalculations]);

    // ─── Cart initialization (loadCart → getCartSummary) ───
    const isInitialMount = useRef(true);
    useFocusEffect(
        useCallback(() => {
            const initCart = async () => {
                const loadResult = await loadCart();
                const bootstrapVersion = loadResult?.cartVersion;
                await getCartSummary(deliveryHook.deliveryMode, deliveryHook.selectedSlot, bootstrapVersion);
                isInitialMount.current = false;
            };
            initCart();
        }, [loadCart, getCartSummary, deliveryHook.deliveryMode, deliveryHook.selectedSlot])
    );

    // Recalculate summary when delivery type/slot changes (after initial load)
    useEffect(() => {
        if (isInitialMount.current) return;
        if (deliveryHook.selectedDeliveryType || deliveryHook.selectedSlot) {
            getCartSummary(deliveryHook.deliveryMode, deliveryHook.selectedSlot);
        }
    }, [deliveryHook.selectedDeliveryType, deliveryHook.selectedSlot]);

    return {
        // Cart
        cartItems,
        billCalculations,
        loadCart,
        clearCart,
        navigation,

        // Composed hooks (spread for backward compat)
        ...offersHook,
        ...deliveryHook,
        ...addressHook,
    };
};

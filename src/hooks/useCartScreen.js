import { useMemo, useCallback, useRef, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useOffers } from './useOffers';
import { useDeliverySlot } from './useDeliverySlot';
import { useAddresses } from './useAddresses';

export const useCartScreen = () => {
    const navigation = useNavigation();
    const { cartItems, loadCart, cartTotal, cartCount, cartSummary, getCartSummary, clearCart, error: cartError } = useCart();

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
        const deliveryCharge = (itemTotal > 0 && itemTotal < 500) ? 5 : 0;
        const totalSavings = savings + (deliveryCharge === 0 && itemTotal >= 500 ? 5 : 0);
        const toPay = itemTotal + deliveryCharge;
        return { mrpTotal, itemTotal, savings, deliveryCharge, couponDiscount: 0, totalSavings, toPay };
    }, [cartItems]);

    const billCalculations = useMemo(() => {
        if (cartSummary) {
            return {
                mrpTotal: (cartSummary.subTotal || 0) + (cartSummary.productDiscount || 0),
                itemTotal: cartSummary.subTotal ?? frontendBillCalculations.itemTotal,
                savings: cartSummary.productDiscount ?? 0,
                deliveryCharge: cartSummary.deliveryAmount ?? 0,
                couponDiscount: cartSummary.couponAmount ?? 0,
                giftCardAmount: cartSummary.giftCardAmount ?? 0,
                bcoinsAppliedValue: cartSummary.bcoinsAppliedValue ?? 0,
                totalTax: cartSummary.totalTax ?? 0,
                totalBtokens: cartSummary.totalBtokens ?? 0,
                totalSavings: cartSummary.totalDiscount ?? 0,
                toPay: cartSummary.grandTotal ?? frontendBillCalculations.toPay
            };
        }
        return frontendBillCalculations;
    }, [cartSummary, frontendBillCalculations]);

    // ─── Cart initialization (loadCart → getCartSummary) ───
    const isInitialMount = useRef(true);
    const selectedAddress = useMemo(() => addressHook.addresses.find(a => a.selected), [addressHook.addresses]);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const initCart = async () => {
                console.log('🏁 [FOCUS] Initializing Cart Screen...');
                try {
                    console.log('🏁 [FOCUS] Fetching fresh addresses...');
                    await addressHook.refreshAddresses();

                    const loadResult = await loadCart();
                    if (!isActive) return;

                    const bootstrapVersion = loadResult?.cartVersion;
                    // Always try to get summary on focus to ensure fresh totals
                    await getCartSummary(deliveryHook.deliveryMode, deliveryHook.selectedSlot, bootstrapVersion, selectedAddress?.pincodeAreaId);
                } catch (err) {
                    console.error('❌ [FOCUS] Error during init:', err);
                } finally {
                    if (isActive) {
                        isInitialMount.current = false;
                    }
                }
            };

            initCart();

            return () => {
                isActive = false;
            };
        }, [loadCart, getCartSummary]) // Removed volatile dependencies
    );

    // Recalculate summary when delivery type/slot OR address changes (after initial load)
    useEffect(() => {
        if (isInitialMount.current) return;
        getCartSummary(deliveryHook.deliveryMode, deliveryHook.selectedSlot, null, selectedAddress?.pincodeAreaId);
    }, [deliveryHook.selectedDeliveryType, deliveryHook.selectedSlot, selectedAddress?.id]);

    return {
        // Cart
        cartItems,
        billCalculations,
        loadCart,
        clearCart,
        cartError,
        navigation,

        // Composed hooks (spread for backward compat)
        ...offersHook,
        ...deliveryHook,
        ...addressHook,
    };
};

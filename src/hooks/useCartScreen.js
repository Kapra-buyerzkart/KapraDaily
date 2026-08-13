import { useMemo, useCallback, useRef, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useOffers } from './useOffers';
import { useDeliverySlot } from './useDeliverySlot';
import { useAddresses } from './useAddresses';

export const useCartScreen = () => {
    const navigation = useNavigation();
    const { cartItems, loadCart, cartTotal, cartCount, cartSummary, getCartSummary, refreshCart, clearCart, error: cartError } = useCart();

    const deliveryHook = useDeliverySlot();
    const addressHook = useAddresses();
    const offersHook = useOffers(deliveryHook, addressHook);

    const frontendBillCalculations = useMemo(() => {
        let mrpTotal = 0;
        let itemTotal = 0;
        let totalBtokens = 0;
        cartItems.forEach(item => {
            const quantity = item.quantity || 1;
            const specialPrice = item.specialPrice || item.unitPrice || item.price || 0;
            const mrpPrice = item.mrp || item.mrpPrice || specialPrice;
            itemTotal += specialPrice * quantity;
            mrpTotal += mrpPrice * quantity;
            totalBtokens += item.totalBtokens || item.bTokenValue || item.bTokens || 0;
        });
        const savings = mrpTotal - itemTotal;
        const deliveryCharge = 0;
        const totalSavings = savings;
        const toPay = itemTotal + deliveryCharge;
        return { mrpTotal, itemTotal, savings, deliveryCharge, couponDiscount: 0, totalBtokens, totalSavings, toPay };
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
                totalBtokens: cartSummary.totalBtokens ?? frontendBillCalculations.totalBtokens,
                totalSavings: cartSummary.totalDiscount ?? 0,
                toPay: cartSummary.grandTotal ?? frontendBillCalculations.toPay
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
                console.log('🏁 [FOCUS] Initializing Cart Screen...');
                try {
                    await addressHook.refreshAddresses();
                    if (!isActive) return;

                    await refreshCart();
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
        }, [refreshCart, addressHook.refreshAddresses])
    );

    useEffect(() => {
        if (isInitialMount.current) return;
        refreshCart(selectedAddress?.pincodeAreaId);
    }, [deliveryHook.selectedDeliveryType, deliveryHook.selectedSlot, selectedAddress?.id, refreshCart]);

    return {
        cartItems,
        cartSummary,
        billCalculations,
        loadCart,
        getCartSummary,
        clearCart,
        cartError,
        navigation,

        ...offersHook,
        ...deliveryHook,
        ...addressHook,
    };
};

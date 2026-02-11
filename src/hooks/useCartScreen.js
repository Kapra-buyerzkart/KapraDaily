import { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { getAvailableCouponsApi } from '../api/cartService';
import { LoaderContext } from '../context/loaderContext';

export const useCartScreen = () => {
    const navigation = useNavigation();
    const { cartItems, loadCart, cartTotal, cartCount, cartSummary, getCartSummary, clearCart, applyCoupon, removeCoupon, applyGiftCard, removeGiftCard } = useCart();
    const { showLoader } = useContext(LoaderContext);

    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showSlotModal, setShowSlotModal] = useState(false);
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [isGiftCard, setIsGiftCard] = useState(false);
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [availableGiftCards, setAvailableGiftCards] = useState([
        { id: '1', code: 'GIFT500', description: 'Gift Card worth ₹500' },
        { id: '2', code: 'BDAY1000', description: 'Birthday Gift Card worth ₹1000' },
    ]);
    const [selectedDeliveryType, setSelectedDeliveryType] = useState('quick');
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);
    const [selectedSlot, setSelectedSlot] = useState(null);

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
        const deliveryCharge = itemTotal >= 500 ? 0 : 40; // Free delivery above ₹500
        const couponDiscount = 0;
        const totalSavings = savings + (deliveryCharge === 0 ? 40 : 0);
        const toPay = itemTotal + deliveryCharge - couponDiscount;

        return {
            mrpTotal,
            itemTotal,
            savings,
            deliveryCharge,
            couponDiscount,
            totalSavings,
            toPay
        };
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

    useEffect(() => {
        loadCart();
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            showLoader(true);
            const response = await getAvailableCouponsApi();
            if (response && response.data) {
                // Assuming response.data is the list of coupons
                // If the format is different, we might need to adjust
                setAvailableCoupons(response.data);
            }
        } catch (error) {
            console.error('Error fetching available coupons:', error);
        } finally {
            showLoader(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadCart();
            getCartSummary(selectedDeliveryType === 'quick' ? 'express' : 'slot', selectedSlot);
        }, [loadCart, getCartSummary, selectedDeliveryType, selectedSlot])
    );

    useEffect(() => {
        if (selectedDeliveryType || selectedSlot) {
            getCartSummary(selectedDeliveryType === 'quick' ? 'express' : 'slot', selectedSlot);
        }
    }, [selectedDeliveryType, selectedSlot]);

    const [offers, setOffers] = useState([
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
    ]);


    const [addresses, setAddresses] = useState([
        {
            id: '1',
            type: 'Home',
            address: 'american city main street road 1234',
            phone: '9999999999',
            pin: '676501',
            icon: require('../assets/images/home_icon.png'),
            selected: true,
            threeDotsClicked: false,
        },
        {
            id: '2',
            type: 'Office',
            address: 'indian city main street road 1234',
            phone: '8888888888',
            pin: '676502',
            icon: require('../assets/images/office_icon.png'),
            selected: false,
            threeDotsClicked: false,
        },
    ]);

    const onApplyOffer = (offerId) => {
        if (offerId === '2') { // Coupon
            setIsGiftCard(false);
            setCouponCode('');
            setShowCouponModal(true);
            return;
        }

        if (offerId === '4') { // Gift Card
            setIsGiftCard(true);
            setCouponCode('');
            setShowCouponModal(true);
            return;
        }

        setOffers(prev =>
            prev.map(item =>
                item.id === offerId
                    ? { ...item, applyCliked: true }
                    : item
            )
        )
    }

    const onRejectOffer = (offerId) => {
        if (offerId === '2') {
            removeCoupon().then(res => {
                if (res.success) {
                    setOffers(prev => prev.map(item => item.id === offerId ? { ...item, applyCliked: false } : item));
                }
            });
            return;
        }

        if (offerId === '4') { // Gift Card
            removeGiftCard().then(res => {
                if (res.success) {
                    setOffers(prev => prev.map(item => item.id === offerId ? { ...item, applyCliked: false } : item));
                }
            });
            return;
        }

        setOffers(prev =>
            prev.map(item =>
                item.id === offerId
                    ? { ...item, applyCliked: false }
                    : item
            )
        )
    }

    const handleApplyCoupon = async (codeOverride) => {
        const codeToApply = typeof codeOverride === 'string' ? codeOverride : couponCode;
        if (!codeToApply || !codeToApply.trim()) return;

        let result;
        if (isGiftCard) {
            result = await applyGiftCard(codeToApply);
        } else {
            result = await applyCoupon(codeToApply);
        }

        if (result.success) {
            setShowCouponModal(false);
            setOffers(prev => prev.map(item => item.id === (isGiftCard ? '4' : '2') ? { ...item, applyCliked: true } : item));
        } else {
            alert(result.message || "Failed to apply");
        }
    };

    const handleCouponClick = (code) => {
        setCouponCode(code);
        handleApplyCoupon(code);
    };

    const onSelectAddress = (addressId) => {
        setAddresses(prev =>
            prev.map(item => ({
                ...item,
                selected: item.id === addressId
            }))
        );
    };

    const onThreeDotsClicked = (addressId) => {
        setAddresses(prev =>
            prev.map(item => ({
                ...item,
                threeDotsClicked: item.id === addressId
            }))
        );
    };

    const onDeleteClicked = (addressId) => {
        setAddresses(prev =>
            prev.filter(item => item.id !== addressId)
        )
    }

    const onCloseThreeDots = () => {
        setAddresses(prev =>
            prev.map(item => ({
                ...item,
                threeDotsClicked: false
            }))
        );
    };

    const formatDDMMYYYY = (date) => {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
    };

    const getNextDates = () => {
        const dates = [];
        for (let i = 0; i < 3; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);

            dates.push({
                id: i,
                label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'long' }),
                date: d,
                formatted: formatDDMMYYYY(d)
            });
        }
        return dates;
    };

    const datesList = getNextDates();

    const slotsByDate = {
        0: [
            '6:00pm - 7:00pm',
            '7:00pm - 8:00pm',
            '8:00pm - 9:00pm',
        ],
        1: [
            '10:00am - 11:00am',
            '11:00am - 12:00pm',
            '6:00pm - 7:00pm',
        ],
        2: [
            '9:00am - 10:00am',
            '5:00pm - 6:00pm',
        ],
    };

    return {
        // State
        cartItems,
        billCalculations,
        showAddressModal,
        setShowAddressModal,
        showSlotModal,
        setShowSlotModal,
        showCouponModal,
        setShowCouponModal,
        couponCode,
        setCouponCode,
        isGiftCard,
        availableCoupons,
        availableGiftCards,
        selectedDeliveryType,
        setSelectedDeliveryType,
        selectedDateIndex,
        setSelectedDateIndex,
        selectedSlot,
        setSelectedSlot,
        offers,
        addresses,
        datesList,
        slotsByDate,

        // Actions
        loadCart,
        onApplyOffer,
        onRejectOffer,
        handleApplyCoupon,
        handleCouponClick,
        onSelectAddress,
        onThreeDotsClicked,
        onDeleteClicked,
        onCloseThreeDots,
        navigation // Exporting navigation just in case
    };
};

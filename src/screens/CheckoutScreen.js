import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LoaderContext } from '../context/loaderContext';
import { CartContext } from '../context/CartContext';
import { createOrderApi, confirmCodApi, getOrderDetailsApi } from '../api/orderService';
import { getPaymentModesApi } from '../api/configService';
import { createRazorpayOrderApi, verifyRazorpayPaymentApi } from '../api/paymentService';
import RazorpayCheckout from 'react-native-razorpay';
import { AppContext } from '../context/appContext';
import BillSection from '../components/BillSection';
import StatusModal from '../components/StatusModal';
import DeliverySlotModal from '../components/DeliverySlotModal';
import LinearGradient from 'react-native-linear-gradient';

const CheckoutScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {
        selectedAddress,
        selectedDeliveryType,
        selectedSlot,
        selectedDate,
        pincodeAreaId,
        preloadedBillCalculations,
        preloadedCartSummary,
        orderId: resumeOrderId,
        razorpayOrderId: resumeRazorpayOrderId,
        razorpayAmount: resumeRazorpayAmount,
        razorpayKeyId: resumeRazorpayKeyId
    } = route.params || {};

    const {
        cartSummary,
        cartItems,
        clearCart,
        clearSelectedAddress,
        getCartSummary,
        refreshCart,
        error: cartError,
        addresses
    } = useContext(CartContext);
    const { showLoader } = useContext(LoaderContext);
    const { profile } = useContext(AppContext);

    // Modal state
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [statusType, setStatusType] = useState('success');
    const [statusTitle, setStatusTitle] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [onModalClose, setOnModalClose] = useState(null);

    // Delivery & Payment selection
    const [deliveryType, setDeliveryType] = useState(
        selectedDeliveryType === 'slotted' || selectedDeliveryType === 'slot' ? 'slot' : 'express'
    );
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [paymentModes, setPaymentModes] = useState([]);
    const [showSlotModal, setShowSlotModal] = useState(false);
    const [chosenSlot, setChosenSlot] = useState(null);
    const scrollViewRef = React.useRef(null);

    // Get currently selected address from global context
    const currentSelectedAddress = addresses.find(a => a.selected) || selectedAddress;

    // Unified checkout initialization and dependency refresh
    useEffect(() => {
        const currentPincodeAreaId = pincodeAreaId || currentSelectedAddress?.pincodeAreaId;

        // Refresh summary whenever key dependencies change
        if (currentPincodeAreaId) {
            const apiDeliveryMode = deliveryType === 'slot' ? 'slotted' : 'express';
            getCartSummary(apiDeliveryMode, selectedSlot, null, currentPincodeAreaId);
        }
    }, [currentSelectedAddress?.id, deliveryType, selectedSlot, pincodeAreaId]);

    // ─── Bill calculations (Matches useCartScreen logic) ───
    const frontendBillCalculations = React.useMemo(() => {
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

    const billCalculations = React.useMemo(() => {
        // 1. Priority: Preloaded calculations passed from CartScreen (if available & valid)
        if (preloadedBillCalculations) {
            return preloadedBillCalculations;
        }

        // 2. Priority: Server-side Summary
        // If we have a preloaded summary, use that structure, otherwise context summary
        const summary = cartSummary || preloadedCartSummary;

        if (summary) {
            return {
                mrpTotal: (summary.subTotal || 0) + (summary.productDiscount || 0),
                itemTotal: summary.subTotal ?? frontendBillCalculations.itemTotal,
                savings: summary.productDiscount ?? 0,
                deliveryCharge: summary.deliveryAmount ?? 0,
                couponDiscount: summary.couponAmount ?? 0,
                giftCardAmount: summary.giftCardAmount ?? 0,
                bcoinsAppliedValue: summary.bcoinsAppliedValue ?? 0,
                totalTax: summary.totalTax ?? 0,
                totalBtokens: summary.totalBtokens ?? 0,
                totalSavings: summary.totalDiscount ?? 0,
                toPay: summary.grandTotal ?? frontendBillCalculations.toPay
            };
        }
        // 3. Fallback: Frontend calculations
        return frontendBillCalculations;
    }, [cartSummary, frontendBillCalculations, preloadedBillCalculations, preloadedCartSummary]);

    // Fetch payment modes once on mount
    useEffect(() => {
        const fetchPaymentModes = async () => {
            try {
                const response = await getPaymentModesApi();
);

                if (response?.success && response?.data) {
                    let modes = [...response.data];

                    // Check if an online payment mode exists
                    const hasOnline = modes.some(m =>
                        ['online', 'prepaid', 'razorpay', 'upi'].includes(m.paymentModeName?.toLowerCase())
                    );

                    // FOR TESTING: If no online mode is returned by backend, inject one 
                    // so the Razorpay implementation can be tested.
                    if (!hasOnline) {
                        modes.push({
                            paymentModeId: 'online_test_mode',
                            paymentModeName: 'Online',
                            description: 'UPI, Cards, Net Banking'
                        });
                    }

                    setPaymentModes(modes);

                    const codMode = modes.find(m => m.paymentModeName?.toUpperCase() === 'COD');
                    if (codMode) {
                        setPaymentMethod(codMode.paymentModeName);
                    } else if (modes.length > 0) {
                        setPaymentMethod(modes[0].paymentModeName);
                    }
                }
            } catch (error) {
            }
        };
        fetchPaymentModes();
    }, []);

    const handleConfirmOrder = async () => {
        if (!selectedAddress) {
            setStatusType('error');
            setStatusTitle('Error');
            setStatusMessage('Please select a delivery address');
            setStatusModalVisible(true);
            return;
        }

        const onlineTerms = ['online', 'prepaid', 'razorpay', 'upi'];
        const isOnlinePayment = onlineTerms.includes(paymentMethod?.toLowerCase());

        try {
            showLoader(true);

            if (resumeOrderId) {
                // Skip creation, go straight to payment logic
                // When resuming, we use the provided razorpay details if available
                await handlePaymentFlow(resumeOrderId, resumeOrderId, resumeRazorpayOrderId, resumeRazorpayAmount, resumeRazorpayKeyId);
                return;
            }

            const createPayload = {
                cartId: cartSummary?.cartId || cartItems?.[0]?.cartId,
                shippingAddressId: currentSelectedAddress?.id || selectedAddress?.id,
                billingAddressId: currentSelectedAddress?.id || selectedAddress?.id,
                paymentMethod: isOnlinePayment ? "online" : paymentMethod,
                ifMatchCartVersion: cartSummary?.cartVersion,
                deliverySlotDate: deliveryType === 'slot'
                    ? (chosenSlot?.date?.includes('T') ? chosenSlot.date.split('T')[0] : chosenSlot?.date || selectedDate)
                    : null,
                deliverySlotTime: deliveryType === 'slot'
                    ? (chosenSlot?.slotValue || selectedSlot || null)
                    : null,
                deliveryMode: deliveryType === 'slot' ? "slotted" : "express",
                orderPlacedFromDevice: "app",
                pincodeAreaId: pincodeAreaId || currentSelectedAddress?.pincodeAreaId || selectedAddress?.pincodeAreaId
            };

);
            const createResponse = await createOrderApi(createPayload);
);
            if (createResponse?.success && createResponse?.data?.orderId) {
                const orderId = createResponse.data.orderId;
                const orderNumber = createResponse.data.orderNumber || orderId;

                if (isOnlinePayment) {
                    await handlePaymentFlow(orderId, orderNumber);
                } else {
                    // --- COD FLOW ---
                    const confirmResponse = await confirmCodApi(orderId);
                    if (confirmResponse?.success) {
                        await finalizeOrder(createResponse.data);
                    } else {
                        showLoader(false);
                        setStatusType('error');
                        setStatusTitle('Error');
                        setStatusMessage(confirmResponse?.message || 'Failed to confirm COD order');
                        setStatusModalVisible(true);
                    }
                }
            } else if (createResponse?.status === 'CART_CONFLICT') {
                await refreshCart();
                showLoader(false);
                setStatusType('error');
                setStatusTitle('Cart Updated');
                setStatusMessage('Your cart was updated during checkout. Please try confirming your order again.');
                setStatusModalVisible(true);
            } else {
                showLoader(false);
                setStatusType('error');
                setStatusTitle('Error');
                setStatusMessage(createResponse?.message || 'Failed to create order');
                setStatusModalVisible(true);
            }
        } catch (error) {
            showLoader(false);
            setStatusType('error');
            setStatusTitle('Error');
            setStatusMessage('An unexpected error occurred during checkout');
            setStatusModalVisible(true);
        }
    };

    const handlePaymentFlow = async (orderId, orderNumber, passedRzpOrderId, passedAmount, passedKeyId) => {
        try {
            let razorpayOrderId = passedRzpOrderId;
            let amount = passedAmount;
            let keyId = passedKeyId;

            if (!razorpayOrderId || !amount || !keyId) {
                const rzpCreateResponse = await createRazorpayOrderApi({ orderId });
);

                if (rzpCreateResponse?.success && rzpCreateResponse?.data) {
                    keyId = rzpCreateResponse.data.keyId;
                    razorpayOrderId = rzpCreateResponse.data.razorpayOrderId;
                    amount = rzpCreateResponse.data.amount;
                } else {
                    showLoader(false);
                    setStatusType('error');
                    setStatusTitle('Error');
                    setStatusMessage(rzpCreateResponse?.message || 'Failed to initiate payment');
                    setStatusModalVisible(true);
                    return;
                }
            }

            const options = {
                key: keyId,
                amount: amount,
                currency: "INR",
                name: "Kapra Daily",
                description: `Payment for Order #${orderNumber}`,
                order_id: razorpayOrderId,
                prefill: {
                    email: profile?.email || '',
                    contact: profile?.phone || currentSelectedAddress?.phone || ''
                },
                theme: { color: "#F25000" }
            };

            showLoader(false);
            setTimeout(async () => {
                try {
                    const sdkResponse = await RazorpayCheckout.open(options);
                    showLoader(true);
                    const verifyPayload = {
                        orderId: orderId,
                        razorpayOrderId: sdkResponse.razorpay_order_id,
                        razorpayPaymentId: sdkResponse.razorpay_payment_id,
                        razorpaySignature: sdkResponse.razorpay_signature,
                        amount: Number(amount)
                    };

                    let verifyResponse;
                    let retryCount = 0;
                    const maxRetries = 2; // Initial attempt + 2 retries = 3 attempts total

                    const attemptVerification = async () => {
                        try {
                            const response = await verifyRazorpayPaymentApi(verifyPayload);
                            return response;
                        } catch (e) {
                            return null;
                        }
                    };

                    verifyResponse = await attemptVerification();

                    // Retry logic if failed or pending
                    while (
                        (!verifyResponse?.success || verifyResponse?.status === 'pending') &&
                        retryCount < maxRetries
                    ) {
                        retryCount++;
in 3s...`);
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        verifyResponse = await attemptVerification();
                    }

                    if (verifyResponse?.success) {
                        await finalizeOrder({ orderId, orderNumber });
                    } else {
                        // Verify API returned success: false — show pending screen
                        showLoader(false);
                        navigation.navigate('OrderPendingScreen', {
                            orderId,
                            orderNumber,
                            razorpayOrderId: sdkResponse.razorpay_order_id,
                            razorpayAmount: amount,
                            razorpayKeyId: keyId
                        });
                    }
                } catch (sdkError) {
                    showLoader(false);
                    if (clearSelectedAddress) clearSelectedAddress();
                    navigation.navigate('OrderFailedScreen', {
                        orderId,
                        orderNumber,
                        paymentMethod: paymentMethod || 'online',
                        totalItems: cartItems?.length || 0,
                        totalAmount: billCalculations?.toPay || amount || 0,
                        errorMessage: sdkError?.description || 'Payment failed.'
                    });
                    refreshCart();
                }
            }, 200);
        } catch (error) {
            showLoader(false);
        }
    };

    const handleVerificationFailure = async (orderId, orderData, sdkResponse, keyId, amount) => {
        setStatusType('info');
        setStatusTitle('Verifying Payment...');
        setStatusMessage('Your payment verification is taking longer than expected. Please wait...');
        setStatusModalVisible(true);

        // Wait for 3 seconds as suggested
        setTimeout(async () => {
            try {
                const response = await getOrderDetailsApi(orderId);

                if (response?.success && response?.data?.orderStatusKey?.toLowerCase() === 'placed') {
                    setStatusModalVisible(false);
                    await finalizeOrder(orderData);
                } else if (response?.data?.orderStatusKey?.toLowerCase() === 'pending') {
                    setStatusModalVisible(false);
                    showLoader(false);
                    navigation.navigate('OrderPendingScreen', {
                        orderId: orderId,
                        orderNumber: orderData.orderNumber || orderData.orderId,
                        razorpayOrderId: sdkResponse?.razorpay_order_id,
                        razorpayAmount: amount,
                        razorpayKeyId: keyId
                    });
                } else {
                    setStatusModalVisible(false);
                    showLoader(false);
                    if (clearSelectedAddress) clearSelectedAddress();
                    navigation.navigate('OrderFailedScreen', {
                        orderId: orderId,
                        orderNumber: orderData.orderNumber || orderData.orderId,
                        paymentMethod: paymentMethod,
                        totalItems: cartItems?.length || 0,
                        totalAmount: billCalculations?.toPay || 0,
                        errorMessage: 'We could not verify your payment. Please check your order status in the My Orders section.'
                    });

                    // Sync cart state
                    refreshCart();
                }
            } catch (err) {
                showLoader(false);
                setStatusType('error');
                setStatusTitle('Verification Error');
                setStatusMessage('Something went wrong during final verification.');
                setStatusModalVisible(true);
            }
        }, 3000);
    };

    const finalizeOrder = async (orderData) => {
        await clearCart(); // Local clear
        if (clearSelectedAddress) clearSelectedAddress(); // Clear selected address
        showLoader(false);
        navigation.navigate('OrderSuccessScreen', {
            orderId: orderData.orderId,
            orderNumber: orderData.orderNumber || orderData.orderId,
            paymentMethod: paymentMethod,
            totalItems: cartItems?.length || 0,
            totalAmount: billCalculations?.toPay || 0,
            deliveryMode: deliveryType === 'slot' ? 'slotted' : 'express',
            deliverySlot: chosenSlot ? `${chosenSlot.dateDisplay} | ${chosenSlot.slotDisplay}` : null,
            address: currentSelectedAddress?.address || selectedAddress?.address || '',
        });
    };

    const handleModalClose = () => {
        setStatusModalVisible(false);
        if (onModalClose) {
            onModalClose();
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name={'left'} size={wp('6%')} color={'#000000'} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Checkout</Text>
                <View style={{ width: wp('6%') }} />
            </View>

            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>
                {/* Delivery Address Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="map-marker-outline" size={wp('6%')} color="#F25000" />
                        <Text style={styles.sectionTitle}>Delivery Address</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('SavedAddressScreen')}
                            style={styles.changeButton}
                        >
                            <Text style={styles.changeButtonText}>Change</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.card}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {(() => {
                                    const type = currentSelectedAddress?.type?.toLowerCase() || '';
                                    const iconSize = wp('4.5%');
                                    const iconStyle = { marginRight: wp('2%') };
                                    if (type === 'home') {
                                        return <Entypo name="home" size={iconSize} color="#F25000" style={iconStyle} />;
                                    } else if (type === 'office') {
                                        return <MaterialCommunityIcons name="briefcase" size={iconSize} color="#F25000" style={iconStyle} />;
                                    } else {
                                        return <Entypo name="location-pin" size={iconSize} color="#F25000" style={iconStyle} />;
                                    }
                                })()}
                                <Text style={[styles.addressType, { marginTop: 5 }]}>{currentSelectedAddress?.type || 'Home'}</Text>
                            </View>
                            <View style={styles.addressDivider} />
                            <Text style={styles.addressText}>{currentSelectedAddress?.address || 'No address selected'}</Text>
                            <Text style={styles.phoneText}>Phone: {currentSelectedAddress?.phone || 'N/A'}</Text>
                        </View>
                    </View>
                </View>

                {/* Delivery Schedule Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="clock-outline" size={wp('6%')} color="#F25000" />
                        <Text style={styles.sectionTitle}>Delivery Schedule</Text>
                    </View>
                    <View style={styles.card}>
                        {/* Express Option */}
                        <TouchableOpacity
                            style={styles.radioRow}
                            onPress={() => setDeliveryType('express')}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={deliveryType === 'express' ? 'radio-button-on' : 'radio-button-off'}
                                size={wp('5.5%')}
                                color={deliveryType === 'express' ? '#F25000' : '#CCCCCC'}
                            />
                            <View style={styles.radioContent}>
                                <Text style={[styles.radioTitle, deliveryType === 'express' && { color: '#F25000' }]}>Express Delivery</Text>
                                <Text style={styles.radioSubtitle}>Delivery in 20-30 mins</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.radioDivider} />

                        {/* Slotted Option */}
                        <TouchableOpacity
                            style={styles.radioRow}
                            onPress={() => {
                                setDeliveryType('slot');
                                if (!chosenSlot) setShowSlotModal(true);
                            }}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={deliveryType === 'slot' ? 'radio-button-on' : 'radio-button-off'}
                                size={wp('5.5%')}
                                color={deliveryType === 'slot' ? '#F25000' : '#CCCCCC'}
                            />
                            <View style={styles.radioContent}>
                                <Text style={[styles.radioTitle, deliveryType === 'slot' && { color: '#F25000' }]}>Slotted Delivery</Text>
                                <Text style={styles.radioSubtitle}>
                                    {chosenSlot
                                        ? `${chosenSlot.dateDisplay} | ${chosenSlot.slotDisplay}`
                                        : selectedDate && selectedSlot
                                            ? `${selectedDate} | ${selectedSlot}`
                                            : 'Choose a delivery slot'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {deliveryType === 'slot' && (
                            <TouchableOpacity
                                onPress={() => setShowSlotModal(true)}
                                style={{ alignSelf: 'flex-end', marginBottom: hp('0.01%') }}
                            >
                                <Text style={{ fontFamily: FONTS.poppins.medium, fontSize: wp('3%'), color: '#F25000' }}>
                                    {chosenSlot ? 'Change Slot' : 'Select Slot'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Order Items Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="format-list-bulleted" size={wp('6%')} color="#F25000" />
                        <Text style={styles.sectionTitle}>Order Items</Text>
                        <View style={styles.itemCountBadge}>
                            <Text style={styles.itemCountText}>{cartItems.length} items</Text>
                        </View>
                    </View>
                    <View style={styles.card}>
                        {cartItems.map((item, index) => {
                            const price = item.specialPrice || item.unitPrice || item.price || 0;
                            return (
                                <View key={item.id || index} style={styles.itemRow}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.itemName} numberOfLines={1}>{item.prName || item.productName || item.name}</Text>
                                        <Text style={styles.itemPriceText}>₹{price.toFixed(2)} per unit</Text>
                                    </View>
                                    <Text style={styles.itemQty}>x{item.quantity || item.addedQty}</Text>
                                    <Text style={styles.itemTotalText}>₹{(price * (item.quantity || item.addedQty)).toFixed(2)}</Text>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Payment Method Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="credit-card-outline" size={wp('6%')} color="#F25000" />
                        <Text style={styles.sectionTitle}>Payment Method</Text>
                    </View>
                    <View style={styles.card}>
                        {paymentModes.map((mode, index) => {
                            const isSelected = paymentMethod === mode.paymentModeName;
                            const isCOD = mode.paymentModeName?.toUpperCase() === 'COD';

                            return (
                                <React.Fragment key={mode.paymentModeId}>
                                    <TouchableOpacity
                                        style={styles.radioRow}
                                        onPress={() => setPaymentMethod(mode.paymentModeName)}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons
                                            name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                                            size={wp('5.5%')}
                                            color={isSelected ? '#F25000' : '#CCCCCC'}
                                        />
                                        <View style={styles.radioContent}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <MaterialCommunityIcons
                                                    name={isCOD ? "cash" : "cellphone"}
                                                    size={wp('5.5%')}
                                                    color={isCOD ? "#0CA201" : "#1A73E8"}
                                                />
                                                <Text style={[styles.radioTitle, { marginLeft: wp('2%') }, isSelected && { color: '#F25000' }]}>
                                                    {mode.paymentModeName}
                                                </Text>
                                            </View>
                                            <Text style={styles.radioSubtitle}>
                                                {isCOD ? "Pay when you receive" : "UPI, Cards, Net Banking"}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    {index < paymentModes.length - 1 && <View style={styles.radioDivider} />}
                                </React.Fragment>
                            );
                        })}
                        {paymentModes.length === 0 && (
                            <Text style={styles.radioSubtitle}>Loading payment methods...</Text>
                        )}
                    </View>
                </View>

                {/* Bill Section */}
                {cartError && (
                    <View style={styles.errorSection}>
                        <MaterialCommunityIcons name="alert-circle-outline" size={wp('6%')} color="#D32F2F" />
                        <Text style={styles.errorText}>{cartError}</Text>
                    </View>
                )}

                {!cartError && (
                    <View style={styles.billContainer}>
                        <BillSection billCalculations={billCalculations} />
                    </View>
                )}
            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        setTimeout(() => {
                            scrollViewRef.current?.scrollToEnd({ animated: true });
                        }, 100);
                    }}
                    style={styles.bottomAmountContainer}
                >
                    <Text style={styles.totalLabel}>Total Payable</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.totalAmount}>₹{billCalculations.toPay?.toFixed(2) || '0.00'}</Text>
                        <Image
                            style={styles.arrowIcon}
                            source={require('../assets/images/down_arrow.png')}
                        />
                    </View>
                </TouchableOpacity>
                {(() => {
                    const isSlotted = deliveryType === 'slot';
                    const hasSlot = chosenSlot || (selectedDate && selectedSlot);
                    const isButtonDisabled = !!cartError || (isSlotted && !hasSlot);

                    return (
                        <LinearGradient
                            style={[styles.confirmButtonGradient, isButtonDisabled && { opacity: 0.5 }]}
                            colors={['#F25000', '#FF7B3A']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <TouchableOpacity
                                onPress={handleConfirmOrder}
                                style={styles.confirmButton}
                                disabled={isButtonDisabled}
                            >
                                <Text style={styles.confirmButtonText}>Confirm Order</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    );
                })()}
            </View>

            <StatusModal
                visible={statusModalVisible}
                onClose={handleModalClose}
                type={statusType}
                title={statusTitle}
                message={statusMessage}
            />

            <DeliverySlotModal
                visible={showSlotModal}
                onClose={() => setShowSlotModal(false)}
                pincodeAreaId={pincodeAreaId || currentSelectedAddress?.pincodeAreaId || selectedAddress?.pincodeAreaId}
                onSelectSlot={(slot) => setChosenSlot(slot)}
            />
        </SafeAreaView>
    );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA'
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp('4.65%'),
        paddingVertical: hp('2%'),
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE'
    },
    headerTitle: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('5%'),
        color: '#000000'
    },
    scrollContent: {
        paddingBottom: hp('15%')
    },
    sectionContainer: {
        marginTop: hp('1.5%'),
        paddingHorizontal: wp('4.65%')
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('0.5%')
    },
    sectionTitle: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%'),
        color: '#000000',
        marginLeft: wp('2%'),
        flex: 1
    },
    changeButton: {
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('0.5%'),
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#F25000',
    },
    changeButtonText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3%'),
        color: '#F25000',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('0.8%'),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    addressType: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.8%'),
        color: '#000000',
        marginBottom: hp('0.2%')
    },
    addressDivider: {
        height: 1,
        backgroundColor: '#EEEEEE',
        marginVertical: hp('0.4%')
    },
    addressText: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3.5%'),
        color: '#616161',
        lineHeight: hp('2.2%')
    },
    phoneText: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('3.5%'),
        color: '#000000',
        marginTop: hp('0.5%')
    },
    radioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp('0.2%'),
    },
    radioContent: {
        marginLeft: wp('3%'),
        flex: 1,
    },
    radioTitle: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.8%'),
        color: '#000000',
    },
    radioSubtitle: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3.2%'),
        color: '#999999',
        marginTop: hp('0.1%'),
    },
    radioDivider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: hp('0.1%'),
    },
    billContainer: {
        marginTop: hp('1%')
    },
    bottomAmountContainer: {
        flex: 1
    },
    arrowIcon: {
        width: wp('3%'),
        height: wp('3%'),
        resizeMode: 'contain',
        marginLeft: wp('2%')
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: wp('4.65%'),
        paddingVertical: hp('2%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 10
    },
    totalLabel: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3.5%'),
        color: '#616161'
    },
    totalAmount: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('5.5%'),
        color: '#000000'
    },
    confirmButtonGradient: {
        borderRadius: 12,
        width: wp('50%')
    },
    confirmButton: {
        height: hp('6.5%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    confirmButtonText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.5%'),
        color: '#FFFFFF'
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFEBEE',
        padding: wp('3%'),
        borderRadius: 8,
        marginBottom: hp('1%')
    },
    errorSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFEBEE',
        padding: wp('4%'),
        marginHorizontal: wp('4.65%'),
        marginTop: hp('2%'),
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFCDD2'
    },
    errorText: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('3.5%'),
        color: '#D32F2F',
        marginLeft: wp('2%'),
        flex: 1
    },
    itemCountBadge: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('3%'),
        color: '#777777',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('0.2%'),
        borderRadius: 4
    },
    itemCountText: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('3%'),
        color: '#777777',
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('0.8%')
    },
    itemName: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3.5%'),
        color: '#333333',
        flex: 1,
        marginRight: wp('4%')
    },
    itemQty: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('3.5%'),
        color: '#777777',
        width: wp('12%'),
        textAlign: 'center'
    },
    itemPriceText: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3%'),
        color: '#999999',
        marginTop: hp('0.2%')
    },
    itemTotalText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#333333',
        width: wp('20%'),
        textAlign: 'right'
    }
});

import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform, RefreshControl, ViewBase } from 'react-native'
import React, { useContext, useState, useEffect, useRef } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import CartProductCard from '../components/CartProductCard'
import OfferCard from '../components/OfferCard' // We might not need this if we build custom ones
import LinearGradient from 'react-native-linear-gradient'
import { useCartScreen } from '../hooks/useCartScreen'
import { CartContext } from '../context/CartContext'
import AppButton from '../components/AppButton'
import { LoaderContext } from '../context/loaderContext'
import ConfirmationModal from '../components/ConfirmationModal'
import { getDashboardDataApi } from '../api/userService'
import { getPaymentModesApi } from '../api/configService'
import { createOrderApi, confirmCodApi, getOrderDetailsApi } from '../api/orderService'
import { createRazorpayOrderApi, verifyRazorpayPaymentApi } from '../api/paymentService'
import RazorpayCheckout from 'react-native-razorpay'

import AddressModal from '../components/AddressModal'
import AddressConfirmationModal from '../components/AddressConfirmationModal'
import DeliverySlotModal from '../components/DeliverySlotModal'
import CouponModal from '../components/CouponModal'
import BillSection from '../components/BillSection'
import CartEmptyComponent from '../components/CartEmptyComponent'
import StoreUnavailable from '../components/StoreUnavailable'
import StatusModal from '../components/StatusModal'
import { AppContext } from '../context/appContext'

const CartScreen = () => {
    const navigation = useNavigation()
    const { profile, isStoreUnavailable, storeUnavailableData } = useContext(AppContext)
    const {
        // Cart
        billCalculations,
        cartSummary,

        // Offers
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

        // Delivery
        selectedDeliveryType,
        setSelectedDeliveryType,
        selectedDateIndex,
        selectedSlot,
        setSelectedSlot,
        showSlotModal,
        setShowSlotModal,
        datesList,
        slotsByDate,
        onSelectDate,
        deliveryModes,
    } = useCartScreen();

    const { showLoader } = useContext(LoaderContext);
    const {
        cartItems,
        clearCart,
        getCartSummary,
        error: cartError,
        addresses,
        fetchAddresses,
        showAddressModal,
        setShowAddressModal,
        onSelectAddress,
        onThreeDotsClicked,
        onDeleteClicked,
        onCloseThreeDots,
        addressConfirmationData,
        setAddressConfirmationData,
        refreshCart
    } = useContext(CartContext);

    const [isClearCartModalVisible, setIsClearCartModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [paymentModes, setPaymentModes] = useState([]);

    // Status Modal State
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [statusType, setStatusType] = useState('success');
    const [statusTitle, setStatusTitle] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [chosenSlot, setChosenSlot] = useState(null);

    const scrollViewRef = useRef(null);
    const insets = useSafeAreaInsets();

    const selectedAddress = addresses.find(a => a.selected);

    // Fetch payment modes on mount
    useEffect(() => {
        const fetchPaymentModes = async () => {
            try {
                const response = await getPaymentModesApi();
                if (response?.success && response?.data) {
                    let modes = [...response.data];
                    // Ensure online exists for testing
                    if (!modes.some(m => ['online', 'razorpay', 'upi'].includes(m.paymentModeName?.toLowerCase()))) {
                        modes.push({ paymentModeId: 'online_test', paymentModeName: 'Online', description: 'UPI, Cards, Net Banking' });
                    }
                    setPaymentModes(modes);
                    const cod = modes.find(m => m.paymentModeName?.toUpperCase() === 'COD');
                    if (cod) setPaymentMethod(cod.paymentModeName);
                }
            } catch (err) {
                console.error('Error fetching payment modes:', err);
            }
        };
        fetchPaymentModes();
    }, []);

    // Refresh addresses whenever the screen gains focus
    useFocusEffect(
        React.useCallback(() => {
            fetchAddresses();
        }, [fetchAddresses])
    );

    // Calculate total B-Tokens
    const totalCartBTokens = cartItems.reduce((sum, item) => sum + (item.totalBtokens || item.bTokenValue || item.bTokens || 0), 0);

    // Pull-to-Refresh
    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        try {
            await Promise.all([getCartSummary(), fetchAddresses()]);
        } finally {
            setRefreshing(false);
        }
    }, [getCartSummary, fetchAddresses]);

    const scrollToBill = () => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    // --- Order Placement Logic (Migrated from Checkout) ---
    const handleConfirmOrder = async () => {
        if (!selectedAddress) {
            setShowAddressModal(true);
            return;
        }

        const onlineTerms = ['online', 'prepaid', 'razorpay', 'upi', 'online_test', 'online payment'];
        const isOnlinePayment = onlineTerms.some(term => paymentMethod?.toLowerCase()?.includes(term));

        try {
            showLoader(true);
            if (!cartSummary?.cartId && !cartItems?.[0]?.cartId) {
                console.error('❌ [ORDER] No cartId found in summary or items');
                throw new Error('Cart not found. Please refresh and try again.');
            }

            const createPayload = {
                cartId: cartSummary?.cartId || cartItems?.[0]?.cartId,
                shippingAddressId: selectedAddress.id,
                billingAddressId: selectedAddress.id,
                paymentMethod: isOnlinePayment ? "online" : paymentMethod,
                ifMatchCartVersion: cartSummary?.cartVersion,
                deliverySlotDate: selectedDeliveryType === 'slot'
                    ? (chosenSlot?.date?.includes('T') ? chosenSlot.date.split('T')[0] : chosenSlot?.date)
                    : null,
                deliverySlotTime: selectedDeliveryType === 'slot' ? (chosenSlot?.slotValue || null) : null,
                deliveryMode: selectedDeliveryType === 'slot' ? "slotted" : "express",
                orderPlacedFromDevice: "app",
                pincodeAreaId: selectedAddress.pincodeAreaId
            };

            const createResponse = await createOrderApi(createPayload);
            if (createResponse?.success && createResponse?.data?.orderId) {
                const orderId = createResponse.data.orderId;
                const orderNumber = createResponse.data.orderNumber || orderId;

                if (isOnlinePayment) {
                    await handlePaymentFlow(orderId, orderNumber);
                } else {
                    const confirmResponse = await confirmCodApi(orderId);
                    if (confirmResponse?.success) {
                        await finalizeOrder(createResponse.data);
                    } else {
                        throw new Error(confirmResponse?.message || 'Failed to confirm COD');
                    }
                }
            } else if (createResponse?.status === 'CART_CONFLICT') {
                await refreshCart();
                showLoader(false);
                setStatusType('error');
                setStatusTitle('Cart Updated');
                setStatusMessage('Cart was updated. Please try again.');
                setStatusModalVisible(true);
            } else {
                throw new Error(createResponse?.message || 'Failed to create order');
            }
        } catch (error) {
            showLoader(false);
            setStatusType('error');
            setStatusTitle('Error');
            setStatusMessage(error.message || 'An unexpected error occurred');
            setStatusModalVisible(true);
        }
    };

    const handlePaymentFlow = async (orderId, orderNumber) => {
        try {
            const rzpResponse = await createRazorpayOrderApi({ orderId });
            console.log('💳 [RAZORPAY] Create Razorpay Order Response:', JSON.stringify(rzpResponse, null, 2));

            if (rzpResponse?.success && rzpResponse?.data) {
                const { keyId, razorpayOrderId, amount } = rzpResponse.data;
                const options = {
                    key: keyId,
                    amount: amount,
                    currency: "INR",
                    name: "Kapra Daily",
                    description: `Order #${orderNumber}`,
                    order_id: razorpayOrderId,
                    prefill: { email: profile?.email || '', contact: profile?.phone || selectedAddress?.phone || '' },
                    theme: { color: "#F25000" }
                };

                showLoader(false);

                // Use setTimeout to ensure the loader is dismissed before opening SDK
                setTimeout(async () => {
                    try {
                        const sdkResponse = await RazorpayCheckout.open(options);
                        showLoader(true);

                        const verifyPayload = {
                            orderId,
                            razorpayOrderId: sdkResponse.razorpay_order_id,
                            razorpayPaymentId: sdkResponse.razorpay_payment_id,
                            razorpaySignature: sdkResponse.razorpay_signature,
                            amount: Number(amount)
                        };

                        let verifyResponse;
                        let retryCount = 0;
                        const maxRetries = 2;

                        const attemptVerification = async () => {
                            try {
                                console.log(`🔍 [RAZORPAY] Verification Attempt ${retryCount + 1}...`);
                                return await verifyRazorpayPaymentApi(verifyPayload);
                            } catch (e) {
                                console.error(`⚠️ [RAZORPAY] Verification Attempt ${retryCount + 1} Error:`, e);
                                return null;
                            }
                        };

                        verifyResponse = await attemptVerification();

                        while (
                            (!verifyResponse?.success || verifyResponse?.status === 'pending') &&
                            retryCount < maxRetries
                        ) {
                            retryCount++;
                            console.log(`🔄 [RAZORPAY] Retrying verification (Count: ${retryCount}) in 3s...`);
                            await new Promise(resolve => setTimeout(resolve, 3000));
                            verifyResponse = await attemptVerification();
                        }

                        if (verifyResponse?.success) {
                            await finalizeOrder({ orderId, orderNumber });
                        } else {
                            showLoader(false);
                            navigation.navigate('OrderPendingScreen', { orderId, orderNumber, razorpayOrderId, razorpayAmount: amount, razorpayKeyId: keyId });
                        }
                    } catch (sdkError) {
                        console.error('⚠️ [RAZORPAY] SDK Error:', sdkError);
                        showLoader(false);
                        navigation.navigate('OrderFailedScreen', {
                            orderId,
                            orderNumber,
                            paymentMethod: paymentMethod || 'online',
                            errorMessage: sdkError?.description || sdkError?.message || 'Payment cancelled or failed.'
                        });
                        refreshCart();
                    }
                }, 200);
            } else {
                throw new Error(rzpResponse?.message || 'Payment initiation failed');
            }
        } catch (error) {
            console.error('❌ [RAZORPAY] Flow Error:', error);
            showLoader(false);
            setStatusType('error');
            setStatusTitle('Payment Error');
            setStatusMessage(error.message || 'Failed to initialize payment');
            setStatusModalVisible(true);
        }
    };

    const finalizeOrder = async (orderData) => {
        await clearCart();
        showLoader(false);
        navigation.navigate('OrderSuccessScreen', {
            orderId: orderData.orderId,
            orderNumber: orderData.orderNumber || orderData.orderId,
            paymentMethod,
            totalItems: cartItems.length,
            totalAmount: billCalculations.toPay,
            deliveryMode: selectedDeliveryType === 'slot' ? 'slotted' : 'express',
            address: selectedAddress?.address || '',
        });
    };

    // --- Rendring Section Helpers ---

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <AntDesign name="left" size={wp('5%')} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Cart</Text>
            <View style={styles.lightningBadge}>
                <Image source={require('../assets/images/lighting.png')} style={styles.lightningIcon} />
                <Text style={styles.deliveryTime}>20 min</Text>
            </View>
        </View>
    );

    const renderAddressBar = () => (
        <TouchableOpacity onPress={() => setShowAddressModal(true)} style={styles.addressBar}>
            <Ionicons name="location-outline" size={wp('4%')} color="#000" />
            <Text style={styles.addressLine} numberOfLines={1}>
                {selectedAddress?.address || 'Select delivery address'}
            </Text>
            <AntDesign name="down" size={wp('3%')} color="#000" />
        </TouchableOpacity>
    );

    const renderSaveMoney = () => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Save money</Text>
                <MaterialCommunityIcons name="ticket-percent-outline" size={wp('4.5%')} color="#000" style={{ alignSelf: 'center', top: -3 }} />
            </View>

            <View style={styles.offerCardsList}>
                {/* Coupon */}
                <View style={[styles.offerCard, appliedCouponCode && { borderColor: '#0CA201' }]}>
                    <View style={styles.offerIconBox}>
                        <MaterialCommunityIcons name="tag-outline" size={wp('4.5%')} color="#F25000" />
                    </View>
                    <View style={styles.offerDetails}>
                        <Text style={styles.offerName}>Coupon</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Text style={[styles.offerSub, { marginTop: 0, flexShrink: 1 }]}>
                                {appliedCouponCode ? appliedCouponCode : "View all coupons"}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.applyBtn}
                        onPress={() => appliedCouponCode ? onRejectOffer('2') : setShowCouponModal(true)}
                    >
                        {appliedCouponCode ? (
                            <Text style={[styles.applyBtnText, { color: '#FF4D4D' }]}>Remove</Text>
                        ) : (
                            <Text style={styles.applyBtnText}>Apply {'>'}</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Smart Point */}
                <View style={[styles.offerCard, { marginTop: hp('1.5%') }, appliedGiftCardCode && { borderColor: '#0CA201' }]}>
                    <View style={styles.offerIconBox}>
                        <MaterialCommunityIcons name="gift" size={wp('4.5%')} color="#F25000" />
                    </View>
                    <View style={styles.offerDetails}>
                        <Text style={styles.offerName}>Smart point</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Text style={[styles.offerSub, { marginTop: 0, flexShrink: 1 }]}>
                                {appliedGiftCardCode ? appliedGiftCardCode : "View all gift card"}
                            </Text>
                        </View>
                        {/* {!appliedGiftCardCode && <Text style={styles.offerLink}>View all gift card  {'>'}</Text>} */}
                    </View>
                    <TouchableOpacity
                        style={styles.applyBtn}
                        onPress={() => appliedGiftCardCode ? onRejectOffer('4') : onApplyOffer('4')}
                    >
                        {appliedGiftCardCode ? (
                            <Text style={[styles.applyBtnText, { color: '#FF4D4D' }]}>Remove</Text>
                        ) : (
                            <Text style={styles.applyBtnText}>Apply {'>'}</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* B-coin */}
                <View style={[styles.offerCard, { marginTop: hp('1.5%') }, billCalculations.bcoinsAppliedValue > 0 && { borderColor: '#0CA201' }]}>
                    <View style={styles.offerIconBox}>
                        <View style={styles.bcoinInnerCircle}>
                            <MaterialCommunityIcons name="currency-inr" size={wp('4%')} color="#FFF" />
                        </View>
                    </View>
                    <View style={styles.offerDetails}>
                        <Text style={styles.offerName}>B-coin</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Text style={[styles.offerSub, { marginTop: 0, flexShrink: 1 }]}>
                                Available B-coin : {profile?.totalBCoins || profile?.bCoins || 0}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.applyBtn}
                        onPress={() => billCalculations.bcoinsAppliedValue > 0 ? onRejectOffer('3') : onApplyOffer('3')}
                    >
                        {billCalculations.bcoinsAppliedValue > 0 ? (
                            <Text style={[styles.applyBtnText, { color: '#FF4D4D' }]}>Remove</Text>
                        ) : (
                            <Text style={styles.applyBtnText}>Apply {'>'}</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderSchedule = () => (
        <View style={[styles.section, { borderBottomWidth: 0 }]}>
            <Text style={styles.sectionTitle}>Schedule Time</Text>
            <View style={styles.scheduleCard}>
                {/* Express */}
                <TouchableOpacity
                    style={styles.scheduleOption}
                    onPress={() => setSelectedDeliveryType('express')}
                >
                    <View style={styles.optionIconBox}>
                        <Image source={require('../assets/images/lighting.png')} style={{ width: wp('4.5%'), height: wp('4.5%'), tintColor: '#F25000' }} />
                    </View>
                    <View style={styles.optionText}>
                        <Text style={[styles.optionTitle, selectedDeliveryType === 'express' && { color: '#F25000' }]}>Express delivery</Text>
                    </View>
                    <Ionicons
                        name={selectedDeliveryType === 'express' ? "radio-button-on" : "radio-button-off"}
                        size={wp('4.5%')}
                        color={selectedDeliveryType === 'express' ? "#F25000" : "#CCCCCC"}
                    />
                </TouchableOpacity>

                <View style={styles.sep} />

                {/* Scheduled */}
                <TouchableOpacity
                    style={styles.scheduleOption}
                    onPress={() => setShowSlotModal(true)}
                >
                    <View style={[styles.optionIconBox, {}]}>
                        <Feather name="clock" size={wp('4.5%')} color="#F25000" />
                    </View>
                    <View style={styles.optionText}>
                        <Text style={[styles.optionTitle, selectedDeliveryType === 'slot' && { color: '#F25000' }]}>Schedule delivery</Text>
                        {selectedDeliveryType === 'slot' && (
                            <Text style={styles.optionSub}>{chosenSlot ? `${chosenSlot.dateDisplay} | ${chosenSlot.slotDisplay}` : 'Select Slot'}</Text>
                        )}
                    </View>
                    <Ionicons
                        name={selectedDeliveryType === 'slot' ? "radio-button-on" : "radio-button-off"}
                        size={wp('4.5%')}
                        color={selectedDeliveryType === 'slot' ? "#F25000" : "#CCCCCC"}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderPaymentMethods = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.scheduleCard}>
                {paymentModes.map((mode, index) => {
                    const isSelected = paymentMethod === mode.paymentModeName;
                    const isCOD = mode.paymentModeName?.toUpperCase() === 'COD';
                    return (
                        <View key={mode.paymentModeId}>
                            <TouchableOpacity
                                style={styles.scheduleOption}
                                onPress={() => setPaymentMethod(mode.paymentModeName)}
                            >
                                <View style={styles.optionIconBox}>
                                    <MaterialCommunityIcons
                                        name={isCOD ? "cash" : "cellphone-check"}
                                        size={wp('4.5%')}
                                        color="#F25000"
                                    />
                                </View>
                                <View style={styles.optionText}>
                                    <Text style={[styles.optionTitle, isSelected && { color: '#F25000' }]}>
                                        {mode.paymentModeName}
                                    </Text>
                                </View>
                                <Ionicons
                                    name={isSelected ? "radio-button-on" : "radio-button-off"}
                                    size={wp('4.5%')}
                                    color={isSelected ? "#F25000" : "#CCCCCC"}
                                />
                            </TouchableOpacity>
                            {index < paymentModes.length - 1 && <View style={styles.sep} />}
                        </View>
                    );
                })}
            </View>
        </View>
    );

    const renderBottomBar = () => {
        return (
            <View style={styles.footer}>
                <View style={styles.priceContainer}>
                    <Text style={styles.payUsingLabel}>TOTAL TO PAY</Text>
                    <Text style={styles.totalPriceText}>₹{billCalculations.toPay?.toFixed(2)}</Text>
                </View>

                <TouchableOpacity activeOpacity={0.9} style={styles.payBtn} onPress={handleConfirmOrder}>
                    <Text style={styles.payBtnPrice}>Place Order</Text>
                    <AntDesign name="caretright" size={wp('3.5%')} color="#FFF" style={{ marginLeft: wp('2%') }} />
                </TouchableOpacity>
            </View>
        );
    };

    if (isStoreUnavailable) {
        return <SafeAreaView style={styles.mainContainer} edges={['top']}><StoreUnavailable data={storeUnavailableData} /></SafeAreaView>;
    }

    if (cartItems.length === 0) {
        return <SafeAreaView style={styles.mainContainer} edges={['top']}><CartEmptyComponent /></SafeAreaView>;
    }

    return (
        <SafeAreaView edges={['top']} style={styles.mainContainer}>
            {renderHeader()}
            <View style={styles.dashedHeader} />
            {renderAddressBar()}

            <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: hp('15%') }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Banner */}
                {billCalculations.deliveryCharge === 0 && (
                    <View style={styles.bannerBox}>
                        <Image style={styles.bannerImg} source={require('../assets/images/cart-banner.png')} />
                    </View>
                )}

                {/* Action Row */}
                <View style={styles.actionRow}>
                    <TouchableOpacity onPress={() => setIsClearCartModalVisible(true)}>
                        <Text style={styles.clearText}>Clear Cart</Text>
                    </TouchableOpacity>
                </View>

                {/* Items */}
                <View style={styles.productList}>
                    {cartItems.map((item, idx) => <CartProductCard key={idx} item={item} />)}
                </View>

                {/* Summary Row */}
                <View style={styles.summaryRow}>
                    <Text style={styles.itemCountText}>{cartItems.length} items</Text>
                    <View style={styles.tokenSumBadge}>
                        <Image source={require('../assets/images/btoken-icon.png')} style={{ width: wp('4%'), height: wp('4%') }} />
                        <Text style={styles.tokenSumText}>{totalCartBTokens} B Token</Text>
                    </View>
                </View>

                {/* Save Money Section */}
                {renderSaveMoney()}

                {/* Schedule Section */}
                {renderSchedule()}

                {/* Payment Section */}
                {renderPaymentMethods()}

                {/* Bill Section */}
                <BillSection billCalculations={billCalculations} />

            </ScrollView>

            {renderBottomBar()}

            {/* Modals */}
            <StatusModal
                visible={statusModalVisible}
                onClose={() => setStatusModalVisible(false)}
                type={statusType}
                title={statusTitle}
                message={statusMessage}
            />
            <AddressModal
                visible={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                addresses={addresses}
                onSelectAddress={onSelectAddress}
                onThreeDotsClicked={onThreeDotsClicked}
                onDeleteClicked={onDeleteClicked}
                onCloseThreeDots={onCloseThreeDots}
                navigation={navigation}
            />
            <DeliverySlotModal
                visible={showSlotModal}
                onClose={() => setShowSlotModal(false)}
                onSelectSlot={(slot) => {
                    setChosenSlot(slot);
                    setSelectedDeliveryType('slot');
                }}
                pincodeAreaId={selectedAddress?.pincodeAreaId}
            />
            <CouponModal
                visible={showCouponModal}
                onClose={() => setShowCouponModal(false)}
                isGiftCard={isGiftCard}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                onApply={handleApplyCoupon}
                availableCoupons={availableCoupons}
                availableGiftCards={availableGiftCards}
                onCouponClick={handleCouponClick}
            />
            <ConfirmationModal
                visible={isClearCartModalVisible}
                onClose={() => setIsClearCartModalVisible(false)}
                onConfirm={() => { clearCart(); setIsClearCartModalVisible(false); }}
                title="Clear Cart"
                message="Are you sure you want to remove all items?"
            />
        </SafeAreaView>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('1.5%'),
    },
    backBtn: {
        padding: wp('1%'),
    },
    headerTitle: {
        flex: 1,
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.5%'),
        color: '#000',
        marginLeft: wp('3%'),
    },
    lightningBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        paddingHorizontal: wp('2.5%'),
        paddingVertical: hp('0.5%'),
        borderRadius: 20,
    },
    lightningIcon: {
        width: wp('4%'),
        height: wp('4%'),
        resizeMode: 'contain',
    },
    deliveryTime: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('3.2%'),
        color: '#000',
        marginLeft: wp('1.5%'),
    },
    dashedHeader: {
        borderWidth: 0.5,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
        marginHorizontal: wp('5%'),
    },
    addressBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('1.5%'),
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 10,
        borderBottomColor: '#F9F9F9',
    },
    addressLine: {
        flex: 1,
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3.2%'),
        color: '#757575',
        marginHorizontal: wp('2%'),
    },
    bannerBox: {
        width: wp('90%'),
        height: hp('10%'),
        alignSelf: 'center',
        marginTop: hp('2%'),
        borderRadius: 15,
        overflow: 'hidden',
    },
    bannerImg: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    actionRow: {
        alignItems: 'flex-end',
        paddingHorizontal: wp('5%'),
        marginTop: hp('1.5%'),
    },
    clearText: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('3%'),
        color: '#F25000',
        textDecorationLine: 'underline',
    },
    productList: {
        paddingHorizontal: wp('5%'),
        marginTop: hp('1%'),
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp('5%'),
        marginTop: hp('1%'),
    },
    itemCountText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#757575',
    },
    tokenSumBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('1%'),
    },
    tokenSumText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#7E57C2',
    },
    section: {
        marginTop: hp('0.5%'),
        paddingHorizontal: wp('5%'),
        borderBottomWidth: 8,
        borderBottomColor: '#F9F9F9',
        paddingBottom: hp('2.5%'),
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: hp('1.5%'),
        // gap: wp('0.5%'),
    },
    sectionTitle: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%'),
        color: '#000',
        paddingEnd: 10,
        marginBottom: hp('1%'),
    },
    offerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: wp('3%'),
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    offerIconBox: {
        width: wp('10%'),
        height: wp('10%'),
        borderRadius: wp('5%'),
        backgroundColor: '#FFF5F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bcoinInnerCircle: {
        width: wp('5%'),
        height: wp('5%'),
        borderRadius: wp('2.5%'),
        backgroundColor: '#F25000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    offerDetails: {
        flex: 1,
        marginLeft: wp('3%'),
        // flexDirection: 'row',
        // justifyContent: 'space-between',
    },
    offerName: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.5%'),
        color: '#000',
    },
    offerSub: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3.2%'),
        color: '#F25000',
        marginTop: hp('0.5%'),
    },
    offerLink: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('3.2%'),
        color: '#F25000',
        marginTop: hp('0.2%'),
    },
    removeOfferBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 20,
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('0.5%'),
        alignSelf: 'center',
        marginLeft: wp('4%'),
    },
    removeOfferText: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('3%'),
        color: '#FF4D4D',
        marginRight: wp('1%'),
    },
    applyBtn: {
        paddingHorizontal: wp('3%'),
    },
    applyBtnText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.2%'),
        color: '#757575',
    },
    appliedStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkmarkCircle: {
        width: wp('4.5%'),
        height: wp('4.5%'),
        borderRadius: wp('2.25%'),
        backgroundColor: '#0CA201',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('1.5%'),
    },
    appliedText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.2%'),
        color: '#0CA201',
    },
    scheduleCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    scheduleOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: wp('2%'),
    },
    optionIconBox: {
        width: wp('7%'),
        height: wp('7%'),
        borderRadius: wp('3.5%'),
        backgroundColor: '#FFF5F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionText: {
        flex: 1,
        marginLeft: wp('3%'),
    },
    optionTitle: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#000',
    },
    optionSub: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3%'),
        color: '#F25000',
    },
    sep: {
        height: 1,
        backgroundColor: '#F5F5F5',
        marginHorizontal: wp('4%'),
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        width: wp('100%'),
        backgroundColor: '#FFFFFF',
        paddingHorizontal: wp('5%'),
        paddingBottom: hp('3%'),
        paddingTop: hp('1%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
    },
    payUsingLabel: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('2.2%'),
        color: '#9E9E9E',
    },
    priceContainer: {
        flex: 1,
    },
    totalPriceText: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4.5%'),
        color: '#000',
    },
    payBtn: {
        backgroundColor: '#F25000',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp('8%'),
        paddingVertical: hp('1.5%'),
        borderRadius: 15,
        marginLeft: wp('5%'),
        shadowColor: '#F25000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 6,
    },
    payBtnPrice: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4.5%'),
        color: '#FFF',
    },
    paymentPicker: {
        position: 'absolute',
        bottom: hp('10%'),
        left: wp('5%'),
        right: wp('5%'),
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: wp('4%'),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    pickerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp('1.5%'),
        borderBottomWidth: 0.5,
        borderBottomColor: '#EEE',
        gap: wp('3%'),
    },
    pickerText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.8%'),
        color: '#000',
    }
});
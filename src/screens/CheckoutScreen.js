import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform, Alert } from 'react-native';
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
import { createOrderApi, confirmCodApi } from '../api/orderService';
import { getPaymentModesApi } from '../api/configService';
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
        preloadedCartSummary
    } = route.params || {};

    const {
        cartSummary,
        cartItems,
        clearCart,
        getCartSummary,
        error: cartError,
        addresses
    } = useContext(CartContext);
    const { showLoader } = useContext(LoaderContext);

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
    const [showBill, setShowBill] = useState(true);
    const [showSlotModal, setShowSlotModal] = useState(false);
    const [chosenSlot, setChosenSlot] = useState(null);

    // Get currently selected address from global context
    const currentSelectedAddress = addresses.find(a => a.selected) || selectedAddress;

    // Unified checkout initialization and dependency refresh
    useEffect(() => {
        const currentPincodeAreaId = pincodeAreaId || currentSelectedAddress?.pincodeAreaId;

        // Refresh summary whenever key dependencies change
        if (currentPincodeAreaId) {
            const apiDeliveryMode = deliveryType === 'slot' ? 'slotted' : 'express';
            console.log('🔄 [CHECKOUT] Syncing summary for area:', currentPincodeAreaId, 'Mode:', apiDeliveryMode);
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
                if (response?.success && response?.data) {
                    setPaymentModes(response.data);
                    const codMode = response.data.find(m => m.paymentModeName?.toUpperCase() === 'COD');
                    if (codMode) {
                        setPaymentMethod(codMode.paymentModeName);
                    } else if (response.data.length > 0) {
                        setPaymentMethod(response.data[0].paymentModeName);
                    }
                }
            } catch (error) {
                console.error('Error fetching payment modes:', error);
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

        try {
            showLoader(true);

            const createPayload = {
                cartId: cartSummary?.cartId || cartItems?.[0]?.cartId,
                shippingAddressId: currentSelectedAddress?.id || selectedAddress?.id,
                billingAddressId: currentSelectedAddress?.id || selectedAddress?.id,
                paymentMethod: paymentMethod, // Dynamically selected
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

            console.log('📦 [CHECKOUT] Creating Order Payload:', JSON.stringify(createPayload, null, 2));
            const createResponse = await createOrderApi(createPayload);
            console.log('📦 [CHECKOUT] Create Response:', JSON.stringify(createResponse, null, 2));

            if (createResponse?.success && createResponse?.data?.orderId) {
                const orderId = createResponse.data.orderId;

                // Confirm COD
                const confirmResponse = await confirmCodApi(orderId);
                console.log('📦 [CHECKOUT] Confirm COD Response:', JSON.stringify(confirmResponse, null, 2));

                if (confirmResponse?.success) {
                    await clearCart(); // Local clear
                    navigation.navigate('OrderSuccessScreen', {
                        orderId: createResponse.data.orderId,
                        orderNumber: createResponse.data.orderNumber || createResponse.data.orderId,
                        paymentMethod: paymentMethod,
                        totalItems: cartItems?.length || 0,
                        totalAmount: billCalculations?.toPay || 0,
                        deliveryMode: deliveryType === 'slot' ? 'slotted' : 'express',
                        deliverySlot: chosenSlot ? `${chosenSlot.dateDisplay} | ${chosenSlot.slotDisplay}` : null,
                        address: currentSelectedAddress?.address || selectedAddress?.address || '',
                    });
                } else {
                    setStatusType('error');
                    setStatusTitle('Error');
                    setStatusMessage(confirmResponse?.message || 'Failed to confirm COD order');
                    setStatusModalVisible(true);
                }
            } else {
                setStatusType('error');
                setStatusTitle('Error');
                setStatusMessage(createResponse?.message || 'Failed to create order');
                setStatusModalVisible(true);
            }
        } catch (error) {
            console.error('📦 [CHECKOUT] Order Error:', error);
            setStatusType('error');
            setStatusTitle('Error');
            setStatusMessage('An unexpected error occurred during checkout');
            setStatusModalVisible(true);
        } finally {
            showLoader(false);
        }
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

            <ScrollView contentContainerStyle={styles.scrollContent}>
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
                    <View style={[styles.card, { flexDirection: 'row', alignItems: 'flex-start' }]}>
                        {(() => {
                            const type = currentSelectedAddress?.type?.toLowerCase() || '';
                            if (type === 'home') {
                                return <Entypo name="home" size={wp('6%')} color="#F25000" style={{ marginRight: wp('3%'), marginTop: hp('0.5%') }} />;
                            } else if (type === 'office') {
                                return <MaterialCommunityIcons name="briefcase" size={wp('6%')} color="#F25000" style={{ marginRight: wp('3%'), marginTop: hp('0.5%') }} />;
                            } else {
                                return <Entypo name="location-pin" size={wp('6%')} color="#F25000" style={{ marginRight: wp('3%'), marginTop: hp('0.5%') }} />;
                            }
                        })()}
                        <View style={{ flex: 1 }}>
                            <Text style={styles.addressType}>{currentSelectedAddress?.type || 'Home'}</Text>
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
                                style={{ alignSelf: 'flex-end', marginBottom: hp('0.5%') }}
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

                {showBill && !cartError && (
                    <View style={styles.billContainer}>
                        <BillSection billCalculations={billCalculations} />
                    </View>
                )}
            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => setShowBill(!showBill)} style={styles.bottomAmountContainer}>
                    <Text style={styles.totalLabel}>Total Payable</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.totalAmount}>₹{billCalculations.toPay?.toFixed(2) || '0.00'}</Text>
                        <Image
                            style={[styles.arrowIcon, showBill && { transform: [{ rotate: '180deg' }] }]}
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
                pincodeAreaId={pincodeAreaId || currentSelectedAddress?.pincodeAreaId || 105}
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
        marginTop: hp('2%'),
        paddingHorizontal: wp('4.65%')
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('1%')
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
        padding: wp('4%'),
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
        marginBottom: hp('0.5%')
    },
    addressDivider: {
        height: 1,
        backgroundColor: '#EEEEEE',
        marginVertical: hp('0.8%')
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
        marginTop: hp('1%')
    },
    radioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp('1.2%'),
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
        marginTop: hp('0.2%'),
    },
    radioDivider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: hp('0.5%'),
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
        marginLeft: wp('2%'),
        transform: [{ rotate: '0deg' }]
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

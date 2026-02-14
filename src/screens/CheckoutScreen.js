import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LoaderContext } from '../context/loaderContext';
import { CartContext } from '../context/CartContext';
import { createOrderApi, confirmCodApi } from '../api/orderService';
import { getPaymentModesApi } from '../api/configService';
import BillSection from '../components/BillSection';
import StatusModal from '../components/StatusModal';
import LinearGradient from 'react-native-linear-gradient';

const CheckoutScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {
        selectedAddress,
        selectedDeliveryType,
        selectedSlot,
        selectedDate,
        pincodeAreaId
    } = route.params || {};

    const { cartSummary, cartItems, clearCart, getCartSummary } = useContext(CartContext);
    const { showLoader } = useContext(LoaderContext);

    // Modal state
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [statusType, setStatusType] = useState('success');
    const [statusTitle, setStatusTitle] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [onModalClose, setOnModalClose] = useState(null);

    // Delivery & Payment selection
    const [deliveryType, setDeliveryType] = useState(selectedDeliveryType || 'express');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [paymentModes, setPaymentModes] = useState([]);

    // Sync cart summary when address changes (different area)
    useEffect(() => {
        if (selectedAddress?.pincodeAreaId) {
            console.log('🔄 [CHECKOUT] Address changed, refreshing summary for area:', selectedAddress.pincodeAreaId);
            getCartSummary(deliveryType, selectedSlot, null, selectedAddress.pincodeAreaId);
        }
    }, [selectedAddress?.id]);

    useEffect(() => {
        const fetchPaymentModes = async () => {
            try {
                const response = await getPaymentModesApi();
                if (response?.success && response?.data) {
                    setPaymentModes(response.data);
                    // Default to first available if cod not found
                    if (!response.data.find(m => m.code === 'cod')) {
                        setPaymentMethod(response.data[0]?.code);
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
                shippingAddressId: selectedAddress.id,
                billingAddressId: selectedAddress.id,
                paymentMethod: paymentMethod, // Dynamically selected
                ifMatchCartVersion: cartSummary?.cartVersion,
                deliverySlotDate: deliveryType === 'slot' ? selectedDate : new Date().toISOString().split('T')[0],
                deliverySlotTime: deliveryType === 'slot' ? selectedSlot : "Express",
                deliveryMode: deliveryType === 'slot' ? "slotted" : "express",
                orderPlacedFromDevice: "app",
                pincodeAreaId: pincodeAreaId || 105
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
                    navigation.navigate('OrderSuccessScreen', { orderId });
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
                    <View style={styles.card}>
                        <Text style={styles.addressType}>{selectedAddress?.type || 'Home'}</Text>
                        <Text style={styles.addressText}>{selectedAddress?.address || 'No address selected'}</Text>
                        <Text style={styles.phoneText}>Phone: {selectedAddress?.phone || 'N/A'}</Text>
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
                            onPress={() => setDeliveryType('slot')}
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
                                    {selectedDate && selectedSlot ? `${selectedDate} | ${selectedSlot}` : 'Choose a delivery slot'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Payment Method Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="credit-card-outline" size={wp('6%')} color="#F25000" />
                        <Text style={styles.sectionTitle}>Payment Method</Text>
                    </View>
                    <View style={styles.card}>
                        {paymentModes.map((mode, index) => (
                            <React.Fragment key={mode.code}>
                                <TouchableOpacity
                                    style={styles.radioRow}
                                    onPress={() => setPaymentMethod(mode.code)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={paymentMethod === mode.code ? 'radio-button-on' : 'radio-button-off'}
                                        size={wp('5.5%')}
                                        color={paymentMethod === mode.code ? '#F25000' : '#CCCCCC'}
                                    />
                                    <View style={styles.radioContent}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <MaterialCommunityIcons
                                                name={mode.code === 'cod' ? "cash" : mode.code === 'online' ? "cellphone" : "credit-card"}
                                                size={wp('5.5%')}
                                                color={mode.code === 'cod' ? "#0CA201" : mode.code === 'online' ? "#1A73E8" : "#777777"}
                                            />
                                            <Text style={[styles.radioTitle, { marginLeft: wp('2%') }, paymentMethod === mode.code && { color: '#F25000' }]}>
                                                {mode.name}
                                            </Text>
                                        </View>
                                        <Text style={styles.radioSubtitle}>
                                            {mode.code === 'cod' ? "Pay when you receive" : mode.code === 'online' ? "UPI, Cards, Net Banking" : mode.description || ""}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                {index < paymentModes.length - 1 && <View style={styles.radioDivider} />}
                            </React.Fragment>
                        ))}
                        {paymentModes.length === 0 && (
                            <Text style={styles.radioSubtitle}>Loading payment methods...</Text>
                        )}
                    </View>
                </View>

                {/* Bill Section */}
                <View style={styles.billContainer}>
                    <BillSection billCalculations={{
                        mrpTotal: cartSummary?.subTotal + (cartSummary?.productDiscount || 0),
                        itemTotal: cartSummary?.subTotal || 0,
                        savings: cartSummary?.productDiscount || 0,
                        deliveryCharge: cartSummary?.deliveryAmount || 0,
                        couponDiscount: cartSummary?.couponAmount || 0,
                        giftCardAmount: cartSummary?.giftCardAmount || 0,
                        bcoinsAppliedValue: cartSummary?.bcoinsAppliedValue || 0,
                        totalTax: cartSummary?.totalTax || 0,
                        totalBtokens: cartSummary?.totalBtokens || 0,
                        totalSavings: cartSummary?.totalDiscount || 0,
                        toPay: cartSummary?.grandTotal || 0
                    }} />
                </View>
            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <View>
                    <Text style={styles.totalLabel}>Total Payable</Text>
                    <Text style={styles.totalAmount}>₹{cartSummary?.grandTotal?.toFixed(2) || '0.00'}</Text>
                </View>
                <LinearGradient style={styles.confirmButtonGradient} colors={['#F25000', '#FF7B3A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <TouchableOpacity onPress={handleConfirmOrder} style={styles.confirmButton}>
                        <Text style={styles.confirmButtonText}>Confirm Order</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>

            <StatusModal
                visible={statusModalVisible}
                onClose={handleModalClose}
                type={statusType}
                title={statusTitle}
                message={statusMessage}
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
        marginTop: hp('3%'),
        paddingHorizontal: wp('4.65%'),
        backgroundColor: '#FFFFFF',
        paddingVertical: hp('2%')
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
    }
});

import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FONTS } from '../styles/typography'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { getOrderDetailsApi } from '../api/orderService'

const OrderSuccessScreen = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const {
        orderId,
        orderNumber,
        paymentMethod,
        totalItems,
        totalAmount,
        deliveryMode,
        deliverySlot,
        address,
    } = route.params || {}

    const [orderDetails, setOrderDetails] = useState(null)

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails()
        }

        // 1. Prevent Android hardware back button
        const backAction = () => {
            return true; // Return true to prevent default back action
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        // 2. Prevent navigation remove (iOS swipe, back button)
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            const action = e.data.action;

            // If the removal was triggered by a reset or replace action, allow it
            if (action.type === 'RESET' || action.type === 'REPLACE') {
                return;
            }

            // Otherwise, prevent default behavior of leaving the screen (back button, swipe)
            e.preventDefault();
        });

        return () => {
            backHandler.remove();
            unsubscribe();
        };
    }, [orderId, navigation])

    const fetchOrderDetails = async () => {
        try {
            const response = await getOrderDetailsApi(orderId)
            console.log('📦 [ORDER SUCCESS] Details:', JSON.stringify(response, null, 2))
            if (response?.success && response?.data) {
                setOrderDetails(response.data)
            }
        } catch (error) {
            console.error('Error fetching order details:', error)
        }
    }

    const displayOrderNumber = orderDetails?.orderNumber || orderNumber || orderId || '--'
    const displayPayment = orderDetails?.paymentMethod || paymentMethod || 'COD'
    const displayItems = orderDetails?.totalItems || orderDetails?.items?.length || totalItems || 0
    const displayTotal = orderDetails?.grandTotal || orderDetails?.totalAmount || totalAmount || 0
    const displayDeliveryMode = orderDetails?.deliveryMode || deliveryMode || 'express'
    const displayDeliverySlot = deliverySlot || (orderDetails?.deliverySlotDate ? `${orderDetails.deliverySlotDate} | ${orderDetails.deliverySlotTime}` : null)
    const displayAddress = address || orderDetails?.shippingAddress || ''

    const getPaymentLabel = (method) => {
        if (!method) return 'Cash On Delivery'
        const m = method.toUpperCase()
        if (m === 'COD') return 'Cash On Delivery'
        if (m === 'ONLINE' || m === 'UPI') return 'Online Payment'
        return method
    }

    const handleTrackOrder = () => {
        navigation.navigate('OrderTrackingScreen', {
            orderId: orderId || orderDetails?._id
        });
    }

    const handleBackToHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
            })
        )
    }

    const handleContinueShopping = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
            })
        )
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="#DFFFD9" />
            <LinearGradient
                colors={['#DFFFD9', '#F0FFF0', '#FFFFFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.6 }}
                style={styles.gradientContainer}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Success Animation Area */}
                    <View style={styles.successSection}>
                        <Image style={styles.successImage} source={require('../assets/images/success-two.png')} />
                        <View style={styles.thankYouContainer}>
                            <Text style={styles.thankYouText}>Thank You!</Text>
                            <Text style={styles.thankYouTextTwo}>Your order has been placed successfully</Text>
                        </View>
                    </View>

                    {/* Order Details Card */}
                    <View style={styles.orderCard}>
                        <View style={styles.orderCardHeader}>
                            <MaterialCommunityIcons name="receipt" size={wp('5%')} color="#F25000" />
                            <Text style={styles.orderCardTitle}>Order Summary</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Order ID</Text>
                            <Text style={styles.detailValue}>#{displayOrderNumber}</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Payment</Text>
                            <View style={styles.detailBadge}>
                                <MaterialCommunityIcons
                                    name={displayPayment?.toUpperCase() === 'COD' ? 'cash' : 'cellphone'}
                                    size={wp('3.5%')}
                                    color={displayPayment?.toUpperCase() === 'COD' ? '#0CA201' : '#1A73E8'}
                                />
                                <Text style={styles.detailBadgeText}>{getPaymentLabel(displayPayment)}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Total Items</Text>
                            <Text style={styles.detailValue}>{displayItems} item{displayItems !== 1 ? 's' : ''}</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Delivery</Text>
                            <View style={styles.deliveryBadge}>
                                <Ionicons
                                    name={displayDeliveryMode === 'express' ? 'flash' : 'time-outline'}
                                    size={wp('3.5%')}
                                    color="#F25000"
                                />
                                <Text style={styles.deliveryBadgeText}>
                                    {displayDeliveryMode === 'express' ? 'Express (20-30 min)' : 'Slotted'}
                                </Text>
                            </View>
                        </View>

                        {displayDeliverySlot && (
                            <>
                                <View style={styles.divider} />
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Slot</Text>
                                    <Text style={styles.detailValueSmall}>{displayDeliverySlot}</Text>
                                </View>
                            </>
                        )}

                        {displayAddress ? (
                            <>
                                <View style={styles.divider} />
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Delivering to</Text>
                                    <Text style={styles.detailValueSmall} numberOfLines={2}>{displayAddress}</Text>
                                </View>
                            </>
                        ) : null}

                        {/* Total Amount */}
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total Amount</Text>
                            <Text style={styles.totalAmount}>₹{Number(displayTotal).toFixed(2)}</Text>
                        </View>
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={styles.trackButton}
                            onPress={handleTrackOrder}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="location-outline" size={wp('5%')} color="#F25000" />
                            <Text style={styles.trackButtonText}>Track Order</Text>
                        </TouchableOpacity>

                        <LinearGradient
                            colors={['#F25000', '#FF7B3A']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.homeButtonGradient}
                        >
                            <TouchableOpacity
                                style={styles.homeButton}
                                onPress={handleBackToHome}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="home-outline" size={wp('5%')} color="#FFFFFF" />
                                <Text style={styles.homeButtonText}>Back to Home</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>

                    {/* <TouchableOpacity
                        style={styles.continueShoppingBtn}
                        onPress={handleContinueShopping}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.continueShoppingText}>Continue Shopping</Text>
                        <Ionicons name="arrow-forward" size={wp('4%')} color="#F25000" />
                    </TouchableOpacity> */}
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    )
}

export default OrderSuccessScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#DFFFD9',
    },
    gradientContainer: {
        flex: 1,
        // paddingHorizontal: wp('5%'),
    },
    scrollContent: {
        paddingBottom: hp('5%'),
        paddingHorizontal: wp('5%'),
        // backgroundColor: 'red'
    },
    successSection: {
        alignItems: 'center',
        marginTop: hp('6%'),
        // backgroundColor: 'red'
    },
    successImage: {
        width: wp('30%'),
        height: wp('30%'),
        resizeMode: 'contain',
    },
    thankYouContainer: {
        alignItems: 'center',
        marginTop: hp('1%'),
    },
    thankYouText: {
        color: '#0CA201',
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('6%'),
    },
    thankYouTextTwo: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3.5%'),
        color: '#616161',
        marginTop: hp('0.3%'),
    },
    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: wp('5%'),
        marginTop: hp('3%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    orderCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('1.5%'),
    },
    orderCardTitle: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%'),
        color: '#000000',
        marginLeft: wp('2%'),
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: hp('1%'),
    },
    detailLabel: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3.5%'),
        color: '#999999',
    },
    detailValue: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#333333',
    },
    detailValueSmall: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3.2%'),
        color: '#333333',
        maxWidth: wp('55%'),
        textAlign: 'right',
    },
    detailBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FFF0',
        paddingHorizontal: wp('2.5%'),
        paddingVertical: hp('0.4%'),
        borderRadius: 20,
    },
    detailBadgeText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3%'),
        color: '#333333',
        marginLeft: wp('1%'),
    },
    deliveryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5F0',
        paddingHorizontal: wp('2.5%'),
        paddingVertical: hp('0.4%'),
        borderRadius: 20,
    },
    deliveryBadgeText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3%'),
        color: '#F25000',
        marginLeft: wp('1%'),
    },
    divider: {
        height: 1,
        backgroundColor: '#F5F5F5',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp('1.5%'),
        paddingTop: hp('1.5%'),
        borderTopWidth: 1.5,
        borderTopColor: '#F0F0F0',
    },
    totalLabel: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%'),
        color: '#000000',
    },
    totalAmount: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('5.5%'),
        color: '#0CA201',
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginTop: hp('3%'),
        justifyContent: 'space-between',
    },
    trackButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: hp('6%'),
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#F25000',
        marginRight: wp('2%'),
    },
    trackButtonText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%'),
        color: '#F25000',
        marginLeft: wp('1.5%'),
    },
    homeButtonGradient: {
        flex: 1,
        borderRadius: 12,
        marginLeft: wp('2%'),
    },
    homeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: hp('6%'),
    },
    homeButtonText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%'),
        color: '#FFFFFF',
        marginLeft: wp('1.5%'),
    },
    continueShoppingBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp('2%'),
        paddingVertical: hp('1%'),
    },
    continueShoppingText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#F25000',
        marginRight: wp('1%'),
    },
})
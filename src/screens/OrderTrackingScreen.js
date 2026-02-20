import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform, FlatList, ImageBackground, Linking } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import React, { useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'
import { useNavigation, useRoute } from '@react-navigation/native'
import OrderProductCard from '../components/OrderProductCard'
import ConfirmationModal from '../components/ConfirmationModal'
import ReturnItemModal from '../components/ReturnItemModal'
import { useOrderDetails } from '../hooks/useOrderDetails'
import { useOrderTracking } from '../hooks/useOrderTracking'
import AppButton from '../components/AppButton'
import CustomLoader from '../components/CustomLoader'
import CONFIG from '../globals/config'

const OrderTrackingScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { orderId, order: initialOrderData } = route.params || {};

    const {
        loading,
        orderStatus,
        showCancelModal,
        setShowCancelModal,
        showReturnModal,
        setShowReturnModal,
        selectedReturnItem,
        setSelectedReturnItem,

        // Data
        effectiveOrderStatus,
        storeName,
        shippingAddress,
        fullAddress,
        cityStateZip,
        paymentMethod,
        grandTotal,
        displayOrderId,
        orderDate,
        orderItems,
        itemCount,
        deliveryAgentName,
        deliveryAgentPhone,

        // Actions
        handleCancelOrder,
        handleReturnItem,
        refreshOrder,

        // Enhanced Data
        formattedOrderDate,
        bill,
        invoiceUrl
    } = useOrderDetails(orderId, initialOrderData);

    const insets = useSafeAreaInsets();
    const [returnReason, setReturnReason] = useState('');
    const [showBillBreakdown, setShowBillBreakdown] = useState(false);

    // SignalR Real-time Tracking
    useOrderTracking(
        orderId,
        (statusUpdate) => {
            console.log('🔄 [UI] Refreshing order details due to SignalR update');
            refreshOrder?.(true);
        },
        (locationUpdate) => {
            console.log('📍 [UI] Driver location updated:', locationUpdate);
            // Future step: update map markers if applicable
        }
    );

    const renderOrderItem = ({ item }) => (
        <OrderProductCard
            item={item}
            orderStatus={effectiveOrderStatus}
            onReturn={(selectedItem) => {
                setSelectedReturnItem(selectedItem || item);
                setShowReturnModal(true);
            }}
        />
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'placed': return '#F2994A'; // Orange
            case 'confirmed': return '#2D9CDB'; // Blue
            case 'shipped': return '#9B51E0'; // Purple
            case 'delivered': return '#27AE60'; // Green
            case 'cancelled': return '#EB5757'; // Red
            case 'returned': return '#6F727A'; // Gray
            default: return '#000000';
        }
    };

    const BillRow = ({ label, value, isGreen }) => (
        <View style={styles.billBreakdownRow}>
            <Text style={styles.billBreakdownLabel}>{label}</Text>
            <Text style={[styles.billBreakdownValue, isGreen && { color: '#0CA201' }]}>
                {value}
            </Text>
        </View>
    );

    return (
        <SafeAreaView edges={['top']} style={[styles.mainContainer, { paddingBottom: insets.bottom }]}>
            <CustomLoader visible={loading} text="Updating Order..." />

            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name={'left'} size={wp('5%')} color={'#000000'} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Order Tracking</Text>
                <View style={styles.headerInnerView}>
                    <TouchableOpacity style={styles.helpContainer}>
                        <Image style={styles.headPhoneImage} source={require('../assets/images/head_phone.png')} />
                        <Text style={styles.helpText}>Help</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('CartScreen')}>
                        <Image style={styles.homeIcon} source={require('../assets/images/home_two.png')} />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView>
                <View style={{
                    alignItems: 'center',
                    paddingTop: hp('2%')
                }}>
                    {orderStatus === 'placed' && (
                        <Image style={{
                            width: wp('72%'),
                            height: hp('3%'),
                            resizeMode: 'contain',
                        }} source={require('../assets/images/order_placed.png')} />
                    )}
                    {orderStatus === 'accepted' && (
                        <Image style={{
                            width: wp('72%'),
                            height: hp('3%'),
                            resizeMode: 'contain',
                        }} source={require('../assets/images/order_placed.png')} />
                    )}
                    {orderStatus === 'packed' && (
                        <Image style={{
                            width: wp('72%'),
                            height: hp('3%'),
                            resizeMode: 'contain',
                        }} source={require('../assets/images/order_packed.png')} />
                    )}
                    {orderStatus === 'assigned' && (
                        <Image style={{
                            width: wp('72%'),
                            height: hp('3%'),
                            resizeMode: 'contain',
                        }} source={require('../assets/images/assigned.png')} />
                    )}
                    {orderStatus === 'dispatched' && (
                        <Image style={{
                            width: wp('72%'),
                            height: hp('3%'),
                            resizeMode: 'contain',
                        }} source={require('../assets/images/dispatched.png')} />
                    )}
                    {orderStatus === 'delivered' && (
                        <Image style={{
                            width: wp('72%'),
                            height: hp('3%'),
                            resizeMode: 'contain',
                        }} source={require('../assets/images/delivered.png')} />
                    )}
                    {orderStatus === 'cancelled' && (
                        <View style={{
                            width: wp('72%'),
                            height: hp('3%'),
                            backgroundColor: '#EB5757',
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                color: '#FFFFFF',
                                fontFamily: FONTS.poppins.bold,
                                fontSize: wp('3.5%')
                            }}>ORDER CANCELLED</Text>
                        </View>
                    )}
                    <View style={styles.statusContainer}>
                        <View style={styles.statusView}>
                            <View style={Platform.OS === 'android' ?
                                [styles.statusNumberView, { backgroundColor: '#0CA201' }, { bottom: hp('0.15%') }] :
                                [styles.statusNumberView, { backgroundColor: '#0CA201' }]
                            }>
                                <Text style={styles.statusNumberText}>1</Text>
                            </View>
                            <Text style={[styles.statusNameText, {
                                color: '#0CA201'
                            }]}>Order placed</Text>
                        </View>
                        <View style={[styles.statusView, { left: wp('-2%') }]}>
                            <View style={Platform.OS === 'android' ?
                                [styles.statusNumberView, { bottom: hp('0.15%') }] :
                                styles.statusNumberView
                            }>
                                <Text style={styles.statusNumberText}>2</Text>
                            </View>
                            <Text style={styles.statusNameText}>Out for delivery</Text>
                        </View>
                        <View style={styles.statusView}>
                            <View style={Platform.OS === 'android' ?
                                [styles.statusNumberView, { bottom: hp('0.15%') }] :
                                styles.statusNumberView
                            }>
                                <Text style={styles.statusNumberText}>3</Text>
                            </View>
                            <Text style={styles.statusNameText}>Delivered</Text>
                        </View>
                    </View>
                    {orderStatus === 'placed' && (<ImageBackground style={styles.placedImageStyle} resizeMode="contain"
                        source={require('../assets/images/tracking_image_placed.png')}
                    >
                        <View style={styles.wrapper}>
                            <LinearGradient
                                colors={[
                                    'rgba(255,255,255,0)',
                                    '#FFFFFF',
                                    '#FFFFFF',
                                ]}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                                style={styles.gradient}
                            >
                                <View style={styles.orderPlacedView}>
                                    <View style={styles.statusView}>
                                        <View style={Platform.OS === 'android' ?
                                            [styles.statusNumberView, { backgroundColor: '#0CA201' }, { bottom: hp('0.15%') }] :
                                            [styles.statusNumberView, { backgroundColor: '#0CA201' }]
                                        }>
                                            <Text style={styles.statusNumberText}>1</Text>
                                        </View>
                                        <Text style={[styles.statusNameText, {
                                            color: '#0CA201'
                                        }]}>Order placed</Text>
                                    </View>
                                    <Image style={styles.dotsImage} source={require('../assets/images/dots_two.png')} />
                                    <Text style={styles.placedDescription}>Waiting for acceptance...</Text>
                                </View>
                            </LinearGradient>
                        </View>
                    </ImageBackground>
                    )}
                    {orderStatus === 'accepted' && (<ImageBackground style={styles.placedImageStyle} resizeMode="contain"
                        source={require('../assets/images/tracking_image_accepted.png')}
                    >
                        <View style={styles.wrapper}>
                            <LinearGradient
                                colors={[
                                    'rgba(255,255,255,0)',
                                    '#FFFFFF',
                                    '#FFFFFF',
                                ]}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                                style={styles.gradient}
                            >
                                <View style={styles.orderPlacedView}>
                                    <View style={styles.statusView}>
                                        <View style={Platform.OS === 'android' ?
                                            [styles.statusNumberView, { backgroundColor: '#0CA201' }, { bottom: hp('0.15%') }] :
                                            [styles.statusNumberView, { backgroundColor: '#0CA201' }]
                                        }>
                                            <Text style={styles.statusNumberText}>1</Text>
                                        </View>
                                        <Text style={[styles.statusNameText, {
                                            color: '#0CA201'
                                        }]}>Order placed</Text>
                                    </View>
                                    <Image style={styles.dotsImage} source={require('../assets/images/dots_two.png')} />
                                    <Text style={styles.placedDescription}>Accepted</Text>
                                </View>
                            </LinearGradient>
                        </View>
                    </ImageBackground>
                    )}
                    {orderStatus === 'packed' && (<ImageBackground style={styles.placedImageStyle} resizeMode="contain"
                        source={require('../assets/images/tracking_image_packed.png')}
                    >
                        <View style={styles.wrapper}>
                            <LinearGradient
                                colors={[
                                    'rgba(255,255,255,0)',
                                    // 'rgba(255,255,255,0.85)',
                                    '#FFFFFF',
                                    '#FFFFFF',
                                ]}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                                style={styles.gradient}
                            >
                                <View style={styles.orderPlacedView}>
                                    <View style={styles.statusView}>
                                        <View style={Platform.OS === 'android' ?
                                            [styles.statusNumberView, { backgroundColor: '#0CA201' }, { bottom: hp('0.15%') }] :
                                            [styles.statusNumberView, { backgroundColor: '#0CA201' }]
                                        }>
                                            <Text style={styles.statusNumberText}>1</Text>
                                        </View>
                                        <Text style={[styles.statusNameText, {
                                            color: '#0CA201'
                                        }]}>Order placed</Text>
                                    </View>
                                    <Image style={styles.dotsImage} source={require('../assets/images/dots_two.png')} />
                                    <Text style={styles.placedDescription}>Packed</Text>
                                </View>
                            </LinearGradient>
                        </View>
                    </ImageBackground>
                    )}
                    {orderStatus === 'assigned' && (<View style={styles.assignedContainer}>
                        <Image style={styles.assignedImageStyle} source={require('../assets/images/tracking_image_assigned.png')} />
                        <View style={styles.wrapper}>
                            <LinearGradient
                                colors={[
                                    'rgba(255,255,255,0)',
                                    // 'rgba(255,255,255,0.85)',
                                    '#FFFFFF',
                                    '#FFFFFF',
                                ]}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                                style={styles.gradient}
                            >
                                <View style={styles.orderPlacedView}>
                                    <View style={styles.statusView}>
                                        <View style={Platform.OS === 'android' ?
                                            [styles.statusNumberView, { backgroundColor: '#0CA201' }, { bottom: hp('0.15%') }] :
                                            [styles.statusNumberView, { backgroundColor: '#0CA201' }]
                                        }>
                                            <Text style={styles.statusNumberText}>2</Text>
                                        </View>
                                        <Text style={[styles.statusNameText, {
                                            color: '#0CA201'
                                        }]}>Out for delivery</Text>
                                    </View>
                                    <Image style={styles.dotsImage} source={require('../assets/images/dots_two.png')} />
                                    <Text style={styles.placedDescription}>Assigned delivery boy</Text>
                                </View>
                            </LinearGradient>
                        </View>
                    </View>
                    )}
                    {orderStatus === 'dispatched' && (<View style={styles.assignedContainer}>
                        <Image style={styles.assignedImageStyle} source={require('../assets/images/tracking_image_dispatched.png')} />
                        <View style={styles.wrapper}>
                            <LinearGradient
                                colors={[
                                    'rgba(255,255,255,0)',
                                    // 'rgba(255,255,255,0.85)',
                                    '#FFFFFF',
                                    '#FFFFFF',
                                ]}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                                style={styles.gradient}
                            >
                                <View style={styles.orderPlacedView}>
                                    <View style={styles.statusView}>
                                        <View style={Platform.OS === 'android' ?
                                            [styles.statusNumberView, { backgroundColor: '#0CA201' }, { bottom: hp('0.15%') }] :
                                            [styles.statusNumberView, { backgroundColor: '#0CA201' }]
                                        }>
                                            <Text style={styles.statusNumberText}>2</Text>
                                        </View>
                                        <Text style={[styles.statusNameText, {
                                            color: '#0CA201'
                                        }]}>Out for delivery</Text>
                                    </View>
                                    <Image style={styles.dotsImage} source={require('../assets/images/dots_two.png')} />
                                    <Text style={styles.placedDescription}>On the way</Text>
                                </View>
                            </LinearGradient>
                        </View>
                    </View>
                    )}
                    {orderStatus === 'delivered' && (<View style={styles.assignedContainer}>
                        <Image style={styles.assignedImageStyle} source={require('../assets/images/tracking_image_delivered.png')} />
                        <View style={styles.wrapper}>
                            <LinearGradient
                                colors={[
                                    'rgba(255,255,255,0)',
                                    // 'rgba(255,255,255,0.85)',
                                    '#FFFFFF',
                                    '#FFFFFF',
                                ]}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                                style={styles.gradient}
                            >
                                <View style={styles.orderPlacedView}>
                                    <View style={styles.statusView}>
                                        <View style={Platform.OS === 'android' ?
                                            [styles.statusNumberView, { backgroundColor: '#0CA201' }, { bottom: hp('0.15%') }] :
                                            [styles.statusNumberView, { backgroundColor: '#0CA201' }]
                                        }>

                                        </View>
                                        <Text style={[styles.statusNameText, {
                                            color: '#0CA201'
                                        }]}>Delivered</Text>
                                    </View>
                                    <Image style={styles.dotsImage} source={require('../assets/images/dots_two.png')} />
                                    <Text style={styles.placedDescription}>Product has been delivered</Text>
                                </View>
                            </LinearGradient>
                        </View>
                    </View>
                    )}
                </View>
                <View style={styles.containerTwo}>
                    {orderStatus === 'delivered' ? (<View style={styles.ratingContainer}>
                        <Text style={styles.ratingText}>How was your experience ?</Text>
                        <View style={styles.starContainer}>
                            <Image style={styles.ratingStarStyle} source={require('../assets/images/star.png')} />
                            <Image style={styles.ratingStarStyle} source={require('../assets/images/star.png')} />
                            <Image style={styles.ratingStarStyle} source={require('../assets/images/star.png')} />
                            <Image style={styles.ratingStarStyle} source={require('../assets/images/star.png')} />
                            <Image style={styles.ratingStarStyle} source={require('../assets/images/star.png')} />
                        </View>
                    </View>
                    ) : (<View style={styles.deliveryAgentContainer}>
                        <View>
                            <Text style={styles.deliveryAgentNameText}>
                                {['placed', 'accepted', 'packed'].includes(orderStatus)
                                    ? 'Not assigned'
                                    : (deliveryAgentName || 'Marvin Alex')}
                            </Text>
                            <Text style={styles.deliveryAgentTextTwo}>Delivery Agent</Text>
                        </View>
                        {['placed', 'accepted', 'packed'].includes(orderStatus)
                            ? <View style={styles.callContainer} />
                            : <TouchableOpacity
                                style={styles.callContainer}
                                onPress={() => {
                                    if (deliveryAgentPhone) {
                                        Linking.openURL(`tel:${deliveryAgentPhone}`);
                                    }
                                }}
                            >
                                <Image style={styles.phoneIcon} source={require('../assets/images/phone_green.png')} />
                            </TouchableOpacity>}

                    </View>
                    )}
                    <ImageBackground style={styles.addressBackgroundImageStyle} source={require('../assets/images/order_tracking_background.png')}>
                        <View style={styles.addressContainer}>
                            <View style={styles.addressInnerView}>
                                <View style={styles.addressHeaderView}>
                                    <Image style={styles.addressIconStyle} source={require('../assets/images/home_primary_two.png')} />
                                    <Text style={styles.addressHeaderText}>Store</Text>
                                </View>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.addressLineText}>{storeName}</Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.addressLineText}>Main Branch</Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.addressLineText}>{shippingAddress?.country || 'India'}</Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.addressLineText, { marginTop: hp('1%') }]}>7000000000</Text>
                            </View>
                            <Image style={styles.rightArrowIcon} source={require('../assets/images/right_arrow_two.png')} />
                            <View style={[styles.addressInnerView, {
                                paddingLeft: 0
                            }]}>
                                <View style={styles.addressHeaderView}>
                                    <Image style={styles.addressIconStyle} source={require('../assets/images/home_primary_three.png')} />
                                    <Text style={styles.addressHeaderText}>Home</Text>
                                </View>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.addressLineText}>{fullAddress}</Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.addressLineText}>{cityStateZip}</Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.addressLineText}>India</Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.addressLineText, { marginTop: hp('1%') }]}>
                                    {shippingAddress?.mobileNo || shippingAddress?.phoneNo || ''}
                                </Text>
                            </View>
                        </View>
                    </ImageBackground>
                    <Text style={styles.paymentMethodText}>Payment method</Text>

                    <View style={styles.deliveryAgentContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: wp('2%') }}>
                            <Image style={styles.paymentImage} source={require('../assets/images/payment_image.png')} />
                            <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.paymentText, { flex: 1 }]}>{paymentMethod}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end', flexShrink: 0 }}>
                            <Text style={styles.paymnetPrice}>₹{grandTotal}</Text>
                            {orderStatus === 'delivered' && (
                                <View style={[styles.paidBadge, { marginTop: hp('0.5%') }]}>
                                    <Ionicons name="checkmark-circle" size={wp('3%')} color="#27AE60" />
                                    <Text style={styles.paidBadgeText}>Paid successfully</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={styles.productsMainContainer}>
                        <View style={styles.productsHeaderView}>
                            <Text style={styles.productsHeaderText}>Your Orders</Text>
                            <Text style={styles.productsHeaderCount}>{itemCount} items</Text>
                        </View>

                        <View style={styles.productsContainer}>
                            {orderItems.map((item, index) => (
                                <OrderProductCard
                                    key={index}
                                    item={item}
                                    orderStatus={effectiveOrderStatus}
                                    onReturn={(selectedItem) => {
                                        setSelectedReturnItem(selectedItem || item);
                                        setShowReturnModal(true);
                                    }}
                                />
                            ))}
                        </View>



                        <View style={styles.productTotalView}>
                            <Text style={styles.totalText}>Total</Text>
                            <TouchableOpacity style={styles.viewBillContainer} onPress={() => setShowBillBreakdown(!showBillBreakdown)}>
                                <Text style={styles.viewBillText}>View Your Bill</Text>
                                <Entypo style={styles.viewBillIcon} name={showBillBreakdown ? 'chevron-thin-up' : 'chevron-thin-down'} size={wp('3%')} />
                            </TouchableOpacity>
                            <Text style={styles.totalPriceText}>₹{grandTotal}</Text>
                        </View>

                        {showBillBreakdown && bill && (
                            <View style={styles.billBreakdownContainer}>
                                <BillRow label="Item Total" value={`₹${bill.subTotal.toFixed(2)}`} />
                                {bill.discountTotal > 0 && <BillRow label="Discount" value={`- ₹${bill.discountTotal.toFixed(2)}`} isGreen />}
                                <BillRow label="Delivery Charge" value={bill.deliveryCharge === 0 ? 'FREE' : `₹${bill.deliveryCharge.toFixed(2)}`} />
                                {bill.couponDiscount > 0 && <BillRow label="Coupon Discount" value={`- ₹${bill.couponDiscount.toFixed(2)}`} isGreen />}
                                {bill.giftCardAmount > 0 && <BillRow label="Gift Card" value={`- ₹${bill.giftCardAmount.toFixed(2)}`} />}
                                {bill.bCoinAppliedValue > 0 && <BillRow label="B-Coins Applied" value={`- ₹${bill.bCoinAppliedValue.toFixed(2)}`} isGreen />}
                                {bill.taxTotal > 0 && <BillRow label="Tax" value={`₹${bill.taxTotal.toFixed(2)}`} />}
                                <View style={styles.billRowDivider} />
                                <View style={styles.finalTotalRow}>
                                    <Text style={styles.finalTotalLabel}>Grand Total</Text>
                                    <Text style={styles.finalTotalValue}>₹{bill.grandTotal.toFixed(2)}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                    <TouchableOpacity
                        style={styles.downloadBillContainer}
                        onPress={() => {
                            if (invoiceUrl) {
                                Linking.openURL(`${CONFIG.base_url}${invoiceUrl}`).catch(err => {
                                    console.error("Couldn't load page", err);
                                    Toast.show("Unable to download invoice at this time", Toast.SHORT);
                                });
                            }
                        }}
                    >
                        <Image style={styles.downloadBillIcon} source={require('../assets/images/bill_icon_two.png')} />
                        <Text style={styles.downloadBillText}>Download the bill</Text>
                    </TouchableOpacity>
                    <Text style={styles.orderDetailsText}>Order Details</Text>
                    <View style={styles.orderDetailsContainer}>
                        <View>
                            <Text style={styles.orderDetailsKeyText}>Order ID</Text>
                            <Text style={styles.orderDetailsValueText}>{displayOrderId}</Text>
                        </View>
                        <View>
                            <Text style={styles.orderDetailsKeyText}>Payment</Text>
                            <Text style={styles.orderDetailsValueText}>{paymentMethod}</Text>
                        </View>
                        <View>
                            <Text style={styles.orderDetailsKeyText}>Deliver to</Text>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.orderDetailsValueText}>{fullAddress}</Text>
                        </View>
                        <View>
                            <Text style={styles.orderDetailsKeyText}>Order placed</Text>
                            <Text style={styles.orderDetailsValueText}>{formattedOrderDate || orderDate}</Text>
                        </View>
                    </View>
                    <View style={styles.dliveryAgentRatingMainContainer}>
                        <View style={styles.deliveryAgentInnerContainerOne}>
                            <Image style={styles.deliveryAgentIcon} source={require('../assets/images/del_agent.png')} />
                            <View style={styles.deliveryAgentContainerInnerView}>
                                <Text style={styles.deliveryAgentRatingText}>Rate our delivery boy</Text>
                                <View style={styles.starContainerTwo}>
                                    <Image style={styles.ratingStarStyleTwo} source={require('../assets/images/star.png')} />
                                    <Image style={styles.ratingStarStyleTwo} source={require('../assets/images/star.png')} />
                                    <Image style={styles.ratingStarStyleTwo} source={require('../assets/images/star.png')} />
                                    <Image style={styles.ratingStarStyleTwo} source={require('../assets/images/star.png')} />
                                    <Image style={styles.ratingStarStyleTwo} source={require('../assets/images/star.png')} />
                                </View>
                            </View>
                        </View>
                        <View style={styles.deliveryAgentInnerContainerTwo}>
                            <Text style={styles.deliveryAgentRatingName}>Delivery boy : {deliveryAgentName || 'Marvin Alex'}</Text>
                        </View>
                    </View>
                    {['placed', 'accepted', 'packed'].includes(orderStatus) && (
                        <TouchableOpacity onPress={() => setShowCancelModal(true)}>
                            <LinearGradient colors={['#F25000', '#FF7B3A']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.cancelButtonGradient}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>

            <ConfirmationModal
                visible={showCancelModal}
                title="Cancel Order"
                message="Are you sure you want to cancel this order?"
                confirmText="Yes, Cancel"
                cancelText="No, Keep It"
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleCancelOrder}
            />

            <ReturnItemModal
                visible={showReturnModal}
                item={selectedReturnItem}
                onClose={() => {
                    setShowReturnModal(false);
                    setSelectedReturnItem(null);
                }}
                onSubmit={(reason) => {
                    handleReturnItem(reason);
                    refreshOrder?.(true);
                }}
            />
        </SafeAreaView >
    )
}

export default OrderTrackingScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    headerContainer: {
        flexDirection: 'row',
        paddingHorizontal: wp('4.65%'),
        justifyContent: 'space-between',
        paddingTop: hp('1.5%')
    },
    headerText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.65%'),
        color: '#000000',
        flex: 1,
        marginLeft: wp('4%')
    },
    headerInnerView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    helpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: 10,
        width: wp('13.02%'),
        height: hp('1.93%'),
        justifyContent: 'center',
    },
    headPhoneImage: {
        height: wp('2.6%'),
        width: wp('2.6%'),
        resizeMode: 'contain'
    },
    helpText: {
        fontFamily: FONTS.poppins.light,
        color: '#616161',
        fontSize: wp('2.79%'),
        marginLeft: wp('1%')
    },
    homeIcon: {
        width: wp('7.9%'),
        height: wp('7.9%'),
        marginLeft: wp('3%')
    },
    paidBadgeContainer: {
        paddingHorizontal: wp('4.65%'),
        marginTop: hp('0.5%'),
        marginBottom: hp('1.5%'),
    },
    paidBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E6FAF0',
        alignSelf: 'flex-end',
        paddingHorizontal: wp('2.5%'),
        paddingVertical: hp('0.4%'),
        borderRadius: 20,
    },
    paidBadgeText: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('3%'),
        color: '#27AE60',
        marginLeft: wp('1%'),
    },
    statusContainer: {
        flexDirection: 'row',
        width: wp('91%'),
        justifyContent: 'space-between'
    },
    statusView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    statusNumberView: {
        backgroundColor: '#616161',
        width: wp('3%'),
        height: wp('3%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        // bottom: hp('0.1%')
    },
    statusNumberText: {
        fontFamily: FONTS.poppins.medium,
        color: '#FFFFFF',
        fontSize: wp('2.09%')
    },
    statusNameText: {
        color: '#616161',
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('2.79%'),
        marginLeft: wp('1.5%')
    },
    wrapper: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    gradient: {
        width: '100%',
        height: hp('8%'),              // adjust based on UI
        // borderTopLeftRadius: wp(10),
        // borderTopRightRadius: wp(10),
        // overflow: 'hidden',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    placedImageStyle: {
        height: hp('29.2%'),
        width: '100%',
        marginTop: hp('2%'),
    },
    orderPlacedView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    dotsImage: {
        width: wp('1.16%'),
        height: hp('1.07%'),
        resizeMode: 'contain',
        marginLeft: wp('1.5%')
    },
    placedDescription: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('2.79%'),
        color: '#616161',
        marginLeft: wp('1.5%')
    },
    assignedContainer: {
        alignItems: 'center',
        marginTop: hp('3%'),
        height: hp('20%')
    },
    assignedImageStyle: {
        width: wp('48.5%'),
        height: hp('15.93%'),
        resizeMode: 'contain'
    },
    containerTwo: {
        paddingVertical: hp('2%'),
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: wp('9.3%'),
        borderTopRightRadius: wp('9.3%'),
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,

        // Android shadow
        elevation: 6,
        marginTop: hp('2%'),
        flex: 1
    },
    deliveryAgentContainer: {
        width: wp('90.7%'),
        // height: hp('6.44%'),
        paddingVertical: hp('1.5%'),
        borderRadius: wp('4.65%'),
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp('4%'),
        zIndex: 1
    },
    deliveryAgentNameText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.95%'),
        color: '#000000'
    },
    deliveryAgentTextTwo: {
        fontFamily: FONTS.poppins.light,
        fontSize: wp('2.79%'),
        color: '#696969',
        marginTop: hp('0.3%')
    },
    callContainer: {
        width: wp('11.63%'),
        height: wp('11.63%'),
        backgroundColor: '#F2F2F2',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    phoneIcon: {
        width: wp('4.65%'),
        height: wp('4.65%')
    },
    addressBackgroundImageStyle: {
        width: wp('99%'),
        minHeight: hp('14%'),
        justifyContent: 'center',
        marginTop: hp('2%')
        // alignItems: 'center'
    },
    addressContainer: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center'
    },
    addressInnerView: {
        width: wp('41%'),
        paddingLeft: wp('8%')
    },
    addressHeaderView: {
        flexDirection: 'row',
        marginBottom: hp('1%')
    },
    addressIconStyle: {
        width: wp('3.95%'),
        height: hp('1.71%'),
        resizeMode: 'contain'
    },
    addressHeaderText: {
        fontSize: wp('2.79%'),
        fontFamily: FONTS.poppins.regular,
        color: '#000000',
        marginLeft: wp('1.5%')
    },
    addressLineText: {
        fontFamily: FONTS.poppins.light,
        fontSize: wp('2.55%'), // ✅ FIXED
        color: '#606060',
        width: '85%',
    },
    rightArrowIcon: {
        width: wp('7%'),
        height: wp('7%'),
        resizeMode: "contain"
    },
    paymentMethodText: {
        fontFamily: FONTS.poppins.medium,
        color: '#000000',
        fontSize: wp('3.72%'),
        alignSelf: 'flex-start',
        marginLeft: wp('6%'),
        marginTop: hp('3%'),
        marginBottom: hp('0.7%')
    },
    paymentImage: {
        width: wp('9.3%'),
        height: wp('9.3%'),
        resizeMode: 'contain'
    },
    paymentText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.02%'),
        color: '#000000',
        flex: 1,
        marginLeft: wp('4%')
    },
    paymnetPrice: {
        color: '#0CA201',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.65%')
    },
    productsContainer: {
        width: wp('90.7%'),
        // height: hp('19%'),
        borderRadius: wp('4.65%'),
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
        alignSelf: 'center',
        paddingHorizontal: wp('3%'),
        paddingTop: hp('0.5%'),
        paddingBottom: hp('0.5%'),
        // justifyContent: 'space-between',
        zIndex: 1
    },
    productsContainerTwo: {
        width: wp('90.7%'),
        // height: hp('29%'),
        borderRadius: wp('4.65%'),
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
        alignSelf: 'center',
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('1.5%'),
        // justifyContent: 'space-between',
        zIndex: 1
    },
    productsMainContainer: {
        marginTop: hp('2.5%'),
        backgroundColor: '#FFFFFF',
    },
    productsHeaderView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingLeft: wp('8.5%'),
        marginBottom: hp('0.7%'),
        paddingRight: wp('5%')
    },
    productsHeaderText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.72%')
    },
    productsHeaderCount: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.72%'),
        color: '#616161'
    },
    productView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp('1%')
    },
    productViewTwo: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    productImage: {
        width: wp('8.6%'),
        height: wp('8.6%')
    },
    productImageTwo: {
        width: wp('8.6%'),
        height: wp('8.6%')
    },
    productName: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.02%'),
        color: '#000000'
    },
    productNameTwo: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.02%'),
        color: '#000000'
    },
    productQuantity: {
        fontFamily: FONTS.poppins.light,
        fontSize: wp('2.79%'),
        color: '#000000'
    },
    productQuantityTwo: {
        fontFamily: FONTS.poppins.light,
        fontSize: wp('2.79%'),
        color: '#000000'
    },
    productPrice: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.72%'),
        color: '#000000',
        alignSelf: 'flex-end'
    },
    productPriceTwo: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.72%'),
        color: '#000000',
        alignSelf: 'flex-end'
    },
    productTotalView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: wp('8.5%'),
        marginTop: hp('0.7%'),
        backgroundColor: '#FFFFFF',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
        width: wp('89%'),
        paddingTop: hp('1.5%'),
        paddingHorizontal: wp('3%'),
        borderBottomLeftRadius: wp('4.65%'),
        borderBottomRightRadius: wp('4.65%'),
        bottom: hp('1.5')
    },
    totalText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('5.11%'),
        color: '#616161'
    },
    viewBillContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    viewBillText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.02%'),
        color: '#000000'
    },
    viewBillIcon: {
        marginLeft: wp('3%')
    },
    totalPriceText: {
        fontFamily: FONTS.poppins.semiBold,
        color: '#616161',
        fontSize: wp('5.11%'),
    },
    downloadBillContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        width: wp('90.7%'),
        height: hp('3.97%'),
        borderRadius: wp('1.86%'),
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
        paddingHorizontal: wp('5%'),
        marginTop: hp('2.1%')
    },
    downloadBillIcon: {
        width: wp('3.72%'),
        height: hp('2.14%'),
        resizeMode: 'contain'
    },
    downloadBillText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.02%'),
        color: '#616161',
        marginLeft: wp('3%')
    },
    orderDetailsText: {
        color: '#000000',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.72%'),
        alignSelf: 'flex-start',
        marginLeft: wp('6%'),
        marginTop: hp('3.2%')
    },
    orderDetailsContainer: {
        width: wp('90.7%'),
        height: hp('25.54%'),
        borderRadius: wp('4.65%'),
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
        marginTop: hp('1.1%'),
        paddingLeft: wp('3%'),
        paddingVertical: hp('2%'),
        justifyContent: 'space-between'
    },
    orderDetailsKeyText: {
        fontFamily: FONTS.poppins.light,
        fontSize: wp('3.25%'),
        color: "#8A8A8A"
    },
    orderDetailsValueText: {
        color: '#2B2B2B',
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.25%')
    },
    cancelButtonGradient: {
        width: wp('90.7%'),
        height: hp('5.36%'),
        borderRadius: wp('2.33%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('4%')
    },
    cancelButtonText: {
        fontFamily: FONTS.poppins.semiBold,
        color: '#FFFFFF',
        fontSize: wp('4.65%')
    },
    ratingStarStyle: {
        width: wp('6.28%'),
        height: hp('2.79%'),
        resizeMode: 'contain'
    },
    ratingStarStyleTwo: {
        width: wp('4.88%'),
        height: hp('2.14%'),
        resizeMode: 'contain'
    },
    ratingContainer: {
        marginBottom: hp('0.5%')
    },
    ratingText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.72%'),
        color: '#000000'
    },
    starContainer: {
        flexDirection: 'row',
        width: wp('50.23%'),
        justifyContent: 'space-between',
        marginTop: hp('1%'),
        paddingHorizontal: wp('0.5%')
    },
    starContainerTwo: {
        flexDirection: 'row',
        width: wp('33.72%'),
        justifyContent: 'space-between',
        marginTop: hp('1%'),
        paddingHorizontal: wp('0.5%')
    },
    paidSuccessfullyContainer: {
        backgroundColor: '#E6FAF0',
        borderRadius: wp('50%'),
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('0.5%'),
        alignSelf: 'flex-start',
        marginLeft: wp('6%'),
        marginTop: hp('1%'),
        flexDirection: 'row',
        alignItems: 'center',
    },
    paidSuccessfullyInnerView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paidSuccessfullyIcon: {
        width: wp('2.8%'),
        height: wp('2.8%')
    },
    paidSuccessfullyText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('2.8%'),
        color: '#0CA201',
        marginLeft: wp('1.5%')
    },
    productContainerThirdView: {
        alignItems: 'flex-end',
        paddingTop: hp('2%')
    },
    returnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('0.4%')
    },
    returnIcon: {
        width: wp('2.55%'),
        height: hp('1.07%'),
        resizeMode: 'contain'
    },
    returnText: {
        color: '#F25000',
        fontSize: wp('3.72%'),
        fontFamily: FONTS.poppins.medium,
        marginLeft: wp('1%')
    },
    dliveryAgentRatingMainContainer: {
        marginTop: hp('3%')
    },
    deliveryAgentInnerContainerOne: {
        flexDirection: 'row',
        alignItems: 'center',
        width: wp('90.7%'),
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: wp('4.65%'),
        borderTopRightRadius: wp('4.65%'),
        paddingVertical: hp('2%'),
        justifyContent: 'space-between',
        paddingHorizontal: wp('16%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
    },
    deliveryAgentIcon: {
        width: wp('11.6%'),
        height: hp('4.92%'),
        resizeMode: 'contain'
    },
    deliveryAgentContainerInnerView: {
        alignItems: 'center'
    },
    deliveryAgentRatingText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.72%'),
        color: '#000000'
    },
    deliveryAgentInnerContainerTwo: {
        width: wp('90.7%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
        backgroundColor: '#FFFFFF',
        paddingVertical: hp('0.7%'),
        paddingHorizontal: wp('5%'),
        borderBottomLeftRadius: wp('4.65%'),
        borderBottomRightRadius: wp('4.65%')
    },
    deliveryAgentRatingName: {
        fontFamily: FONTS.poppins.light,
        fontSize: wp('2.79%'),
        color: '#696969'
    },
    billBreakdownContainer: {
        paddingHorizontal: wp('8.5%'),
        marginTop: hp('0.5%'),
        paddingBottom: hp('2%'),
        backgroundColor: '#FFFFFF',
        width: wp('90.7%'),
        alignSelf: 'center',
    },
    billBreakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('0.8%'),
    },
    billBreakdownLabel: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.25%'),
        color: '#616161',
    },
    billBreakdownValue: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.25%'),
        color: '#000000',
    },
    billRowDivider: {
        borderWidth: 0.5,
        borderStyle: 'dashed',
        borderColor: '#E8E8E8',
        marginVertical: hp('1.5%'),
        borderRadius: 1,
    },
    finalTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    finalTotalLabel: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.2%'),
        color: '#000000',
    },
    finalTotalValue: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4.5%'),
        color: '#0CA201',
    },
})
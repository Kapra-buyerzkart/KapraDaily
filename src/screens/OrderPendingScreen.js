import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, BackHandler } from 'react-native'
import React, { useEffect } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FONTS } from '../styles/typography'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

const OrderPendingScreen = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const {
        orderId,
        orderNumber,
        razorpayOrderId,
        razorpayAmount,
        razorpayKeyId
    } = route.params || {}

    useEffect(() => {
        // Prevent Android hardware back button
        const backAction = () => {
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        // Prevent navigation remove
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            const action = e.data.action;
            if (action.type === 'RESET' || action.type === 'REPLACE') {
                return;
            }
            e.preventDefault();
        });

        return () => {
            backHandler.remove();
            unsubscribe();
        };
    }, [navigation])

    const handleCheckStatus = () => {
        navigation.navigate('OrderTrackingScreen', { orderId });
    }

    const handleBackToHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
            })
        )
    }

    const displayOrderNumber = orderNumber || orderId || '--'

    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF9F2" />
            <LinearGradient
                colors={['#FFF9F2', '#FFFBF7', '#FFFFFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.6 }}
                style={styles.gradientContainer}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Pending Icon Area */}
                    <View style={styles.pendingSection}>
                        <View style={styles.iconCircle}>
                            <MaterialCommunityIcons name="clock-outline" size={wp('15%')} color="#F2994A" />
                        </View>
                        <View style={styles.statusContainer}>
                            <Text style={styles.statusText}>Payment Pending</Text>
                            <Text style={styles.statusTextTwo}>
                                We are verifying your payment with the bank. This usually takes a few minutes.
                            </Text>
                        </View>
                    </View>

                    {/* Info Card */}
                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>What happens next?</Text>
                        <View style={styles.stepRow}>
                            <View style={[styles.stepDot, { backgroundColor: '#F2994A' }]} />
                            <Text style={styles.stepText}>Your order will be confirmed once payment is verified.</Text>
                        </View>
                        <View style={styles.stepRow}>
                            <View style={[styles.stepDot, { backgroundColor: '#F2994A' }]} />
                            <Text style={styles.stepText}>You can track the status in the "My Orders" section.</Text>
                        </View>
                        <View style={styles.stepRow}>
                            <View style={[styles.stepDot, { backgroundColor: '#F2994A' }]} />
                            <Text style={styles.stepText}>If payment fails, it will be refunded to your original method.</Text>
                        </View>
                    </View>

                    {/* Order Number Display */}
                    <View style={styles.orderNumberCard}>
                        <Text style={styles.orderNumberLabel}>Order Number</Text>
                        <Text style={styles.orderNumberText}>#{displayOrderNumber}</Text>
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonsContainer}>
                        <LinearGradient
                            colors={['#F2994A', '#F2C94C']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.actionButtonGradient}
                        >
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={handleCheckStatus}
                                activeOpacity={0.7}
                            >
                                <MaterialCommunityIcons name="truck-delivery-outline" size={wp('5.5%')} color="#FFFFFF" />
                                <Text style={styles.actionButtonText}>Check Order Status</Text>
                            </TouchableOpacity>
                        </LinearGradient>

                        <TouchableOpacity
                            style={styles.homeButton}
                            onPress={handleBackToHome}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="home-outline" size={wp('5%')} color="#616161" />
                            <Text style={styles.homeButtonText}>Go to Home</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.footerNote}>
                        In case of any issues, please contact our support team from the order details page.
                    </Text>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    )
}

export default OrderPendingScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFF9F2',
    },
    gradientContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: hp('5%'),
        paddingHorizontal: wp('5%'),
    },
    pendingSection: {
        alignItems: 'center',
        marginTop: hp('6%'),
    },
    iconCircle: {
        width: wp('25%'),
        height: wp('25%'),
        borderRadius: wp('12.5%'),
        backgroundColor: '#FFF1E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp('2%'),
    },
    statusContainer: {
        alignItems: 'center',
    },
    statusText: {
        color: '#F2994A',
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('6%'),
    },
    statusTextTwo: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3.8%'),
        color: '#616161',
        marginTop: hp('0.5%'),
        textAlign: 'center',
        paddingHorizontal: wp('8%'),
        lineHeight: hp('2.5%')
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: wp('5%'),
        marginTop: hp('4%'),
        borderWidth: 1,
        borderColor: '#FFECCF'
    },
    infoTitle: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%'),
        color: '#333333',
        marginBottom: hp('1.5%')
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: hp('1.2%')
    },
    stepDot: {
        width: wp('2%'),
        height: wp('2%'),
        borderRadius: wp('1%'),
        marginTop: hp('0.8%'),
        marginRight: wp('3%')
    },
    stepText: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3.5%'),
        color: '#616161',
        flex: 1,
        lineHeight: hp('2.2%')
    },
    orderNumberCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: wp('4%'),
        marginTop: hp('2%'),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    orderNumberLabel: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('3.5%'),
        color: '#999999',
        marginRight: wp('2%')
    },
    orderNumberText: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4%'),
        color: '#333333'
    },
    buttonsContainer: {
        marginTop: hp('4%'),
    },
    actionButtonGradient: {
        borderRadius: 12,
        marginBottom: hp('1.5%'),
    },
    actionButton: {
        height: hp('6.5%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%'),
        color: '#FFFFFF',
        marginLeft: wp('2%'),
    },
    homeButton: {
        height: hp('6.5%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
    },
    homeButtonText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%'),
        color: '#616161',
        marginLeft: wp('1.5%'),
    },
    footerNote: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3%'),
        color: '#9E9E9E',
        textAlign: 'center',
        marginTop: hp('3%'),
        lineHeight: hp('2%'),
        paddingHorizontal: wp('5%'),
    }
})

import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'
import { useNavigation } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'

const OrderTrackingScreen = () => {
    const statuses = ['placed', 'accepted', 'packed', 'assigned', 'dispatched', 'delivered']

    // const [orderStatus, setOrderStatus] = useState(statuses[0])

    // useEffect(() => {
    //     let index = 0

    //     const interval = setInterval(() => {
    //         index++
    //         if (index < statuses.length) {
    //             setOrderStatus(statuses[index])
    //         } else {
    //             clearInterval(interval)
    //         }
    //     }, 5000) // 10 seconds

    //     return () => clearInterval(interval)
    // }, [])
    const orderStatus = 'placed'
    const navigation = useNavigation()
    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign
                        name={'left'}
                        size={wp('6%')}
                        color={'#000000'}
                    />
                </TouchableOpacity>
                <Text style={styles.headerText}>Order Tracking</Text>
                <View style={styles.headerInnerView}>
                    <TouchableOpacity style={styles.helpContainer}>
                        <Image style={styles.headPhoneImage} source={require('../assets/images/head_phone.png')} />
                        <Text style={styles.helpText}>Help</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image style={styles.homeIcon} source={require('../assets/images/home_two.png')} />
                    </TouchableOpacity>
                </View>
            </View>
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
                                        <Text style={styles.statusNumberText}>3</Text>
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
                <View style={styles.deliveryAgentContainer}>
                    <View>
                        <Text style={styles.deliveryAgentNameText}>Not assigned</Text>
                        <Text style={styles.deliveryAgentTextTwo}>Delivery boy</Text>
                    </View>
                    <TouchableOpacity style={styles.callContainer}>
                        <Image style={styles.phoneIcon} source={require('../assets/images/phone_green.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
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
        marginLeft: wp('5%')
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
        borderRadius: wp('9.3%'),

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
        height: hp('6.44%'),
        borderRadius: wp('4.65%'),
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp('4%')
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
    }
})
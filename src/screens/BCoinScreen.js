import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, ScrollView, Modal } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'
import { useNavigation } from '@react-navigation/native'

const BCoinScreen = () => {
    const [selected, setSelected] = useState('bcoin')
    const [showModal, setShowModal] = useState(false)

    const navigation = useNavigation()

    return (
        <SafeAreaView style={styles.mainContainer}>
            <ImageBackground style={styles.backgroundImageStyle} source={require('../assets/images/bcoin_header_image_one.png')}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image style={styles.leftArrowIcon} source={require('../assets/images/left_arrow.png')} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>B-Coin and B-token</Text>
                </View>
                {/* <Image style={styles.imageStyle} source={require('../assets/images/bcoin_header_image_two.png')} /> */}
                <Image style={{
                    width: wp('47.44%'),
                    height: hp('21.88%'),
                    resizeMode: 'contain',
                    alignSelf: 'center',
                    // marginTop: hp('4.1%')
                    bottom: hp('1.1%')
                }} source={require('../assets/gif/bcoin.gif')} />
            </ImageBackground>
            <View style={styles.innerContainer}>
                <View>
                    <View style={styles.bcoinContainerOne}>
                        <Image style={styles.bcoinImage} source={require('../assets/images/bcoin_rupee.png')} />
                        <Text style={styles.bcoinText}>B-Coin</Text>
                        <View style={styles.bcoinInnerView}>
                            <Text style={styles.availableBalanceHeaderText}>Available Balance</Text>
                            <Text style={styles.availableBalanceValueText}>3000</Text>
                        </View>
                    </View>
                    <View style={styles.bcoinContainerTwo}>
                        <View style={styles.bcoinInnerViewTwo}>
                            <Text style={styles.bcoinTextTwo}>Today’s B-coin value : </Text>
                            <Text style={styles.bcoinPriceText}>₹394</Text>
                        </View>
                        <TouchableOpacity onPress={() => setShowModal(true)} style={styles.bcoinInnerViewTwo}>
                            <Text style={styles.viewText}>View</Text>
                            <Image style={styles.rightArrowsIcon} source={require('../assets/images/right-arrows-two.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.bcoinContainerOne, {
                    borderRadius: wp('2.33%'),
                    marginTop: hp('1.5%')
                }]}>
                    <Image style={styles.bcoinImage} source={require('../assets/images/btoken-icon-four.png')} />
                    <Text style={styles.bcoinText}>B-Token</Text>
                    <View style={styles.bcoinInnerView}>
                        <Text style={styles.availableBalanceHeaderText}>Available Balance</Text>
                        <Text style={styles.availableBalanceValueText}>3000</Text>
                    </View>
                </View>
                <Text style={styles.historyHeaderText}>History</Text>
                <View style={styles.bcoinTokenHeaderContainer}>
                    <TouchableOpacity onPress={() => setSelected('bcoin')} style={selected === 'bcoin' ? (
                        [styles.bcoinSingleContainer, {
                            borderBottomWidth: hp('0.43%'),
                            borderBottomColor: '#F25000',
                        }]
                    ) : (styles.bcoinSingleContainer)}>
                        <Text style={selected === 'bcoin' ? (
                            [styles.bcoinSingleText, {
                                color: '#F25000'
                            }]
                        ) : (styles.bcoinSingleText)}>B-Coin</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelected('btoken')} style={selected === 'btoken' ? (
                        [styles.bcoinSingleContainer, {
                            borderBottomWidth: hp('0.43%'),
                            borderBottomColor: '#F25000',
                        }]
                    ) : (styles.bcoinSingleContainer)}>
                        <Text style={selected === 'btoken' ? (
                            [styles.bcoinSingleText, {
                                color: '#F25000'
                            }]
                        ) : (styles.bcoinSingleText)}>B-Token</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <View style={styles.bcoinContainer}>
                        <Image style={styles.bcoinImageTwo} source={require('../assets/images/bcoin-three.png')} />
                        <View>
                            <Text style={styles.bcoinContent}>Redeemed for Order ID</Text>
                            <Text style={[styles.bcoinContent, {
                                fontSize: wp('3.25%'),
                            }]}>#OGERFGFGHBFGD</Text>
                            <Text style={[styles.bcoinContent, {
                                fontSize: wp('3.25%'),
                                marginTop: hp('0.5%')
                            }]}>22-01-2026</Text>
                        </View>
                        <Text style={[styles.bcoinContent, {
                            fontSize: wp('3.25%'),
                        }]}>0.00 coins</Text>
                        <Text style={styles.bcoinPriceTextTwo}>₹324</Text>
                    </View>
                    <View style={styles.bcoinContainer}>
                        <Image style={styles.bcoinImageTwo} source={require('../assets/images/bcoin-three.png')} />
                        <View>
                            <Text style={styles.bcoinContent}>Redeemed for Order ID</Text>
                            <Text style={[styles.bcoinContent, {
                                fontSize: wp('3.25%'),
                            }]}>#OGERFGFGHBFGD</Text>
                            <Text style={[styles.bcoinContent, {
                                fontSize: wp('3.25%'),
                                marginTop: hp('0.5%')
                            }]}>22-01-2026</Text>
                        </View>
                        <Text style={[styles.bcoinContent, {
                            fontSize: wp('3.25%'),
                        }]}>0.00 coins</Text>
                        <Text style={styles.bcoinPriceTextTwo}>₹324</Text>
                    </View>
                    <View style={styles.bcoinContainer}>
                        <Image style={styles.bcoinImageTwo} source={require('../assets/images/bcoin-three.png')} />
                        <View>
                            <Text style={styles.bcoinContent}>Redeemed for Order ID</Text>
                            <Text style={[styles.bcoinContent, {
                                fontSize: wp('3.25%'),
                            }]}>#OGERFGFGHBFGD</Text>
                            <Text style={[styles.bcoinContent, {
                                fontSize: wp('3.25%'),
                                marginTop: hp('0.5%')
                            }]}>22-01-2026</Text>
                        </View>
                        <Text style={[styles.bcoinContent, {
                            fontSize: wp('3.25%'),
                        }]}>0.00 coins</Text>
                        <Text style={styles.bcoinPriceTextTwo}>₹324</Text>
                    </View>
                    <View style={styles.bcoinContainer}>
                        <Image style={styles.bcoinImageTwo} source={require('../assets/images/bcoin-three.png')} />
                        <View>
                            <Text style={styles.bcoinContent}>Redeemed for Order ID</Text>
                            <Text style={[styles.bcoinContent, {
                                fontSize: wp('3.25%'),
                            }]}>#OGERFGFGHBFGD</Text>
                            <Text style={[styles.bcoinContent, {
                                fontSize: wp('3.25%'),
                                marginTop: hp('0.5%')
                            }]}>22-01-2026</Text>
                        </View>
                        <Text style={[styles.bcoinContent, {
                            fontSize: wp('3.25%'),
                        }]}>0.00 coins</Text>
                        <Text style={styles.bcoinPriceTextTwo}>₹324</Text>
                    </View>
                    <View style={[styles.bcoinContainer, {
                        borderBottomWidth: 0
                    }]}>
                        <Image style={styles.bcoinImageTwo} source={require('../assets/images/btoken-icon-four.png')} />
                        <View>
                            <Text style={styles.bcoinContent}>Credited for Order ID</Text>
                            <Text style={[styles.bcoinContent, {
                                fontSize: wp('3.25%'),
                            }]}>#OGERFGFGHBFGD</Text>
                            <Text style={[styles.bcoinContent, {
                                fontSize: wp('3.25%'),
                                marginTop: hp('0.5%')
                            }]}>22-01-2026</Text>
                        </View>
                        <Text style={[styles.bcoinContent, {
                            fontSize: wp('3.25%'),
                        }]}>0.00 coins</Text>
                        <Text style={[styles.bcoinPriceTextTwo, {
                            color: '#0CA201'
                        }]}>₹324</Text>
                    </View>
                </ScrollView>
            </View>
            <TouchableOpacity style={styles.redeemButton}>
                <Text style={styles.redeemText}>Redeem B-Coin</Text>
            </TouchableOpacity>
            <Modal
                visible={showModal}
                animationType='slide'
                transparent
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeaderContainer}>
                            <Text style={styles.modalHeaderText}>B-Coin rate history</Text>
                            <TouchableOpacity onPress={() => setShowModal(false)}>
                                <Image style={styles.closeIcon}
                                    source={require('../assets/images/close_two.png')} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            <View style={styles.bcoinRateSingleContainer}>
                                <Text style={styles.dateText}>Today</Text>
                                <Text style={styles.timeText}>10:02 am</Text>
                                <View style={styles.rateView}>
                                    <Text style={styles.rateText}>₹394</Text>
                                    <Image style={styles.upImage} source={require('../assets/images/down.png')} />
                                </View>
                            </View>
                            <View style={styles.bcoinRateSingleContainer}>
                                <Text style={styles.dateText}>26-01-2026</Text>
                                <Text style={styles.timeText}>10:02 am</Text>
                                <View style={styles.rateView}>
                                    <Text style={[styles.rateText, {
                                        color: '#0CA201'
                                    }]}>₹394</Text>
                                    <Image style={styles.upImage} source={require('../assets/images/up.png')} />
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default BCoinScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: wp('4.65%'),
        marginTop: hp('4%'),
    },
    leftArrowIcon: {
        width: wp('2.33%'),
        height: hp('2.03%'),
        resizeMode: 'contain'
    },
    headerText: {
        color: '#000000',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.65%'),
        marginLeft: wp('6%')
    },
    imageStyle: {
        width: wp('47.44%'),
        height: hp('21.88%'),
        resizeMode: 'contain',
        alignSelf: 'center',
        // marginTop: hp('4.1%')
        bottom: hp('1.1%')
    },
    backgroundImageStyle: {
        height: hp('26%')
    },
    innerContainer: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        borderTopLeftRadius: wp('7%'),
        borderTopRightRadius: wp('7%'),
        bottom: hp('2.5%')
    },
    bcoinContainerOne: {
        width: wp('90.7%'),
        height: hp('8.15%'),
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#DADADA',
        borderWidth: 1,
        borderTopLeftRadius: wp('2.33%'),
        borderTopRightRadius: wp('2.33%'),
        justifyContent: 'space-between',
        alignSelf: 'center',
        marginTop: hp('3%'),
        paddingHorizontal: wp('3.25%')
    },
    bcoinImage: {
        width: wp('10.23%'),
        height: hp('4.72%'),
        resizeMode: 'contain',
    },
    bcoinText: {
        fontSize: wp('4.18%'),
        fontFamily: FONTS.poppins.regular,
        color: '#000000',
    },
    bcoinInnerView: {
        alignItems: 'flex-end'
    },
    availableBalanceHeaderText: {
        color: '#616161',
        fontFamily: FONTS.poppins.light,
        fontSize: wp('2.32%')
    },
    availableBalanceValueText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.65%'),
        color: '#F25000',
    },
    bcoinContainerTwo: {
        alignSelf: 'center',
        width: wp('90.7%'),
        height: hp('3.22%'),
        borderColor: '#DADADA',
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomLeftRadius: wp('2.33%'),
        borderBottomRightRadius: wp('2.33%'),
        backgroundColor: '#FED7C4',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: wp('3%')
    },
    bcoinInnerViewTwo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bcoinTextTwo: {
        fontFamily: FONTS.poppins.regular,
        color: '#616161',
        fontSize: wp('2.79%')
    },
    bcoinPriceText: {
        fontFamily: FONTS.poppins.semiBold,
        color: '#000000',
        fontSize: wp('2.79%')
    },
    viewText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('2.79%'),
        color: '#616161'
    },
    rightArrowsIcon: {
        width: wp('3.72%'),
        height: hp('1.07%'),
        marginLeft: wp('2.5%')
    },
    historyHeaderText: {
        color: '#000000',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('4.19%'),
        marginTop: hp('3%'),
        alignSelf: 'center'
    },
    bcoinTokenHeaderContainer: {
        flexDirection: 'row',
        marginTop: hp('2%'),
        alignSelf: 'center'
    },
    bcoinSingleContainer: {
        alignItems: 'center',
        width: wp('38.4%'),
        paddingBottom: hp('0.4%'),
    },
    bcoinSingleText: {
        color: '#616161',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.72%')
    },
    bcoinContainer: {
        flexDirection: 'row',
        width: wp('90.7%'),
        justifyContent: 'space-between',
        alignSelf: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA',
        paddingBottom: hp('1.5%'),
        marginTop: hp('1.5%')
    },
    bcoinImageTwo: {
        width: wp('6.98%'),
        height: wp('6.98%'),
        resizeMode: 'contain'
    },
    bcoinContent: {
        fontFamily: FONTS.poppins.regular,
        color: '#000000',
        fontSize: wp('2.56%'),
    },
    bcoinPriceTextTwo: {
        color: '#FF0000',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.49%')
    },
    redeemButton: {
        width: wp('90.7%'),
        height: hp('6.11%'),
        backgroundColor: '#F25000',
        borderRadius: wp('2.33%'),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    redeemText: {
        color: '#FFFFFF',
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4.18%')
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: wp('9.3%'),
        borderTopRightRadius: wp('9.3%'),
        paddingVertical: hp('3.11%'),
        // paddingHorizontal: wp('4.65%'),
        maxHeight: hp('70%'),
    },
    modalHeaderContainer: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp('4.65%'),
        borderBottomWidth: 1,
        borderBottomColor: '#8F8F8F40',
        paddingBottom: hp('1%'),
        marginBottom: hp('2.7%')
    },
    modalHeaderText: {
        color: '#000000',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.65%')
    },
    closeIcon: {
        height: wp('3.72%'),
        width: wp('3.72%'),
        resizeMode: 'contain'
    },
    bcoinRateSingleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp('5.5%'),
        marginBottom: hp('1%')
    },
    dateText: {
        color: '#000000',
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.72%'),
        width: wp('30%')
    },
    timeText: {
        color: '#000000',
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.72%'),
        width: wp('40%')
    },
    rateView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: wp('30%')
    },
    rateText: {
        color: '#FF0000',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.25%')
    },
    upImage: {
        width: wp('3.02%'),
        height: hp('0.86%'),
        resizeMode: 'contain',
        marginLeft: wp('1%')
    }
})
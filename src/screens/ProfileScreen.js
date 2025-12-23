import { View, Text, StyleSheet, Touchable, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import LinearGradient from 'react-native-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { FONTS } from '../styles/typography'

export default function ProfileScreen() {
    const navigation = useNavigation()
    return (
        <SafeAreaView edges={['top']} style={styles.mainConatiner}>
            <ScrollView>
                <LinearGradient
                    colors={['#FFE7DB', '#FFFFFF']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                >
                    <View style={styles.topView}>
                        <View style={styles.headerView}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <AntDesign
                                    name={'left'}
                                    size={wp('6%')}
                                    color={'#777777'}
                                />
                            </TouchableOpacity>
                            <Text style={styles.profileHeaderText}>Profile</Text>
                            <TouchableOpacity>
                                <Image source={require('../assets/images/dots.png')} style={styles.dotsIcon} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.userView}>
                            <Image style={styles.userIcon} source={require('../assets/images/user.png')} />
                            <View style={styles.userNamePhoneView}>
                                <Text style={styles.userNameText}>Unknown Person</Text>
                                <Text style={styles.phoneNumberStyle}>9999999999</Text>
                            </View>
                            <View style={styles.bcoinContainer}>
                                <Image style={styles.bcoinImage} source={require('../assets/images/rupee.png')} />
                                <Text style={styles.bcoinText}>0.00</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.containerTwo}>
                    <TouchableOpacity style={styles.saveAddressContainer}>
                        <Image style={styles.saveAddressImage} source={require('../assets/images/location_two.png')} />
                        <Text style={styles.saveAddressText}>Save Address</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveAddressContainer}>
                        <Image style={styles.saveAddressImage} source={require('../assets/images/order.png')} />
                        <Text style={styles.saveAddressText}>My Order</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.containerThree}>
                    <Text style={styles.offersText}>Offers</Text>

                    <View style={styles.offerView}>
                        <Image style={styles.offerImage} source={require('../assets/images/smart_point.png')} />
                        <Text style={styles.offerText}>Smart Point</Text>
                        <AntDesign name={"right"} color={'#DADADA'} size={wp('4.4%')} />
                    </View>

                    <View style={styles.offerView}>
                        <Image style={styles.offerImage} source={require('../assets/images/coupon.png')} />
                        <Text style={styles.offerText}>Coupon</Text>
                        <AntDesign name={"right"} color={'#DADADA'} size={wp('4.4%')} />
                    </View>
                </View>

                <View style={[styles.containerThree, { marginTop: hp('1.5%') }]}>
                    <Text style={styles.offersText}>Informations</Text>
                    <View style={[styles.offerView, {
                        paddingVertical: wp('3%')
                    }]}>
                        <Image style={styles.circle} source={require('../assets/images/circle.png')} />
                        <Text style={styles.offerText}>Privacy Policy</Text>
                        <AntDesign name={"right"} color={'#DADADA'} size={wp('4.4%')} />
                    </View>
                    <View style={[styles.offerView, {
                        paddingVertical: wp('3%')
                    }]}>
                        <Image style={styles.circle} source={require('../assets/images/circle.png')} />
                        <Text style={styles.offerText}>Terms Of Use</Text>
                        <AntDesign name={"right"} color={'#DADADA'} size={wp('4.4%')} />
                    </View>
                    <View style={[styles.offerView, {
                        paddingVertical: wp('3%')
                    }]}>
                        <Image style={styles.circle} source={require('../assets/images/circle.png')} />
                        <Text style={styles.offerText}>About Us</Text>
                        <AntDesign name={"right"} color={'#DADADA'} size={wp('4.4%')} />
                    </View>
                </View>

                <View style={styles.sendContainer}>
                    <Text style={styles.sendContainerTextOne}>Didnt Find Your Product!</Text>
                    <Text style={styles.sendContainerTextTwo}>Tell us which product you want in our app</Text>
                    <View style={styles.sendContainerInnerView}>
                        <TextInput
                            placeholderTextColor={'#DADADA'}
                            placeholder='eg: biscuit, caske, fruits ...'
                            style={styles.sendTextInput} />
                        <TouchableOpacity>
                            <Image style={styles.sendImage} source={require('../assets/images/send.png')} />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutContainer}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainConatiner: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    headerView: {
        // backgroundColor: '#FFEFE7',
        flexDirection: 'row',
        paddingTop: hp('4%'),
        alignItems: "center",
        paddingHorizontal: wp('4.65%'),
        justifyContent: 'space-between'
    },
    profileHeaderText: {
        color: '#000000',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('5.1%'),
        flex: 1,
        marginLeft: wp('4%')
    },
    dotsIcon: {
        width: wp('0.7%'),
        height: hp("1.6%"),
    },
    topView: {

    },
    userView: {
        flexDirection: 'row',
        paddingHorizontal: wp('5%'),
        justifyContent: 'space-between',
        marginTop: hp('3%'),
        alignItems: 'center'
    },
    userIcon: {
        height: wp('9.3%'),
        width: wp('9.3%')
    },
    userNamePhoneView: {
        flex: 1,
        marginLeft: wp('5%')
    },
    userNameText: {
        color: '#000000',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('4.18%')
    },
    phoneNumberStyle: {
        fontSize: wp('2.79%'),
        fontFamily: FONTS.poppins.semiBold,
        color: '#5C5C5C',
        // marginTop: hp('0.1%')
    },
    bcoinContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: 10,
        width: wp('16.5%'),
        height: hp('3%'),
        justifyContent: "space-between",
        paddingHorizontal: wp('1.5%')
    },
    bcoinImage: {
        width: wp('4.65%'),
        height: wp('4.65%'),
    },
    bcoinText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.25%'),
        color: '#000000'
    },
    containerTwo: {
        flexDirection: 'row',
        justifyContent: "space-evenly",
        // backgroundColor: 'red',
        paddingTop: wp('5%'),
        borderTopLeftRadius: wp('7%'),
        borderTopRightRadius: wp('7%'),
        marginTop: hp('2%'),
        borderWidth: 1,
        borderColor: '#00000040',
        borderBottomWidth: 0
    },
    saveAddressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: wp('43.02%'),
        height: hp('6.43%'),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#DADADA',
        // justifyContent: "space-between"
        paddingLeft: wp('3%')
    },
    saveAddressImage: {
        height: wp('6.9%'),
        width: wp('6.9%'),
    },
    saveAddressText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.25%'),
        marginLeft: wp('2%')
    },
    containerThree: {
        paddingHorizontal: wp('5%'),
        marginTop: hp('2.5%')
    },
    offersText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('4.18%'),
        color: '#000000',
        marginBottom: hp('0.5%')
    },
    offerView: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#DADADA',
        alignItems: 'center',
        borderRadius: 10,
        justifyContent: 'space-between',
        padding: wp('2%'),
        marginBottom: hp('0.8%')
    },
    offerImage: {
        width: wp('7%'),
        height: wp('7%')
    },
    offerText: {
        flex: 1,
        marginLeft: wp('3%')
    },
    circle: {
        width: wp('4.2%'),
        height: wp('4.2%')
    },
    sendContainer: {
        borderWidth: 1,
        borderColor: '#DADADA',
        marginHorizontal: wp('5%'),
        borderRadius: 10,
        alignItems: 'center',
        paddingVertical: wp('3%'),
        marginTop: hp('1.5%'),
        paddingHorizontal: wp('2%')
    },
    sendContainerTextOne: {
        fontFamily: FONTS.poppins.regular,
        color: '#000000',
        fontSize: wp('3.72%'),
    },
    sendContainerTextTwo: {
        color: '#7D7D7D',
        fontFamily: FONTS.poppins.light,
        fontSize: wp('3.25%')
    },
    sendContainerInnerView: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: 10,
        alignItems: "center",
        height: hp('6.3%'),
        marginTop: hp('3%'),
        paddingHorizontal: wp('2%')
    },
    sendTextInput: {
        flex: 1,
        fontFamily: FONTS.poppins.light,
        fontSize: wp('3.72%'),
        color: '#000000'
    },
    sendImage: {
        width: wp('18.6%'),
        height: hp('4.3%'),
        resizeMode: 'contain'
    },
    logoutContainer: {
        width: wp('90.7%'),
        height: hp('5.4%'),
        borderWidth: 1,
        borderColor: '#FF0000',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: hp('3%'),
        marginBottom: hp('2%')
    },
    logoutText: {
        color: '#FF0000',
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.25%')
    }
})
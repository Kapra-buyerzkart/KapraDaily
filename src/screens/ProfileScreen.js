import { View, Text, StyleSheet, Touchable, TouchableOpacity, Image, ScrollView, TextInput, Clipboard } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import LinearGradient from 'react-native-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { FONTS } from '../styles/typography'
import { getAccessToken } from '../api/tokenService'
import LoginScreen from './LoginScreen'
import { AppContext } from '../context/appContext'
import { LoaderContext } from '../context/loaderContext'
import CouponModal from '../components/CouponModal'
import { getAvailableCouponsApi, getAvailableGiftCardsApi } from '../api/cartService'
import Toast from 'react-native-simple-toast'
import { requestProductApi } from '../api/userService'
import StoreUnavailable from '../components/StoreUnavailable'
import LocationModal from '../components/LocationModal'
import ConfirmationModal from '../components/ConfirmationModal'

export default function ProfileScreen() {
    const [accessToken, setAccessToken] = useState(null);
    const navigation = useNavigation()
    const { profile, loadProfile, logout, isStoreUnavailable, storeUnavailableData } = useContext(AppContext);
    const { showLoader } = useContext(LoaderContext);
    const [offersModalVisible, setOffersModalVisible] = useState(false);
    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [availableGiftCards, setAvailableGiftCards] = useState([]);
    const [isGiftCard, setIsGiftCard] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [requestText, setRequestText] = useState('');
    const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

    const handleRequestProduct = async () => {
        if (!requestText.trim()) return;

        try {
            setIsSubmittingRequest(true);
            const response = await requestProductApi({ requestdetails: requestText });
            if (response && response.success) {
                alert('Thank you! Your request has been submitted.');
                setRequestText('');
            } else {
                alert(response?.message || 'Failed to submit request. Please try again.');
            }
        } catch (error) {
            console.error('Request product error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmittingRequest(false);
        }
    };

    // useEffect(() => {
    //     const fetchProfile = async () => {
    //         showLoader(true)
    //         await loadProfile()
    //         showLoader(false)
    //     }
    //     fetchProfile()
    // }, [])

    // if (!profile) {
    //     return <LoginScreen />
    // }

    useEffect(() => {
        const fetchProfile = async () => {
            showLoader(true);
            await loadProfile();
            showLoader(false);
            // setIsProfileLoaded(true);   // ✅ IMPORTANT
        };
        fetchProfile();
    }, []);

    const handleLogout = async () => {
        await logout()
        navigation.reset({
            index: 0,
            routes: [{
                name: 'LoginScreen',
                params: {
                    type: 'login'
                }
            }],
        })
    }

    useEffect(() => {
        fetchOffers();
    }, [profile]);

    const fetchOffers = async () => {
        try {
            const pincodeAreaId = profile?.pincode || profile?.pincodeAreaId;
            const [couponsRes, giftCardsRes] = await Promise.all([
                getAvailableCouponsApi(pincodeAreaId),
                getAvailableGiftCardsApi(pincodeAreaId)
            ]);

            if (couponsRes && couponsRes.data) {
                const coupons = couponsRes.data.items || (Array.isArray(couponsRes.data) ? couponsRes.data : []);
                setAvailableCoupons(coupons);
            }
            if (giftCardsRes && giftCardsRes.data) {
                const giftCards = giftCardsRes.data.items || (Array.isArray(giftCardsRes.data) ? giftCardsRes.data : []);
                setAvailableGiftCards(giftCards);
            }
        } catch (error) {
            console.log('Error fetching offers:', error);
        }
    };

    const openOffersModal = (type) => {
        setIsGiftCard(type === 'Gift Cards');
        setCouponCode('');
        setOffersModalVisible(true);
    };

    const handleApplyCoupon = (codeToApply) => {
        const code = codeToApply || couponCode;
        if (!code) {
            Toast.show('Please enter a code', Toast.SHORT);
            return;
        }
        // Copy functionality
        Clipboard.setString(code);
        Toast.show(`Code: ${code} copied to clipboard`, Toast.SHORT);
        setOffersModalVisible(false);
    };

    return (
        <SafeAreaView edges={['top']} style={styles.mainConatiner}>
            {console.log('profilescreen', profile)}
            <ScrollView>
                <LinearGradient
                    colors={['#FFE7DB', '#FFFFFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
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
                            {/* <TouchableOpacity>
                                <Image source={require('../assets/images/dots.png')} style={styles.dotsIcon} />
                            </TouchableOpacity> */}
                        </View>
                        <View style={styles.userView}>
                            <View style={styles.userAvatarContainer}>
                                {profile?.isPrivileged && (
                                    <Image source={require('../assets/images/crown.png')} style={styles.profileCrown} />
                                )}
                                <View style={styles.userIconBorder}>
                                    <FontAwesome6 name="user" size={wp('5%')} color="#D2B200" />
                                </View>
                            </View>
                            <View style={styles.userNamePhoneView}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.userNameText}>{profile.custName}</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('EditProfileScreen')} style={{ marginLeft: wp('2%') }}>
                                        <MaterialIcons name="edit" size={wp('4%')} color="#F25000" />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.phoneNumberStyle}>{profile.phoneNo}</Text>
                            </View>
                            <TouchableOpacity onPress={() => navigation.navigate('BCoinScreen')} style={styles.bcoinContainer}>
                                <Image style={styles.bcoinImage} source={require('../assets/images/rupee.png')} />
                                <Text style={styles.bcoinText}>{profile.totalBCoins}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.containerTwo}>
                    <TouchableOpacity onPress={() => navigation.navigate('SavedAddressScreen')} style={styles.saveAddressContainer}>
                        <Image style={styles.saveAddressImage} source={require('../assets/images/location_two.png')} />
                        <Text style={styles.saveAddressText}>Saved Address</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("MyOrdersScreen")} style={styles.saveAddressContainer}>
                        <Image style={styles.saveAddressImage} source={require('../assets/images/order.png')} />
                        <Text style={styles.saveAddressText}>My Orders</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("ReferralScreen")} style={styles.saveAddressContainer}>
                        <Image style={styles.saveAddressImage} source={require('../assets/images/refer.png')} />
                        <Text style={styles.saveAddressText}>Refer</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.containerThree}>
                    <Text style={styles.offersText}>Offers</Text>

                    <TouchableOpacity onPress={() => openOffersModal('Gift Cards')} style={styles.offerView}>
                        <Image style={styles.offerImage} source={require('../assets/images/smart_point.png')} />
                        <Text style={styles.offerText}>Gift Card</Text>
                        <AntDesign name={"right"} color={'#DADADA'} size={wp('4.4%')} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openOffersModal('Coupons')} style={styles.offerView}>
                        <Image style={styles.offerImage} source={require('../assets/images/coupon.png')} />
                        <Text style={styles.offerText}>Coupon</Text>
                        <AntDesign name={"right"} color={'#DADADA'} size={wp('4.4%')} />
                    </TouchableOpacity>
                </View>

                <View style={styles.containerThree}>
                    <Text style={styles.offersText}>My Account</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Wishlist')} style={[styles.offerView, { paddingVertical: wp('3%') }]}>
                        <Ionicons name="heart-outline" color={'#F25000'} size={wp('5.5%')} />
                        <Text style={styles.offerText}>My Wishlist</Text>
                        <AntDesign name={"right"} color={'#DADADA'} size={wp('4.4%')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('MyOrdersScreen')} style={[styles.offerView, { paddingVertical: wp('3%') }]}>
                        <Ionicons name="receipt-outline" color={'#F25000'} size={wp('5.5%')} />
                        <Text style={styles.offerText}>My Orders</Text>
                        <AntDesign name={"right"} color={'#DADADA'} size={wp('4.4%')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('CartScreen')} style={[styles.offerView, { paddingVertical: wp('3%') }]}>
                        <Ionicons name="cart-outline" color={'#F25000'} size={wp('5.5%')} />
                        <Text style={styles.offerText}>My Cart</Text>
                        <AntDesign name={"right"} color={'#DADADA'} size={wp('4.4%')} />
                    </TouchableOpacity>
                </View>

                <View style={styles.containerThree}>
                    <Text style={styles.offersText}>Account Security</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('UpdateContactScreen', { type: 'phone' })} style={[styles.offerView, { paddingVertical: wp('3%') }]}>
                        <MaterialIcons name="phone-android" color={'#F25000'} size={wp('5.5%')} />
                        <Text style={styles.offerText}>Update Phone Number</Text>
                        <AntDesign name={"right"} color={'#DADADA'} size={wp('4.4%')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('UpdateContactScreen', { type: 'email' })} style={[styles.offerView, { paddingVertical: wp('3%') }]}>
                        <MaterialIcons name="email" color={'#F25000'} size={wp('5.5%')} />
                        <Text style={styles.offerText}>Update Email ID</Text>
                        <AntDesign name={"right"} color={'#DADADA'} size={wp('4.4%')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('ChangePasswordScreen')} style={[styles.offerView, {
                        paddingVertical: wp('3%')
                    }]}>
                        <MaterialIcons name="lock" color={'#F25000'} size={wp('5.5%')} />
                        <Text style={styles.offerText}>Change Password</Text>
                        <AntDesign name={"right"} color={'#DADADA'} size={wp('4.4%')} />
                    </TouchableOpacity>
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
                            style={styles.sendTextInput}
                            value={requestText}
                            onChangeText={setRequestText}
                        />
                        <TouchableOpacity
                            onPress={handleRequestProduct}
                            disabled={isSubmittingRequest}
                            style={styles.sendButton}
                        >
                            <Text style={styles.sendButtonText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity onPress={() => setIsLogoutModalVisible(true)} style={styles.logoutContainer}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView >

            <CouponModal
                visible={offersModalVisible}
                onClose={() => setOffersModalVisible(false)}
                isGiftCard={isGiftCard}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                onApply={handleApplyCoupon}
                availableCoupons={availableCoupons}
                availableGiftCards={availableGiftCards}
                onCouponClick={handleApplyCoupon}
                isCopyOnly={true}
            />
            <LocationModal
                visible={isLocationModalVisible}
                onClose={() => setIsLocationModalVisible(false)}
            />

            <ConfirmationModal
                visible={isLogoutModalVisible}
                onClose={() => setIsLogoutModalVisible(false)}
                onConfirm={handleLogout}
                title="Log Out"
                message="Are you sure you want to log out?"
                confirmText="Log Out"
                cancelText="Cancel"
            />
        </SafeAreaView >
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
    userAvatarContainer: {
        alignItems: 'center',
    },
    userIconBorder: {
        height: wp('10%'),
        width: wp('10%'),
        borderRadius: wp('5%'),
        borderWidth: 1,
        borderColor: '#D2B200',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    profileCrown: {
        width: wp('5%'),
        height: wp('4%'),
        resizeMode: 'contain',
        marginBottom: hp('-0.5%'),
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
        // width: wp('12%'),
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
        color: '#000000',
        marginLeft: wp('2%')
    },
    containerTwo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: 'red',
        paddingTop: wp('5%'),
        borderTopLeftRadius: wp('7%'),
        borderTopRightRadius: wp('7%'),
        marginTop: hp('2%'),
        borderWidth: 1,
        borderColor: '#00000040',
        borderBottomWidth: 0,
        paddingHorizontal: wp('5%'),
    },
    saveAddressContainer: {
        // flexDirection: 'row',
        alignItems: 'center',
        width: wp('27.21%'),
        height: hp('8.92%'),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#DADADA',
        justifyContent: "space-between",
        // paddingLeft: wp('3%'),
        paddingVertical: hp('0.8%')
    },
    saveAddressImage: {
        height: wp('9.3%'),
        width: wp('9.3%'),
        resizeMode: 'contain'
    },
    saveAddressText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.25%'),
        // marginLeft: wp('2%')
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
        width: wp('5.5%'),
        height: wp('5.5%'),
        resizeMode: 'contain'
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
    sendButton: {
        backgroundColor: '#F25000',
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('0.5%'),
        borderRadius: 15,
        height: hp('4.3%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.2%'),
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
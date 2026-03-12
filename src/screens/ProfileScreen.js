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

    const GradientUserIcon = ({ size }) => {
        return (
            <LinearGradient
                colors={['#848484', '#606060']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: size / 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <FontAwesome6 name="user-large" size={size * 0.55} color="#D2B200" style={{ marginTop: size * 0.15 }} solid />
            </LinearGradient>
        );
    };

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

                <View style={{}}>
                    <LinearGradient
                        colors={['#FFE7DB', '#FFFFFF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                    >
                        <View style={styles.topView}>

                            <View style={{}}>
                                <View style={styles.headerView}>
                                    <TouchableOpacity onPress={() => navigation.goBack()}>
                                        <AntDesign
                                            name={'left'}
                                            size={wp('6%')}
                                            color={'#777777'}
                                        />
                                    </TouchableOpacity>
                                    <Text style={styles.profileHeaderText}>Profile</Text>
                                </View>
                                <View style={styles.userView}>
                                    <View style={styles.userAvatarContainer}>
                                        <View style={styles.profileIconView}>
                                            <GradientUserIcon size={wp('10%')} />
                                        </View>
                                        {profile?.isPrivileged && (
                                            <Image source={require('../assets/images/crown.png')} style={styles.profileCrown} />
                                        )}
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
                                        <View style={styles.bcoinIconCircle}>
                                            <Image style={styles.bcoinImage} source={require('../assets/images/bcoinimg.png')} />
                                        </View>
                                        <Text style={styles.bcoinText}>{(profile.totalBCoins).toFixed(2) || '0.00'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>


                            <View style={styles.containerTwo}>
                                <TouchableOpacity onPress={() => navigation.navigate('SavedAddressScreen')} style={styles.saveAddressContainer}>
                                    <View style={styles.actionIconView}>
                                        <MaterialIcons name="location-on" size={wp('8%')} color="#F25000" style={{}} />
                                    </View>
                                    <Text style={styles.saveAddressText}>{'Saved \nAddress'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate("MyOrdersScreen")} style={styles.saveAddressContainer}>
                                    <View style={styles.actionIconView}>
                                        <MaterialIcons name="shopping-bag" size={wp('8%')} color="#F25000" />
                                    </View>
                                    <Text style={styles.saveAddressText}>{'My \nOrders'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate("ReferralScreen")} style={styles.saveAddressContainer}>
                                    <View style={styles.actionIconView}>
                                        <Ionicons name="people" size={wp('8%')} color="#F25000" />
                                    </View>
                                    <Text style={styles.saveAddressText}>Refer</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
                <View style={styles.containerThree}>
                    <Text style={styles.sectionHeader}>Offers</Text>

                    <TouchableOpacity onPress={() => openOffersModal('Gift Cards')} style={styles.listItem}>
                        <LinearGradient
                            colors={['#FFF5F0', '#FFEBE0']}
                            style={styles.listIconCircle}
                        >
                            <Image style={styles.listIcon} source={require('../assets/images/smart_point.png')} />
                        </LinearGradient>
                        <Text style={styles.listItemText}>Smart point</Text>
                        <AntDesign name={"right"} color={'#F25000'} size={wp('4%')} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => openOffersModal('Coupons')} style={styles.listItem}>
                        <LinearGradient
                            colors={['#FFF5F0', '#FFEBE0']}
                            style={styles.listIconCircle}
                        >
                            <Image style={styles.listIcon} source={require('../assets/images/coupon.png')} />
                        </LinearGradient>
                        <Text style={styles.listItemText}>Coupon</Text>
                        <AntDesign name={"right"} color={'#F25000'} size={wp('4%')} />
                    </TouchableOpacity>
                </View>

                <View style={styles.containerThree}>
                    <Text style={styles.sectionHeader}>Informations</Text>
                    <TouchableOpacity style={styles.listItem}>
                        <LinearGradient
                            colors={['#FFF5F0', '#FFEBE0']}
                            style={styles.listIconCircle}
                        >
                            <Ionicons name="shield-checkmark-outline" color={'#F25000'} size={wp('5%')} />
                        </LinearGradient>
                        <Text style={styles.listItemText}>Privacy Policy</Text>
                        <AntDesign name={"right"} color={'#F25000'} size={wp('4%')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.listItem}>
                        <LinearGradient
                            colors={['#FFF5F0', '#FFEBE0']}
                            style={styles.listIconCircle}
                        >
                            <Ionicons name="document-text-outline" color={'#F25000'} size={wp('5%')} />
                        </LinearGradient>
                        <Text style={styles.listItemText}>Terms Of Use</Text>
                        <AntDesign name={"right"} color={'#F25000'} size={wp('4%')} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.listItem}>
                        <LinearGradient
                            colors={['#FFF5F0', '#FFEBE0']}
                            style={styles.listIconCircle}
                        >
                            <Ionicons name="information-circle-outline" color={'#F25000'} size={wp('5%')} />
                        </LinearGradient>
                        <Text style={styles.listItemText}>About Us</Text>
                        <AntDesign name={"right"} color={'#F25000'} size={wp('4%')} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('SupportTicketsListScreen')} style={styles.listItem}>
                        <LinearGradient
                            colors={['#FFF5F0', '#FFEBE0']}
                            style={styles.listIconCircle}
                        >
                            <Ionicons name="help-circle-outline" color={'#F25000'} size={wp('5.5%')} />
                        </LinearGradient>
                        <Text style={styles.listItemText}>Help & Support</Text>
                        <AntDesign name={"right"} color={'#F25000'} size={wp('4.4%')} />
                    </TouchableOpacity>
                </View>

                <View style={styles.containerThree}>
                    <Text style={styles.sectionHeader}>My Account</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Wishlist')} style={styles.listItem}>
                        <LinearGradient
                            colors={['#FFF5F0', '#FFEBE0']}
                            style={styles.listIconCircle}
                        >
                            <Ionicons name="heart-outline" color={'#F25000'} size={wp('5.5%')} />
                        </LinearGradient>
                        <Text style={styles.listItemText}>My Wishlist</Text>
                        <AntDesign name={"right"} color={'#F25000'} size={wp('4.4%')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('MyOrdersScreen')} style={styles.listItem}>
                        <LinearGradient
                            colors={['#FFF5F0', '#FFEBE0']}
                            style={styles.listIconCircle}
                        >
                            <Ionicons name="receipt-outline" color={'#F25000'} size={wp('5.5%')} />
                        </LinearGradient>
                        <Text style={styles.listItemText}>My Orders</Text>
                        <AntDesign name={"right"} color={'#F25000'} size={wp('4.4%')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('CartScreen')} style={styles.listItem}>
                        <LinearGradient
                            colors={['#FFF5F0', '#FFEBE0']}
                            style={styles.listIconCircle}
                        >
                            <Ionicons name="cart-outline" color={'#F25000'} size={wp('5.5%')} />
                        </LinearGradient>
                        <Text style={styles.listItemText}>My Cart</Text>
                        <AntDesign name={"right"} color={'#F25000'} size={wp('4.4%')} />
                    </TouchableOpacity>
                </View>

                <View style={styles.containerThree}>
                    <Text style={styles.sectionHeader}>Account Security</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('UpdateContactScreen', { type: 'phone' })} style={styles.listItem}>
                        <LinearGradient
                            colors={['#FFF5F0', '#FFEBE0']}
                            style={styles.listIconCircle}
                        >
                            <MaterialIcons name="phone-android" color={'#F25000'} size={wp('5.5%')} />
                        </LinearGradient>
                        <Text style={styles.listItemText}>Update Phone Number</Text>
                        <AntDesign name={"right"} color={'#F25000'} size={wp('4.4%')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('UpdateContactScreen', { type: 'email' })} style={styles.listItem}>
                        <LinearGradient
                            colors={['#FFF5F0', '#FFEBE0']}
                            style={styles.listIconCircle}
                        >
                            <MaterialIcons name="email" color={'#F25000'} size={wp('5.5%')} />
                        </LinearGradient>
                        <Text style={styles.listItemText}>Update Email ID</Text>
                        <AntDesign name={"right"} color={'#F25000'} size={wp('4.4%')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('ChangePasswordScreen')} style={styles.listItem}>
                        <LinearGradient
                            colors={['#FFF5F0', '#FFEBE0']}
                            style={styles.listIconCircle}
                        >
                            <MaterialIcons name="lock" color={'#F25000'} size={wp('5.5%')} />
                        </LinearGradient>
                        <Text style={styles.listItemText}>Change Password</Text>
                        <AntDesign name={"right"} color={'#F25000'} size={wp('4.4%')} />
                    </TouchableOpacity>
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

                <TouchableOpacity onPress={() => setIsLogoutModalVisible(true)} style={styles.logoutBtn}>
                    <Text style={styles.logoutBtnText}>Log Out</Text>
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
        paddingTop: hp('1%'),
        alignItems: "center",
        paddingHorizontal: wp('4.65%'),
        justifyContent: 'space-between',
        paddingVertical: hp('1%')
    },
    topGradient: {
        borderBottomLeftRadius: wp('10%'),
        borderBottomRightRadius: wp('10%'),
        paddingBottom: hp('2%'),
    },
    backButton: {
        width: wp('10%'),
        height: wp('10%'),
        justifyContent: 'center',
    },
    topView: {
        // backgroundColor: '#FFE7DB',
        borderBottomLeftRadius: wp('8%'),
        borderBottomRightRadius: wp('8%'),
        marginTop: hp('2%'),
        borderWidth: 1,
        borderColor: '#b4b1b140',
        borderBottomWidth: 1,
        borderTopWidth: 0,
        paddingVertical: hp('2%'),
        //  paddingHorizontal: wp('5%'),
    },
    profileHeaderText: {
        color: '#000000',
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('5.5%'),
        flex: 1,
        marginLeft: wp('5%')
    },
    userView: {
        flexDirection: 'row',
        paddingHorizontal: wp('6%'),
        marginTop: hp('2%'),
        alignItems: 'center'
    },
    userAvatarContainer: {
        position: 'relative',
    },
    profileIconView: {
        width: wp("12%"),
        height: wp("12%"),
        borderRadius: wp("6%"),
        borderWidth: 1,
        borderColor: "#D2B200",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#FFFFFF',
    },
    profileCrown: {
        position: 'absolute',
        //  top: hp('3%'),
        alignSelf: 'center',
        width: wp('6%'),
        height: hp('2%'),
        resizeMode: 'contain',
        zIndex: 2,
    },
    userNamePhoneView: {
        flex: 1,
        marginLeft: wp('4%')
    },
    userNameText: {
        color: '#000000',
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4.8%')
    },
    phoneNumberStyle: {
        fontSize: wp('3.2%'),
        fontFamily: FONTS.poppins.medium,
        color: '#71717A',
        marginTop: hp('0.2%')
    },
    bcoinContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F25000',
        borderRadius: 25,
        height: hp('3.5%'),
        paddingLeft: wp('0.5%'),
        paddingRight: wp('3%'),
        backgroundColor: '#FFFFFF',
    },
    bcoinIconCircle: {
        width: wp('7%'),
        height: wp('7%'),
        borderRadius: wp('3.5%'),
        // backgroundColor: '#F25000',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('2%'),
    },
    bcoinImage: {
        width: wp('4.8%'),
        height: wp('4.8%'),
        tintColor: '#f25000',
        //  tintColor: '#FFFFFF',
        resizeMode: 'contain',
    },
    bcoinText: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('3.8%'),
        color: '#F25000',
    },
    containerTwo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: 'red',
        paddingTop: wp('5%'),
        //  borderTopLeftRadius: wp('7%'),
        //  borderTopRightRadius: wp('7%'),
        marginTop: hp('2%'),
        //  borderWidth: 1,
        //  borderColor: '#00000040',
        //   borderBottomWidth: 0,
        paddingHorizontal: wp('5%'),
    },
    saveAddressContainer: {
        // flexDirection: 'row',
        alignItems: 'center',
        width: wp('25.21%'),
        height: hp('9.5%'),
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#DADADA',
        justifyContent: "center",
        // paddingLeft: wp('3%'),
        paddingVertical: hp('0.5%')
    },
    actionIconView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp('0.2%'),
    },
    saveAddressImage: {
        height: wp('9.3%'),
        width: wp('9.3%'),
        resizeMode: 'contain'
    },
    saveAddressText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.25%'),
        // bottom: hp('2%'),
        textAlign: 'center',
        // marginLeft: wp('2%')
    },
    containerThree: {
        paddingHorizontal: wp('5%'),
        marginTop: hp('2.5%')
    },
    sectionHeader: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4.8%'),
        color: '#000000',
        marginBottom: hp('1%')
    },
    listItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        padding: wp('2%'),
        marginBottom: hp('1%'),
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        justifyContent: 'space-between',
    },
    listIconCircle: {
        width: wp('10%'),
        height: wp('10%'),
        borderRadius: wp('5%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('3%'),
    },
    listIcon: {
        width: wp('5.5%'),
        height: wp('5.5%'),
        resizeMode: 'contain'
    },
    listItemText: {
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
    logoutBtn: {
        marginTop: hp('4%'),
        marginBottom: hp('6%'),
        alignSelf: 'center',
    },
    logoutBtnText: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4%'),
        color: '#FF0000',
        textDecorationLine: 'underline',
    },
})
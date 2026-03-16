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
import StoreUnavailable from '../components/StoreUnavailable'
import LocationModal from '../components/LocationModal'
import ConfirmationModal from '../components/ConfirmationModal'
import { getWalletDataApi } from '../api/userService'
import CoinCountSVG from '../components/CoinCountSVG'
import {
    LocationIcon,
    OrderIcon,
    ReferIcon,
    SmartPointIcon,
    PrivacyIcon,
    TermsIcon,
    AboutIcon,
    CouponIcon
} from '../components/ProfileIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import DeviceInfo from 'react-native-device-info';

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
    const [walletData, setWalletData] = useState(null);

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
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        try {
            const response = await getWalletDataApi();
            if (response && response.success) {
                setWalletData(response.data);
            }
        } catch (error) {
            console.error('Error fetching wallet data:', error);
        }
    };

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
                <Image source={require('../assets/images/profile.png')} style={styles.profileIcon} resizeMode="contain" />
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
                                    <TouchableOpacity onPress={() => navigation.navigate('BCoinScreen')} style={styles.tokenContainer}>
                                        <CoinCountSVG width={wp('14%')} height={hp('5%')} style={styles.tokenSvg} />
                                        <Text style={styles.tokenText}>{walletData?.wallet?.bTokens || '0'} B</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>


                            <View style={styles.containerTwo}>
                                <TouchableOpacity onPress={() => navigation.navigate('SavedAddressScreen')} style={styles.saveAddressContainer}>
                                    <View style={styles.actionIconView}>
                                        <LocationIcon width={wp('5%')} height={wp('5%')} />
                                    </View>
                                    <Text style={styles.saveAddressText}>{'Saved \nAddress'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate("MyOrdersScreen")} style={styles.saveAddressContainer}>
                                    <View style={styles.actionIconView}>
                                        <OrderIcon width={wp('5%')} height={wp('5%')} />
                                    </View>
                                    <Text style={styles.saveAddressText}>{'My \nOrders'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate("ReferralScreen")} style={styles.saveAddressContainer}>
                                    <View style={styles.actionIconView}>
                                        <ReferIcon width={wp('5%')} height={wp('5%')} />
                                    </View>
                                    <Text style={styles.saveAddressText}>Refer</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                <View style={styles.sectionsContainer}>
                    <Text style={styles.sectionHeader}>Offers</Text>
                    <View style={styles.sectionCard}>
                        <TouchableOpacity onPress={() => openOffersModal('Gift Cards')} style={styles.listItem}>
                            <View style={styles.listItemLeft}>
                                <View style={styles.listIconWrapper}>
                                    <SmartPointIcon width={wp('6%')} height={wp('6%')} />
                                </View>
                                <Text style={styles.listItemText}>Smart point</Text>
                            </View>
                            <AntDesign name={"right"} color={'#777777'} size={wp('3.5%')} />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity onPress={() => openOffersModal('Coupons')} style={styles.listItem}>
                            <View style={styles.listItemLeft}>
                                <View style={styles.listIconWrapper}>
                                    <MaterialCommunityIcons name="ticket-percent-outline" color={'#F25000'} size={wp('4%')} />
                                </View>
                                <Text style={styles.listItemText}>Coupon</Text>
                            </View>
                            <AntDesign name={"right"} color={'#777777'} size={wp('3.5%')} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionHeader}>My Account</Text>
                    <View style={styles.sectionCard}>
                        <TouchableOpacity onPress={() => navigation.navigate('Wishlist')} style={styles.listItem}>
                            <View style={styles.listItemLeft}>
                                <View style={styles.listIconWrapper}>
                                    <Ionicons name="heart-outline" color={'#F25000'} size={wp('4%')} />
                                </View>
                                <Text style={styles.listItemText}>My Wishlist</Text>
                            </View>
                            <AntDesign name={"right"} color={'#777777'} size={wp('3.5%')} />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity onPress={() => navigation.navigate('MyOrdersScreen')} style={styles.listItem}>
                            <View style={styles.listItemLeft}>
                                <View style={styles.listIconWrapper}>
                                    <Ionicons name="receipt-outline" color={'#F25000'} size={wp('4%')} />
                                </View>
                                <Text style={styles.listItemText}>My Orders</Text>
                            </View>
                            <AntDesign name={"right"} color={'#777777'} size={wp('3.5%')} />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity onPress={() => navigation.navigate('CartScreen')} style={styles.listItem}>
                            <View style={styles.listItemLeft}>
                                <View style={styles.listIconWrapper}>
                                    <Ionicons name="cart-outline" color={'#F25000'} size={wp('4%')} />
                                </View>
                                <Text style={styles.listItemText}>My Cart</Text>
                            </View>
                            <AntDesign name={"right"} color={'#777777'} size={wp('3.5%')} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionHeader}>Account Security</Text>
                    <View style={styles.sectionCard}>
                        <TouchableOpacity onPress={() => navigation.navigate('UpdateContactScreen', { type: 'phone' })} style={styles.listItem}>
                            <View style={styles.listItemLeft}>
                                <View style={styles.listIconWrapper}>
                                    <MaterialCommunityIcons name="phone-outline" color={'#F25000'} size={wp('4%')} />
                                </View>
                                <Text style={styles.listItemText}>Update Phone Number</Text>
                            </View>
                            <AntDesign name={"right"} color={'#777777'} size={wp('3.5%')} />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity onPress={() => navigation.navigate('UpdateContactScreen', { type: 'email' })} style={styles.listItem}>
                            <View style={styles.listItemLeft}>
                                <View style={styles.listIconWrapper}>
                                    <MaterialCommunityIcons name="email-outline" color={'#F25000'} size={wp('4%')} />
                                </View>
                                <Text style={styles.listItemText}>Update Email ID</Text>
                            </View>
                            <AntDesign name={"right"} color={'#777777'} size={wp('3.5%')} />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity onPress={() => navigation.navigate('ChangePasswordScreen')} style={styles.listItem}>
                            <View style={styles.listItemLeft}>
                                <View style={styles.listIconWrapper}>
                                    <MaterialCommunityIcons name="lock-outline" color={'#F25000'} size={wp('4%')} />
                                </View>
                                <Text style={styles.listItemText}>Change Password</Text>
                            </View>
                            <AntDesign name={"right"} color={'#777777'} size={wp('3.5%')} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionHeader}>Informations</Text>
                    <View style={styles.sectionCard}>
                        <TouchableOpacity style={styles.listItem}>
                            <View style={styles.listItemLeft}>
                                <View style={styles.listIconWrapper}>
                                    <PrivacyIcon width={wp('6%')} height={wp('6%')} />
                                </View>
                                <Text style={styles.listItemText}>Privacy Policy</Text>
                            </View>
                            <AntDesign name={"right"} color={'#777777'} size={wp('3.5%')} />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.listItem}>
                            <View style={styles.listItemLeft}>
                                <View style={styles.listIconWrapper}>
                                    <TermsIcon width={wp('6%')} height={wp('6%')} />
                                </View>
                                <Text style={styles.listItemText}>Terms Of Use</Text>
                            </View>
                            <AntDesign name={"right"} color={'#777777'} size={wp('3.5%')} />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity style={styles.listItem}>
                            <View style={styles.listItemLeft}>
                                <View style={styles.listIconWrapper}>
                                    <AboutIcon width={wp('6%')} height={wp('6%')} />
                                </View>
                                <Text style={styles.listItemText}>About Us</Text>
                            </View>
                            <AntDesign name={"right"} color={'#777777'} size={wp('3.5%')} />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity onPress={() => navigation.navigate('SupportTicketsListScreen')} style={styles.listItem}>
                            <View style={styles.listItemLeft}>
                                <View style={styles.listIconWrapper}>
                                    <Ionicons name="help-circle-outline" color={'#F25000'} size={wp('4%')} />
                                </View>
                                <Text style={styles.listItemText}>Help & Support</Text>
                            </View>
                            <AntDesign name={"right"} color={'#777777'} size={wp('3.5%')} />
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity onPress={() => setIsLogoutModalVisible(true)} style={styles.listItem}>
                            <View style={styles.listItemLeft}>
                                <View style={styles.listIconWrapper}>
                                    <Ionicons name="log-out-outline" color={'#FF0000'} size={wp('4%')} />
                                </View>
                                <Text style={[styles.listItemText, { color: '#FF0000' }]}>Log Out</Text>
                            </View>
                            <AntDesign name={"right"} color={'#777777'} size={wp('3.5%')} />
                        </TouchableOpacity>
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

                <View style={styles.footerBranding}>
                    <Image source={require('../assets/images/logo.png')} style={styles.footerLogo} />
                    <Text style={styles.versionText}>Version {DeviceInfo.getVersion()}</Text>
                </View>
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
    tokenContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('2%'),
        position: 'relative',
    },
    tokenSvg: {
    },
    tokenText: {
        position: 'absolute',
        bottom: hp('1%'),
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('2.8%'),
        color: '#000000',
        textAlign: 'center',
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
        width: wp('27.21%'),
        height: hp('11.5%'),
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#DADADA',
        justifyContent: "center",
        backgroundColor: '#FFFFFF',
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
        textAlign: 'center',
    },
    sectionHeader: {
        fontFamily: FONTS.outfit.semiBold,
        fontSize: wp('4.2%'),
        color: '#000000',
        marginBottom: hp('1.2%'),
        marginTop: hp('1%')
    },
    sectionsContainer: {
        paddingHorizontal: wp('5%'),
        marginTop: hp('2%'),
    },
    sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        paddingVertical: hp('0.5%'),
        marginBottom: hp('0.5%'),
        // Shadow for premium look
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('4%'),
        justifyContent: 'space-between',
    },
    listItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listIconWrapper: {
        width: wp('6%'),
        height: wp('6%'),
        backgroundColor: '#FFE7DB',
        borderRadius: wp('3%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    listItemText: {
        marginLeft: wp('3%'),
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3.2%'),
        color: '#333333'
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginHorizontal: wp('4%'),
    },
    circle: {
        width: wp('4.2%'),
        height: wp('4.2%')
    },
    sendContainer: {
        // borderWidth: 1,
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
        paddingBottom: 10,
        lineHeight: wp('3.72%') * 1.2,
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
        borderRadius: 50,
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
        borderRadius: 40,
        height: hp('4.3%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.5%'),
    },
    sendImage: {
        width: wp('18.6%'),
        height: hp('4.3%'),
        resizeMode: 'contain'
    },
    profileIcon: {
        width: wp('7%'),
        height: wp('7%'),
        // borderRadius: wp('3.5%'),
        // position: 'absolute',
        // top: 15,
        // left: 5,
        alignSelf: 'center'
    },
    footerBranding: {
        alignItems: 'center',
        marginTop: hp('4%'),
        marginBottom: hp('6%'),
    },
    footerLogo: {
        width: wp('35%'),
        height: hp('10%'),
        resizeMode: 'contain',
        opacity: 0.9,
    },
    versionText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3%'),
        color: '#A1A1A1',
        marginTop: hp('0.1%'),
    },
})
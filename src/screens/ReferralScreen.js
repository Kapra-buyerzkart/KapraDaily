import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Share } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useNavigation } from '@react-navigation/native'
import { FONTS } from '../styles/typography'
import { getReferralHistoryApi } from '../api/userService'
import { LoaderContext } from '../context/loaderContext'
import { AppContext } from '../context/appContext'
import StoreUnavailable from '../components/StoreUnavailable'
import LocationModal from '../components/LocationModal'
import CONFIG from '../globals/config'
import LinearGradient from 'react-native-linear-gradient'
// import moment from 'moment'

const ReferralScreen = () => {
    const navigation = useNavigation()
    const { showLoader } = useContext(LoaderContext)
    const { profile, isStoreUnavailable, storeUnavailableData } = useContext(AppContext)
    const [referrals, setReferrals] = useState([])
    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false)
    const [isInitialLoad, setIsInitialLoad] = useState(true)

    useEffect(() => {
        fetchReferralHistory()
        console.log('profileelelle', profile);

    }, [])

    const fetchReferralHistory = async () => {
        try {
            showLoader(true)
            const response = await getReferralHistoryApi()
            console.log('Referral History Response:', response);
            if (response?.success) {
                const referralData = response?.data?.items || [];
                setReferrals(Array.isArray(referralData) ? referralData : []);
            }
        } catch (error) {
            console.error('Fetch Referral History Error:', error)
        } finally {
            showLoader(false)
            setIsInitialLoad(false)
        }
    }

    const renderItem = ({ item }) => {
        const formatDate = (dateString) => {
            if (!dateString) return '';
            const [date] = dateString.split('T');
            const [year, month, day] = date.split('-');
            return `${day}-${month}-${year}`;
        };

        const formattedDate = formatDate(item.createdAt);

        return (
            <View style={[styles.listItem, { height: 'auto', paddingVertical: hp('1.5%') }]}>
                <View style={styles.listItemLeft}>
                    <View style={styles.listIconWrapper}>
                        <View style={styles.userInitialCircle}>
                            <Text style={styles.userInitialText}>{(item.custName || 'U').charAt(0).toUpperCase()}</Text>
                        </View>
                    </View>
                    <View style={{ marginLeft: wp('3%') }}>
                        <Text style={styles.listItemText}>{item.custName || 'User'}</Text>
                    </View>
                </View>
                <View style={styles.listItemRight}>
                    <Text style={styles.registeredLabelMini}>Registered on</Text>
                    <Text style={styles.dateEndText}>{formattedDate}</Text>
                </View>
            </View>
        )
    }

    const renderEmpty = () => {
        if (isInitialLoad) return null;
        return (
            <View style={styles.emptyContainer}>
                {/* <Image
                    source={require('../assets/images/nowish.png')}
                    style={styles.emptyImage}
                /> */}
                <Text style={styles.emptyText}>No Referral History</Text>
            </View>
        );
    };

    const MaskedText = ({ value }) => {
        const lastTwo = value.slice(-2);
        const masked = '*'.repeat(value.length - 2);

        return (
            <View style={styles.container}>
                <Text style={styles.masked}>{masked}</Text>
                <Text style={styles.lastTwo}>{lastTwo}</Text>
            </View>
        );
    };

    const onShare = async () => {

        try {
            const shareUrl = `${CONFIG.referalUrl}refer/register?custrefcd=${profile?.referralCode || ''}`;
            const message = `Hey! Download KapraDaily and get fresh groceries delivered to your doorstep. Join me using my referral code: ${profile?.referalCode || 'WELCOME'} and enjoy exclusive rewards! Download now: ${shareUrl}`;
            await Share.share({
                message: message,
            });
        } catch (error) {
            console.error('Error sharing:', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={styles.leftArrowIcon} source={require('../assets/images/left_arrow.png')} />
                </TouchableOpacity>
                <Text style={styles.referralText}>Referral</Text>
                {/* <View style={styles.bcoinContainer}>
                    <Image style={styles.bcoinImage} source={require('../assets/images/rupee.png')} />
                    <Text style={styles.bcoinText}>{profile?.totalBCoins || '0.00'}</Text>
                </View> */}
            </View>
            {isStoreUnavailable ? (
                <View style={{ marginTop: hp('2%'), flex: 1 }}>
                    <StoreUnavailable
                        image={storeUnavailableData.image}
                        text={storeUnavailableData.text}
                        onChangeLocation={() => setIsLocationModalVisible(true)}
                    />
                </View>
            ) : (
                <View style={{ flex: 1 }}>

                    <>
                        <Text style={styles.referEarnText}>Refer and Earn</Text>
                        <LinearGradient colors={['#FFFFFF', '#FFE7DB']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.innerContainer}>
                            <Image style={styles.loudspeakerImageStyle} source={require('../assets/images/loud-speaker.png')} />
                            <Text style={styles.referralRewardText}>Referral reward you Earned</Text>
                            <View style={styles.bcoinContainerTwo}>
                                <Image style={styles.bcoinImageTwo} source={require('../assets/images/rupee.png')} />
                                <Text style={styles.bcoinTextTwo}>{profile?.referralEarning || referrals[0]?.totalTokensEarned || '0.00'}</Text>
                            </View>
                            <TouchableOpacity style={styles.sendInviteButton} onPress={onShare}>
                                <Image style={styles.sendIcon} source={require('../assets/images/share-icon.png')} />
                                <Text style={styles.sendInviteText}>Send invite</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                        <Text style={[styles.referEarnText, {
                            marginTop: hp('3%'),
                            marginBottom: hp('1%')
                        }]}>Referral History</Text>

                        <FlatList
                            data={referrals}
                            keyExtractor={(item, index) => `${item.referrerCustId}-${index}`}
                            renderItem={renderItem}
                            ListEmptyComponent={renderEmpty}

                            ItemSeparatorComponent={() => <View style={styles.divider} />}
                            ListFooterComponent={() => referrals.length > 0 ? <View style={{ height: hp('2%') }} /> : null}
                            style={referrals.length > 0 ? styles.historyListCard : null}
                            contentContainerStyle={referrals.length === 0 ? styles.emptyListContent : styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    </>
                </View>
            )}
            <LocationModal
                visible={isLocationModalVisible}
                onClose={() => setIsLocationModalVisible(false)}
            />
        </SafeAreaView>
    )
}

export default ReferralScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#FFFFFF"
    },
    headerContainer: {
        marginTop: hp('3%'),
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: wp('2%'),
        marginRight: wp('5%')
    },
    leftArrowIcon: {
        width: wp('10.33%'),
        height: hp('2.04%'),
        resizeMode: 'contain'
    },
    referralText: {
        color: '#000000',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.65%'),
        marginLeft: wp('2%'),
        flex: 1
    },
    bcoinContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F9A833',
        backgroundColor: '#FFBA331A',
        borderRadius: wp('2.33%'),
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('0.3%')
    },
    bcoinImage: {
        width: wp('4.65%'),
        height: wp('4.65%'),
        resizeMode: "contain"
    },
    bcoinText: {
        fontSize: wp('3.25%'),
        fontFamily: FONTS.poppins.regular,
        color: '#000000',
        marginLeft: wp('2%')
    },
    referEarnText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('4.19%'),
        color: '#000000',
        alignSelf: 'center',
        marginTop: hp('2%')
    },
    innerContainer: {
        width: wp('91.16%'),
        height: hp('35.63%'),
        borderWidth: 0.5,
        borderColor: '#DADADA',
        borderRadius: wp('2.33%'),
        alignSelf: 'center',
        marginTop: hp('1%'),
        alignItems: 'center'
    },
    loudspeakerImageStyle: {
        width: wp('48.37%'),
        height: wp('40.37%'),
        resizeMode: 'contain'
    },
    referralRewardText: {
        color: '#616161',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.72%')
    },
    bcoinContainerTwo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('1.4%')
    },
    bcoinImageTwo: {
        width: wp('7.67%'),
        height: wp('7.67%'),
        resizeMode: "contain"
    },
    bcoinTextTwo: {
        fontSize: wp('6.97%'),
        color: '#F9A833',
        fontFamily: FONTS.poppins.semiBold,
        marginLeft: wp('2%')
    },
    sendInviteButton: {
        flexDirection: 'row',
        width: wp('76.74%'),
        height: hp('5.36%'),
        backgroundColor: '#F25000',
        borderRadius: wp('2.33%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('0.8%')
    },
    sendIcon: {
        width: wp('5.12%'),
        height: hp('1.93%'),
        resizeMode: 'contain'
    },
    sendInviteText: {
        color: '#FFFFFF',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('4.19%'),
        marginLeft: wp('2.5%')
    },
    container: {
        flexDirection: 'row',
        // alignItems: 'flex-end',
    },
    masked: {
        fontSize: wp('4%'),
        letterSpacing: 1,
        color: '#000000'
    },
    lastTwo: {
        fontSize: wp('3.25%'),
        fontFamily: FONTS.poppins.regular,
        color: '#000000'
    },
    divider: {
        height: 1,
        backgroundColor: '#F2F2F2',
        marginHorizontal: wp('4%'),
    },
    historyListCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginHorizontal: wp('4%'),
        marginBottom: hp('1.5%'),
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F2F2F2',
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp('4%'),
    },
    listItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listItemRight: {
        alignItems: 'flex-end',
    },
    listIconWrapper: {
        width: wp('10%'),
        height: wp('10%'),
        borderRadius: wp('5%'),
        backgroundColor: '#FFE7DB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInitialCircle: {
        width: wp('8%'),
        height: wp('8%'),
        borderRadius: wp('4%'),
        backgroundColor: '#F25000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userInitialText: {
        color: '#FFFFFF',
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4%'),
    },
    listItemText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.8%'),
        color: '#000000',
    },
    registeredLabelMini: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('2.4%'),
        color: '#777777',
        marginBottom: -hp('0.2%'),
    },
    dateEndText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.2%'),
        color: '#F25000',
    },
    listContent: {
        paddingBottom: hp('5%'),
    },
    emptyListContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: hp('10%')
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('4%'),
        color: '#616161',
        marginTop: hp('2%')
    }
})
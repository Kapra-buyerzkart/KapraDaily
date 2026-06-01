import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Share, Clipboard, ActivityIndicator } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Toast from 'react-native-simple-toast'
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
// import moment from 'moment'

const ReferralScreen = () => {
    const navigation = useNavigation()
    const { showLoader } = useContext(LoaderContext)
    const { profile, isStoreUnavailable, storeUnavailableData } = useContext(AppContext)
    const [referrals, setReferrals] = useState([])
    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false)
    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const [pageNumber, setPageNumber] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const pageSize = 20;

    useEffect(() => {
        fetchReferralHistory(1);
    }, [])

    const fetchReferralHistory = async (page = 1) => {
        try {
            if (page === 1) {
                showLoader(true);
                setHasMoreData(true);
            } else {
                setIsFetchingMore(true);
            }
            const response = await getReferralHistoryApi(page, pageSize);
            console.log('Referral History Response:', response);
            if (response?.success && response?.data?.items) {
                const referralData = Array.isArray(response.data.items) ? response.data.items : [];
                if (page === 1) {
                    setReferrals(referralData);
                } else {
                    setReferrals(prev => [...prev, ...referralData]);
                }
                setPageNumber(page);
                if (referralData.length < pageSize) {
                    setHasMoreData(false);
                }
            } else {
                if (page === 1) setReferrals([]);
                setHasMoreData(false);
            }
        } catch (error) {
            console.error('Fetch Referral History Error:', error);
            if (page === 1) setReferrals([]);
            setHasMoreData(false);
        } finally {
            showLoader(false);
            setIsFetchingMore(false);
            setIsInitialLoad(false);
        }
    }

    const handleLoadMore = () => {
        if (!isFetchingMore && hasMoreData && !isInitialLoad) {
            fetchReferralHistory(pageNumber + 1);
        }
    };

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

    const copyToClipboard = () => {
        Clipboard.setString(profile?.referralCode || profile?.referalCode || 'WELCOME');
        Toast.show('Referral code copied!', Toast.SHORT);
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
            <View style={{ flex: 1 }}>

                <>
                    {/* <Text style={styles.referEarnText}>Refer and Earn</Text> */}
                    <View style={styles.solidPremiumCard}>
                        <View style={styles.solidHeaderRow}>
                            <Image style={styles.solidSpeakerIcon} source={require('../assets/images/loud-speaker.png')} />
                            <View style={styles.solidTitleCol}>
                                <Text style={styles.solidReferTitle}>Refer & Earn</Text>
                                <Text style={styles.solidSubTitle}>Get rewarded for every friend who shops using your invite.</Text>
                            </View>
                        </View>

                        <View style={styles.solidRewardBox}>
                            <Text style={styles.solidRewardLabel}>Total Rewards Earned</Text>
                            <View style={styles.solidRewardAmountRow}>
                                <Image source={require('../assets/images/bcoinn.png')} style={styles.solidCoinIcon} />
                                <Text style={styles.solidRewardValue}>{profile?.referralEarning || referrals[0]?.totalTokensEarned || '0.00'}</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.solidInviteBtn} onPress={onShare}>
                            <MaterialCommunityIcons name="share-variant" size={wp('5%')} color="#FFFFFF" />
                            <Text style={styles.solidBtnText}>Send Invite</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.referEarnText, {
                        marginTop: hp('3%'),
                        marginBottom: hp('1%')
                    }]}>Referral History</Text>

                    <FlatList
                        data={referrals}
                        keyExtractor={(item, index) => `${item.referrerCustId}-${index}`}
                        renderItem={renderItem}
                        ListEmptyComponent={renderEmpty}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        ItemSeparatorComponent={() => <View style={styles.divider} />}
                        ListFooterComponent={() => (
                            <>
                                {isFetchingMore && <ActivityIndicator size="small" color="#F25000" style={{ paddingVertical: 10 }} />}
                                {referrals.length > 0 && !isFetchingMore && <View style={{ height: hp('2%') }} />}
                            </>
                        )}
                        style={referrals.length > 0 ? [styles.historyListCard, { flex: 1 }] : { flex: 1 }}
                        contentContainerStyle={referrals.length === 0 ? styles.emptyListContent : styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                </>
            </View>

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
    headerContentContainer: {
        paddingBottom: hp('2%'),
        backgroundColor: '#FFFFFF',
    },
    headerRowMinimal: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp('4%'),
        marginTop: hp('1%')
    },
    speakerLeftSmall: {
        width: wp('20%'),
        height: wp('20%'),
        resizeMode: 'contain'
    },
    headerTextCol: {
        marginLeft: wp('3%'),
    },
    referTitleMain: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4.5%'),
        color: '#000000'
    },
    rewardSubText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('2.8%'),
        color: '#666666',
        marginTop: hp('0.2%')
    },
    rewardHighlightBox: {
        backgroundColor: '#F25000',
        borderRadius: wp('3%'),
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('5%'),
        marginTop: hp('1.5%'),
        width: wp('85%'),
        alignSelf: 'center',
        alignItems: 'center'
    },
    earnedLabel: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3%'),
        color: '#FFFFFF',
        opacity: 0.9
    },
    earnedValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('0.5%')
    },
    rupeeIconBox: {
        width: wp('4.5%'),
        height: wp('4.5%'),
        resizeMode: 'contain',
        tintColor: '#FFFFFF'
    },
    amountHighlight: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('6%'),
        color: '#FFFFFF',
        marginLeft: wp('1%')
    },
    refinedInviteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: wp('2%'),
        borderWidth: 1,
        borderColor: '#F25000',
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('4%'),
        marginTop: hp('2%'),
        alignSelf: 'center'
    },
    shareIconMini: {
        width: wp('4.1%'),
        height: wp('4.1%'),
        resizeMode: 'contain',
        tintColor: '#F25000'
    },
    refinedInviteBtnText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#F25000',
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
        // height: hp('35.63%'),
        borderWidth: 0.5,
        borderColor: '#DADADA',
        borderRadius: wp('2.33%'),
        alignSelf: 'center',
        marginTop: hp('1%'),
        alignItems: 'center',
        //  paddingVertical: hp('2%')
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
    modernReferralCard: {
        //  backgroundColor: '#FFFFFF',
        borderRadius: wp('5%'),
        width: wp('88%'),
        //  marginTop: hp('2%'),
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('5%'),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 15,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        alignItems: 'center'
    },
    modernRewardSection: {
        alignItems: 'center',
        // marginBottom: hp('1.5%')
    },
    modernRewardLabel: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3%'),
        color: '#71717A',
        marginBottom: hp('0.5%')
    },
    modernAmountRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    modernCurrency: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4%'),
        color: '#F25000',
        marginRight: wp('1%')
    },
    modernAmount: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('6%'),
        color: '#18181B'
    },
    modernDivider: {
        width: '100%',
        height: 1,
        backgroundColor: '#F4F4F5',
        marginVertical: hp('1%')
    },
    modernCodeSection: {
        width: '100%',
        alignItems: 'center',
        // marginBottom: hp('3%')
    },
    modernCodeLabel: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('2.9%'),
        color: '#71717A',
        marginBottom: hp('1.5%')
    },
    modernCodeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#FFF5F0',
        borderRadius: wp('3%'),
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('8%'),
        borderWidth: 1,
        borderColor: '#F2500030',
        borderStyle: 'dashed'
    },
    modernCodeText: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('5%'),
        color: '#F25000',
        letterSpacing: 2,
        marginRight: wp('3%')
    },
    modernTapToCopy: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('2.8%'),
        color: '#A1A1AA',
        marginTop: hp('0.8%'),
        marginBottom: hp('1%')
    },
    modernInviteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F25000',
        borderRadius: wp('10%'),
        paddingVertical: hp('1.8%'),
        paddingHorizontal: wp('12%'),
        width: '100%',
        justifyContent: 'center',
        shadowColor: "#F25000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8
    },
    modernInviteBtnText: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4.2%'),
        color: '#FFFFFF',
        marginLeft: wp('2.5%')
    },
    rewardCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: wp('4%'),
        padding: wp('5%'),
        width: wp('85%'),
        alignItems: 'center',
        marginTop: hp('2.5%'),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.8)',
    },
    rewardLabel: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#616161',
        marginBottom: hp('1%')
    },
    rewardValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('2.5%')
    },
    currencySymbol: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('6%'),
        color: '#F25000',
        marginRight: wp('1%')
    },
    rewardValue: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('9%'),
        color: '#F25000'
    },
    inviteButtonNew: {
        backgroundColor: '#F25000',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('10%'),
        borderRadius: wp('12%'),
        shadowColor: "#F25000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 8
    },
    inviteButtonTextNew: {
        color: '#FFFFFF',
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4.2%'),
        marginLeft: wp('2.5%')
    },
    shareIconWhite: {
        width: wp('5%'),
        height: wp('5%'),
        resizeMode: 'contain',
        tintColor: '#FFFFFF'
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
    },
    solidPremiumCard: {
        width: wp('92%'),
        alignSelf: 'center',
        marginTop: hp('2%'),
        backgroundColor: '#FFF2EB', // Very light orange/peach
        borderRadius: wp('5%'),
        padding: wp('5%'),
        borderColor: '#FFD1B3',
        borderWidth: 1,
    },
    solidHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('2%')
    },
    solidSpeakerIcon: {
        width: wp('15%'),
        height: wp('15%'),
        resizeMode: 'contain',
    },
    solidTitleCol: {
        marginLeft: wp('3%'),
        flex: 1
    },
    solidReferTitle: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('5.5%'),
        color: '#1A1A1A',
    },
    solidSubTitle: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3%'),
        color: '#666666',
        marginTop: hp('0.5%'),
    },
    solidRewardBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: wp('3%'),
        padding: wp('3%'),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    solidRewardLabel: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.2%'),
        color: '#777777',
        marginBottom: hp('0.5%')
    },
    solidRewardAmountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    solidCoinIcon: {
        width: wp('6%'),
        height: wp('6%'),
        resizeMode: 'contain',
        marginRight: wp('1.5%')
    },
    solidRewardValue: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('7%'),
        color: '#1A1A1A',
    },
    solidCodeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp('2.5%')
    },
    solidCodeLabel: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#444444',
    },
    solidCodeTouch: {
        backgroundColor: '#FFE1CC',
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('0.5%'),
        borderRadius: wp('2%'),
        marginLeft: wp('2%'),
        borderWidth: 1,
        borderColor: '#FFB880',
        borderStyle: 'dashed'
    },
    solidCodeText: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4%'),
        color: '#F25000',
        letterSpacing: 1,
    },
    solidInviteBtn: {
        backgroundColor: '#F25000',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp('10%'),
        paddingVertical: hp('1.5%'),
        marginTop: hp('2.5%'),
        shadowColor: '#F25000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5
    },
    solidBtnText: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4.2%'),
        color: '#FFFFFF',
        marginLeft: wp('2%')
    }
})      
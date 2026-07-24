import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Share,
} from 'react-native';
import icons from '@/assets/icons';
import images from '@/assets/images';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { FONTS } from '../styles/typography';
import { getReferralHistoryApi } from '../api/userService';
import { LoaderContext } from '../context/loaderContext';
import { AppContext } from '../context/appContext';
import CONFIG from '../globals/config';

const maskPhone = phone => {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '**********';
  return `**********${digits.slice(-2)}`;
};

const formatDate = dateString => {
  if (!dateString) return '';
  const [date] = String(dateString).split('T');
  const [year, month, day] = date.split('-');
  return `${day}-${month}-${year}`;
};

const ReferralHistoryScreen = () => {
  const navigation = useNavigation();
  const { showLoader } = useContext(LoaderContext);
  const { profile } = useContext(AppContext);
  const [referrals, setReferrals] = useState([]);
  const [rewardEarned, setRewardEarned] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const pageSize = 20;

  const displayReward = Number(
    rewardEarned ?? profile?.referralReward ?? profile?.totalBCoins ?? 0,
  ).toFixed(2);

  useEffect(() => {
    fetchReferralHistory(1);
  }, []);

  const fetchReferralHistory = async (page = 1) => {
    try {
      if (page === 1) {
        showLoader(true);
        setHasMoreData(true);
      } else {
        setIsFetchingMore(true);
      }
      const response = await getReferralHistoryApi(page, pageSize);
      if (response?.success && response?.data?.items) {
        const referralData = Array.isArray(response.data.items)
          ? response.data.items
          : [];
        if (page === 1) {
          setReferrals(referralData);
          if (response.data.totalReward != null) {
            setRewardEarned(response.data.totalReward);
          }
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
  };

  const handleLoadMore = () => {
    if (!isFetchingMore && hasMoreData && !isInitialLoad) {
      fetchReferralHistory(pageNumber + 1);
    }
  };

  const onShare = async () => {
    try {
      const shareUrl = `${CONFIG.referalUrl}refer/register?custrefcd=${
        profile?.referralCode || ''
      }`;
      const message = `Hey! Download UdenDeal and get fresh groceries delivered to your doorstep. Join me using my referral link.  Download now: ${shareUrl}`;
      await Share.share({ message });
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <View style={styles.listItemLeft}>
        <Text style={styles.nameText}>{item.custName || 'Name'}</Text>
        <Text style={styles.registeredText}>
          Registered on {formatDate(item.createdAt)}
        </Text>
      </View>
      <Text style={styles.phoneText}>
        {maskPhone(item.mobileNo || item.phone || item.custMobile)}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <>
      {/* Reward + share card */}
      <View style={styles.rewardCard}>
        <Text style={styles.rewardLabel}>Referral reward you Earned</Text>
        <View style={styles.rewardValueRow}>
          <Image source={images.bcoinn} style={styles.rewardCoin} />
          <Text style={styles.rewardValue}>{displayReward}</Text>
        </View>

        <TouchableOpacity
          style={styles.shareButton}
          activeOpacity={0.9}
          onPress={onShare}
        >
          <Image
            source={images.shareNearn}
            style={styles.shareImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Refer History</Text>
    </>
  );

  const renderEmpty = () => {
    if (isInitialLoad) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No Referral History</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity hitSlop={40} onPress={() => navigation.goBack()}>
          <Image
            source={icons.backArrowNew}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer and Earn</Text>
      </View>

      <FlatList
        data={referrals}
        keyExtractor={(item, index) => `${item.referrerCustId}-${index}`}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={() => <View style={{ height: hp('1.2%') }} />}
        ListFooterComponent={() =>
          isFetchingMore ? (
            <ActivityIndicator
              size="small"
              color="#F25000"
              style={{ paddingVertical: 10 }}
            />
          ) : (
            <View style={{ height: hp('2%') }} />
          )
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default ReferralHistoryScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    paddingTop: hp('1.5%'),
    paddingBottom: hp('1.8%'),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backIcon: {
    width: wp('5.5%'),
    height: wp('5.5%'),
    resizeMode: 'contain',
    tintColor: '#000000',
  },
  headerTitle: {
    color: '#000000',
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.65%'),
    marginLeft: wp('3%'),
    flex: 1,
  },
  listContent: {
    paddingHorizontal: wp('4%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('5%'),
  },
  rewardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('4%'),
    borderWidth: 1,
    borderColor: '#EFEFEF',
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('4%'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  rewardLabel: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.8%'),
    color: '#3A3A3A',
  },
  rewardValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.8%'),
  },
  rewardCoin: {
    width: wp('7%'),
    height: wp('7%'),
    resizeMode: 'contain',
    marginRight: wp('2%'),
  },
  rewardValue: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('9%'),
    color: '#000000',
  },
  shareButton: {
    alignSelf: 'stretch',
    marginTop: hp('2.2%'),
  },
  shareImage: {
    width: '100%',
    height: hp('7%'),
    borderRadius: wp('3%'),
  },
  sectionTitle: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.4%'),
    color: '#000000',
    marginTop: hp('2.5%'),
    marginBottom: hp('1.5%'),
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: '#F0F0F0',
    paddingVertical: hp('1.6%'),
    paddingHorizontal: wp('4%'),
  },
  listItemLeft: {
    flex: 1,
    marginRight: wp('3%'),
  },
  nameText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4%'),
    color: '#000000',
  },
  registeredText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3%'),
    color: '#9A9A9A',
    marginTop: hp('0.3%'),
  },
  phoneText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.6%'),
    color: '#3A3A3A',
    letterSpacing: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('6%'),
  },
  emptyText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('4%'),
    color: '#616161',
  },
});

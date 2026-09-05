import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Share,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { getReferralHistoryApi } from '../../api/services/userService';
import { useUser } from '../../context/UserContext';
import { LoaderContext } from '../../context/loaderContext';
import { colors } from '../../theme/colours';
import { AppIcons } from '../../assets/icons';
import KSHOPE_CONFIG from '../../globals/config';
import { styles } from './styles';

interface ReferralItem {
  referrerCustId: number;
  custName: string;
  createdAt: string;
  totalTokensEarned?: string | number;
}

const ReferralScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { profile } = useUser();
  const { showLoader } = useContext(LoaderContext);

  const [referrals, setReferrals] = useState<ReferralItem[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    fetchReferralHistory();
  }, []);

  const fetchReferralHistory = async () => {
    try {
      showLoader(true);
      const response = await getReferralHistoryApi();
      if (response?.success) {
        const referralData = response?.data?.items || [];
        setReferrals(Array.isArray(referralData) ? referralData : []);
      }
    } catch (error) {
      console.error('Fetch Referral History Error:', error);
    } finally {
      showLoader(false);
      setIsInitialLoad(false);
    }
  };

  const renderItem = ({ item }: { item: ReferralItem }) => {
    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const [date] = dateString.split('T');
      const [year, month, day] = date.split('-');
      return `${day}-${month}-${year}`;
    };

    const formattedDate = formatDate(item.createdAt);

    return (
      <View
        style={[
          styles.listItem,
          { height: 'auto', paddingVertical: hp('1.5%') },
        ]}
      >
        <View style={styles.listItemLeft}>
          <View
            style={[
              styles.menuIconContainer,
              { backgroundColor: colors.homeScreenBackground },
            ]}
          >
            <Text style={styles.userInitialText}>
              {(item.custName || 'U').charAt(0).toUpperCase()}
            </Text>
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
    );
  };

  const renderEmpty = () => {
    if (isInitialLoad) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No Referral History</Text>
      </View>
    );
  };

  const onShare = async () => {
    try {
      const shareUrl = `${KSHOPE_CONFIG.referalUrl}refer/register?custrefcd=${
        profile?.referralCode || ''
      }`;
      const message = `Hey! Download Kshope and get daily essentials to your doorstep. Join me using my referral code: ${
        profile?.referralCode || 'WELCOME'
      } and enjoy exclusive rewards! Download now: ${shareUrl}`;
      await Share.share({
        message: message,
      });
    } catch (error: any) {
      console.error('Error sharing:', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AppIcons.Back size={wp('6%')} color={colors.black} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: colors.black }]}>
          Referral
        </Text>
      </View>
      <View style={styles.innerContainer}>
        <View style={{ flex: 1 }}>
          <View style={styles.solidPremiumCard}>
            <View style={styles.solidHeaderRow}>
              <Image
                style={styles.solidSpeakerIcon}
                source={require('../../assets/images/loud-speaker.png')}
              />
              <View style={styles.solidTitleCol}>
                <Text style={styles.solidReferTitle}>Refer & Earn</Text>
                <Text style={styles.solidSubTitle}>Get rewarded for every friend who shops using your invite.</Text>
              </View>
            </View>

            <View style={styles.solidRewardBox}>
              <Text style={styles.solidRewardLabel}>Total Rewards Earned</Text>
              <View style={styles.solidRewardAmountRow}>
                <Image source={require('../../assets/images/profile/homebcoin.png')} style={styles.solidCoinIcon} />
                <Text style={styles.solidRewardValue}>
                  {profile?.referralEarning || referrals.reduce((sum, item) => sum + Number(item.totalTokensEarned || 0), 0) || '0.00'}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.solidInviteBtn} onPress={onShare}>
              <MaterialCommunityIcons name="share-variant" size={wp('5%')} color="#FFFFFF" />
              <Text style={styles.solidBtnText}>Send Invite</Text>
            </TouchableOpacity>
          </View>
          <Text
            style={[
              styles.referEarnText,
              {
                marginTop: hp('3%'),
                marginBottom: hp('1%'),
              },
            ]}
          >
            Referral History
          </Text>

          <FlatList
            data={referrals}
            keyExtractor={(item, index) => `${item.referrerCustId}-${index}`}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            ListFooterComponent={() =>
              referrals.length > 0 ? (
                <View style={{ height: hp('2%') }} />
              ) : null
            }
            style={
              referrals.length > 0
                ? [styles.historyListCard, { flex: 1 }]
                : { flex: 1 }
            }
            contentContainerStyle={
              referrals.length === 0
                ? styles.emptyListContent
                : styles.listContent
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ReferralScreen;

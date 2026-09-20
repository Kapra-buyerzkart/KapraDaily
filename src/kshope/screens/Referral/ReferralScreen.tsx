import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Share,
  StatusBar,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';
import { getReferralHistoryApi } from '../../api/services/userService';
import { useUser } from '../../context/UserContext';
import { LoaderContext } from '../../context/loaderContext';
import KSHOPE_CONFIG from '../../globals/config';
import { styles, LUXURY_COLORS } from './styles';

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

  const referralCode = profile?.referralCode || 'WELCOME';

  const onCopyCode = () => {
    Clipboard.setString(referralCode);
    Toast.show(`Referral code "${referralCode}" copied!`, Toast.SHORT);
  };

  const onShare = async () => {
    try {
      const shareUrl = `${KSHOPE_CONFIG.referalUrl}refer/register?custrefcd=${
        profile?.referralCode || ''
      }`;
      const message = `Hey! Join me on Kapra and discover fine gold & diamond jewelry with transparent pricing. Use my referral code: ${referralCode} and enjoy exclusive rewards! Download now: ${shareUrl}`;
      await Share.share({
        message,
      });
    } catch (error: any) {
      console.error('Error sharing:', error.message);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [date] = dateString.split('T');
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  };

  const totalRewards =
    profile?.referralEarning ||
    referrals.reduce(
      (sum, item) => sum + Number(item.totalTokensEarned || 0),
      0,
    ) ||
    '0.00';

  const renderHeader = () => (
    <View>
      {/* Luxury Hero Affiliate Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroHeaderRow}>
          <View style={styles.clubBadge}>
            <MaterialCommunityIcons
              name="crown-outline"
              size={wp('3.8%')}
              color={LUXURY_COLORS.goldMetallic}
            />
            <Text style={styles.clubBadgeText}>Affiliate Club</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>Invite & Earn Rewards</Text>
        <Text style={styles.heroSubtitle}>
          Introduce friends to authentic jewelry with transparent pricing and earn
          reward tokens on their journey.
        </Text>

        {/* Total Rewards Tile */}
        <View style={styles.rewardTile}>
          <View style={styles.rewardTileLeft}>
            <Text style={styles.rewardTileLabel}>Total Rewards Earned</Text>
            <View style={styles.rewardValueRow}>
              <Image
                source={require('../../assets/images/profile/homebcoin.png')}
                style={styles.coinIcon}
              />
              <Text style={styles.rewardTileValue}>{totalRewards}</Text>
            </View>
          </View>
        </View>

        {/* Referral Code Chip */}
        <View style={styles.codeSection}>
          <View style={styles.codeLeft}>
            <Text style={styles.codeLabel}>Your Referral Code</Text>
            <Text style={styles.codeValue}>{referralCode}</Text>
          </View>
          <TouchableOpacity
            style={styles.copyBtn}
            onPress={onCopyCode}
            activeOpacity={0.8}
          >
            <Feather name="copy" size={wp('3.4%')} color={LUXURY_COLORS.white} />
            <Text style={styles.copyBtnText}>Copy</Text>
          </TouchableOpacity>
        </View>

        {/* Invite CTA Button */}
        <TouchableOpacity
          style={styles.heroShareBtn}
          onPress={onShare}
          activeOpacity={0.85}
        >
          <Feather name="share-2" size={wp('4.4%')} color={LUXURY_COLORS.white} />
          <Text style={styles.heroShareBtnText}>Share Invite Link</Text>
        </TouchableOpacity>
      </View>

      {/* How It Works 3-Step Rail */}
      <View style={styles.stepsContainer}>
        <Text style={styles.stepsTitle}>How It Works</Text>
        <View style={styles.stepsRow}>
          <View style={styles.stepItem}>
            <View style={styles.stepIconCircle}>
              <Feather
                name="send"
                size={wp('4.8%')}
                color={LUXURY_COLORS.emerald}
              />
              <View style={styles.stepStepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
            </View>
            <Text style={styles.stepTitle}>Share Link</Text>
            <Text style={styles.stepDesc}>Send your code to friends & family</Text>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepIconCircle}>
              <Feather
                name="user-check"
                size={wp('4.8%')}
                color={LUXURY_COLORS.emerald}
              />
              <View style={styles.stepStepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
            </View>
            <Text style={styles.stepTitle}>They Join</Text>
            <Text style={styles.stepDesc}>Friend registers with your invite code</Text>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepIconCircle}>
              <MaterialCommunityIcons
                name="gift-outline"
                size={wp('5.2%')}
                color={LUXURY_COLORS.emerald}
              />
              <View style={styles.stepStepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
            </View>
            <Text style={styles.stepTitle}>Get Rewards</Text>
            <Text style={styles.stepDesc}>Receive tokens directly in your account</Text>
          </View>
        </View>
      </View>

      {/* Referral History Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Affiliate History</Text>
        {referrals.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>
              {referrals.length} {referrals.length === 1 ? 'member' : 'members'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderItem = ({ item, index }: { item: ReferralItem; index: number }) => {
    const formattedDate = formatDate(item.createdAt);
    const initial = (item.custName || 'U').charAt(0).toUpperCase();

    return (
      <View style={styles.historyCard}>
        <View style={styles.historyItem}>
          <View style={styles.itemLeft}>
            <View style={styles.avatarDisc}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={styles.nameCol}>
              <Text style={styles.userName} numberOfLines={1}>
                {item.custName || 'Affiliate Member'}
              </Text>
              <Text style={styles.userDate}>
                {formattedDate ? `Joined on ${formattedDate}` : 'Joined'}
              </Text>
            </View>
          </View>
          <View style={styles.itemRight}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>
                {Number(item.totalTokensEarned || 0) > 0
                  ? `+${item.totalTokensEarned} Tokens`
                  : 'Active'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderEmpty = () => {
    if (isInitialLoad) return null;
    return (
      <View style={styles.emptyBox}>
        <View style={styles.emptyIconContainer}>
          <MaterialCommunityIcons
            name="account-group-outline"
            size={wp('7%')}
            color={LUXURY_COLORS.emerald}
          />
        </View>
        <Text style={styles.emptyTitle}>No Affiliates Yet</Text>
        <Text style={styles.emptySubtitle}>
          Start sharing your referral link with friends. When they join, they'll be
          listed here!
        </Text>
        <TouchableOpacity
          style={styles.emptyActionBtn}
          onPress={onShare}
          activeOpacity={0.8}
        >
          <Text style={styles.emptyActionBtnText}>Share Your Code</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={LUXURY_COLORS.canvas} />
      {/* Luxury Navigation Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.headerLeftBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Feather
            name="chevron-left"
            size={wp('5.5%')}
            color={LUXURY_COLORS.emerald}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Affiliates</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Content List */}
      <FlatList
        data={referrals}
        keyExtractor={(item, index) => `${item.referrerCustId}-${index}`}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={() => <View style={{ height: hp('1.2%') }} />}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default ReferralScreen;

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { FONTS } from '../../styles/typography';
import {
  getSpinWinHistory,
  getHomeWheelMySpins,
} from '../../api/spinWheelService';
import { impactTick } from '../../utils/haptics';

export type RewardTab = 'BUYING' | 'JOINING';

interface RewardItem {
  id?: string | number;
  prize?: any;
  rewardName?: string;
  rewardTitle?: string;
  title?: string;
  label?: string;
  name?: string;
  dateWon?: string;
  wonAt?: string;
  createdAt?: string;
  created_at?: string;
  spinDate?: string;
  status?: string;
  isClaimed?: boolean;
  isExpired?: boolean;
  expiryDate?: string;
  expiresAt?: string;
  validTill?: string;
  validUntil?: string;
  code?: string;
  couponCode?: string;
  promoCode?: string;
  giftCardCode?: string;
  rewardCode?: string;
  value?: string | number;
  awardedValue?: string | number;
  amount?: string | number;
  rewardType?: string;
  description?: string;
  terms?: string;
  [key: string]: any;
}

const PAGE_SIZE = 20;

const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
      const [datePart] = String(dateString).split('T');
      return datePart;
    }
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return String(dateString);
  }
};

const resolveStatus = (
  item: RewardItem,
): { label: string; tone: 'active' | 'claimed' | 'expired' | 'noprize' } => {
  const rawType = String(item.rewardType || '').toLowerCase();
  const rawTitle = String(
    item.rewardName || item.rewardTitle || item.title || item.label || '',
  ).toLowerCase();

  if (
    rawType === 'noprize' ||
    rawTitle.includes('no prize') ||
    rawTitle.includes('better luck') ||
    rawTitle.includes('try again')
  ) {
    return { label: 'NO PRIZE', tone: 'noprize' };
  }

  const rawStatus = String(item.status || '').toUpperCase();
  if (rawStatus === 'CLAIMED' || item.isClaimed) {
    return { label: 'CLAIMED', tone: 'claimed' };
  }
  if (rawStatus === 'EXPIRED' || item.isExpired) {
    return { label: 'EXPIRED', tone: 'expired' };
  }
  if (item.expiryDate || item.expiresAt || item.validTill || item.validUntil) {
    const expTime = new Date(
      item.expiryDate || item.expiresAt || item.validTill || item.validUntil || '',
    ).getTime();
    if (!isNaN(expTime) && expTime < Date.now()) {
      return { label: 'EXPIRED', tone: 'expired' };
    }
  }
  return { label: 'ACTIVE', tone: 'active' };
};

export default function MyRewardsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const isFocused = useIsFocused();

  const initialTab: RewardTab =
    route?.params?.tab === 'JOINING' ||
    route?.params?.initialTab === 'joining' ||
    route?.params?.initialTab === 'JOINING'
      ? 'JOINING'
      : 'BUYING';

  const [activeTab, setActiveTab] = useState<RewardTab>(initialTab);

  // Buying rewards state (Order Spin & Win history)
  const [buyingRewards, setBuyingRewards] = useState<RewardItem[]>([]);
  const [buyingPage, setBuyingPage] = useState<number>(1);
  const [hasMoreBuying, setHasMoreBuying] = useState<boolean>(true);
  const [isLoadingBuying, setIsLoadingBuying] = useState<boolean>(true);
  const [isRefreshingBuying, setIsRefreshingBuying] = useState<boolean>(false);
  const [isFetchingMoreBuying, setIsFetchingMoreBuying] = useState<boolean>(false);
  const [errorBuying, setErrorBuying] = useState<string | null>(null);

  // Joining rewards state (Home / Registration / Onboarding spins)
  const [joiningRewards, setJoiningRewards] = useState<RewardItem[]>([]);
  const [joiningPage, setJoiningPage] = useState<number>(1);
  const [hasMoreJoining, setHasMoreJoining] = useState<boolean>(true);
  const [isLoadingJoining, setIsLoadingJoining] = useState<boolean>(false);
  const [isRefreshingJoining, setIsRefreshingJoining] = useState<boolean>(false);
  const [isFetchingMoreJoining, setIsFetchingMoreJoining] = useState<boolean>(false);
  const [errorJoining, setErrorJoining] = useState<string | null>(null);
  const [hasFetchedJoining, setHasFetchedJoining] = useState<boolean>(false);

  // Fetch buying rewards (rewards/spin-win/history)
  const fetchBuyingHistory = useCallback(async (page = 1, isRefresh = false) => {
    if (page === 1) {
      if (!isRefresh) setIsLoadingBuying(true);
      setErrorBuying(null);
    } else {
      setIsFetchingMoreBuying(true);
    }

    try {
      const response: any = await getSpinWinHistory({
        pageNumber: page,
        pageSize: PAGE_SIZE,
      });

      const data = response?.data !== undefined ? response.data : response;
      const rawItems =
        data?.items ||
        data?.rewards ||
        data?.history ||
        data?.spins ||
        response?.items ||
        response?.rewards ||
        (Array.isArray(data) ? data : null) ||
        [];

      const parsedItems: RewardItem[] = Array.isArray(rawItems) ? rawItems : [];

      if (page === 1) {
        setBuyingRewards(parsedItems);
      } else {
        setBuyingRewards(prev => [...prev, ...parsedItems]);
      }

      setBuyingPage(page);
      setHasMoreBuying(parsedItems.length >= PAGE_SIZE);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to load buying rewards. Please pull to refresh.';
      if (page === 1) {
        setErrorBuying(msg);
      }
    } finally {
      setIsLoadingBuying(false);
      setIsRefreshingBuying(false);
      setIsFetchingMoreBuying(false);
    }
  }, []);

  // Fetch joining rewards (rewards/home-wheel/my-spins)
  const fetchJoiningHistory = useCallback(async (page = 1, isRefresh = false) => {
    if (page === 1) {
      if (!isRefresh) setIsLoadingJoining(true);
      setErrorJoining(null);
    } else {
      setIsFetchingMoreJoining(true);
    }

    try {
      const response: any = await getHomeWheelMySpins({
        pageNumber: page,
        pageSize: PAGE_SIZE,
      });

      const data = response?.data !== undefined ? response.data : response;
      const rawItems =
        data?.items ||
        data?.rewards ||
        data?.spins ||
        data?.mySpins ||
        data?.history ||
        data?.records ||
        response?.items ||
        response?.rewards ||
        response?.spins ||
        response?.mySpins ||
        (Array.isArray(data) ? data : null) ||
        (Array.isArray(response) ? response : null) ||
        [];

      const parsedItems: RewardItem[] = Array.isArray(rawItems) ? rawItems : [];

      if (page === 1) {
        setJoiningRewards(parsedItems);
      } else {
        setJoiningRewards(prev => [...prev, ...parsedItems]);
      }

      setJoiningPage(page);
      setHasMoreJoining(parsedItems.length >= PAGE_SIZE);
      setHasFetchedJoining(true);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to load joining rewards. Please pull to refresh.';
      if (page === 1) {
        setErrorJoining(msg);
      }
    } finally {
      setIsLoadingJoining(false);
      setIsRefreshingJoining(false);
      setIsFetchingMoreJoining(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    if (initialTab === 'JOINING') {
      fetchJoiningHistory(1);
    } else {
      fetchBuyingHistory(1);
    }
  }, [initialTab, fetchBuyingHistory, fetchJoiningHistory]);

  // Screen focus handling (auto-refresh active tab if updated in other screens)
  useEffect(() => {
    if (!isFocused) return;
    if (activeTab === 'BUYING') {
      fetchBuyingHistory(1);
    } else if (activeTab === 'JOINING' && hasFetchedJoining) {
      fetchJoiningHistory(1);
    }
  }, [isFocused, activeTab, hasFetchedJoining, fetchBuyingHistory, fetchJoiningHistory]);

  // Tab change handler
  const handleTabPress = (tab: RewardTab) => {
    if (tab === activeTab) return;
    impactTick();
    setActiveTab(tab);
    if (tab === 'JOINING' && !hasFetchedJoining) {
      fetchJoiningHistory(1);
    }
  };

  const handleRefresh = () => {
    if (activeTab === 'BUYING') {
      setIsRefreshingBuying(true);
      fetchBuyingHistory(1, true);
    } else {
      setIsRefreshingJoining(true);
      fetchJoiningHistory(1, true);
    }
  };

  const handleLoadMore = () => {
    if (activeTab === 'BUYING') {
      if (!isFetchingMoreBuying && !isLoadingBuying && hasMoreBuying) {
        fetchBuyingHistory(buyingPage + 1);
      }
    } else {
      if (!isFetchingMoreJoining && !isLoadingJoining && hasMoreJoining) {
        fetchJoiningHistory(joiningPage + 1);
      }
    }
  };

  const handleRetry = () => {
    if (activeTab === 'BUYING') {
      fetchBuyingHistory(1);
    } else {
      fetchJoiningHistory(1);
    }
  };

  const handleCopyCode = (code: string) => {
    impactTick();
    Clipboard.setString(code);
    Toast.show(`Coupon code "${code}" copied!`, Toast.SHORT);
  };

  // Active dataset references
  const rewards = activeTab === 'BUYING' ? buyingRewards : joiningRewards;
  const isLoading = activeTab === 'BUYING' ? isLoadingBuying : isLoadingJoining;
  const isRefreshing = activeTab === 'BUYING' ? isRefreshingBuying : isRefreshingJoining;
  const isFetchingMore = activeTab === 'BUYING' ? isFetchingMoreBuying : isFetchingMoreJoining;
  const errorMessage = activeTab === 'BUYING' ? errorBuying : errorJoining;
  const hasMoreData = activeTab === 'BUYING' ? hasMoreBuying : hasMoreJoining;

  const renderRewardItem = ({ item }: { item: RewardItem }) => {
    const title =
      item.rewardName ||
      item.rewardTitle ||
      item.title ||
      item.label ||
      item.name ||
      (item.awardedValue
        ? `${item.awardedValue} ${item.rewardType || 'Tokens'}`
        : null) ||
      (typeof item.prize === 'string'
        ? item.prize
        : item.prize?.rewardName || item.prize?.label || item.prize?.title) ||
      'Lucky Reward';

    const code =
      item.code ||
      item.couponCode ||
      item.promoCode ||
      item.giftCardCode ||
      item.rewardCode ||
      item.prize?.code ||
      '';

    const dateWon =
      item.dateWon ||
      item.wonAt ||
      item.createdAt ||
      item.spinDate ||
      item.created_at ||
      item.date;

    const expiry =
      item.expiryDate ||
      item.expiresAt ||
      item.validTill ||
      item.validUntil ||
      item.expires_at;

    const value =
      item.value ||
      item.awardedValue ||
      item.amount ||
      item.prize?.value;

    const statusInfo = resolveStatus(item);
    const isNoPrize = statusInfo.tone === 'noprize';

    const rawType = String(item.rewardType || '').toLowerCase();
    const rawTitle = title.toLowerCase();
    const isTokenReward =
      rawType.includes('token') ||
      rawType.includes('coin') ||
      rawTitle.includes('token') ||
      rawTitle.includes('coin');

    return (
      <View
        style={[styles.cardContainer, isNoPrize && styles.cardContainerNoPrize]}
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.prizeTitleRow}>
            <View
              style={[
                styles.giftIconWrap,
                isNoPrize && styles.giftIconWrapNoPrize,
                isTokenReward && styles.giftIconWrapToken,
              ]}
            >
              <MaterialCommunityIcons
                name={
                  isNoPrize
                    ? 'clover'
                    : isTokenReward
                    ? 'circle-multiple'
                    : 'gift-open'
                }
                size={18}
                color={
                  isNoPrize ? '#64748B' : isTokenReward ? '#D97706' : '#059669'
                }
              />
            </View>
            <View style={styles.prizeTitleCol}>
              <Text
                style={[
                  styles.prizeTitle,
                  isNoPrize && styles.prizeTitleNoPrize,
                ]}
                numberOfLines={2}
              >
                {title}
              </Text>
              {dateWon ? (
                <Text style={styles.dateWonText}>
                  Won on {formatDate(dateWon)}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              statusInfo.tone === 'active' && styles.statusBadgeActive,
              statusInfo.tone === 'claimed' && styles.statusBadgeClaimed,
              statusInfo.tone === 'expired' && styles.statusBadgeExpired,
              isNoPrize && styles.statusBadgeNoPrize,
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                statusInfo.tone === 'active' && styles.statusTextActive,
                statusInfo.tone === 'claimed' && styles.statusTextClaimed,
                statusInfo.tone === 'expired' && styles.statusTextExpired,
                isNoPrize && styles.statusTextNoPrize,
              ]}
            >
              {statusInfo.label}
            </Text>
          </View>
        </View>

        {/* Value and Expiry Metadata */}
        <View style={styles.metaRow}>
          {value ? (
            <View
              style={[
                styles.valueChip,
                isTokenReward && styles.valueChipToken,
              ]}
            >
              <MaterialCommunityIcons
                name={isTokenReward ? 'star-circle-outline' : 'tag-outline'}
                size={12}
                color={isTokenReward ? '#D97706' : '#047857'}
              />
              <Text
                style={[
                  styles.valueChipText,
                  isTokenReward && styles.valueChipTokenText,
                ]}
              >
                {isTokenReward
                  ? `${value} ${
                      !String(value).toLowerCase().includes('token') &&
                      !String(value).toLowerCase().includes('coin')
                        ? 'Tokens'
                        : ''
                    }`.trim()
                  : `Value: ${String(value)}`}
              </Text>
            </View>
          ) : null}

          {expiry ? (
            <View style={styles.expiryChip}>
              <Ionicons name="time-outline" size={12} color="#64748B" />
              <Text style={styles.expiryChipText}>
                {statusInfo.tone === 'expired' ? 'Expired' : 'Expires'}:{' '}
                {formatDate(expiry)}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Coupon Strip with 1-Tap Copy OR Token Info Badge OR NoPrize Strip */}
        {code ? (
          <View style={styles.codeStrip}>
            <View style={styles.codeInfoCol}>
              <Text style={styles.codeLabel}>COUPON / GIFT CODE</Text>
              <Text style={styles.codeText}>{code}</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => handleCopyCode(code)}
              style={styles.copyButton}
              accessibilityRole="button"
              accessibilityLabel={`Copy code ${code}`}
            >
              <Ionicons name="copy-outline" size={13} color="#059669" />
              <Text style={styles.copyButtonText}>COPY</Text>
            </TouchableOpacity>
          </View>
        ) : isTokenReward ? (
          <View style={styles.tokenStrip}>
            <MaterialCommunityIcons
              name="check-decagram"
              size={15}
              color="#D97706"
            />
            <Text style={styles.tokenStripText}>
              Added to your UD token balance
            </Text>
          </View>
        ) : isNoPrize ? (
          <View style={styles.noPrizeStrip}>
            <MaterialCommunityIcons
              name="refresh-circle"
              size={16}
              color="#64748B"
            />
            <Text style={styles.noPrizeStripText}>
              {activeTab === 'BUYING'
                ? 'Better luck next time! Spin again on your next eligible order.'
                : 'Better luck next time! Keep checking back for exciting rewards.'}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#FF6200" />
        <Text style={styles.footerLoaderText}>Loading more rewards...</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    if (errorMessage) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={48}
            color="#EF4444"
          />
          <Text style={styles.emptyTitle}>Could not load rewards</Text>
          <Text style={styles.emptySubtitle}>{errorMessage}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}
            activeOpacity={0.8}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const isBuying = activeTab === 'BUYING';

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <MaterialCommunityIcons
            name={isBuying ? 'ticket-percent-outline' : 'party-popper'}
            size={44}
            color="#FF6200"
          />
        </View>
        <Text style={styles.emptyTitle}>
          {isBuying ? 'No Buying Rewards Yet' : 'No Joining Rewards Yet'}
        </Text>
        <Text style={styles.emptySubtitle}>
          {isBuying
            ? 'Coupons, cashbacks, and vouchers won from your orders will appear here.'
            : 'Rewards, tokens, and welcome gifts won from your onboarding spins will appear here.'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>My Rewards</Text>
          <Text style={styles.headerSubtitle}>
            {activeTab === 'BUYING'
              ? 'Your order spin coupons and vouchers'
              : 'Your welcome and joining spin rewards'}
          </Text>
        </View>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'BUYING' && styles.tabButtonActive,
          ]}
          onPress={() => handleTabPress('BUYING')}
          activeOpacity={0.8}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'BUYING' }}
        >
          <MaterialCommunityIcons
            name="cart-outline"
            size={18}
            color={activeTab === 'BUYING' ? '#FF6200' : '#64748B'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'BUYING' && styles.tabTextActive,
            ]}
          >
            Buying Rewards
          </Text>
          {buyingRewards.length > 0 && (
            <View
              style={[
                styles.tabBadge,
                activeTab === 'BUYING' && styles.tabBadgeActive,
              ]}
            >
              <Text
                style={[
                  styles.tabBadgeText,
                  activeTab === 'BUYING' && styles.tabBadgeTextActive,
                ]}
              >
                {buyingRewards.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'JOINING' && styles.tabButtonActive,
          ]}
          onPress={() => handleTabPress('JOINING')}
          activeOpacity={0.8}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'JOINING' }}
        >
          <MaterialCommunityIcons
            name="party-popper"
            size={17}
            color={activeTab === 'JOINING' ? '#FF6200' : '#64748B'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'JOINING' && styles.tabTextActive,
            ]}
          >
            Joining Rewards
          </Text>
          {joiningRewards.length > 0 && (
            <View
              style={[
                styles.tabBadge,
                activeTab === 'JOINING' && styles.tabBadgeActive,
              ]}
            >
              <Text
                style={[
                  styles.tabBadgeText,
                  activeTab === 'JOINING' && styles.tabBadgeTextActive,
                ]}
              >
                {joiningRewards.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF6200" />
          <Text style={styles.loadingText}>
            {activeTab === 'BUYING'
              ? 'Fetching your order rewards...'
              : 'Fetching your joining rewards...'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={rewards}
          keyExtractor={(item, index) =>
            String(item.id ?? item.code ?? item.spinId ?? `${activeTab}_reward_${index}`)
          }
          renderItem={renderRewardItem}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          contentContainerStyle={[
            styles.listContent,
            rewards.length === 0 && styles.listContentEmpty,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#FF6200', '#059669']}
              tintColor="#FF6200"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontFamily: FONTS.gilroy?.bold || 'System',
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontFamily: FONTS.gilroy?.regular || 'System',
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#64748B',
    fontFamily: FONTS.gilroy?.medium || 'System',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  prizeTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  giftIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  prizeTitleCol: {
    flex: 1,
  },
  prizeTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: FONTS.gilroy?.bold || 'System',
  },
  dateWonText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontFamily: FONTS.gilroy?.regular || 'System',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeActive: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgeClaimed: {
    backgroundColor: '#E0F2FE',
  },
  statusBadgeExpired: {
    backgroundColor: '#FEE2E2',
  },
  statusBadgeNoPrize: {
    backgroundColor: '#F1F5F9',
  },
  statusBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  statusTextActive: {
    color: '#15803D',
  },
  statusTextClaimed: {
    color: '#0369A1',
  },
  statusTextExpired: {
    color: '#B91C1C',
  },
  statusTextNoPrize: {
    color: '#64748B',
  },
  cardContainerNoPrize: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  giftIconWrapNoPrize: {
    backgroundColor: '#F1F5F9',
  },
  prizeTitleNoPrize: {
    color: '#475569',
  },
  noPrizeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
  },
  noPrizeStripText: {
    flex: 1,
    fontSize: 11,
    color: '#64748B',
    fontFamily: FONTS.gilroy?.regular || 'System',
    lineHeight: 15,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  valueChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  valueChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  expiryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  expiryChipText: {
    fontSize: 11,
    color: '#475569',
  },
  codeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
  },
  codeInfoCol: {
    flex: 1,
  },
  codeLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.4,
  },
  codeText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  copyButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  footerLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  footerLoaderText: {
    fontSize: 12,
    color: '#64748B',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: FONTS.gilroy?.bold || 'System',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  retryButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 14,
  },
  retryButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 11,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    fontFamily: FONTS.gilroy?.medium || 'System',
  },
  tabTextActive: {
    color: '#FF6200',
    fontWeight: '800',
    fontFamily: FONTS.gilroy?.bold || 'System',
  },
  tabBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 10,
  },
  tabBadgeActive: {
    backgroundColor: '#FFF0E6',
  },
  tabBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
  tabBadgeTextActive: {
    color: '#FF6200',
  },
  giftIconWrapToken: {
    backgroundColor: '#FEF3C7',
  },
  valueChipToken: {
    backgroundColor: '#FFFBEB',
  },
  valueChipTokenText: {
    color: '#D97706',
    fontWeight: '700',
  },
  tokenStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
  },
  tokenStripText: {
    flex: 1,
    fontSize: 11,
    color: '#B45309',
    fontFamily: FONTS.gilroy?.medium || 'System',
    fontWeight: '600',
  },
});


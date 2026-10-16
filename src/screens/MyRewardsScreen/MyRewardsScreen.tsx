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
import { useIsFocused, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { FONTS } from '../../styles/typography';
import { getSpinWinHistory } from '../../api/spinWheelService';
import { impactTick } from '../../utils/haptics';

interface RewardItem {
  id?: string | number;
  prize?: any;
  rewardName?: string;
  rewardTitle?: string;
  title?: string;
  label?: string;
  dateWon?: string;
  wonAt?: string;
  createdAt?: string;
  status?: string;
  isClaimed?: boolean;
  isExpired?: boolean;
  expiryDate?: string;
  expiresAt?: string;
  validTill?: string;
  code?: string;
  couponCode?: string;
  promoCode?: string;
  giftCardCode?: string;
  value?: string | number;
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
  if (item.expiryDate || item.expiresAt || item.validTill) {
    const expTime = new Date(
      item.expiryDate || item.expiresAt || item.validTill || '',
    ).getTime();
    if (!isNaN(expTime) && expTime < Date.now()) {
      return { label: 'EXPIRED', tone: 'expired' };
    }
  }
  return { label: 'ACTIVE', tone: 'active' };
};

export default function MyRewardsScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchHistory = useCallback(
    async (page = 1, isRefresh = false) => {
      if (page === 1) {
        if (!isRefresh) setIsLoading(true);
        setErrorMessage(null);
      } else {
        setIsFetchingMore(true);
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
          response?.items ||
          response?.rewards ||
          (Array.isArray(data) ? data : null) ||
          [];

        const parsedItems: RewardItem[] = Array.isArray(rawItems) ? rawItems : [];

        if (page === 1) {
          setRewards(parsedItems);
        } else {
          setRewards(prev => [...prev, ...parsedItems]);
        }

        setPageNumber(page);
        if (parsedItems.length < PAGE_SIZE) {
          setHasMoreData(false);
        } else {
          setHasMoreData(true);
        }
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          'Failed to load rewards. Please pull to refresh.';
        if (page === 1) {
          setErrorMessage(msg);
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsFetchingMore(false);
      }
    },
    [],
  );

  // Auto-refresh when screen gains focus (e.g. after a spin completion)
  useEffect(() => {
    if (isFocused) {
      fetchHistory(1);
    }
  }, [isFocused, fetchHistory]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchHistory(1, true);
  };

  const handleLoadMore = () => {
    if (!isFetchingMore && !isLoading && hasMoreData) {
      fetchHistory(pageNumber + 1);
    }
  };

  const handleCopyCode = (code: string) => {
    impactTick();
    Clipboard.setString(code);
    Toast.show(`Coupon code "${code}" copied!`, Toast.SHORT);
  };

  const renderRewardItem = ({ item }: { item: RewardItem }) => {
    const title =
      item.rewardName ||
      item.rewardTitle ||
      item.title ||
      item.label ||
      (typeof item.prize === 'string' ? item.prize : item.prize?.rewardName || item.prize?.label) ||
      'Assured Reward';

    const code =
      item.code ||
      item.couponCode ||
      item.promoCode ||
      item.giftCardCode ||
      item.prize?.code ||
      '';

    const dateWon = item.dateWon || item.wonAt || item.createdAt;
    const expiry = item.expiryDate || item.expiresAt || item.validTill;
    const value = item.value || item.prize?.value;
    const statusInfo = resolveStatus(item);

    const isNoPrize = statusInfo.tone === 'noprize';

    return (
      <View
        style={[
          styles.cardContainer,
          isNoPrize && styles.cardContainerNoPrize,
        ]}
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.prizeTitleRow}>
            <View
              style={[
                styles.giftIconWrap,
                isNoPrize && styles.giftIconWrapNoPrize,
              ]}
            >
              <MaterialCommunityIcons
                name={isNoPrize ? 'clover' : 'gift-open'}
                size={18}
                color={isNoPrize ? '#64748B' : '#059669'}
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
            <View style={styles.valueChip}>
              <MaterialCommunityIcons
                name="tag-outline"
                size={12}
                color="#047857"
              />
              <Text style={styles.valueChipText}>Value: {String(value)}</Text>
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

        {/* Coupon Strip with 1-Tap Copy OR NoPrize Encouragement Strip */}
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
        ) : isNoPrize ? (
          <View style={styles.noPrizeStrip}>
            <MaterialCommunityIcons
              name="refresh-circle"
              size={16}
              color="#64748B"
            />
            <Text style={styles.noPrizeStripText}>
              Better luck next time! Spin again on your next eligible order.
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
        <ActivityIndicator size="small" color="#059669" />
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
            onPress={() => fetchHistory(1)}
            activeOpacity={0.8}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <MaterialCommunityIcons
            name="ticket-percent-outline"
            size={44}
            color="#D97706"
          />
        </View>
        <Text style={styles.emptyTitle}>No Rewards Yet</Text>
        <Text style={styles.emptySubtitle}>
          You haven’t spun the wheel yet! Place an order or play Spin & Win to
          unlock guaranteed coupons & prizes.
        </Text>
        <TouchableOpacity
          style={styles.playSpinButton}
          onPress={() => navigation.navigate('SpinWheelRewardsScreen')}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons
            name="ferris-wheel"
            size={18}
            color="#FFFFFF"
          />
          <Text style={styles.playSpinButtonText}>Play Spin & Win</Text>
        </TouchableOpacity>
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
            Your Spin & Win coupons and vouchers
          </Text>
        </View>
        <TouchableOpacity
          style={styles.spinShortcutBtn}
          onPress={() => navigation.navigate('SpinWheelRewardsScreen')}
          activeOpacity={0.75}
        >
          <MaterialCommunityIcons
            name="ferris-wheel"
            size={18}
            color="#059669"
          />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Fetching your rewards...</Text>
        </View>
      ) : (
        <FlatList
          data={rewards}
          keyExtractor={(item, index) =>
            String(item.id ?? item.code ?? `reward_${index}`)
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
              colors={['#059669']}
              tintColor="#059669"
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
  spinShortcutBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
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
  playSpinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  playSpinButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
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
});

import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  BackHandler,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LoaderContext } from '../../../context/loaderContext';
import { getMyOrdersApi, reorderApi } from '../../../api/services/orderService';
import { Fonts } from '../../../theme/fonts';
import { pt } from '../../../theme/tokens';
import type { OrderListItem } from '../../../types/order';
import {
  detailParams,
  getOrderStatusType,
  sortByNewest,
  type OrderBucket,
} from './data/selectors';
import OrderCard from './sections/OrderCard';
import OrdersSummaryCard from './sections/OrdersSummaryCard';
import OrderTabs from './sections/OrderTabs';
import OrdersEmptyState from './sections/OrdersEmptyState';
import { ORDER_COLORS } from './sections/theme';

const MyOrdersRedesignScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [orderData, setOrderData] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<OrderBucket>('all');
  const hasLoadedOnce = useRef(false);
  const { showLoader } = useContext(LoaderContext) || { showLoader: () => {} };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (!navigation.canGoBack()) {
          navigation.navigate('KshopeHome');
          return true;
        }
        navigation.goBack();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [navigation]),
  );

  const fetchMyOrderFunction = useCallback(
    async (silent?: boolean) => {
      try {
        if (!silent && !hasLoadedOnce.current) {
          showLoader(true);
          setLoading(true);
        }
        const response = await getMyOrdersApi();
        if (response && response.success && response.data) {
          const list = Array.isArray(response.data)
            ? response.data
            : response.data.items || [];
          setOrderData(list);
        } else {
          setOrderData([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        hasLoadedOnce.current = true;
        showLoader(false);
        setLoading(false);
        setRefreshing(false);
      }
    },
    [showLoader],
  );

  useFocusEffect(
    useCallback(() => {
      fetchMyOrderFunction(hasLoadedOnce.current);
    }, [fetchMyOrderFunction]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMyOrderFunction(true);
  }, [fetchMyOrderFunction]);

  const goBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('KshopeHome');
    }
  }, [navigation]);

  const openSearch = useCallback(() => {
    navigation.navigate('KshopeSearch');
  }, [navigation]);

  const openDetails = useCallback(
    (order: OrderListItem) => {
      navigation.navigate('KshopeMyOrderDetails', detailParams(order));
    },
    [navigation],
  );

  const handleTrack = useCallback(
    (order: OrderListItem) => {
      navigation.navigate('KshopeMyOrderDetails', {
        ...detailParams(order),
        openTrack: true,
      });
    },
    [navigation],
  );

  const handleRate = useCallback(
    (order: OrderListItem) => {
      navigation.navigate('KshopeMyOrderDetails', {
        ...detailParams(order),
        focusRating: true,
      });
    },
    [navigation],
  );

  const handleInvoice = useCallback(
    (order: OrderListItem) => {
      if (order?.invoiceFileUrl) {
        navigation.navigate('KshopeInvoiceViewer', {
          invoiceUrl: order.invoiceFileUrl,
          invoiceNumber: order.invoiceNumber,
          title: `Invoice #${order.invoiceNumber || order.orderNumber}`,
        });
      } else {
        openDetails(order);
      }
    },
    [navigation, openDetails],
  );

  const handleReorder = useCallback(
    async (order: OrderListItem) => {
      if (!order?.orderId) {
        openDetails(order);
        return;
      }
      try {
        showLoader(true);
        const res = await reorderApi({ orderId: order.orderId });
        if (res && res.success) {
          navigation.navigate('KshopeCart');
        } else {
          openDetails(order);
        }
      } catch {
        openDetails(order);
      } finally {
        showLoader(false);
      }
    },
    [navigation, openDetails, showLoader],
  );

  // Only display real orders from API, never dummy fallback orders
  const displayOrders = useMemo(() => {
    if (orderData && orderData.length > 0) {
      return sortByNewest(orderData);
    }
    return [];
  }, [orderData]);

  // Dynamic statistics calculations
  const { totalCount, activeCount, deliveredCount } = useMemo(() => {
    if (orderData && orderData.length > 0) {
      let active = 0;
      let delivered = 0;
      orderData.forEach(order => {
        const type = getOrderStatusType(order);
        if (type === 'processing' || type === 'shipped') {
          active++;
        } else if (type === 'delivered') {
          delivered++;
        }
      });
      return {
        totalCount: orderData.length,
        activeCount: active,
        deliveredCount: delivered,
      };
    }
    return {
      totalCount: 0,
      activeCount: 0,
      deliveredCount: 0,
    };
  }, [orderData]);

  // Filtered rows for current tab
  const filteredOrders = useMemo(() => {
    if (tab === 'all') {
      return displayOrders;
    }
    return displayOrders.filter(order => {
      const type = getOrderStatusType(order);
      return type === tab;
    });
  }, [displayOrders, tab]);

  const renderHeaderComponent = useMemo(
    () => (
      <View>
        {/* Header navigation bar */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            testID="orders-back"
            onPress={goBack}
            style={styles.circleButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="chevron-back" size={20} color={ORDER_COLORS.ink} />
          </TouchableOpacity>

          <TouchableOpacity
            testID="orders-search"
            onPress={openSearch}
            style={styles.circleButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="search-outline" size={20} color={ORDER_COLORS.ink} />
          </TouchableOpacity>
        </View>

        {/* Screen titles */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>My Orders</Text>
          <Text style={styles.subtitleText}>Your treasures, our care</Text>
        </View>

        {/* 3-stat metrics card */}
        <OrdersSummaryCard
          totalCount={totalCount}
          activeCount={activeCount}
          deliveredCount={deliveredCount}
        />

        {/* Filter tabs */}
        <OrderTabs value={tab} onChange={setTab} />
      </View>
    ),
    [activeCount, deliveredCount, goBack, openSearch, tab, totalCount],
  );

  const renderEmptyComponent = useCallback(() => {
    if (loading) {
      return null;
    }
    const isFiltered = tab !== 'all' && totalCount > 0;
    if (isFiltered) {
      return (
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIconCircle}>
            <Ionicons
              name="bag-handle-outline"
              size={pt(38)}
              color={ORDER_COLORS.darkGreen}
            />
          </View>
          <Text style={styles.emptyTitle}>{`No ${tab} orders`}</Text>
          <Text style={styles.emptySubtitle}>
            {`You don't have any ${tab} orders at this moment.`}
          </Text>
          <TouchableOpacity
            testID="orders-empty-view-all-btn"
            style={styles.exploreButton}
            onPress={() => setTab('all')}
            activeOpacity={0.88}
          >
            <Text style={styles.exploreButtonText}>View All Orders</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <OrdersEmptyState
        onExplore={() => navigation.navigate('KshopeHome')}
        onWishlist={() =>
          navigation.navigate('KshopeHome', { screen: 'WishlistScreen' })
        }
        onBookConsultation={() =>
          navigation.navigate('KshopeSearch', { query: 'Showroom' })
        }
      />
    );
  }, [loading, navigation, tab, totalCount]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9F8" />

      <FlatList
        data={filteredOrders}
        keyExtractor={(item, index) => `${item.orderId || index}`}
        ListHeaderComponent={renderHeaderComponent}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() => openDetails(item)}
            onTrack={() => handleTrack(item)}
            onRate={() => handleRate(item)}
            onInvoice={() => handleInvoice(item)}
            onReorder={() => handleReorder(item)}
          />
        )}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[ORDER_COLORS.darkGreen]}
            tintColor={ORDER_COLORS.darkGreen}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9F8',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginTop: 14,
  },
  titleText: {
    fontFamily: Fonts.cormorantGaramond.semiBold,
    fontSize: pt(32),
    lineHeight: pt(38),
    color: ORDER_COLORS.darkGreen,
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontFamily: Fonts.cormorantGaramond.regular,
    fontSize: pt(14),
    lineHeight: pt(18),
    color: ORDER_COLORS.inkMuted,
    marginTop: 3,
  },
  listContent: {
    paddingBottom: 36,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: pt(60),
    paddingBottom: pt(40),
    paddingHorizontal: pt(28),
  },
  emptyIconCircle: {
    width: pt(76),
    height: pt(76),
    borderRadius: pt(38),
    backgroundColor: '#F5F2EC',
    borderWidth: 1,
    borderColor: '#E8E0D5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: pt(18),
  },
  emptyTitle: {
    fontFamily: Fonts.cormorantGaramond.semiBold,
    fontSize: pt(24),
    lineHeight: pt(30),
    color: ORDER_COLORS.darkGreen,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: Fonts.lexend.regular,
    fontSize: pt(12),
    lineHeight: pt(18),
    color: ORDER_COLORS.inkMuted,
    textAlign: 'center',
    marginTop: pt(8),
    maxWidth: pt(280),
  },
  exploreButton: {
    marginTop: pt(24),
    backgroundColor: ORDER_COLORS.darkGreen,
    paddingVertical: pt(12),
    paddingHorizontal: pt(26),
    borderRadius: pt(24),
    shadowColor: ORDER_COLORS.darkGreen,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  exploreButtonText: {
    fontFamily: Fonts.lexend.medium,
    fontSize: pt(13),
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});

export default MyOrdersRedesignScreen;

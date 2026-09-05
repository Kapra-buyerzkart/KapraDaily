import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import {
  BackHandler,
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LoaderContext } from '../../../context/loaderContext';
import { getMyOrdersApi } from '../../../api/services/orderService';
import { HOME_FONTS } from '../../Home/redesign/theme';
import type { OrderListItem } from '../../../types/order';
import { bucketOrders, detailParams, type OrderBucket } from './data/selectors';
import ActiveOrderHero from './sections/ActiveOrderHero';
import OrderCard from './sections/OrderCard';
import OrderTabs from './sections/OrderTabs';
import RecentOrderRow from './sections/RecentOrderRow';
import { ORDER_COLORS, fs, s } from './sections/theme';

type Row =
  | { type: 'hero'; order: OrderListItem }
  | { type: 'card'; order: OrderListItem }
  | { type: 'heading'; label: string }
  | { type: 'recent'; order: OrderListItem };

const rowKey = (row: Row, index: number) => {
  if (row.type === 'heading') {
    return `heading-${index}`;
  }
  const id = row.order.orderId ?? index;
  return `${row.type}-${id}`;
};

const MyOrdersRedesignScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [orderData, setOrderData] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<OrderBucket>('active');
  const hasLoadedOnce = useRef(false);
  const { showLoader } = useContext(LoaderContext) || { showLoader: () => {} };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (!navigation.canGoBack()) {
          return false;
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

  const openDetails = useCallback(
    (order: OrderListItem) => {
      navigation.navigate('KshopeMyOrderDetails', detailParams(order));
    },
    [navigation],
  );

  const grouped = useMemo(() => bucketOrders(orderData), [orderData]);

  const rows = useMemo<Row[]>(() => {
    if (tab !== 'active') {
      return grouped[tab].map(order => ({ type: 'recent' as const, order }));
    }

    const [hero, ...rest] = grouped.active;
    const past = [...grouped.delivered, ...grouped.cancelled];
    const built: Row[] = [];

    if (hero) {
      built.push({ type: 'hero', order: hero });
    }
    rest.forEach(order => built.push({ type: 'card', order }));
    if (past.length > 0) {
      built.push({ type: 'heading', label: 'Recent Orders' });
      past.forEach(order => built.push({ type: 'recent', order }));
    }

    return built;
  }, [grouped, tab]);

  const renderRow = useCallback(
    ({ item }: { item: Row }) => {
      if (item.type === 'heading') {
        return <Text style={styles.heading}>{item.label}</Text>;
      }
      if (item.type === 'hero') {
        return (
          <ActiveOrderHero
            order={item.order}
            onPress={() => openDetails(item.order)}
          />
        );
      }
      if (item.type === 'card') {
        return (
          <OrderCard order={item.order} onPress={() => openDetails(item.order)} />
        );
      }
      return (
        <RecentOrderRow
          order={item.order}
          onPress={() => openDetails(item.order)}
        />
      );
    },
    [openDetails],
  );

  const renderEmpty = useCallback(() => {
    if (loading) {
      return null;
    }
    return (
      <View style={styles.empty}>
        <Image
          source={require('../../../assets/images/nowishlist.png')}
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <Text style={styles.emptyTitle}>No Orders Yet</Text>
        <Text style={styles.emptySubtitle}>
          You haven't placed any orders yet. Start shopping to see your orders
          here!
        </Text>
        <TouchableOpacity
          style={styles.emptyButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('KshopeHome')}
        >
          <Text style={styles.emptyButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }, [loading, navigation]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={ORDER_COLORS.page} />

      <View style={styles.header}>
        {navigation.canGoBack() ? (
          <TouchableOpacity
            testID="orders-back"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name="arrow-back"
              size={fs(22)}
              color={ORDER_COLORS.ink}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity
          testID="orders-cart"
          onPress={() => navigation.navigate('KshopeCart')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="cart" size={fs(24)} color={ORDER_COLORS.accent} />
        </TouchableOpacity>
      </View>

      <OrderTabs value={tab} onChange={setTab} />

      <FlatList
        data={rows}
        keyExtractor={rowKey}
        renderItem={renderRow}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.listContent,
          rows.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: ORDER_COLORS.page },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingVertical: s(12),
  },
  backButton: { width: s(28) },
  headerTitle: {
    flex: 1,
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(18),
    color: ORDER_COLORS.ink,
  },
  heading: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(15),
    color: ORDER_COLORS.ink,
    paddingHorizontal: s(16),
    marginTop: s(24),
  },
  listContent: { paddingBottom: s(32) },
  listContentEmpty: { flexGrow: 1 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(32),
  },
  emptyImage: { width: s(180), height: s(180) },
  emptyTitle: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(16),
    color: ORDER_COLORS.ink,
    marginTop: s(12),
  },
  emptySubtitle: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(12),
    color: ORDER_COLORS.inkMuted,
    textAlign: 'center',
    marginTop: s(8),
  },
  emptyButton: {
    marginTop: s(24),
    paddingHorizontal: s(32),
    paddingVertical: s(12),
    borderRadius: s(8),
    backgroundColor: ORDER_COLORS.accent,
  },
  emptyButtonText: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(13),
    color: '#FFFFFF',
  },
});

export default MyOrdersRedesignScreen;

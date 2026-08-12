import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from '@/styles/typography';
import {
  ACCENT,
  RADIUS,
  SPACE,
  SURFACE,
  TYPE,
  GUTTER,
  MAX_FONT_SCALE,
} from '@/styles/homeTheme';
import { AppContext } from '@/context/appContext';
import ConfirmationModal from '@/components/ConfirmationModal';
import logger from '@/utils/logger';
import { getMyOrdersApi, reorderApi } from '@/api/orderService';
import OrdersHeader from './organisms/OrdersHeader';
import OrdersFilterBar from './organisms/OrdersFilterBar';
import LiveOrderCard from './organisms/LiveOrderCard';
import OrderCard from './organisms/OrderCard';
import OrderCardSkeleton from './molecules/OrderCardSkeleton';
import OrdersEmptyState from './molecules/OrdersEmptyState';
import {
  ORDER_GROUP,
  resolveOrderStatus,
  isLiveOrder,
} from './tokens/orderStatus';
import { formatItemCount, orderIdOf } from './tokens/format';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: ORDER_GROUP.active, label: 'Active' },
  { key: ORDER_GROUP.delivered, label: 'Delivered' },
  { key: ORDER_GROUP.cancelled, label: 'Cancelled' },
];

const EMPTY_COPY = {
  all: {
    icon: 'bag-handle-outline',
    title: 'No orders yet',
    message: 'Your grocery runs will show up here the moment you place one.',
    actionLabel: 'Start shopping',
  },
  [ORDER_GROUP.active]: {
    icon: 'bicycle-outline',
    title: 'Nothing on the way',
    message: 'You have no orders in progress right now.',
    actionLabel: 'Order something',
  },
  [ORDER_GROUP.delivered]: {
    icon: 'checkmark-done-outline',
    title: 'No delivered orders',
    message: 'Once an order reaches your door it will be listed here.',
  },
  [ORDER_GROUP.cancelled]: {
    icon: 'close-circle-outline',
    title: 'No cancelled orders',
    message: 'Good news — nothing was cancelled or returned.',
  },
};

const SKELETONS = [0, 1, 2, 3];

const OrdersScreen = () => {
  const navigation = useNavigation();
  const { isStoreUnavailable, generalSettings } = useContext(AppContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [reorderTarget, setReorderTarget] = useState(null);
  const hasLoadedOnce = useRef(false);

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });

  const fetchOrders = useCallback(async ({ silent } = {}) => {
    if (!silent && !hasLoadedOnce.current) setLoading(true);
    try {
      const response = await getMyOrdersApi();
      const list = Array.isArray(response?.data?.items)
        ? response.data.items
        : Array.isArray(response?.data)
        ? response.data
        : [];
      setOrders(list);
    } catch (error) {
      logger.error('Error fetching orders:', error);
    } finally {
      hasLoadedOnce.current = true;
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchOrders({ silent: hasLoadedOnce.current });
    }, [fetchOrders]),
  );

  const goBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('HomeScreen');
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          goBack();
          return true;
        },
      );
      return () => subscription.remove();
    }, [goBack]),
  );

  const decorated = useMemo(
    () => orders.map(order => ({ order, status: resolveOrderStatus(order) })),
    [orders],
  );

  const counts = useMemo(() => {
    const tally = {
      all: decorated.length,
      [ORDER_GROUP.active]: 0,
      [ORDER_GROUP.delivered]: 0,
      [ORDER_GROUP.cancelled]: 0,
    };
    decorated.forEach(({ status }) => {
      const bucket =
        status.group === ORDER_GROUP.pending
          ? ORDER_GROUP.active
          : status.group;
      tally[bucket] = (tally[bucket] || 0) + 1;
    });
    return tally;
  }, [decorated]);

  const liveEntry = useMemo(
    () => decorated.find(({ status }) => isLiveOrder(status)),
    [decorated],
  );

  const visible = useMemo(() => {
    const rows =
      filter === 'all'
        ? decorated
        : decorated.filter(({ status }) =>
            filter === ORDER_GROUP.active
              ? isLiveOrder(status)
              : status.group === filter,
          );
    return filter === 'all' && liveEntry
      ? rows.filter(entry => entry !== liveEntry)
      : rows;
  }, [decorated, filter, liveEntry]);

  const filters = useMemo(
    () => FILTERS.map(item => ({ ...item, count: counts[item.key] || 0 })),
    [counts],
  );

  const openOrder = useCallback(
    order => {
      navigation.navigate('OrderTrackingScreen', {
        orderId: orderIdOf(order),
        orderNumber: order?.orderNumber,
        order,
      });
    },
    [navigation],
  );

  const confirmReorder = useCallback(async () => {
    const idToUse = orderIdOf(reorderTarget);
    setReorderTarget(null);
    if (!idToUse) return;
    try {
      await reorderApi({ orderId: idToUse });
      navigation.navigate('CartScreen');
    } catch (error) {
      logger.error('Reorder failed:', error);
    }
  }, [navigation, reorderTarget]);

  const renderItem = useCallback(
    ({ item, index }) => (
      <OrderCard
        order={item.order}
        index={index}
        onOpen={openOrder}
        onReorder={setReorderTarget}
        reorderDisabled={isStoreUnavailable}
      />
    ),
    [isStoreUnavailable, openOrder],
  );

  const subtitle = loading
    ? 'Fetching your orders…'
    : counts.all
    ? `${counts.all} ${counts.all === 1 ? 'order' : 'orders'}${
        counts[ORDER_GROUP.active]
          ? ` · ${counts[ORDER_GROUP.active]} in progress`
          : ''
      }`
    : 'Everything you have ordered, in one place';

  const listHeader =
    filter === 'all' && liveEntry ? (
      <LiveOrderCard order={liveEntry.order} onOpen={openOrder} />
    ) : null;

  const listEmpty = loading ? (
    <View>
      {SKELETONS.map(key => (
        <OrderCardSkeleton key={key} />
      ))}
    </View>
  ) : listHeader ? null : (
    <OrdersEmptyState
      {...EMPTY_COPY[filter]}
      onAction={
        EMPTY_COPY[filter]?.actionLabel
          ? () => navigation.navigate('HomeScreen')
          : undefined
      }
    />
  );

  const listFooter =
    generalSettings?.show_temporary_message === '1' && !loading ? (
      <View style={styles.note}>
        <Text style={styles.noteText} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          Orders placed from 1 April 2025 onward are available.
        </Text>
      </View>
    ) : null;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <StatusBar
        contentStyle="dark-content"
        backgroundColor="white"
        translucent={true}
      />
      <OrdersHeader scrollY={scrollY} subtitle={subtitle} onBack={goBack} />

      <OrdersFilterBar filters={filters} active={filter} onSelect={setFilter} />

      <Animated.FlatList
        data={visible}
        keyExtractor={(item, index) =>
          (orderIdOf(item.order) ?? index).toString()
        }
        renderItem={renderItem}
        onScroll={onScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        ListFooterComponent={listFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchOrders({ silent: true });
            }}
            tintColor={ACCENT.primary}
            colors={[ACCENT.primary]}
          />
        }
      />

      <ConfirmationModal
        visible={!!reorderTarget}
        title="Add these items again?"
        message={
          reorderTarget
            ? `We will move ${formatItemCount(
                reorderTarget.totalOrderItems,
              )} from this order into your cart.`
            : ''
        }
        confirmText="Add to cart"
        cancelText="Not now"
        onClose={() => setReorderTarget(null)}
        onConfirm={confirmReorder}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  listContent: {
    paddingTop: SPACE.xs,
    paddingBottom: hp('7%'),
    flexGrow: 1,
  },
  note: {
    marginHorizontal: GUTTER,
    marginTop: SPACE.sm,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.sm,
    borderRadius: RADIUS.sm,
    backgroundColor: SURFACE.tint,
    borderLeftWidth: 3,
    borderLeftColor: ACCENT.primary,
  },
  noteText: {
    ...TYPE.caption,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.medium,
    color: ACCENT.discount,
  },
});

export default OrdersScreen;

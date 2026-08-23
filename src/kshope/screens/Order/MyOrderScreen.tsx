import React, { useCallback, useContext, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, { Line } from 'react-native-svg';
import { colors } from '../../theme/colours';
import { styles } from './styles';
import { AppIcons } from '../../assets/icons';
import { LoaderContext } from '../../context/loaderContext';
import { getMyOrdersApi } from '../../api/services/orderService';
import KSHOPE_CONFIG from '../../globals/config';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import FallbackImage from '../../components/FallbackImage';
import { OrderLineItem, OrderListItem } from '../../types/order';

const DashedSeparator = () => (
  <View style={styles.separatorContainer}>
    <Svg height="1" width="100%">
      <Line
        x1="0"
        y1="0.5"
        x2="100%"
        y2="0.5"
        stroke={colors.lightGrey}
        strokeWidth="1"
        strokeDasharray="8, 8"
      />
    </Svg>
  </View>
);

const MyOrderScreen = () => {
  const navigation = useNavigation<any>();

  const [orderData, setOrderData] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const hasLoadedOnce = useRef(false);
  const { showLoader } = useContext(LoaderContext) || { showLoader: () => {} };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
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

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'Out For Order':
      case 'Out for Delivery':
      case 'Delivery Agent Assigned':
        return (
          <MaterialCommunityIcons name="truck-fast" size={20} color="#F39C12" />
        );
      case 'Cancelled':
        return <Ionicons name="close-circle" size={20} color={colors.red} />;
      case 'Delivered':
        return (
          <Ionicons name="checkmark-circle" size={20} color={colors.green} />
        );
      case 'Order Placed':
      case 'Order Pending':
        return (
          <MaterialCommunityIcons
            name="clock-outline"
            size={20}
            color="#3498DB"
          />
        );
      default:
        return null;
    }
  };

  const fetchMyOrderFunction = useCallback(async (silent?: boolean) => {
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
  }, [showLoader]);

  useFocusEffect(
    useCallback(() => {
      fetchMyOrderFunction(hasLoadedOnce.current);
    }, [fetchMyOrderFunction]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMyOrderFunction(true);
  }, [fetchMyOrderFunction]);

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return require('../../assets/images/logos/noimage.png');
    if (typeof imagePath !== 'string') return imagePath;
    if (imagePath.startsWith('http')) return { uri: imagePath };
    return {
      uri: `${KSHOPE_CONFIG.image_base_url}/${imagePath}`.replace(
        /([^:]\/)\/+/g,
        '$1',
      ),
    };
  };

  const renderOrderItem = (
    product: OrderLineItem,
    order: OrderListItem,
    index: number,
  ) => {
    const item = {
      ...product,
      orderId: order?.orderId,
      orderNumber: order?.orderNumber,
    };

    return (
      <TouchableOpacity
        key={index}
        style={styles.itemContainer}
        onPress={() =>
          navigation.navigate('KshopeMyOrderDetails', { order, selectedItem: item })
        }
      >
        <FallbackImage
          source={getImageUrl(item?.featuredImage)}
          style={styles.itemImage}
          resizeMode="contain"
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item?.productName}
          </Text>
          <Text style={styles.discountedPrice}>
            ₹{item?.lineTotal?.toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.chevronContainer}
          onPress={() =>
            navigation.navigate('KshopeMyOrderDetails', { order, selectedItem: item })
          }
        >
          <AppIcons.RightArrow color={colors.themeTeal} size={20} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderOrderCard = ({ item }: { item: OrderListItem }) => {
    let parsedItems: OrderLineItem[] = [];
    try {
      parsedItems = item?.items
        ? typeof item.items === 'string'
          ? JSON.parse(item.items)
          : item.items
        : [];
    } catch (e) {
      parsedItems = [];
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.statusContainer}>
            {renderStatusIcon(item.orderStatusText || '')}
            <Text style={styles.statusText}>{item.orderStatusText}</Text>
          </View>
          <Text style={styles.dateText}>
            {item.orderDate
              ? new Date(item.orderDate).toLocaleDateString()
              : ''}
          </Text>
        </View>

        <DashedSeparator />

        {parsedItems.map((product, idx) =>
          renderOrderItem(product, item, idx),
        )}

        <DashedSeparator />

        <View style={styles.cardFooter}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerLabel}>Order ID :</Text>
            <Text style={styles.orderIdText}>{item.orderNumber}</Text>
          </View>
          <View style={styles.footerRight}>
            <Text style={styles.footerLabel}>Total Amount :</Text>
            <Text style={styles.totalAmountText}>
              ₹{item.grandTotal?.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Image
          source={require('../../assets/images/nowishlist.png')}
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <Text style={styles.emptyTitle}>No Orders Yet</Text>
        <Text style={styles.emptySubtitle}>
          You haven't placed any orders yet. Start shopping to see your orders
          here!
        </Text>
        <TouchableOpacity
          style={[
            styles.buyAgainBtn,
            {
              marginTop: hp('3%'),
              width: wp('50%'),
              backgroundColor: colors.themeTeal,
            },
          ]}
          onPress={() => navigation.navigate('KshopeHome')}
        >
          <Text style={[styles.buyAgainText, { color: colors.white }]}>
            Start Shopping
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <AppIcons.ArrowBack color={colors.black} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Order</Text>
      </View>

      <FlatList
        data={orderData}
        keyExtractor={(item, index) =>
          item.orderId ? item.orderId.toString() : index.toString()
        }
        renderItem={renderOrderCard}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={[
          styles.listContent,
          orderData.length === 0 && { flex: 1 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default MyOrderScreen;

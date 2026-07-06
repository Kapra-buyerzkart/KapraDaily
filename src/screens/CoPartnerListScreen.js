import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import icons from '@/assets/icons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FONTS } from '../styles/typography';

const formatDate = dateStr => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr.split('T')[0];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${d.getDate().toString().padStart(2, '0')} ${months[d.getMonth()]}`;
};

const formatAmount = val => {
  if (val == null) return '';
  const str = val.toString().replace(/[^0-9.-]+/g, '');
  const num = parseFloat(str);
  if (isNaN(num)) return val;
  return `₹${num.toLocaleString('en-IN')}`;
};

const CoPartnerListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { title, icon, items = [], type } = route.params || {};

  const [limit, setLimit] = useState(20);

  const visibleItems = items.slice(0, limit);
  const hasMore = items.length > limit;

  const handleLoadMore = () => {
    if (hasMore) {
      setLimit(prev => prev + 20);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        hitSlop={40}
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <Image
          source={icons.backArrowNew}
          style={{
            resizeMode: 'contain',
            tintColor: '#000',
          }}
        />
      </TouchableOpacity>
      <MaterialCommunityIcons
        name={icon}
        size={wp('6%')}
        color="#F25000"
        style={{ marginRight: wp('2%') }}
      />
      <Text style={styles.headerTitle}>{title}</Text>
      <Text style={styles.itemCount}>({items.length})</Text>
    </View>
  );

  const renderItem = ({ item, index }) => {
    const maskPhone = phone => {
      if (!phone) return '';
      const phoneStr = String(phone);
      if (phoneStr.length <= 4) return phoneStr;
      return phoneStr.slice(0, 2) + '******' + phoneStr.slice(-2);
    };

    const itemName =
      type === 'orders'
        ? item.orderNumber || item.id || item.orderId || `#ORD${index}`
        : type === 'payouts'
        ? item.payMode || item.type || item.payoutMethod || 'Transfer'
        : item.name || item.custName || 'User';

    let itemSubRaw =
      type === 'orders'
        ? item.orderStatusKey || item.status || item.orderStatus
        : type === 'payouts'
        ? 'Success' || item.status || item.payoutStatus
        : item.phone || item.phoneNo || '';
    const itemSub =
      type !== 'orders' && type !== 'payouts' && itemSubRaw
        ? maskPhone(itemSubRaw)
        : itemSubRaw;

    let itemStatusValue =
      type === 'copartners'
        ? item.type || item.status || 'Registered on'
        : item.status || '';
    if (type === 'orders' || type === 'payouts') {
      itemStatusValue = formatAmount(
        item.grandTotal || item.amount || item.totalAmount || 0,
      );
    }
    if (type === 'customers') {
      itemStatusValue = formatDate(item.createdDate);
    }

    const rawDate =
      type === 'payouts'
        ? item.paidOn
        : type === 'copartners'
        ? item.addedOn
        : item.orderDate || item.date || item.createdAt || '';
    const itemDate = formatDate(rawDate);

    return (
      <View style={styles.listItem}>
        <View style={styles.listItemLeft}>
          <Text style={styles.itemName}>{itemName}</Text>
          <Text
            style={[styles.itemSub, type === 'payouts' && { color: 'green' }]}
          >
            {itemSub}
          </Text>
        </View>
        <View style={styles.listItemRight}>
          <Text
            style={[
              styles.itemStatusValue,
              type === 'copartners' && styles.itemDate,
            ]}
          >
            {itemStatusValue}
          </Text>
          <Text style={styles.itemDate}>{itemDate}</Text>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!hasMore)
      return (
        <View style={styles.footerWrap}>
          <Text style={styles.footerText}></Text>
        </View>
      );
    return (
      <View style={styles.footerWrap}>
        <ActivityIndicator size="small" color="#F25000" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <FlatList
        data={visibleItems}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No items available</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('2%'),
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
    paddingBottom: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    padding: wp('2%'),
  },
  headerTitle: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.5%'),
    color: '#000000',
  },
  itemCount: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.5%'),
    color: '#888888',
    marginLeft: wp('2%'),
  },
  listContent: {
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('5%'),
    paddingTop: hp('1%'),
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('2%'),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F2F2F2',
    borderRadius: wp('6%'),
    paddingHorizontal: wp('5%'),
    marginBottom: hp('1.5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  listItemLeft: {
    flex: 1,
  },
  itemName: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.5%'),
    color: '#181C1E',
  },
  itemSub: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('2.8%'),
    color: '#4A3D3D',
    marginTop: hp('0.2%'),
  },
  listItemRight: {
    alignItems: 'flex-end',
  },
  itemStatusValue: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.5%'),
    color: '#181C1E',
  },
  itemDate: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('2.8%'),
    color: '#4A3D3D',
    marginTop: hp('0.2%'),
  },
  footerWrap: {
    paddingVertical: hp('2%'),
    alignItems: 'center',
  },
  footerText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3%'),
    color: '#AAAAAA',
  },
  emptyText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.5%'),
    color: '#888',
    textAlign: 'center',
    marginTop: hp('5%'),
  },
});

export default CoPartnerListScreen;

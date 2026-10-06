import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS } from '@/styles/typography';
import ProductRail from '../ProductRail';

const BuyItAgainModernSection = ({ products = [], navigation }) => {
  const handleViewHistory = useCallback(() => {
    navigation.navigate('MyOrdersScreen');
  }, [navigation]);

  if (!products || products.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>FROM YOUR ORDERS</Text>

      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Buy It Again</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleViewHistory}
          style={styles.viewHistoryButton}
        >
          <Text style={styles.viewHistoryText}>My Orders</Text>
          <Feather name="chevron-right" size={14} color={'#F25000'} />
        </TouchableOpacity>
      </View>
      <Text style={styles.subTitle}>Your regulars, one tap away</Text>

      {/* Rail */}
      <ProductRail
        items={products}
        navigation={navigation}
        contentContainerStyle={styles.railContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp('1.5%'),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    marginBottom: hp('1%'),
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  title: {
    fontSize: wp('4.4%'),
    fontFamily: FONTS.gilroy.bold,
    color: '#111827',
  },
  viewHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewHistoryText: {
    fontSize: wp('3.3%'),
    fontFamily: FONTS.gilroy.semiBold,
    color: '#F25000',
    marginRight: 2,
  },
  railContent: {
    paddingLeft: wp('3.5%'),
    paddingRight: wp('2%'),
  },
  mainTitle: {
    paddingHorizontal: wp('4%'),
    paddingBottom: wp('2'),
    letterSpacing: 4,
    color: '#F25000',
  },
  subTitle: {
    paddingHorizontal: wp('4%'),

    fontFamily: FONTS.gilroy.light,
  },
});

export default React.memo(BuyItAgainModernSection);

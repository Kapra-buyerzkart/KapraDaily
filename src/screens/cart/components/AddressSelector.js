import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Svg, { Line } from 'react-native-svg';
import { FONTS } from '@/styles/typography';
import { wp, hp } from '../../../styles/cartTheme';

const AddressSelector = ({ address, onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onPress}
        style={styles.row}
      >
        <View style={styles.iconCircle}>
          <Ionicons name="location-sharp" size={wp('4.8%')} color="#FF6200" />
        </View>

        <View style={styles.copy}>
          <Text style={styles.deliveringLabel}>DELIVERING TO</Text>
          <Text style={styles.addressText} numberOfLines={1}>
            {address || 'Select delivery address'}
          </Text>
        </View>

        <View style={styles.changeBtn}>
          <Text style={styles.changeText}>Change</Text>
          <Feather name="chevron-right" size={16} color="#6B7280" />
        </View>
      </TouchableOpacity>

      {/* Dotted black divider line (SVG for 100% iOS & Android compatibility) */}
      <View style={styles.orangeDivider}></View>
    </View>
  );
};

export default React.memo(AddressSelector);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingTop: hp('0.6%'),
    paddingBottom: hp('1.2%'),
    backgroundColor: '#FFFFFF',
    gap: wp('3%'),
  },
  iconCircle: {
    width: wp('9.5%'),
    height: wp('9.5%'),
    borderRadius: wp('4.75%'),
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 5,
  },
  deliveringLabel: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.8%'),
    color: '#9CA3AF',
    letterSpacing: 0.4,
  },
  addressText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.7%'),
    color: '#000000',
  },
  changeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  changeText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.3%'),
    color: '#6B7280',
  },
  orangeDivider: {
    width: '100%',
    height: 2,
    backgroundColor: '#FD7301',
    overflow: 'hidden',
  },
});

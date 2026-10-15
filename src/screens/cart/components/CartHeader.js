import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import DottedDivider from './atoms/DottedDivider';
import { FONTS } from '@/styles/typography';
import { wp, hp } from '../../../styles/cartTheme';

const CartHeader = ({ onBack, onClearAll, itemCount }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <Feather name="chevron-left" size={28} color="#000000" />
        </TouchableOpacity>

        <View style={styles.titleBlock}>
          <Text style={styles.title}>My cart</Text>
          <Text style={styles.subtitle}>
            {`${itemCount || 0} item${
              itemCount === 1 ? '' : 's'
            } added to your cart`}
          </Text>
        </View>

        {Boolean(itemCount && itemCount > 0) && (
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={onClearAll}
            activeOpacity={0.7}
            style={styles.clearAllBtn}
          >
            <Feather name="trash-2" size={14} color="#3F3F46" />
            <Text style={styles.clearAllText}>Clear all</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Dotted border separator */}
      <DottedDivider style={styles.dottedDivider} />
    </View>
  );
};

export default React.memo(CartHeader);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    paddingRight: wp('2%'),
    paddingVertical: 4,
  },
  titleBlock: {
    flex: 1,
    marginLeft: 2,
  },
  title: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('5.2%'),
    color: '#000000',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.3%'),
    color: '#71717A',
    marginTop: 2,
  },
  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  clearAllText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.2%'),
    color: '#3F3F46',
  },
  dottedDivider: {
    marginVertical: hp('0.5%'),
  },
});

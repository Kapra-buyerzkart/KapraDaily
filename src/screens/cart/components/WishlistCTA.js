import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '@/styles/typography';
import { wp, hp } from '../../../styles/cartTheme';

const WishlistCTA = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.iconCircle}>
          <Ionicons name="heart" size={wp('5%')} color="#EF4444" />
        </View>

        <View style={styles.copy}>
          <Text style={styles.title}>Add from your wishlist</Text>
          <Text style={styles.subtitle}>Saved items you may still want</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.addBtn}
          onPress={onPress}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Solid orange accent divider line */}
      <View style={styles.orangeDivider} />
    </View>
  );
};

export default React.memo(WishlistCTA);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    marginTop: hp('1%'),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    gap: wp('3.5%'),
  },
  iconCircle: {
    width: wp('9.5%'),
    height: wp('9.5%'),
    borderRadius: wp('4.75%'),
    backgroundColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.7%'),
    color: '#000000',
  },
  subtitle: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3%'),
    color: '#71717A',
  },
  addBtn: {
    borderWidth: 1.2,
    borderColor: '#EF4444',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  addBtnText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.4%'),
    color: '#EF4444',
  },
  orangeDivider: {
    height: 1.5,
    backgroundColor: '#FF6200',
    width: '100%',
    marginTop: hp('0.5%'),
  },
});

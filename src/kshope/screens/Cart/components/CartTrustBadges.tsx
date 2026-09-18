import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CART_COLORS, CART_FONTS, fs, s } from '../cartRedesignTheme';

export const CartTrustBadges: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* 1: Certified Jewellery */}
      <View style={styles.badgeItem}>
        <MaterialCommunityIcons
          name="diamond-stone"
          size={s(18)}
          color="#07332C"
        />
        <View style={styles.textBox}>
          <Text style={styles.badgeTitle}>Certified Jewellery</Text>
          <Text style={styles.badgeSubtitle}>Trusted Quality</Text>
        </View>
      </View>

      {/* Vertical Rule */}
      <View style={styles.vRule} />

      {/* 2: Secure Shopping */}
      <View style={styles.badgeItem}>
        <Ionicons name="lock-closed-outline" size={s(17)} color="#07332C" />
        <View style={styles.textBox}>
          <Text style={styles.badgeTitle}>Secure Shopping</Text>
          <Text style={styles.badgeSubtitle}>100% safe and secure</Text>
        </View>
      </View>

      {/* Vertical Rule */}
      <View style={styles.vRule} />

      {/* 3: Easy Support */}
      <View style={styles.badgeItem}>
        <Ionicons name="headset-outline" size={s(17)} color="#07332C" />
        <View style={styles.textBox}>
          <Text style={styles.badgeTitle}>Easy Support</Text>
          <Text style={styles.badgeSubtitle}>We're Here for you</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(12),
    paddingVertical: s(16),
    borderTopWidth: 1,
    borderColor: '#ECEAE5',
    backgroundColor: CART_COLORS.white,
    marginBottom: s(24),
  },
  badgeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(5),
  },
  textBox: {
    justifyContent: 'center',
  },
  badgeTitle: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(9),
    color: '#1A1A1A',
  },
  badgeSubtitle: {
    fontFamily: CART_FONTS.sansRegular,
    fontSize: fs(7.5),
    color: '#7A7A7A',
    marginTop: s(1),
  },
  vRule: {
    width: 1,
    height: s(22),
    backgroundColor: '#D1D5DB',
  },
});

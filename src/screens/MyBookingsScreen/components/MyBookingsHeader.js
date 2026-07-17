import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CoinBalance from '@/components/events/CoinBalance';

const MyBookingsHeader = ({ topInset = 20, bCoins, onBack }) => (
  <View style={[styles.header, { paddingTop: topInset }]}>
    <TouchableOpacity onPress={onBack} hitSlop={16} style={styles.backButton}>
      <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
    </TouchableOpacity>
    <Text style={styles.title}>My bookings</Text>
    <CoinBalance bCoins={bCoins} />
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Gilroy-Bold',
  },
});

export default React.memo(MyBookingsHeader);

import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles';
import { VOUCHER_DATA } from '../constants';

const VoucherCard = ({ item, onPress }) => (
  <TouchableOpacity
    style={styles.voucherCard}
    activeOpacity={0.8}
    onPress={() => onPress(item)}
  >
    <Image
      source={item.image}
      style={styles.voucherCardImage}
      resizeMode="cover"
    />
    <View style={styles.voucherCardBody}>
      <Text style={styles.voucherCardTitle}>{item.title}</Text>
      <Text style={styles.voucherCardDesc}>{item.description}</Text>
    </View>
  </TouchableOpacity>
);

const VoucherGrid = ({ onVoucherPress }) => (
  <View style={styles.voucherGrid}>
    {VOUCHER_DATA.map(item => (
      <VoucherCard key={item.id} item={item} onPress={onVoucherPress} />
    ))}
  </View>
);

export default VoucherGrid;

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import styles from '../styles';
import CONFIG from '../../../globals/config';

const toImageSource = value =>
  typeof value === 'string' ? { uri: CONFIG.image_base_url + value } : value;

const VoucherCard = ({ item, onPress }) => (
  <TouchableOpacity
    style={styles.voucherCard}
    activeOpacity={0.8}
    onPress={() => onPress(item)}
  >
    <Image
      source={toImageSource(item.imageUrl || item.image)}
      style={styles.voucherCardImage}
      resizeMode="cover"
    />
    <View style={styles.voucherCardBody}>
      <Text style={styles.voucherCardTitle}>{item.title}</Text>
      <Text style={styles.voucherCardDesc}>₹{item.denomination} Voucher</Text>
    </View>
  </TouchableOpacity>
);

const VoucherGrid = ({ vouchers = [], loading = false, onVoucherPress }) => {
  if (loading) {
    return (
      <View
        style={[
          styles.voucherGrid,
          {
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 40,
          },
        ]}
      >
        <ActivityIndicator color="#e07f2b" />
      </View>
    );
  }

  console.log(vouchers, 'here is vouchere yaal');

  if (!vouchers?.length) {
    return (
      <View
        style={[
          styles.voucherGrid,
          {
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 40,
          },
        ]}
      >
        <Text
          style={{
            color: 'rgba(255,255,255,0.4)',
            fontFamily: 'Gilroy-Regular',
            fontSize: 14,
          }}
        >
          No vouchers yet
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.voucherGrid}>
      {vouchers.map((item, index) => (
        <VoucherCard
          key={item?.purchaseId || item?.voucherId || item?.id || index}
          item={item}
          onPress={onVoucherPress}
        />
      ))}

      {/* {vouchers.map((item, index) => (
        <VoucherCard
          key={item?.purchaseId || item?.voucherId || item?.id || index}
          item={item}
          onPress={onVoucherPress}
        />
      ))} */}
    </View>
  );
};

export default VoucherGrid;

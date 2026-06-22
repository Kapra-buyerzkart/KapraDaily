import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { LocationIcon, OrderIcon, ReferIcon } from '../../../components/ProfileIcons';
import { styles } from '../styles';

export default function ProfileQuickActions({
  onSavedAddress,
  onMyOrders,
  onRefer,
}) {
  return (
    <View style={styles.containerTwo}>
      <TouchableOpacity onPress={onSavedAddress} style={styles.saveAddressContainer}>
        <View style={styles.actionIconView}>
          <LocationIcon width={wp('5%')} height={wp('5%')} color="#FFFFFF" />
        </View>
        <Text style={styles.saveAddressText}>{'Saved \nAddress'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onMyOrders} style={styles.saveAddressContainer}>
        <View style={styles.actionIconView}>
          <OrderIcon width={wp('5%')} height={wp('5%')} color="#FFFFFF" />
        </View>
        <Text style={styles.saveAddressText}>{'My \nOrders'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onRefer}
        style={[styles.saveAddressContainer, styles.saveAddressAccent]}
      >
        <View style={styles.actionIconView}>
          <ReferIcon width={wp('5%')} height={wp('5%')} color="#FFFFFF" />
        </View>
        <Text style={styles.saveAddressText}>Refer</Text>
      </TouchableOpacity>
    </View>
  );
}

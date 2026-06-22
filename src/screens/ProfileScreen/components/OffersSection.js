import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { styles, GRAY_500, INK } from '../styles';

export default function OffersSection({ onSmartPoint, onCoupons }) {
  return (
    <>
      <Text style={styles.sectionHeader}>Offers</Text>
      <View style={styles.sectionCard}>
        <TouchableOpacity onPress={onSmartPoint} style={styles.listItem}>
          <View style={styles.listItemLeft}>
            <View style={styles.listIconWrapper}>
              <Ionicons name="wallet-outline" color={INK} size={wp('4%')} />
            </View>
            <Text style={styles.listItemText}>Smart point</Text>
          </View>
          <AntDesign name={'right'} color={GRAY_500} size={wp('3.5%')} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity onPress={onCoupons} style={styles.listItem}>
          <View style={styles.listItemLeft}>
            <View style={styles.listIconWrapper}>
              <Ionicons name="pricetag-outline" color={INK} size={wp('4%')} />
            </View>
            <Text style={styles.listItemText}>Coupons</Text>
          </View>
          <AntDesign name={'right'} color={GRAY_500} size={wp('3.5%')} />
        </TouchableOpacity>
      </View>
    </>
  );
}

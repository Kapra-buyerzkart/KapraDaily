import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  LocationIcon,
  OrderIcon,
  ReferIcon,
} from '../../../components/ProfileIcons';
import { styles, ORANGE } from '../styles';
import icons from '@/assets/icons';

export default function ProfileQuickActions({
  onMyOrders,
  onSavedAddress,
  onCoPartnerDashboard,
  onRefer,
}) {
  return (
    <View style={styles.quickActionsRow}>
      <TouchableOpacity
        onPress={onMyOrders}
        style={styles.quickActionCard}
        activeOpacity={0.7}
        accessibilityLabel="My Orders"
      >
        <Image source={icons.myorder} />
        <Text style={styles.quickActionText}>{'My\nOrders'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onSavedAddress}
        style={styles.quickActionCard}
        activeOpacity={0.7}
        accessibilityLabel="Saved Address"
      >
        <Image source={icons.savedAddress} />
        <Text style={styles.quickActionText}>{'Saved\nAddress'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onCoPartnerDashboard}
        style={styles.quickActionCard}
        activeOpacity={0.7}
        accessibilityLabel="Co-Partner Dashboard"
      >
        <Image source={icons.coPartnerdashboard} />
        <Text style={styles.quickActionText}>{'Co-Partner\nDashboard'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onRefer}
        style={styles.quickActionCard}
        activeOpacity={0.7}
        accessibilityLabel="Refer and Earn"
      >
        <Image source={icons.referNearn} />
        <Text style={styles.quickActionText}>{'Refer &\nEarn'}</Text>
      </TouchableOpacity>
    </View>
  );
}

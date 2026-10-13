import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import icons from '../../../assets/icons';
import { FONTS } from '@/styles/typography';
import { wp, hp } from '../../../styles/cartTheme';

const DeliveryHeader = ({
  itemCount,
  isScheduled,
  scheduleLabel,
  onSchedulePress,
  onSwitchToExpress,
}) => {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          {isScheduled ? (
            <Feather name="calendar" size={wp('6%')} color="#FF6200" />
          ) : (
            <Image source={icons.expressicon} style={styles.expressIcon} />
          )}
        </View>

        <View style={styles.etaBlock}>
          <Text style={styles.title} numberOfLines={1}>
            {isScheduled
              ? scheduleLabel || 'Scheduled delivery'
              : 'Express delivery'}
          </Text>
          <Text style={styles.subtitle}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in this order
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.scheduleBtn}
          onPress={onSchedulePress}
        >
          <Feather name="calendar" size={15} color="#4B5563" />
          <Text style={styles.scheduleText}>Schedule</Text>
        </TouchableOpacity>
      </View>

      {isScheduled && (
        <View style={styles.metaRow}>
          <TouchableOpacity
            onPress={onSwitchToExpress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          >
            <Text style={styles.switchText}>Switch to Express</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default React.memo(DeliveryHeader);

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: wp('4%'),
    paddingTop: hp('1.8%'),
    paddingBottom: hp('1.2%'),
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
  },
  iconWrap: {
    width: wp('10%'),
    height: wp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  expressIcon: {
    width: wp('9%'),
    height: wp('9%'),
    resizeMode: 'contain',
    tintColor: '#FF6200',
  },
  etaBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.1%'),
    color: '#000000',
  },
  subtitle: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.2%'),
    color: '#71717A',
  },
  scheduleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  scheduleText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.3%'),
    color: '#4B5563',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.8%'),
  },
  switchText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.1%'),
    color: '#FF6200',
    textDecorationLine: 'underline',
  },
});

import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { wp, hp } from '../../../utils/responsive';
import icons from '@/assets/icons';
import COLORS from '@/styles/colors';
import { COIN_BALANCE } from '../constants';

// Top header (back button + branded title) plus the sub header hint and the
// UD-Coin balance chip.
const TicketHeader = ({ onBack, coinBalance = COIN_BALANCE }) => (
  <>
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={onBack}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        activeOpacity={0.7}
      >
        <Image
          source={icons.backArrow}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Image
        source={icons.udenticketconimage}
        style={styles.titleImage}
        resizeMode="contain"
      />

      {/* Spacer keeps the title optically centered against the back button */}
      <View style={styles.backBtn} />
    </View>

    <View style={styles.subHeader}>
      <Text style={styles.hintText}>Use UD-Coins to Book Your Tickets</Text>
      <View style={styles.coinChip}>
        <Image
          source={icons.udcoin}
          style={styles.coinIcon}
          resizeMode="contain"
        />
        <Text style={styles.coinText}>{coinBalance}</Text>
      </View>
    </View>
  </>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(2),
  },
  backBtn: {
    width: 34,
    height: 34,
    justifyContent: 'center',
  },
  backIcon: {
    width: 22,
    height: 22,
    tintColor: COLORS.white,
  },
  titleImage: {
    width: wp(48),
    height: hp(5),
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(2.5),
  },
  hintText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Gilroy-Medium',
    color: COLORS.white,
  },
  coinChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(242,80,0,0.6)',
  },
  coinIcon: {
    width: 20,
    height: 20,
  },
  coinText: {
    fontSize: 14,
    fontFamily: 'Gilroy-Bold',
    color: COLORS.white,
  },
});

export default React.memo(TicketHeader);

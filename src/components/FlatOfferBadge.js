import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';

const FlatOfferBadge = ({
  discount = 50,
  flatLabel = 'FLAT',
  offLabel = 'OFF',
  gradientColors = ['#6B2BBF', '#C13FA8', '#F2569A'],
  flagColor = '#F25000',
  style,
  pillStyle,
  flagStyle,
  textStyle,
  flatTextStyle,
  showSparkles = true,
}) => {
  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.4 }}
        style={[styles.pill, pillStyle]}
      >
        {showSparkles && (
          <Ionicons name="sparkles" size={wp('3.5%')} color="#FFFFFF" />
        )}
        <Text style={[styles.pillText, textStyle]}>
          {discount}% {offLabel}
        </Text>
        {showSparkles && (
          <Ionicons name="sparkles" size={wp('3.5%')} color="#FFFFFF" />
        )}
      </LinearGradient>

      <View style={[styles.flag, { backgroundColor: flagColor }, flagStyle]}>
        <Text style={[styles.flagText, flatTextStyle]}>{flatLabel}</Text>
      </View>
      <View
        style={[styles.flagTail, { borderTopColor: flagColor }]}
      />
    </View>
  );
};

export default React.memo(FlatOfferBadge);

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    paddingTop: hp('1.6%'),
    paddingLeft: wp('2%'),
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('5%'),
    gap: wp('1.5%'),
  },
  pillText: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.heavy,
    fontSize: wp('4.6%'),
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
  flag: {
    position: 'absolute',
    top: 0,
    left: wp('3%'),
    paddingHorizontal: wp('2.6%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('1.2%'),
    transform: [{ rotate: '-6deg' }],
  },
  flagText: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('2.8%'),
    letterSpacing: 0.4,
  },
  flagTail: {
    position: 'absolute',
    top: hp('2.3%'),
    left: wp('3.6%'),
    width: 0,
    height: 0,
    borderLeftWidth: wp('1%'),
    borderRightWidth: wp('1%'),
    borderTopWidth: wp('1%'),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ rotate: '-6deg' }],
  },
});

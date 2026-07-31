import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FONTS } from '../styles/typography';

const SeeAllButton = ({ onPress, style, label }) => {
  const title = label || 'See All';

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[styles.button, style]}
    >
      <Text style={styles.text} numberOfLines={1}>
        {title}
      </Text>
      <MaterialIcons
        name="arrow-forward"
        size={wp('4.4%')}
        color="#FFFFFF"
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

export default SeeAllButton;

const styles = StyleSheet.create({
  // Was a white pill with a heavy orange glow and a media "play" triangle —
  // it read as a video control, not a navigation CTA. Now a flat solid pill so
  // it's unambiguously the section's action.
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('78%'),
    maxWidth: '88%',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    borderRadius: 999,
    backgroundColor: '#F25000',
  },
  text: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.8%'),
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  icon: {
    marginLeft: wp('2%'),
  },
});

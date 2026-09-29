import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CachedImage from '@/components/CachedImage';

const HomePromoBanner = ({ banner, onPress }) => {
  if (!banner || !banner.uri) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress && onPress(banner)}
      style={styles.bannerContainer}
      accessibilityRole="button"
      accessibilityLabel={banner.title || 'Promotional banner'}
    >
      <CachedImage
        source={banner.uri}
        style={styles.bannerImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    marginHorizontal: wp('3.5%'),
    // marginVertical: hp('1.4%'),
    borderRadius: 16,
    // overflow: 'hidden',
    aspectRatio: 3.3,
    // backgroundColor: '#F3F4F6',
    // shadowColor: '#000000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.06,
    // shadowRadius: 6,
    // elevation: 3,a
  },
  bannerImage: {
    marginVertical: 20,
    width: '100%',
    borderRadius: 16,
    height: '100%',
  },
});

export default React.memo(HomePromoBanner);

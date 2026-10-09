import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import images from '@/assets/images';
import { FONTS } from '@/styles/typography';
import MarqueeStrip from './MarqueeStrip';
import CachedImage from '@/components/CachedImage';
import AnimatedPressable from '@/components/AnimatedPressable';
import CONFIG from '@/globals/config';

const HomeFooter = ({
  banner,
  banners,
  onPress,
  onPressBanner,
}) => {
  const bannerItem = useMemo(() => {
    if (banner && !Array.isArray(banner)) {
      return banner;
    }
    const sourceList = Array.isArray(banner)
      ? banner
      : Array.isArray(banners)
      ? banners
      : Array.isArray(banners?.homeFooterBanners)
      ? banners.homeFooterBanners
      : banners?.homeFooter
      ? [banners.homeFooter]
      : [];

    if (sourceList.length > 0) {
      const matched = sourceList.find(item => {
        const key =
          item?.placementKey || item?.PlacementKey || item?.placement_key;
        return key === 'app_home_footer';
      });
      if (matched) return matched;
      return sourceList[0];
    }
    return null;
  }, [banner, banners]);

  const imageSource = useMemo(() => {
    if (!bannerItem) return images.bottomtag;
    if (bannerItem.uri) {
      return typeof bannerItem.uri === 'string'
        ? { uri: bannerItem.uri }
        : bannerItem.uri;
    }
    const rawUrl =
      bannerItem.imageUrl || bannerItem.ImageUrl || bannerItem.image;
    if (typeof rawUrl === 'string' && rawUrl.length > 0) {
      return {
        uri: rawUrl.startsWith('http')
          ? rawUrl
          : `${CONFIG.image_base_url}${rawUrl}`,
      };
    }
    return images.bottomtag;
  }, [bannerItem]);

  const handlePress = () => {
    if (bannerItem) {
      if (typeof onPress === 'function') {
        onPress(bannerItem);
      } else if (typeof onPressBanner === 'function') {
        onPressBanner(bannerItem);
      }
    }
  };

  const hasPressHandler = Boolean(
    bannerItem && (typeof onPress === 'function' || typeof onPressBanner === 'function'),
  );

  return (
    <View style={{ paddingTop: hp('10%') }}>
      <MarqueeStrip
        text="Quick Delivery • Secure Payments • Fresh Produce • Best Quality • Easy Returns"
        speed={40}
      />
      <View style={styles.container}>
        {hasPressHandler ? (
          <AnimatedPressable onPress={handlePress} activeOpacity={0.9}>
            <CachedImage
              source={imageSource}
              style={styles.image}
              resizeMode="contain"
            />
          </AnimatedPressable>
        ) : (
          <CachedImage
            source={imageSource}
            style={styles.image}
            resizeMode="contain"
          />
        )}
        <Text style={styles.title}>
          <Text style={styles.highlight}>You made it, </Text>
          That's all for today
        </Text>
        <Text style={styles.subtitle}>
          Explore more categories for fresh deals
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: hp('3%'),
    marginTop: hp('2%'),
    marginBottom: hp('2%'),
  },
  image: {
    width: wp('60%'),
    height: wp('35%'),
    marginBottom: hp('2%'),
  },
  title: {
    fontSize: wp('3.8%'),
    fontFamily: FONTS.gilroy.regular,
    color: '#000000',
    marginBottom: hp('0.5%'),
  },
  highlight: {
    color: '#F26122',
  },
  subtitle: {
    fontSize: wp('3.8%'),
    fontFamily: FONTS.gilroy.medium,
    color: '#656565',
  },
});

export default React.memo(HomeFooter);

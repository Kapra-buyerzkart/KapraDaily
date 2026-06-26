import React, { useState } from 'react';
import { View, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const PlacementBannerCarousel = ({
  banners,
  onBannerPress,
  style,
  fullWidth = false,
  showDots = true,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!banners || banners.length === 0) return null;

  const BANNER_WIDTH = fullWidth ? wp('100%') : wp('85%');
  const BANNER_SPACING = fullWidth ? 0 : wp('4%');
  const SNAP_INTERVAL = BANNER_WIDTH + BANNER_SPACING;

  const onScroll = e => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const slideIndex = Math.round(offsetX / SNAP_INTERVAL);
    if (slideIndex !== activeIndex) {
      setActiveIndex(slideIndex);
    }
  };

  if (banners.length === 1) {
    return (
      <View
        style={[
          !fullWidth && styles.carouselShadowWrapper,
          { width: BANNER_WIDTH, alignSelf: 'center' },
          style,
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => onBannerPress(banners[0])}
          style={
            fullWidth ? styles.topHomeBannerViewFull : styles.topHomeBannerView
          }
        >
          <Image
            source={banners[0].uri}
            style={styles.topHomeBannerImage}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[style, !fullWidth && { overflow: 'visible' }]}>
      <FlatList
        data={banners}
        horizontal
        pagingEnabled={fullWidth}
        snapToInterval={fullWidth ? undefined : SNAP_INTERVAL}
        snapToAlignment={fullWidth ? undefined : 'start'}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={
          fullWidth
            ? undefined
            : { paddingHorizontal: wp('4.6%'), paddingVertical: hp('1%') }
        }
        renderItem={({ item }) => (
          <View
            style={[
              !fullWidth && styles.carouselShadowWrapper,
              {
                width: BANNER_WIDTH,
                marginRight: BANNER_SPACING,
                height: '100%',
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onBannerPress(item)}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: fullWidth ? 0 : wp('4%'),
                overflow: 'hidden',
              }}
            >
              <Image
                source={item.uri}
                style={styles.topHomeBannerImage}
                resizeMode="stretch"
              />
            </TouchableOpacity>
          </View>
        )}
      />
      {showDots && (
        <View style={styles.pagination}>
          {banners.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { opacity: i === activeIndex ? 1 : 0.3 },
                i === activeIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  topHomeBannerView: {
    width: '100%',
    height: hp('20%'),
    alignSelf: 'center',
    borderRadius: wp('4%'),
    overflow: 'hidden',
  },
  carouselShadowWrapper: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 4.5,
    elevation: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: wp('4%'),
  },
  topHomeBannerViewFull: {
    width: wp('100%'),
    height: hp('67%'),
  },
  topHomeBannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pagination: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: hp('1.5%'),
  },
  dot: {
    width: wp('2.32%'),
    height: wp('2.32%'),
    backgroundColor: '#F25000',
    borderRadius: 30,
    marginHorizontal: wp('1.17%'),
  },
  activeDot: {
    width: wp('3.25%'),
    height: wp('3.25'),
    borderRadius: 30,
  },
});

export default PlacementBannerCarousel;

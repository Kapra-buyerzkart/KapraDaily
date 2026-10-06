import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS } from '@/styles/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.82;
const SPACING = wp('4%');
const ITEM_SIZE = CARD_WIDTH + SPACING;

const DUMMY_OFFERS = [
  {
    id: '1',
    bgColor: '#3FA9F5',
    title: 'Daily Essentials\ndelivered fast!',
    subtitle: 'Get 10% off on daily needs',
    discountText: '10%\noff',
    dateRange: 'Aug 1 - Aug 15',
    quota: '0 of 100 QR',
  },
  {
    id: '2',
    bgColor: '#E66D00',
    title: 'Freshness\nat your door!',
    subtitle: 'Get 15% off on\nfresh fruits & vegetables',
    discountText: '15%\noff',
    dateRange: 'Aug 4 - Aug 31',
    quota: '0 of 250 QR',
  },
  {
    id: '3',
    bgColor: '#5D2E8E',
    title: 'Mega Savings\non groceries',
    subtitle: 'Get 20% off on all items',
    discountText: '20%\noff',
    dateRange: 'Sep 1 - Sep 30',
    quota: '10 of 500 QR',
  },
];

const DealsAndOffersSection = () => {
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(1);

  const handleScrollEnd = useCallback(event => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / ITEM_SIZE);
    setCurrentIndex(index);
  }, []);

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * ITEM_SIZE,
      index * ITEM_SIZE,
      (index + 1) * ITEM_SIZE,
    ];

    const rotate = scrollX.interpolate({
      inputRange,
      outputRange: ['-45deg', '0deg', '45deg'], // Rotates adjacent cards
      extrapolate: 'clamp',
    });

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.85, 1, 0.85], // Shrink slightly to avoid overlapping corners during extreme tilt
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            backgroundColor: item.bgColor,
            transform: [{ rotate }, { scale }],
          },
        ]}
      >
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>{item.subtitle}</Text>

          {/* Dummy Placeholder for Image */}
          <View style={styles.dummyImagePlaceholder}>
            <Feather
              name="shopping-bag"
              size={wp('20%')}
              color="rgba(255,255,255,0.2)"
            />
          </View>

          {/* Discount Badge */}
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>{item.discountText}</Text>
          </View>

          {/* Bottom Pill */}
          <View style={styles.bottomPill}>
            <View style={styles.dateSection}>
              <Feather name="calendar" size={wp('4%')} color="#FFFFFF" />
              <Text style={styles.dateText}>{item.dateRange}</Text>
            </View>
            <View style={styles.pillDivider} />
            <Text style={styles.quotaText}>{item.quota}</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.superTitle}>SOMETHING SPECIAL</Text>
        <Text style={styles.mainTitle}>Deals & Offers</Text>
        <Text style={styles.subTitle}>
          Fresh deals, exclusive savings & more
        </Text>
      </View>

      {/* Carousel Only - Animated Tilt */}
      <View style={styles.carouselWrapper}>
        <Animated.FlatList
          ref={flatListRef}
          data={DUMMY_OFFERS}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_SIZE}
          decelerationRate="fast"
          contentContainerStyle={styles.flatListContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleScrollEnd}
          renderItem={renderItem}
          initialScrollIndex={1}
          getItemLayout={(data, index) => ({
            length: ITEM_SIZE,
            offset: ITEM_SIZE * index,
            index,
          })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp('2%'),
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    paddingHorizontal: wp('5%'),
    marginBottom: hp('2%'),
  },
  superTitle: {
    color: '#FF6B00',
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3%'),
    letterSpacing: 1.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  mainTitle: {
    color: '#111827',
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('5%'),
    marginBottom: 2,
  },
  subTitle: {
    color: '#6B7280',
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.5%'),
  },
  carouselWrapper: {
    position: 'relative',
  },
  flatListContent: {
    paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
    paddingVertical: hp('5%'), // Add vertical padding to prevent rotated corners from being clipped by FlatList
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: wp('85%'),
    borderRadius: 24,
    marginRight: SPACING,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    padding: wp('6%'),
    position: 'relative',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.heavy,
    fontSize: wp('8%'),
    lineHeight: wp('9%'),
    marginBottom: hp('1.5%'),
    zIndex: 2,
  },
  cardSubtitle: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.2%'),
    lineHeight: wp('5.5%'),
    width: '60%',
    zIndex: 2,
  },
  dummyImagePlaceholder: {
    position: 'absolute',
    bottom: -wp('5%'),
    right: -wp('5%'),
    width: wp('55%'),
    height: wp('55%'),
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: wp('27.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  discountBadge: {
    position: 'absolute',
    right: wp('4%'),
    top: wp('38%'),
    width: wp('22%'),
    height: wp('22%'),
    borderRadius: wp('11%'),
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  discountBadgeText: {
    color: '#111827',
    fontFamily: FONTS.gilroy.heavy,
    fontSize: wp('5.5%'),
    textAlign: 'center',
    lineHeight: wp('6%'),
  },
  bottomPill: {
    position: 'absolute',
    bottom: wp('5%'),
    left: wp('5%'),
    right: wp('5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 16,
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    zIndex: 4,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.5%'),
    marginLeft: wp('2%'),
  },
  pillDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: wp('3%'),
  },
  quotaText: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.5%'),
  },
});

export default React.memo(DealsAndOffersSection);

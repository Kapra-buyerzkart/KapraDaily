import React, { useCallback } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import AnimatedPressable from '@/components/AnimatedPressable';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '@/styles/typography';
import CONFIG from '@/globals/config';
import TokenProductCard from '@/components/TokenProductCard';

const GROCERY_BAG_ILLUSTRATION = require('@/assets/images/bottomtag 2.png');

const RecommendedGridSection = ({
  items = [],
  title,
  navigation,
  stockupBanner,
  onBannerPress,
}) => {
  // Up to 6 items max (design shows 3-column / 2-row max)
  const gridItems = items.slice(0, 6);
  // Responsive: 2 items in a row if 2 or fewer products; 3 items in a row if more than 2 products
  const isTwoItems = gridItems.length <= 2;
  const isThreeColumn = !isTwoItems;
  const spacersNeeded = isTwoItems
    ? (gridItems.length === 1 ? 1 : 0)
    : (gridItems.length % 3 !== 0 ? 3 - (gridItems.length % 3) : 0);

  const stockupSource =
    stockupBanner?.uri ||
    (stockupBanner?.imageUrl
      ? {
          uri: stockupBanner.imageUrl.startsWith('http')
            ? stockupBanner.imageUrl
            : `${CONFIG.image_base_url}${
                stockupBanner.imageUrl.startsWith('/')
                  ? stockupBanner.imageUrl.slice(1)
                  : stockupBanner.imageUrl
              }`,
        }
      : GROCERY_BAG_ILLUSTRATION);

  const handleProductPress = useCallback(
    item => {
      navigation.navigate('ProductDetailsScreen', {
        productId: item.productId || item.id,
        product: item,
      });
    },
    [navigation],
  );

  if (gridItems.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Header Area (White Background) */}
      <View style={styles.headerArea}>
        <Text style={styles.kickerText}>BEFORE YOU GO</Text>
        <Text style={styles.mainTitle}>Stock up your needs</Text>
        <Text style={styles.subTitle}>Your regulars, one tap away</Text>
      </View>

      {/* Dark Green Area */}
      <View style={styles.greenArea}>
        <View style={styles.borderedContainer}>
          {/* Products Grid with TokenProductCard */}
          <View style={styles.grid}>
            {gridItems.map((item, index) => (
              <TokenProductCard
                key={item.productId || item.id || `rec_${index}`}
                item={item}
                index={index}
                isThreeColumn={isThreeColumn}
                containerStyle={
                  isTwoItems ? styles.twoColumnCard : styles.threeColumnCard
                }
                onPress={() => handleProductPress(item)}
              />
            ))}
            {Array.from({ length: spacersNeeded }).map((_, idx) => (
              <View
                key={`spacer-${idx}`}
                style={[
                  isTwoItems ? styles.twoColumnCard : styles.threeColumnCard,
                  styles.cardSpacer,
                ]}
                pointerEvents="none"
              />
            ))}
          </View>

          {/* Bottom Grocery Bag Illustration / Stockup Banner */}
          <AnimatedPressable
            disabled={!stockupBanner || !onBannerPress}
            onPress={() => onBannerPress && onBannerPress(stockupBanner)}
            activeOpacity={0.92}
            style={styles.illustrationWrapper}
          >
            <Image
              source={stockupSource}
              style={styles.illustration}
              resizeMode="contain"
            />
          </AnimatedPressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  headerArea: {
    paddingHorizontal: wp('4%'),
    paddingTop: hp('2.5%'),
    paddingBottom: hp('1.5%'),
  },
  kickerText: {
    fontSize: wp('3.2%'),
    fontFamily: FONTS.gilroy.bold,
    color: '#EA580C',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: wp('5%'),
    fontFamily: FONTS.gilroy.semiBold,
    color: '#111827',
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: wp('3.6%'),
    fontFamily: FONTS.gilroy.medium,
    color: '#6B7280',
    marginTop: 4,
  },
  greenArea: {
    backgroundColor: '#114B3B', // Dark green matching design
    paddingHorizontal: wp('3%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('3%'),
  },
  borderedContainer: {
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 10,
    padding: wp('2.5%'),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  twoColumnCard: {
    width: '48.5%', // 2 equal columns when 2 or fewer products
    marginHorizontal: 0,
    marginVertical: hp('0.6%'),
  },
  threeColumnCard: {
    width: '31.8%', // 3 columns when more than 2 products
    marginHorizontal: 0,
    marginVertical: hp('0.5%'),
  },
  cardSpacer: {
    height: 0,
    padding: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginVertical: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    opacity: 0,
  },
  illustrationWrapper: {
    width: '100%',
    height: hp('28%'),
    marginTop: hp('1%'),
    borderRadius: 12,
    overflow: 'hidden',
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
});

export default React.memo(RecommendedGridSection);

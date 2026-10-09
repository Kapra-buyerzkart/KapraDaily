import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import AnimatedPressable from '@/components/AnimatedPressable';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS } from '@/styles/typography';
import CONFIG from '@/globals/config';

const glossyCardImg = require('@/assets/images/Glossy Blank Promotional Card with Burst Badge 2.png');

const FlashDealsSection = ({ items = [], title = '50% OFF', navigation }) => {
  // Use 6 items for a 3x2 grid
  const gridItems = items.slice(0, 6);

  const targetDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    d.setHours(10, 3, 0, 0); // ~3days 10hrs 3mins equivalent setup
    return d.getTime();
  }, []);

  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft('Offer ended');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `Offer ends in ${days}days ${hours}hrs ${minutes}mins ${seconds}secs`,
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

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
      {/* Header */}
      <View style={styles.headerRow}>
        <Image
          source={require('@/assets/icons/flash.png')}
          style={{ width: wp('10x%'), height: wp('10x%') }}
          resizeMode="contain"
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.subTitleText}>Flash loot sale</Text>
          <Text style={styles.titleText}>{title}</Text>
        </View>
      </View>
      <View style={styles.divider} />

      {/* Grid */}
      <View style={styles.grid}>
        {gridItems.map((item, index) => {
          const sellingPrice =
            item.sellingPrice ||
            item.price ||
            item.specialPrice ||
            item.discountedPrice ||
            '99';
          const mrp = item.mrp || item.unitPrice || item.originalPrice || '110';
          let rawImageUri =
            item.featuredImage ||
            item.productImage ||
            item.image ||
            item.img ||
            item.imageUrl ||
            item.thumbnail ||
            '';
          let imageUri = '';
          if (rawImageUri) {
            imageUri = rawImageUri.startsWith('http')
              ? rawImageUri
              : `${CONFIG.image_base_url}${rawImageUri}`;
          }

          const productName =
            item.prName || item.name || item.Name || 'Product Title';
          const productSubtitle =
            item.subtitle ||
            item.subTitle ||
            item.description ||
            item.categoryName ||
            item.catName ||
            item.weight ||
            ' ';

          return (
            <AnimatedPressable
              key={item.productId || item.id || index}
              onPress={() => handleProductPress(item)}
              style={styles.cardWrapper}
            >
              <ImageBackground
                source={glossyCardImg}
                style={styles.cardContainer}
                imageStyle={{ resizeMode: 'stretch' }}
              >
                <View style={styles.cardInner}>
                  {imageUri ? (
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.productImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <View style={styles.productImagePlaceholder} />
                  )}

                  {/* MRP Box */}
                  <View style={styles.mrpBox}>
                    <Text style={styles.mrpText}>₹ {mrp}/-</Text>
                  </View>
                </View>

                {/* Starburst Price Text */}
                <View style={styles.starburstWrapper}>
                  <Text style={styles.starburstText}>₹ {sellingPrice}</Text>
                </View>
              </ImageBackground>

              <Text numberOfLines={2} style={styles.productTitle}>
                {productName}
              </Text>
              <Text numberOfLines={1} style={styles.productSubtitle}>
                {productSubtitle}
              </Text>
            </AnimatedPressable>
          );
        })}
      </View>

      {/* Footer Timer */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: wp('3.5%'),
    marginVertical: hp('1.5%'),
    marginBottom: hp('8%'), // Avoid sticky basket covering it
    backgroundColor: '#0050CD',
    borderRadius: 24,
    paddingTop: hp('2.5%'),
    paddingHorizontal: wp('3%'),
    paddingBottom: hp('2.5%'),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('1%'),
  },
  headerTextContainer: {
    marginLeft: wp('2%'),
  },
  subTitleText: {
    fontSize: wp('3.8%'),
    fontFamily: FONTS.gilroy.bold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  titleText: {
    fontSize: wp('7.5%'),
    fontFamily: FONTS.gilroy.heavy,
    color: '#FFD700',
    lineHeight: wp('8%'),
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: hp('2%'),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: hp('2%'),
  },
  cardWrapper: {
    width: '31%',
    marginBottom: hp('5%'),
  },
  productTitle: {
    color: '#FFFFFF',
    fontSize: wp('2.8%'),
    fontFamily: FONTS.gilroy.bold,
    marginTop: hp('1.5%'),
    marginBottom: 2,
    textAlign: 'center',
  },
  productSubtitle: {
    color: '#E0E0E0',
    fontSize: wp('2.4%'),
    fontFamily: FONTS.gilroy.medium,
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  cardContainer: {
    height: hp('16%'),
    width: '100%',
    position: 'relative',
    justifyContent: 'flex-start',
  },
  cardInner: {
    flex: 1,
    padding: wp('1%'),
    alignItems: 'center',
  },
  productImage: {
    width: '60%',
    height: '60%',
    marginTop: hp('1%'),
  },
  productImagePlaceholder: {
    width: '100%',
    height: '60%',
    backgroundColor: '#F0F0F0',
    marginBottom: 4,
    borderRadius: 8,
  },
  mrpBox: {
    backgroundColor: '#FFD700',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.3%'),
    borderRadius: 4,
    marginTop: 'auto',
    position: 'absolute',
    bottom: 5,
    marginBottom: hp('5%'),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mrpText: {
    color: '#0050CD',
    fontSize: wp('2.6%'),
    fontFamily: FONTS.gilroy.bold,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  starburstWrapper: {
    position: 'absolute',
    bottom: hp('-.2%'),
    alignSelf: 'center',
    zIndex: 10,
    width: wp('14%'),
    height: wp('14%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  starburstText: {
    color: '#0050CD',
    fontFamily: FONTS.gilroy.heavy,
    fontSize: wp('3.5%'),
    textAlign: 'center',
    zIndex: 2,
  },
  timerPill: {
    backgroundColor: '#FFD700',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.2%'),
    marginTop: hp('1%'),
  },
  timerText: {
    color: '#0050CD',
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.5%'),
    marginLeft: wp('2%'),
  },
});

export default React.memo(FlashDealsSection);

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import AnimatedPressable from '@/components/AnimatedPressable';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS } from '@/styles/typography';
import CachedImage from '@/components/CachedImage';
import CONFIG from '@/globals/config';
import getCategoryPlaceholder from '../getCategoryPlaceholder';

const TopOffersSection = ({ categories = [], sideBySide = [], navigation }) => {
  const handleCardPress = useCallback(
    item => {
      const linkValue = item.linkValue || item.catId || item.id || item.label;
      navigation.navigate('SearchScreen', {
        catId: item.catId || item.id,
        catName: item.catName || item.label || 'Deals',
        linkValue,
        link: linkValue,
      });
    },
    [navigation],
  );

  const offers = React.useMemo(() => {
    if (!Array.isArray(categories) || categories.length === 0) return [];
    return categories.slice(0, 3).map(cat => {
      let imageSource;
      if (cat.image) {
        imageSource = cat.image;
      } else if (cat.imageUrl) {
        imageSource = { uri: `${CONFIG.image_base_url}${cat.imageUrl}` };
      } else {
        imageSource = getCategoryPlaceholder(cat.catName || cat.name || '');
      }

      const discount = cat.discountText || cat.discount || cat.badge || null;
      const label = cat.catName || cat.name || '';

      return {
        discount,
        label,
        catId: cat.catId || cat.id,
        catName: label,
        linkValue: cat.linkValue || cat.catId || cat.id || label,
        imageSource,
      };
    });
  }, [categories]);

  if (offers.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Top offers for you</Text>
        <Feather name="chevron-right" size={20} color="#111827" />
      </View>

      {/* 3 Offer Tiles */}
      <View style={styles.cardsRow}>
        {offers.map((offer, index) => (
          <AnimatedPressable
            key={index}
            onPress={() => handleCardPress(offer)}
            style={styles.offerCard}
          >
            {/* Discount Badge (only if provided by backend data) */}
            {offer.discount ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{offer.discount}</Text>
              </View>
            ) : null}

            {/* Product/Category Image */}
            <View style={styles.imageWrap}>
              <CachedImage
                source={offer.imageSource}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            {/* Label */}
            <Text style={styles.label} numberOfLines={1}>
              {offer.label}
            </Text>
          </AnimatedPressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp('1.6%'),
    paddingHorizontal: wp('4%'),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: hp('2.2%'),
  },
  title: {
    fontSize: wp('4.4%'),
    fontFamily: FONTS.gilroy.bold,
    color: '#111827',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  offerCard: {
    width: wp('28.5%'),
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8ECF2',
    padding: 8,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF5500',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: wp('2.8%'),
    fontFamily: FONTS.gilroy.bold,
    color: '#FFFFFF',
  },
  imageWrap: {
    width: wp('20%'),
    height: wp('20%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  label: {
    fontSize: wp('3.2%'),
    fontFamily: FONTS.gilroy.semiBold,
    color: '#374151',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default React.memo(TopOffersSection);

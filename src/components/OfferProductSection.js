import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import FlatOfferBadge from './FlatOfferBadge';
import TokenProductCard from './TokenProductCard';
import SeeAllButton from './SeeAllButton';

const OfferProductSection = ({
  title,
  titleStyle,
  products = [],
  showOfferBadge = true,
  discount = 50,
  badgeProps,
  onProductPress,
  onAdd,
  onToggleWishlist,
  isInWishlist,
  cardProps,
  cardContainerStyle,
  onSeeAll,
  seeAllLabel,
  seeAllStyle,
  showSeeAllThreshold = 3,
  style,
  contentContainerStyle,
}) => {
  const showSeeAll = onSeeAll && products.length > showSeeAllThreshold;

  return (
    <View style={[styles.container, style]}>
      {showOfferBadge && <FlatOfferBadge discount={discount} {...badgeProps} />}

      {!!title && <Text style={[styles.title, titleStyle]}>{title}</Text>}

      <FlatList
        horizontal
        data={products}
        keyExtractor={(item, index) =>
          (item.productId || item.id || index).toString()
        }
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, contentContainerStyle]}
        renderItem={({ item }) => (
          <TokenProductCard
            item={item}
            onPress={() => onProductPress && onProductPress(item)}
            onAdd={onAdd}
            onToggleWishlist={onToggleWishlist}
            isInWishlist={isInWishlist}
            containerStyle={cardContainerStyle}
            {...cardProps}
          />
        )}
      />

      {showSeeAll && (
        <SeeAllButton
          onPress={onSeeAll}
          label={seeAllLabel}
          style={[styles.seeAllButton, seeAllStyle]}
        />
      )}
    </View>
  );
};

export default React.memo(OfferProductSection);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF8EC',
    borderRadius: wp('4%'),
    paddingBottom: hp('1.5%'),
    overflow: 'hidden',
  },
  title: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4%'),
    color: '#1F1F1F',
    marginLeft: wp('3%'),
    marginTop: hp('0.5%'),
  },
  listContent: {
    paddingLeft: wp('2%'),
    paddingRight: wp('1%'),
    paddingTop: hp('1%'),
  },
  seeAllButton: {
    alignSelf: 'center',
    marginTop: hp('0.5%'),
  },
});

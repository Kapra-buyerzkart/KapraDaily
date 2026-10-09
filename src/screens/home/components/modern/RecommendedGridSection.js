import React, { useCallback } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import AnimatedPressable from '@/components/AnimatedPressable';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONTS } from '@/styles/typography';
import CONFIG from '@/globals/config';
import { useCart } from '@/context/CartContext';

const GROCERY_BAG_ILLUSTRATION = require('@/assets/images/bottomtag 2.png');

const RecommendedGridSection = ({ items = [], title, navigation }) => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  
  // The design specifically shows a 3-column, 2-row grid (6 items max)
  const gridItems = items.slice(0, 6);
  const isTwoItems = gridItems.length === 2;
  const spacersNeeded =
    !isTwoItems && gridItems.length % 3 !== 0
      ? 3 - (gridItems.length % 3)
      : 0;

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
          {/* Products Grid */}
          <View style={styles.grid}>
            {gridItems.map((item, index) => {
              // Extract pricing with fallbacks
              const finalPrice =
                item.sellingPrice ||
                item.price ||
                item.specialPrice ||
                item.discountedPrice ||
                100;
              const mrp =
                item.mrp || item.unitPrice || item.originalPrice || finalPrice;
              const discount =
                mrp > finalPrice
                  ? Math.round(((mrp - finalPrice) / mrp) * 100)
                  : 0;

              let rawImageUri =
                item.featuredImage ||
                item.productImage ||
                item.image ||
                item.img ||
                item.imageUrl ||
                item.thumbnail ||
                '';
              let imageUrl = 'https://via.placeholder.com/150';
              if (rawImageUri) {
                imageUrl = rawImageUri.startsWith('http')
                  ? rawImageUri
                  : `${CONFIG.image_base_url}${rawImageUri}`;
              }

              const productName =
                item.prName || item.name || item.Name || 'Product Name';
              const productDesc =
                item.subtitle ||
                item.subTitle ||
                item.description ||
                item.weight ||
                'officia deserunt';
              const tokens = item.bCoins || item.tokens || 10.6;
              
              const cartItem = cartItems?.find(ci => ci.productId === (item.productId || item.id));
              const qty = cartItem ? cartItem.quantity : 0;

              return (
                <AnimatedPressable
                  key={item.productId || item.id || index}
                  style={[styles.card, isTwoItems && styles.cardTwoColumn]}
                  onPress={() => handleProductPress(item)}
                >
                  {/* Top Badges */}
                  <View style={styles.cardHeader}>
                    <View
                      style={[
                        styles.tokenBadge,
                        isTwoItems && styles.tokenBadgeTwoColumn,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="bitcoin"
                        size={isTwoItems ? wp('3%') : wp('2.5%')}
                        color="#EAB308"
                      />
                      <Text
                        style={[
                          styles.tokenText,
                          isTwoItems && styles.tokenTextTwoColumn,
                        ]}
                      >
                        {tokens} tokens
                      </Text>
                    </View>
                    <AntDesign
                      name="hearto"
                      size={isTwoItems ? wp('4%') : wp('3.5%')}
                      color="#6B7280"
                    />
                  </View>

                  {/* Product Image */}
                  <Image
                    source={{ uri: imageUrl }}
                    style={[
                      styles.productImage,
                      isTwoItems && styles.productImageTwoColumn,
                    ]}
                    resizeMode="contain"
                  />

                  {/* Texts */}
                  <Text
                    style={[
                      styles.productName,
                      isTwoItems && styles.productNameTwoColumn,
                    ]}
                    numberOfLines={1}
                  >
                    {productName}
                  </Text>
                  <Text
                    style={[
                      styles.productDesc,
                      isTwoItems && styles.productDescTwoColumn,
                    ]}
                    numberOfLines={1}
                  >
                    {productDesc}
                  </Text>

                  {/* Divider */}
                  <View style={styles.dashedDivider} />

                  {/* Prices */}
                  <View style={styles.priceRow}>
                    <Text
                      style={[
                        styles.mrpText,
                        isTwoItems && styles.mrpTextTwoColumn,
                      ]}
                    >
                      ₹ {mrp}/-
                    </Text>
                    {discount > 0 && (
                      <View style={styles.discountBadge}>
                        <Text
                          style={[
                            styles.discountText,
                            isTwoItems && styles.discountTextTwoColumn,
                          ]}
                        >
                          {discount}% OFF
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.finalPriceRow}>
                    <Text
                      style={[
                        styles.finalPrice,
                        isTwoItems && styles.finalPriceTwoColumn,
                      ]}
                    >
                      ₹{finalPrice}/-
                    </Text>
                    {qty > 0 ? (
                      <View
                        style={[
                          styles.stepperContainer,
                          isTwoItems && styles.stepperContainerTwoColumn,
                        ]}
                      >
                        <AnimatedPressable
                          style={styles.stepperBtn}
                          onPress={() => removeFromCart(item)}
                        >
                          <Feather
                            name="minus"
                            size={isTwoItems ? 15 : 14}
                            color="#000000"
                          />
                        </AnimatedPressable>
                        <Text
                          style={[
                            styles.stepperText,
                            isTwoItems && styles.stepperTextTwoColumn,
                          ]}
                        >
                          {qty}
                        </Text>
                        <AnimatedPressable
                          style={styles.stepperBtn}
                          onPress={() => addToCart(item)}
                        >
                          <Feather
                            name="plus"
                            size={isTwoItems ? 15 : 14}
                            color="#000000"
                          />
                        </AnimatedPressable>
                      </View>
                    ) : (
                      <AnimatedPressable
                        style={[
                          styles.addButton,
                          isTwoItems && styles.addButtonTwoColumn,
                        ]}
                        onPress={() => addToCart(item)}
                      >
                        <Feather
                          name="plus"
                          size={isTwoItems ? wp('4.5%') : wp('4%')}
                          color="#000000"
                        />
                      </AnimatedPressable>
                    )}
                  </View>
                </AnimatedPressable>
              );
            })}
            {Array.from({ length: spacersNeeded }).map((_, idx) => (
              <View
                key={`spacer-${idx}`}
                style={[styles.card, styles.cardSpacer]}
                pointerEvents="none"
              />
            ))}
          </View>

          {/* Bottom Grocery Bag Illustration */}
          <View style={styles.illustrationWrapper}>
            <Image
              source={GROCERY_BAG_ILLUSTRATION}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>
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
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: 16,
    padding: wp('2.5%'),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '32%', // Fits 3 in a row
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: wp('1.8%'),
    marginBottom: hp('1.2%'),
  },
  cardTwoColumn: {
    width: '48.5%', // 2 equal columns when only 2 items
    padding: wp('2.4%'),
  },
  cardSpacer: {
    height: 0,
    padding: 0,
    marginBottom: 0,
    opacity: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('0.5%'),
  },
  tokenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tokenBadgeTwoColumn: {
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  tokenText: {
    fontSize: wp('1.9%'),
    fontFamily: FONTS.gilroy.bold,
    color: '#B45309',
    marginLeft: 2,
  },
  tokenTextTwoColumn: {
    fontSize: wp('2.2%'),
  },
  productImage: {
    width: '100%',
    height: hp('7.5%'),
    alignSelf: 'center',
    marginBottom: hp('0.5%'),
  },
  productImageTwoColumn: {
    height: hp('9.5%'),
    marginBottom: hp('0.8%'),
  },
  productName: {
    fontSize: wp('2.7%'),
    fontFamily: FONTS.gilroy.bold,
    color: '#111827',
  },
  productNameTwoColumn: {
    fontSize: wp('3.1%'),
  },
  productDesc: {
    fontSize: wp('2.2%'),
    fontFamily: FONTS.gilroy.medium,
    color: '#9CA3AF',
    marginBottom: hp('0.5%'),
  },
  productDescTwoColumn: {
    fontSize: wp('2.5%'),
    marginBottom: hp('0.6%'),
  },
  dashedDivider: {
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 1,
    marginVertical: hp('0.6%'),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  mrpText: {
    fontSize: wp('2.2%'),
    fontFamily: FONTS.gilroy.medium,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  mrpTextTwoColumn: {
    fontSize: wp('2.5%'),
  },
  discountBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: wp('2%'),
    fontFamily: FONTS.gilroy.bold,
    color: '#16A34A',
  },
  discountTextTwoColumn: {
    fontSize: wp('2.2%'),
  },
  finalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  finalPrice: {
    fontSize: wp('3.5%'),
    fontFamily: FONTS.gilroy.bold,
    color: '#991B1B', // Dark red
  },
  finalPriceTwoColumn: {
    fontSize: wp('3.8%'),
  },
  addButton: {
    width: wp('6%'),
    height: wp('6%'),
    backgroundColor: '#FACC15',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonTwoColumn: {
    width: wp('7%'),
    height: wp('7%'),
    borderRadius: 7,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FACC15',
    borderRadius: 6,
    height: wp('6%'),
    paddingHorizontal: 4,
    justifyContent: 'space-between',
    width: wp('14%'),
  },
  stepperContainerTwoColumn: {
    height: wp('7%'),
    width: wp('16%'),
    borderRadius: 7,
  },
  stepperBtn: {
    paddingHorizontal: 2,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperText: {
    fontSize: wp('3%'),
    fontFamily: FONTS.gilroy.bold,
    color: '#000000',
  },
  stepperTextTwoColumn: {
    fontSize: wp('3.2%'),
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

export default RecommendedGridSection;

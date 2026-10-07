import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AnimatedPressable from '@/components/AnimatedPressable';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS } from '@/styles/typography';

const OREO_IMAGE = require('@/assets/images/oreo_biscuit.png');
const GOOD_DAY_IMAGE = require('@/assets/images/good_day_biscuits.png');
const BOURBON_IMAGE = require('@/assets/images/bourbon_biscuit.png');

const HeroOffersSection = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Background Gradient matching Figma */}
      <LinearGradient
        colors={[
          '#FF5200',
          '#FF6000',
          '#FF771A',
          '#FF944D',
          '#FFBE8F',
          '#FFE8D6',
          '#FFFFFF',
        ]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradientBg}
      />

      {/* Product Cards Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsScrollContent}
      >
        {/* Card 1: Oreo Biscuit */}
        <AnimatedPressable
          style={styles.productCard}
          onPress={() => {}}
        >
          <View style={styles.imageWrap}>
            <Image
              source={OREO_IMAGE}
              style={[styles.productImage, styles.oreoTilt]}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.productTitle} numberOfLines={1}>
            Oreo Biscuit 500mg
          </Text>
          <Text style={styles.productSubtitle} numberOfLines={1}>
            officia deserunt
          </Text>
          <View style={styles.dashedDivider} />
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.originalPrice}>₹150</Text>
              <Text style={styles.currentPrice}>₹100</Text>
            </View>
            <AnimatedPressable
              style={styles.addButton}
              onPress={() => {}}
            >
              <Feather name="plus" size={18} color="#111827" />
            </AnimatedPressable>
          </View>
        </AnimatedPressable>

        {/* Card 2: Limited Time Offer (Good Day) */}
        <AnimatedPressable
          style={[styles.productCard, styles.specialOfferCard]}
          onPress={() => {}}
        >
          {/* Top Tag Header */}
          <View style={styles.offerTagContainer}>
            <View style={styles.dashedHeaderLine} />
            <Text style={styles.offerTagText}>Limited time offer</Text>
          </View>

          <View style={styles.imageWrapSpecial}>
            <Image
              source={GOOD_DAY_IMAGE}
              style={styles.goodDayImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.specialCardBottom}>
            <AnimatedPressable
              style={[styles.addButton, styles.specialAddButton]}
              onPress={() => {}}
            >
              <Feather name="plus" size={18} color="#111827" />
            </AnimatedPressable>
          </View>
        </AnimatedPressable>

        {/* Card 3: Bourbon Biscuit */}
        <AnimatedPressable
          style={styles.productCard}
          onPress={() => {}}
        >
          <View style={styles.imageWrap}>
            <Image
              source={BOURBON_IMAGE}
              style={[styles.productImage, styles.bourbonTilt]}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.productTitle} numberOfLines={1}>
            Bourbon choco..
          </Text>
          <Text style={styles.productSubtitle} numberOfLines={1}>
            officia deserunt
          </Text>
          <View style={styles.dashedDivider} />
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.originalPrice}>₹150</Text>
              <Text style={styles.currentPrice}>₹100</Text>
            </View>
            <AnimatedPressable
              style={styles.addButton}
              onPress={() => {}}
            >
              <Feather name="plus" size={18} color="#111827" />
            </AnimatedPressable>
          </View>
        </AnimatedPressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingTop: hp('1%'),
    paddingBottom: hp('2%'),
    overflow: 'hidden',
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
  },
  cardsScrollContent: {
    paddingHorizontal: wp('4%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('1.5%'),
    zIndex: 2,
    alignItems: 'flex-end',
  },
  productCard: {
    width: wp('35%'),
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: wp('3%'),
    marginRight: wp('3.5%'),
    shadowColor: '#E65100',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  specialOfferCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  offerTagContainer: {
    alignItems: 'center',
    marginBottom: hp('0.5%'),
  },
  dashedHeaderLine: {
    width: '100%',
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderStyle: 'dashed',
    marginBottom: hp('0.8%'),
  },
  offerTagText: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.1%'),
    textAlign: 'center',
  },
  imageWrap: {
    height: wp('22%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('0.8%'),
  },
  imageWrapSpecial: {
    height: wp('24%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp('0.5%'),
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  goodDayImage: {
    width: '95%',
    height: '95%',
  },
  oreoTilt: {
    transform: [{ rotate: '-14deg' }, { scale: 1.05 }],
  },
  bourbonTilt: {
    transform: [{ rotate: '8deg' }, { scale: 1.05 }],
  },
  productTitle: {
    color: '#111827',
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.3%'),
    marginBottom: 2,
  },
  productSubtitle: {
    color: '#6B7280',
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.7%'),
    marginBottom: hp('0.8%'),
  },
  dashedDivider: {
    width: '100%',
    borderWidth: 0.6,
    borderColor: '#F3A66B',
    borderStyle: 'dashed',
    marginBottom: hp('0.8%'),
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  originalPrice: {
    color: '#D97706',
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3%'),
    textDecorationLine: 'line-through',
    marginBottom: -2,
  },
  currentPrice: {
    color: '#111827',
    fontFamily: FONTS.gilroy.heavy,
    fontSize: wp('5.2%'),
  },
  specialCardBottom: {
    alignItems: 'flex-end',
    marginTop: hp('1%'),
  },
  addButton: {
    width: wp('8%'),
    height: wp('8%'),
    backgroundColor: '#FFD700',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  specialAddButton: {
    alignSelf: 'flex-end',
  },
});

export default React.memo(HeroOffersSection);

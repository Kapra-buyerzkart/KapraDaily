import React from 'react';
import { View, Text, Image, ImageBackground, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';

const BillRow = ({ label, value, isGreen, isSaving }) => (
  <View style={styles.billContentContainer}>
    <Text style={styles.billContentText}>{label}</Text>
    <Text style={[styles.priceText, isGreen && { color: '#0CA201' }]}>
      {isSaving ? '' : ''}
      {value}
    </Text>
  </View>
);

const BillSection = ({ billCalculations }) => {
  const {
    mrpTotal = 0,
    itemTotal = 0,
    savings = 0,
    deliveryCharge = 0,
    totalTax = 0,
    couponDiscount = 0,
    giftCardAmount = 0,
    bcoinsAppliedValue = 0,
    totalSavings = 0,
    toPay = 0,
  } = billCalculations;

  return (
    <ImageBackground
      style={styles.billImageBackground}
      imageStyle={styles.billImageStyle}
      source={require('../assets/images/bill_background.png')}
    >
      <View style={styles.billHeaderContainer}>
        <Image
          style={styles.billIcon}
          source={require('../assets/images/bill_icon.png')}
        />
        <Text style={styles.billHeaderText}>View Your Bill</Text>
      </View>
      <View>
        {/* Item Total */}
        <BillRow label="Item Total" value={`₹${itemTotal.toFixed(2)}`} />

        {/* Discount */}
        {savings > 0 && (
          <BillRow
            label="Discount"
            value={`- ₹${savings.toFixed(2)}`}
            isGreen
          />
        )}

        {/* Delivery */}
        <BillRow
          label="Delivery Charge"
          value={
            deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}`
          }
          isGreen={deliveryCharge === 0}
        />

        {/* Tax */}
        {/* {totalTax > 0 && (
                    <BillRow label="Tax" value={`₹${totalTax.toFixed(2)}`} />
                )} */}

        {/* Coupon */}
        {couponDiscount > 0 && (
          <BillRow
            label="Coupon Discount"
            value={`- ₹${couponDiscount.toFixed(2)}`}
            isGreen
          />
        )}

        {/* Gift Card */}
        {giftCardAmount > 0 && (
          <BillRow
            label="GiftCard Applied"
            value={`- ₹${giftCardAmount.toFixed(2)}`}
            isGreen
          />
        )}

        {/* UD-coins */}
        {bcoinsAppliedValue > 0 && (
          <BillRow
            label="Bcoins Applied"
            value={`- ₹${bcoinsAppliedValue.toFixed(2)}`}
            isGreen
          />
        )}

        <View style={styles.billDivider} />
        <View style={styles.billSumView}>
          <Text style={styles.billSumText}>To Pay</Text>
          <Text style={styles.billSumText}>₹{toPay.toFixed(2)}</Text>
        </View>
        {totalTax > 0 && (
          <Text
            style={[
              styles.billSumText,
              { fontSize: wp('3%'), paddingTop: wp('1%') },
            ]}
          >
            Inclusive of GST ₹{totalTax.toFixed(2)}{' '}
          </Text>
        )}
        {/* Savings */}
        {totalSavings > 0 && (
          <View style={{ marginTop: hp('1%') }}>
            <Text
              style={[
                styles.billContentText,
                { color: '#0CA201', fontFamily: FONTS.outfit.medium },
              ]}
            >
              You saved : ₹{totalSavings.toFixed(2)}
            </Text>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

export default React.memo(BillSection);

const styles = StyleSheet.create({
  billImageBackground: {
    width: wp('100%'),
    alignSelf: 'center',
    marginTop: hp('0.5%'),
    paddingTop: hp('4%'),
    paddingBottom: hp('4%'),
    paddingHorizontal: wp('10%'),
    marginBottom: hp('0.5%'),
  },
  billImageStyle: {
    resizeMode: 'stretch', // Ensure the background stretches to fit content height
  },
  billHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'), // More space below header
    marginTop: wp('2%'),
    marginLeft: wp('1%'), // Slight nudge for better alignment
  },
  billIcon: {
    width: wp('5%'),
    height: wp('5%'),
    resizeMode: 'contain',
  },
  billHeaderText: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: wp('4%'),
    color: '#000000',
    marginLeft: wp('2%'),
  },
  billContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  billContentText: {
    fontFamily: FONTS.outfit.regular,
    fontSize: wp('3.5%'),
    color: '#777777',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mrpText: {
    fontFamily: FONTS.outfit.regular,
    fontSize: wp('3%'),
    color: '#777777',
    textDecorationLine: 'line-through',
    marginRight: wp('2%'),
  },
  priceText: {
    fontFamily: FONTS.outfit.medium,
    fontSize: wp('3.5%'),
    color: '#000000',
  },
  billDivider: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E8E8E8',
    marginTop: hp('2%'),
  },
  billSumView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
  },
  billSumText: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: wp('4%'),
    color: '#000000',
  },
});

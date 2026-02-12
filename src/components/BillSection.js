import React from 'react';
import { View, Text, Image, ImageBackground, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';

const BillRow = ({ label, value, isGreen, isSaving }) => (
    <View style={styles.billContentContainer}>
        <Text style={styles.billContentText}>{label}</Text>
        <Text style={[styles.priceText, isGreen && { color: '#0CA201' }]}>
            {isSaving ? '' : ''}{value}
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
        <ImageBackground style={styles.billImageBackground} source={require('../assets/images/bill_background.png')}>
            <View style={styles.billHeaderContainer}>
                <Image style={styles.billIcon} source={require('../assets/images/bill_icon.png')} />
                <Text style={styles.billHeaderText}>View Your Bill</Text>
            </View>
            <View>
                {/* Item Total */}
                <View style={styles.billContentContainer}>
                    <Text style={styles.billContentText}>Item total</Text>
                    <View style={styles.priceContainer}>
                        {savings > 0 && (
                            <Text style={styles.mrpText}>₹{mrpTotal.toFixed(2)}</Text>
                        )}
                        <Text style={styles.priceText}>₹{itemTotal.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Delivery */}
                <BillRow
                    label="Delivery charge"
                    value={deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}`}
                />

                {/* Tax */}
                {totalTax > 0 && (
                    <BillRow label="Total Tax" value={`₹${totalTax.toFixed(2)}`} />
                )}

                {/* Coupon */}
                {couponDiscount > 0 && (
                    <BillRow label="Coupon Discount" value={`- ₹${couponDiscount.toFixed(2)}`} />
                )}

                {/* Gift Card */}
                {giftCardAmount > 0 && (
                    <BillRow label="Gift Card" value={`- ₹${giftCardAmount.toFixed(2)}`} />
                )}

                {/* B-Coins */}
                {bcoinsAppliedValue > 0 && (
                    <BillRow label="B-Coins Applied" value={`- ₹${bcoinsAppliedValue.toFixed(2)}`} />
                )}

                {/* Savings */}
                {totalSavings > 0 && (
                    <BillRow label="You have saved" value={`₹${totalSavings.toFixed(2)}`} isGreen />
                )}

                <View style={styles.billDivider} />
                <View style={styles.billSumView}>
                    <Text style={styles.billSumText}>To Pay</Text>
                    <Text style={styles.billSumText}>₹{toPay.toFixed(2)}</Text>
                </View>
            </View>
        </ImageBackground>
    );
};

export default React.memo(BillSection);

const styles = StyleSheet.create({
    billImageBackground: {
        width: wp('90.7%'),
        alignSelf: 'center',
        marginTop: hp('2%'),
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('4%'),
        marginBottom: hp('12%')
    },
    billHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('1%')
    },
    billIcon: {
        width: wp('5%'),
        height: wp('5%'),
        resizeMode: 'contain'
    },
    billHeaderText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%'),
        color: '#000000',
        marginLeft: wp('2%')
    },
    billContentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp('1%')
    },
    billContentText: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3.5%'),
        color: '#777777'
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    mrpText: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3%'),
        color: '#777777',
        textDecorationLine: 'line-through',
        marginRight: wp('2%')
    },
    priceText: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('3.5%'),
        color: '#000000'
    },
    billDivider: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#E8E8E8',
        marginTop: hp('2%')
    },
    billSumView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('2%')
    },
    billSumText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%'),
        color: '#000000'
    },
});

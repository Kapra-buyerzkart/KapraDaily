import React from 'react';
import { View, Text, Image, ImageBackground } from 'react-native';
import { colors } from '../../assets/theme/colours';
import { Fonts } from '../../assets/theme/fonts';
import { billSectionStyles as styles } from './styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface BillCalculations {
    mrpTotal?: number;
    itemTotal?: number;
    savings?: number;
    deliveryCharge?: number;
    totalTax?: number;
    couponDiscount?: number;
    giftCardAmount?: number;
    bcoinsAppliedValue?: number;
    totalSavings?: number;
    toPay?: number;
}

interface BillRowProps {
    label: string;
    value: string;
    isGreen?: boolean;
    strikethroughValue?: string;
}

const BillRow: React.FC<BillRowProps> = ({ label, value, isGreen, strikethroughValue }) => (
    <View style={styles.billContentContainer}>
        <Text style={[styles.billContentText, isGreen && { color: colors.green }]}>{label}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {strikethroughValue && (
                <Text style={styles.strikethroughText}>{strikethroughValue}</Text>
            )}
            <Text style={[styles.priceText, isGreen && { color: colors.green }]}>
                {value}
            </Text>
        </View>
    </View>
);

interface BillSectionProps {
    billCalculations: BillCalculations;
}

const BillSection: React.FC<BillSectionProps> = ({ billCalculations }) => {
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

    const absSavings = Math.abs(savings);
    const absCouponDiscount = Math.abs(couponDiscount);
    const absGiftCardAmount = Math.abs(giftCardAmount);
    const absBcoinsAppliedValue = Math.abs(bcoinsAppliedValue);

    return (
        <View style={styles.container}>
            <View style={styles.billHeaderContainer}>
                <MaterialCommunityIcons
                    name="receipt"
                    size={20}
                    color="#000"
                />
                <Text style={styles.billHeaderText}>View Your Bill</Text>
            </View>

            <ImageBackground
                style={styles.billImageBackground}
                imageStyle={styles.billImageStyle}
                source={require('../../assets/images/bill_background.png')}>
                <View>
                    {/* Item Total (MRP) */}
                    <BillRow 
                        label="Item total" 
                        value={`₹${itemTotal.toFixed(2)}`} 
                        strikethroughValue={`₹${(mrpTotal || (itemTotal + savings)).toFixed(2)}`}
                    />

                    {/* Delivery */}
                    <BillRow
                        label="Delivery charge"
                        value={deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}`}
                    />

                    {/* Tax */}
                    {totalTax > 0 && (
                        <BillRow label="Tax" value={`₹${totalTax.toFixed(2)}`} />
                    )}

                    {/* Coupon */}
                    {absCouponDiscount > 0 && (
                        <BillRow label="Coupon Discount" value={`- ₹${absCouponDiscount.toFixed(2)}`} />
                    )}

                    {/* Gift Card */}
                    {absGiftCardAmount > 0 && (
                        <BillRow label="GiftCard Applied" value={`- ₹${absGiftCardAmount.toFixed(2)}`} />
                    )}

                    {/* B-Coins */}
                    {absBcoinsAppliedValue > 0 && (
                        <BillRow label="Bcoins Applied" value={`- ₹${absBcoinsAppliedValue.toFixed(2)}`} />
                    )}

                    {/* Savings */}
                    {totalSavings > 0 && (
                        <BillRow label="You have saved" value={`- ₹${totalSavings.toFixed(2)}`} isGreen />
                    )}

                    <View style={styles.billDivider} />
                    <View style={styles.billSumView}>
                        <Text style={styles.billSumText}>To pay</Text>
                        <Text style={styles.billSumText}>₹{toPay.toFixed(2)}</Text>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

export default React.memo(BillSection);

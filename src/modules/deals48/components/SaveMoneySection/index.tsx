import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../assets/theme/colours';
import { Fonts } from '../../assets/theme/fonts';
import { saveMoneyStyles as styles } from './styles';

export interface SaveMoneySectionProps {
  appliedCouponCode?: string | null;
  appliedGiftCardCode?: string | null;
  bcoinsAppliedValue?: number;
  availableBCoins?: number;
  onApplyOffer: (offerId: string) => void;
  onRejectOffer: (offerId: string) => void;
}

const SaveMoneySection: React.FC<SaveMoneySectionProps> = ({
  appliedCouponCode,
  appliedGiftCardCode,
  bcoinsAppliedValue = 0,
  availableBCoins = 0,
  onApplyOffer,
  onRejectOffer,
}) => {
  return (
    <View style={styles.section}>
      <View style={[styles.sectionHeader, { marginBottom: 8 }]}>
        <MaterialCommunityIcons
          name="brightness-percent"
          size={20}
          color="#000"
        />
        <Text style={styles.sectionTitle}>Add offers</Text>
      </View>

      <View style={styles.offerCardsRow}>
        {/* B-coin */}
        <View
          style={[
            styles.offerCard,
            bcoinsAppliedValue > 0 && { borderColor: colors.themeTeal },
          ]}
        >
          <View style={styles.offerIconContainer}>
            <Image
              source={require('../../assets/images/cartbcoin.png')}
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.offerName}>B-COIN</Text>
          <Text style={styles.offerSub} numberOfLines={1}>
            Available BCoins: {availableBCoins}
          </Text>

          <View style={styles.dashedLineContainer}>
            <View style={styles.notchLeft} />
            <View style={styles.dashedLine} />
            <View style={styles.notchRight} />
          </View>

          <TouchableOpacity
            onPress={() =>
              bcoinsAppliedValue > 0 ? onRejectOffer('3') : onApplyOffer('3')
            }
          >
            <Text
              style={
                bcoinsAppliedValue > 0
                  ? styles.appliedBtnText
                  : styles.applyBtnText
              }
            >
              {bcoinsAppliedValue > 0 ? 'Remove' : 'Apply'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Coupon */}
        <View
          style={[
            styles.offerCard,
            appliedCouponCode && { borderColor: colors.green },
          ]}
        >
          <View style={styles.offerIconContainer}>
            {/* <Image
              source={require('../../assets/images/offer.png')}
              style={{ width: 30, height: 30, tintColor: '#F25000' }}
              resizeMode="contain"
            /> */}

            <Image
              source={require('../../assets/images/offer.png')}
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.offerName}>COUPON</Text>
          <Text
            style={[
              styles.offerSub,
              appliedCouponCode
                ? { color: colors.green, fontFamily: Fonts.gilroyBold }
                : null,
            ]}
            numberOfLines={1}
          >
            {appliedCouponCode ? appliedCouponCode : 'View All Coupons'}
          </Text>

          <View style={styles.dashedLineContainer}>
            <View style={styles.notchLeft} />
            <View style={styles.dashedLine} />
            <View style={styles.notchRight} />
          </View>

          <TouchableOpacity
            onPress={() =>
              appliedCouponCode ? onRejectOffer('2') : onApplyOffer('2')
            }
          >
            <Text
              style={
                appliedCouponCode ? styles.appliedBtnText : styles.applyBtnText
              }
            >
              {appliedCouponCode ? 'Applied' : 'View'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Smart Point */}
        <View
          style={[
            styles.offerCard,
            appliedGiftCardCode && { borderColor: colors.green },
          ]}
        >
          <View style={styles.offerIconContainer}>
            <Image
              source={require('../../assets/icons/profile/gift.png')}
              style={{ width: 30, height: 30, tintColor: colors.themeTeal }}
              resizeMode="contain"
            />
            {/* <Image
              source={require('../../assets/icons/profile/gift.png')}
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            /> */}
          </View>
          <Text style={styles.offerName}>SMART POINT</Text>
          <Text
            style={[
              styles.offerSub,
              appliedGiftCardCode
                ? { color: colors.green, fontFamily: Fonts.gilroyBold }
                : null,
            ]}
            numberOfLines={1}
          >
            {appliedGiftCardCode ? appliedGiftCardCode : 'View All Gift Cards'}
          </Text>

          <View style={styles.dashedLineContainer}>
            <View style={styles.notchLeft} />
            <View style={styles.dashedLine} />
            <View style={styles.notchRight} />
          </View>

          <TouchableOpacity
            onPress={() =>
              appliedGiftCardCode ? onRejectOffer('4') : onApplyOffer('4')
            }
          >
            <Text
              style={
                appliedGiftCardCode
                  ? styles.appliedBtnText
                  : styles.applyBtnText
              }
            >
              {appliedGiftCardCode ? 'Applied' : 'View'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default React.memo(SaveMoneySection);

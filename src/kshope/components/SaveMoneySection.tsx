import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colours';
import { Fonts } from '../theme/fonts';

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
        <View
          style={[
            styles.offerCard,
            bcoinsAppliedValue > 0 && { borderColor: colors.themeTeal },
          ]}
        >
          <View style={styles.offerIconContainer}>
            <Image
              source={require('../assets/images/cartbcoin.png')}
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

        <View
          style={[
            styles.offerCard,
            appliedCouponCode ? { borderColor: colors.green } : null,
          ]}
        >
          <View style={styles.offerIconContainer}>
            <Image
              source={require('../assets/images/offer.png')}
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

        <View
          style={[
            styles.offerCard,
            appliedGiftCardCode ? { borderColor: colors.green } : null,
          ]}
        >
          <View style={styles.offerIconContainer}>
            <Image
              source={require('../assets/icons/profile/gift.png')}
              style={{ width: 30, height: 30, tintColor: colors.themeTeal }}
              resizeMode="contain"
            />
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

const styles = StyleSheet.create({
  section: {
    marginBottom: 8,
    paddingHorizontal: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: Fonts.gilroySemiBold,
    fontSize: 16,
    color: '#000',
    marginLeft: 8,
  },
  offerCardsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 8,
  },
  offerCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 4,
    flex: 1,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  offerIconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  offerName: {
    fontFamily: Fonts.gilroyBold,
    fontSize: 12,
    color: '#000',
    textTransform: 'uppercase',
  },
  offerSub: {
    fontFamily: Fonts.gilroyMedium,
    fontSize: 10,
    color: '#999999',
    marginTop: 2,
  },
  dashedLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  notchLeft: {
    width: 6,
    height: 12,
    backgroundColor: colors.figmaTeal,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    position: 'absolute',
    left: -4,
  },
  notchRight: {
    width: 6,
    height: 12,
    backgroundColor: colors.figmaTeal,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    position: 'absolute',
    right: -4,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  applyBtnText: {
    fontFamily: Fonts.gilroyBold,
    fontSize: 12,
    color: '#009DFF',
  },
  appliedBtnText: {
    fontFamily: Fonts.gilroyBold,
    fontSize: 12,
    color: colors.green,
  },
});

export default React.memo(SaveMoneySection);

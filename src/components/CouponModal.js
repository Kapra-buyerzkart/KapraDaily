import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomModal, { MODAL_POSITION } from './modal/CustomModal';

const CouponModal = ({
  visible,
  onClose,
  isGiftCard,
  couponCode,
  setCouponCode,
  onApply,
  availableCoupons,
  availableGiftCards,
  onCouponClick,
  isCopyOnly = false,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (visible) {
      modalRef.current?.open();
    } else {
      modalRef.current?.close();
    }
  }, [visible]);

  return (
    <CustomModal
      ref={modalRef}
      position={MODAL_POSITION.BOTTOM}
      maxHeight={hp('80%')}
      scrollable={false}
      onClose={onClose}
      contentStyle={styles.modalContainer}
    >
      <View style={styles.modalHeaderView}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', gap: wp('2%') }}
        >
          <MaterialCommunityIcons
            name="ticket-percent"
            size={wp('6%')}
            color="#F25000"
          />
          <Text style={styles.modalHeaderText}>
            {isGiftCard ? 'Apply Gift Card' : 'Apply Coupon'}
          </Text>
        </View>
        <TouchableOpacity onPress={onClose}>
          <MaterialCommunityIcons
            name="close"
            size={wp('6%')}
            color="#000000"
          />
        </TouchableOpacity>
      </View>

      {}
      <Text style={styles.sectionTitle}>
        {isGiftCard ? 'Available Gift Cards' : 'Available Coupons'}
      </Text>
      <FlatList
        style={styles.list}
        data={isGiftCard ? availableGiftCards : availableCoupons}
        keyExtractor={(item, index) =>
          (item.couponId || item.giftCardId || index).toString()
        }
        renderItem={({ item }) => {
          const code = item.couponCode || item.giftCode || item.code;
          const expiryDate = item.validTo
            ? new Date(item.validTo).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : null;

          let description = item.description;
          if (!description) {
            if (item.discountType === 'PERCENT') {
              description = `Get ${item.discountValue}% OFF up to ₹${item.maxDiscountAmount}`;
            } else if (item.discountType === 'FLAT') {
              description = `Flat ₹${item.discountValue} OFF`;
            }
          }

          return (
            <TouchableOpacity
              style={styles.couponCard}
              onPress={() => onCouponClick(code)}
            >
              <View style={styles.couponTopRow}>
                <View style={styles.couponCodeContainer}>
                  <Text style={styles.couponCodeText}>{code}</Text>
                </View>
                <Text style={styles.applyText}>
                  {isCopyOnly ? 'COPY' : 'APPLY'}
                </Text>
              </View>

              <Text style={styles.couponDescription}>{description}</Text>

              <View style={styles.couponFooter}>
                {item.minOrderAmount > 0 && (
                  <Text style={styles.footerText}>
                    Min. order: ₹{item.minOrderAmount}
                  </Text>
                )}
                {expiryDate && (
                  <Text style={styles.footerText}>Expires: {expiryDate}</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image
              source={
                isGiftCard
                  ? require('../assets/images/noimages/noCouponCode.png')
                  : require('../assets/images/noimages/noCoupons.png')
              }
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>
              {isGiftCard ? 'No gift cards available' : 'No coupons available'}
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: hp('12%') }}
      />
    </CustomModal>
  );
};

export default React.memo(CouponModal);

const styles = StyleSheet.create({
  modalContainer: {
    paddingHorizontal: wp('4.65%'),
    paddingVertical: hp('2%'),
  },
  list: {
    maxHeight: hp('60%'),
  },
  modalHeaderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  modalHeaderText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.5%'),
    color: '#000000',
  },
  sectionTitle: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.5%'),
    color: '#000000',
  },
  couponInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
    marginBottom: hp('2%'),
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    fontFamily: FONTS.gilroy.regular,
    color: '#000000',
  },
  applyCouponButton: {
    backgroundColor: '#F25000',
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('1.5%'),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyCouponButtonText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.5%'),
    color: '#FFFFFF',
  },
  couponCard: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    padding: wp('4%'),
    marginBottom: hp('1.5%'),
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  couponTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  couponCodeContainer: {
    backgroundColor: '#FFF5F0',
    borderWidth: 1,
    borderColor: '#F25000',
    borderRadius: 4,
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.5%'),
    borderStyle: 'dashed',
  },
  couponCodeText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.5%'),
    color: '#F25000',
  },
  couponDescription: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.8%'),
    color: '#333333',
    marginBottom: hp('0.5%'),
  },
  couponFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: hp('1%'),
    marginTop: hp('0.5%'),
  },
  footerText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3%'),
    color: '#888888',
  },
  applyText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.5%'),
    color: '#F25000',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('4%'),
    gap: hp('2%'),
  },
  emptyImage: {
    width: wp('40%'),
    height: wp('40%'),
    resizeMode: 'contain',
  },
  emptyText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.5%'),
    color: '#999',
    textAlign: 'center',
  },
});

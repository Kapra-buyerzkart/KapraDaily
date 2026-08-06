import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import CONFIG from '../globals/config';
import AppButton from './AppButton';

const OrderProductCard = ({ item, orderStatus, onReturn }) => {
  const [imageError, setImageError] = useState(false);

  const rawImage =
    item.image ||
    item.prImage ||
    item.productImage ||
    item.product_image ||
    item.featuredImage ||
    item.img ||
    item?.productImg;

  useEffect(() => {
    setImageError(false);
  }, [rawImage]);

  const getImageSource = img => {
    if (!img || imageError)
      return require('../assets/images/udenDealNotfound.png');
    if (typeof img === 'string') {
      if (img.startsWith('http')) return { uri: img };
      return { uri: `${CONFIG.image_base_url}${img}` };
    }
    return img;
  };

  const imageSource = getImageSource(rawImage);

  const canReturn =
    orderStatus === 'delivered' &&
    item.canReturn &&
    !item.isReturned &&
    !item.returnRequested;

  return (
    <View style={styles.cardContainer}>
      <Image
        style={styles.productImage}
        source={imageSource}
        onError={() => setImageError(true)}
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">
          {item.productName}
        </Text>
        <Text style={styles.quantityText}>Qty: {item.quantity}</Text>
        <Text style={styles.priceText}>
          ₹
          {item.lineTotal ||
            item.netAmount ||
            item.price ||
            item.unitPrice * item.quantity}
        </Text>

        {canReturn && (
          <AppButton
            title="Return"
            onPress={() => onReturn(item)}
            variant="outline"
            style={styles.returnButton}
            textStyle={styles.returnButtonText}
          />
        )}
        {item.returnRequested && (
          <View style={styles.statusBadge}>
            <Text style={styles.returnStatusText}>Return Requested</Text>
          </View>
        )}
        {item.isReturned && (
          <View style={[styles.statusBadge, { backgroundColor: '#E8F5E9' }]}>
            <Text style={[styles.returnStatusText, { color: '#2E7D32' }]}>
              Returned
            </Text>
          </View>
        )}
        {(item.returnStatusKey === 'requestrejected' ||
          item.itemStatusKey === 'requestrejected') && (
          <View style={[styles.statusBadge, { backgroundColor: '#FFEBEE' }]}>
            <Text style={[styles.returnStatusText, { color: '#D32F2F' }]}>
              Return Rejected
            </Text>
          </View>
        )}
        {item.returnRefundStatus &&
          (() => {
            const status = item.returnRefundStatus.toLowerCase();
            const isApproved =
              status.includes('approved') ||
              status.includes('completed') ||
              status.includes('refunded');
            const isRejected =
              status.includes('rejected') || status.includes('denied');
            const bgColor = isApproved
              ? '#E8F5E9'
              : isRejected
              ? '#FFEBEE'
              : '#E3F2FD';
            const textColor = isApproved
              ? '#2E7D32'
              : isRejected
              ? '#D32F2F'
              : '#1E88E5';
            return (
              <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
                <Text style={[styles.returnStatusText, { color: textColor }]}>
                  Refund: {item.returnRefundStatus}
                </Text>
              </View>
            );
          })()}
      </View>
    </View>
  );
};

export default OrderProductCard;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    paddingVertical: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  productImage: {
    width: wp('14%'),
    height: wp('14%'),
    resizeMode: 'contain',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: wp('3%'),
  },
  productName: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.5%'),
    color: '#000000',
  },
  quantityText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.2%'),
    color: '#777777',
    marginTop: hp('0.3%'),
  },
  priceText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.8%'),
    color: '#000000',
    marginTop: hp('0.3%'),
  },
  returnButton: {
    marginTop: hp('0.8%'),
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('3%'),
    borderRadius: 4,
    minHeight: hp('3.5%'),
    alignSelf: 'flex-start',
  },
  returnButtonText: {
    fontSize: wp('3%'),
  },
  statusBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.1%'),
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  returnStatusText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.8%'),
    color: '#F2994A',
  },
});

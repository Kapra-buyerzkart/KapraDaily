import { View, Text, StyleSheet, Image } from 'react-native';
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
      <View style={styles.imageWell}>
        <Image
          style={styles.productImage}
          source={imageSource}
          onError={() => setImageError(true)}
        />
      </View>
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
          <Text style={styles.returnStatusText}>Return Requested</Text>
        )}
        {item.isReturned && (
          <Text style={[styles.returnStatusText, styles.statusApproved]}>
            Returned
          </Text>
        )}
        {(item.returnStatusKey === 'requestrejected' ||
          item.itemStatusKey === 'requestrejected') && (
          <Text style={[styles.returnStatusText, styles.statusRejected]}>
            Return Rejected
          </Text>
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
            return (
              <Text
                style={[
                  styles.returnStatusText,
                  isApproved && styles.statusApproved,
                  isRejected && styles.statusRejected,
                  !isApproved && !isRejected && styles.statusInfo,
                ]}
              >
                Refund: {item.returnRefundStatus}
              </Text>
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
    paddingVertical: hp('1.3%'),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(17,19,26,0.07)',
    alignItems: 'center',
  },
  imageWell: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: 12,
    backgroundColor: '#F5F6F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: wp('11.5%'),
    height: wp('11.5%'),
    resizeMode: 'contain',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: wp('3.2%'),
  },
  productName: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.5%'),
    color: '#12131A',
  },
  quantityText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3%'),
    color: '#6B7280',
    marginTop: hp('0.3%'),
  },
  priceText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.8%'),
    color: '#12131A',
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
  returnStatusText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.8%'),
    color: '#F2994A',
    alignSelf: 'flex-end',
    marginTop: hp('0.3%'),
  },
  statusApproved: {
    color: '#2E7D32',
  },
  statusRejected: {
    color: '#D32F2F',
  },
  statusInfo: {
    color: '#1E88E5',
  },
});

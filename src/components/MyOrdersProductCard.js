import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import {
  INK,
  ACCENT,
  SURFACE,
  HAIRLINE,
  RADIUS,
  SPACE,
  TYPE,
  MAX_FONT_SCALE,
} from '@/styles/homeTheme';
import { useNavigation } from '@react-navigation/native';
import { reorderApi } from '../api/orderService';
import { useCart } from '../context/CartContext';
import CONFIG from '../globals/config';
import ConfirmationModal from './ConfirmationModal';
import { AppContext } from '../context/appContext';
import { useState, useContext } from 'react';

const MyOrdersProductCard = props => {
  const { isStoreUnavailable } = useContext(AppContext);
  const [showReorderModal, setShowReorderModal] = useState(false);

  const itemData = props.item.item || props.item || {};

  // Standardized product list parsing
  const getProductList = () => {
    if (itemData.productImagesCsv) {
      return itemData.productImagesCsv.split(',').map(url => ({ image: url }));
    }
    return (
      itemData.items || itemData.products || itemData.selectedProducts || []
    );
  };

  const productList = getProductList();

  const { addToCart } = useCart();

  // Format Date
  const formatDate = dateString => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return (
        date.toLocaleDateString() +
        ' ' +
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    } catch (e) {
      return dateString;
    }
  };

  const getPaymentLabel = method => {
    if (!method) return 'Cash On Delivery';
    const m = method.toUpperCase();
    if (m === 'COD') return 'Cash On Delivery';
    if (m === 'ONLINE' || m === 'UPI' || m === 'PREPAID')
      return 'Online Payment';
    return method;
  };

  const navigation = useNavigation();

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.orderInnerContainer}>
        <View style={styles.orderTopView}>
          <View style={styles.orderTopInnerView}>
            <Image
              style={styles.homeIcon}
              source={require('../assets/images/home_icon.png')}
            />
            <Text
              style={
                Platform.OS === 'android'
                  ? [
                      styles.homeText,
                      {
                        top: hp('0.3'),
                      },
                    ]
                  : [
                      styles.homeText,
                      {
                        top: hp('0.1'),
                      },
                    ]
              }
            >
              {itemData.addressType || 'Home'}
            </Text>
          </View>
          <View style={styles.orderTopInnerView}>
            {(() => {
              const status = (
                itemData.orderStatusText ||
                itemData.status ||
                ''
              ).toLowerCase();
              const iconStyle = styles.statusIcon;
              if (status.includes('cancel')) {
                return (
                  <AntDesign
                    name="closecircle"
                    size={wp('3%')}
                    color="#E74C3C"
                  />
                );
              } else if (
                status.includes('deliver') &&
                !status.includes('out')
              ) {
                return (
                  <AntDesign
                    name="checkcircle"
                    size={wp('3%')}
                    color={ACCENT.success}
                  />
                );
              } else if (
                status.includes('out') ||
                status.includes('dispatch')
              ) {
                return (
                  <Image
                    source={require('../assets/images/order/outfordelivery.png')}
                    style={iconStyle}
                  />
                );
              } else if (status.includes('pending')) {
                return (
                  <Image
                    source={require('../assets/images/order/orderpending.png')}
                    style={iconStyle}
                  />
                );
              } else if (status.includes('placed')) {
                return (
                  <Image
                    source={require('../assets/images/order/orderplaced.png')}
                    style={iconStyle}
                  />
                );
              } else if (status.includes('accept')) {
                return (
                  <Image
                    source={require('../assets/images/order/orderaccepted.png')}
                    style={iconStyle}
                  />
                );
              } else if (status.includes('pack')) {
                return (
                  <Image
                    source={require('../assets/images/order/orderpacked.png')}
                    style={iconStyle}
                  />
                );
              } else if (status.includes('assign')) {
                return (
                  <Image
                    source={require('../assets/images/order/outfordelivery.png')}
                    style={iconStyle}
                  />
                );
              } else {
                return (
                  <Image
                    source={require('../assets/images/order/orderplaced.png')}
                    style={iconStyle}
                  />
                );
              }
            })()}
            <Text
              style={[
                styles.homeText,
                Platform.OS === 'android' && { top: hp('0.1') },
                (itemData.orderStatusText || itemData.status || '')
                  .toLowerCase()
                  .includes('cancel') && { color: '#E74C3C' },
              ]}
            >
              {itemData.orderStatusText ||
                itemData.status ||
                getPaymentLabel(itemData.paymentMethod)}
            </Text>
          </View>
        </View>
        <View style={styles.orderMiddleView}>
          <View style={styles.stackContainer}>
            {productList.slice(0, 3).map((item, index) => (
              <Image
                key={index}
                source={
                  item.image
                    ? {
                        uri: `${CONFIG.image_base_url}${item.image}`,
                      }
                    : require('../assets/images/product1.png')
                }
                style={[
                  styles.productImage,
                  {
                    marginLeft: index === 0 ? 0 : wp('-7%'), // overlap to left
                    // zIndex: index + 1,                 // last image on top
                  },
                ]}
              />
            ))}
          </View>
          <View>
            <Text style={styles.orderNumberText}>
              #{itemData.orderNumber || itemData.orderId || itemData.id}
            </Text>

            <Text style={styles.orderMetaText}>
              Total item : {itemData.totalOrderItems || productList.length}
            </Text>
          </View>
          <Text style={styles.priceText}>
            ₹
            {(
              itemData.grandTotal ??
              itemData.price ??
              itemData.totalAmount ??
              0
            ).toFixed(2)}
          </Text>
        </View>
        <View
          style={[
            styles.buttonContainer,
            !itemData.canReorder && { justifyContent: 'center' },
          ]}
        >
          {itemData.canReorder && (
            <TouchableOpacity
              style={[
                styles.button,
                styles.buttonPrimary,
                isStoreUnavailable && { opacity: 0.6 },
              ]}
              onPress={() => !isStoreUnavailable && setShowReorderModal(true)}
              activeOpacity={isStoreUnavailable ? 1 : 0.7}
            >
              <Text
                style={[styles.buttonText, styles.buttonPrimaryText]}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                Reorder
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('OrderTrackingScreen', {
                orderId: itemData.orderId || itemData.id,
                orderNumber: itemData.orderNumber,
                order: itemData,
              })
            }
            style={[
              styles.button,
              styles.buttonGhost,
              !itemData.canReorder && { width: '100%' },
            ]}
          >
            <Text
              style={[styles.buttonText, styles.buttonGhostText]}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.orderBottomView}>
        <Text style={styles.placedOrderText}>
          Order placed on:{' '}
          {formatDate(itemData.orderDate || itemData.date || itemData.time)}
        </Text>
      </View>

      <ConfirmationModal
        visible={showReorderModal}
        title="Reorder Item"
        message="Are you sure you want to reorder this item?"
        confirmText="Reorder"
        cancelText="Cancel"
        onClose={() => setShowReorderModal(false)}
        onConfirm={async () => {
          try {
            const idToUse =
              itemData.orderId || itemData.id || itemData.orderNumber;
            if (idToUse) {
              await reorderApi({ orderId: idToUse });
              navigation.navigate('CartScreen');
            }
          } catch (e) {
            console.error(e);
          }
        }}
      />
    </View>
  );
};

export default MyOrdersProductCard;

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: SPACE.md,
    alignSelf: 'center',
  },
  productImage: {
    height: wp('13.5%'),
    width: wp('13.5%'),
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: HAIRLINE,
    backgroundColor: SURFACE.base,
  },
  orderInnerContainer: {
    width: wp('90.7%'),
    backgroundColor: SURFACE.base,
    borderWidth: 1,
    borderColor: HAIRLINE,
    borderRadius: RADIUS.md,
    padding: SPACE.md,
  },
  orderTopView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: HAIRLINE,
    paddingBottom: SPACE.sm,
  },
  orderTopInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeIcon: {
    width: wp('3.72%'),
    height: hp('1.4%'),
  },
  successIcon: {
    width: wp('3.02%'),
    height: hp('1.4%'),
  },
  homeText: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.medium,
    color: INK.muted,
    marginLeft: SPACE.xs + 2,
  },
  orderMiddleView: {
    flexDirection: 'row',
    marginTop: SPACE.md,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumberText: {
    ...TYPE.label,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.base,
  },
  orderMetaText: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
    marginTop: 2,
  },
  priceText: {
    ...TYPE.heading,
    lineHeight: undefined,
    color: INK.strong,
    fontFamily: FONTS.gilroy.bold,
    alignSelf: 'flex-end',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACE.md,
  },
  button: {
    width: '48%',
    height: hp('4.3%'),
    borderRadius: RADIUS.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: ACCENT.primary,
  },
  buttonPrimaryText: {
    color: INK.onDark,
  },
  buttonGhost: {
    backgroundColor: SURFACE.base,
    borderWidth: 1.2,
    borderColor: ACCENT.primary,
  },
  buttonGhostText: {
    color: ACCENT.primary,
  },
  buttonText: {
    ...TYPE.label,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    letterSpacing: 0.4,
  },
  placedOrderText: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.medium,
    color: INK.faint,
  },
  orderBottomView: {
    paddingTop: SPACE.xs + 2,
    paddingLeft: SPACE.xs,
  },
  stackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    width: wp('3.5%'),
    height: wp('3.5%'),
    resizeMode: 'contain',
  },
});

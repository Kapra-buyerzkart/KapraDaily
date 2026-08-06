import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  BackHandler,
} from 'react-native';
import React, { useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONTS } from '../styles/typography';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  useNavigation,
  useRoute,
  CommonActions,
} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const OrderFailedScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    orderId,
    orderNumber,
    paymentMethod,
    totalItems,
    totalAmount,
    errorMessage,
  } = route.params || {};

  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    const unsubscribe = navigation.addListener('beforeRemove', e => {
      const action = e.data.action;
      if (action.type === 'RESET' || action.type === 'REPLACE') {
        return;
      }
      e.preventDefault();
    });

    return () => {
      backHandler.remove();
      unsubscribe();
    };
  }, [navigation]);

  const handleRetryMethod = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'OrderTrackingScreen',
            params: { orderId, autoScrollToRetry: true },
          },
        ],
      }),
    );
  };

  const handleBackToHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      }),
    );
  };

  const displayOrderNumber = orderNumber || orderId || '--';
  const displayPayment = paymentMethod || 'Online';
  const displayTotal = totalAmount || 0;

  const getPaymentLabel = method => {
    if (!method) return 'Online Payment';
    const m = method.toUpperCase();
    if (m === 'COD') return 'Cash On Delivery';
    if (m === 'ONLINE' || m === 'UPI') return 'Online Payment';
    return method;
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF0F0" />
      <LinearGradient
        colors={['#FFF0F0', '#FFF5F5', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.6 }}
        style={styles.gradientContainer}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {}
          <View style={styles.failureSection}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="close"
                size={wp('15%')}
                color="#FF0000"
              />
            </View>
            <View style={styles.statusContainer}>
              <Text style={[styles.statusText, { textAlign: 'center' }]}>
                {'Oops! \nPayment Failed'}
              </Text>
              <Text style={styles.statusTextTwo}>
                {"We're unable to process your payment at this time."}
              </Text>
              <Text
                style={[
                  styles.statusTextTwo,
                  { marginTop: hp('1%'), fontSize: wp('3%'), color: '#888888' },
                ]}
              >
                {
                  'If any amount has been debited, it will be automatically refunded to your account within the standard processing time.'
                }
              </Text>
            </View>
          </View>

          {}
          <View style={styles.orderCard}>
            <View style={styles.orderCardHeader}>
              <MaterialCommunityIcons
                name="receipt"
                size={wp('5%')}
                color="#F25000"
              />
              <Text style={styles.orderCardTitle}>Order Details</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Order ID</Text>
              <Text style={styles.detailValue}>#{displayOrderNumber}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Method</Text>
              <View style={styles.detailBadge}>
                <MaterialCommunityIcons
                  name="cellphone"
                  size={wp('3.5%')}
                  color="#1A73E8"
                />
                <Text style={styles.detailBadgeText}>
                  {getPaymentLabel(displayPayment)}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {totalItems ? (
              <>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total Items</Text>
                  <Text style={styles.detailValue}>
                    {totalItems} item{totalItems !== 1 ? 's' : ''}
                  </Text>
                </View>
                <View style={styles.divider} />
              </>
            ) : null}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalAmount}>
                ₹{Number(displayTotal).toFixed(2)}
              </Text>
            </View>
          </View>

          {}
          <View style={styles.buttonsContainer}>
            <LinearGradient
              colors={['#F25000', '#FF7B3A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.retryButtonGradient}
            >
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRetryMethod}
                activeOpacity={0.7}
              >
                <Ionicons name="refresh" size={wp('5%')} color="#FFFFFF" />
                <Text style={styles.retryButtonText}>Retry Payment</Text>
              </TouchableOpacity>
            </LinearGradient>

            <TouchableOpacity
              style={styles.homeButton}
              onPress={handleBackToHome}
              activeOpacity={0.7}
            >
              <Ionicons name="home-outline" size={wp('5%')} color="#616161" />
              <Text style={styles.homeButtonText}>Go to Home</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerNote}>
            Don't worry, your money is safe. If debited, it will be refunded
            automatically within 5-7 working days.
          </Text>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default OrderFailedScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF0F0',
  },
  gradientContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: hp('5%'),
    paddingHorizontal: wp('5%'),
  },
  failureSection: {
    alignItems: 'center',
    marginTop: hp('6%'),
  },
  iconCircle: {
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: wp('12.5%'),
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusText: {
    color: '#FF0000',
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('6%'),
  },
  statusTextTwo: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.5%'),
    color: '#616161',
    marginTop: hp('0.5%'),
    textAlign: 'center',
    paddingHorizontal: wp('10%'),
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: wp('5%'),
    marginTop: hp('4%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  orderCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  orderCardTitle: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4%'),
    color: '#000000',
    marginLeft: wp('2%'),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1%'),
  },
  detailLabel: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.5%'),
    color: '#999999',
  },
  detailValue: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.5%'),
    color: '#333333',
  },
  detailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.4%'),
    borderRadius: 20,
  },
  detailBadgeText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3%'),
    color: '#333333',
    marginLeft: wp('1%'),
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F5F5',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1.5%'),
    paddingTop: hp('1.5%'),
    borderTopWidth: 1.5,
    borderTopColor: '#F0F0F0',
  },
  totalLabel: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4%'),
    color: '#000000',
  },
  totalAmount: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('5.5%'),
    color: '#FF0000',
  },
  buttonsContainer: {
    marginTop: hp('4%'),
  },
  retryButtonGradient: {
    borderRadius: 12,
    marginBottom: hp('1.5%'),
  },
  retryButton: {
    height: hp('6.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4%'),
    color: '#FFFFFF',
    marginLeft: wp('1.5%'),
  },
  homeButton: {
    height: hp('6.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  homeButtonText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4%'),
    color: '#616161',
    marginLeft: wp('1.5%'),
  },
  footerNote: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3%'),
    color: '#9E9E9E',
    textAlign: 'center',
    marginTop: hp('3%'),
    lineHeight: hp('2%'),
    paddingHorizontal: wp('5%'),
  },
});

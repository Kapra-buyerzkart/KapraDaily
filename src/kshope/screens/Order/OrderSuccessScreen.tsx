import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { getOrderDetailsApi } from '../../api/services/orderService';
import {
  BulletCard,
  CopyChip,
  MetaRow,
  StatusActionBar,
  StatusDisc,
  StatusTopBar,
  SupportCard,
} from './status/components';
import { SUCCESS_COPY, SUCCESS_STEPS } from './status/constants';
import { getPaymentLabel } from './status/paymentMeta';
import {
  useBackToHome,
  useTrackOrder,
  useCopyOrderNumber,
  useLockedBack,
} from './status/useOrderStatus';
import { styles } from './status/styles';

const OrderSuccessScreen: React.FC = () => {
  const route = useRoute<any>();
  const {
    orderId,
    orderNumber,
    paymentMethod,
    totalItems,
    totalAmount,
    deliveryMode,
    address,
  } = route.params || {};

  const [orderDetails, setOrderDetails] = useState<any>(null);

  useLockedBack();

  useEffect(() => {
    if (!orderId) {
      return;
    }

    let active = true;

    const fetchOrderDetails = async () => {
      try {
        const response = await getOrderDetailsApi(orderId);
        if (active && response?.success && response?.data) {
          setOrderDetails(response.data);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();

    return () => {
      active = false;
    };
  }, [orderId]);

  const displayOrderNumber =
    orderDetails?.orderNumber || orderNumber || orderId || '--';
  const paymentLabel = useMemo(
    () => getPaymentLabel(orderDetails?.paymentMethod || paymentMethod || 'cod'),
    [orderDetails, paymentMethod],
  );
  const displayItems =
    orderDetails?.totalItems || orderDetails?.items?.length || totalItems || 0;
  const itemsLabel = displayItems
    ? `${displayItems} item${Number(displayItems) !== 1 ? 's' : ''}`
    : null;
  const displayTotal =
    orderDetails?.grandTotal || orderDetails?.totalAmount || totalAmount || 0;
  const amountLabel = `₹${Number(displayTotal).toFixed(2)}`;
  const deliveryLabel = deliveryMode
    ? String(deliveryMode).toLowerCase() === 'express'
      ? 'Standard'
      : 'Slotted'
    : null;
  const displayAddress = address || '';

  const handleCopyOrderNumber = useCopyOrderNumber(String(displayOrderNumber));
  const handleBackToHome = useBackToHome();

  const trackOrder = useTrackOrder();
  const handleTrackOrder = () => {
    trackOrder(orderId || orderDetails?._id);
  };

  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />

      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <StatusTopBar
          title={SUCCESS_COPY.topBarTitle}
          subtitle={SUCCESS_COPY.topBarSubtitle}
          statusLabel={SUCCESS_COPY.statusLabel}
          tone="success"
        />
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Status Hero Card */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.statusRow}>
              <StatusDisc tone="success" icon="check" />
              <View style={styles.statusCopy}>
                <Text style={styles.statusTitle}>{SUCCESS_COPY.statusTitle}</Text>
                <Text style={styles.statusSubtitle}>
                  {SUCCESS_COPY.statusSubtitle}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 2. Order Summary Card */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardHeading}>{SUCCESS_COPY.summaryTitle}</Text>

            <View style={styles.divider} />

            <View style={styles.metaGroup}>
              <MetaRow label="Order number">
                <Text style={styles.orderNumberText}>#{displayOrderNumber}</Text>
                <CopyChip onPress={handleCopyOrderNumber} />
              </MetaRow>

              <MetaRow label="Payment">
                <Text style={styles.metaValueText}>
                  {paymentLabel}
                </Text>
              </MetaRow>

              {itemsLabel ? (
                <MetaRow label="Items">
                  <Text style={styles.metaValueText}>
                    {itemsLabel}
                  </Text>
                </MetaRow>
              ) : null}

              {deliveryLabel ? (
                <MetaRow label="Delivery">
                  <Text style={styles.metaValueText}>
                    {deliveryLabel}
                  </Text>
                </MetaRow>
              ) : null}

              {displayAddress ? (
                <MetaRow label="Delivering to">
                  <Text
                    numberOfLines={2}
                    style={styles.metaValueText}
                  >
                    {displayAddress}
                  </Text>
                </MetaRow>
              ) : null}
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Order total</Text>
              <Text style={styles.totalAmount}>{amountLabel}</Text>
            </View>
          </View>
        </View>

        <BulletCard title={SUCCESS_COPY.stepsTitle} bullets={SUCCESS_STEPS} />

        <SupportCard
          title={SUCCESS_COPY.supportTitle}
          subtitle={SUCCESS_COPY.supportSubtitle}
        />

        <Text style={styles.footerNote}>
          {SUCCESS_COPY.footerNote}
        </Text>
      </ScrollView>

      <StatusActionBar
        primaryLabel={SUCCESS_COPY.trackCta}
        primaryIcon="arrow-right"
        primaryIconTrailing
        ghostLabel={SUCCESS_COPY.homeCta}
        onPrimary={handleTrackOrder}
        onGhost={handleBackToHome}
      />
    </View>
  );
};

export default OrderSuccessScreen;

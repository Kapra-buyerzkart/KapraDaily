import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppText from '../../components/atoms/AppText';
import Surface from '../../components/atoms/Surface';
import Divider from '../../components/atoms/Divider';
import SectionHeading from '../../components/atoms/SectionHeading';
import { UI_COLORS } from '../../theme/tokens';
import { getOrderDetailsApi } from '../../api/services/orderService';
import {
  BulletCard,
  CopyChip,
  FooterStrip,
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
  useCopyOrderNumber,
  useLockedBack,
} from './status/useOrderStatus';
import { styles } from './status/styles';

const OrderSuccessScreen: React.FC = () => {
  const navigation = useNavigation<any>();
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
      ? 'Express'
      : 'Slotted'
    : null;
  const displayAddress = address || '';

  const handleCopyOrderNumber = useCopyOrderNumber(String(displayOrderNumber));
  const handleBackToHome = useBackToHome();

  const handleTrackOrder = () => {
    navigation.navigate('KshopeMyOrderDetails', {
      orderId: orderId || orderDetails?._id,
    });
  };

  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={UI_COLORS.card}
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
        <Surface style={styles.section}>
          <View style={styles.card}>
            <View style={styles.statusRow}>
              <StatusDisc tone="success" icon="check" />
              <View style={styles.statusCopy}>
                <AppText variant="heading">{SUCCESS_COPY.statusTitle}</AppText>
                <AppText variant="caption" tone="muted">
                  {SUCCESS_COPY.statusSubtitle}
                </AppText>
              </View>
            </View>
          </View>

          <FooterStrip icon="truck" note={SUCCESS_COPY.assuranceNote} />
        </Surface>

        <Surface style={styles.section}>
          <View style={styles.card}>
            <SectionHeading title={SUCCESS_COPY.summaryTitle} />

            <Divider style={styles.rule} />

            <View style={styles.metaGroup}>
              <MetaRow label="Order number">
                <AppText variant="labelStrong">#{displayOrderNumber}</AppText>
                <CopyChip onPress={handleCopyOrderNumber} />
              </MetaRow>

              <MetaRow label="Payment">
                <AppText variant="labelStrong" tone="secondary">
                  {paymentLabel}
                </AppText>
              </MetaRow>

              {itemsLabel ? (
                <MetaRow label="Items">
                  <AppText variant="labelStrong" tone="secondary">
                    {itemsLabel}
                  </AppText>
                </MetaRow>
              ) : null}

              {deliveryLabel ? (
                <MetaRow label="Delivery">
                  <AppText variant="labelStrong" tone="secondary">
                    {deliveryLabel}
                  </AppText>
                </MetaRow>
              ) : null}

              {displayAddress ? (
                <MetaRow label="Delivering to">
                  <AppText
                    variant="labelStrong"
                    tone="secondary"
                    numberOfLines={2}
                    style={styles.metaValueText}
                  >
                    {displayAddress}
                  </AppText>
                </MetaRow>
              ) : null}
            </View>

            <View style={styles.totalRow}>
              <AppText variant="labelStrong">Order total</AppText>
              <AppText variant="price">{amountLabel}</AppText>
            </View>
          </View>
        </Surface>

        <BulletCard title={SUCCESS_COPY.stepsTitle} bullets={SUCCESS_STEPS} />

        <SupportCard
          title={SUCCESS_COPY.supportTitle}
          subtitle={SUCCESS_COPY.supportSubtitle}
        />

        <AppText variant="micro" tone="faint" style={styles.footerNote}>
          {SUCCESS_COPY.footerNote}
        </AppText>
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

import React, { useMemo } from 'react';
import { ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  CommonActions,
} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
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
import { FAILED_COPY, FAILED_REASONS } from './status/constants';
import { getPaymentLabel } from './status/paymentMeta';
import { resolveFailureMessage } from './status/failureMessage';
import {
  useBackToHome,
  useCopyOrderNumber,
  useLockedBack,
} from './status/useOrderStatus';
import { ICON, STATUS_COLORS, styles } from './status/styles';

const OrderFailedScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {
    orderId,
    orderNumber,
    paymentMethod,
    totalItems,
    totalAmount,
    errorMessage,
  } = route.params || {};

  useLockedBack();

  const displayOrderNumber = orderNumber || orderId || '--';
  const paymentLabel = useMemo(
    () => getPaymentLabel(paymentMethod || 'online'),
    [paymentMethod],
  );
  const itemsLabel = totalItems
    ? `${totalItems} item${Number(totalItems) !== 1 ? 's' : ''}`
    : null;
  const amountLabel = `₹${Number(totalAmount || 0).toFixed(2)}`;
  const failureReason = useMemo(
    () => resolveFailureMessage(errorMessage),
    [errorMessage],
  );

  const handleCopyOrderNumber = useCopyOrderNumber(String(displayOrderNumber));
  const handleBackToHome = useBackToHome();

  const handleRetryPayment = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'KshopeMyOrderDetails',
            params: { orderId, autoScrollToRetry: true },
          },
        ],
      }),
    );
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
          title={FAILED_COPY.topBarTitle}
          subtitle={FAILED_COPY.topBarSubtitle}
          statusLabel={FAILED_COPY.statusLabel}
          onBack={handleBackToHome}
          tone="danger"
        />
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Status hero card */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.statusRow}>
              <StatusDisc tone="danger" icon="close" />
              <View style={styles.statusCopy}>
                <Text style={styles.statusTitle}>{FAILED_COPY.statusTitle}</Text>
                <Text style={styles.statusSubtitle}>
                  {FAILED_COPY.statusSubtitle}
                </Text>
              </View>
            </View>

            {failureReason ? (
              <View style={styles.errorStrip}>
                <Feather
                  name="alert-triangle"
                  size={ICON.meta}
                  color={STATUS_COLORS.danger}
                />
                <Text style={styles.errorStripCopy}>{failureReason}</Text>
              </View>
            ) : null}
          </View>

          <FooterStrip note={FAILED_COPY.refundNote} />
        </View>

        {/* 2. Order summary card */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardHeading}>{FAILED_COPY.summaryTitle}</Text>

            <View style={styles.divider} />

            <View style={styles.metaGroup}>
              <MetaRow label="Order number">
                <Text style={styles.orderNumberText}>#{displayOrderNumber}</Text>
                <CopyChip onPress={handleCopyOrderNumber} />
              </MetaRow>

              <MetaRow label="Payment">
                <Text style={styles.metaValueText}>{paymentLabel}</Text>
              </MetaRow>

              {itemsLabel ? (
                <MetaRow label="Items">
                  <Text style={styles.metaValueText}>{itemsLabel}</Text>
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

        {/* 3. Common reasons */}
        <BulletCard title={FAILED_COPY.reasonsTitle} bullets={FAILED_REASONS} />

        {/* 4. Support concierge card */}
        <SupportCard
          title={FAILED_COPY.supportTitle}
          subtitle={FAILED_COPY.supportSubtitle}
        />

        {/* 5. Footer note */}
        <Text style={styles.footerNote}>
          {FAILED_COPY.footerNote}
        </Text>
      </ScrollView>

      {/* Fixed bottom action bar with luxury dark emerald button */}
      <StatusActionBar
        primaryLabel={FAILED_COPY.retryCta}
        primaryIcon="rotate-cw"
        ghostLabel={FAILED_COPY.homeCta}
        onPrimary={handleRetryPayment}
        onGhost={handleBackToHome}
      />
    </View>
  );
};

export default OrderFailedScreen;

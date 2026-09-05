import React, { useMemo } from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  CommonActions,
} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import AppText from '../../components/atoms/AppText';
import Surface from '../../components/atoms/Surface';
import Divider from '../../components/atoms/Divider';
import SectionHeading from '../../components/atoms/SectionHeading';
import { UI_COLORS } from '../../theme/tokens';
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
import { ICON, styles } from './status/styles';

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
        backgroundColor={UI_COLORS.card}
        translucent={false}
      />

      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <StatusTopBar
          title={FAILED_COPY.topBarTitle}
          subtitle={FAILED_COPY.topBarSubtitle}
          statusLabel={FAILED_COPY.statusLabel}
          tone="danger"
        />
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Surface style={styles.section}>
          <View style={styles.card}>
            <View style={styles.statusRow}>
              <StatusDisc tone="danger" icon="close" />
              <View style={styles.statusCopy}>
                <AppText variant="heading">{FAILED_COPY.statusTitle}</AppText>
                <AppText variant="caption" tone="muted">
                  {FAILED_COPY.statusSubtitle}
                </AppText>
              </View>
            </View>

            {failureReason ? (
              <View style={styles.errorStrip}>
                <Feather
                  name="alert-triangle"
                  size={ICON.meta}
                  color={UI_COLORS.danger}
                />
                <AppText
                  variant="caption"
                  tone="danger"
                  style={styles.errorStripCopy}
                >
                  {failureReason}
                </AppText>
              </View>
            ) : null}
          </View>

          <FooterStrip note={FAILED_COPY.refundNote} />
        </Surface>

        <Surface style={styles.section}>
          <View style={styles.card}>
            <SectionHeading title={FAILED_COPY.summaryTitle} />

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
            </View>

            <View style={styles.totalRow}>
              <AppText variant="labelStrong">Order total</AppText>
              <AppText variant="price">{amountLabel}</AppText>
            </View>
          </View>
        </Surface>

        <BulletCard title={FAILED_COPY.reasonsTitle} bullets={FAILED_REASONS} />

        <SupportCard
          title={FAILED_COPY.supportTitle}
          subtitle={FAILED_COPY.supportSubtitle}
        />

        <AppText variant="micro" tone="faint" style={styles.footerNote}>
          {FAILED_COPY.footerNote}
        </AppText>
      </ScrollView>

      <StatusActionBar
        primaryLabel={FAILED_COPY.retryCta}
        primaryIcon="refresh-cw"
        ghostLabel={FAILED_COPY.homeCta}
        onPrimary={handleRetryPayment}
        onGhost={handleBackToHome}
      />
    </View>
  );
};

export default OrderFailedScreen;

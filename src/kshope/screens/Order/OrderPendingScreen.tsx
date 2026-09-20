import React from 'react';
import { ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
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
import { PENDING_COPY, PENDING_STEPS } from './status/constants';
import {
  useBackToHome,
  useTrackOrder,
  useCopyOrderNumber,
  useLockedBack,
} from './status/useOrderStatus';
import { styles } from './status/styles';

const OrderPendingScreen: React.FC = () => {
  const route = useRoute<any>();
  const { orderId, orderNumber } = route.params || {};

  useLockedBack();

  const displayOrderNumber = orderNumber || orderId || '--';
  const handleCopyOrderNumber = useCopyOrderNumber(String(displayOrderNumber));
  const handleBackToHome = useBackToHome();

  const trackOrder = useTrackOrder();
  const handleCheckStatus = () => {
    trackOrder(orderId);
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
          title={PENDING_COPY.topBarTitle}
          subtitle={PENDING_COPY.topBarSubtitle}
          statusLabel={PENDING_COPY.statusLabel}
          onBack={handleBackToHome}
          tone="brand"
          pulse
        />
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.statusRow}>
              <StatusDisc tone="brand" icon="timer-sand" animated />
              <View style={styles.statusCopy}>
                <Text style={styles.statusTitle}>{PENDING_COPY.statusTitle}</Text>
                <Text style={styles.statusSubtitle}>
                  {PENDING_COPY.statusSubtitle}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.metaGroup}>
              <MetaRow label="Order number">
                <Text style={styles.orderNumberText}>#{displayOrderNumber}</Text>
                <CopyChip onPress={handleCopyOrderNumber} />
              </MetaRow>

              <MetaRow label="Payment">
                <Text style={styles.metaValueText}>
                  {PENDING_COPY.paymentLabel}
                </Text>
              </MetaRow>
            </View>
          </View>

          <FooterStrip note={PENDING_COPY.assuranceNote} />
        </View>

        <BulletCard
          title={PENDING_COPY.stepsTitle}
          bullets={PENDING_STEPS}
        />

        <SupportCard
          title={PENDING_COPY.supportTitle}
          subtitle={PENDING_COPY.supportSubtitle}
        />

        <Text style={styles.footerNote}>
          {PENDING_COPY.footerNote}
        </Text>
      </ScrollView>

      <StatusActionBar
        primaryLabel={PENDING_COPY.trackCta}
        primaryIcon="arrow-right"
        primaryIconTrailing
        ghostLabel={PENDING_COPY.homeCta}
        onPrimary={handleCheckStatus}
        onGhost={handleBackToHome}
      />
    </View>
  );
};

export default OrderPendingScreen;

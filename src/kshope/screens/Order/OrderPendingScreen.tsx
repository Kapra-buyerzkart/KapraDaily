import React from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppText from '../../components/atoms/AppText';
import Surface from '../../components/atoms/Surface';
import Divider from '../../components/atoms/Divider';
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
import { PENDING_COPY, PENDING_STEPS } from './status/constants';
import {
  useBackToHome,
  useCopyOrderNumber,
  useLockedBack,
} from './status/useOrderStatus';
import { styles } from './status/styles';

const OrderPendingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { orderId, orderNumber } = route.params || {};

  useLockedBack();

  const displayOrderNumber = orderNumber || orderId || '--';
  const handleCopyOrderNumber = useCopyOrderNumber(String(displayOrderNumber));
  const handleBackToHome = useBackToHome();

  const handleCheckStatus = () => {
    navigation.navigate('KshopeMyOrderDetails', { orderId });
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
          title={PENDING_COPY.topBarTitle}
          subtitle={PENDING_COPY.topBarSubtitle}
          statusLabel={PENDING_COPY.statusLabel}
          tone="brand"
          pulse
        />
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Surface style={styles.section}>
          <View style={styles.card}>
            <View style={styles.statusRow}>
              <StatusDisc tone="brand" icon="timer-sand" animated />
              <View style={styles.statusCopy}>
                <AppText variant="heading">{PENDING_COPY.statusTitle}</AppText>
                <AppText variant="caption" tone="muted">
                  {PENDING_COPY.statusSubtitle}
                </AppText>
              </View>
            </View>

            <Divider style={styles.rule} />

            <View style={styles.metaGroup}>
              <MetaRow label="Order number">
                <AppText variant="labelStrong">#{displayOrderNumber}</AppText>
                <CopyChip onPress={handleCopyOrderNumber} />
              </MetaRow>

              <MetaRow label="Payment">
                <AppText variant="labelStrong" tone="secondary">
                  {PENDING_COPY.paymentLabel}
                </AppText>
              </MetaRow>
            </View>
          </View>

          <FooterStrip note={PENDING_COPY.assuranceNote} />
        </Surface>

        <BulletCard
          title={PENDING_COPY.stepsTitle}
          bullets={PENDING_STEPS}
          right={
            <AppText variant="micro" tone="faint">
              {PENDING_STEPS.length} steps
            </AppText>
          }
        />

        <SupportCard
          title={PENDING_COPY.supportTitle}
          subtitle={PENDING_COPY.supportSubtitle}
        />

        <AppText variant="micro" tone="faint" style={styles.footerNote}>
          {PENDING_COPY.footerNote}
        </AppText>
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

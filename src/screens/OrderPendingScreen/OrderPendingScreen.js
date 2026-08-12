import React from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CartText from '@/screens/cart/components/atoms/CartText';
import { CART_COLORS } from '@/styles/cartTheme';
import PendingTopBar from './components/molecules/PendingTopBar';
import PaymentStatusCard from './components/molecules/PaymentStatusCard';
import NextStepsCard from './components/molecules/NextStepsCard';
import SupportCard from './components/molecules/SupportCard';
import PendingActionBar from './components/organisms/PendingActionBar';
import { PENDING_COPY, PENDING_STEPS } from './constants';
import { styles } from './styles';
import useOrderPendingScreen from './useOrderPendingScreen';

const OrderPendingScreen = () => {
  const {
    displayOrderNumber,
    handleCheckStatus,
    handleBackToHome,
    handleCopyOrderNumber,
  } = useOrderPendingScreen();

  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={CART_COLORS.card}
        translucent={false}
      />

      <SafeAreaView edges={['top']}>
        <PendingTopBar
          title={PENDING_COPY.topBarTitle}
          subtitle={PENDING_COPY.topBarSubtitle}
          statusLabel={PENDING_COPY.liveLabel}
        />
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <PaymentStatusCard
          title={PENDING_COPY.statusTitle}
          subtitle={PENDING_COPY.statusSubtitle}
          orderNumber={displayOrderNumber}
          paymentLabel={PENDING_COPY.paymentLabel}
          assuranceNote={PENDING_COPY.assuranceNote}
          onCopy={handleCopyOrderNumber}
        />

        <NextStepsCard title={PENDING_COPY.stepsTitle} steps={PENDING_STEPS} />

        <SupportCard
          title={PENDING_COPY.supportTitle}
          subtitle={PENDING_COPY.supportSubtitle}
        />

        <CartText variant="micro" tone="faint" style={styles.footerNote}>
          {PENDING_COPY.footerNote}
        </CartText>
      </ScrollView>

      <PendingActionBar onTrack={handleCheckStatus} onHome={handleBackToHome} />
    </View>
  );
};

export default OrderPendingScreen;

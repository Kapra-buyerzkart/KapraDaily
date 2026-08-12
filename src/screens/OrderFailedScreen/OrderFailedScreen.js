import React from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CartText from '@/screens/cart/components/atoms/CartText';
import { CART_COLORS } from '@/styles/cartTheme';
import FailedTopBar from './components/molecules/FailedTopBar';
import FailureStatusCard from './components/molecules/FailureStatusCard';
import OrderSummaryCard from './components/molecules/OrderSummaryCard';
import ReasonsCard from './components/molecules/ReasonsCard';
import SupportCard from './components/molecules/SupportCard';
import FailedActionBar from './components/organisms/FailedActionBar';
import { FAILED_COPY, FAILED_REASONS } from './constants';
import { styles } from './styles';
import useOrderFailedScreen from './useOrderFailedScreen';

const OrderFailedScreen = () => {
  const {
    displayOrderNumber,
    paymentLabel,
    itemsLabel,
    amountLabel,
    errorMessage,
    handleRetryPayment,
    handleBackToHome,
    handleCopyOrderNumber,
  } = useOrderFailedScreen();

  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={CART_COLORS.card}
        translucent={false}
      />

      <SafeAreaView edges={['top']}>
        <FailedTopBar
          title={FAILED_COPY.topBarTitle}
          subtitle={FAILED_COPY.topBarSubtitle}
          statusLabel={FAILED_COPY.statusLabel}
        />
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <FailureStatusCard
          title={FAILED_COPY.statusTitle}
          subtitle={FAILED_COPY.statusSubtitle}
          errorMessage={errorMessage}
          refundNote={FAILED_COPY.refundNote}
        />

        <OrderSummaryCard
          title={FAILED_COPY.summaryTitle}
          orderNumber={displayOrderNumber}
          paymentLabel={paymentLabel}
          itemsLabel={itemsLabel}
          amountLabel={amountLabel}
          onCopy={handleCopyOrderNumber}
        />

        <ReasonsCard
          title={FAILED_COPY.reasonsTitle}
          reasons={FAILED_REASONS}
        />

        <SupportCard
          title={FAILED_COPY.helpTitle}
          subtitle={FAILED_COPY.helpSubtitle}
        />

        <CartText variant="micro" tone="faint" style={styles.footerNote}>
          {FAILED_COPY.footerNote}
        </CartText>
      </ScrollView>

      <FailedActionBar
        retryLabel={FAILED_COPY.retryCta}
        homeLabel={FAILED_COPY.homeCta}
        onRetry={handleRetryPayment}
        onHome={handleBackToHome}
      />
    </View>
  );
};

export default OrderFailedScreen;

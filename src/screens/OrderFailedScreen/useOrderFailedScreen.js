import { useCallback, useEffect, useMemo } from 'react';
import { BackHandler } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';
import {
  useNavigation,
  useRoute,
  CommonActions,
} from '@react-navigation/native';
import { getPaymentMeta } from '@/screens/cart/paymentMeta';
import { resolveFailureMessage } from './failureMessage';

export const useOrderFailedScreen = () => {
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
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
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

  const displayOrderNumber = orderNumber || orderId || '--';
  const paymentLabel = useMemo(
    () => getPaymentMeta(paymentMethod || 'online').label,
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

  const handleRetryPayment = useCallback(() => {
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
  }, [navigation, orderId]);

  const handleBackToHome = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      }),
    );
  }, [navigation]);

  const handleCopyOrderNumber = useCallback(() => {
    if (displayOrderNumber === '--') {
      return;
    }
    Clipboard.setString(String(displayOrderNumber));
    Toast.show('Order number copied', Toast.SHORT);
  }, [displayOrderNumber]);

  return {
    displayOrderNumber,
    paymentLabel,
    itemsLabel,
    amountLabel,
    failureReason,
    handleRetryPayment,
    handleBackToHome,
    handleCopyOrderNumber,
  };
};

export default useOrderFailedScreen;

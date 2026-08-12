import { useCallback, useEffect } from 'react';
import { BackHandler } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';
import {
  useNavigation,
  useRoute,
  CommonActions,
} from '@react-navigation/native';

export const useOrderPendingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId, orderNumber } = route.params || {};

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

  const handleCheckStatus = useCallback(() => {
    navigation.navigate('OrderTrackingScreen', { orderId });
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
    handleCheckStatus,
    handleBackToHome,
    handleCopyOrderNumber,
  };
};

export default useOrderPendingScreen;

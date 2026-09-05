import { useCallback, useEffect } from 'react';
import { BackHandler } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';
import { useNavigation, CommonActions } from '@react-navigation/native';

export const useLockedBack = () => {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
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
};

export const useCopyOrderNumber = (orderNumber: string) =>
  useCallback(() => {
    if (!orderNumber || orderNumber === '--') {
      return;
    }
    Clipboard.setString(String(orderNumber));
    Toast.show('Order number copied', Toast.SHORT);
  }, [orderNumber]);

export const useBackToHome = () => {
  const navigation = useNavigation<any>();

  return useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'KshopeHome' }],
      }),
    );
  }, [navigation]);
};

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useEffect } from 'react';
import { NewAppScreen } from '@react-native/new-app-screen';
import { LogBox, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Navigation from './src/navigation';
import { OneSignal } from 'react-native-onesignal';
import { LoaderContextProvider } from './src/context/loaderContext';
import { AppContextProvider } from './src/context/appContext';
import { CartProvider } from './src/context/CartContext';
import { WishlistProvider } from './src/context/WishlistContext';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { navigationRef } from './src/api/NavigationService';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const linking: any = {
    prefixes: ['buyerzkart://', 'https://kapradaily.com'],
    config: {
      initialRouteName: 'MainTabs',
      screens: {
        SingleItemScreen: {
          path: 'product/:UrlKey',
        },
        SearchScreen: {
          path: 'products/:Keyword',
        },
        SingleOrderScreen: {
          path: 'account/orderdetails/:orderId',
        },
      },
    },
  };

  useEffect(() => {
    LogBox.ignoreLogs(['Warning: ...'])

    // OneSignal setup
    OneSignal.Debug.setLogLevel(6);
    OneSignal.initialize('266dbe6c-b4a8-458c-ba84-28f64cac2796');
    OneSignal.Notifications.requestPermission(true);

    // Notification opened handler 
    OneSignal.Notifications.addEventListener('click', (event: any) => {
      console.log('OneSignal: notification opened:', event);
    });

    return () => {
      OneSignal.Notifications.removeEventListener('click', () => { });
    };
  }, [])

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#000' : '#fff'} />
      <AppContextProvider>
        <CartProvider>
          <WishlistProvider>
            <LoaderContextProvider>
              <NavigationContainer ref={navigationRef} linking={linking}>
                <RootNavigator />
              </NavigationContainer>
            </LoaderContextProvider>
          </WishlistProvider>
        </CartProvider>
      </AppContextProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Navigation from './src/navigation';
import { OneSignal } from 'react-native-onesignal';
import { LoaderContextProvider } from './src/context/loaderContext';
import { AppContextProvider } from './src/context/appContext';
import { CartProvider } from './src/context/CartContext';
import { WishlistProvider } from './src/context/WishlistContext';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { navigationRef } from './src/api/NavigationService';
import ModalProvider from './src/components/modal/ModalProvider';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  // const linking = {
  //   prefixes: ['buyerzkart://', 'https://kapradaily.com'],
  //   config: {
  //     initialRouteName: 'MainTabs',
  //     screens: {
  //       SingleItemScreen: {
  //         path: 'product/:UrlKey', // ✅ valid string
  //         alias: ['SingleItemScreen/:UrlKey'], // ✅ optional aliases
  //         parse: {
  //           UrlKey: (key) => `${key}`,
  //         },
  //       },
  //       SearchScreen: {
  //         path: ['SearchScreen/:Keyword', 'products/:Keyword'],
  //         parse: {
  //           Keyword: (kw: string) => decodeURIComponent(kw),
  //         },
  //       },
  //       SingleOrderScreen: {
  //         path: ['SingleOrderScreen/:orderId', 'account/orderdetails/:orderId'],
  //         parse: {
  //           orderId: (id: string) => Number(id),
  //         },
  //       },
  //     },
  //   },
  // };

  useEffect(() => {
    LogBox.ignoreLogs(['Warning: ...'])

    // OneSignal initialization via structured service
    import('./src/services/OneSignalService').then(({ requestPushPermissionIfNeeded }) => {
      requestPushPermissionIfNeeded();
    });
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#000' : '#fff'} />
        <BottomSheetModalProvider>
          {/* Portal host for CustomModal — mounted once here so any modal
              opened anywhere in the tree renders above the whole app. */}
          <ModalProvider>
            <AppContextProvider>
              <CartProvider>
                <WishlistProvider>
                  <LoaderContextProvider>
                    <NavigationContainer ref={navigationRef}>
                      <RootNavigator />
                    </NavigationContainer>
                  </LoaderContextProvider>
                </WishlistProvider>
              </CartProvider>
            </AppContextProvider>
          </ModalProvider>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

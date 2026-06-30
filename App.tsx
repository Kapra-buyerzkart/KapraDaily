/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useEffect } from 'react';
import { NewAppScreen } from '@react-native/new-app-screen';
import {
  LogBox,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
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
import { QueryClientProvider } from '@tanstack/react-query';
import {
  persistQueryClientRestore,
  persistQueryClientSubscribe,
} from '@tanstack/react-query-persist-client';
import { queryClient, queryPersistOptions } from './src/queryClient';

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
    LogBox.ignoreLogs(['Warning: ...']);

    // OneSignal initialization via structured service
    import('./src/services/OneSignalService').then(
      ({ requestPushPermissionIfNeeded }) => {
        requestPushPermissionIfNeeded();
      },
    );
  }, []);

  // Restore the persisted ('home' namespace only) cache in the background.
  // Deliberately NOT using PersistQueryClientProvider here: it gates every
  // useQuery in the app — including ones that are never persisted (search,
  // categoryProducts, dashboard) — behind this AsyncStorage round-trip via
  // its isRestoring flag, which was delaying the first image fetch on every
  // screen just to wait on a cache those screens don't even read from.
  // hydrate() only applies persisted data when it's newer than what's
  // already in the cache, so racing it against in-flight network fetches is safe.
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    persistQueryClientRestore({ queryClient, ...queryPersistOptions }).finally(
      () => {
        unsubscribe = persistQueryClientSubscribe({
          queryClient,
          ...queryPersistOptions,
        });
      },
    );
    return () => unsubscribe?.();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={isDarkMode ? '#000' : '#fff'}
        />
        <BottomSheetModalProvider>
          <ModalProvider>
            <QueryClientProvider client={queryClient}>
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
            </QueryClientProvider>
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

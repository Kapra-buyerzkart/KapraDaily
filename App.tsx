/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useEffect } from 'react';
import './src/config/i18n';
import { NewAppScreen } from '@react-native/new-app-screen';
import {
  LogBox,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { LoaderContextProvider } from './src/context/loaderContext';
import { AppContextProvider } from './src/context/appContext';
import { CartProvider } from './src/context/CartContext';
import { WishlistProvider } from './src/context/WishlistContext';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { navigationRef } from './src/api/NavigationService';
import ModalProvider from './src/components/modal/ModalProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  persistQueryClientRestore,
  persistQueryClientSubscribe,
} from '@tanstack/react-query-persist-client';
import { queryClient, queryPersistOptions } from './src/queryClient';

// Dark fallback background for the navigator's root layer. Without this, the
// navigator uses React Navigation's DefaultTheme background (near-white), which
// flashes through any screen presented with a transparent contentStyle — e.g.
// ViewTicketScreen, which is transparent by design so TicketQRModal's black
// backdrop can fade in over the previous screen. Making the fallback black
// removes that white flash (and the same latent flash on the other dark,
// faded/transparent screens) without affecting opaque screens, which paint
// their own background over it.
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#000000',
  },
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    LogBox.ignoreLogs(['Warning: ...']);

    // OneSignal initialization via structured service
    import('./src/services/OneSignalService').then(
      ({ requestPushPermissionIfNeeded }) => {
        requestPushPermissionIfNeeded();
      },
    );
  }, []);

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
        <KeyboardProvider>
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
                        <NavigationContainer ref={navigationRef} theme={navTheme}>
                          <RootNavigator />
                        </NavigationContainer>
                      </LoaderContextProvider>
                    </WishlistProvider>
                  </CartProvider>
                </AppContextProvider>
              </QueryClientProvider>
            </ModalProvider>
          </BottomSheetModalProvider>
        </KeyboardProvider>
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

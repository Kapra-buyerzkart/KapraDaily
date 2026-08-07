import { useEffect } from 'react';
import './src/config/i18n';
import { Dimensions, LogBox, StatusBar, StyleSheet } from 'react-native';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
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
import { COLORS } from './src/styles/colors';

const window = Dimensions.get('window');
const initialMetrics = initialWindowMetrics ?? {
  frame: { x: 0, y: 0, width: window.width, height: window.height },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.white,
  },
};

function App() {
  useEffect(() => {
    LogBox.ignoreLogs(['Warning: ...']);

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
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider initialMetrics={initialMetrics}>
        <KeyboardProvider>
          <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
          <BottomSheetModalProvider>
            <ModalProvider>
              <QueryClientProvider client={queryClient}>
                <AppContextProvider>
                  <CartProvider>
                    <WishlistProvider>
                      <LoaderContextProvider>
                        <NavigationContainer
                          ref={navigationRef}
                          theme={navTheme}
                        >
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

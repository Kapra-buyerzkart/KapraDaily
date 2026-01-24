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
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';

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

    // OneSignal setup
    OneSignal.Debug.setLogLevel(6);
    OneSignal.initialize('d6148736-6459-4778-abec-95105ff68939');
    OneSignal.Notifications.requestPermission(true);

    // Foreground notification handler
    // OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
    //   event.getNotification();
    //   event.complete(event.getNotification());
    // });

    // Notification opened handler 
    // OneSignal.Notifications.addEventListener('opened', (event) => { 
    //   console.log('Notification opened:', event); 
    // });
    // return () => { 
    //   OneSignal.Notifications.removeEventListener('foregroundWillDisplay'); 
    //   OneSignal.Notifications.removeEventListener('opened'); 
    // };
  }, [])

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#000' : '#fff'} />
      <AppContextProvider>
        <LoaderContextProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </LoaderContextProvider>
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

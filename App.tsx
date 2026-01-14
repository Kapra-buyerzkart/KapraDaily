/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { LogBox, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Navigation from './src/navigation';
import { useEffect } from 'react';
import { OneSignal } from 'react-native-onesignal';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    LogBox.ignoreLogs(['Warning: ...'])
    OneSignal.Debug.setLogLevel(6);
    OneSignal.initialize('d6148736-6459-4778-abec-95105ff68939');
    OneSignal.Notifications.requestPermission(true);
  }, [])

  return (
    <Navigation />
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

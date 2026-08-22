import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ensureKshopeSession } from '../api/session';
import KshopeUnavailable from '../screens/KshopeUnavailable';

const Stack = createNativeStackNavigator();

const KshopePlaceholderHome: React.FC = () => <View style={styles.centered} />;

const KshopeRoot: React.FC = () => {
  const [sessionState, setSessionState] = useState<'checking' | 'ready' | 'unavailable'>('checking');

  useEffect(() => {
    let cancelled = false;
    ensureKshopeSession().then(ok => {
      if (!cancelled) setSessionState(ok ? 'ready' : 'unavailable');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (sessionState === 'checking') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (sessionState === 'unavailable') {
    return <KshopeUnavailable />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="KshopeHome" component={KshopePlaceholderHome} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
});

export default KshopeRoot;

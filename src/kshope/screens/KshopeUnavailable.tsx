import React, { useContext, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AppContext } from '../../context/appContext';

const KshopeUnavailable: React.FC = () => {
  const { logout } = useContext(AppContext) || {};
  const forcedRef = useRef(false);

  useEffect(() => {
    if (forcedRef.current) return;
    forcedRef.current = true;
    logout?.(true);
  }, [logout]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your session has expired</Text>
      <Text style={styles.body}>
        Please log in again to continue to 48hrs Deals.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => logout?.(true)}>
        <Text style={styles.buttonLabel}>Log in again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#FFFFFF' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
  body: { fontSize: 14, color: '#666666', textAlign: 'center', marginBottom: 24 },
  button: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, backgroundColor: '#00BCD4' },
  buttonLabel: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});

export default KshopeUnavailable;

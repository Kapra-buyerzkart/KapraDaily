import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const KshopeUnavailable: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>48hrs Deals is unavailable</Text>
      <Text style={styles.body}>
        We could not open your 48hrs Deals account right now. Please sign out and
        sign in again, or try later.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonLabel}>Go back</Text>
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

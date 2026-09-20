import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const LogoutRow = ({ onPress }) => (
  <View style={styles.container}>
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Log out"
    >
      <Feather name="log-out" size={18} color="#E53935" />
      <Text style={styles.label}>Log Out</Text>
      <Feather name="chevron-right" size={16} color="#E53935" />
    </TouchableOpacity>
  </View>
);

export default React.memo(LogoutRow);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 28,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    paddingHorizontal: 16,
  },
  label: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Lexend-SemiBold',
    fontSize: 14.5,
    color: '#E53935',
  },
});

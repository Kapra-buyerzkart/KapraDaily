import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { styles } from '../styles';

export default function LogoutButton({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.logoutButton}
      activeOpacity={0.7}
      accessibilityLabel="Log out"
    >
      <Text style={styles.logoutButtonText}>Log Out</Text>
    </TouchableOpacity>
  );
}

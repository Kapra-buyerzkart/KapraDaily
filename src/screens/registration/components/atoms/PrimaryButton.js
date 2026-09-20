import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import BallPulse from '../../../../components/BallPulse';

const PrimaryButton = ({ label, onPress, loading = false, style }) => (
  <TouchableOpacity
    activeOpacity={0.88}
    onPress={onPress}
    disabled={loading}
    accessibilityRole="button"
    accessibilityLabel={label}
    accessibilityState={{ busy: loading, disabled: loading }}
    style={[styles.button, style]}
  >
    {loading ? (
      <BallPulse size="large" color="#0A2A20" />
    ) : (
      <Text style={styles.buttonText}>{label}</Text>
    )}
  </TouchableOpacity>
);

export default React.memo(PrimaryButton);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0A2A20',
    width: '100%',
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    fontFamily: 'Lexend-Medium',
    fontSize: 14.5,
    color: '#0A2A20',
  },
});

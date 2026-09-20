import React from 'react';
import { View, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const CheckBox = ({ checked = false, size = 20 }) => (
  <View
    style={[
      styles.box,
      { width: size, height: size },
      checked ? styles.checked : styles.idle,
    ]}
  >
    {checked ? (
      <Feather name="check" size={size * 0.72} color="#FFFFFF" />
    ) : null}
  </View>
);

export default React.memo(CheckBox);

const styles = StyleSheet.create({
  box: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idle: {
    borderWidth: 1.5,
    borderColor: '#0A2A20',
    backgroundColor: '#FFFFFF',
  },
  checked: {
    backgroundColor: '#0A2A20',
  },
});

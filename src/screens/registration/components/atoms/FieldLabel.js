import React from 'react';
import { Text, StyleSheet } from 'react-native';

const FieldLabel = ({ children, required = false, style }) => (
  <Text style={[styles.label, style]}>
    {children}
    {required ? <Text style={styles.star}>{' *'}</Text> : null}
  </Text>
);

export default React.memo(FieldLabel);

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Lexend-Medium',
    fontSize: 12,
    color: '#12372A',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  star: {
    color: '#D93025',
  },
});

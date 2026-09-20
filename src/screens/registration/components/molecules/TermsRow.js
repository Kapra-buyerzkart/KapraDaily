import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CheckBox from '../atoms/CheckBox';

const TermsRow = ({ checked, onToggle, onPressTerms }) => (
  <View style={styles.row}>
    <TouchableOpacity
      onPress={onToggle}
      style={styles.toggle}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 8 }}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel="I have read and agree to the terms and conditions"
      accessibilityHint="Double tap to accept or decline the terms and conditions"
      activeOpacity={0.7}
    >
      <CheckBox checked={checked} />
      <Text style={styles.agreeText}>I have read and agree to</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={onPressTerms}
      style={styles.link}
      hitSlop={{ top: 12, bottom: 12, left: 8, right: 12 }}
      accessibilityRole="link"
      accessibilityLabel="Terms and conditions"
      activeOpacity={0.7}
    >
      <Text style={styles.linkText}>
        Terms and conditions
        <Text style={styles.star}>{' *'}</Text>
      </Text>
    </TouchableOpacity>
  </View>
);

export default React.memo(TermsRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  agreeText: {
    fontFamily: 'Lexend-Regular',
    fontSize: 13,
    color: '#333333',
  },
  link: {
    paddingVertical: 6,
  },
  linkText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: 13,
    color: '#165A42',
  },
  star: {
    color: '#D93025',
  },
});

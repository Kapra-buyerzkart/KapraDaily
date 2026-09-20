import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const PhoneEditChip = ({ phone, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={styles.phoneEditBox}
    accessibilityRole="button"
    accessibilityLabel={`Registered mobile number +91 ${phone}. Change number`}
  >
    <Text style={styles.countryCode}>+91</Text>
    <View style={styles.phoneDivider} />
    <Text style={styles.phoneNumberText}>{phone}</Text>
    <Feather name="edit-2" size={16} color="#0A2A20" />
  </TouchableOpacity>
);

export default React.memo(PhoneEditChip);

const styles = StyleSheet.create({
  phoneEditBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#0A2A20',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  countryCode: {
    fontFamily: 'Lexend-Medium',
    fontSize: 14.5,
    color: '#000000',
  },
  phoneDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#0A2A20',
    marginHorizontal: 12,
  },
  phoneNumberText: {
    flex: 1,
    fontFamily: 'Lexend-Medium',
    fontSize: 14.5,
    color: '#000000',
  },
});

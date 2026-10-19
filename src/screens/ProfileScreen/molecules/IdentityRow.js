import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONTS } from '@/styles/typography';

const formatPhone = phone => {
  if (!phone) return '';
  const clean = String(phone).replace(/\D/g, '');
  if (clean.length === 10) {
    return `+91 ${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}`;
  }
  if (clean.length === 12 && clean.startsWith('91')) {
    const num = clean.slice(2);
    return `+91 ${num.slice(0, 4)} ${num.slice(4, 7)} ${num.slice(7)}`;
  }
  return String(phone);
};

const IdentityRow = ({ profile, onEditProfile }) => (
  <View style={styles.row}>
    <View style={styles.avatarBorder}>
      <MaterialCommunityIcons name="account" size={30} color="#F25000" />
    </View>

    <View style={styles.copy}>
      <Text style={styles.name} numberOfLines={1}>
        {profile?.custName || 'User'}
      </Text>
      <Text style={styles.phone} numberOfLines={1}>
        {formatPhone(profile?.phoneNo)}
      </Text>
    </View>

    <TouchableOpacity
      onPress={onEditProfile}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      accessibilityRole="button"
      accessibilityLabel="Edit profile"
    >
      <Text style={styles.editText}>Edit</Text>
    </TouchableOpacity>
  </View>
);

export default React.memo(IdentityRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  avatarBorder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#F25000',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  copy: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 18,
    fontFamily: FONTS.gilroy.bold,
    color: '#F25000',
  },
  phone: {
    fontSize: 12.5,
    fontFamily: FONTS.gilroy.medium,
    color: '#777777',
    marginTop: 2,
  },
  editText: {
    fontSize: 13.5,
    fontFamily: FONTS.gilroy.medium,
    color: '#F25000',
  },
});

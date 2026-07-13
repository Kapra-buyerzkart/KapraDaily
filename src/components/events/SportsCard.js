import React from 'react';
import { Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SportsCard = ({ icon, label, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    style={styles.chip}
    onPress={onPress}
    disabled={!onPress}
  >
    {!!icon && <Image source={icon} style={styles.icon} resizeMode="contain" />}
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 10,
  },
  icon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  label: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontFamily: 'Gilroy-Medium',
  },
});

export default SportsCard;

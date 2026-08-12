import { View } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ACCENT, INK } from '@/styles/homeTheme';
import { ICON, styles } from '../../styles';

const ICON_BY_TYPE = {
  home: 'home',
  work: 'briefcase',
  office: 'briefcase',
  hotel: 'bed',
  other: 'location',
};

export const iconForType = type =>
  ICON_BY_TYPE[String(type || '').toLowerCase()] || ICON_BY_TYPE.other;

export default function AddressTypeAvatar({ type, active }) {
  return (
    <View style={[styles.avatarWell, active && styles.avatarWellActive]}>
      <Ionicons
        name={iconForType(type)}
        size={ICON.avatar}
        color={active ? ACCENT.successText : INK.base}
      />
    </View>
  );
}

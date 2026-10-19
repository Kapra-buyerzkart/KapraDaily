import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONTS } from '@/styles/typography';

const QuickActionTile = ({ iconName, label, a11y, onPress }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={onPress}
    activeOpacity={0.75}
    accessibilityRole="button"
    accessibilityLabel={a11y}
  >
    <MaterialCommunityIcons name={iconName} size={26} color="#F25000" />
    <Text style={styles.label} numberOfLines={2}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default React.memo(QuickActionTile);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 84,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECECEC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: FONTS.gilroy.medium,
    color: '#333333',
    textAlign: 'center',
    marginTop: 6,
    includeFontPadding: false,
  },
});

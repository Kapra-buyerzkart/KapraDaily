import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AddrText } from '../atoms';
import { ADDRESS_TYPES } from '../../constants';
import { COLORS, HAIRLINE, RADIUS, SPACING, hp, wp } from '../../theme';

const AddressTypeSelector = ({ selected, onChange }) => (
  <View style={styles.row}>
    {ADDRESS_TYPES.map(({ key, label, icon }) => {
      const isActive = selected === key;
      return (
        <TouchableOpacity
          key={key}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityState={{ selected: isActive }}
          accessibilityLabel={`Save as ${label}`}
          onPress={() => onChange(key)}
          style={[styles.chip, isActive && styles.chipActive]}
        >
          <Image
            source={icon}
            style={[styles.icon, isActive && styles.iconActive]}
          />
          <AddrText
            variant={isActive ? 'labelStrong' : 'label'}
            tone={isActive ? 'primary' : 'muted'}
            numberOfLines={1}
            style={styles.label}
          >
            {label}
          </AddrText>
        </TouchableOpacity>
      );
    })}
  </View>
);

export default React.memo(AddressTypeSelector);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp('5%'),
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.button,
    borderWidth: HAIRLINE,
    borderColor: COLORS.line,
    backgroundColor: COLORS.well,
  },
  chipActive: {
    borderWidth: 1,
    borderColor: COLORS.lineStrong,
    backgroundColor: COLORS.selectedTint,
  },
  icon: {
    width: wp('4%'),
    height: wp('4%'),
    resizeMode: 'contain',
    tintColor: COLORS.textFaint,
  },
  iconActive: {
    tintColor: COLORS.textPrimary,
  },
  label: {
    marginLeft: SPACING.xs,
  },
});

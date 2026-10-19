import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONTS } from '@/styles/typography';

const MenuRow = ({
  label,
  icon,
  badge,
  tone = 'neutral',
  textColor,
  onPress,
}) => {
  const isDanger =
    tone === 'danger' ||
    textColor === '#FF3B30' ||
    textColor === '#E53935' ||
    textColor === '#D32F2F';
  const labelColor = isDanger ? '#FF3B30' : '#222222';
  const chevronColor = isDanger ? '#FF3B30' : '#CCCCCC';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.row}
      activeOpacity={0.6}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.left}>
        {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
        <Text style={[styles.label, { color: labelColor }]} numberOfLines={1}>
          {label}
        </Text>
      </View>

      <View style={styles.right}>
        {badge || null}
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={chevronColor}
        />
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(MenuRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12.5,
    backgroundColor: '#FFFFFF',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrap: {
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  label: {
    fontSize: 14.5,
    fontFamily: FONTS.gilroy.regular,
    includeFontPadding: false,
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});


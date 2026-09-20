import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const MenuRow = ({
  label,
  icon,
  tone = 'neutral',
  textColor,
  onPress,
}) => {
  const isDanger = tone === 'danger';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.row}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View
        style={[
          styles.iconBadge,
          isDanger ? styles.iconBadgeDanger : styles.iconBadgeDefault,
        ]}
      >
        {icon}
      </View>

      <Text
        style={[
          styles.label,
          isDanger ? styles.labelDanger : styles.labelDefault,
          textColor ? { color: textColor } : null,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>

      <Feather
        name="chevron-right"
        size={16}
        color={isDanger ? '#E53935' : '#C4C4C4'}
      />
    </TouchableOpacity>
  );
};

export default React.memo(MenuRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 54,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeDefault: {
    backgroundColor: '#FAF5EE',
  },
  iconBadgeDanger: {
    backgroundColor: '#FEF2F2',
  },
  label: {
    flex: 1,
    marginLeft: 14,
    fontSize: 14,
    fontFamily: 'Lexend-Medium',
  },
  labelDefault: {
    color: '#262626',
  },
  labelDanger: {
    color: '#E53935',
  },
});

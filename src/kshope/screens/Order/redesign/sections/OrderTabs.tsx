import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HOME_FONTS } from '../../../Home/redesign/theme';
import type { OrderBucket } from '../data/selectors';
import { ORDER_COLORS, fs, s } from './theme';

export const ORDER_TABS: { key: OrderBucket; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

type Props = {
  value: OrderBucket;
  onChange: (next: OrderBucket) => void;
};

const OrderTabs: React.FC<Props> = ({ value, onChange }) => (
  <View style={styles.wrap}>
    {ORDER_TABS.map(tab => {
      const active = tab.key === value;
      return (
        <TouchableOpacity
          key={tab.key}
          testID={`order-tab-${tab.key}`}
          accessibilityRole="tab"
          accessibilityState={{ selected: active }}
          activeOpacity={0.8}
          onPress={() => onChange(tab.key)}
          style={styles.tab}
        >
          <Text style={[styles.label, active ? styles.labelActive : null]}>
            {tab.label}
          </Text>
          <View
            style={[styles.underline, active ? styles.underlineActive : null]}
          />
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    paddingHorizontal: s(16),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: ORDER_COLORS.hairline,
  },
  tab: { flex: 1, alignItems: 'center' },
  label: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(14),
    color: ORDER_COLORS.inkMuted,
    paddingBottom: s(8),
  },
  labelActive: {
    fontFamily: HOME_FONTS.semiBold,
    color: ORDER_COLORS.ink,
  },
  underline: {
    height: s(3),
    width: s(52),
    borderRadius: s(3),
    backgroundColor: 'transparent',
  },
  underlineActive: { backgroundColor: ORDER_COLORS.accent },
});

export default OrderTabs;

import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Fonts } from '../../../../theme/fonts';
import { pt } from '../../../../theme/tokens';
import type { OrderBucket } from '../data/selectors';
import { ORDER_COLORS } from './theme';

export const ORDER_TABS: { key: OrderBucket; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

type Props = {
  value: OrderBucket;
  onChange: (next: OrderBucket) => void;
};

const OrderTabs: React.FC<Props> = ({ value, onChange }) => (
  <View style={styles.container}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
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
            style={[styles.pill, active ? styles.pillActive : styles.pillInactive]}
          >
            <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: ORDER_COLORS.darkGreen,
  },
  pillInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  label: {
    fontFamily: Fonts.lexend.medium,
    fontSize: pt(12),
    lineHeight: pt(16),
  },
  labelActive: {
    color: '#FFFFFF',
  },
  labelInactive: {
    color: '#333333',
  },
});

export default OrderTabs;

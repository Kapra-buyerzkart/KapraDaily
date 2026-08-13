import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import FilterChip from '../atoms/FilterChip';
import { GUTTER, SPACING } from '../theme';

const OrdersFilterBar = ({ filters, active, onSelect }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.content}
    style={styles.bar}
  >
    {filters.map(filter => (
      <FilterChip
        key={filter.key}
        label={filter.label}
        count={filter.count}
        selected={filter.key === active}
        onPress={() => onSelect(filter.key)}
      />
    ))}
  </ScrollView>
);

export default React.memo(OrdersFilterBar);

const styles = StyleSheet.create({
  bar: {
    flexGrow: 0,
  },
  content: {
    paddingHorizontal: GUTTER,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    paddingRight: GUTTER + SPACING.sm,
  },
});

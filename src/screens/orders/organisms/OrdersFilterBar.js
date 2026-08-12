import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SPACE, GUTTER } from '@/styles/homeTheme';
import FilterChip from '../atoms/FilterChip';

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

const styles = StyleSheet.create({
  bar: {
    flexGrow: 0,
  },
  content: {
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.md,
    paddingBottom: SPACE.md,
    paddingRight: GUTTER + SPACE.sm,
  },
});

export default React.memo(OrdersFilterBar);

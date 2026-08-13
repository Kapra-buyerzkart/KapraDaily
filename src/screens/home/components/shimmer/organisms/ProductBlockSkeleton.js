import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HeadingBones } from '../molecules';
import { SPACING } from '../tokens';
import ProductRailSkeleton from './ProductRailSkeleton';

const ProductBlockSkeleton = ({ action = true, subtitle = false }) => (
  <View style={styles.section}>
    <HeadingBones action={action} subtitle={subtitle} />
    <ProductRailSkeleton />
  </View>
);

export default React.memo(ProductBlockSkeleton);

const styles = StyleSheet.create({
  section: {
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.sm,
  },
});

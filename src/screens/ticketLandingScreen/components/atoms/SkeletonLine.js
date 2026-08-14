import React from 'react';
import { StyleSheet } from 'react-native';
import Shimmer from '@/components/events/Shimmer';

const SkeletonLine = ({ style }) => <Shimmer style={[styles.line, style]} />;

const styles = StyleSheet.create({
  line: {
    borderRadius: 8,
  },
});

export default React.memo(SkeletonLine);

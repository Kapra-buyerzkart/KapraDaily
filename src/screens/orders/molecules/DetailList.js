import React from 'react';
import { View, StyleSheet } from 'react-native';
import OrderText from '../atoms/OrderText';
import Divider from '../atoms/Divider';
import { SPACING } from '../theme';

const DetailList = ({ rows = [] }) => {
  const visible = rows.filter(row => row && row.value);

  return (
    <View>
      {visible.map((row, index) => (
        <View key={row.label}>
          {index > 0 && <Divider />}
          <View style={styles.row}>
            <OrderText variant="label" tone="muted" style={styles.label}>
              {row.label}
            </OrderText>
            <OrderText
              variant="labelStrong"
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.value}
            >
              {row.value}
            </OrderText>
          </View>
        </View>
      ))}
    </View>
  );
};

export default React.memo(DetailList);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  label: {
    flexShrink: 0,
  },
  value: {
    flex: 1,
    textAlign: 'right',
  },
});

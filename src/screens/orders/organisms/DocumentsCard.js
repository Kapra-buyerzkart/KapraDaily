import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AnimatedPressable from '@/components/AnimatedPressable';
import OrderText from '../atoms/OrderText';
import Surface from '../atoms/Surface';
import Divider from '../atoms/Divider';
import IconDisc from '../atoms/IconDisc';
import { COLORS, RADIUS, SPACING, TOUCH_MIN, wp } from '../theme';

const DISC = wp('9%');

const DocumentsCard = ({ rows = [] }) => {
  const visible = rows.filter(Boolean);
  if (!visible.length) return null;

  return (
    <Surface style={styles.card}>
      {visible.map((row, index) => (
        <View key={row.label}>
          {index > 0 && <Divider inset={SPACING.lg} />}
          <AnimatedPressable
            style={styles.row}
            onPress={row.onPress}
            accessibilityRole="button"
            accessibilityLabel={row.label}
          >
            <IconDisc
              size={DISC}
              tone={row.tone || 'neutral'}
              radius={RADIUS.sm}
            >
              <Ionicons
                name={row.icon}
                size={DISC * 0.5}
                color={COLORS.textSecondary}
              />
            </IconDisc>

            <View style={styles.copy}>
              <OrderText variant="labelStrong">{row.label}</OrderText>
              {!!row.caption && (
                <OrderText variant="micro" tone="muted" style={styles.caption}>
                  {row.caption}
                </OrderText>
              )}
            </View>

            <Ionicons
              name="chevron-forward"
              size={wp('4.4%')}
              color={COLORS.textFaint}
            />
          </AnimatedPressable>
        </View>
      ))}
    </Surface>
  );
};

export default React.memo(DocumentsCard);

const styles = StyleSheet.create({
  card: {
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: TOUCH_MIN + 6,
    paddingHorizontal: SPACING.lg,
  },
  copy: {
    flex: 1,
    marginHorizontal: SPACING.md,
  },
  caption: {
    marginTop: 2,
  },
});

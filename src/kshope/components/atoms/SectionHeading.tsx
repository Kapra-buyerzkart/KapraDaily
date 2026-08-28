import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import AppText from './AppText';
import { UI_SPACING } from '../../theme/tokens';

export interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  icon,
  right,
  style,
}) => (
  <View style={[styles.row, style]}>
    {icon}
    <View style={styles.copy}>
      <AppText variant="heading">{title}</AppText>
      {subtitle ? (
        <AppText variant="caption" tone="muted" style={styles.subtitle}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
    {right}
  </View>
);

export default React.memo(SectionHeading);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.sm,
  },
  copy: {
    flex: 1,
  },
  subtitle: {
    marginTop: 2,
  },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import AnimatedPressable from '@/components/AnimatedPressable';
import { CART_SPACING } from '@/styles/cartTheme';
import { EyebrowRule, SeeAllPill, ShowcaseText } from '../atoms';
import { DEFAULTS } from '../tokens';

const ShowcaseHeader = ({ eyebrow, title, subtitle, ctaLabel, onPress }) => (
  <View style={styles.header}>
    <View style={styles.copy}>
      <EyebrowRule label={eyebrow} style={styles.eyebrow} />

      <ShowcaseText variant="title" numberOfLines={2} style={styles.title}>
        {title}
      </ShowcaseText>

      {subtitle ? (
        <ShowcaseText variant="caption" tone="muted" numberOfLines={2}>
          {subtitle}
        </ShowcaseText>
      ) : null}
    </View>

    <AnimatedPressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${ctaLabel} ${title || DEFAULTS.title}`}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <SeeAllPill label={ctaLabel} />
    </AnimatedPressable>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copy: {
    flex: 1,
    paddingRight: CART_SPACING.md,
  },
  eyebrow: {
    marginBottom: CART_SPACING.sm,
  },
  title: {
    letterSpacing: -0.5,
    marginBottom: 2,
  },
});

export default React.memo(ShowcaseHeader);

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AnimatedPressable from '../../../../../components/AnimatedPressable';
import { SPACE, TYPE, INK, MAX_FONT_SCALE } from '@/styles/homeTheme';
import { FONTS } from '../../../../../styles/typography';
import EyebrowBadge from '../atoms/EyebrowBadge';
import CtaPill from '../atoms/CtaPill';
import { DEFAULTS } from '../tokens';

const ShowcaseHeader = ({ eyebrow, title, subtitle, ctaLabel, onPress }) => (
  <View style={styles.header}>
    <View style={styles.text}>
      <EyebrowBadge label={eyebrow} style={styles.badge} />

      <Text
        style={styles.title}
        numberOfLines={2}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        {title}
      </Text>
      <Text
        style={styles.subtitle}
        numberOfLines={2}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        {subtitle}
      </Text>
    </View>

    <AnimatedPressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${ctaLabel} ${title || DEFAULTS.title}`}
    >
      {/* <CtaPill label={ctaLabel} /> */}
    </AnimatedPressable>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    paddingRight: SPACE.md,
  },
  badge: {
    marginBottom: SPACE.sm,
  },
  title: {
    ...TYPE.title,
    fontFamily: FONTS.gilroy.heavy,
    color: INK.strong,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  subtitle: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.medium,
    color: INK.muted,
  },
});

export default React.memo(ShowcaseHeader);

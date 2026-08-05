import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FONTS } from '../../../styles/typography';
import {
  INK,
  ACCENT,
  RADIUS,
  GUTTER,
  SPACE,
  TYPE,
  MAX_FONT_SCALE,
  hitSlopTo,
} from '@/styles/homeTheme';

const ACTION_HIT_SLOP = hitSlopTo(28);

/**
 * Every prop but the text is optional — a header can be a bare title. Spelled
 * out here rather than left to inference so the TypeScript screens that use it
 * don't have to pass eight undefineds to satisfy a destructure.
 *
 * @param {object} props
 * @param {string} [props.eyebrow]
 * @param {string} [props.title]
 * @param {string} [props.titleAccent]
 * @param {string} [props.subtitle]
 * @param {string} [props.actionLabel]
 * @param {() => void} [props.onAction]
 * @param {import('react-native').StyleProp<import('react-native').ViewStyle>} [props.style]
 * @param {import('react-native').StyleProp<import('react-native').TextStyle>} [props.titleStyle]
 * @param {boolean} [props.onDark]
 */
const SectionHeader = ({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  actionLabel = 'View all',
  onAction,
  style,
  titleStyle,
  onDark = false,
}) => {
  if (!title && !eyebrow) return null;

  return (
    <View style={[styles.row, style]}>
      <View style={styles.textColumn}>
        {!!eyebrow && (
          <Text
            style={[styles.eyebrow, onDark && styles.eyebrowOnDark]}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {eyebrow}
          </Text>
        )}
        {!!title && (
          <Text
            style={[styles.title, titleStyle]}
            numberOfLines={1}
            accessibilityRole="header"
          >
            {title}
            {!!titleAccent && (
              <Text
                style={[styles.titleAccent, onDark && styles.titleAccentOnDark]}
              >
                {` ${titleAccent}`}
              </Text>
            )}
          </Text>
        )}
        {!!subtitle && (
          <Text
            style={[styles.subtitle, onDark && styles.subtitleOnDark]}
            numberOfLines={1}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {!!onAction && (
        <TouchableOpacity
          onPress={onAction}
          hitSlop={ACTION_HIT_SLOP}
          activeOpacity={0.75}
          style={styles.actionPill}
          accessibilityRole="button"
          accessibilityLabel={`${actionLabel}${title ? ` in ${title}` : ''}`}
        >
          <Text
            style={styles.actionText}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {actionLabel}
          </Text>
          <MaterialIcons
            name="arrow-forward-ios"
            size={wp('2.7%')}
            color={'black'}
            style={styles.actionChevron}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.base,
    paddingBottom: SPACE.md,
  },
  textColumn: {
    flex: 1,
    paddingRight: SPACE.md,
  },
  eyebrow: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.semiBold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: ACCENT.primary,
    marginBottom: 2,
  },
  eyebrowOnDark: {
    color: '#FFD9C7',
  },
  title: {
    ...TYPE.title,
    fontFamily: FONTS.gilroy.bold,
    // The script accent is set larger than the title beside it, so the line box
    // is sized for the accent rather than for Gilroy — otherwise the loops and
    // descenders clip under the single-line clamp.
    lineHeight: Math.round(TYPE.title.fontSize * 1.5),
    color: INK.strong,
    letterSpacing: -0.3,
  },
  // Script faces carry a much smaller x-height than Gilroy, so the accent runs
  // a few points larger just to look the same size as the word before it.
  titleAccent: {
    fontSize: Math.round(TYPE.title.fontSize * 1.25),
    fontFamily: FONTS.script.regular,
    color: ACCENT.primary,
    letterSpacing: 0,
  },
  titleAccentOnDark: {
    color: '#FFD9C7',
  },
  titleOnDark: {
    color: INK.onDark,
  },
  subtitle: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
    marginTop: 2,
  },
  subtitleOnDark: {
    color: 'rgba(255,255,255,0.78)',
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.pill,
    paddingVertical: SPACE.sm,
    paddingHorizontal: SPACE.md,
    // Aligns the CTA's text with the gutter the section's content sits on,
    // cancelling the pill's own right padding.
    marginRight: -SPACE.md,
  },
  actionText: {
    fontFamily: FONTS.gilroy.semiBold,
    color: 'black',
  },
  actionChevron: {
    marginLeft: SPACE.xs + 1,
  },
});

export default React.memo(SectionHeader);

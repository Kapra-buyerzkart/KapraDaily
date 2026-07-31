import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FONTS } from '../../../styles/typography';
import { INK, ACCENT, RADIUS, GUTTER } from '../homeTheme';

// One header shape for every home section: an optional eyebrow, a bold title,
// an optional one-line subtitle, and a pill CTA on the right. Previously each
// section rolled its own row (different font sizes, different "View All" vs
// "See All" treatments), which is what made the screen read as several apps
// stitched together.
const SectionHeader = ({
  eyebrow,
  title,
  // A trailing word set in the logo's script face, the way "Deal" runs across
  // "UDEN" in the lockup. Optional and deliberately short — it carries the
  // brand nod so the title itself can stay in Gilroy and stay legible. Left
  // unset for server-driven titles, whose length we do not control.
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
          <Text style={[styles.eyebrow, onDark && styles.eyebrowOnDark]}>
            {eyebrow}
          </Text>
        )}
        {!!title && (
          <Text
            style={[styles.title, onDark && styles.titleOnDark, titleStyle]}
            numberOfLines={1}
          >
            {title}
            {!!titleAccent && (
              <Text
                style={[
                  styles.titleAccent,
                  onDark && styles.titleAccentOnDark,
                ]}
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
          >
            {subtitle}
          </Text>
        )}
      </View>

      {!!onAction && (
        <TouchableOpacity
          onPress={onAction}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.75}
          style={styles.actionPill}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
          <MaterialIcons
            name="arrow-forward-ios"
            size={wp('2.7%')}
            color={ACCENT.primary}
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
    paddingTop: hp('2%'),
    paddingBottom: hp('1.2%'),
  },
  textColumn: {
    flex: 1,
    paddingRight: wp('3%'),
  },
  eyebrow: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('2.9%'),
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: ACCENT.primary,
    marginBottom: hp('0.3%'),
  },
  eyebrowOnDark: {
    color: '#FFD9C7',
  },
  title: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.8%'),
    // The script accent is set larger than the title it sits beside, so the
    // line box has to be sized for the accent rather than for Gilroy — without
    // this the loops and descenders clip under the single-line clamp.
    lineHeight: wp('7.2%'),
    color: INK.strong,
    letterSpacing: -0.3,
  },
  // Script faces carry a much smaller x-height than Gilroy, so the accent needs
  // to run a few points larger just to look the same size as the word before
  // it. Colour separates it further, and the negative tracking of the title is
  // dropped here — kerning a script tight only collides the letters.
  titleAccent: {
    fontFamily: FONTS.script.regular,
    fontSize: wp('6%'),
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
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.1%'),
    color: INK.muted,
    marginTop: hp('0.3%'),
  },
  subtitleOnDark: {
    color: 'rgba(255,255,255,0.78)',
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACCENT.primarySoft,
    borderRadius: RADIUS.pill,
    paddingVertical: hp('0.7%'),
    paddingHorizontal: wp('3.2%'),
  },
  actionText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.1%'),
    color: ACCENT.primary,
  },
  actionChevron: {
    marginLeft: wp('1.4%'),
  },
});

export default React.memo(SectionHeader);

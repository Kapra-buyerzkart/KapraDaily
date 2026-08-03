import React from 'react';
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  Platform,
} from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AnimatedPressable from '../../../components/AnimatedPressable';
import { RADIUS } from '@/styles/homeTheme';

// The hero block at the top of the scroll: a full-bleed background image, an
// announcement strip laid over it, and a row of tappable cards hanging off its
// lower edge.
//
// The composition is anchored to the background artwork, so the percentages
// below are load-bearing — they describe where that image's own design elements
// sit, not app-level rhythm. They are named rather than folded into the spacing
// scale for exactly that reason.

// The background artwork is authored at this ratio; changing it decouples the
// overlays from the image.
const SHOWCASE_ASPECT = 0.8;

const ANNOUNCEMENT_TOP = '52.5%';
const ANNOUNCEMENT_WIDTH = '91%';
const ANNOUNCEMENT_ASPECT = 5;

// The card row deliberately overhangs the bottom of the background so the cards
// bridge this section and the one beneath it.
const CARD_ROW_OVERHANG = '-7%';
// A small platform nudge, kept from the original: the two OSes resolve the
// percentage offsets against slightly different rounding.
const CARD_TOP = Platform.OS === 'ios' ? '10%' : '7%';

// Cards overlap very slightly so their artwork edges meet.
const CARD_OVERLAP = Platform.OS === 'ios' ? -wp('0.5%') : -wp('1%');

// Up to five cards can be configured, but the row was laid out at a fixed
// wp('48%') each — so five cards spanned 240% of the screen and everything past
// the second was simply off-screen. Two cards keep their original width
// exactly; three or more share the row instead of overflowing it.
const MAX_CARDS = 5;
const CARD_WIDTH_PCT = 48;
const ROW_WIDTH_PCT = 96;

const TopShowcase = ({
  backgroundUri,
  announcementUri,
  sideBySide,
  onBannerPress,
}) => {
  if (!backgroundUri) return null;

  const cards = (sideBySide || []).slice(0, MAX_CARDS);
  const widthPct =
    cards.length > 0
      ? Math.min(CARD_WIDTH_PCT, ROW_WIDTH_PCT / cards.length)
      : 0;

  return (
    <ImageBackground
      source={backgroundUri}
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      {!!announcementUri && (
        <Image
          source={announcementUri}
          style={styles.announcement}
          resizeMode="cover"
          accessible={false}
        />
      )}

      {cards.length > 0 && (
        <View style={styles.cardRow}>
          {cards.map((banner, index) => (
            <AnimatedPressable
              key={banner.bannerId || index}
              style={[styles.card, { width: wp(`${widthPct}%`) }]}
              onPress={() => onBannerPress(banner)}
              accessibilityRole="button"
              accessibilityLabel={banner.title || `Featured offer ${index + 1}`}
            >
              <Image
                source={banner.uri}
                style={styles.cardImage}
                resizeMode="contain"
                accessible={false}
              />
            </AnimatedPressable>
          ))}
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: SHOWCASE_ASPECT,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  announcement: {
    width: ANNOUNCEMENT_WIDTH,
    aspectRatio: ANNOUNCEMENT_ASPECT,
    borderRadius: RADIUS.lg,
    top: ANNOUNCEMENT_TOP,
    position: 'absolute',
    alignSelf: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    bottom: CARD_ROW_OVERHANG,
    position: 'absolute',
    width: '100%',
  },
  card: {
    // Height follows width (the original wp('48%') × wp('52%') proportion), so
    // a narrower card in a row of four stays the same shape as a wide one in a
    // row of two instead of stretching.
    aspectRatio: 48 / 52,
    top: CARD_TOP,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    marginHorizontal: CARD_OVERLAP,
  },
  cardImage: {
    width: '100%',
    // The artwork carries its own lower whitespace; filling the card would
    // scale it up past the frame the background image expects.
    height: '65%',
  },
});

export default React.memo(TopShowcase);
export { SHOWCASE_ASPECT };

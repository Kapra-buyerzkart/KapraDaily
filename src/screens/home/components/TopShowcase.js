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

const SHOWCASE_ASPECT = 0.8;

const ANNOUNCEMENT_TOP = '52.5%';
const ANNOUNCEMENT_WIDTH = '91%';
const ANNOUNCEMENT_ASPECT = 5;

const CARD_ROW_OVERHANG = '-7%';
const CARD_TOP = Platform.OS === 'ios' ? '10%' : '7%';

const CARD_OVERLAP = Platform.OS === 'ios' ? -wp('0.5%') : -wp('1%');

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
    aspectRatio: 48 / 52,
    top: CARD_TOP,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    marginHorizontal: CARD_OVERLAP,
  },
  cardImage: {
    width: '100%',
    height: '65%',
  },
});

export default React.memo(TopShowcase);
export { SHOWCASE_ASPECT };

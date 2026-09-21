import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { KAPRA_ART } from '../kapraAssets';
import { HOME_FONTS, s, fs } from '../theme';
import KSHOPE_CONFIG from '../../../../globals/config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GUTTER = s(16);
const GAP = s(10);
const BANNER_WIDTH = SCREEN_WIDTH - GUTTER * 2;
const HALF_CARD_WIDTH = (BANNER_WIDTH - GAP) / 2;

/* ───────── 1. Hero Banner: Crafted for every chapter ───────── */

interface HeroBannerProps {
  banner?: any;
  onPress?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ banner, onPress }) => {
  const [imgFailed, setImgFailed] = React.useState(false);

  const rawImage = banner?.imageUrl || banner?.ImageUrl || banner?.image;
  const isGif =
    typeof rawImage === 'string' &&
    rawImage.toLowerCase().includes('.gif');
  const validCustomImage = isGif ? null : rawImage;
  const hasCustomImage = Boolean(validCustomImage) && !imgFailed;

  const imageSource = hasCustomImage
    ? typeof validCustomImage === 'string'
      ? {
          uri: validCustomImage.startsWith('http')
            ? validCustomImage
            : `${KSHOPE_CONFIG.image_base_url.replace(/\/$/, '')}/${validCustomImage.replace(
                /^\//,
                '',
              )}`,
        }
      : validCustomImage
    : KAPRA_ART.heroCraftedChapter;

  return (
    <TouchableOpacity
      style={styles.heroWrap}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <Image
        source={imageSource}
        style={styles.heroImage}
        resizeMode="cover"
        onError={() => setImgFailed(true)}
      />
      {!hasCustomImage && (
        <>
          <LinearGradient
            colors={[
              'rgba(8,43,34,0.92)',
              'rgba(8,43,34,0.45)',
              'rgba(8,43,34,0.05)',
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 0.75, y: 0.5 }}
            style={styles.heroGradient}
          />

          {/* Content overlay for Kapra branding */}
          <View style={styles.heroContent}>
            <Text style={styles.heroEyebrow}>
              JEWELLERY FOR A MORE MEANINGFUL YOU
            </Text>
            <Text style={styles.heroTitle}>
              Crafted <Text style={styles.heroTitleItalic}>for</Text> every chapter
            </Text>
            <Text style={styles.heroSubtitle}>
              Tradition. Today. Always Yours.
            </Text>

            <View style={styles.heroButton}>
              <Text style={styles.heroButtonText}>Explore Collection →</Text>
            </View>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
};

/* ───────── 2. Everyday Diamonds Banner ───────── */

interface EverydayDiamondsBannerProps {
  banner?: any;
  onPress?: () => void;
}

export const EverydayDiamondsBanner: React.FC<EverydayDiamondsBannerProps> = ({
  banner,
  onPress,
}) => {
  const [imgFailed, setImgFailed] = React.useState(false);

  const rawImage = banner?.imageUrl || banner?.ImageUrl || banner?.image;
  const isGif =
    typeof rawImage === 'string' && rawImage.toLowerCase().includes('.gif');
  const validImage = isGif || imgFailed ? null : rawImage;

  const imageSource = validImage
    ? typeof validImage === 'string'
      ? {
          uri: validImage.startsWith('http')
            ? validImage
            : `${KSHOPE_CONFIG.image_base_url.replace(/\/$/, '')}/${validImage.replace(/^\//, '')}`,
        }
      : validImage
    : KAPRA_ART.everydayDiamondsBanner;

  const title = (
    banner?.title ||
    banner?.Title ||
    'EVERYDAY\nDIAMONDS'
  ).toUpperCase();
  const subtitle =
    banner?.subTitle ||
    banner?.SubTitle ||
    banner?.subtitle ||
    'Subtle. Stylish. Uniquely You.';

  return (
    <TouchableOpacity
      style={styles.everydayWrap}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.everydayLeft}>
        <Text style={styles.everydayTitle} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.everydaySubtitle} numberOfLines={1}>
          {subtitle}
        </Text>
        <View style={styles.everydayButton}>
          <Text style={styles.everydayButtonText}>Explore Now →</Text>
        </View>
      </View>

      <View style={styles.everydayRight}>
        <Image
          source={imageSource}
          style={styles.everydayImage}
          resizeMode="cover"
          onError={() => setImgFailed(true)}
        />
        <View style={styles.everydayBadge}>
          <Text style={styles.everydayBadgeText}>
            SMALL SPARKLES{'\n'}BRIGHTER DAYS
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/* ───────── 3. Hanging Jhumka Feature Banner ───────── */

interface HangingJhumkaBannerProps {
  banner?: any;
  onPress?: () => void;
}

export const HangingJhumkaBanner: React.FC<HangingJhumkaBannerProps> = ({
  banner,
  onPress,
}) => {
  const [imgFailed, setImgFailed] = React.useState(false);

  const customImage = banner?.imageUrl || banner?.ImageUrl || banner?.image;
  const isGif =
    typeof customImage === 'string' &&
    customImage.toLowerCase().includes('.gif');
  const validImage = isGif || imgFailed ? null : customImage;

  const imageSource = validImage
    ? typeof validImage === 'string'
      ? {
          uri: validImage.startsWith('http')
            ? validImage
            : `${KSHOPE_CONFIG.image_base_url.replace(/\/$/, '')}/${validImage.replace(/^\//, '')}`,
        }
      : validImage
    : KAPRA_ART.hangingJhumkaBanner;

  return (
    <TouchableOpacity
      style={styles.jhumkaWrap}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <Image
        source={imageSource}
        style={styles.jhumkaImage}
        resizeMode="cover"
        onError={() => setImgFailed(true)}
      />
    </TouchableOpacity>
  );
};

/* ───────── 4. Side-by-Side Promo Tiles ───────── */

interface SideBySidePromosProps {
  leftBanner?: any;
  rightBanner?: any;
  onPressLeft?: () => void;
  onPressRight?: () => void;
}

export const SideBySidePromos: React.FC<SideBySidePromosProps> = ({
  leftBanner,
  rightBanner,
  onPressLeft,
  onPressRight,
}) => {
  const [leftFailed, setLeftFailed] = React.useState(false);
  const [rightFailed, setRightFailed] = React.useState(false);

  const leftRaw =
    leftBanner?.imageUrl || leftBanner?.ImageUrl || leftBanner?.image;
  const leftIsGif =
    typeof leftRaw === 'string' && leftRaw.toLowerCase().includes('.gif');
  const leftValid = leftIsGif || leftFailed ? null : leftRaw;
  const leftSource = leftValid
    ? typeof leftValid === 'string'
      ? {
          uri: leftValid.startsWith('http')
            ? leftValid
            : `${KSHOPE_CONFIG.image_base_url.replace(/\/$/, '')}/${leftValid.replace(/^\//, '')}`,
        }
      : leftValid
    : KAPRA_ART.promoDiamondDreams;

  const rightRaw =
    rightBanner?.imageUrl || rightBanner?.ImageUrl || rightBanner?.image;
  const rightIsGif =
    typeof rightRaw === 'string' && rightRaw.toLowerCase().includes('.gif');
  const rightValid = rightIsGif || rightFailed ? null : rightRaw;
  const rightSource = rightValid
    ? typeof rightValid === 'string'
      ? {
          uri: rightValid.startsWith('http')
            ? rightValid
            : `${KSHOPE_CONFIG.image_base_url.replace(/\/$/, '')}/${rightValid.replace(/^\//, '')}`,
        }
      : rightValid
    : KAPRA_ART.promoGoldEdit;

  const leftTitle =
    leftBanner?.title || leftBanner?.Title || 'Diamond\nDreams';
  const rightTitle =
    rightBanner?.title || rightBanner?.Title || 'The Gold\nEdit';

  return (
    <View style={styles.splitWrap}>
      {/* Left Tile: Diamond Dreams */}
      <TouchableOpacity
        style={[styles.splitCard, styles.splitCardEmerald]}
        activeOpacity={0.9}
        onPress={onPressLeft}
      >
        <Image
          source={leftSource}
          style={styles.splitCardBg}
          resizeMode="cover"
          onError={() => setLeftFailed(true)}
        />
        <LinearGradient
          colors={['rgba(8,43,34,0.92)', 'rgba(8,43,34,0.3)']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.splitCardBody}>
          <Text style={styles.splitTitleEmerald} numberOfLines={2}>
            {leftTitle}
          </Text>
          <Text style={styles.splitSubtitleEmerald}>
            For life's special{'\n'}milestones
          </Text>
          <Text style={styles.splitLinkEmerald}>
            Explore Diamond Jewellery →
          </Text>
        </View>
      </TouchableOpacity>

      {/* Right Tile: The Gold Edit */}
      <TouchableOpacity
        style={[styles.splitCard, styles.splitCardGold]}
        activeOpacity={0.9}
        onPress={onPressRight}
      >
        <Image
          source={rightSource}
          style={styles.splitCardBg}
          resizeMode="cover"
          onError={() => setRightFailed(true)}
        />
        <LinearGradient
          colors={['rgba(247,242,232,0.92)', 'rgba(247,242,232,0.35)']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.splitCardBody}>
          <Text style={styles.splitTitleGold} numberOfLines={2}>
            {rightTitle}
          </Text>
          <Text style={styles.splitSubtitleGold}>
            Classic. Contemporary.{'\n'}Always You.
          </Text>
          <Text style={styles.splitLinkGold}>
            Explore Gold Jewellery →
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  /* Hero Banner */
  heroWrap: {
    marginHorizontal: GUTTER,
    marginVertical: s(10),
    borderRadius: s(12),
    height: s(175),
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#082B22',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: s(16),
    width: '65%',
    justifyContent: 'center',
  },
  heroEyebrow: {
    fontSize: fs(7.2),
    fontFamily: HOME_FONTS.bold,
    color: '#D4AF37',
    letterSpacing: 1.5,
    marginBottom: s(4),
  },
  heroTitle: {
    fontSize: fs(21),
    fontFamily: HOME_FONTS.bold,
    color: '#FFFFFF',
    lineHeight: fs(25),
  },
  heroTitleItalic: {
    fontFamily: HOME_FONTS.italic,
    fontStyle: 'italic',
    color: '#F4EBD9',
  },
  heroSubtitle: {
    fontSize: fs(9),
    fontFamily: HOME_FONTS.regular,
    color: '#E5DFD7',
    marginTop: s(4),
    marginBottom: s(12),
  },
  heroButton: {
    backgroundColor: '#F3DFBF',
    paddingVertical: s(6),
    paddingHorizontal: s(12),
    borderRadius: s(4),
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    fontSize: fs(9.5),
    fontFamily: HOME_FONTS.bold,
    color: '#082B22',
  },

  /* Everyday Diamonds */
  everydayWrap: {
    marginHorizontal: GUTTER,
    marginVertical: s(12),
    borderRadius: s(12),
    height: s(120),
    backgroundColor: '#F7EFE1',
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EFE8DE',
  },
  everydayLeft: {
    flex: 1.2,
    paddingLeft: s(14),
    justifyContent: 'center',
  },
  everydayTitle: {
    fontSize: fs(17),
    fontFamily: HOME_FONTS.bold,
    color: '#1A1A1A',
    lineHeight: fs(20),
    letterSpacing: 0.5,
  },
  everydaySubtitle: {
    fontSize: fs(8.5),
    fontFamily: HOME_FONTS.regular,
    color: '#767676',
    marginTop: s(2),
    marginBottom: s(8),
  },
  everydayButton: {
    backgroundColor: '#0C382E',
    paddingVertical: s(5),
    paddingHorizontal: s(10),
    borderRadius: s(4),
    alignSelf: 'flex-start',
  },
  everydayButtonText: {
    fontSize: fs(8.5),
    fontFamily: HOME_FONTS.bold,
    color: '#FFFFFF',
  },
  everydayRight: {
    flex: 1.1,
    position: 'relative',
  },
  everydayImage: {
    width: '100%',
    height: '100%',
  },
  everydayBadge: {
    position: 'absolute',
    right: s(6),
    bottom: s(8),
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: s(3),
    paddingHorizontal: s(5),
    borderRadius: s(3),
  },
  everydayBadgeText: {
    fontSize: fs(6.5),
    fontFamily: HOME_FONTS.bold,
    color: '#FFFFFF',
    textAlign: 'right',
  },

  /* Hanging Jhumka Feature Banner */
  jhumkaWrap: {
    marginHorizontal: GUTTER,
    marginVertical: s(12),
    borderRadius: s(12),
    height: s(170),
    overflow: 'hidden',
    backgroundColor: '#082B22',
  },
  jhumkaImage: {
    width: '100%',
    height: '100%',
  },

  /* Side-by-Side Promos */
  splitWrap: {
    flexDirection: 'row',
    paddingHorizontal: GUTTER,
    marginVertical: s(12),
    gap: GAP,
  },
  splitCard: {
    width: HALF_CARD_WIDTH,
    height: s(140),
    borderRadius: s(10),
    overflow: 'hidden',
    position: 'relative',
    padding: s(12),
    justifyContent: 'flex-end',
  },
  splitCardEmerald: {
    backgroundColor: '#082B22',
  },
  splitCardGold: {
    backgroundColor: '#FAF5EC',
    borderWidth: 1,
    borderColor: '#EFE8DE',
  },
  splitCardBg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  splitCardBody: {
    position: 'relative',
    zIndex: 2,
  },
  splitTitleEmerald: {
    fontSize: fs(16),
    fontFamily: HOME_FONTS.bold,
    color: '#FFFFFF',
    lineHeight: fs(18),
  },
  splitSubtitleEmerald: {
    fontSize: fs(7.8),
    fontFamily: HOME_FONTS.regular,
    color: '#E0DDD7',
    marginVertical: s(4),
  },
  splitLinkEmerald: {
    fontSize: fs(7.5),
    fontFamily: HOME_FONTS.semiBold,
    color: '#F3DFBF',
  },
  splitTitleGold: {
    fontSize: fs(16),
    fontFamily: HOME_FONTS.bold,
    color: '#1A1A1A',
    lineHeight: fs(18),
  },
  splitSubtitleGold: {
    fontSize: fs(7.8),
    fontFamily: HOME_FONTS.regular,
    color: '#555555',
    marginVertical: s(4),
  },
  splitLinkGold: {
    fontSize: fs(7.5),
    fontFamily: HOME_FONTS.semiBold,
    color: '#0C382E',
  },
});

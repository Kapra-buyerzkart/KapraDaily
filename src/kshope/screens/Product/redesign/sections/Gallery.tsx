import React, { useRef, useState } from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HOME_FONTS, SCREEN_WIDTH, fs, s } from '../../../Home/redesign/theme';
import { BackIcon, HeartIcon, HeartSolidIcon } from '../icons';
import { HOME_ART } from '../../../Home/redesign/assets';
import { PDP_COLORS } from '../theme';

type Props = {
  images: any[];
  discountLabel: string;
  wishlisted: boolean;
  title: string;
  onBack: () => void;
  onToggleWishlist: () => void;
};

const HIT = { top: 12, bottom: 12, left: 12, right: 12 };

const hasSource = (source: any) =>
  !!source && (typeof source === 'number' || !!source.uri);

const GallerySlide: React.FC<{ source: any; height: number }> = ({
  source,
  height,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const usable = hasSource(source) && !failed;

  return (
    <View style={[styles.slide, { height }]}>
      {usable ? (
        <Image
          source={source}
          resizeMode="cover"
          style={styles.image}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : null}
      {usable && loaded ? null : (
        <View style={styles.placeholder}>
          <Image
            source={HOME_ART.noImage}
            resizeMode="contain"
            style={styles.placeholderImage}
          />
        </View>
      )}
    </View>
  );
};

const Thumbnail: React.FC<{
  source: any;
  active: boolean;
  onPress: () => void;
}> = ({ source, active, onPress }) => {
  const [failed, setFailed] = useState(false);
  const usable = hasSource(source) && !failed;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.thumb, active && styles.thumbActive]}
    >
      {usable ? (
        <Image
          source={source}
          resizeMode="cover"
          style={styles.thumbImage}
          onError={() => setFailed(true)}
        />
      ) : (
        <Image
          source={HOME_ART.noImage}
          resizeMode="contain"
          style={styles.thumbPlaceholder}
        />
      )}
    </TouchableOpacity>
  );
};

const Gallery: React.FC<Props> = ({
  images,
  discountLabel,
  wishlisted,
  title,
  onBack,
  onToggleWishlist,
}) => {
  const { top } = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const cardHeight = s(360) + top;
  const slides = images.length > 0 ? images : [null];

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const width = event.nativeEvent.layoutMeasurement.width || SCREEN_WIDTH;
    const next = Math.round(event.nativeEvent.contentOffset.x / width);
    if (next !== index && next >= 0 && next < slides.length) {
      setIndex(next);
    }
  };

  const scrollToIndex = (idx: number) => {
    scrollRef.current?.scrollTo({ x: idx * SCREEN_WIDTH, animated: true });
    setIndex(idx);
  };

  return (
    <View>
      {/* Header with back + title + wishlist */}
      <View style={[styles.headerBar, { paddingTop: top + s(8) }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={HIT}
          onPress={onBack}
          style={styles.backButton}
        >
          <BackIcon width={18} height={16} />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={HIT}
          onPress={onToggleWishlist}
          style={styles.wishlistButton}
        >
          {wishlisted ? (
            <HeartSolidIcon width={22} height={20} color={PDP_COLORS.orange} />
          ) : (
            <HeartIcon width={22} height={20} color={PDP_COLORS.black} />
          )}
        </TouchableOpacity>
      </View>

      {/* Image carousel */}
      <View style={[styles.card, { height: cardHeight }]}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={onScroll}
        >
          {slides.map((source: any, idx: number) => (
            <GallerySlide key={idx} source={source} height={cardHeight} />
          ))}
        </ScrollView>

        {/* <LinearGradient
          pointerEvents="none"
          colors={[
            'rgba(255, 255, 255, 0)',
            'rgba(255, 255, 255, 0.55)',
            PDP_COLORS.white,
          ]}
          locations={[0, 0.55, 1]}
          style={styles.fade}
        /> */}

        {/* Pagination dots */}
        {slides.length > 1 ? (
          <View style={styles.dotsRow}>
            {slides.map((_: any, idx: number) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  idx === index ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>
        ) : null}
      </View>

      {/* Thumbnail strip */}
      {slides.length > 1 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbRow}
        >
          {slides.map((source: any, idx: number) => (
            <Thumbnail
              key={idx}
              source={source}
              active={idx === index}
              onPress={() => scrollToIndex(idx)}
            />
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
};

const THUMB_SIZE = s(56);

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(16),
    paddingBottom: s(10),
    backgroundColor: PDP_COLORS.white,
  },
  backButton: {
    width: s(40),
    height: s(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(21),
    color: PDP_COLORS.darkGreen,
    textAlign: 'center',
    marginHorizontal: s(8),
    letterSpacing: 0.2,
  },
  wishlistButton: {
    width: s(38),
    height: s(38),
    borderRadius: s(19),
    backgroundColor: PDP_COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECEAE5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  card: {
    width: SCREEN_WIDTH,
    backgroundColor: PDP_COLORS.white,
    overflow: 'hidden',
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: s(50),
  },
  slide: {
    width: SCREEN_WIDTH,
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PDP_COLORS.white,
  },
  placeholderImage: {
    width: '55%',
    height: '55%',
  },
  image: {
    flex: 1,
    width: '100%',
  },
  dotsRow: {
    position: 'absolute',
    bottom: s(14),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    paddingHorizontal: s(10),
    paddingVertical: s(4),
    borderRadius: s(12),
    gap: s(6),
  },
  dot: {
    width: s(7),
    height: s(7),
    borderRadius: s(3.5),
  },
  dotActive: {
    backgroundColor: PDP_COLORS.darkGreen,
    width: s(8),
    height: s(8),
    borderRadius: s(4),
  },
  dotInactive: {
    backgroundColor: '#CCD1D9',
  },
  thumbRow: {
    paddingHorizontal: s(16),
    paddingTop: s(12),
    paddingBottom: s(8),
    gap: s(10),
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: s(6),
    borderWidth: 1.5,
    borderColor: 'transparent',
    overflow: 'hidden',
    backgroundColor: PDP_COLORS.specsBg,
  },
  thumbActive: {
    borderColor: PDP_COLORS.darkGreen,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbPlaceholder: {
    width: '80%',
    height: '80%',
    alignSelf: 'center',
  },
});

export default Gallery;

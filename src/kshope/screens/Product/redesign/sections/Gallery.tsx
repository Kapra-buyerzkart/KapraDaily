import React, { useState } from 'react';
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
import { PDP_ART } from '../assets';
import { PDP_COLORS } from '../theme';

type Props = {
  images: any[];
  discountLabel: string;
  wishlisted: boolean;
  onBack: () => void;
  onToggleWishlist: () => void;
};

const HIT = { top: 12, bottom: 12, left: 12, right: 12 };

const Gallery: React.FC<Props> = ({
  images,
  discountLabel,
  wishlisted,
  onBack,
  onToggleWishlist,
}) => {
  const { top } = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const cardHeight = s(360) + top;
  const slides = images.length > 0 ? images : [PDP_ART.placeholder];

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const width = event.nativeEvent.layoutMeasurement.width || SCREEN_WIDTH;
    const next = Math.round(event.nativeEvent.contentOffset.x / width);
    if (next !== index && next >= 0 && next < slides.length) {
      setIndex(next);
    }
  };

  return (
    <View style={[styles.card, { height: cardHeight }]}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
      >
        {slides.map((source: any, idx: number) => (
          <View key={idx} style={[styles.slide, { height: cardHeight }]}>
            <Image source={source} resizeMode="cover" style={styles.image} />
          </View>
        ))}
      </ScrollView>

      <LinearGradient
        pointerEvents="none"
        colors={[
          'rgba(255, 255, 255, 0)',
          'rgba(255, 255, 255, 0.55)',
          PDP_COLORS.white,
        ]}
        locations={[0, 0.55, 1]}
        style={styles.fade}
      />

      <View style={[styles.headerRow, { top: top + s(12) }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={HIT}
          onPress={onBack}
          style={styles.iconCircle}
        >
          <BackIcon width={18} height={16} />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={HIT}
            onPress={onToggleWishlist}
            style={styles.iconCircle}
          >
            {wishlisted ? (
              <HeartSolidIcon
                width={22}
                height={20}
                color={PDP_COLORS.orange}
              />
            ) : (
              <HeartIcon width={22} height={20} color={PDP_COLORS.black} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.counter}>
        <Text style={styles.counterText}>{`${index + 1} / ${
          slides.length
        }`}</Text>
      </View>

      {discountLabel ? (
        <View style={styles.discount}>
          <Text style={styles.discountText}>{discountLabel}</Text>
          <Text style={styles.discountText}>OFF</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH,
    height: s(286),
    backgroundColor: PDP_COLORS.white,
    overflow: 'hidden',
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: s(96),
  },
  slide: {
    width: SCREEN_WIDTH,
  },
  image: {
    flex: 1,
    width: '100%',
    transform: [{ scale: 1.18 }],
  },
  headerRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: s(24),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: s(38),
    height: s(38),
    borderRadius: s(19),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(14),
  },
  counter: {
    position: 'absolute',
    left: s(12),
    bottom: s(18),
    width: s(59),
    height: s(28),
    borderRadius: s(20),
    backgroundColor: PDP_COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(12),
    color: PDP_COLORS.white,
  },
  discount: {
    position: 'absolute',
    right: s(13),
    bottom: s(18),
    width: s(59),
    height: s(41),
    borderRadius: s(5),
    backgroundColor: PDP_COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountText: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(15),
    lineHeight: fs(18),
    color: PDP_COLORS.white,
  },
});

export default Gallery;

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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HOME_FONTS, SCREEN_WIDTH, fs, s } from '../../../Home/redesign/theme';
import { BackIcon, HeartIcon, HeartSolidIcon, ShareIcon } from '../icons';
import { PDP_ART } from '../assets';
import { PDP_COLORS } from '../theme';

type Props = {
  images: any[];
  discountLabel: string;
  wishlisted: boolean;
  onBack: () => void;
  onToggleWishlist: () => void;
  onShare: () => void;
};

const HIT = { top: 12, bottom: 12, left: 12, right: 12 };

const Gallery: React.FC<Props> = ({
  images,
  discountLabel,
  wishlisted,
  onBack,
  onToggleWishlist,
  onShare,
}) => {
  const { top } = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const cardHeight = s(286) + top;
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
          <View
            key={idx}
            style={[
              styles.slide,
              { height: cardHeight, paddingTop: top + s(44) },
            ]}
          >
            <Image source={source} resizeMode="contain" style={styles.image} />
          </View>
        ))}
      </ScrollView>

      <View style={[styles.headerRow, { top: top + s(12) }]}>
        <TouchableOpacity activeOpacity={0.7} hitSlop={HIT} onPress={onBack}>
          <BackIcon width={18} height={16} />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={HIT}
            onPress={onToggleWishlist}
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
          <TouchableOpacity activeOpacity={0.7} hitSlop={HIT} onPress={onShare}>
            <ShareIcon width={19} height={20} />
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PDP_COLORS.cardBorder,
    borderBottomLeftRadius: s(10),
    borderBottomRightRadius: s(10),
    overflow: 'hidden',
  },
  slide: {
    width: SCREEN_WIDTH,
    paddingHorizontal: s(20),
    paddingBottom: s(56),
  },
  image: {
    flex: 1,
    width: '100%',
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

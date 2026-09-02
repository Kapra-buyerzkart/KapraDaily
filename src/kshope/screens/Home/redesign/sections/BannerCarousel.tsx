import React, { useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { bannerImage } from '../data/useHomeData';
import {
  CARD_GAP,
  GUTTER,
  RADIUS,
  SCREEN_WIDTH,
  SECTION_GAP,
  SPACE,
  colWidth,
} from '../theme';

type Props = {
  items: any[];
  variant?: 'mid' | 'bottom' | 'midBottom';
  onPressBanner?: (banner: any) => void;
};

const MID_CARD_W = SCREEN_WIDTH - GUTTER * 2;
const SMALL_CARD_W = colWidth(2.15, CARD_GAP);

const SNAP = {
  mid: MID_CARD_W + CARD_GAP,
  bottom: SMALL_CARD_W + CARD_GAP,
  midBottom: SMALL_CARD_W + CARD_GAP,
};

const BannerCarousel: React.FC<Props> = ({
  items,
  variant = 'mid',
  onPressBanner,
}) => {
  const [index, setIndex] = useState(0);

  if (!items || items.length === 0) {
    return null;
  }

  const isMidBottom = variant === 'midBottom';

  return (
    <View style={isMidBottom ? styles.sectionFlush : styles.section}>
      <FlatList
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP[variant]}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        keyExtractor={(item, i) =>
          item?.bannerId?.toString() || item?.id?.toString() || `${variant}_${i}`
        }
        onMomentumScrollEnd={
          variant === 'mid'
            ? e =>
                setIndex(
                  Math.round(e.nativeEvent.contentOffset.x / SNAP.mid),
                )
            : undefined
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onPressBanner?.(item)}
            style={isMidBottom ? styles.midBottomCard : styles.card}
          >
            <Image
              source={bannerImage(item)}
              style={isMidBottom ? styles.midBottomImage : styles.cardImage}
              resizeMode={isMidBottom ? 'contain' : 'cover'}
            />
          </TouchableOpacity>
        )}
      />

      {variant === 'mid' && items.length > 1 && (
        <View style={styles.indicatorContainer}>
          {items.map((_, i) => (
            <View
              key={i}
              style={[
                styles.indicatorPill,
                index === i && styles.indicatorPillActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: SECTION_GAP,
  },
  sectionFlush: {
    marginTop: SPACE.lg,
  },
  listContent: {
    paddingHorizontal: GUTTER,
    gap: CARD_GAP,
  },
  card: {
    width: MID_CARD_W,
    height: hp('20%'),
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  midBottomCard: {
    width: SMALL_CARD_W,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  midBottomImage: {
    width: '100%',
    height: hp('15%'),
    borderRadius: RADIUS.md,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACE.md,
  },
  indicatorPill: {
    width: SPACE.xl,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: SPACE.xxs / 2,
  },
  indicatorPillActive: {
    backgroundColor: '#F25000',
    width: SPACE.xxl,
  },
});

export default BannerCarousel;

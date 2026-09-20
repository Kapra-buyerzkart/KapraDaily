import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { KAPRA_ART } from '../kapraAssets';
import { KAPRA_OCCASIONS, OccasionTile } from '../content';
import { HOME_FONTS, s, fs } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GUTTER = s(16);
const GAP = s(8);
const CARD_WIDTH = (SCREEN_WIDTH - GUTTER * 2 - GAP * 3) / 4;

import { resolveCatId, resolveCatName } from '../data/blocks';

interface ShopByOccasionProps {
  title?: string;
  categories?: any[];
  occasions?: OccasionTile[];
  onSelectCategory?: (category: any) => void;
  onSelectOccasion?: (occasion: OccasionTile) => void;
  onViewAll?: () => void;
}

const ShopByOccasion: React.FC<ShopByOccasionProps> = ({
  title = 'Shop by Category',
  categories,
  occasions = KAPRA_OCCASIONS,
  onSelectCategory,
  onSelectOccasion,
  onViewAll,
}) => {
  // Map live categories from backend or fallback to occasions
  const items = React.useMemo(() => {
    if (categories && categories.length > 0) {
      return categories.slice(0, 4).map((cat, idx) => {
        const name = resolveCatName(cat, cat.name || cat.title || '').trim();
        const lower = name.toLowerCase();

        let fallbackImage = KAPRA_ART.catRings;
        if (lower.includes('earring')) fallbackImage = KAPRA_ART.catEarrings;
        else if (lower.includes('pendant') || lower.includes('chain')) fallbackImage = KAPRA_ART.catPendants;
        else if (lower.includes('bangle') || lower.includes('bracelet')) fallbackImage = KAPRA_ART.catBangles;
        else if (lower.includes('gold') || lower.includes('coin')) fallbackImage = KAPRA_ART.catGold;
        else if (lower.includes('diamond')) fallbackImage = KAPRA_ART.catDiamonds;

        const rawImg =
          cat.catImage ||
          cat.CatImage ||
          cat.catImageUrl ||
          cat.CatImageUrl ||
          cat.imageUrl ||
          cat.ImageUrl ||
          cat.mobBannerImgUrl ||
          cat.MobBannerImgUrl ||
          cat.image;

        const image = rawImg
          ? typeof rawImg === 'string'
            ? { uri: rawImg.startsWith('http') ? rawImg : `https://kshadmin.kapradaily.com/${rawImg.replace(/^\//, '')}` }
            : rawImg
          : fallbackImage;

        const id = String(resolveCatId(cat) ?? idx);

        return {
          id,
          label: name || (occasions[idx] ? occasions[idx].label : `Category ${idx + 1}`),
          image,
          raw: cat,
        };
      });
    }

    return occasions;
  }, [categories, occasions]);

  const handlePress = (item: any) => {
    if (item.raw && onSelectCategory) {
      onSelectCategory(item.raw);
    } else if (onSelectOccasion) {
      onSelectOccasion(item);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          style={styles.viewAllBtn}
          activeOpacity={0.7}
          onPress={onViewAll}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={14} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* 4 Cards Grid */}
      <View style={styles.grid}>
        {items.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => handlePress(item)}
          >
            <View style={styles.imageBox}>
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.label} numberOfLines={1}>
                {item.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: s(14),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: GUTTER,
    marginBottom: s(12),
  },
  title: {
    fontSize: fs(21),
    fontFamily: HOME_FONTS.bold,
    color: '#1A1A1A',
    letterSpacing: 0.2,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: fs(12),
    fontFamily: HOME_FONTS.regular,
    color: '#1A1A1A',
  },
  grid: {
    flexDirection: 'row',
    paddingHorizontal: GUTTER,
    gap: GAP,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#EFE8DE',
    borderRadius: s(10),
    overflow: 'hidden',
  },
  imageBox: {
    width: '100%',
    height: CARD_WIDTH * 0.95,
    overflow: 'hidden',
    backgroundColor: '#FAF7F2',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  labelContainer: {
    paddingVertical: s(6),
    paddingHorizontal: s(2),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF7F2',
  },
  label: {
    fontSize: fs(9.5),
    fontFamily: HOME_FONTS.medium,
    color: '#1A1A1A',
    textAlign: 'center',
  },
});

export default ShopByOccasion;

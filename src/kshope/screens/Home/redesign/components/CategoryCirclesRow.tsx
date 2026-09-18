import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { KAPRA_ART } from '../kapraAssets';
import { KAPRA_CATEGORY_CIRCLES, Tile } from '../content';
import { HOME_FONTS, s, fs } from '../theme';

interface CategoryCirclesRowProps {
  categories?: any[];
  onSelectCategory?: (category: any) => void;
  onViewAllPress?: () => void;
}

const CategoryCirclesRow: React.FC<CategoryCirclesRowProps> = ({
  categories = [],
  onSelectCategory,
  onViewAllPress,
}) => {
  // Merge live API categories with jewellery artwork
  const items: Tile[] = React.useMemo(() => {
    if (categories.length > 0) {
      return categories.slice(0, 6).map((cat, idx) => {
        const name = (cat.catName || cat.name || cat.title || '').trim();
        const lower = name.toLowerCase();

        let fallbackImage = KAPRA_ART.catRings;
        if (lower.includes('earring')) fallbackImage = KAPRA_ART.catEarrings;
        else if (lower.includes('pendant') || lower.includes('chain')) fallbackImage = KAPRA_ART.catPendants;
        else if (lower.includes('bangle') || lower.includes('bracelet')) fallbackImage = KAPRA_ART.catBangles;
        else if (lower.includes('gold') || lower.includes('coin')) fallbackImage = KAPRA_ART.catGold;
        else if (lower.includes('diamond')) fallbackImage = KAPRA_ART.catDiamonds;

        const imageUrl = cat.imageUrl || cat.ImageUrl || cat.image;
        const resolvedImage = imageUrl
          ? typeof imageUrl === 'string'
            ? { uri: imageUrl.startsWith('http') ? imageUrl : `https://kshadmin.kapradaily.com/${imageUrl.replace(/^\//, '')}` }
            : imageUrl
          : fallbackImage;

        return {
          id: String(cat.catId || cat.id || idx),
          label: name || KAPRA_CATEGORY_CIRCLES[idx % KAPRA_CATEGORY_CIRCLES.length].label,
          image: resolvedImage,
          raw: cat,
        };
      });
    }

    return KAPRA_CATEGORY_CIRCLES;
  }, [categories]);

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.item}
            activeOpacity={0.8}
            onPress={() => onSelectCategory?.(item.raw || item)}
          >
            <View style={styles.circle}>
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.label} numberOfLines={1}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}

        {/* View All Circle */}
        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.8}
          onPress={onViewAllPress}
        >
          <View style={[styles.circle, styles.viewAllCircle]}>
            <Text style={styles.viewAllText}>View All</Text>
          </View>
          <Text style={styles.label} numberOfLines={1}>
            View All
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const CIRCLE_SIZE = s(52);

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#FFFFFF',
    paddingVertical: s(12),
  },
  scrollContent: {
    paddingHorizontal: s(16),
    gap: s(14),
    alignItems: 'flex-start',
  },
  item: {
    alignItems: 'center',
    width: CIRCLE_SIZE + s(8),
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#F5EFE6',
    borderWidth: 1,
    borderColor: '#EFE8DE',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: s(6),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  viewAllCircle: {
    backgroundColor: '#F5EFE6',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#D8CBB7',
  },
  viewAllText: {
    fontSize: fs(9),
    fontFamily: HOME_FONTS.bold,
    color: '#0C382E',
    textAlign: 'center',
  },
  label: {
    fontSize: fs(10),
    fontFamily: HOME_FONTS.medium,
    color: '#1A1A1A',
    textAlign: 'center',
  },
});

export default CategoryCirclesRow;

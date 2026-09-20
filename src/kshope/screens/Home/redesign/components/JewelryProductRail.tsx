import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ProductTile } from '../content';
import JewelryProductCard from './JewelryProductCard';
import { HOME_FONTS, s, fs } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GUTTER = s(16);
const CARD_GAP = s(12);
const CARD_WIDTH = Math.round((SCREEN_WIDTH - GUTTER * 2 - CARD_GAP) / 2.3);

interface JewelryProductRailProps {
  title: string;
  items: ProductTile[];
  wishlisted?: string[];
  compact?: boolean;
  onPressProduct?: (item: ProductTile) => void;
  onToggleWishlist?: (item: ProductTile) => void;
  onViewAll?: () => void;
}

const JewelryProductRail: React.FC<JewelryProductRailProps> = ({
  title,
  items,
  wishlisted = [],
  compact = false,
  onPressProduct,
  onToggleWishlist,
  onViewAll,
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  const effectiveCardWidth = compact
    ? Math.round((SCREEN_WIDTH - GUTTER * 2 - CARD_GAP * 2) / 3)
    : CARD_WIDTH;

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        {onViewAll ? (
          <TouchableOpacity
            style={styles.viewAllBtn}
            activeOpacity={0.7}
            onPress={onViewAll}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={14} color="#1A1A1A" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Horizontal Rail */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.railContent}
      >
        {items.map(item => (
          <JewelryProductCard
            key={item.id}
            item={item}
            width={effectiveCardWidth}
            compact={compact}
            isWishlisted={wishlisted.includes(item.id)}
            onPress={onPressProduct}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </ScrollView>
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
  railContent: {
    paddingHorizontal: GUTTER,
    gap: CARD_GAP,
  },
});

export default JewelryProductRail;

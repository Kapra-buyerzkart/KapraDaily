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
import { KAPRA_OCCASIONS, OccasionTile } from '../content';
import { HOME_FONTS, s, fs } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GUTTER = s(16);
const GAP = s(8);
const CARD_WIDTH = (SCREEN_WIDTH - GUTTER * 2 - GAP * 3) / 4;

interface ShopByOccasionProps {
  occasions?: OccasionTile[];
  onSelectOccasion?: (occasion: OccasionTile) => void;
  onViewAll?: () => void;
}

const ShopByOccasion: React.FC<ShopByOccasionProps> = ({
  occasions = KAPRA_OCCASIONS,
  onSelectOccasion,
  onViewAll,
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Shop by occasion</Text>
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
        {occasions.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => onSelectOccasion?.(item)}
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
    borderRadius: s(8),
    overflow: 'hidden',
  },
  imageBox: {
    width: '100%',
    height: CARD_WIDTH * 0.95,
    overflow: 'hidden',
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
    fontSize: fs(9),
    fontFamily: HOME_FONTS.medium,
    color: '#1A1A1A',
    textAlign: 'center',
  },
});

export default ShopByOccasion;

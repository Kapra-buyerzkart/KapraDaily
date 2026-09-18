import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type { Tile } from '../../../Home/redesign/content';
import { imageSource } from '../../../Home/redesign/parts';
import {
  GUTTER,
  HOME_FONTS,
  SPACE,
  fs,
  s,
} from '../../../Home/redesign/theme';

type Props = {
  items: Tile[];
  activeId: string | null;
  onPress: (id: string) => void;
};

const CARD_SIZE = s(80);

const SubCategoryRow: React.FC<Props> = ({ items, activeId, onPress }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      {/* Header Block */}
      <View style={styles.headerBlock}>
        <Text style={styles.title}>explore by type</Text>
        <Text style={styles.subtitle}>Shop by Category</Text>
      </View>

      {/* Cards Row */}
      <FlatList
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.row}
        renderItem={({ item }) => {
          const isActive = item.id === activeId;
          const imgSrc = imageSource(item.image);
          return (
            <TouchableOpacity
              testID={`subcategory-chip-${item.id}`}
              activeOpacity={0.85}
              onPress={() => onPress(item.id)}
              style={styles.item}
            >
              <View style={[styles.card, isActive && styles.cardActive]}>
                {imgSrc ? (
                  <Image
                    source={imgSrc}
                    resizeMode="contain"
                    style={styles.cardImage}
                  />
                ) : (
                  <Ionicons
                    name="sparkles-outline"
                    size={s(24)}
                    color="#C5A869"
                  />
                )}
              </View>
              <Text
                style={[styles.label, isActive && styles.labelActive]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#FFFFFF',
    marginTop: SPACE.md,
    marginBottom: SPACE.sm,
  },
  headerBlock: {
    paddingHorizontal: GUTTER,
    marginBottom: SPACE.sm,
  },
  title: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(22),
    lineHeight: fs(26),
    color: '#0C382E',
  },
  subtitle: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(11.5),
    color: '#767676',
    marginTop: s(1),
  },
  row: {
    paddingHorizontal: GUTTER,
    paddingBottom: SPACE.sm,
    gap: s(12),
  },
  item: {
    width: CARD_SIZE,
    alignItems: 'center',
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: s(14),
    backgroundColor: '#FAF6F0',
    borderWidth: 1,
    borderColor: '#EFE8DE',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cardActive: {
    borderColor: '#0C382E',
    borderWidth: 1.5,
  },
  cardImage: {
    width: '78%',
    height: '78%',
  },
  label: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(11),
    lineHeight: fs(11) * 1.3,
    color: '#1A1A1A',
    marginTop: s(6),
    textAlign: 'center',
  },
  labelActive: {
    fontFamily: HOME_FONTS.semiBold,
    color: '#0C382E',
  },
});

export default SubCategoryRow;

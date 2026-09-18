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
  HOME_COLORS,
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

const CIRCLE_SIZE = s(52);

const CategoryChipRow: React.FC<Props> = ({ items, activeId, onPress }) => (
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
          testID={`category-chip-${item.id}`}
          activeOpacity={0.8}
          onPress={() => onPress(item.id)}
          style={styles.item}
        >
          {/* Circular Category Icon */}
          <View style={styles.circle}>
            {imgSrc ? (
              <Image
                source={imgSrc}
                resizeMode="contain"
                style={styles.icon}
              />
            ) : (
              <Ionicons
                name="sparkles-outline"
                size={s(20)}
                color="#C5A869"
              />
            )}
          </View>

          {/* Label */}
          <Text
            style={[styles.label, isActive && styles.labelActive]}
            numberOfLines={1}
          >
            {item.label}
          </Text>

          {/* Underline Indicator */}
          <View
            style={[styles.indicator, isActive && styles.indicatorActive]}
          />
        </TouchableOpacity>
      );
    }}
  />
);

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.xs,
    paddingBottom: SPACE.sm,
    gap: s(14),
  },
  item: {
    alignItems: 'center',
    width: s(58),
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#F7F2EB',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  icon: {
    width: '74%',
    height: '74%',
  },
  label: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(11),
    color: '#494949',
    marginTop: s(6),
    textAlign: 'center',
  },
  labelActive: {
    fontFamily: HOME_FONTS.semiBold,
    color: '#0C382E',
  },
  indicator: {
    width: s(24),
    height: s(2),
    borderRadius: s(1),
    backgroundColor: 'transparent',
    marginTop: s(4),
  },
  indicatorActive: {
    backgroundColor: '#0C382E',
  },
});

export default CategoryChipRow;

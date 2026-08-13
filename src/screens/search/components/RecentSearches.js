import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import styles from '../SearchScreen.styles';

const truncateText = (text, limit = 22) => {
  if (!text) return '';
  if (text.length <= limit) return text;
  return text.substring(0, limit) + '..';
};

const RecentSearches = ({ searchTerm, recentSearches, onSelect }) => {
  if (searchTerm.length > 0 || recentSearches.length === 0) return null;

  return (
    <View>
      <Text
        style={styles.recentTitle}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        accessibilityRole="header"
      >
        Recent search
      </Text>
      <View style={styles.recentContainer}>
        {recentSearches.slice(0, 8).map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.recentProduct}
            activeOpacity={0.75}
            onPress={() => onSelect(item)}
            accessibilityRole="button"
            accessibilityLabel={`Search again for ${item}`}
          >
            <Text
              style={styles.recentProductText}
              numberOfLines={1}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {truncateText(item)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default RecentSearches;

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../SearchScreen.styles';

const truncateText = (text, limit = 7) => {
  if (!text) return '';
  if (text.length <= limit) return text;
  return text.substring(0, limit) + '..';
};

// Header shown above search results when there's no active query yet —
// lets the user re-run one of their last 8 searches with a tap.
const RecentSearches = ({ searchTerm, recentSearches, onSelect }) => {
  if (searchTerm.length > 0 || recentSearches.length === 0) return null;

  return (
    <View>
      <Text style={styles.recentTitle}>Recent search</Text>
      <View style={styles.recentContainer}>
        {recentSearches.slice(0, 8).map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.recentProduct}
            onPress={() => onSelect(item)}
          >
            <Text style={styles.recentProductText}>{truncateText(item, 7)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default RecentSearches;

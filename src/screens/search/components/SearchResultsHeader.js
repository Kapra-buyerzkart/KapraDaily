import React from 'react';
import { View, Text } from 'react-native';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import styles from '../SearchScreen.styles';

const SearchResultsHeader = ({ loading, resultCount, isGlobalFallback }) => (
  <View style={styles.resultRow}>
    <Text style={styles.resultText} maxFontSizeMultiplier={MAX_FONT_SCALE}>
      {loading ? 'Searching...' : `Results found : ${resultCount}`}
    </Text>
    {isGlobalFallback && (
      <Text
        style={styles.fallbackNoticeText}
        numberOfLines={1}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        Showing results from all categories
      </Text>
    )}
  </View>
);

export default SearchResultsHeader;

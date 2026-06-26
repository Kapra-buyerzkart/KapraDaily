import React from 'react';
import { View, Text } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import styles from '../SearchScreen.styles';

// "Results found : N" row, shown only while there's an active search term.
const SearchResultsHeader = ({ loading, resultCount, isGlobalFallback }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingRight: wp('5%'),
    }}
  >
    <Text style={styles.resultText}>
      {loading ? 'Searching...' : `Results found : ${resultCount}`}
    </Text>
    {isGlobalFallback && (
      <Text style={styles.fallbackNoticeText}>Showing results from all categories</Text>
    )}
  </View>
);

export default SearchResultsHeader;

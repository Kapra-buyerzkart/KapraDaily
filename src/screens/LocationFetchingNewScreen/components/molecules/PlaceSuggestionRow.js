import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ADDRESS_ICON } from '../../constants';
import { SPACING } from '../../theme';
import { IconDisc, LocText } from '../atoms';

const PlaceSuggestionRow = ({ title, address }) => (
  <View style={styles.row}>
    <IconDisc source={ADDRESS_ICON} />
    <View style={styles.copy}>
      <LocText variant="body" tone="secondary" style={styles.title}>
        {title}
      </LocText>
      <LocText variant="caption" tone="primary">
        {address}
      </LocText>
    </View>
  </View>
);

export default React.memo(PlaceSuggestionRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  copy: {
    marginLeft: SPACING.sm,
    flexShrink: 1,
  },
  title: {
    paddingBottom: 2,
  },
});

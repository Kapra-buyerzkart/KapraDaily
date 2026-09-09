import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ADDRESS_ICON } from '../../constants';
import { SPACING } from '../../theme';
import { IconDisc, LocText } from '../atoms';

const PlaceSuggestionRow = ({ title, address }) => (
  <View style={styles.row}>
    <IconDisc source={ADDRESS_ICON} />
    <View style={styles.copy}>
      <LocText variant="bodyStrong" tone="primary" numberOfLines={1}>
        {title}
      </LocText>
      {!!address && (
        <LocText
          variant="caption"
          tone="muted"
          numberOfLines={1}
          style={styles.address}
        >
          {address}
        </LocText>
      )}
    </View>
  </View>
);

export default React.memo(PlaceSuggestionRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copy: {
    marginLeft: SPACING.md,
    flexShrink: 1,
  },
  address: {
    marginTop: 2,
  },
});

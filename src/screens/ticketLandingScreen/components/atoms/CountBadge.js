import React from 'react';
import { StyleSheet, View } from 'react-native';

import { COLORS } from '../../theme';
import TicketText from './TicketText';

const CountBadge = ({ count = 0, max = 99 }) => {
  if (!(count > 0)) return null;

  return (
    <View style={styles.badge}>
      <TicketText variant="badge" numberOfLines={1}>
        {count > max ? `${max}+` : count}
      </TicketText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    backgroundColor: COLORS.accentDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(CountBadge);

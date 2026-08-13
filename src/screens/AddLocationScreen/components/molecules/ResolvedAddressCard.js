import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { AddrText, IconDisc } from '../atoms';
import { PIN_ICON } from '../../constants';
import { COLORS, RADIUS, SPACING, wp } from '../../theme';

const ResolvedAddressCard = ({ line1, line2, isResolving }) => (
  <View style={styles.card}>
    <IconDisc tone="neutral">
      <Image source={PIN_ICON} style={styles.icon} />
    </IconDisc>

    <View style={styles.copy}>
      <AddrText variant="bodyStrong" numberOfLines={2}>
        {line1 || (isResolving ? 'Fetching location…' : 'Address not found')}
      </AddrText>
      {line2 ? (
        <AddrText
          variant="caption"
          tone="muted"
          numberOfLines={1}
          style={styles.line2}
        >
          {line2}
        </AddrText>
      ) : null}
    </View>
  </View>
);

export default React.memo(ResolvedAddressCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    marginTop: SPACING.lg,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.well,
  },
  icon: {
    width: wp('4%'),
    height: wp('5%'),
    resizeMode: 'contain',
    tintColor: COLORS.textSecondary,
  },
  copy: {
    flex: 1,
  },
  line2: {
    marginTop: 2,
  },
});

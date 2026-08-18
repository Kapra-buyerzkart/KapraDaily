import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { AddrText } from '../atoms';
import { DELIVERY_ICON } from '../../constants';
import { COLORS, HAIRLINE, RADIUS, SPACING, hp, wp } from '../../theme';

const DeliveryNote = () => (
  <View style={styles.strip}>
    <Image source={DELIVERY_ICON} style={styles.image} />
    <View style={styles.copy}>
      <AddrText variant="captionStrong">Help your delivery partner</AddrText>
      <AddrText variant="caption" tone="muted">
        A precise address means a faster drop-off
      </AddrText>
    </View>
  </View>
);

export default React.memo(DeliveryNote);

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: RADIUS.card,
    borderWidth: HAIRLINE,
    borderColor: COLORS.line,
    backgroundColor: COLORS.well,
  },
  image: {
    width: wp('11%'),
    height: hp('4.5%'),
    resizeMode: 'contain',
  },
  copy: {
    flex: 1,
    marginLeft: SPACING.md,
  },
});

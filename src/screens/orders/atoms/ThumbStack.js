import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import CONFIG from '@/globals/config';
import appImages from '@/assets/images';
import OrderText from './OrderText';
import { COLORS, HAIRLINE, RADIUS, wp } from '../theme';

const FALLBACK = appImages.product1;
const VISIBLE = 3;

const ThumbStack = ({ images = [], total, size = wp('13%'), style }) => {
  const shown = images.slice(0, VISIBLE);
  const count = Number(total ?? images.length);
  const overflow = count - shown.length;
  const tile = { width: size, height: size, borderRadius: RADIUS.sm };

  if (!shown.length) {
    return (
      <View style={style}>
        <Image source={FALLBACK} style={[styles.thumb, tile]} />
      </View>
    );
  }

  return (
    <View style={[styles.row, style]}>
      {shown.map((image, index) => (
        <View
          key={`${image}-${index}`}
          style={[
            styles.slot,
            tile,
            index > 0 && { marginLeft: -size * 0.42 },
            { zIndex: VISIBLE - index },
          ]}
        >
          <Image
            source={{ uri: `${CONFIG.image_base_url}${image}` }}
            style={[styles.thumb, tile]}
          />
        </View>
      ))}
      {overflow > 0 && (
        <View
          style={[styles.slot, styles.more, tile, { marginLeft: -size * 0.42 }]}
        >
          <OrderText variant="captionStrong" tone="muted">
            +{overflow}
          </OrderText>
        </View>
      )}
    </View>
  );
};

export default React.memo(ThumbStack);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slot: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.surface,
    overflow: 'hidden',
  },
  thumb: {
    backgroundColor: COLORS.well,
    borderWidth: HAIRLINE,
    borderColor: COLORS.line,
    resizeMode: 'cover',
  },
  more: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.well,
  },
});

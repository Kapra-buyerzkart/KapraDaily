import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { FONTS } from '@/styles/typography';
import {
  HAIRLINE,
  INK,
  RADIUS,
  SURFACE,
  TYPE,
  MAX_FONT_SCALE,
} from '@/styles/homeTheme';
import CONFIG from '@/globals/config';
import appImages from '@/assets/images';

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
          <Text style={styles.moreText} maxFontSizeMultiplier={MAX_FONT_SCALE}>
            +{overflow}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slot: {
    backgroundColor: SURFACE.base,
    borderWidth: 1.5,
    borderColor: SURFACE.base,
    overflow: 'hidden',
  },
  thumb: {
    backgroundColor: SURFACE.sunken,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIRLINE,
    resizeMode: 'cover',
  },
  more: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SURFACE.sunken,
  },
  moreText: {
    ...TYPE.caption,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    color: INK.muted,
  },
});

export default React.memo(ThumbStack);

import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { HOME_ART } from '../../../Home/redesign/assets';
import {
  GUTTER,
  HOME_COLORS,
  RADIUS,
  SPACE,
  SCREEN_WIDTH,
} from '../../../Home/redesign/theme';

type Props = {
  source: { uri: string } | null;
};

const PromoBanner: React.FC<Props> = ({ source }) => {
  const [failed, setFailed] = useState(false);

  if (!source || failed) {
    return (
      <View style={styles.wrap}>
        <View style={[styles.image, styles.fallbackWrap]}>
          <Image
            source={HOME_ART.bannerFallback}
            resizeMode="contain"
            style={styles.fallbackImage}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Image
        source={source}
        onError={() => setFailed(true)}
        resizeMode="cover"
        style={styles.image}
        defaultSource={HOME_ART.placeholder}
      />
    </View>
  );
};

const BANNER_W = SCREEN_WIDTH - GUTTER * 2;
const BANNER_H = BANNER_W * 0.21;

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: GUTTER,
    marginTop: SPACE.sm,
    marginBottom: SPACE.lg,
  },
  image: {
    width: BANNER_W,
    height: BANNER_H,
    borderRadius: RADIUS.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HOME_COLORS.cardBorder,
  },
  fallbackWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F2',
    overflow: 'hidden',
  },
  fallbackImage: {
    width: BANNER_W * 0.45,
    height: BANNER_H * 0.6,
    tintColor: '#1A1A1A',
  },
});

export default PromoBanner;

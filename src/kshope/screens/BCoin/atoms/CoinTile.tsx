import React from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { PALETTE, RADIUS } from '../theme';

const TONES: Record<string, string> = {
  gold: PALETTE.goldTint,
  token: PALETTE.tokenTint,
  neutral: PALETTE.well,
  credit: PALETTE.creditTint,
};

interface CoinTileProps {
  size?: number;
  tone?: string;
  radius?: number;
  source?: ImageSourcePropType;
  imageStyle?: StyleProp<ImageStyle>;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const CoinTile: React.FC<CoinTileProps> = ({
  size = 38,
  tone = 'neutral',
  radius,
  source,
  imageStyle,
  style,
  children,
}) => (
  <View
    style={[
      styles.tile,
      {
        width: size,
        height: size,
        borderRadius: radius ?? RADIUS.icon,
        backgroundColor: TONES[tone] || tone,
      },
      style,
    ]}
  >
    {source ? <Image source={source} style={imageStyle} /> : children}
  </View>
);

export default React.memo(CoinTile);

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

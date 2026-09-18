import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  GUTTER,
  RADIUS,
  SCREEN_WIDTH,
  SPACE,
  s,
} from '../../../Home/redesign/theme';
import { CATEGORY_ART } from '../categoryAssets';

type Props = {
  source?: { uri: string } | null;
  onPress?: () => void;
};

const BANNER_W = SCREEN_WIDTH - GUTTER * 2;
const BANNER_H = BANNER_W * 0.393;

const PromoBanner: React.FC<Props> = ({ source, onPress }) => {
  const [failed, setFailed] = useState(false);

  if (!source || failed) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={onPress}
        disabled={!onPress}
        style={styles.container}
      >
        <Image
          source={source}
          onError={() => setFailed(true)}
          resizeMode="cover"
          style={styles.image}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: GUTTER,
    marginTop: SPACE.xs,
    marginBottom: SPACE.md,
  },
  container: {
    width: BANNER_W,
    height: BANNER_H,
    borderRadius: s(14),
    overflow: 'hidden',
    backgroundColor: '#F8F3ED',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default PromoBanner;

import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { s } from '../cartRedesignTheme';

const BANNER_IMAGE = require('../../../assets/images/cart/detailsheader.png');
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// detailsheader.png native dimensions: 421 x 157
const BANNER_ASPECT_RATIO = 157 / 421;

type Props = {
  onExploreGifts: () => void;
};

export const CartSpecialBanner: React.FC<Props> = ({ onExploreGifts }) => {
  const bannerWidth = SCREEN_WIDTH - s(32);
  const bannerHeight = bannerWidth * BANNER_ASPECT_RATIO;

  return (
    <View
      style={[styles.container, { width: bannerWidth, height: bannerHeight }]}
    >
      <Image source={BANNER_IMAGE} style={styles.image} resizeMode="contain" />
      {/* Tappable overlay over the "Explore Gift Sets ->" button in detailsheader.png */}
      <TouchableOpacity
        testID="cart-explore-gift-sets"
        activeOpacity={0.7}
        onPress={onExploreGifts}
        style={styles.buttonHitArea}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: s(16),
    marginTop: s(4),
    marginBottom: s(16),
    // borderRadius: s(14),
    overflow: 'hidden',
    position: 'relative',
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonHitArea: {
    position: 'absolute',
    left: '37%',
    top: '45%',
    width: '32%',
    height: '28%',
    borderRadius: s(16),
  },
});

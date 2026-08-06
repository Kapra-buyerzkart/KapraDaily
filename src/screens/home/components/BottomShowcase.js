import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AnimatedPressable from '../../../components/AnimatedPressable';
import CachedImage, {
  CachedImageBackground,
} from '../../../components/CachedImage';
import {
  RADIUS,
  SPACE,
  ELEVATION,
  SURFACE,
  HAIRLINE,
} from '@/styles/homeTheme';

const WELL = wp('24%');
const WELL_GAP = SPACE.sm;
const WELL_STRIDE = WELL + WELL_GAP;

const TRAY_INSET = SPACE.md;
const TRAY_PAD = SPACE.sm;

const BottomShowcase = ({ banner, products, onBannerPress }) => {
  const keyExtractor = useCallback(
    (item, index) => (item.bannerId || item.id || index).toString(),
    [],
  );

  const getItemLayout = useCallback(
    (_, index) => ({
      length: WELL_STRIDE,
      offset: WELL_STRIDE * index,
      index,
    }),
    [],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <AnimatedPressable
        onPress={() => onBannerPress(item)}
        style={styles.well}
        accessibilityRole="button"
        accessibilityLabel={item.title || 'Featured product'}
      >
        <CachedImage
          source={item.uri}
          style={styles.wellImage}
          resizeMode="contain"
          accessible={false}
        />
      </AnimatedPressable>
    ),
    [onBannerPress],
  );

  if (!banner || !products || products.length === 0) return null;

  return (
    <AnimatedPressable
      onPress={() => onBannerPress(banner)}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={banner.title || 'Featured collection'}
    >
      <CachedImageBackground
        source={banner.uri}
        style={styles.canvas}
        imageStyle={styles.canvasImage}
        resizeMode="cover"
        accessible={false}
      >
        <View style={styles.tray}>
          <FlatList
            horizontal
            data={products}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            getItemLayout={getItemLayout}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trayContent}
            snapToInterval={WELL_STRIDE}
            snapToAlignment="start"
            decelerationRate="fast"
            initialNumToRender={4}
            maxToRenderPerBatch={4}
            windowSize={5}
          />
        </View>
      </CachedImageBackground>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: wp('94%'),
    height: hp('32%'),
    alignSelf: 'center',
    marginTop: SPACE.lg,
    borderRadius: RADIUS.xl,
    backgroundColor: SURFACE.base,
    ...ELEVATION.md,
  },
  canvas: {
    flex: 1,
    justifyContent: 'flex-end',
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  canvasImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tray: {
    margin: TRAY_INSET,
    padding: TRAY_PAD,
    paddingRight: 0,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIRLINE,
    overflow: 'hidden',
    ...ELEVATION.md,
  },
  trayContent: {
    paddingRight: TRAY_PAD,
  },
  well: {
    width: WELL,
    height: WELL,
    marginRight: WELL_GAP,
    padding: SPACE.xs,
    borderRadius: RADIUS.md,
    backgroundColor: SURFACE.sunken,
  },
  wellImage: {
    width: '100%',
    height: '100%',
  },
});

export default React.memo(BottomShowcase);

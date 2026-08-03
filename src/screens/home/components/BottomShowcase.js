import React, { useCallback } from 'react';
import { View, Image, ImageBackground, FlatList, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AnimatedPressable from '../../../components/AnimatedPressable';
import {
  RADIUS,
  SPACE,
  ELEVATION,
  SURFACE,
  HAIRLINE,
} from '@/styles/homeTheme';

// A banner-backed rail of product tiles. Both the banner itself and each tile
// are independently tappable — the banner and its products can point at
// different destinations.
//
// The composition is a tray, not an overlay: the artwork owns the whole card,
// and the products ride in a white tray floating over its lower edge. That tray
// is what makes the row read as a shelf of buyable things rather than as
// cut-outs pasted onto the banner — and it means the artwork can change without
// the products losing their background.

// Three wells and a sliver of the fourth, so the shelf is visibly scrollable
// without a scrollbar. Stride is declared with the well because the rail snaps
// on it.
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
        <Image
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
      <ImageBackground
        source={banner.uri}
        style={styles.canvas}
        imageStyle={styles.canvasImage}
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
            // Snap on the well stride so a flick parks a product against the
            // tray's left edge instead of halfway between two.
            snapToInterval={WELL_STRIDE}
            snapToAlignment="start"
            decelerationRate="fast"
            initialNumToRender={4}
            maxToRenderPerBatch={4}
            windowSize={5}
          />
        </View>
      </ImageBackground>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  // Inset to the gutter, rounded and lifted, so it reads as artwork placed on
  // the page rather than a panel bolted to the screen edges. The shadow lives
  // out here because the canvas has to clip its own background image.
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
  // Very slightly translucent: enough that the artwork's colour reads through
  // the tray and the two feel like one object, not enough to muddy the wells.
  tray: {
    margin: TRAY_INSET,
    padding: TRAY_PAD,
    // The list is inset on the left by the padding; letting it run to the
    // tray's right edge is what puts the fourth well half in frame.
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
  // Products are cut-outs on transparent backgrounds. A tinted well gives each
  // one an edge and a consistent footprint, however tall or wide the cut-out.
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

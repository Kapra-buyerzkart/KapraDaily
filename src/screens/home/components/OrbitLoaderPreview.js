// TEMP: visual harness for OrbitLoader. Delete this file and its mount in
// HomeScreen.js once the loader has been signed off.
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { OrbitLoader } from '@/components/OrbitLoader';
import images from '@/assets/images';
import { FONTS } from '@/styles/typography';
import {
  SURFACE,
  INK,
  HAIRLINE,
  RADIUS,
  SPACE,
  GUTTER,
  MAX_FONT_SCALE,
} from '@/styles/homeTheme';

const ORBIT_ITEMS = [
  images.product1,
  images.product2,
  images.product3,
  images.fv,
  images.lighting,
];

const OrbitLoaderPreview = () => (
  <View style={styles.container}>
    <Text style={styles.label} maxFontSizeMultiplier={MAX_FONT_SCALE}>
      OrbitLoader preview
    </Text>
    <View style={styles.stage}>
      <OrbitLoader
        items={ORBIT_ITEMS}
        size={wp('40%')}
        itemSize={wp('10%')}
        center={
          <Image
            source={images.kapraLogo}
            resizeMode="contain"
            style={styles.centerLogo}
          />
        }
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: GUTTER,
    marginVertical: SPACE.sm,
    paddingVertical: SPACE.md,
    borderRadius: RADIUS.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIRLINE,
    backgroundColor: SURFACE.sunken,
    alignItems: 'center',
  },
  label: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.2%'),
    color: INK.muted,
    letterSpacing: 0.4,
  },
  stage: {
    marginTop: SPACE.sm,
  },
  centerLogo: {
    width: wp('12%'),
    height: wp('12%'),
  },
});

export default OrbitLoaderPreview;

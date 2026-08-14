import React from 'react';
import { View, ImageBackground, Image, StyleSheet } from 'react-native';
import { CART_COLORS, wp, hp } from '../../../../styles/cartTheme';

const RegistrationHero = () => (
  <ImageBackground
    style={styles.hero}
    imageStyle={styles.heroImage}
    source={require('../../../../assets/images/login_background_image.jpg')}
  >
    <View style={styles.scrim} />
    <Image
      style={styles.logo}
      source={require('../../../../assets/images/kapra_logo.png')}
    />
    <Image
      style={styles.tagLine}
      source={require('../../../../assets/images/login_content.png')}
    />
  </ImageBackground>
);

export default React.memo(RegistrationHero);

const styles = StyleSheet.create({
  hero: {
    height: hp('34%'),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: hp('4%'),
    paddingBottom: hp('6%'),
    backgroundColor: CART_COLORS.canvas,
  },
  heroImage: {
    resizeMode: 'cover',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  logo: {
    width: wp('42%'),
    height: hp('8%'),
    resizeMode: 'contain',
  },
  tagLine: {
    width: wp('50.7%'),
    height: hp('14%'),
    resizeMode: 'contain',
  },
});

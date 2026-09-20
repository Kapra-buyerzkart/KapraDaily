import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import images from '@/assets/images';

const RegistrationHero = () => (
  <View style={styles.heroContainer}>
    <ImageBackground
      style={styles.hero}
      source={images.registrationLuxuryBg}
      resizeMode="cover"
    />
  </View>
);

export default React.memo(RegistrationHero);

const styles = StyleSheet.create({
  heroContainer: {
    width: '100%',
    height: hp('38%'),
    overflow: 'hidden',
  },
  hero: {
    width: '100%',
    height: '100%',
  },
});

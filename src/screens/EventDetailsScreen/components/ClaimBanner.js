import React from 'react';
import { Text, Image, ImageBackground } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import icons from '@/assets/icons';
import styles from '../styles';

const ClaimBanner = () => (
  <Animated.View entering={FadeInDown.delay(80).duration(400)}>
    <ImageBackground
      source={icons.udbanner}
      style={styles.banner}
      imageStyle={styles.bannerBackgroundImage}
    >
      <Text style={styles.bannerText}>Use your </Text>
      <Image source={icons.udcoin} style={styles.bannerCoin} />
      <Text style={[styles.bannerText, styles.bannerHighlight]}>UD-Coin</Text>
      <Text style={styles.bannerText}> to claim your ticket</Text>
    </ImageBackground>
  </Animated.View>
);

export default React.memo(ClaimBanner);

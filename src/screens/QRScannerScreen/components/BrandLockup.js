import React from 'react';
import { Image, Text, View } from 'react-native';
import images from '@/assets/images';
import { styles } from '../styles';

// The wordmark ships as white artwork with a baked-in drop shadow, so it is
// only ever placed on the dimmed camera scrim or a solid accent band - never
// on the white result card, where it would disappear.
const BrandLockup = ({ label, style }) => (
  <View style={[styles.brandLockup, style]} pointerEvents="none">
    <Image source={images.kapraLogo} style={styles.brandLogo} />

    {label ? (
      <View style={styles.brandKickerRow}>
        <View style={styles.brandRule} />
        <Text style={styles.brandKicker}>{label}</Text>
        <View style={styles.brandRule} />
      </View>
    ) : null}
  </View>
);

export default React.memo(BrandLockup);

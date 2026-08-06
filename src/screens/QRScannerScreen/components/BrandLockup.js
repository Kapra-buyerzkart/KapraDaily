import React from 'react';
import { Image, Text, View } from 'react-native';
import images from '@/assets/images';
import { styles } from '../styles';

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

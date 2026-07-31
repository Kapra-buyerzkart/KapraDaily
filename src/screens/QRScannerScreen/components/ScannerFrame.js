import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../styles';
import BrandLockup from './BrandLockup';

const ScannerFrame = ({ showHint }) => (
  <View style={styles.overlay} pointerEvents="none">
    <View style={[styles.scrimFill, styles.brandZone]}>
      <BrandLockup label="Ticket Check-in" />
    </View>

    <View style={styles.overlayMiddleRow}>
      <View style={styles.scrimFill} />
      <View style={styles.frame}>
        <View style={[styles.corner, styles.cornerTopLeft]} />
        <View style={[styles.corner, styles.cornerTopRight]} />
        <View style={[styles.corner, styles.cornerBottomLeft]} />
        <View style={[styles.corner, styles.cornerBottomRight]} />
      </View>
      <View style={styles.scrimFill} />
    </View>

    <View style={styles.scrimFill}>
      {showHint && (
        <Text style={styles.hintText}>
          Point your camera at a ticket QR code to check it in
        </Text>
      )}
    </View>
  </View>
);

export default React.memo(ScannerFrame);

import React from 'react';
import { View, StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { ProfileText } from '../atoms';
import { CART_SPACING } from '@/styles/cartTheme';

const AppVersion = () => (
  <View style={styles.wrap}>
    <ProfileText variant="micro" tone="faint" style={styles.text}>
      {`Version ${DeviceInfo.getVersion()}`}
    </ProfileText>
  </View>
);

export default React.memo(AppVersion);

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingTop: CART_SPACING.lg,
  },
  text: {
    letterSpacing: 0.4,
  },
});

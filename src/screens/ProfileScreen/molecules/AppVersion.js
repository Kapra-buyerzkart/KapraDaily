import React from 'react';
import { View, StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { ProfileText } from '../atoms';
import { CART_SPACING } from '@/styles/cartTheme';

const AppVersion = () => {
  const version = DeviceInfo.getVersion ? DeviceInfo.getVersion() : '1.0.0';
  const year = new Date().getFullYear();

  return (
    <View style={styles.wrap}>
      <ProfileText variant="caption" tone="muted" style={styles.text}>
        {`Version ${version}`}
      </ProfileText>
      <ProfileText variant="micro" tone="faint" style={styles.rightsText}>
        {`© ${year} All Rights Reserved.`}
      </ProfileText>
    </View>
  );
};

export default React.memo(AppVersion);

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingTop: CART_SPACING.lg,
    paddingBottom: CART_SPACING.xl,
    gap: 4,
  },
  text: {
    letterSpacing: 0.3,
  },
  rightsText: {
    letterSpacing: 0.2,
  },
});

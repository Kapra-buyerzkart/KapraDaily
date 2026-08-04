import { View, Text } from 'react-native';
import React from 'react';
import DeviceInfo from 'react-native-device-info';
import { styles } from '../styles';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';

export default function ProfileFooter() {
  return (
    <View style={styles.footerBranding}>
      <Text style={styles.versionText} maxFontSizeMultiplier={MAX_FONT_SCALE}>
        {`Version ${DeviceInfo.getVersion()}`}
      </Text>
    </View>
  );
}

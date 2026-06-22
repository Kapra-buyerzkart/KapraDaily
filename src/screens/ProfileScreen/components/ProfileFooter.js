import { View, Text, Image } from 'react-native';
import React from 'react';
import DeviceInfo from 'react-native-device-info';
import { styles } from '../styles';

export default function ProfileFooter() {
  return (
    <View style={styles.footerBranding}>
      <View style={styles.logoWrapper}>
        <Image source={require('../../../assets/images/logoo.png')} style={styles.footerLogo} />
      </View>
      <Text style={styles.versionText}>Version {DeviceInfo.getVersion()}</Text>
    </View>
  );
}

import { View, Text } from 'react-native';
import React from 'react';
import { styles } from '../styles';

export default function ProfileUserInfo({ profile }) {
  return (
    <View style={styles.userInfoWrapper}>
      <Text style={styles.userNameText}>{profile.custName}</Text>
      <Text style={styles.phoneNumberStyle}>{profile.phoneNo}</Text>
    </View>
  );
}

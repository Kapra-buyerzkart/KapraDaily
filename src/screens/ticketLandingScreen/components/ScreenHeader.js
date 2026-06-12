import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import styles from '../styles';

const ScreenHeader = ({ navigation, insets }) => (
  <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 16 : 40 }]}>
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={[styles.backButton, { top: insets.top > 0 ? insets.top + 16 : 40 }]}
    >
      <Image source={require('../../../assets/icons/backArrow.png')} />
    </TouchableOpacity>
    <Image
      source={require('../../../assets/icons/titleText.png')}
      style={styles.titleImage}
    />
  </View>
);

export default ScreenHeader;

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { COLORS } from '../styles/colors';

const AppLoader = () => (
  <View style={styles.container}>
    <Image
      source={require('../assets/icons/kapragnd.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C382E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 91,
    tintColor: '#FFFFFF',
  },
});

export default AppLoader;

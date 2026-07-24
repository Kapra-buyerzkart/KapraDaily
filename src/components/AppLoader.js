import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { COLORS } from '../styles/colors';

const AppLoader = () => (
  <View style={styles.container}>
    <Image
      source={require('../assets/images/kapra_logo.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 126,
  },
});

export default AppLoader;

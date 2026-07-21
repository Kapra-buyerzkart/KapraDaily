import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const AppLoader = () => (
  <View style={styles.container}>
    <Image
      source={require('../assets/images/logoo.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 160,
  },
});

export default AppLoader;

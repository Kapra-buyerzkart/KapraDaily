import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const { width } = Dimensions.get('window');

const DynamicBannersSection = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/tomatobanner.png')} // TODO: Save your image here
        style={styles.imageBanner}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp('5%'),
    marginVertical: hp('2%'),
    alignItems: 'center',
    width: '100%',
  },
  imageBanner: {
    width: width - wp('10%'),
    height: (width - wp('10%')) * 1.5, // approximate aspect ratio of the 3 banners
    borderRadius: 24,
  },
});

export default DynamicBannersSection;

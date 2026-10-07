import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import images from '@/assets/images';
import { FONTS } from '@/styles/typography';
import MarqueeStrip from './MarqueeStrip';

const HomeFooter = () => {
  return (
    <View style={{ paddingTop: hp('10%') }}>
      <MarqueeStrip
        text="Quick Delivery • Secure Payments • Fresh Produce • Best Quality • Easy Returns"
        speed={40}
      />
      <View style={styles.container}>
        <Image
          source={images.bottomtag}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>
          <Text style={styles.highlight}>You made it, </Text>
          That's all for today
        </Text>
        <Text style={styles.subtitle}>
          Explore more categories for fresh deals
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: hp('3%'),
    marginTop: hp('2%'),
    marginBottom: hp('2%'),
  },
  image: {
    width: wp('60%'),
    height: wp('35%'),
    marginBottom: hp('2%'),
  },
  title: {
    fontSize: wp('3.8%'),
    fontFamily: FONTS.gilroy.regular,
    color: '#000000',
    marginBottom: hp('0.5%'),
  },
  highlight: {
    color: '#F26122',
  },
  subtitle: {
    fontSize: wp('3.8%'),
    fontFamily: FONTS.gilroy.medium,
    color: '#656565',
  },
});

export default React.memo(HomeFooter);

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ComingSoonModal from '../components/ComingSoonModal';

const TILES = [
  require('../assets/d2c/d2c2.png'),
  require('../assets/d2c/d2c1.png'),
  require('../assets/d2c/d2c3.png'),
];

const D2cScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [isComingSoonVisible, setIsComingSoonVisible] = useState(false);

  return (
    <FastImage
      source={require('../assets/d2c/d2cbg.png')}
      resizeMode={FastImage.resizeMode.cover}
      style={styles.container}
    >
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + hp('1.5%') }]}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="arrowleft" size={wp('5%')} color="#000000" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + hp('10%') },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleContainer}>
          <FastImage
            source={require('../assets/images/modal/D2C.png')}
            style={styles.logo}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>

        {TILES.map((tile, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.9}
            onPress={() => setIsComingSoonVisible(true)}
          >
            <FastImage
              source={tile}
              style={styles.tile}
              resizeMode={FastImage.resizeMode.contain}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ComingSoonModal
        visible={isComingSoonVisible}
        onClose={() => setIsComingSoonVisible(false)}
      />
    </FastImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    left: wp('5%'),
    zIndex: 10,
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: hp('5%'),
  },
  titleContainer: {
    width: wp('50%'),
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
  logo: {
    width: wp('40%'),
    height: hp('8%'),
  },
  tile: {
    width: wp('100%'),
    height: hp('22%'),
    marginBottom: hp('2.5%'),
  },
});

export default D2cScreen;

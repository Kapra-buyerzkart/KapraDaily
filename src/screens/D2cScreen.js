import React, { useState } from 'react';
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import icons from '@/assets/icons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ComingSoonModal from '../components/ComingSoonModal';
import useLandingPages from '../hooks/useLandingPages';
import { getImageUrl } from '../utils/imageUrl';
import { useFallbackImage } from '../hooks/useFallbackImage';

const TILES_FALLBACK = [
  require('../assets/d2c/d2c2.png'),
  require('../assets/d2c/d2c1.png'),
  require('../assets/d2c/d2c3.png'),
];

const findImage = (images, name) => images?.find(path => path.endsWith(name));

const D2cScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [isComingSoonVisible, setIsComingSoonVisible] = useState(false);
  const { data: landingPages } = useLandingPages();
  const d2cImages = landingPages?.d2cImages;

  const titleImagePath = findImage(d2cImages, 'D2C.png');
  const bgImagePath = findImage(d2cImages, 'd2cbg.png');
  const tileImagePaths = [
    findImage(d2cImages, 'd2camsingle.png'),
    findImage(d2cImages, 'd2cfoods.png'),
    findImage(d2cImages, 'd2cwash.png'),
  ];

  const title = useFallbackImage(
    titleImagePath && getImageUrl(titleImagePath),
    require('../assets/images/modal/D2C.png'),
  );
  const bg = useFallbackImage(
    bgImagePath && getImageUrl(bgImagePath),
    require('../assets/d2c/d2cbg.png'),
  );
  const tile0 = useFallbackImage(
    tileImagePaths[0] && getImageUrl(tileImagePaths[0]),
    TILES_FALLBACK[0],
  );
  const tile1 = useFallbackImage(
    tileImagePaths[1] && getImageUrl(tileImagePaths[1]),
    TILES_FALLBACK[1],
  );
  const tile2 = useFallbackImage(
    tileImagePaths[2] && getImageUrl(tileImagePaths[2]),
    TILES_FALLBACK[2],
  );
  const tiles = [tile0, tile1, tile2];

  return (
    <ImageBackground
      source={bg.source}
      onError={bg.onError}
      resizeMode="cover"
      style={styles.container}
    >
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + hp('1.5%') }]}
        onPress={() => navigation.goBack()}
        hitSlop={40}
      >
        <Image
          source={icons.backArrowNew}
          style={{
            resizeMode: 'contain',
            tintColor: '#000000',
          }}
        />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + hp('10%') },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleContainer}>
          <Image
            source={title.source}
            onError={title.onError}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {tiles.map((tile, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.9}
            onPress={() => setIsComingSoonVisible(true)}
          >
            <Image
              source={tile.source}
              onError={tile.onError}
              style={styles.tile}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ComingSoonModal
        visible={isComingSoonVisible}
        onClose={() => setIsComingSoonVisible(false)}
      />
    </ImageBackground>
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

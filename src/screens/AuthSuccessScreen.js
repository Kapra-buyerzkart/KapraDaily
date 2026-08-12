import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { AppContext } from '../context/appContext';
import ComingSoonModal from '../components/ComingSoonModal';
import useLandingPages, {
  findLandingImage,
  prefetchLandingPageImages,
} from '../hooks/useLandingPages';
import { getImageUrl } from '../utils/imageUrl';

const CardImage = ({ source, style }) => {
  if (!source) return <View style={style} />;
  return (
    <Image
      source={source}
      style={style}
      resizeMode="contain"
      fadeDuration={0}
      progressiveRenderingEnabled
      onError={({ nativeEvent }) =>
        console.log(
          '[AuthSuccess] image failed:',
          source.uri,
          nativeEvent?.error,
        )
      }
    />
  );
};

const AuthSuccessScreen = ({ navigation }) => {
  const { generalSettings } = useContext(AppContext);
  const [isComingSoonVisible, setIsComingSoonVisible] = useState(false);
  const { data: landingPages } = useLandingPages();
  const landingPageImages = landingPages?.landingPageImages;

  const sources = useMemo(() => {
    const toSource = name => {
      const path = findLandingImage(landingPageImages, name);
      return path ? getImageUrl(path) : null;
    };
    return {
      bg: toSource('landbg.png'),
      kapra: toSource('20min.png'),
      tickets: toSource('udentickets.png'),
      d2c: toSource(['d2cimg1.png', 'd2c.png']),
      kshope: toSource('48hrs.png'),
    };
  }, [landingPageImages]);

  useEffect(() => {
    console.log('[AuthSuccess] landing image URIs:', {
      bg: sources.bg?.uri,
      kapra: sources.kapra?.uri,
      tickets: sources.tickets?.uri,
      d2c: sources.d2c?.uri,
      kshope: sources.kshope?.uri,
    });
  }, [sources]);

  useEffect(() => {
    prefetchLandingPageImages(landingPageImages);
  }, [landingPageImages]);

  const handleKapra = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  const handleComingSoon = () => {
    setIsComingSoonVisible(true);
  };

  const handleD2c = () => {
    navigation.navigate('D2cScreen');
  };

  const handleTicketCollection = () => {
    console.log('ticket collection pressed');
    navigation.navigate('TicketSplashScreen');
  };
  const handleKshope = async () => {
    const isKshopeEnabled =
      generalSettings?.showkshope === '1' || generalSettings?.showkshope === 1;
    console.log(
      '[Kshope] showkshope value:',
      generalSettings?.showkshope,
      '| isKshopeEnabled:',
      isKshopeEnabled,
    );

    if (!isKshopeEnabled) {
      console.log('[Kshope] Disabled from backend. Showing Coming Soon.');
      handleComingSoon();
      return;
    }

    navigation.navigate('Deals48');
  };

  return (
    <View style={styles.screen}>
      {/* <ImageBackground
        source={sources.bg}
        resizeMode="cover"
        fadeDuration={0}
        style={styles.container}
      > */}
      <StatusBar
        translucent
        contentStyle="dark-content"
        backgroundColor="transparent"
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/splash/header.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {}
        <View style={styles.cardsContainer}>
          {}
          <TouchableOpacity activeOpacity={0.9} onPress={handleKapra}>
            <CardImage source={sources.kapra} style={styles.largeCard} />
          </TouchableOpacity>

          {}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleTicketCollection}
          >
            <CardImage source={sources.tickets} style={styles.largeCard} />
          </TouchableOpacity>
          {}
          <View style={styles.row}>
            {}
            <TouchableOpacity activeOpacity={0.9} onPress={handleD2c}>
              <CardImage source={sources.d2c} style={styles.smallCard} />
            </TouchableOpacity>
            {}
            <TouchableOpacity activeOpacity={0.9} onPress={handleKshope}>
              <CardImage source={sources.kshope} style={styles.smallCard} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {}
      {}

      {}
      <ComingSoonModal
        visible={isComingSoonVisible}
        onClose={() => setIsComingSoonVisible(false)}
      />
      {/* </ImageBackground> */}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: hp('5%'),
    paddingBottom: hp('8%'),
  },
  logoContainer: {},
  logo: {
    width: wp('70%'),
    height: hp('20%'),
  },
  cardsContainer: {
    width: wp('90%'),
    alignItems: 'center',
  },
  largeCard: {
    width: wp('90%'),
    height: hp('22%'),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('90%'),
  },
  smallCard: {
    width: wp('44.5%'),
    height: hp('22%'),
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  skylineImage: {
    width: '100%',
    height: hp('10%'),
  },
});

export default AuthSuccessScreen;

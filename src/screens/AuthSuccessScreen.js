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

  // Every slot is served straight from the landingpages API — no bundled
  // fallbacks. A slot renders empty if its file is missing on the image host.
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

  // const handleKshope = () => {
  //     const isKshopeEnabled = generalSettings?.showkshope === '1' || generalSettings?.showkshope === 1;

  //     if (isKshopeEnabled) {
  //         const storeUrl = Platform.OS === 'ios'
  //             ? (generalSettings?.kshope_ios_url || 'https://apps.apple.com/in/app/uden-deal/id6448085736')
  //             : (generalSettings?.kshope_android_url || 'https://play.google.com/store/apps/details?id=com.kshope');

  //         Linking.openURL(storeUrl).catch(err => {
  //             console.error('Failed to open store URL:', err);
  //             handleComingSoon();
  //         });
  //     } else {
  //     }
  // };

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

    // 48hrs Deals is served in-process now (src/modules/deals48), so this no
    // longer deep-links out to the standalone udmv:// app or falls back to its
    // store listing. The showkshope gate above still applies.
    navigation.navigate('Deals48');
  };

  return (
    <View style={styles.screen}>
      <ImageBackground
        source={sources.bg}
        resizeMode="cover"
        fadeDuration={0}
        style={styles.container}
      >
        <StatusBar
          translucent
          contentStyle="dark-content"
          backgroundColor="transparent"
        />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/splash/header.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Deal Cards Section */}
          <View style={styles.cardsContainer}>
            {/* 20 minss deal - Large Card (Kapra) */}
            <TouchableOpacity activeOpacity={0.9} onPress={handleKapra}>
              <CardImage source={sources.kapra} style={styles.largeCard} />
            </TouchableOpacity>

            {/* Uden Tickets - Large Card */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleTicketCollection}
            >
              <CardImage source={sources.tickets} style={styles.largeCard} />
            </TouchableOpacity>
            {/* Small Cards Row */}
            <View style={styles.row}>
              {/* D2C */}
              <TouchableOpacity activeOpacity={0.9} onPress={handleD2c}>
                <CardImage source={sources.d2c} style={styles.smallCard} />
              </TouchableOpacity>
              {/* 48 Hrs Deal */}
              <TouchableOpacity activeOpacity={0.9} onPress={handleKshope}>
                <CardImage source={sources.kshope} style={styles.smallCard} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Section (Skyline) */}
        {/* <View style={styles.bottomSection}>
                  <Image
                      source={require('../assets/images/splash/Vancouver.png')}
                      style={styles.skylineImage}
                      resizeMode="stretch"
                  />
              </View> */}

        {/* Custom Coming Soon Popup */}
        <ComingSoonModal
          visible={isComingSoonVisible}
          onClose={() => setIsComingSoonVisible(false)}
        />
      </ImageBackground>
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
  logoContainer: {
    // marginBottom: hp('2%'),
  },
  logo: {
    width: wp('70%'),
    height: hp('20%'),
  },
  cardsContainer: {
    width: wp('90%'),
    alignItems: 'center',
    //  marginTop: hp('2%'),
  },
  largeCard: {
    width: wp('90%'),
    height: hp('22%'),
    //marginTop: -hp('10%'),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('90%'), // Match width of the large card
    //  marginTop: -hp('8%'),
  },
  smallCard: {
    width: wp('44.5%'), // Slightly larger to create a small gap in a 90% row
    height: hp('22%'),
    //  backgroundColor:'red'
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

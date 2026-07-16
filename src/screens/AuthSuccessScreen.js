import React, { useContext, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Linking,
  Platform,
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
import useLandingPagesQuery from '../queries/useLandingPagesQuery';
import { getImageUrl } from '../utils/imageUrl';
import { useFallbackImage } from '../hooks/useFallbackImage';

const { width } = Dimensions.get('window');

const findImage = (images, name) => images?.find(path => path.endsWith(name));

const AuthSuccessScreen = ({ navigation }) => {
  const { generalSettings } = useContext(AppContext);
  const [isComingSoonVisible, setIsComingSoonVisible] = useState(false);
  const { data: landingPages } = useLandingPagesQuery();
  const landingPageImages = landingPages?.landingPageImages;

  const bgImagePath = findImage(landingPageImages, 'landbg.png');
  const kapraImagePath = findImage(landingPageImages, '20min.png');
  const ticketsImagePath = findImage(landingPageImages, 'udentickets.png');
  const d2cImagePath = findImage(landingPageImages, 'd2c.png');
  const kshopeImagePath = findImage(landingPageImages, '48hrs.png');

  const bg = useFallbackImage(
    bgImagePath && getImageUrl(bgImagePath),
    require('../assets/images/splash/backgroundbg.png'),
  );
  const kapra = useFallbackImage(
    kapraImagePath && getImageUrl(kapraImagePath),
    require('../assets/images/splash/udendeal.png'),
  );
  const tickets = useFallbackImage(
    ticketsImagePath && getImageUrl(ticketsImagePath),
    require('../assets/images/splash/Frame 1216249942 1.png'),
  );
  const d2c = useFallbackImage(
    // d2cImagePath && getImageUrl(d2cImagePath),
    require('../assets/images/splash/Frame 1216249941 1.png'),
  );
  const kshope = useFallbackImage(
    kshopeImagePath && getImageUrl(kshopeImagePath),
    require('../assets/images/splash/Frame 1216249939 1.png'),
  );

  console.log('[AuthSuccessScreen] remote image URIs:', {
    bg: bg.source?.uri,
    kapra: kapra.source?.uri,
    tickets: tickets.source?.uri,
    d2c: d2c.source?.uri,
    kshope: kshope.source?.uri,
  });

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

    const deepLink = 'udmv://';
    const storeUrl =
      Platform.OS === 'ios'
        ? generalSettings?.kshope_ios_url ||
          'https://apps.apple.com/in/app/uden-deal/id6448085736'
        : generalSettings?.kshope_android_url ||
          'https://play.google.com/store/apps/details?id=com.kshope';

    try {
      console.log('[Kshope] Attempting to open deep link:', deepLink);
      await Linking.openURL(deepLink);
      console.log('[Kshope] Deep link opened successfully');
    } catch (deepLinkErr) {
      console.warn(
        '[Kshope] Deep link failed, app not installed. Redirecting to store:',
        storeUrl,
      );
      try {
        await Linking.openURL(storeUrl);
      } catch (storeErr) {
        console.error('[Kshope] Store URL also failed:', storeErr);
        handleComingSoon();
      }
    }
  };

  return (
    // <View style={styles.container}>
    <ImageBackground
      source={bg.source}
      onError={bg.onError}
      resizeMode="cover"
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
            <Image
              source={kapra.source}
              onError={kapra.onError}
              style={styles.largeCard}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Uden Tickets - Large Card */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleTicketCollection}
          >
            <Image
              source={tickets.source}
              onError={tickets.onError}
              style={styles.largeCard}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {/* Small Cards Row */}
          <View style={styles.row}>
            {/* D2C */}
            <TouchableOpacity activeOpacity={0.9} onPress={handleD2c}>
              <Image
                source={d2c.source}
                onError={d2c.onError}
                style={styles.smallCard}
                resizeMode="contain"
              />
            </TouchableOpacity>
            {/* 48 Hrs Deal */}
            <TouchableOpacity activeOpacity={0.9} onPress={handleKshope}>
              <Image
                source={kshope.source}
                onError={kshope.onError}
                style={styles.smallCard}
                resizeMode="contain"
              />
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
    // </View>
  );
};

const styles = StyleSheet.create({
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

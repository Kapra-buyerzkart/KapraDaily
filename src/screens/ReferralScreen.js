import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Share,
  StatusBar,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import icons from '@/assets/icons';
import images from '@/assets/images';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { FONTS } from '../styles/typography';
import { AppContext } from '../context/appContext';
import CONFIG from '../globals/config';

const ReferralScreen = () => {
  const navigation = useNavigation();
  const { profile } = useContext(AppContext);

  const bCoinBalance = Number(
    profile?.totalBCoins || profile?.bCoins || 0,
  ).toFixed(1);

  const onShare = async () => {
    try {
      const shareUrl = `${CONFIG.referalUrl}refer/register?custrefcd=${
        profile?.referralCode || ''
      }`;
      const message = `Hey! Download UdenDeal and get fresh groceries delivered to your doorstep. Join me using my referral code: ${
        profile?.referalCode || 'WELCOME'
      } and enjoy exclusive rewards! Download now: ${shareUrl}`;
      await Share.share({ message });
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  return (
    <ImageBackground
      source={images.referBg}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            hitSlop={40}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Image
              source={icons.backArrowNew}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Refer and Earn</Text>
          <View style={styles.coinBadge}>
            <Image source={images.bcoinn} style={styles.coinIcon} />
            <Text style={styles.coinText}>{bCoinBalance} B</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.heroCard}>
            <Image
              source={images.referIcon}
              style={styles.heroImage}
              resizeMode="contain"
            />
            <Text style={styles.heroText}>SHARE & EARN</Text>
          </View>

          <TouchableOpacity
            style={styles.shareButton}
            activeOpacity={0.85}
            onPress={onShare}
          >
            <MaterialCommunityIcons
              name="share-variant"
              size={wp('5%')}
              color="#FFFFFF"
            />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            hitSlop={20}
            onPress={() => navigation.navigate('ReferralHistoryScreen')}
          >
            <Text style={styles.historyLink}>Refer history</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default ReferralScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#5B199B',
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('1.5%'),
    marginTop: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.12)',
  },
  backButton: {
    width: wp('9%'),
    height: wp('9%'),
    borderRadius: wp('4.5%'),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: wp('4.5%'),
    height: wp('4.5%'),
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.65%'),
    marginLeft: wp('3%'),
  },
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D0A4E',
    borderRadius: wp('4%'),
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.5%'),
    borderWidth: 1,
    borderColor: '#F9A833',
  },
  coinIcon: {
    width: wp('5%'),
    height: wp('5%'),
    resizeMode: 'contain',
    marginRight: wp('1.5%'),
  },
  coinText: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.2%'),
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('6%'),
    paddingBottom: hp('6%'),
  },
  heroCard: {
    width: wp('72%'),
    backgroundColor: '#F9B213',
    borderRadius: wp('6%'),
    borderWidth: wp('1.2%'),
    borderColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: hp('2.5%'),
    paddingBottom: hp('3%'),
    paddingHorizontal: wp('4%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  heroImage: {
    width: wp('58%'),
    height: wp('62%'),
  },
  heroText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('7.5%'),
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginTop: hp('1%'),
    textAlign: 'center',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F25000',
    borderRadius: wp('3%'),
    paddingVertical: hp('1.9%'),
    width: wp('72%'),
    marginTop: hp('4%'),
    shadowColor: '#F25000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.5%'),
    marginLeft: wp('2.5%'),
  },
  historyLink: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4%'),
    marginTop: hp('2.5%'),
    textDecorationLine: 'underline',
  },
});

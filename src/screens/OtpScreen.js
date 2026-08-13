import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import logger from '../utils/logger';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import { useNavigation, useRoute } from '@react-navigation/native';
import secureStore from '../utils/secureStore';
import { useCart } from '../context/CartContext';
import {
  verifyLoginOtp,
  verifyLoginOtpEmail,
  sendLoginOtp,
  verifyForgotPwdOtp,
  resendLoginOtp,
  resendForgotPwdOtp,
  verifyRegisterOtp,
  sendRegisterOtp,
} from '../api';
import RNOtpVerify from 'react-native-otp-verify';
import { AppContext } from '../context/appContext';
import { OneSignal } from 'react-native-onesignal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HelpSupportModal from '../components/HelpSupportModal';
import EmailOtpBottomSheet from '../components/EmailOtpBottomSheet';
import { setTokens } from '../api/tokenService';
import images from '@/assets/images';

const EMAIL_OTP_FALLBACK_RESEND_THRESHOLD = 1;

const mergeCustomerIdIntoProfile = async custId => {
  const storedProfile = await secureStore.getItem('profile');
  const existingProfile = storedProfile ? JSON.parse(storedProfile) : {};

  const updatedProfile = {
    ...existingProfile,
    custId,
  };

  await secureStore.setItem('profile', JSON.stringify(updatedProfile));
};

const OtpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { showStatus } = useCart();
  const { phone, type } = route.params || {};
  const { loadProfile } = React.useContext(AppContext);

  const [otp, setOtp] = useState(['', '', '', '', '']);
  const inputRefs = Array.from({ length: 5 }, () => useRef(null));

  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [otpEmail, setOtpEmail] = useState(null);
  const helpSheetRef = useRef(null);
  const emailOtpSheetRef = useRef(null);

  const otpHandler = message => {
    try {
      const otpMatch = /(\d{5})/g.exec(message);
      if (otpMatch && otpMatch[1]) {
        const autoOtp = otpMatch[1];
        const otpArray = autoOtp.split('');
        setOtp(otpArray);
        Keyboard.dismiss();
        RNOtpVerify.removeListener();
      }
    } catch (error) {
      logger.log('OTP Parse Error:', error);
    }
  };

  useEffect(() => {
    const sendOtpOnLoad = async () => {
      logger.log('[OTP] screen mounted — type:', type, '| phone:', phone);
      if (!phone) {
        logger.warn('[OTP] phone is undefined/null — OTP not sent');
        return;
      }

      try {
        setLoading(true);

        if (type === 'login') {
          logger.log('[OTP] sending login OTP to', phone);
          await sendLoginOtp(phone);
          logger.log('[OTP] login OTP request sent');
        }

        if (type === 'register') {
          logger.log('[OTP] sending register OTP to', phone);
          await sendRegisterOtp(phone);
          logger.log('[OTP] register OTP request sent');
        }
      } catch (error) {
        logger.log('[OTP] Send OTP Error — raw:', error);
        logger.log('[OTP] error.message:', error?.message);
        logger.log(
          '[OTP] error.response:',
          JSON.stringify(error?.response?.data),
        );
        showStatus({
          type: 'error',
          title: 'Error',
          message: error?.message || 'Failed to send OTP',
        });
      } finally {
        setLoading(false);
      }
    };

    sendOtpOnLoad();
  }, [type, phone]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const startOtpListener = async () => {
      try {
        await RNOtpVerify.getHash();
        await RNOtpVerify.getOtp();
        RNOtpVerify.addListener(otpHandler);
      } catch (error) {
        logger.log('OTP Auto Fetch Error:', error);
      }
    };

    startOtpListener();

    return () => {
      RNOtpVerify.removeListener();
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isResendDisabled) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < inputRefs.length - 1) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleContinueLogin = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 5) {
      showStatus({
        type: 'error',
        title: 'Error',
        message: 'Please enter complete OTP',
      });
      return;
    }

    try {
      setLoading(true);
      const response = otpEmail
        ? await verifyLoginOtpEmail(otpEmail, enteredOtp)
        : await verifyLoginOtp(phone, enteredOtp);

      console.log('[OTP VERIFY login] request:', {
        otpEmail,
        phone,
        enteredOtp,
      });
      console.log('[OTP VERIFY login] response:', response);

      if (response?.success && response?.data) {
        const { accessToken, refreshToken, custId } = response.data;
        await setTokens(accessToken, refreshToken);

        if (custId) {
          await mergeCustomerIdIntoProfile(custId);
          OneSignal.login(custId.toString());
        }

        if (loadProfile) {
          await loadProfile();
        }

        navigation.reset({
          index: 0,
          routes: [{ name: 'AuthSuccessScreen' }],
        });
      } else {
        showStatus({
          type: 'error',
          title: 'Error',
          message: response?.message || 'OTP verification failed',
        });
      }
    } catch (error) {
      console.log('[OTP VERIFY] error:', error);
      showStatus({
        type: 'error',
        title: 'Error',
        message: error || 'Failed to verify OTP',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinueRegister = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 5) {
      showStatus({
        type: 'error',
        title: 'Error',
        message: 'Please enter complete OTP',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await verifyRegisterOtp(phone, enteredOtp);

      console.log('[OTP VERIFY register] request:', { phone, enteredOtp });
      console.log('[OTP VERIFY register] response:', response);

      if (response?.success && response?.data) {
        const registerToken = response.data.registerToken;
        navigation.navigate('RegistraionScreen', {
          registerToken,
          phone,
        });

      } else {
        showStatus({
          type: 'error',
          title: 'Error',
          message: response?.message || 'OTP verification failed',
        });
      }
    } catch (error) {
      console.log('[OTP VERIFY] error:', error);
      showStatus({
        type: 'error',
        title: 'Error',
        message: error || 'Failed to verify OTP',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinueReset = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 5) {
      showStatus({
        type: 'error',
        title: 'Error',
        message: 'Please enter complete OTP',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await verifyForgotPwdOtp(phone, enteredOtp);

      console.log('[OTP VERIFY reset] request:', { phone, enteredOtp });
      console.log('[OTP VERIFY reset] response:', response);

      if (response?.success && response?.data) {

        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'ChangePwdScreen',
              params: { resetToken: response?.data?.resetToken, phone },
            },
          ],
        });
      } else {
        showStatus({
          type: 'error',
          title: 'Error',
          message: response?.message || 'OTP verification failed',
        });
      }
    } catch (error) {
      console.log('[OTP VERIFY] error:', error);
      showStatus({
        type: 'error',
        title: 'Error',
        message: error || 'Failed to verify OTP',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      if (type === 'login') {
        await resendLoginOtp(phone);
      }
      if (type === 'reset') {
        await resendForgotPwdOtp(phone);
      }
      showStatus({
        type: 'success',
        title: 'Success',
        message: 'OTP resent successfully',
      });
      setOtp(['', '', '', '', '']);
      inputRefs[0].current?.focus();
      setTimer(30);
      setIsResendDisabled(true);
      setResendCount(prev => prev + 1);
    } catch (error) {
      logger.log('Resend OTP Error:', error);
      showStatus({
        type: 'error',
        title: 'Error',
        message: error?.message || 'Failed to resend OTP',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEmailOtpSheet = React.useCallback(() => {
    emailOtpSheetRef.current?.open();
  }, []);

  const handleEmailOtpSuccess = email => {
    setOtpEmail(email);
    setOtp(['', '', '', '', '']);
    inputRefs[0].current?.focus();
    showStatus({
      type: 'success',
      title: 'Success',
      message: 'OTP has been sent to your email.',
    });
  };

  const handleEmailOtpError = React.useCallback(
    message => {
      showStatus({
        type: 'error',
        title: 'Error',
        message: message || 'Failed to send OTP to email',
      });
    },
    [showStatus],
  );

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.helpButtonSafeArea}>
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => helpSheetRef.current?.open()}
        >
          <MaterialIcons name="help-outline" size={wp('5%')} color="#FFFFFF" />
          <Text style={styles.helpButtonText}>Help</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <HelpSupportModal ref={helpSheetRef} />

      {}
      <View style={styles.imagePreloader} pointerEvents="none">
        <Image
          source={require('../assets/images/splash/backgroundbg.png')}
          style={styles.preloadBg}
          resizeMode="cover"
        />
        <Image
          source={require('../assets/images/splash/header.png')}
          style={styles.preloadLogo}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/images/splash/udendeal.png')}
          style={styles.preloadLarge}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/images/splash/48hrs.png')}
          style={styles.preloadLarge}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/images/splash/ticket.png')}
          style={styles.preloadSmall}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/images/splash/d2c.png')}
          style={styles.preloadSmall}
          resizeMode="contain"
        />
      </View>
      {}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ImageBackground
            style={styles.backgroundImage}
            source={images.login_landing}
          >
            <View />
            <Image
              style={styles.tagLine}
              source={require('../assets/images/login_content.png')}
            />
          </ImageBackground>

          <View style={styles.bottomContainer}>
            <Text style={styles.headerText}>
              {type === 'login'
                ? 'Login'
                : type === 'reset'
                ? 'Forgot Password'
                : 'Register'}
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('LoginScreen', {
                  type: type,
                })
              }
              style={styles.phoneNoEditContainer}
            >
              <Text style={styles.phoneNoText}>{phone}</Text>
              <Image
                style={
                  Platform.OS === 'android'
                    ? [styles.editIconImage, { bottom: hp('0.2%') }]
                    : styles.editIconImage
                }
                tintColor={'#000000'}
                source={require('../assets/images/edit_icon.png')}
              />
            </TouchableOpacity>
            <Text style={styles.otpSentText}>
              OTP has been sent to your phone & WhatsApp
            </Text>
            <Text style={styles.enterNumberText}>Enter OTP</Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <View style={styles.numberBox} key={index}>
                  <TextInput
                    ref={inputRefs[index]}
                    style={styles.otpInput}
                    keyboardType="numeric"
                    maxLength={1}
                    value={digit}
                    textContentType="oneTimeCode"
                    autoComplete="sms-otp"
                    onChangeText={text => handleChange(text, index)}
                    onKeyPress={e => handleKeyPress(e, index)}
                  />
                </View>
              ))}
            </View>

            <View style={styles.pwdResendTimeContainer}>
              {type === 'login' ? (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('LoginPwdScreen', {
                      phone,
                    })
                  }
                >
                  <Text style={styles.usePwdText}>Use password</Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {isResendDisabled ? (
                  <>
                    <Text style={[styles.usePwdText, { color: '#616161' }]}>
                      Resend OTP in{' '}
                    </Text>
                    <Text style={styles.time}>
                      {Math.floor(timer / 60)}:
                      {String(timer % 60).padStart(2, '0')}
                    </Text>
                  </>
                ) : (
                  <TouchableOpacity style={{}} onPress={handleResendOtp}>
                    <Text style={[styles.usePwdText, { color: '#F25000' }]}>
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {}

            <TouchableOpacity
              style={styles.continueButton}
              onPress={
                type === 'login'
                  ? handleContinueLogin
                  : type === 'reset'
                  ? handleContinueReset
                  : handleContinueRegister
              }
            >
              {loading ? (
                <ActivityIndicator size={'large'} color={'#FFFFFF'} />
              ) : (
                <Text style={styles.continueButtonText}>Continue</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  helpButtonSafeArea: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('5%'),
    marginTop: hp('1.5%'),
    marginRight: wp('4%'),
    gap: wp('1.2%'),
  },
  helpButtonText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.25%'),
    color: '#FFFFFF',
  },
  imagePreloader: {
    position: 'absolute',
    width: wp('100%'),
    height: hp('100%'),
    opacity: 0,
    zIndex: -1,
  },
  preloadBg: { width: wp('100%'), height: hp('100%') },
  preloadLogo: { width: wp('70%'), height: hp('20%') },
  preloadLarge: { width: wp('90%'), height: hp('22%') },
  preloadSmall: { width: wp('44.5%'), height: hp('22%') },
  backgroundImage: {
    width: wp('100%'),
    height: hp('60%'),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: hp('6%'),
    paddingBottom: hp('7.5%'),
  },
  kapraLogo: { width: wp('47%'), height: hp('10%'), resizeMode: 'cover' },
  tagLine: { width: wp('50.7%'), height: hp('16.95%'), resizeMode: 'cover' },
  bottomContainer: {
    paddingHorizontal: wp('5.8%'),
    paddingTop: hp('3.5%'),
    paddingBottom: hp('5%'),
    borderTopLeftRadius: wp('9.3%'),
    borderTopRightRadius: wp('9.3%'),
    backgroundColor: '#FFFFFF',
    marginTop: -hp('5%'),
  },
  headerText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.65%'),
    color: '#000000',
    alignSelf: 'center',
  },
  phoneNoEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1%'),
    alignSelf: 'center',
    marginBottom: hp('1%'),
  },
  phoneNoText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.72%'),
    color: '#000000',
  },
  otpSentText: {
    fontFamily: FONTS.gilroy.light,
    fontSize: wp('3.12%'),
    color: '#616161',
    alignSelf: 'center',
    marginBottom: hp('3%'),
  },
  editIconImage: {
    width: wp('2.79%'),
    height: wp('2.79%'),
    marginLeft: wp('2%'),
  },
  enterNumberText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.72%'),
    color: '#616161',
    paddingBottom: 20,
    marginBottom: hp('0.5%'),
    alignSelf: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
  },
  numberBox: {
    width: wp('13.95%'),
    height: hp('5.36%'),
    backgroundColor: '#DADADA',
    borderRadius: wp('2.33%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInput: { fontSize: wp('4.5%'), textAlign: 'center', width: '100%' },
  pwdResendTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('0.8%'),
    paddingHorizontal: wp('5%'),
  },
  usePwdText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.25%'),
    color: '#F25000',
  },
  time: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.25%'),
    color: '#616161',
  },
  emailFallbackContainer: {
    alignSelf: 'center',
    marginTop: hp('1.8%'),
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('2%'),
  },
  emailFallbackText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.25%'),
    color: '#616161',
    textAlign: 'center',
  },
  emailFallbackLink: {
    fontFamily: FONTS.gilroy.medium,
    color: '#F25000',
  },
  continueButton: {
    backgroundColor: '#F25000',
    width: '100%',
    height: hp('6.11%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('2.33%'),
    marginTop: hp('3.5%'),
  },
  continueButtonText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.18%'),
    color: '#FFFFFF',
  },
});

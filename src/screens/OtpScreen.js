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
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../context/CartContext';
import {
  verifyLoginOtp,
  sendLoginOtp,
  sendForgotPwdOtp,
  verifyForgotPwdOtp,
  resendOtp,
  resendLoginOtp,
  resendForgotPwdOtp,
  verifyRegisterOtp,
  registerUser,
  sendRegisterOtp,
} from '../api'; // ✅ add sendLoginOtp
import { setResetToken } from '../api/tokenService';
import RNOtpVerify from 'react-native-otp-verify';
import { AppContext } from '../context/appContext';
import { OneSignal } from 'react-native-onesignal';
import FastImage from 'react-native-fast-image';

const ACCESS_TOKEN = 'ACCESS_TOKEN';
const REFRESH_TOKEN = 'REFRESH_TOKEN';

const setTokens = async (accessToken, refreshToken) => {
  await AsyncStorage.multiSet([
    [ACCESS_TOKEN, accessToken],
    [REFRESH_TOKEN, refreshToken],
  ]);
};

const mergeCustomerIdIntoProfile = async custId => {
  // console.log('????????', custId)
  const storedProfile = await AsyncStorage.getItem('profile');
  const existingProfile = storedProfile ? JSON.parse(storedProfile) : {};

  const updatedProfile = {
    ...existingProfile,
    custId,
  };

  // console.log('updatedProfile', updatedProfile)

  await AsyncStorage.setItem('profile', JSON.stringify(updatedProfile));
};

const OtpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { showStatus } = useCart();
  const {
    phone,
    type,
    name,
    email,
    password,
    whatsAppNo,
    referCode,
    pincodeAreaId,
  } = route.params || {};
  const { loadProfile } = React.useContext(AppContext);

  const [otp, setOtp] = useState(['', '', '', '', '']);
  const inputRefs = Array.from({ length: 5 }, () => useRef(null));

  const [timer, setTimer] = useState(60); // 1 minute
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

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
      console.log('OTP Parse Error:', error);
    }
  };

  useEffect(() => {
    const sendOtpOnLoad = async () => {
      console.log('[OTP] screen mounted — type:', type, '| phone:', phone);
      if (!phone) {
        console.warn('[OTP] phone is undefined/null — OTP not sent');
        return;
      }

      try {
        setLoading(true);

        if (type === 'login') {
          console.log('[OTP] sending login OTP to', phone);
          const res = await sendLoginOtp(phone);
          console.log('[OTP] login OTP response:', JSON.stringify(res));
        }

        if (type === 'register') {
          console.log('[OTP] sending register OTP to', phone);
          const res = await sendRegisterOtp(phone);
          console.log('[OTP] register OTP response:', JSON.stringify(res));
        }
      } catch (error) {
        console.log('[OTP] Send OTP Error — raw:', error);
        console.log('[OTP] error.message:', error?.message);
        console.log(
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
        console.log('OTP Auto Fetch Error:', error);
      }
    };

    startOtpListener();

    return () => {
      RNOtpVerify.removeListener();
    };
  }, []);

  // Countdown effect
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
    // console.log('enteredOtp', enteredOtp)
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
      const response = await verifyLoginOtp(phone, enteredOtp);
      // console.log('Verify OTP Response:', response);

      if (response?.success && response?.data) {
        // console.log("mmmmmmm")
        const { accessToken, refreshToken, custId } = response.data;
        await setTokens(accessToken, refreshToken);

        if (custId) {
          await mergeCustomerIdIntoProfile(custId);
          OneSignal.login(custId.toString());
        }

        // 🔥 Fetch the actual profile from backend so the home screen shows their real saved location!
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
      console.log('Verify OTP Error:', error);
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
    // console.log('enteredOtp', enteredOtp)
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
      // console.log('Verify OTP Response:', response);

      if (response?.success && response?.data) {
        const registerToken = response.data.registerToken;
        navigation.navigate('RegistraionScreen', {
          registerToken,
          phone,
        });
        // console.log('registerToken', registerToken)
        // console.log('name', name)
        // console.log('email', email)
        // console.log('password', password)
        // console.log('whatsAppNo', whatsAppNo)
        // console.log('referCode', referCode)
        // console.log('pincodeAreaId', pincodeAreaId)
        // const registerResponse = await registerUser({ registerToken, name, email, password, whatsAppNo, referCode, pincodeAreaId, });
        // console.log('Register User Response:', registerResponse);
        // navigation.reset({
        //     index: 0,
        //     routes: [{ name: 'MainTabs' }],
        // });
        // if (registerResponse?.success) {
        //     showStatus({
        //         type: 'success',
        //         title: 'Success',
        //         message: 'Registration completed successfully',
        //         // onClose: () => navigation.navigate('LoginScreen')
        //         onClose: async () => {
        //             const { accessToken, refreshToken, custId } = registerResponse.data;
        //             await setTokens(accessToken, refreshToken);
        //             if (custId) {
        //                 await mergeCustomerIdIntoProfile(custId);
        //             }

        //             navigation.reset({
        //                 index: 0,
        //                 routes: [{ name: 'MainTabs' }],
        //             });
        //         }

        //     });
        // } else {
        //     showStatus({
        //         type: 'error',
        //         title: 'Error',
        //         message: registerResponse?.message || 'Registration failed'
        //     });
        // }
      } else {
        showStatus({
          type: 'error',
          title: 'Error',
          message: response?.message || 'OTP verification failed',
        });
      }
    } catch (error) {
      console.log('Verify OTP Error:', error);
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
      // console.log('Verify OTP Response:', response);

      if (response?.success && response?.data) {
        // const { accessToken, refreshToken } = response.data;
        // await setResetToken(response?.data?.resetToken);

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
      console.log('Verify OTP Error:', error);
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
      setOtp(['', '', '', '', '']); // clear inputs
      inputRefs[0].current?.focus();
      setTimer(60);
      setIsResendDisabled(true);
    } catch (error) {
      console.log('Resend OTP Error:', error);
      showStatus({
        type: 'error',
        title: 'Error',
        message: error?.message || 'Failed to resend OTP',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Pre-warm the heavy AuthSuccessScreen images while the user types the
          OTP, so the next screen renders from cache instead of decoding
          multi-MB PNGs on mount. Hidden + non-interactive. */}
      <View style={styles.imagePreloader} pointerEvents="none">
        <FastImage
          source={require('../assets/images/splash/backgroundbg.png')}
          style={styles.preloadBg}
          resizeMode={FastImage.resizeMode.cover}
        />
        <FastImage
          source={require('../assets/images/splash/header.png')}
          style={styles.preloadLogo}
          resizeMode={FastImage.resizeMode.contain}
        />
        <FastImage
          source={require('../assets/images/splash/udendeal.png')}
          style={styles.preloadLarge}
          resizeMode={FastImage.resizeMode.contain}
        />
        <FastImage
          source={require('../assets/images/splash/48hrs.png')}
          style={styles.preloadLarge}
          resizeMode={FastImage.resizeMode.contain}
        />
        <FastImage
          source={require('../assets/images/splash/ticket.png')}
          style={styles.preloadSmall}
          resizeMode={FastImage.resizeMode.contain}
        />
        <FastImage
          source={require('../assets/images/splash/d2c.png')}
          style={styles.preloadSmall}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
      {/* {console.log('type', type)} */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <ImageBackground
            style={styles.backgroundImage}
            source={require('../assets/images/login_background_image.jpg')}
          >
            <Image
              style={styles.kapraLogo}
              source={require('../assets/images/kapra_logo.png')}
            />
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
              OTP has been sent to your phone & email
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
                  <TouchableOpacity onPress={handleResendOtp}>
                    <Text style={[styles.usePwdText, { color: '#F25000' }]}>
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

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
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FFFFFF' },
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
    fontFamily: FONTS.poppins.semiBold,
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
    fontFamily: FONTS.poppins.regular,
    fontSize: wp('3.72%'),
    color: '#000000',
  },
  otpSentText: {
    fontFamily: FONTS.poppins.light,
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
    fontFamily: FONTS.poppins.regular,
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
    fontFamily: FONTS.poppins.regular,
    fontSize: wp('3.25%'),
    color: '#F25000',
  },
  time: {
    fontFamily: FONTS.poppins.medium,
    fontSize: wp('3.25%'),
    color: '#616161',
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
    fontFamily: FONTS.poppins.bold,
    fontSize: wp('4.18%'),
    color: '#FFFFFF',
  },
});

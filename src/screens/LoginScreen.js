import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import React, { useState, useContext, useRef, useEffect } from 'react';
import logger from '../utils/logger';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { checkPhone, sendForgotPwdOtp, sendLoginOtp } from '../api';
import { setTokens } from '../api/tokenService';
import LoaderComponent from '../components/LoaderComponent';
import { LoaderContext } from '../context/loaderContext';
import { validatePhoneNumbers } from '../utils/validation';

const LoginScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { showStatus } = useCart();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const { type } = route.params || {};
  const { showLoader } = useContext(LoaderContext);

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslate = useRef(new Animated.Value(-24)).current;
  const tagLineOpacity = useRef(new Animated.Value(0)).current;
  const tagLineTranslate = useRef(new Animated.Value(24)).current;
  const bottomOpacity = useRef(new Animated.Value(0)).current;
  const bottomTranslate = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.stagger(180, [
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslate, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(tagLineOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(tagLineTranslate, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(bottomOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(bottomTranslate, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const phoneNumber = '8137956574';

  // const handleContinue = async () => {
  //     logger.log(phone);
  //     logger.log('type', type);

  //     if (phone.length !== 10) {
  //         Alert.alert('Error', 'Please enter a valid mobile number');
  //         return;
  //     }

  //     try {
  //         setLoading(true);
  //         let response
  //         if (type === 'login') {
  //             response = await sendLoginOtp(phone);
  //         }
  //         if (type === 'reset') {
  //             response = await sendForgotPwdOtp(phone);
  //         }
  //         logger.log('response', response)
  //         logger.log('OTP Response:', response);

  //         if (response?.success && response?.data) {
  //             navigation.navigate('OtpScreen', {
  //                 phone
  //             });
  //         } else {
  //             Alert.alert('Error', response?.message || 'Failed to send OTP');
  //         }
  //     } catch (error) {
  //         logger.log('OTP Error:', error);
  //         Alert.alert('Error', error?.Message || error?.message || 'Failed to send OTP');
  //     } finally {
  //         setLoading(false);
  //     }
  // };

  // const handleContinueLogin = async () => {
  //     // logger.log('Login')
  //     // logger.log(phone);
  //     // logger.log('type', type);

  //     if (!validatePhoneNumbers(phone)) {
  //         showStatus({
  //             type: 'error',
  //             title: 'Error',
  //             message: 'Please enter a valid mobile number'
  //         });
  //         return;
  //     }

  //     try {
  //         setLoading(true);
  //         showLoader(true);
  //         const response = await sendLoginOtp(phone);
  //         logger.log('handleContinueLoginresponse', response)
  //         // logger.log('OTP Response:', response);

  //         if (response?.success && response?.data) {
  //             navigation.navigate('OtpScreen', {
  //                 phone,
  //                 type: 'login'
  //             });
  //         }
  //         else if (response?.status === 'NOT_REGISTERED') {
  //             navigation.navigate('RegistraionScreen', {
  //                 phone
  //             });
  //         }
  //         else {
  //             showStatus({
  //                 type: 'error',
  //                 title: 'Error',
  //                 message: response?.message || 'Failed to send OTP'
  //             });
  //         }
  //     } catch (error) {
  //         logger.log('OTP Error:', error);
  //         showStatus({
  //             type: 'error',
  //             title: 'Error',
  //             message: error?.Message || error?.message || 'Failed to send OTP'
  //         });
  //     } finally {
  //         setLoading(false);
  //         showLoader(false);
  //     }
  // };

  const handleContinueLogin = async () => {
    // logger.log('Login')
    // logger.log(phone);
    // logger.log('type', type);

    if (!validatePhoneNumbers(phone)) {
      showStatus({
        type: 'error',
        title: 'Error',
        message: 'Please enter a valid mobile number',
      });
      return;
    }

    try {
      setLoading(true);
      showLoader(true);
      // const response = await sendLoginOtp(phone);
      // logger.log('phonephone', phone)
      const response = await checkPhone(phone);
      logger.log('handleContinueLoginresponse', response);
      logger.log('OTP Response:', response);

      if (response?.data?.exists === true) {
        navigation.navigate('OtpScreen', {
          phone,
          type: 'login',
        });
      } else if (response?.data?.exists === false) {
        navigation.navigate('OtpScreen', {
          phone,
          type: 'register',
        });
      } else {
        showStatus({
          type: 'error',
          title: 'Error',
          message: response?.message || 'Failed to send OTP',
        });
      }
    } catch (error) {
      logger.log('OTP Error:', error);
      showStatus({
        type: 'error',
        title: 'Error',
        message: error?.Message || error?.message || 'Failed to send OTP',
      });
    } finally {
      setLoading(false);
      showLoader(false);
    }
  };

  const handleContinueRest = async () => {
    // logger.log(phone);
    // logger.log('handleContinueResthandleContinueResttype', type);

    if (!validatePhoneNumbers(phone)) {
      showStatus({
        type: 'error',
        title: 'Error',
        message: 'Please enter a valid mobile number',
      });
      return;
    }

    try {
      setLoading(true);
      showLoader(true);
      let response;
      if (type === 'login') {
        response = await sendForgotPwdOtp(phone);
      }
      if (type === 'reset') {
        response = await sendForgotPwdOtp(phone);
      }
      // logger.log('handleContinueRestresponse', response)
      // logger.log('OTP Response:', response);

      if (response?.success && response?.data) {
        navigation.navigate('OtpScreen', {
          phone,
          type: 'reset',
        });
      } else {
        showStatus({
          type: 'error',
          title: 'Error',
          message: response?.message || 'Failed to send OTP',
        });
      }
    } catch (error) {
      logger.log('OTP Error:', error);
      showStatus({
        type: 'error',
        title: 'Error',
        message: error?.Message || error?.message || 'Failed to send OTP',
      });
    } finally {
      setLoading(false);
      showLoader(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={'dark-content'}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <ImageBackground
            style={styles.backgroundImage}
            source={require('../assets/images/login_background_image.jpg')}
          >
            <Animated.Image
              style={[
                styles.kapraLogo,
                {
                  opacity: logoOpacity,
                  transform: [{ translateY: logoTranslate }],
                },
              ]}
              source={require('../assets/images/kapra_logo.png')}
            />
            <Animated.Image
              style={[
                styles.tagLine,
                {
                  opacity: tagLineOpacity,
                  transform: [{ translateY: tagLineTranslate }],
                },
              ]}
              source={require('../assets/images/login_content.png')}
            />
          </ImageBackground>
          <Animated.View
            style={[
              styles.bottomContainer,
              { transform: [{ translateY: bottomTranslate }] },
            ]}
          >
            <Text style={styles.headerText}>
              {type === 'reset' ? 'Forgot Password' : 'Login or Sign up'}
            </Text>
            <Text style={styles.enterNumberText}>Enter your mobile number</Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.countryCode}>+91</Text>

              <View style={styles.divider} />

              <TextInput
                placeholder="9999999999"
                placeholderTextColor="#c1c1c1"
                keyboardType="number-pad"
                style={styles.input}
                onChangeText={setPhone}
              />
            </View>
            <TouchableOpacity
              onPress={
                type === 'login' || type === 'register'
                  ? handleContinueLogin
                  : handleContinueRest
              }
              style={styles.continueButton}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
          {/* <View style={styles.bottomContainer}>
                        <Text style={styles.headerText}>Login or Sign up</Text>
                        <Text style={styles.enterNumberText}>Enter your password</Text>

                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="Enter password"
                                    placeholderTextColor="#DADADA"
                                    style={styles.input}
                                    secureTextEntry={showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Image style={styles.eyeIcon} source={require('../assets/images/eye_icon.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity onPress={() => navigation.navigate('ChangePwdScreen')}>
                            <Text style={styles.forgotPwdText}>Forgot password</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.continueButton}>
                            <Text style={styles.continueButtonText}>Continue</Text>
                        </TouchableOpacity>
                    </View> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp('5.36%'),
    borderRadius: wp('2.33%'),
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: wp('4.18%'),
    backgroundColor: '#fff',
  },
  countryCode: {
    fontSize: wp('4.19%'),
    color: '#000000',
    marginRight: 12,
  },
  divider: {
    width: 1,
    height: hp('4%'),
    backgroundColor: '#E5E5E5',
    marginRight: wp('4%'),
  },
  input: {
    flex: 1,
    color: '#000',
    fontSize: wp('4.19%'),
  },
  backgroundImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: hp('6%'),
    paddingBottom: hp('7.5%'),
  },
  kapraLogo: {
    width: wp('47%'),
    height: hp('10%'),
    resizeMode: 'cover',
  },
  tagLine: {
    width: wp('50.7%'),
    height: hp('16.95%'),
    resizeMode: 'cover',
  },
  bottomContainer: {
    height: hp('30.33%'),
    paddingHorizontal: wp('5.8%'),
    paddingTop: hp('3%'),
    borderTopLeftRadius: wp('9.3%'),
    borderTopRightRadius: wp('9.3%'),
    backgroundColor: '#FFFFFF',
    bottom: hp('4%'),
  },
  headerText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.65%'),
    color: '#000000',
    alignSelf: 'center',
    marginBottom: hp('3%'),
  },
  enterNumberText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.72%'),
    color: '#616161',
  },
  continueButton: {
    backgroundColor: '#F25000',
    width: '100%',
    height: hp('6.11%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('2.33%'),
    marginTop: hp('5%'),
  },
  continueButtonText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.18%'),
    color: '#FFFFFF',
  },
  inputContainer: {
    marginTop: hp('1.5%'),
  },
  eyeIcon: {
    width: wp('4.19%'),
    height: hp('1.29%'),
    resizeMode: 'contain',
  },
  forgotPwdText: {
    alignSelf: 'flex-end',
    marginTop: hp('0.5%'),
    color: '#F25000',
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.25%'),
  },
});

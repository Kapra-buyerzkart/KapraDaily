import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  Keyboard,
  StatusBar,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
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
import Feather from 'react-native-vector-icons/Feather';
import HelpSupportModal from '../components/HelpSupportModal';
import EmailOtpBottomSheet from '../components/EmailOtpBottomSheet';
import { setTokens } from '../api/tokenService';
import { syncKshopeSession } from '../kshope/api/session';
import images from '@/assets/images';
import BallPulse from '@/components/BallPulse';

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

      const rawData = response?.data || response?.Data || response;
      const accessToken =
        rawData?.accessToken ||
        rawData?.AccessToken ||
        rawData?.access_token ||
        rawData?.token ||
        rawData?.Token ||
        rawData?.jwtToken ||
        rawData?.JwtToken ||
        response?.accessToken ||
        response?.AccessToken ||
        response?.token;

      const refreshToken =
        rawData?.refreshToken ||
        rawData?.RefreshToken ||
        rawData?.refresh_token ||
        response?.refreshToken ||
        '';

      const custId =
        rawData?.custId ||
        rawData?.CustId ||
        rawData?.customerId ||
        rawData?.CustomerId ||
        rawData?.userId ||
        rawData?.UserId ||
        rawData?.id ||
        rawData?.Id ||
        response?.custId;

      const isSuccess =
        response?.success === true ||
        response?.status === 200 ||
        Boolean(accessToken);

      if (isSuccess && accessToken) {
        await setTokens(accessToken, refreshToken);
        await syncKshopeSession({
          ...(typeof rawData === 'object' ? rawData : {}),
          accessToken,
          refreshToken,
          custId,
        });

        if (custId) {
          await mergeCustomerIdIntoProfile(custId);
          try {
            OneSignal.login(custId.toString());
          } catch (e) {
            logger.log('OneSignal login error:', e);
          }
        }

        if (loadProfile) {
          await loadProfile();
        }

        navigation.reset({
          index: 0,
          routes: [{ name: 'KshopeScreen' }],
        });
      } else {
        showStatus({
          type: 'error',
          title: 'Error',
          message:
            response?.message ||
            response?.Message ||
            'OTP verification failed',
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
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={'dark-content'}
      />
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

      <KeyboardAwareScrollView
        style={styles.keyboardAvoid}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        bottomOffset={Platform.OS === 'ios' ? 40 : 24}
      >
          <View style={styles.topImageContainer}>
            <ImageBackground
              style={styles.backgroundImage}
              source={images.otpLuxuryBg}
              resizeMode="cover"
            />
          </View>

          <View style={styles.bottomContainer}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.brandTitleText}>Kapra Gold & Diamonds</Text>

            <View style={styles.titleDivider} />

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('LoginScreen', {
                  type: type,
                })
              }
              style={styles.phoneEditBox}
              activeOpacity={0.8}
            >
              <Text style={styles.countryCode}>+91</Text>
              <View style={styles.phoneDivider} />
              <Text style={styles.phoneNumberText}>{phone}</Text>
              <Feather name="edit-2" size={16} color="#0A2A20" />
            </TouchableOpacity>

            <Text style={styles.otpSentNotice}>
              We have sent OTP to your phone and whatsapp
            </Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => {
                const isFilled = Boolean(digit);
                return (
                  <View
                    style={[
                      styles.numberBox,
                      isFilled && styles.numberBoxFilled,
                    ]}
                    key={index}
                  >
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
                      selectionColor="#0A2A20"
                    />
                  </View>
                );
              })}
            </View>

            <View style={styles.resendRow}>
              {type === 'login' ? (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('LoginPwdScreen', {
                      phone,
                    })
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.usePwdText}>Use password</Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}
              <View style={styles.timerWrap}>
                {isResendDisabled ? (
                  <>
                    <Text style={styles.resendNotice}>Resend OTP in </Text>
                    <Text style={styles.timerText}>
                      {String(Math.floor(timer / 60)).padStart(2, '0')}:
                      {String(timer % 60).padStart(2, '0')}
                    </Text>
                  </>
                ) : (
                  <TouchableOpacity onPress={handleResendOtp} activeOpacity={0.7}>
                    <Text style={styles.resendAction}>Resend OTP</Text>
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
              disabled={loading}
              activeOpacity={0.88}
            >
              {loading ? (
                <BallPulse size={'large'} color={'#FFFFFF'} />
              ) : (
                <View style={styles.continueContent}>
                  <Text style={styles.continueButtonText}>Continue</Text>
                  <Feather
                    name="arrow-right"
                    size={16}
                    color="#FFFFFF"
                    style={styles.continueArrow}
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>
      </KeyboardAwareScrollView>
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
    backgroundColor: 'rgba(10, 42, 32, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    marginTop: hp('1.2%'),
    marginRight: wp('4%'),
    gap: 5,
  },
  helpButtonText: {
    fontFamily: 'Lexend-Medium',
    fontSize: 12,
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
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  topImageContainer: {
    width: '100%',
    height: hp('50%'),
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  bottomContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: wp('7%'),
    paddingTop: 32,
    paddingBottom: hp('5%'),
    marginTop: -32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 6,
  },
  welcomeText: {
    fontFamily: 'CormorantGaramond-Italic',
    fontSize: wp('6.5%'),
    lineHeight: wp('7.8%'),
    color: '#12372A',
    textAlign: 'center',
  },
  brandTitleText: {
    fontFamily: 'CormorantGaramond-SemiBold',
    fontSize: wp('7.6%'),
    lineHeight: wp('9.2%'),
    color: '#12372A',
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: -0.2,
  },
  titleDivider: {
    width: wp('44%'),
    height: 1.5,
    backgroundColor: '#1E3E30',
    alignSelf: 'center',
    marginTop: 14,
    marginBottom: 24,
  },
  phoneEditBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#0A2A20',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  countryCode: {
    fontFamily: 'Lexend-Medium',
    fontSize: 15,
    color: '#000000',
  },
  phoneDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#0A2A20',
    marginHorizontal: 14,
  },
  phoneNumberText: {
    flex: 1,
    fontFamily: 'Lexend-Medium',
    fontSize: 15,
    color: '#000000',
  },
  otpSentNotice: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3.1%'),
    color: '#757575',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 18,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 14,
  },
  numberBox: {
    flex: 1,
    height: 52,
    backgroundColor: '#F5F5F3',
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#DCD9D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberBoxFilled: {
    borderColor: '#0A2A20',
    backgroundColor: '#FFFFFF',
  },
  otpInput: {
    fontSize: 18,
    fontFamily: 'Lexend-Medium',
    color: '#0A2A20',
    textAlign: 'center',
    width: '100%',
    paddingVertical: 0,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  timerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  usePwdText: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3.2%'),
    color: '#165A42',
  },
  resendNotice: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3.2%'),
    color: '#757575',
  },
  timerText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.2%'),
    color: '#12372A',
  },
  resendAction: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: wp('3.2%'),
    color: '#165A42',
  },
  continueButton: {
    backgroundColor: '#0A2A20',
    width: '100%',
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: '#0A2A20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  continueContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontFamily: 'Lexend-Medium',
    fontSize: 15,
    color: '#FFFFFF',
  },
  continueArrow: {
    marginLeft: 6,
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
  },
  pwdResendTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.25%'),
    color: '#616161',
  },
  emailFallbackContainer: {
    alignSelf: 'center',
  },
  emailFallbackText: {
    fontFamily: FONTS.gilroy.regular,
  },
  emailFallbackLink: {
    fontFamily: FONTS.gilroy.medium,
  },
  kapraLogo: { width: wp('47%'), height: hp('10%'), resizeMode: 'cover' },
  tagLine: { width: wp('50.7%'), height: hp('16.95%'), resizeMode: 'cover' },
});

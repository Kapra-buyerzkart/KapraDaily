import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import React, { useState, useRef, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { loginWithPassword } from '../api';
import secureStore from '../utils/secureStore';
import { setTokens } from '../api/tokenService';
import { syncKshopeSession } from '../kshope/api/session';
import logger from '../utils/logger';
import images from '@/assets/images';
import BallPulse from '@/components/BallPulse';

const mergeCustomerIdIntoProfile = async custId => {
  logger.log('????????', custId);
  const storedProfile = await secureStore.getItem('profile');
  const existingProfile = storedProfile ? JSON.parse(storedProfile) : {};

  const updatedProfile = {
    ...existingProfile,
    custId,
  };

  logger.log('updatedProfile', updatedProfile);

  await secureStore.setItem('profile', JSON.stringify(updatedProfile));
};

const LoginPwdScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { showStatus } = useCart();
  const { phone } = route.params || {};

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const bottomOpacity = useRef(new Animated.Value(0)).current;
  const bottomTranslate = useRef(new Animated.Value(20)).current;

  useEffect(() => {
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
    ]).start();
  }, [bottomOpacity, bottomTranslate]);

  const handleContinue = async () => {
    if (!password) {
      showStatus({
        type: 'error',
        title: 'Error',
        message: 'Please enter a valid password',
      });
      return;
    }

    try {
      setLoading(true);
      console.log('[LOGIN PWD] request:', {
        phone,
        phoneType: typeof phone,
        passwordLength: password.length,
      });

      const response = await loginWithPassword(phone, password);

      console.log('[LOGIN PWD] response:', JSON.stringify(response, null, 2));

      if (response?.success && response?.data) {
        console.log('token data', response.data);
        const { accessToken, refreshToken, custId } = response.data;

        console.log('[LOGIN PWD] accessToken:', accessToken);
        console.log('[LOGIN PWD] refreshToken:', refreshToken);
        console.log('[LOGIN PWD] custId:', custId);

        await setTokens(accessToken, refreshToken);
        await syncKshopeSession(response.data);

        if (custId) {
          await mergeCustomerIdIntoProfile(custId);
        }
        navigation.reset({
          index: 0,
          routes: [{ name: 'KshopeScreen' }],
        });
      } else {
        showStatus({
          type: 'error',
          title: 'Error',
          message: response?.message || 'Login failed',
        });
      }
    } catch (error) {
      console.log('[LOGIN PWD] failed request');
      console.log('  url:', error?.url);
      console.log('  method:', error?.method);
      console.log('  status:', error?.status);
      console.log('  message:', error?.message ?? error);
      console.log('  requestBody:', error?.requestBody);
      console.log('  responseBody:', error?.data ?? error?.response?.data);
      logger.log('Login Error:', error);
      showStatus({
        type: 'error',
        title: 'Error',
        message:
          typeof error === 'string'
            ? error
            : error?.message || 'Failed to login',
      });
    } finally {
      setLoading(false);
    }
  };

  const backButtonStyle = [
    styles.backButton,
    { top: insets.top ? insets.top + 8 : 16 },
  ];

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <TouchableOpacity
        style={backButtonStyle}
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        activeOpacity={0.8}
      >
        <Feather name="arrow-left" size={20} color="#12372A" />
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.topImageContainer}>
            <ImageBackground
              style={styles.backgroundImage}
              source={images.pwdLuxuryBg}
              resizeMode="cover"
            />
          </View>

          <Animated.View
            style={[
              styles.bottomContainer,
              {
                opacity: bottomOpacity,
                transform: [{ translateY: bottomTranslate }],
              },
            ]}
          >
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.brandTitleText}>Kapra Gold & Diamonds</Text>
            <Text style={styles.subHeaderText}>ENTER YOUR PASSWORD</Text>

            <View style={styles.titleDivider} />

            {phone ? (
              <TouchableOpacity
                onPress={() => navigation.navigate('LoginScreen', { phone })}
                style={styles.phoneEditBox}
                activeOpacity={0.8}
              >
                <Text style={styles.countryCode}>+91</Text>
                <View style={styles.phoneDivider} />
                <Text style={styles.phoneNumberText}>{phone}</Text>
                <Feather name="edit-2" size={16} color="#0A2A20" />
              </TouchableOpacity>
            ) : null}

            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="rgba(255, 255, 255, 0.45)"
                style={styles.input}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                selectionColor="#FFFFFF"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Feather
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={18}
                  color="rgba(255, 255, 255, 0.75)"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsRow}>
              {phone ? (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('OtpScreen', {
                      phone,
                      type: 'login',
                    })
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionLinkText}>Log in with OTP</Text>
                </TouchableOpacity>
              ) : (
                <View />
              )}

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('LoginScreen', {
                    type: 'reset',
                    phone,
                  })
                }
                activeOpacity={0.7}
              >
                <Text style={styles.optionLinkText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleContinue}
              style={styles.continueButton}
              disabled={loading}
              activeOpacity={0.88}
            >
              {loading ? (
                <BallPulse size="large" color="#0A2A20" />
              ) : (
                <Text style={styles.continueButtonText}>Log In</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginPwdScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topImageContainer: {
    width: '100%',
    height: hp('48%'),
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
    paddingBottom: hp('8%'),
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
    marginTop: 4,
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
  subHeaderText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3%'),
    letterSpacing: 2,
    color: '#262626',
    textAlign: 'center',
    marginTop: 12,
  },
  titleDivider: {
    width: wp('44%'),
    height: 1.5,
    backgroundColor: '#1E3E30',
    alignSelf: 'center',
    marginTop: 14,
    marginBottom: 20,
  },
  phoneEditBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#0A2A20',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  countryCode: {
    fontFamily: 'Lexend-Medium',
    fontSize: 14.5,
    color: '#000000',
  },
  phoneDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#0A2A20',
    marginHorizontal: 12,
  },
  phoneNumberText: {
    flex: 1,
    fontFamily: 'Lexend-Medium',
    fontSize: 14.5,
    color: '#000000',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#0A2A20',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Lexend-Medium',
    paddingVertical: 0,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  optionLinkText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.2%'),
    color: '#165A42',
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0A2A20',
    width: '100%',
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 16,
  },
  continueButtonText: {
    fontFamily: 'Lexend-Medium',
    fontSize: 14.5,
    color: '#0A2A20',
  },
});

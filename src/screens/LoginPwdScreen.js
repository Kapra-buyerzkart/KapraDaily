import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import React, { useState } from 'react';
import logger from '../utils/logger';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { loginWithPassword, sendLoginOtp } from '../api';
import secureStore from '../utils/secureStore';
import { setTokens } from '../api/tokenService';

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
  const { showStatus } = useCart();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const phoneNumber = '8137956574';
  const route = useRoute();
  const { phone } = route.params || {};

  const handleContinue = async () => {
    // logger.log(phone, password);

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
      const response = await loginWithPassword(phone, password);
      // logger.log('Login Response:', response);

      if (response?.success && response?.data) {
        const { accessToken, refreshToken, custId } = response.data;
        await setTokens(accessToken, refreshToken);

        if (custId) {
          await mergeCustomerIdIntoProfile(custId);
        }
        navigation.reset({
          index: 0,
          routes: [{ name: 'AuthSuccessScreen' }],
        });
      } else {
        showStatus({
          type: 'error',
          title: 'Error',
          message: response?.message || 'Login failed',
        });
      }
    } catch (error) {
      logger.log('Login Error:', error);
      showStatus({
        type: 'error',
        title: 'Error',
        message: error || 'Failed to login',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
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
            <Image
              style={styles.kapraLogo}
              source={require('../assets/images/kapra_logo.png')}
            />
            <Image
              style={styles.tagLine}
              source={require('../assets/images/login_content.png')}
            />
          </ImageBackground>
          {/* <View style={styles.bottomContainer}>
                        <Text style={styles.headerText}>Login or Sign up</Text>
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
                        <TouchableOpacity onPress={handleContinue} style={styles.continueButton}>
                            <Text style={styles.continueButtonText}>Continue</Text>
                        </TouchableOpacity>
                    </View> */}
          <View style={styles.bottomContainer}>
            <Text style={styles.headerText}>Login</Text>
            <Text style={styles.enterNumberText}>Enter your password</Text>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Enter password"
                  placeholderTextColor="#DADADA"
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Image
                    tintColor={showPassword ? 'red' : undefined}
                    style={styles.eyeIcon}
                    source={require('../assets/images/eye_icon.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('LoginScreen', {
                  type: 'reset',
                  phone,
                })
              }
            >
              <Text style={styles.forgotPwdText}>Forgot password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleContinue}
              style={styles.continueButton}
            >
              {loading ? (
                <ActivityIndicator size="large" color="#FFFFFF" />
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

export default LoginPwdScreen;

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

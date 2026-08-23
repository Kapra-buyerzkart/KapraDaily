import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ImageBackground,
  Image,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';
import StatusModal from '../../components/StatusModal';
import { AppIcons } from '../../assets/icons';
import { colors, fontColors } from '../../theme/colours';
import {
  verifyEmailOtpApi,
  verifyPhoneOtpApi,
  requestPhoneOtpApi,
  requestEmailOtpApi,
} from '../../api/services/userService';
import CustomGradientButton from '../../components/CustomGradientButton';

const UpdateContactOtpScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { type, contactValue } = route.params || {};
  const { loadProfile } = useUser();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error';
    onCloseCallback?: () => void;
  }>({ title: '', message: '', type: 'success' });

  const showModal = (
    title: string,
    message: string,
    type: 'success' | 'error',
    onCloseCallback?: () => void,
  ) => {
    setModalConfig({ title, message, type, onCloseCallback });
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (modalConfig.onCloseCallback) {
      modalConfig.onCloseCallback();
    }
  };

  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const otpRefs = useRef<any>([]);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleRequestOtp = async () => {
    try {
      setIsLoading(true);
      const payload =
        type === 'phone' ? { phone: contactValue } : { email: contactValue };
      const response =
        type === 'phone'
          ? await requestPhoneOtpApi(payload as any)
          : await requestEmailOtpApi(payload as any);

      if (response?.success) {
        setTimer(30);
        setCanResend(false);
        setOtp(['', '', '', '', '']);
        otpRefs.current[0]?.focus();
      } else {
        showModal(
          'Error',
          response?.message || 'Failed to request OTP',
          'error',
        );
      }
    } catch (error) {
      showModal('Error', 'Failed to request OTP. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 5) {
      showModal('Error', 'Please enter the 5-digit OTP', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const payload =
        type === 'phone'
          ? { phone: contactValue, otp: otpValue }
          : { email: contactValue, otp: otpValue };

      const response =
        type === 'phone'
          ? await verifyPhoneOtpApi(payload as any)
          : await verifyEmailOtpApi(payload as any);

      if (response?.success) {
        await loadProfile();
        showModal(
          'Success',
          `${
            type === 'phone' ? 'Phone Number' : 'Email ID'
          } updated successfully`,
          'success',
          () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'KshopeProfile' }],
            });
          },
        );
      } else {
        showModal('Error', response?.message || 'Verification failed', 'error');
      }
    } catch (error) {
      showModal('Error', 'Invalid OTP or verification failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 4) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <ImageBackground
      style={styles.backgroundImage}
      source={require('../../assets/images/login/bg_test.png')}
      resizeMode="stretch"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <AppIcons.ArrowBack size={28} color={colors.black} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Verify OTP</Text>
          </View>

          <Image
            source={require('../../assets/images/login/logo.png')}
            style={styles.logo}
          />

          <View style={styles.bottomContainer}>
            <View style={styles.formContent}>
              <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View>
                  <Text style={styles.welcomeText}>Verify OTP</Text>
                  <Text style={styles.subText}>
                    Enter the 5-digit code sent to {contactValue}
                  </Text>

                  <View style={styles.inputContainer}>
                    <View style={styles.otpContainer}>
                      {otp.map((digit, index) => (
                        <View style={styles.otpBox} key={index}>
                          <TextInput
                            ref={el => {
                              otpRefs.current[index] = el;
                            }}
                            style={styles.otpInput}
                            keyboardType="number-pad"
                            maxLength={1}
                            value={digit}
                            onChangeText={text => handleOtpChange(text, index)}
                            onKeyPress={e => handleBackspace(e, index)}
                          />
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.resendRow}>
                    {canResend ? (
                      <TouchableOpacity onPress={handleRequestOtp}>
                        <Text style={styles.resendTextActive}>Resend OTP</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.resendTextDisabled}>
                        Resend OTP in {timer}s
                      </Text>
                    )}
                  </View>
                </View>

                <View style={{ marginBottom: hp('7%') }}>
                  <CustomGradientButton
                    title="Verify & Update"
                    onPress={handleVerifyOtp}
                    loading={isLoading}
                    disabled={isLoading}
                  />

                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.changeContactLink}
                  >
                    <Text style={styles.changeContactLinkText}>
                      Change {type === 'phone' ? 'Phone' : 'Email'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <StatusModal
          visible={modalVisible}
          type={modalConfig.type}
          title={modalConfig.title}
          message={modalConfig.message}
          onClose={handleModalClose}
        />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default UpdateContactOtpScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
    paddingTop: Platform.OS === 'ios' ? hp('5%') : hp('2%'),
    paddingBottom: hp('2%'),
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    color: fontColors.titleBlack,
    fontWeight: 'bold',
    fontFamily: 'Gilroy-Bold',
    marginLeft: wp('4%'),
    flex: 1,
  },
  bottomContainer: {
    flex: 1,
    paddingHorizontal: wp('5.8%'),
    paddingTop: hp('4%'),
    paddingBottom: hp('4%'),
    backgroundColor: 'transparent',
  },
  formContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: wp('6%'),
    color: fontColors.titleBlack,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: hp('3%'),
    fontFamily: 'Gilroy-Bold',
  },
  subText: {
    fontSize: wp('3.72%'),
    color: fontColors.subtext,
    marginBottom: hp('1.5%'),
    fontFamily: 'Gilroy-Regular',
  },
  inputContainer: {
    marginBottom: hp('2.5%'),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('1%'),
  },
  otpBox: {
    width: wp('12.95%'),
    height: hp('6.36%'),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.themeLightGray || '#E5E5E5',
    borderRadius: wp('6.33%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpInput: {
    fontSize: wp('4.5%'),
    textAlign: 'center',
    width: '100%',
    color: fontColors.titleBlack,
    fontWeight: 'bold',
  },
  resendRow: {
    alignItems: 'center',
    marginTop: hp('2.5%'),
  },
  resendTextActive: {
    fontSize: wp('3.5%'),
    color: colors.themeTeal || '#F25000',
    fontWeight: 'bold',
  },
  resendTextDisabled: {
    fontSize: wp('3.5%'),
    color: fontColors.subtext,
  },
  changeContactLink: {
    alignItems: 'center',
    marginTop: hp('3%'),
  },
  changeContactLinkText: {
    fontSize: wp('3.5%'),
    color: colors.themeTeal || '#F25000',
    textDecorationLine: 'underline',
  },
  headerSection: {
    height: hp('25%'),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: wp('30%'),
    height: hp('8%'),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: hp('2.5%'),
    marginBottom: hp('2.5%'),
  },
});

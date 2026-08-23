import React, { useState, useEffect } from 'react';
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
import { AppIcons } from '../../assets/icons';
import { colors, fontColors } from '../../theme/colours';
import {
  requestEmailOtpApi,
  requestPhoneOtpApi,
} from '../../api/services/userService';
import CustomPhoneInput from '../../components/CustomPhoneInput';
import CustomGradientButton from '../../components/CustomGradientButton';
import StatusModal from '../../components/StatusModal';

const UpdateContactScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { type } = route.params || { type: 'phone' };
  const { profile } = useUser();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({ title: '', message: '', type: 'success' });

  const showModal = (
    title: string,
    message: string,
    type: 'success' | 'error',
  ) => {
    setModalConfig({ title, message, type });
    setModalVisible(true);
  };

  const [value, setValue] = useState('');
  const [originalValue, setOriginalValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const normalizePhone = (ph: string) => {
    const digits = ph.replace(/\D/g, '');
    if (digits.startsWith('91') && digits.length === 12) {
      return digits.substring(2);
    }
    if (digits.length > 10 && digits.startsWith('91')) {
      return digits.slice(-10);
    }
    return digits.slice(-10);
  };

  useEffect(() => {
    if (profile) {
      const currentVal =
        type === 'phone'
          ? normalizePhone(profile.phoneNo || '')
          : profile.emailId;
      setValue(currentVal || '');
      setOriginalValue(currentVal || '');
    }
  }, [profile, type]);

  const validatePhoneNumbers = (ph: string) => /^[6-9]\d{9}$/.test(ph);

  const handleTextChange = (text: string) => {
    if (type === 'phone') {
      const cleaned = text.replace(/\D/g, '').slice(0, 10);
      setValue(cleaned);
    } else {
      setValue(text);
    }
  };

  const handleRequestOtp = async () => {
    if (!value.trim()) {
      showModal(
        'Error',
        `Please enter a valid ${
          type === 'phone' ? 'phone number' : 'email ID'
        }`,
        'error',
      );
      return;
    }

    if (type === 'phone' && !validatePhoneNumbers(value)) {
      showModal(
        'Error',
        'Please enter a valid 10-digit mobile number',
        'error',
      );
      return;
    }

    try {
      setIsLoading(true);
      const payload = type === 'phone' ? { phone: value } : { email: value };
      const response =
        type === 'phone'
          ? await requestPhoneOtpApi(payload as any)
          : await requestEmailOtpApi(payload as any);

      if (response?.success) {
        navigation.navigate('KshopeUpdateContactOtp', {
          type,
          contactValue: value,
        });
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

  const isDifferent = value.trim() !== originalValue.trim();
  const isInputValid =
    type === 'phone' ? validatePhoneNumbers(value) : value.includes('@');
  const canRequestOtp = isDifferent && isInputValid;

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

            <Text style={styles.headerTitle}>
              Update {type === 'phone' ? 'Phone' : 'Email'}
            </Text>
          </View>
          <Image
            source={require('../../assets/images/login/logo.png')}
            style={styles.logo}
          />
          <View style={styles.bottomContainer}>
            <View style={styles.formContent}>
              <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View>
                  <Text style={styles.subText}>
                    Enter your new{' '}
                    {type === 'phone' ? 'mobile number' : 'email ID'}
                  </Text>

                  {type === 'phone' ? (
                    <CustomPhoneInput
                      value={value}
                      onChangeText={handleTextChange}
                    />
                  ) : (
                    <View style={styles.inputContainer}>
                      <View style={styles.inputWrapper}>
                        <TextInput
                          placeholder={'Enter email ID'}
                          placeholderTextColor="#DADADA"
                          style={styles.input}
                          value={value}
                          onChangeText={handleTextChange}
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </View>
                    </View>
                  )}
                </View>

                <View style={{ marginBottom: hp('7%') }}>
                  <CustomGradientButton
                    title="Get OTP"
                    onPress={handleRequestOtp}
                    loading={isLoading}
                    disabled={!canRequestOtp || isLoading}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusModal
        visible={modalVisible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={() => setModalVisible(false)}
      />
    </ImageBackground>
  );
};

export default UpdateContactScreen;

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
  headerSection: {
    height: hp('25%'),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: wp('30%'),
    height: hp('8%'),
    alignSelf: 'center',
    marginTop: hp('2.5%'),
    marginBottom: hp('2.5%'),
    resizeMode: 'contain',
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp('6.5%'),
    borderRadius: wp('8%'),
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: wp('5%'),
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    color: '#000',
    fontSize: wp('4%'),
  },
});

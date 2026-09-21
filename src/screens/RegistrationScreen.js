import {
  Platform,
  View,
  StatusBar,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import React, { useState, useRef, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { OneSignal } from 'react-native-onesignal';
import { getAreasByPincode, registerUser } from '../api';
import { useCart } from '../context/CartContext';
import secureStore from '../utils/secureStore';
import { setTokens } from '../api/tokenService';
import { syncKshopeSession } from '../kshope/api/session';
import logger from '../utils/logger';
import RegistrationHero from './registration/components/organisms/RegistrationHero';
import RegistrationForm from './registration/components/organisms/RegistrationForm';
import { styles } from './registration/styles/Registration.styles';

const mergeCustomerIdIntoProfile = async custId => {
  const storedProfile = await secureStore.getItem('profile');
  const existingProfile = storedProfile ? JSON.parse(storedProfile) : {};

  const updatedProfile = {
    ...existingProfile,
    custId,
  };

  await secureStore.setItem('profile', JSON.stringify(updatedProfile));
};

const RegistrationScreen = () => {
  const [selectedArea, setSelectedArea] = useState(null);
  const [pincode, setPincode] = useState('');
  const [areas, setAreas] = useState([]);
  const [termsAndConditionsClicked, setTermsAndConditionsClicked] =
    useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { showStatus } = useCart();

  const { registerToken, phone } = route.params || {};

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

  const handlePincodeChange = async value => {
    setPincode(value);

    if (value.length === 6) {
      try {
        const response = await getAreasByPincode(value);

        setAreas(response?.data || []);
        setSelectedArea(null);
      } catch (error) {
        logger.log('Error fetching areas:', error);
        setAreas([]);
      }
    } else {
      setAreas([]);
      setSelectedArea(null);
    }
  };

  const handleSelectArea = area => {
    setSelectedArea(area);
    setAreas([area]);
  };

  const handleEditPhone = () =>
    navigation.navigate('LoginScreen', {
      type: 'login',
    });

  const handlePressTerms = () =>
    navigation.navigate('TermsOfUseScreen', {
      title: 'Terms Of Use',
    });

  const handleContinue = async () => {
    if (loading) {
      return;
    }

    if (!name || !password) {
      showStatus({
        type: 'error',
        title: 'Missing Fields',
        message: 'Please fill all mandatory fields',
      });
      return;
    }

    if (pincode.length !== 6 || !selectedArea) {
      showStatus({
        type: 'error',
        title: 'Invalid Area',
        message: 'Please select a valid area',
      });
      return;
    }

    if (!termsAndConditionsClicked) {
      showStatus({
        type: 'error',
        title: 'Terms Required',
        message: 'Please accept terms and conditions',
      });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        registerToken,
        name,
        email,
        password,
        whatsAppNo: '',
        referCode: '',
        pincodeAreaId: selectedArea.pincodeAreaId,
      };
      const registerResponse = await registerUser(payload);
      logger.log('Register response:', JSON.stringify(registerResponse, null, 2));
      if (registerResponse?.success) {
        try {
          const { accessToken, refreshToken, custId } = registerResponse.data;
          await setTokens(accessToken, refreshToken);
          await syncKshopeSession(registerResponse.data);
          if (custId) {
            await mergeCustomerIdIntoProfile(custId);
            OneSignal.login(custId.toString());
          }
        } catch (error) {
          logger.log('Post-registration setup error:', error);
          setLoading(false);
          showStatus({
            type: 'error',
            title: 'Something Went Wrong',
            message: 'Could not complete sign in. Please try again.',
          });
          return;
        }

        showStatus({
          type: 'success',
          title: 'Success',
          message: 'Registration completed successfully',
          autoCloseMs: 2500,
          onClose: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'KshopeScreen' }],
            });
          },
        });
        return;
      }

      setLoading(false);
      showStatus({
        type: 'error',
        title: 'Registration Failed',
        message:
          registerResponse?.message || 'Registration failed. Please try again.',
      });
    } catch (error) {
      logger.log('Registration error:', error);
      const errorMessage =
        error?.message ||
        error?.data?.message ||
        error?.data?.Message ||
        (typeof error === 'string'
          ? error
          : 'Something went wrong. Please try again.');
      setLoading(false);
      showStatus({
        type: 'error',
        title: 'Registration Failed',
        message: errorMessage,
      });
    }
  };

  const backButtonStyle = [
    styles.backButton,
    { top: insets.top ? insets.top + 8 : 16 },
  ];

  return (
    <View style={styles.screen}>
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

      <KeyboardAwareScrollView
        style={styles.keyboardView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        bottomOffset={Platform.OS === 'ios' ? 40 : 24}
      >
        <RegistrationHero />

        <Animated.View
          style={[
            styles.sheetWrap,
            {
              opacity: bottomOpacity,
              transform: [{ translateY: bottomTranslate }],
            },
          ]}
        >
          <RegistrationForm
            phone={phone}
            onEditPhone={handleEditPhone}
            name={name}
            onChangeName={setName}
            email={email}
            onChangeEmail={setEmail}
            password={password}
            onChangePassword={setPassword}
            pincode={pincode}
            onChangePincode={handlePincodeChange}
            areas={areas}
            selectedArea={selectedArea}
            onSelectArea={handleSelectArea}
            termsAccepted={termsAndConditionsClicked}
            onToggleTerms={() =>
              setTermsAndConditionsClicked(!termsAndConditionsClicked)
            }
            onPressTerms={handlePressTerms}
            loading={loading}
            onSubmit={handleContinue}
          />
        </Animated.View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default RegistrationScreen;

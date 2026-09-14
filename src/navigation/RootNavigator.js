import React, { useContext, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppContext } from '../context/appContext';
import AppLoader from '../components/AppLoader';
import lazyScreen from './lazyScreen';

import AppUpdateModal from '../components/AppUpdateModal';
import { COLORS } from '../styles/colors';

const LoginScreen = lazyScreen(() => require('../screens/LoginScreen'));
const RegistraionScreen = lazyScreen(() =>
  require('../screens/RegistrationScreen'),
);
const OtpScreen = lazyScreen(() => require('../screens/OtpScreen'));
const ChangePwdScreen = lazyScreen(() => require('../screens/ChangePwdScreen'));
const LoginPwdScreen = lazyScreen(() => require('../screens/LoginPwdScreen'));
const AddLocationScreen = lazyScreen(() =>
  require('../screens/AddLocationScreen'),
);
const LegalContentScreen = lazyScreen(() =>
  require('../screens/LegalContentScreen'),
);
const TermsOfUseScreen = lazyScreen(() =>
  require('../screens/TermsOfUseScreen'),
);
const KshopeScreen = lazyScreen(() => require('../kshope'));

const Stack = createNativeStackNavigator();

const SCREEN_OPTIONS = {
  headerShown: false,
  contentStyle: { backgroundColor: COLORS.white },
  freezeOnBlur: true,
};

export default function RootNavigator() {
  const {
    profile,
    loadProfile,
    isUpdateModalVisible,
    setIsUpdateModalVisible,
    updateInfo,
  } = useContext(AppContext);

  useEffect(() => {
    loadProfile();
  }, []);

  if (!profile) {
    return <AppLoader />;
  }

  return (
    <>
      <Stack.Navigator
        initialRouteName={profile?.custId ? 'KshopeScreen' : 'LoginScreen'}
        screenOptions={SCREEN_OPTIONS}
      >
        <Stack.Screen name="KshopeScreen" component={KshopeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="LoginPwdScreen" component={LoginPwdScreen} />
        <Stack.Screen name="RegistraionScreen" component={RegistraionScreen} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="ChangePwdScreen" component={ChangePwdScreen} />
        <Stack.Screen name="AddLocationScreen" component={AddLocationScreen} />
        <Stack.Screen
          name="LegalContentScreen"
          component={LegalContentScreen}
        />
        <Stack.Screen name="TermsOfUseScreen" component={TermsOfUseScreen} />
      </Stack.Navigator>

      <AppUpdateModal
        visible={isUpdateModalVisible}
        updateInfo={updateInfo}
        onLater={() => setIsUpdateModalVisible(false)}
      />
    </>
  );
}

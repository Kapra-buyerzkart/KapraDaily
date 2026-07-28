import React, { useContext, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LocationFetchingScreen from '../screens/LocationFetchingScreen';
import LocationFetchingNewScreen from '../screens/LocationFetchingNewScreen';
import MainTabNavigator from './MainTabNavigator';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import AddLocationScreen from '../screens/AddLocationScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegistraionScreen from '../screens/RegistrationScreen';
import OtpScreen from '../screens/OtpScreen';
import ChangePwdScreen from '../screens/ChangePwdScreen';
import BCoinScreen from '../screens/BCoinScreen';
import SearchScreen from '../screens/search/SearchScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import OrderFailedScreen from '../screens/OrderFailedScreen';
import OrderPendingScreen from '../screens/OrderPendingScreen';
import LoginPwdScreen from '../screens/LoginPwdScreen';
import SavedAddressScreen from '../screens/SavedAddressScreen';
import ReferralScreen from '../screens/ReferralScreen';
import ReferralHistoryScreen from '../screens/ReferralHistoryScreen';
import { AppContext } from '../context/appContext';
import EditProfileScreen from '../screens/EditProfileScreen/EditProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import UpdateContactScreen from '../screens/UpdateContactScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ProductListScreen from '../screens/ProductListScreen';
import SupportTicketScreen from '../screens/SupportTicketScreen';
import SupportTicketsListScreen from '../screens/SupportTicketsListScreen';
import TicketDetailsScreen from '../screens/TicketDetailsScreen';
import AppUpdateModal from '../components/AppUpdateModal';
import AuthSuccessScreen from '../screens/AuthSuccessScreen';
import KshopeScreen from '../screens/KshopeScreen';
import { Deals48Stack } from '../modules/deals48';
import CoPartnerDashboardScreen from '../screens/CoPartnerDashboardScreen';
import CoPartnerListScreen from '../screens/CoPartnerListScreen';
import MyAffilateScreen from '../screens/MyAffilateScreen/MyAffilateScreen';
import ReferralLevelMembersScreen from '../screens/ReferralLevelMembersScreen/ReferralLevelMembersScreen';
import TicketSplashScreen from '../screens/ticketScreen/TicketSplashScreen';
import TicketLandingScreen from '../screens/ticketLandingScreen/TicketLandingScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen/EventDetailsScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen/MyBookingsScreen';
import EventBookingDetailsScreen from '../screens/EventBookingDetailsScreen/EventBookingDetailsScreen';
import ViewTicketScreen from '../screens/ViewTicketScreen/ViewTicketScreen';
import D2cScreen from '../screens/D2cScreen';
import LegalContentScreen from '../screens/LegalContentScreen';
import QRScannerScreen from '../screens/QRScannerScreen/QRScannerScreen';
import AppLoader from '../components/AppLoader';
const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const {
    loadProfileTwo,
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
    // Branded loader instead of null (which rendered nothing and let the black
    // native window show through) while loadProfile() restores/fetches profile.
    return <AppLoader />;
  }

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          // Default every screen to an opaque white background so no transparent
          // React view lets the native screen background flash through while
          // assets load. Screens that want black override this per-screen below.
          contentStyle: { backgroundColor: '#fff' },
        }}
      >
        {/* <Stack.Screen name="LocationFetching" component={LocationFetchingScreen} /> */}
        {/* <Stack.Screen name="SplashScreen" component={SplashScreen} /> */}
        {/* <Stack.Screen name="LocationFetching" component={LocationFetchingScreen} /> */}
        <Stack.Screen
          name="LocationFetchingNew"
          component={LocationFetchingNewScreen}
        />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="LoginPwdScreen" component={LoginPwdScreen} />
        <Stack.Screen name="RegistraionScreen" component={RegistraionScreen} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="ChangePwdScreen" component={ChangePwdScreen} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen name="AddLocationScreen" component={AddLocationScreen} />
        <Stack.Screen
          name="ProductDetailsScreen"
          component={ProductDetailsScreen}
        />
        <Stack.Screen
          name="OrderTrackingScreen"
          component={OrderTrackingScreen}
        />
        <Stack.Screen name="BCoinScreen" component={BCoinScreen} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        {/* <Stack.Screen name="ProfileScreen" component={ProfileScreen} /> */}
        <Stack.Screen
          name="OrderSuccessScreen"
          component={OrderSuccessScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="OrderFailedScreen"
          component={OrderFailedScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="OrderPendingScreen"
          component={OrderPendingScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="SavedAddressScreen"
          component={SavedAddressScreen}
        />
        <Stack.Screen name="ReferralScreen" component={ReferralScreen} />
        <Stack.Screen
          name="ReferralHistoryScreen"
          component={ReferralHistoryScreen}
        />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen
          name="ChangePasswordScreen"
          component={ChangePasswordScreen}
        />
        <Stack.Screen
          name="UpdateContactScreen"
          component={UpdateContactScreen}
        />
        <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
        <Stack.Screen name="ProductListScreen" component={ProductListScreen} />
        <Stack.Screen
          name="SupportTicketScreen"
          component={SupportTicketScreen}
        />
        <Stack.Screen
          name="SupportTicketsListScreen"
          component={SupportTicketsListScreen}
        />
        <Stack.Screen
          name="TicketDetailsScreen"
          component={TicketDetailsScreen}
        />
        <Stack.Screen name="AuthSuccessScreen" component={AuthSuccessScreen} />
        <Stack.Screen name="KshopeScreen" component={KshopeScreen} />
        <Stack.Screen
          name="CoPartnerDashboardScreen"
          component={CoPartnerDashboardScreen}
        />
        <Stack.Screen
          name="CoPartnerListScreen"
          component={CoPartnerListScreen}
        />
        <Stack.Screen name="MyAffilateScreen" component={MyAffilateScreen} />
        <Stack.Screen
          name="ReferralLevelMembersScreen"
          component={ReferralLevelMembersScreen}
        />
        <Stack.Screen
          name="TicketSplashScreen"
          component={TicketSplashScreen}
          options={{ contentStyle: { backgroundColor: '#000000' } }}
        />
        <Stack.Screen
          name="TicketLanding"
          component={TicketLandingScreen}
          options={{
            animation: 'fade',
            contentStyle: { backgroundColor: '#000000' },
          }}
        />
        <Stack.Screen
          name="EventDetailsScreen"
          component={EventDetailsScreen}
          options={{ contentStyle: { backgroundColor: '#000000' } }}
        />
        <Stack.Screen
          name="MyBookingsScreen"
          component={MyBookingsScreen}
          options={{ contentStyle: { backgroundColor: '#000000' } }}
        />
        <Stack.Screen
          name="EventBookingDetailsScreen"
          component={EventBookingDetailsScreen}
          options={{ contentStyle: { backgroundColor: '#000000' } }}
        />
        <Stack.Screen
          name="ViewTicketScreen"
          component={ViewTicketScreen}
          options={{
            animation: 'fade',
            contentStyle: { backgroundColor: '#000000' },
          }}
        />
        <Stack.Screen name="D2cScreen" component={D2cScreen} />
        <Stack.Screen
          name="LegalContentScreen"
          component={LegalContentScreen}
        />
        <Stack.Screen
          name="QRScannerScreen"
          component={QRScannerScreen}
          options={{ contentStyle: { backgroundColor: '#000000' } }}
        />
        {/* 48hrs Deals runs as a self-contained module with its own backend and
            session; everything it owns lives behind this single route. */}
        <Stack.Screen name="Deals48" component={Deals48Stack} />
      </Stack.Navigator>

      {/* <AppUpdateModal
        visible={isUpdateModalVisible}
        updateInfo={updateInfo}
        onLater={() => setIsUpdateModalVisible(false)}
      /> */}
    </>
  );
}

import React, { useContext, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppContext } from '../context/appContext';
import AppLoader from '../components/AppLoader';
import lazyScreen, { lazyNamedScreen } from './lazyScreen';

// AppUpdateModal is required eagerly because it renders unconditionally
// alongside the navigator. Every screen below is deferred via `lazyScreen` so
// its module body only runs when that route first renders — see lazyScreen.js
// for why plain static imports (even with Metro's inlineRequires) end up
// executing all ~50 screen modules on this navigator's first render.
import AppUpdateModal from '../components/AppUpdateModal';

const MainTabNavigator = lazyScreen(() => require('./MainTabNavigator'));
const LocationFetchingNewScreen = lazyScreen(() =>
  require('../screens/LocationFetchingNewScreen'),
);
const CartScreen = lazyScreen(() => require('../screens/CartScreen'));
const AddLocationScreen = lazyScreen(() =>
  require('../screens/AddLocationScreen'),
);
const ProductDetailsScreen = lazyScreen(() =>
  require('../screens/ProductDetailsScreen'),
);
const OrderTrackingScreen = lazyScreen(() =>
  require('../screens/OrderTrackingScreen'),
);
const InvoiceViewerScreen = lazyScreen(() =>
  require('../screens/InvoiceViewerScreen'),
);
const LoginScreen = lazyScreen(() => require('../screens/LoginScreen'));
const RegistraionScreen = lazyScreen(() =>
  require('../screens/RegistrationScreen'),
);
const OtpScreen = lazyScreen(() => require('../screens/OtpScreen'));
const ChangePwdScreen = lazyScreen(() => require('../screens/ChangePwdScreen'));
const BCoinScreen = lazyScreen(() => require('../screens/BCoinScreen'));
const SearchScreen = lazyScreen(() => require('../screens/search/SearchScreen'));
const OrderSuccessScreen = lazyScreen(() =>
  require('../screens/OrderSuccessScreen'),
);
const OrderFailedScreen = lazyScreen(() =>
  require('../screens/OrderFailedScreen'),
);
const OrderPendingScreen = lazyScreen(() =>
  require('../screens/OrderPendingScreen'),
);
const LoginPwdScreen = lazyScreen(() => require('../screens/LoginPwdScreen'));
const SavedAddressScreen = lazyScreen(() =>
  require('../screens/SavedAddressScreen'),
);
const ReferralScreen = lazyScreen(() => require('../screens/ReferralScreen'));
const ReferralHistoryScreen = lazyScreen(() =>
  require('../screens/ReferralHistoryScreen'),
);
const EditProfileScreen = lazyScreen(() =>
  require('../screens/EditProfileScreen/EditProfileScreen'),
);
const ChangePasswordScreen = lazyScreen(() =>
  require('../screens/ChangePasswordScreen'),
);
const UpdateContactScreen = lazyScreen(() =>
  require('../screens/UpdateContactScreen'),
);
const CheckoutScreen = lazyScreen(() => require('../screens/CheckoutScreen'));
const ProductListScreen = lazyScreen(() =>
  require('../screens/ProductListScreen'),
);
const SupportTicketScreen = lazyScreen(() =>
  require('../screens/SupportTicketScreen'),
);
const SupportTicketsListScreen = lazyScreen(() =>
  require('../screens/SupportTicketsListScreen'),
);
const TicketDetailsScreen = lazyScreen(() =>
  require('../screens/TicketDetailsScreen'),
);
const AuthSuccessScreen = lazyScreen(() =>
  require('../screens/AuthSuccessScreen'),
);
const KshopeScreen = lazyScreen(() => require('../screens/KshopeScreen'));
const CoPartnerDashboardScreen = lazyScreen(() =>
  require('../screens/CoPartnerDashboardScreen'),
);
const CoPartnerListScreen = lazyScreen(() =>
  require('../screens/CoPartnerListScreen'),
);
const MyAffilateScreen = lazyScreen(() =>
  require('../screens/MyAffilateScreen/MyAffilateScreen'),
);
const ReferralLevelMembersScreen = lazyScreen(() =>
  require('../screens/ReferralLevelMembersScreen/ReferralLevelMembersScreen'),
);
const TicketSplashScreen = lazyScreen(() =>
  require('../screens/ticketScreen/TicketSplashScreen'),
);
const TicketLandingScreen = lazyScreen(() =>
  require('../screens/ticketLandingScreen/TicketLandingScreen'),
);
const EventDetailsScreen = lazyScreen(() =>
  require('../screens/EventDetailsScreen/EventDetailsScreen'),
);
const MyBookingsScreen = lazyScreen(() =>
  require('../screens/MyBookingsScreen/MyBookingsScreen'),
);
const EventBookingDetailsScreen = lazyScreen(() =>
  require('../screens/EventBookingDetailsScreen/EventBookingDetailsScreen'),
);
const ViewTicketScreen = lazyScreen(() =>
  require('../screens/ViewTicketScreen/ViewTicketScreen'),
);
const D2cScreen = lazyScreen(() => require('../screens/D2cScreen'));
const LegalContentScreen = lazyScreen(() =>
  require('../screens/LegalContentScreen'),
);
const QRScannerScreen = lazyScreen(() =>
  require('../screens/QRScannerScreen/QRScannerScreen'),
);
const Deals48Stack = lazyNamedScreen(
  () => require('../modules/deals48'),
  'Deals48Stack',
);

const Stack = createNativeStackNavigator();

// Hoisted to module scope so the navigator and its screens are not handed a
// freshly-allocated options object on every RootNavigator render.
const SCREEN_OPTIONS = {
  headerShown: false,
  // Default every screen to an opaque white background so no transparent
  // React view lets the native screen background flash through while
  // assets load. Screens that want black override this per-screen below.
  contentStyle: { backgroundColor: '#fff' },
  // AppContext, CartContext and WishlistContext all sit above the navigator,
  // so any cart mutation or profile update re-rendered every screen still
  // mounted in the stack, not just the visible one. freezeOnBlur suspends
  // rendering for blurred screens (via react-freeze in react-native-screens);
  // they still receive state updates and simply render them on unfreeze.
  freezeOnBlur: true,
};
const NO_GESTURE = { gestureEnabled: false };
const BLACK_CONTENT = { contentStyle: { backgroundColor: '#000000' } };
const BLACK_CONTENT_FADE = {
  animation: 'fade',
  contentStyle: { backgroundColor: '#000000' },
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
    // Branded loader instead of null (which rendered nothing and let the black
    // native window show through) while loadProfile() restores/fetches profile.
    return <AppLoader />;
  }

  return (
    <>
      <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
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
        <Stack.Screen
          name="InvoiceViewerScreen"
          component={InvoiceViewerScreen}
        />
        <Stack.Screen name="BCoinScreen" component={BCoinScreen} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen
          name="OrderSuccessScreen"
          component={OrderSuccessScreen}
          options={NO_GESTURE}
        />
        <Stack.Screen
          name="OrderFailedScreen"
          component={OrderFailedScreen}
          options={NO_GESTURE}
        />
        <Stack.Screen
          name="OrderPendingScreen"
          component={OrderPendingScreen}
          options={NO_GESTURE}
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
          options={BLACK_CONTENT}
        />
        <Stack.Screen
          name="TicketLanding"
          component={TicketLandingScreen}
          options={BLACK_CONTENT_FADE}
        />
        <Stack.Screen
          name="EventDetailsScreen"
          component={EventDetailsScreen}
          options={BLACK_CONTENT}
        />
        <Stack.Screen
          name="MyBookingsScreen"
          component={MyBookingsScreen}
          options={BLACK_CONTENT}
        />
        <Stack.Screen
          name="EventBookingDetailsScreen"
          component={EventBookingDetailsScreen}
          options={BLACK_CONTENT}
        />
        <Stack.Screen
          name="ViewTicketScreen"
          component={ViewTicketScreen}
          options={BLACK_CONTENT_FADE}
        />
        <Stack.Screen name="D2cScreen" component={D2cScreen} />
        <Stack.Screen
          name="LegalContentScreen"
          component={LegalContentScreen}
        />
        <Stack.Screen
          name="QRScannerScreen"
          component={QRScannerScreen}
          options={BLACK_CONTENT}
        />
        {/* 48hrs Deals runs as a self-contained module with its own backend and
            session; everything it owns lives behind this single route. */}
        <Stack.Screen name="Deals48" component={Deals48Stack} />
      </Stack.Navigator>

      <AppUpdateModal
        visible={isUpdateModalVisible}
        updateInfo={updateInfo}
        onLater={() => setIsUpdateModalVisible(false)}
      />
    </>
  );
}

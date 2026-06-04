import {useContext, useEffect} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LocationFetchingScreen from '../screens/LocationFetchingScreen';
import LocationFetchingNewScreen from '../screens/LocationFetchingNewScreen';
import MainTabNavigator from './MainTabNavigator';
import CartScreen from '../screens/CartScreen'
import ProfileScreen from '../screens/ProfileScreen'
import AddLocationScreen from '../screens/AddLocationScreen'
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen'
import LoginScreen from '../screens/LoginScreen'
import RegistraionScreen from '../screens/RegistrationScreen'
import OtpScreen from '../screens/OtpScreen'
import ChangePwdScreen from '../screens/ChangePwdScreen'
import BCoinScreen from '../screens/BCoinScreen'
import SearchScreen from '../screens/SearchScreen'
import OrderSuccessScreen from '../screens/OrderSuccessScreen'
import OrderFailedScreen from '../screens/OrderFailedScreen'
import OrderPendingScreen from '../screens/OrderPendingScreen'
import SplashScreen from '../screens/SplashScreen'
import LoginPwdScreen from '../screens/LoginPwdScreen'
import SavedAddressScreen from '../screens/SavedAddressScreen'
import ReferralScreen from '../screens/ReferralScreen'
import { AppContext } from '../context/appContext';
import EditProfileScreen from '../screens/EditProfileScreen'
import ChangePasswordScreen from '../screens/ChangePasswordScreen'
import UpdateContactScreen from '../screens/UpdateContactScreen'
import CheckoutScreen from '../screens/CheckoutScreen'
import ProductListScreen from '../screens/ProductListScreen'
import SupportTicketScreen from '../screens/SupportTicketScreen'
import SupportTicketsListScreen from '../screens/SupportTicketsListScreen'
import TicketDetailsScreen from '../screens/TicketDetailsScreen'
import AppUpdateModal from '../components/AppUpdateModal';
import AuthSuccessScreen from '../screens/AuthSuccessScreen';
import KshopeScreen from '../screens/KshopeScreen';
import CoPartnerDashboardScreen from '../screens/CoPartnerDashboardScreen';
import CoPartnerListScreen from '../screens/CoPartnerListScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {

    const { loadProfileTwo, profile, loadProfile, isUpdateModalVisible, setIsUpdateModalVisible, updateInfo } = useContext(AppContext);

    useEffect(() => {
        loadProfile();
    }, []);

    if (!profile) {
        return null; // or splash loader
    }

    return (
        <>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {console.log("lllllll", profile)}
                {/* <Stack.Screen name="LocationFetching" component={LocationFetchingScreen} /> */}
                {/* <Stack.Screen name="SplashScreen" component={SplashScreen} /> */}
                {/* <Stack.Screen name="LocationFetching" component={LocationFetchingScreen} /> */}
                <Stack.Screen name="LocationFetchingNew" component={LocationFetchingNewScreen} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="LoginPwdScreen" component={LoginPwdScreen} />
                <Stack.Screen name="RegistraionScreen" component={RegistraionScreen} />
                <Stack.Screen name="OtpScreen" component={OtpScreen} />
                <Stack.Screen name="ChangePwdScreen" component={ChangePwdScreen} />
                <Stack.Screen name="MainTabs" component={MainTabNavigator} />
                <Stack.Screen name="CartScreen" component={CartScreen} />
                <Stack.Screen name="AddLocationScreen" component={AddLocationScreen} />
                <Stack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} />
                <Stack.Screen name="OrderTrackingScreen" component={OrderTrackingScreen} />
                <Stack.Screen name="BCoinScreen" component={BCoinScreen} />
                <Stack.Screen name="SearchScreen" component={SearchScreen} />
                {/* <Stack.Screen name="ProfileScreen" component={ProfileScreen} /> */}
                <Stack.Screen name="OrderSuccessScreen" component={OrderSuccessScreen} options={{ gestureEnabled: false }} />
                <Stack.Screen name="OrderFailedScreen" component={OrderFailedScreen} options={{ gestureEnabled: false }} />
                <Stack.Screen name="OrderPendingScreen" component={OrderPendingScreen} options={{ gestureEnabled: false }} />
                <Stack.Screen name='SavedAddressScreen' component={SavedAddressScreen} />
                <Stack.Screen name='ReferralScreen' component={ReferralScreen} />
                <Stack.Screen name='EditProfileScreen' component={EditProfileScreen} />
                <Stack.Screen name='ChangePasswordScreen' component={ChangePasswordScreen} />
                <Stack.Screen name='UpdateContactScreen' component={UpdateContactScreen} />
                <Stack.Screen name='CheckoutScreen' component={CheckoutScreen} />
                <Stack.Screen name='ProductListScreen' component={ProductListScreen} />
                <Stack.Screen name='SupportTicketScreen' component={SupportTicketScreen} />
                <Stack.Screen name='SupportTicketsListScreen' component={SupportTicketsListScreen} />
                <Stack.Screen name='TicketDetailsScreen' component={TicketDetailsScreen} />
                <Stack.Screen name='AuthSuccessScreen' component={AuthSuccessScreen} />
                <Stack.Screen name='KshopeScreen' component={KshopeScreen} />
                <Stack.Screen name='CoPartnerDashboardScreen' component={CoPartnerDashboardScreen} />
                <Stack.Screen name='CoPartnerListScreen' component={CoPartnerListScreen} />
            </Stack.Navigator>

            <AppUpdateModal
                visible={isUpdateModalVisible}
                updateInfo={updateInfo}
                onLater={() => setIsUpdateModalVisible(false)}
            />
        </>
    );
}

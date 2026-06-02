import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LocationFetchingScreen from '../screens/LocationFetchingScreen';
import CartScreen from '../screens/CartScreen'
import ProfileScreen from '../screens/ProfileScreen'
import HomeScreen from '../screens/HomeScreen';
import MyOrdersScreen from '../screens/MyOrdersScreen'
const Stack = createNativeStackNavigator();

export default function HomeStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* <Stack.Screen name="LocationFetching" component={LocationFetchingScreen} /> */}
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            {/* <Stack.Screen name="CartScreen" component={CartScreen} /> */}
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="MyOrdersScreen" component={MyOrdersScreen} />
        </Stack.Navigator>
    );
}

import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, FlatList } from 'react-native'
import React, { useContext, useState } from 'react'
import { AppContext } from '../context/appContext'
import StoreUnavailable from '../components/StoreUnavailable'
import LocationModal from '../components/LocationModal'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'
import MyOrdersProductCard from '../components/MyOrdersProductCard'
import { getMyOrdersApi } from '../api/orderService';
import { LoaderContext } from '../context/loaderContext'

const MyOrdersScreen = () => {
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const { showLoader } = useContext(LoaderContext);
    const { isStoreUnavailable, storeUnavailableData } = useContext(AppContext);
    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

    const fetchOrders = async () => {
        try {
            showLoader(true);
            const response = await getMyOrdersApi();
            console.log('My Orders Response:', JSON.stringify(response, null, 2));
            // Assuming response structure: { success: true, data: { items: [...] } } or similar
            // User did not provide response example for list, but usually consistent.
            if (response && response.success && response.data && response.data.items) {
                setOrders(response.data.items);
            } else if (response && response.data && Array.isArray(response.data)) {
                setOrders(response.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
            showLoader(false);
        }
    };

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchOrders();
        });
        return unsubscribe;
    }, [navigation]);
    const navigation = useNavigation()
    return (
        <SafeAreaView style={styles.mainContainer}>
            <LinearGradient
                colors={['#FFE7DB', '#FFFFFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => {
                        if (navigation.canGoBack()) {
                            navigation.goBack();
                        } else {
                            navigation.navigate('HomeScreen');
                        }
                    }}>
                        <AntDesign
                            name={'left'}
                            size={wp('6%')}
                            color={'#000000'}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>My Orders</Text>
                    <Image style={styles.bearImage} source={require('../assets/images/bear2.png')} />
                </View>
            </LinearGradient>
            <View style={{
                borderWidth: 1,
                borderColor: '#00000040',
                borderTopLeftRadius: wp('9.3%'),
                borderTopRightRadius: wp('9.3%'),
                paddingTop: hp('1%'),
                paddingBottom: hp('2%'),
                alignItems: 'center',
                flex: 1,
            }}>
                <FlatList
                    data={orders}
                    keyExtractor={(item, index) => (item.id || item.orderId || index).toString()}
                    renderItem={(item, index) => <MyOrdersProductCard item={item} />}
                    contentContainerStyle={{
                        marginTop: hp('2%'),
                        paddingBottom: hp('7%'),
                        width: wp('100%')
                    }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <LocationModal
                visible={isLocationModalVisible}
                onClose={() => setIsLocationModalVisible(false)}
            />
        </SafeAreaView>
    )
}

export default MyOrdersScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: wp('4.65%'),
        justifyContent: 'space-between',
        paddingTop: hp('1.5%'),
        paddingRight: wp('7%')
    },
    headerText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.65%'),
        color: '#000000',
        flex: 1,
        marginLeft: wp('3%')
    },
    bearImage: {
        width: wp('21.86%'),
        height: hp('7.86%'),
        resizeMode: 'contain',
    }
})
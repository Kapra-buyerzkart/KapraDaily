import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'
import MyOrdersProductCard from '../components/MyOrdersProductCard'

const MyOrdersScreen = () => {
    const orders = [
        {
            id: '1',
            addressType: "Home",
            status: 'Delivered',
            selectedProducts: [
                { id: "1", image: require('../assets/images/product1.png') },
                { id: "2", image: require('../assets/images/product2.png') },
                { id: "3", image: require('../assets/images/product3.png') },
                { id: "4", image: require('../assets/images/product1.png') },
                { id: "5", image: require('../assets/images/product2.png') },
                { id: "6", image: require('../assets/images/product3.png') },
            ],
            price: 324,
            date: '05/01/2026',
            time: '6:08pm',
            orderNumber: 'ORD43446456547'
        },
        {
            id: '2',
            addressType: "Work",
            status: 'Delivered',
            selectedProducts: [
                { id: "3", image: require('../assets/images/product3.png') },
                { id: "4", image: require('../assets/images/product1.png') },
                { id: "5", image: require('../assets/images/product2.png') },
                { id: "6", image: require('../assets/images/product3.png') },
            ],
            price: 324,
            date: '04/01/2026',
            time: '6:08pm',
            orderNumber: 'ORD43446456548'
        },
        {
            id: '3',
            addressType: "Work",
            status: 'Delivered',
            selectedProducts: [
                { id: "3", image: require('../assets/images/product3.png') },
                { id: "4", image: require('../assets/images/product1.png') },
                { id: "5", image: require('../assets/images/product2.png') },
                { id: "6", image: require('../assets/images/product3.png') },
            ],
            price: 324,
            date: '04/01/2026',
            time: '6:08pm',
            orderNumber: 'ORD43446456548'
        },
        {
            id: '4',
            addressType: "Work",
            status: 'Delivered',
            selectedProducts: [
                { id: "3", image: require('../assets/images/product3.png') },
                { id: "4", image: require('../assets/images/product1.png') },
                { id: "5", image: require('../assets/images/product2.png') },
                { id: "6", image: require('../assets/images/product3.png') },
            ],
            price: 324,
            date: '04/01/2026',
            time: '6:08pm',
            orderNumber: 'ORD43446456548'
        },
    ]
    const navigation = useNavigation()
    return (
        <SafeAreaView style={styles.mainContainer}>
            <LinearGradient
                colors={['#FFE7DB', '#FFFFFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
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
                alignItems: 'center'
            }}>
                {/* <MyOrdersProductCard /> */}
                <FlatList
                    data={orders}
                    keyExtractor={(item, index) => item.id}
                    renderItem={(item, index) => <MyOrdersProductCard item={item} />}
                    contentContainerStyle={{
                        marginTop: hp('2%'),
                        paddingBottom: hp('7%')
                    }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
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
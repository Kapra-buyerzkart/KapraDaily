import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import { useNavigation } from '@react-navigation/native';

const MyOrdersProductCard = (props) => {

    const selectedProducts = [
        { id: "1", image: require('../assets/images/product1.png') },
        { id: "2", image: require('../assets/images/product2.png') },
        { id: "3", image: require('../assets/images/product3.png') },
        { id: "4", image: require('../assets/images/product1.png') },
        { id: "5", image: require('../assets/images/product2.png') },
        { id: "6", image: require('../assets/images/product3.png') },
    ];

    const navigation = useNavigation()

    return (
        <View style={{
            marginBottom: hp('2%')
        }}>
            <View style={styles.orderInnerContainer}>
                <View style={styles.orderTopView}>
                    <View style={styles.orderTopInnerView}>
                        <Image style={styles.homeIcon} source={require('../assets/images/home_icon.png')} />
                        <Text style={Platform.OS === 'android' ? [styles.homeText, {
                            top: hp('0.3')
                        }] : [styles.homeText, {
                            top: hp('0.1')
                        }]}>{props.item.item.addressType}</Text>
                    </View>
                    <View style={styles.orderTopInnerView}>
                        <Image style={styles.successIcon} source={require('../assets/images/success.png')} />
                        <Text style={Platform.OS === 'android' ? [styles.homeText, {
                            top: hp('0.1')
                        }] : styles.homeText}>{props.item.item.status}</Text>
                    </View>
                </View>
                <View style={styles.orderMiddleView}>
                    <View style={styles.stackContainer}>
                        {props.item.item.selectedProducts.slice(0, 3).map((item, index) => (
                            <Image
                                key={index}
                                source={item.image}
                                style={[
                                    styles.productImage,
                                    {
                                        marginLeft: index === 0 ? 0 : wp("-7%"), // overlap to left
                                        // zIndex: index + 1,                 // last image on top
                                    },
                                ]}
                            />
                        ))}
                    </View>
                    <View>
                        <Text style={styles.orderNumberText}>#{props.item.item.orderNumber}</Text>

                        <Text style={[styles.orderNumberText, {
                            marginTop: hp('0.2%')
                        }]}>Total item : {props.item.item.selectedProducts.length}</Text>
                    </View>
                    <Text style={styles.priceText}>₹{props.item.item.price}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('OrderTrackingScreen')} style={[styles.button, {
                        borderWidth: 1,
                        borderColor: '#DADADA',
                    }]}>
                        <Text style={[styles.buttonText, {
                            color: '#616161',

                        }]}>Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, {
                        backgroundColor: '#F25000'
                    }]}>
                        <Text style={[styles.buttonText, {
                            color: '#FFFFFF',
                        }]}>Reorder</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.orderBottomView}>
                <Text style={styles.placedOrderText}>Placed order: {props.item.item.date} {props.item.item.time}</Text>
            </View>
        </View>
    )
}

export default MyOrdersProductCard

const styles = StyleSheet.create({
    productImage: {
        height: wp("13.5%"),
        width: wp("13.5%"),
        borderRadius: 100,
        borderWidth: 1,
        borderColor: "#00000040",
        // backgroundColor: "#fff",
    },
    orderInnerContainer: {
        width: wp('90.7%'),
        height: hp('19%'),
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: wp('2.33%'),
        paddingVertical: hp('0.7%'),
    },
    orderTopView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderStyle: 'dashed',
        borderBottomWidth: 1,
        paddingHorizontal: wp('2.5%'),
        paddingBottom: hp('1%'),
        borderColor: '#DADADA',
    },
    orderTopInnerView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    homeIcon: {
        width: wp('3.72%'),
        height: hp('1.4%')
    },
    successIcon: {
        width: wp('3.02%'),
        height: hp('1.4%')
    },
    homeText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.25%'),
        color: '#000000',
        marginLeft: wp('1.5%'),
    },
    orderMiddleView: {
        flexDirection: 'row',
        marginTop: hp('1.5%'),
        justifyContent: 'space-between',
        paddingHorizontal: wp('2.5%'),
        alignItems: 'center',
    },
    orderNumberText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.72%'),
        color: '#000000'
    },
    priceText: {
        color: '#0CA201',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('5.11%'),
        alignSelf: 'flex-end'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: wp('2.5%'),
        marginTop: hp('1.5%')
    },
    button: {
        width: wp('41%'),
        height: hp('4.3%'),
        borderRadius: wp('1.86%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.95%')
    },
    placedOrderText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.25%'),
        color: '#616161'
    },
    orderBottomView: {
        paddingTop: hp('0.5%'),
        paddingLeft: wp('2.7%')
    },
    stackContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
})
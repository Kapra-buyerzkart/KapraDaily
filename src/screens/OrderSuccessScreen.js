import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FONTS } from '../styles/typography'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useNavigation } from '@react-navigation/native'

const OrderSuccessScreen = () => {
    const navigation = useNavigation()
    return (
        <SafeAreaView style={styles.mainContainer}>
            <LinearGradient
                colors={['#DFFFD9', '#FFFFFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradientContainer}
            >
                <Image style={styles.successImage} source={require('../assets/images/success-two.png')} />
                <View style={styles.thankYouContainer}>
                    <Text style={styles.thankYouText}>Thank You</Text>
                    <Text style={styles.thankYouTextTwo}>for Your Order</Text>
                </View>

                <View style={styles.orderDetailsContainer}>
                    <Text style={styles.orderNoText}>Order number : ORD 74848993304</Text>
                    <Text style={styles.orderNoText}>Payment type : Cash On Delivery</Text>
                    <Text style={styles.orderNoText}>Total items : 6</Text>
                </View>
                <View style={styles.totalamountContainer}>
                    <Text style={styles.totalamountText}>Total Amount : </Text>
                    <Text style={[styles.totalamountText, {
                        fontFamily: FONTS.poppins.bold,
                    }]}>₹3002.00</Text>
                </View>
                <View style={styles.bottomContainer}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Track Order</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('MainTabs')} style={[styles.button, {
                        borderRadius: wp('2.33%'),
                        backgroundColor: '#F25000',
                        marginLeft: wp('2.5%'),
                    }]}>
                        <Text style={[styles.buttonText, {
                            color: '#FFFFFF',
                        }]}>Back to home</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    )
}

export default OrderSuccessScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    gradientContainer: {
        flex: 1
    },
    thankYouContainer: {
        alignItems: 'center',
        marginTop: hp('0.5%')
    },
    thankYouText: {
        color: '#0FE000',
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('5.1%')
    },
    thankYouTextTwo: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('3.4%'),
        color: '#616161',
        bottom: hp('0.5%')
    },
    orderNoText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.25%'),
        color: '#2B2B2B',
        marginBottom: hp('0.3%')
    },
    successImage: {
        width: wp('37.2%'),
        height: wp('37.2%'),
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: hp('20%')
    },
    orderDetailsContainer: {
        alignItems: 'center',
        marginTop: hp('8%')
    },
    totalamountContainer: {
        flexDirection: "row",
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
        bottom: hp('9%')
    },
    totalamountText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('4.18%'),
        color: '#2B2B2B'
    },
    bottomContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        justifyContent: 'space-between',
        alignSelf: 'center',
        marginBottom: hp('2%')
    },
    button: {
        width: wp('43.02%'),
        height: hp('5.36%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: wp('2.33%')
    },
    buttonText: {
        fontFamily: FONTS.outfit.bold,
        fontSize: wp('4.65%'),
        color: '#F25000'
    }
})
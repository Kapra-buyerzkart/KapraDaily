import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'
import { useNavigation } from '@react-navigation/native'

const CartEmptyComponent = () => {
    const navigation = useNavigation()

    return (
        <View style={styles.mainContainer}>
            <Image
                style={styles.imageStyle}
                source={require('../assets/images/empty_cart_illustration.png')}
            />
            <Text style={styles.titleText}>Your cart is empty</Text>
            <Text style={styles.subtitleText}>Looks like you haven't added anything to your cart yet.</Text>

            <TouchableOpacity
                style={styles.shopNowButton}
                onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
            >
                <Text style={styles.shopNowText}>Shop Now</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CartEmptyComponent

const styles = StyleSheet.create({
    mainContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: wp('10%'),
        marginTop: hp('10%')
    },
    imageStyle: {
        width: wp('60%'),
        height: hp('30%'),
        resizeMode: 'contain',
        marginBottom: hp('3%')
    },
    titleText: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('6%'),
        color: '#000000',
        marginBottom: hp('1%')
    },
    subtitleText: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3.8%'),
        color: '#777777',
        textAlign: 'center',
        marginBottom: hp('4%')
    },
    shopNowButton: {
        backgroundColor: '#F25000',
        paddingHorizontal: wp('10%'),
        paddingVertical: hp('1.5%'),
        borderRadius: 12,
        shadowColor: "#F25000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8
    },
    shopNowText: {
        color: '#FFFFFF',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.5%')
    }
})

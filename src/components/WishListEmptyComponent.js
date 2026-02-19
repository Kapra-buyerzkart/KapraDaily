import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'
import { useNavigation } from '@react-navigation/native'

const WishListEmptyComponent = () => {
    const navigation = useNavigation()

    return (
        <View style={styles.mainContainer}>
            <Image style={styles.imageStyle} source={require('../assets/images/wishlist-empty-image.png')} />
            <Text style={styles.noWishesText}>No Wishlist Items</Text>

            <TouchableOpacity
                style={styles.backToHomeButton}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={styles.backToHomeText}>Back to Home</Text>
            </TouchableOpacity>
        </View>
    )
}

export default WishListEmptyComponent

const styles = StyleSheet.create({
    mainContainer: {
        alignItems: 'center',
        width: wp('100%')
    },
    imageStyle: {
        width: wp('39.53%'),
        height: hp('22.32%'),
        resizeMode: 'contain',
        marginTop: hp('8%')
    },
    noWishesText: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('6%'),
        marginTop: hp('1%')
    },
    newWishesButton: {
        width: wp('39.53%'),
        height: hp('5.04%'),
        backgroundColor: '#F25000',
        borderRadius: wp('2.33%'),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: hp('3%')
    },
    heartIcon: {
        width: wp('4.19%'),
        height: hp('1.82%'),
        resizeMode: 'contain'
    },
    newWishesText: {
        color: '#FFFFFF',
        fontFamily: FONTS.poppins.extraBold,
        fontSize: wp('3.25%'),
        marginLeft: wp('1.5%')
    },
    backToHomeButton: {
        backgroundColor: '#F25000',
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('1.2%'),
        borderRadius: wp('2.33%'),
        marginTop: hp('3%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    backToHomeText: {
        color: '#FFFFFF',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%')
    }
})
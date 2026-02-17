import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'
import CONFIG from '../globals/config'
import AppButton from './AppButton'

const OrderProductCard = ({ item, orderStatus, onReturn }) => {
    const [imageError, setImageError] = useState(false);

    // Helper to resolve image source
    const getImageSource = (img) => {
        if (!img || imageError) return require('../assets/images/categories/dfn.png');
        if (typeof img === 'string') {
            if (img.startsWith('http')) return { uri: img };
            return { uri: `${CONFIG.image_base_url}${img}` };
        }
        return img;
    };

    const imageSource = getImageSource(item.image || item.prImage || item.productImage || item.product_image || item.featuredImage || item.img);

    // Determine Status Eligibility for Return
    const canReturn = orderStatus === 'delivered' && !item.isReturned && !item.returnRequested;

    return (
        <View style={styles.cardContainer}>
            <Image
                style={styles.productImage}
                source={imageSource}
                onError={() => setImageError(true)}
            />
            <View style={styles.detailsContainer}>
                <Text style={styles.productName} numberOfLines={2}>{item.productName}</Text>
                <Text style={styles.quantityText}>Qty: {item.quantity}</Text>
                <Text style={styles.priceText}>₹{item.lineTotal || item.netAmount || item.price || item.unitPrice * item.quantity}</Text>

                {canReturn && (
                    <AppButton
                        title="Return"
                        onPress={() => onReturn(item)}
                        variant="outline"
                        style={styles.returnButton}
                        textStyle={styles.returnButtonText}
                    />
                )}
                {item.returnRequested && (
                    <View style={styles.statusBadge}>
                        <Text style={styles.returnStatusText}>Return Requested</Text>
                    </View>
                )}
                {item.isReturned && (
                    <View style={[styles.statusBadge, { backgroundColor: '#E8F5E9' }]}>
                        <Text style={[styles.returnStatusText, { color: '#2E7D32' }]}>Returned</Text>
                    </View>
                )}
            </View>
        </View>
    )
}

export default OrderProductCard

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        paddingVertical: hp('1.5%'),
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        alignItems: 'center'
    },
    productImage: {
        width: wp('18%'),
        height: wp('18%'),
        resizeMode: 'contain',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E8E8E8'
    },
    detailsContainer: {
        flex: 1,
        marginLeft: wp('3%')
    },
    productName: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('3.5%'),
        color: '#000000'
    },
    quantityText: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3.2%'),
        color: '#777777',
        marginTop: hp('0.3%')
    },
    priceText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.8%'),
        color: '#000000',
        marginTop: hp('0.3%')
    },
    returnButton: {
        marginTop: hp('0.8%'),
        paddingVertical: hp('0.5%'),
        paddingHorizontal: wp('3%'),
        borderRadius: 4,
        minHeight: hp('3.5%'),
        alignSelf: 'flex-start',
    },
    returnButtonText: {
        fontSize: wp('3%'),
    },
    statusBadge: {
        backgroundColor: '#FFF3E0',
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('0.3%'),
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginTop: hp('0.8%'),
    },
    returnStatusText: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('2.8%'),
        color: '#F2994A'
    }
});

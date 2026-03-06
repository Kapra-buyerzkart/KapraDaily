import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { FONTS } from '../styles/typography';
import CONFIG from '../globals/config';

const TokenProductCard = ({ item, onPress, onAdd, onToggleWishlist, isInWishlist }) => {
    const [imageError, setImageError] = useState(false);

    const productId = item?.productId || item?.id;
    const name = item?.prName || item?.name || 'Lorem Ipsum is simply dummy textsimply dummy';
    const mrp = item?.mrp || item?.unitPrice || '394';
    const price = item?.price || item?.specialPrice || '324';
    const offer = item?.offer || item?.discountPercentage ? `${Math.round(item?.offer || item?.discountPercentage)}% OFF` : '50% OFF';
    const weight = item?.weight || '1kg';
    const token = item?.token || '1B Token';

    const liked = isInWishlist ? isInWishlist(productId) : false;

    const imageSource = useMemo(() => {
        const img = item?.featuredImage || item?.image || item?.img || item?.imageUrl;

        if (!img || imageError) {
            return require('../assets/images/categories/dfn.png'); // Fallback image
        }

        if (typeof img === 'string') {
            if (img.startsWith('http')) return { uri: img };
            return { uri: `${CONFIG.image_base_url}${img}` };
        }

        return img;
    }, [item, imageError]);

    return (
        <TouchableOpacity activeOpacity={0.85} style={styles.cardContainer} onPress={onPress}>
            {/* Top White Card Box */}
            <View style={styles.topCardBox}>
                <View style={styles.topRow}>
                    <TouchableOpacity onPress={() => onToggleWishlist && onToggleWishlist(item)} activeOpacity={0.8}>
                        <FontAwesome name={liked ? "heart" : "heart-o"} size={wp('5.5%')} color={liked ? "#FF0048" : "#979797"} />
                    </TouchableOpacity>
                    <Text style={styles.tokenText}>{token}</Text>
                    <TouchableOpacity style={styles.plusIconCircle} onPress={onAdd}>
                        <Entypo name="plus" size={wp('4.5%')} color="#F04B1B" />
                    </TouchableOpacity>
                </View>

                <Image
                    source={imageSource}
                    style={styles.productImage}
                    resizeMode="contain"
                    onError={() => setImageError(true)}
                />

                <View style={styles.priceContainer}>
                    <LinearGradient
                        colors={['#FF8E5E', '#F3602D']}
                        style={styles.pricePill}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.priceText}>₹{price}</Text>
                    </LinearGradient>
                    <View style={styles.mrpContainer}>
                        <Text style={styles.mrpLabel}>MRP <Text style={styles.mrpText}>₹{mrp}</Text></Text>
                    </View>
                </View>
            </View>

            {/* Bottom Info Section */}
            <View style={styles.bottomInfoSection}>
                <View style={styles.offerRow}>
                    <Text style={styles.offerText}>{offer}</Text>
                    <View style={styles.dashedLineContainer}>
                        <View style={styles.dashedLine} />
                    </View>
                </View>

                <Text style={styles.productName} numberOfLines={3}>
                    {name}
                </Text>

                <Text style={styles.productWeight}>{weight}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default React.memo(TokenProductCard);

const styles = StyleSheet.create({
    cardContainer: {
        width: wp('42%'),
        marginVertical: hp('1%'),
        marginHorizontal: wp('2%'),
    },
    topCardBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: wp('5%'),
        padding: wp('3%'),
        paddingBottom: hp('1.5%'),
        // Match Figma-style soft orange shadow
        borderWidth: 0,
        borderColor: 'transparent',
        shadowColor: '#F25000',
        shadowOpacity: 0.4,              // 40%
        shadowOffset: { width: 0, height: 3 }, // Y = 3
        shadowRadius: 2,                 // Blur ~2
        elevation: 4,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tokenText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('2.5%'),
        color: '#333333',
        marginTop: hp('0.2%'),
    },
    plusIconCircle: {
        width: wp('6.5%'),
        height: wp('6.5%'),
        borderRadius: wp('3.25%'),
        borderWidth: 1,
        borderColor: '#F1A582',
        backgroundColor: '#FFE9E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    productImage: {
        width: wp('28%'),
        height: wp('28%'),
        alignSelf: 'center',
        marginTop: hp('0.5%'),
        marginBottom: hp('1%'),
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pricePill: {
        //  paddingHorizontal: wp('2.5%'),
        // paddingVertical: hp('2%'),
        // paddingHorizontal:20,
        width: wp('13%'),
        height: hp('3%'),
        borderRadius: wp('5%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('1%'),
    },
    priceText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.5%'),
        color: '#FFFFFF',
    },
    mrpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mrpLabel: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('4.0%'),
        color: '#999999',
    },
    mrpText: {
        textDecorationLine: 'line-through',
    },
    bottomInfoSection: {
        marginTop: hp('1.5%'),
        paddingHorizontal: wp('1%'),
        paddingTop: hp('1%'),
        borderTopWidth: 0.5,
        borderTopColor: '#E0E0E0', // light grey top border under card
    },
    offerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('0.5%'),
    },
    offerText: {
        fontFamily: FONTS.outfit.bold,
        fontSize: wp('3.2%'),
        color: '#0CA201',
        fontWeight:'600',
        fontFamily:'Poppins-SemiBold'
    },
    dashedLineContainer: {
        flex: 1,
        marginLeft: wp('2%'),
        justifyContent: 'center',
        overflow: 'hidden',
    },
    dashedLine: {
        width: '100%',
        height: 0.8,
        borderWidth: 0.5,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
        borderRadius: 0.5,
    },
    productName: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('3.8%'),
        color: '#333333',
        lineHeight: hp('2.2%'),
        marginBottom: hp('0.5%'),
        //fontWeight:'600', 
        fontFamily:'Poppins-SemiBold',
        minHeight: hp('6.6%'), // ensures alignment for 3 lines
    },
    productWeight: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('2.8%'),
        color: '#888888',
    }
});

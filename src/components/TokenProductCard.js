import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { FONTS } from '../styles/typography';
import CONFIG from '../globals/config';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const TokenProductCard = ({ item, onPress, onAdd, onToggleWishlist, isInWishlist: propIsInWishlist, hideWishlist, isThreeColumn }) => {

    const [imageError, setImageError] = useState(false);

    const { addToCart, cartItems, updateCartItemQuantity, removeFromCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    const productId = item?.productId || item?.id;
    const name = item?.prName || item?.name || 'Lorem Ipsum is simply dummy textsimply dummy';
    const mrp = item?.mrp || item?.unitPrice || '394';
    const price = item?.price || item?.specialPrice || '324';
    const offer = item?.offer || item?.discountPercentage ? `${Math.round(item?.offer || item?.discountPercentage)}% OFF` : '50% OFF';
    const weight = item?.weight || '1kg';
    const token = item?.token || '1B Token';

    const liked = propIsInWishlist ? propIsInWishlist(productId) : isInWishlist(productId);

    const cartItem = cartItems.find(i => String(i.productId || i.id) === String(productId));
    const quantity = cartItem?.quantity || cartItem?.addedQty || 0;
    const cartItemId = cartItem?.cartItemId || productId;

    const isOutOfStock = (item?.stockQty === 0 || item?.stockQty === '0') || item?.isAvailable === false;

    const imageSource = useMemo(() => {

        const img = item?.featuredImage || item?.image || item?.img || item?.imageUrl;

        if (!img || imageError) {
            return require('../assets/images/categories/dfn.png');
        }

        if (typeof img === 'string') {

            if (img.startsWith('http')) return { uri: img };

            return { uri: `${CONFIG.image_base_url}${img}` };
        }

        return img;

    }, [item, imageError]);

    return (

        <TouchableOpacity activeOpacity={0.9} style={[styles.cardContainer, isThreeColumn && styles.threeColumnContainer]} onPress={onPress}>

            <View style={styles.topCardBox}>

                {/* Top Row */}
                <View style={styles.topRow}>

                    {!hideWishlist ? (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => onToggleWishlist ? onToggleWishlist(item) : toggleWishlist(item)}
                        >
                            <FontAwesome
                                name={liked ? "heart" : "heart-o"}
                                size={isThreeColumn ? wp('4.5%') : wp('5.5%')}
                                color={liked ? "#FF0048" : "#B0B0B0"}
                                style={styles.heartIcon}
                            />
                        </TouchableOpacity>
                    ) : <View style={{ width: wp('5.5%'), marginStart: 10 }} />}

                    {quantity > 0 ? null : <Text style={[styles.tokenText, isThreeColumn && { fontSize: wp('2.2%') }]}>{token}</Text>}

                    {quantity > 0 ? (


                        <LinearGradient
                            colors={['#FFFFFF', '#FFD8C4']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[styles.counterContainer, isThreeColumn && { height: hp('3%'), borderRadius: 15 }]}
                        >

                            <TouchableOpacity
                                style={styles.counterBtn}
                                onPress={() => {

                                    if (quantity === 1) {

                                        removeFromCart(cartItemId);

                                    } else {

                                        updateCartItemQuantity(cartItemId, quantity - 1);

                                    }
                                }}
                            >
                                <Entypo name="minus" size={isThreeColumn ? 16 : 22} color="#F25000" />
                            </TouchableOpacity>

                            <Text style={[styles.counterQty, isThreeColumn && { fontSize: wp('3.5%') }]}>{quantity}</Text>

                            <TouchableOpacity
                                style={styles.counterBtn}
                                onPress={() => updateCartItemQuantity(cartItemId, quantity + 1)}
                            >
                                <Entypo name="plus" size={isThreeColumn ? 16 : 22} color="#F25000" />
                            </TouchableOpacity>

                        </LinearGradient>


                    ) : isOutOfStock ? (

                        <View style={[styles.plusIconDisabled, isThreeColumn && { width: wp('7%'), height: wp('7%'), borderRadius: wp('3.5%') }]}>
                            <Entypo name="plus" size={isThreeColumn ? 16 : 22} color="#FFFFFF" />
                        </View>

                    ) : (

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => onAdd ? onAdd(item) : addToCart(item)}
                        >

                            <LinearGradient
                                colors={['#FFFFFF', '#FFD8C4']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={[styles.plusIconCircle, isThreeColumn && { width: wp('7%'), height: wp('7%'), borderRadius: wp('3.5%') }]}
                            >

                                <Entypo name="plus" size={isThreeColumn ? 16 : 22} color="#F25000" />

                            </LinearGradient>

                        </TouchableOpacity>

                    )}

                </View>

                {/* Image Section */}

                <View style={styles.imageContainer}>

                    <Image
                        source={imageSource}
                        style={[styles.productImage, isThreeColumn && { width: wp('22%'), height: hp('10%') }, isOutOfStock && { opacity: 0.5 }]}
                        resizeMode="contain"
                        onError={() => setImageError(true)}
                    />
                    {isOutOfStock && (
                        <View style={styles.outOfStockOverlay}>
                            <Text style={[styles.outOfStockText, isThreeColumn && { fontSize: wp('2.2%') }]}>Out of Stock</Text>
                        </View>
                    )}

                </View>

                {/* Price Section */}

                <View style={styles.priceContainer}>

                    <LinearGradient
                        colors={['#FF8A5C', '#F25A2B']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.pricePill, isThreeColumn && { width: wp('11%'), height: hp('2.5%') }]}
                    >

                        <Text style={[styles.priceText, isThreeColumn && { fontSize: wp('3%') }]}>
                            ₹{price}
                        </Text>

                    </LinearGradient>

                    <Text style={[styles.mrpLabel, isThreeColumn && { fontSize: wp('2.8%') }]}>
                        MRP <Text style={styles.mrpText}>₹{mrp}</Text>
                    </Text>

                </View>

            </View>

            {/* Bottom Section */}

            <View style={styles.bottomSection}>

                <View style={styles.offerRow}>

                    <Text style={[styles.offerText, isThreeColumn && { fontSize: wp('2.8%') }]}>
                        {offer}
                    </Text>

                    <View style={styles.dashedLine} />

                </View>

                <Text
                    numberOfLines={isThreeColumn ? 2 : 3}
                    style={[styles.productName, isThreeColumn && { fontSize: wp('2.8%'), minHeight: hp('3.5%'), lineHeight: hp('1.8%') }]}
                >
                    {name}
                </Text>

                {/* <Text style={styles.productWeight}>
                    {weight}
                </Text> */}

            </View>

        </TouchableOpacity >

    );

};

export default React.memo(TokenProductCard);

const styles = StyleSheet.create({

    cardContainer: {
        width: wp('42%'),
        marginVertical: hp('1%'),
        marginHorizontal: wp('2%'),
    },
    threeColumnContainer: {
        width: wp('29%'),
        marginHorizontal: wp('1%'),
    },

    topCardBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        // paddingHorizontal: wp('3%'),
        paddingVertical: hp('1%'),
        shadowColor: '#F25000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 10,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#F2F2F2',
    },
    heartIcon: {
        fontSize: wp('6.5%'),
        // color: '#B0B0B0',
        marginStart: 10
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    tokenText: {
        fontSize: wp('2.5%'),
        color: '#333',
        fontFamily: FONTS.poppins.medium,
    },

    plusIconCircle: {
        width: wp('8.5%'),
        height: wp('8.5%'),
        borderRadius: wp('4.25%'),
        justifyContent: 'center',
        borderWidth: 0.8,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        borderColor: '#FCD3C0',
        marginEnd: 10,
        elevation: 2,
    },
    plusIconDisabled: {
        width: wp('8.5%'),
        height: wp('8.5%'),
        borderRadius: wp('4.25%'),
        backgroundColor: '#CCCCCC',
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 10,
    },

    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        //  width: wp('25%'),
        height: hp('3.8%'),
        borderRadius: 20,
        //  paddingHorizontal: wp('2%'),
        borderWidth: 0.2,
        borderColor: '#F25000',
        marginEnd: 10
        // paddingHorizontal: wp('3.5%'),
    },

    counterBtn: {
        width: wp('8.5%'),
        alignItems: 'center',
        justifyContent: 'center',
    },

    counterQty: {
        fontSize: wp('4.2%'),
        color: '#F25000',
        fontFamily: FONTS.poppins.semiBold,
        marginHorizontal: wp('1%'),
    },

    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        // marginVertical: hp('1%'),
    },

    imageFrame: {
        width: wp('6%'),
        height: wp('26%'),
        borderRadius: 18,
        borderWidth: 2,
        // borderColor: '#1B8CFF',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },

    productImage: {
        width: 134,
        height: 126,
    },

    // tokenBadge: {
    //     position: 'absolute',
    //     top: hp('-1%'),
    //     alignSelf: 'center',
    //     backgroundColor: '#7B5AF5',
    //     paddingHorizontal: wp('3%'),
    //     paddingVertical: hp('0.4%'),
    //     borderRadius: 6,
    // },

    // tokenBadgeText: {
    //     color: '#FFF',
    //     fontSize: wp('2.5%'),
    //     fontFamily: 'Poppins-SemiBold',
    // },

    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginEnd: wp('2%'),
    },

    pricePill: {
        borderRadius: 24,
        width: wp('15%'),
        height: hp('3.5%'),
        justifyContent: 'center',
        marginStart: wp('2%'),
        shadowColor: '#F25000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 5,
        elevation: 5,
    },

    priceText: {
        color: '#FFF',
        fontSize: wp('4.2%'),
        fontFamily: FONTS.poppins.semiBold,
        alignSelf: 'center',
    },

    mrpLabel: {
        fontSize: wp('3.2%'),
        color: '#9B9B9B',
        fontFamily: FONTS.poppins.medium,
    },

    mrpText: {
        textDecorationLine: 'line-through',
    },

    bottomSection: {
        marginTop: hp('1.2%'),
    },

    offerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('0.6%'),
    },

    offerText: {
        color: '#0CA201',
        fontSize: wp('3.5%'),
        fontFamily: FONTS.poppins.bold,
    },

    dashedLine: {
        flex: 1,
        borderStyle: 'dashed',
        borderWidth: 0.6,
        borderColor: '#CFCFCF',
        marginLeft: wp('2%'),
    },

    productName: {
        fontSize: wp('3.3%'),
        color: '#1E1E1E',
        lineHeight: hp('2.2%'),
        fontFamily: FONTS.poppins.medium,
        minHeight: hp('5%'),
    },

    productWeight: {
        fontSize: wp('2.8%'),
        color: '#888',
        marginTop: hp('0.5%'),
        fontFamily: FONTS.poppins.medium,
    },
    outOfStockOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: 18,
    },
    outOfStockText: {
        color: '#FF0000',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('2.8%'),
        transform: [{ rotate: '-15deg' }],
        borderWidth: 1,
        borderColor: '#FF0000',
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
    },

});
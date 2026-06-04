import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { FONTS } from '../styles/typography';
import CONFIG from '../globals/config';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const TokenProductCard = ({ item, onPress, onAdd, onToggleWishlist, isInWishlist: propIsInWishlist, hideWishlist, isThreeColumn, hideToken, containerStyle }) => {

    const [imageError, setImageError] = useState(false);

    const { addToCart, cartItems, updateCartItemQuantity, removeFromCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    const productId = item?.productId || item?.id;
    const name = item?.prName || item?.name || 'Lorem Ipsum is simply dummy textsimply dummy';
    const mrp = item?.mrp || item?.unitPrice || '394';
    const price = item?.price || item?.specialPrice || '324';
    const offer = item?.offer || item?.discountPercentage || item?.discountPercent ? `${Math.round(item?.offer || item?.discountPercentage || item?.discountPercent)}% OFF` : '';
    const weight = item?.weight || '1kg';
    const token = `${item?.bTokenValue || item?.token || item?.btokens || '1'}B Token`;

    const liked = propIsInWishlist ? propIsInWishlist(productId) : isInWishlist(productId);

    const cartItem = cartItems.find(i => String(i.productId || i.id) === String(productId));
    const quantity = cartItem?.quantity || cartItem?.addedQty || 0;
    const cartItemId = cartItem?.cartItemId || productId;

    const isOutOfStock = (item?.stockQty === 0 || item?.stockQty === '0') || item?.isAvailable === false;

    const imageSource = useMemo(() => {

        const img = item?.featuredImage || item?.image || item?.img || item?.imageUrl;

        if (!img || imageError) {
            return require('../assets/images/noimage.png');
        }

        if (typeof img === 'string') {

            if (img.startsWith('http')) return { uri: img };

            return { uri: `${CONFIG.image_base_url}${img}` };
        }

        return img;

    }, [item, imageError]);

    return (

        <TouchableOpacity activeOpacity={0.9} style={[styles.cardContainer, isThreeColumn && styles.threeColumnContainer, containerStyle]} onPress={onPress}>

            <View style={styles.topCardBox}>

                <View style={styles.topRow}>

                    <View style={styles.topLeftRow}>
                        {!hideWishlist ? (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => onToggleWishlist ? onToggleWishlist(item) : toggleWishlist(item)}
                            >
                                <Image
                                    source={liked ? require('../assets/images/heart_red.png') : require('../assets/images/hearto.png')}
                                    style={[styles.heartIcon, { width: isThreeColumn ? wp('4.2%') : wp('5%'), height: isThreeColumn ? wp('4.2%') : wp('5%') }]}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        ) : null}

                        {(!hideToken && quantity === 0) ? <Text style={[styles.tokenText, isThreeColumn && { fontSize: wp('2%') }]}>{token}</Text> : null}
                    </View>

                </View>

                {quantity > 0 ? (
                    <View style={styles.actionAbsolute}>
                        <LinearGradient
                            colors={['#FFFFFF', '#FFD8C4']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[styles.counterContainer, isThreeColumn && { height: hp('2.8%'), borderRadius: 15 }]}
                        >
                            <TouchableOpacity
                                style={styles.counterBtn}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                onPress={() => updateCartItemQuantity(cartItemId, quantity + 1)}
                            >
                                <Entypo name="plus" size={isThreeColumn ? 16 : 22} color="#F25000" />
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                ) : isOutOfStock ? (
                    <View style={styles.actionAbsolute}>
                        <View style={[styles.plusIconDisabled, isThreeColumn && { width: wp('6%'), height: wp('6%'), borderRadius: wp('3%') }]}>
                            <Entypo name="plus" size={isThreeColumn ? 16 : 20} color="#FFFFFF" />
                        </View>
                    </View>
                ) : (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => onAdd ? onAdd(item) : addToCart(item)}
                        style={styles.actionAbsolute}
                    >
                        <LinearGradient
                            colors={['#FFFFFF', '#FFD8C4']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[styles.plusIconCircle, isThreeColumn && { width: wp('7%'), height: wp('7%'), borderRadius: wp('3.5%') }]}
                        >
                            <Entypo name="plus" size={isThreeColumn ? 16 : 20} color="#F25000" style={{ alignSelf: 'center' }} />
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                {/* Image Section */}
                <View style={styles.imageContainer}>
                    <Image
                        source={imageSource}
                        style={[styles.productImage, isThreeColumn && { width: wp('22%'), height: wp('20%') }, isOutOfStock && { opacity: 0.5 }]}
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
                        style={[styles.pricePill, isThreeColumn && { width: wp('10%'), height: hp('2.2%') }]}
                    >
                        <Text style={[styles.priceText, isThreeColumn && { fontSize: wp('2.6%') }]}>
                            ₹{price}
                        </Text>
                    </LinearGradient>

                    {mrp !== price && <Text style={[styles.mrpLabel, isThreeColumn && { fontSize: wp('2.4%') }]}>
                        ₹<Text style={[styles.mrpText, mrp === price && { textDecorationLine: 'none' }]}>{mrp}</Text>
                    </Text>}
                </View>

            </View>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
                <View style={styles.offerRow}>
                    <Text style={[styles.offerText, isThreeColumn && { fontSize: wp('2.6%') }]}>
                        {offer}
                    </Text>
                    <View style={styles.dashedLine} />
                </View>

                <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[styles.productName, isThreeColumn && { fontSize: wp('2.8%'), minHeight: hp('3.5%'), lineHeight: hp('1.8%') }]}
                >
                    {name}
                </Text>
            </View>
        </TouchableOpacity >

    );

};

export default React.memo(TokenProductCard);

const styles = StyleSheet.create({

    cardContainer: {
        width: wp('30%'),
        marginVertical: hp('1%'),
        marginHorizontal: wp('1%'),
    },
    threeColumnContainer: {
        width: wp('29%'),
        marginHorizontal: wp('1%'),
    },

    topCardBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: hp('0.5%'),
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F2F2F2',
    },
    heartIcon: {
        // height of image is handled inline
    },
    topLeftRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginStart: wp('1%'),
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: wp('7%'), // Make space for the absolute plus icon
    },
    actionAbsolute: {
        position: 'absolute',
        top: 0,
        right: wp('0%'),
        zIndex: 1,
    },

    tokenText: {
        fontSize: wp('2.2%'),
        color: '#9200A8',
        fontFamily: FONTS.poppins.semiBold,
        marginLeft: wp('2.5%'),
    },

    plusIconCircle: {
        width: wp('7%'),
        height: wp('7%'),
        borderRadius: wp('3.5%'),
        justifyContent: 'center',
        borderWidth: 0.5,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        borderColor: '#F25000',
        elevation: 2,
    },
    plusIconDisabled: {
        width: wp('6.5%'),
        height: wp('6.5%'),
        borderRadius: wp('3.25%'),
        backgroundColor: '#CCCCCC',
        justifyContent: 'center',
        alignItems: 'center',
    },

    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: hp('3.6%'),
        borderRadius: 15,
        borderWidth: 0.5,
        borderColor: '#F25000',
    },

    counterBtn: {
        width: wp('9.8%'),
        alignItems: 'center',
        justifyContent: 'center',
    },

    counterQty: {
        fontSize: wp('3.5%'),
        color: '#F25000',
        fontFamily: FONTS.poppins.bold,
    },

    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp('0.5%'),
        // marginVertical: hp('1%'),
    },

    imageFrame: {
        width: wp('6%'),
        height: wp('20%'),
        borderRadius: 18,
        borderWidth: 2,
        // borderColor: '#1B8CFF',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },

    productImage: {
        width: wp('24%'),
        height: wp('24%'),
        resizeMode: 'contain'
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
        alignItems: 'center',
        marginBottom: hp('0.3%'),
    },

    pricePill: {
        borderRadius: 15,
        width: wp('12%'),
        height: hp('2.5%'),
        justifyContent: 'center',
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
        fontSize: wp('3.4%'),
        fontFamily: FONTS.outfit.semiBold,
        alignSelf: 'center',
    },

    mrpLabel: {
        fontSize: wp('3.4%'),
        color: '#9B9B9B',
        marginStart: wp('1%'),
        fontFamily: FONTS.outfit.medium,
    },

    mrpText: {
        textDecorationLine: 'line-through',
    },

    bottomSection: {
        marginTop: hp('0.8%'),
    },

    offerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('0.1%'),
    },

    offerText: {
        color: '#0CA201',
        fontSize: wp('2.5%'),
        fontFamily: FONTS.poppins.extraBold,
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
        fontFamily: FONTS.inter.regular,
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
        marginTop: hp('1.5%')
    },

});
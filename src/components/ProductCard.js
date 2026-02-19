import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { FONTS } from '../styles/typography'
import { useNavigation } from '@react-navigation/native';

import CONFIG from '../globals/config';
import ShimmerPlaceholder from './ShimmerPlaceholder';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = (props) => {
    const [imageLoading, setImageLoading] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Hooks
    const navigation = useNavigation();
    const { addToCart, cartItems, updateCartItemQuantity, removeFromCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    const { item } = props;
    const itemId = item.productId || item.id;
    const isLiked = isInWishlist(itemId);

    const cartItem = cartItems.find(i => String(i.productId || i.id) === String(itemId));
    const quantity = cartItem?.quantity || cartItem?.addedQty || 0;
    const cartItemId = cartItem?.cartItemId || itemId;

    // Helper to resolve image source
    const getImageSource = (img) => {
        if (!img || imageError) return require('../assets/images/categories/dfn.png');
        if (typeof img === 'string') {
            if (img.startsWith('http')) return { uri: img };
            return { uri: `${CONFIG.image_base_url}${img}` };
        }
        return img;
    };

    const name = item.prName || item.name || '';
    const price = item.specialPrice || item.price || '';
    const mrp = item.unitPrice || item.mrp || '';
    let offer = item.discountPercentage ? Math.round(item.discountPercentage) : item.offer || 0;
    if (!offer && mrp && price && mrp > price) {
        offer = Math.round(((mrp - price) / mrp) * 100);
    }
    const imageSource = getImageSource(item.featuredImage || item.img || item.imageUrl);

    useEffect(() => {
        setImageError(false);
        setImageLoading(true);
    }, [item.featuredImage, item.img]);

    const isOutOfStock = (item.stockQty === 0 || item.stockQty === '0') || item.isAvailable === false;

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('ProductDetailsScreen', {
                productId: itemId,
                product: item
            })}
            activeOpacity={0.9}
            style={styles.productCard}
        >
            {/* Top Row: Offer Badge & Heart */}
            <View style={styles.topRow}>
                {offer > 0 ? (
                    <View style={styles.offerBadge}>
                        <Text style={styles.offerBadgeText}>{offer}% OFF</Text>
                    </View>
                ) : <View />}

                <TouchableOpacity
                    onPress={() => toggleWishlist(item)}
                    style={styles.heartContainer}
                >
                    <FontAwesome
                        name={isLiked ? 'heart' : 'heart-o'}
                        size={wp('4%')}
                        color={isLiked ? '#FF0048' : '#979797'}
                    />
                </TouchableOpacity>
            </View>

            {/* Image Section */}
            <View style={styles.imageContainer}>
                {imageLoading && <ShimmerPlaceholder style={styles.productCardImage} />}
                <Image
                    source={imageSource}
                    style={[styles.productCardImage, { opacity: isOutOfStock ? 0.5 : 1 }]}
                    resizeMode="contain"
                    onLoadEnd={() => setImageLoading(false)}
                    onError={() => {
                        setImageError(true);
                        setImageLoading(false);
                    }}
                />
                {isOutOfStock && (
                    <View style={styles.outOfStockOverlay}>
                        <Text style={styles.outOfStockText}>Out of Stock</Text>
                    </View>
                )}
            </View>

            {/* Info Section */}
            <View style={styles.infoContainer}>
                <Text style={styles.productNameText} numberOfLines={2}>{name}</Text>

                <Text style={styles.btokenText}>Upto {item.bTokenValue || item.bTokens || 1} B token</Text>

                <View style={styles.bottomRow}>
                    <View style={styles.priceContainer}>
                        {mrp && mrp != price && (
                            <Text style={styles.mrpText}>₹{mrp}</Text>
                        )}
                        <Text style={styles.priceText}>₹{price}</Text>
                    </View>

                    {/* Add Button Section */}
                    {quantity > 0 ? (
                        <View style={styles.counterContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (quantity === 1) {
                                        removeFromCart(cartItemId);
                                    } else {
                                        updateCartItemQuantity(cartItemId, quantity - 1);
                                    }
                                }}
                                style={styles.counterBtn}
                            >
                                <Entypo name="minus" size={wp('3.2%')} color="#FFFFFF" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity
                                onPress={() => updateCartItemQuantity(cartItemId, quantity + 1)}
                                style={styles.counterBtn}
                            >
                                <Entypo name="plus" size={wp('3.2%')} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={[styles.addButton, isOutOfStock && { backgroundColor: '#CCCCCC' }]}
                            onPress={() => !isOutOfStock && addToCart(item)}
                            disabled={isOutOfStock}
                        >
                            <Text style={styles.addButtonText}>ADD</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    productCard: {
        width: wp('37%'),
        height: hp('26%'),
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: wp('2.5%'),
        marginRight: wp('4%'),
        marginBottom: hp('2%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        justifyContent: 'space-between',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1,
        height: hp('2.5%'),
    },
    offerBadge: {
        backgroundColor: '#F04B1B',
        paddingHorizontal: wp('1.5%'),
        paddingVertical: hp('0.2%'),
        borderRadius: 4,
    },
    offerBadgeText: {
        color: '#FFFFFF',
        fontFamily: FONTS.outfit.semiBold,
        fontSize: wp('2%'),
    },
    heartContainer: {
        padding: wp('0.5%'),
    },
    imageContainer: {
        height: hp('10%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    productCardImage: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginTop: hp('0.3%'),
    },
    productNameText: {
        fontFamily: FONTS.outfit.semiBold,
        fontSize: wp('3.2%'),
        color: '#222222',
        lineHeight: wp('4%'),
        marginBottom: hp('0.2%'),
    },
    btokenText: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('2.2%'),
        color: '#5E3568',
        marginBottom: hp('0.4%'),
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceContainer: {
        flex: 1,
    },
    mrpText: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('2.5%'),
        color: '#999999',
        textDecorationLine: 'line-through',
    },
    priceText: {
        fontFamily: FONTS.outfit.bold || FONTS.outfit.semiBold,
        fontSize: wp('3.7%'),
        color: '#0CA201',
    },
    addButton: {
        backgroundColor: '#F04B1B',
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('0.5%'),
        borderRadius: 6,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontFamily: FONTS.outfit.semiBold,
        fontSize: wp('2.8%'),
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F04B1B',
        borderRadius: 6,
        paddingHorizontal: wp('1%'),
        paddingVertical: hp('0.3%'),
    },
    counterBtn: {
        padding: wp('0.8%'),
    },
    quantityText: {
        color: '#FFFFFF',
        fontFamily: FONTS.outfit.semiBold,
        fontSize: wp('3%'),
        marginHorizontal: wp('1%'),
        minWidth: wp('3.5%'),
        textAlign: 'center',
    },
    outOfStockOverlay: {
        position: 'absolute',
        backgroundColor: 'rgba(255,255,255,0.7)',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    outOfStockText: {
        color: '#FF0000',
        fontFamily: FONTS.outfit.semiBold,
        fontSize: wp('2.8%'),
        borderWidth: 1,
        borderColor: '#FF0000',
        paddingHorizontal: wp('1.5%'),
        borderRadius: 4,
        transform: [{ rotate: '-10deg' }],
    },
})

export default React.memo(ProductCard);
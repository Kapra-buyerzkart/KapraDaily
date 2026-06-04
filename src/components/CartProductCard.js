import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native'
import React, { useState, useMemo, useEffect } from 'react'
import { BlurView } from '@react-native-community/blur'
import LinearGradient from 'react-native-linear-gradient'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'
import { useCart } from '../context/CartContext'
import CONFIG from '../globals/config'
import { useWishlist } from '../context/WishlistContext'
import ConfirmationModal from './ConfirmationModal'



const CartProductCard = (props) => {
    const { updateCartItemQuantity, removeFromCart, updatingItems } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    const { item, disableManage, pincodeAreaIdOverride } = props;
    const {
        productId,
        id,
        prName,
        name,
        featuredImage,
        unitPrice: itemUnitPrice,
        mrp,
        specialPrice: itemSpecialPrice,
        price,
        stockQty,
        isAvailable,
        cartItemId: itemCartItemId
    } = item;

    const productName = prName || name || 'Product';
    const cartItemId = itemCartItemId || productId || id;
    const unitPrice = itemUnitPrice || mrp || 0;
    const specialPrice = itemSpecialPrice || price || 0;
    const isSoldOut = (stockQty === 0 || stockQty === '0') || isAvailable === false;
    const isUpdating = updatingItems.includes(String(cartItemId));

    const [imageError, setImageError] = useState(false);
    const [quantity, setQuantity] = useState(item.addedQty || item.quantity || 1);
    const [isRemovalModalVisible, setIsRemovalModalVisible] = useState(false);

    // Update local quantity state when item changes
    useEffect(() => {
        setQuantity(item.addedQty || item.quantity || 1);
    }, [item.quantity, item.addedQty]);

    // Get image source
    const imageSource = useMemo(() => {
        if (imageError || !featuredImage) {
            return require('../assets/images/noimage.png');
        }
        if (typeof featuredImage === 'string' && featuredImage.startsWith('http')) {
            return { uri: featuredImage };
        }
        return { uri: `${CONFIG.image_base_url}${featuredImage}` };
    }, [featuredImage, imageError]);

    // Handle quantity change
    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            updateCartItemQuantity(cartItemId, quantity - 1, pincodeAreaIdOverride);
        } else {
            setIsRemovalModalVisible(true);
        }
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
        updateCartItemQuantity(cartItemId, quantity + 1, pincodeAreaIdOverride);
    };

    const handleDelete = () => {
        setIsRemovalModalVisible(true);
    };

    return (
        <View style={styles.productCardView}>
            <View style={styles.productCardInnerView}>
                {isSoldOut && (
                    <View style={styles.overlayContainer} pointerEvents="none">
                        {Platform.OS === 'ios' && (
                            <BlurView
                                style={StyleSheet.absoluteFill}
                                blurType="light"
                                blurAmount={2.5}
                                reducedTransparencyFallbackColor="rgba(0,0,0,0.4)"
                            />
                        )}
                        <View style={styles.overlayDark} />

                        {Platform.OS === 'android' && (
                            <View style={styles.androidBlurFallback} />
                        )}

                        <View style={styles.soldOutContainer}>
                            <LinearGradient
                                colors={['#FF0000', '#FF8D8D']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.soldOutGradient}
                            >
                                <Text style={styles.soldOutText}>Sold Out</Text>
                            </LinearGradient>
                            <Text style={styles.removeToPlaceorderText}>Remove to place order</Text>
                        </View>
                    </View>
                )}
                <View style={styles.productImageView}>
                    {/* <TouchableOpacity
                        style={[styles.heartContainer, { zIndex: 10 }]}
                        onPress={() => toggleWishlist(item)}
                    >
                        <FontAwesome
                            name={isLiked ? 'heart' : 'heart-o'}
                            size={wp('4%')}
                            color={isLiked ? '#FF0048' : '#979797'}
                        />
                    </TouchableOpacity> */}

                    <Image
                        style={styles.productImageStyle}
                        source={imageSource}
                        onError={() => setImageError(true)}
                    />
                    {(() => {
                        const btokens = item.totalBtokens || item.bTokenValue || item.bTokens || 0;
                        if (btokens > 0) {
                            return (
                                <View style={styles.btokenContainerSmall}>
                                    <Image style={styles.btokenImageSmall} source={require('../assets/images/btoken-icon.png')} />
                                    <Text style={styles.btokenTextSmall}>{btokens} B Token</Text>
                                </View>
                            )
                        }
                        return null;
                    })()}

                </View>

                <View style={styles.productCardInnerViewTwo}>
                    <Text style={styles.productNameText} numberOfLines={2} ellipsizeMode="tail">{productName}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: wp('2%') }}>
                        <Text style={styles.productCount}>x {quantity} Qty</Text>

                    </View>

                    <View style={styles.productCardInnerViewThree}>
                        <View style={styles.productPrizeView}>
                            {unitPrice !== specialPrice && (
                                <Text style={styles.mrpText}>₹{unitPrice}</Text>
                            )}
                            <Text style={styles.sellingPriceText}>₹{specialPrice}</Text>
                        </View>

                        {!disableManage && (
                            <View style={styles.countContainer}>
                                {isUpdating ? (
                                    <View style={styles.loaderWrapper}>
                                        <ActivityIndicator size="small" color="#F25000" />
                                    </View>
                                ) : (
                                    <>
                                        <TouchableOpacity
                                            onPress={handleDecrease}
                                            disabled={isSoldOut}
                                        >
                                            <Image style={styles.countButtonStyle} source={require('../assets/images/minus-button.png')} />
                                        </TouchableOpacity>
                                        <Text style={styles.countText}>{quantity}</Text>
                                        <TouchableOpacity
                                            onPress={handleIncrease}
                                            disabled={isSoldOut}
                                        >
                                            <Image style={styles.countButtonStyle} source={require('../assets/images/plus-button.png')} />
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        )}
                    </View>
                </View>
            </View>

            <TouchableOpacity
                style={styles.deleteButtonContainer}
                onPress={handleDelete}
            >
                <Image style={styles.deleteButtonStyle} source={require('../assets/images/delete_icon.png')} />
            </TouchableOpacity>

            <ConfirmationModal
                visible={isRemovalModalVisible}
                onClose={() => setIsRemovalModalVisible(false)}
                onConfirm={() => removeFromCart(cartItemId, pincodeAreaIdOverride)}
                title="Remove Item"
                message={`Are you sure you want to remove "${productName}" from the cart?`}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    productCardView: {
        width: wp('90.7%'),
        height: hp('10.7%'),
        backgroundColor: '#F25000',
        borderRadius: wp('4.65%'),
        // paddingRight: wp('8%'),
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('1%')
    },
    wishlistIcon: {
        position: 'absolute',
        // left: wp('3.5%'),
        borderRadius: wp('4.65%'),
        overflow: 'hidden', // VERY IMPORTANT
        zIndex: 10,
    },
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 10,
        borderRadius: wp('4.65%'),
        overflow: 'hidden',
    },
    overlayDark: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    soldOutContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    soldOutGradient: {
        width: wp('27.9%'),
        height: hp('3.3%'),
        borderBottomRightRadius: wp('2.3%'),
        borderBottomLeftRadius: wp('2.3%'),
        justifyContent: 'center',
        alignItems: 'center',
        bottom: hp('2%')
    },
    soldOutText: {
        fontFamily: FONTS.poppins.bold,
        color: '#FFFFFF',
        fontSize: wp('4.18%'),
        //top: -hp('2.5%')
    },
    removeToPlaceorderText: {
        color: '#FFFFFF',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.18%'),
        marginTop: hp('0.8%')
    },
    productCardInnerView: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        borderColor: '#E9E9E9',
        borderWidth: 1,
        borderRadius: wp('4.65%'),
        // justifyContent: 'center',
        paddingLeft: wp('2%'),
        flexDirection: 'row',
        alignItems: 'center',
        width: wp('82%'),
        height: '100%'
    },
    productImageView: {
        width: wp('21.4%'),
        height: hp('9.2%'),
        backgroundColor: '#ffffff',
        borderRadius: wp('3.7%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    productImageStyle: {
        width: wp('18%'),
        height: hp('8%'),
        resizeMode: 'contain',
    },
    productCardInnerViewTwo: {
        paddingLeft: wp('2%'),
        // backgroundColor: 'yellow',
        height: '100%',
        paddingVertical: wp('1.5%'),
        justifyContent: 'space-between',
        flex: 1
    },
    productNameText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3%'),
        color: '#000000'
    },
    productCount: {
        color: '#777777',
        fontSize: wp('2.8%'),
        fontFamily: FONTS.outfit.regular,
        color: '#9E9E9E',
    },
    productCardInnerViewThree: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: wp('2%')
    },
    productPrizeView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    heartContainer: {
        position: 'absolute',
        top: wp('1.5%'),
        left: wp('1.5%'),
        zIndex: 10,
    },
    btokenContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: wp('1.5%'),
        left: wp('2.5%')
    },
    btokenImageStyle: {
        width: wp('1.86%'),
        height: hp('0.75%')
    },
    btokenText: {
        color: '#5E3568',
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('2.3%'),
        marginLeft: wp('0.5%')
    },
    mrpText: {
        fontFamily: FONTS.poppins.light,
        fontSize: wp('2.8%'),
        color: '#777777',
        textDecorationLine: 'line-through',
        marginRight: wp('1%')
    },
    sellingPriceText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.1%'),
        color: '#000000',
    },
    countContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    countButtonStyle: {
        width: wp('5.6%'),
        height: wp('5.6%')
    },
    countText: {
        color: '#F25000',
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('4.2%'),
        marginHorizontal: wp('3%')
    },
    deleteButtonContainer: {
        paddingHorizontal: wp('2%'),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    deleteButtonStyle: {
        width: wp('3.25%'),
        height: hp('1.7%'),
        resizeMode: 'contain',
        tintColor: '#FFFFFF'
    },
    androidBlurFallback: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    btokenContainerSmall: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3E5F5', // Lighter purple tint
        paddingHorizontal: wp('1.5%'),
        paddingVertical: hp('0.2%'),
        borderRadius: 4,
        gap: wp('1%'),
        alignSelf: 'flex-start'
    },
    btokenImageSmall: {
        width: wp('2.8%'),
        height: wp('2.8%'),
        resizeMode: 'contain'
    },
    btokenTextSmall: {
        fontFamily: FONTS.lexend.medium,
        fontSize: wp('2.5%'),
        color: '#5E3568'
    },
    loaderWrapper: {
        width: wp('20%'), // Approx width of the minus + quantity + plus section
        height: wp('5.6%'),
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default React.memo(CartProductCard);
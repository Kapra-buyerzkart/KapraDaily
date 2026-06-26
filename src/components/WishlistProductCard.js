import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import CONFIG from '../globals/config';
import AppButton from './AppButton';
import { useCart } from '../context/CartContext';

const WishlistProductCard = ({ item, onRemove, onAddToCart, onPress }) => {
    const [imageError, setImageError] = useState(false);
    const { cartItems, updateCartItemQuantity, removeFromCart } = useCart();

    const itemId = item.productId;
    const cartItem = cartItems.find(i => String(i.productId || i.id) === String(itemId));
    const quantity = cartItem?.quantity || cartItem?.addedQty || 0;
    const cartItemId = cartItem?.cartItemId || itemId;

    const imageSource = imageError || !item.productImage
        ? require('../assets/images/noimage.png')
        : { uri: `${CONFIG.image_base_url}${item.productImage}` };

    const discountPercentage = item.unitPrice && item.specialPrice
        ? Math.round(((item.unitPrice - item.specialPrice) / item.unitPrice) * 100)
        : 0;

    const isOutOfStock = item.isAvailable === false || (item.stockQty !== undefined && Number(item.stockQty) === 0);

    return (
        <TouchableOpacity style={styles.productCard} onPress={onPress}>
            <View style={styles.productCardViewOne}>
                <TouchableOpacity onPress={() => onRemove(item.productId, item.productName)}>
                    <Image style={styles.productHeart} source={require("../assets/images/heart_red.png")} />
                </TouchableOpacity>
                <Image
                    style={styles.productImage}
                    source={imageSource}
                    onError={() => setImageError(true)}
                />
            </View>
            <View style={styles.productCardViewTwo}>
                <Text style={styles.productNameText} numberOfLines={2} ellipsizeMode="tail">{item.productName}</Text>
                <Text style={[styles.stockStatusText, { color: isOutOfStock ? '#FF0000' : '#0CA201' }]}>
                    {isOutOfStock ? 'OUT OF STOCK' : 'In Stock'}
                </Text>
                {discountPercentage > 0 && <Text style={styles.offerText}>{discountPercentage}% OFF</Text>}
            </View>

            <View style={styles.productCardViewThree}>
                {item.unitPrice && item.unitPrice !== item.specialPrice && (
                    <View style={styles.mrpView}>
                        <Text style={styles.mrpText}>MRP</Text>
                        <MaterialIcons name={'currency-rupee'} color={'#777777'} size={wp("2.4%")} style={styles.rupeeIconSmall} />
                        <Text style={[styles.mrpText, {
                            left: wp("-0.4%"),
                            textDecorationLine: "line-through",
                            textDecorationColor: "#777777"
                        }]}>{item.unitPrice}</Text>
                    </View>
                )}
            </View>
            <View style={styles.productCardViewFour}>
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
                            style={styles.counterButton}
                        >
                            <Entypo name="minus" size={wp('3.5%')} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity
                            onPress={() => updateCartItemQuantity(cartItemId, quantity + 1)}
                            style={styles.counterButton}
                        >
                            <Entypo name="plus" size={wp('3.5%')} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={[styles.plusIconView, isOutOfStock && { backgroundColor: '#CCCCCC' }]}
                        onPress={() => !isOutOfStock && onAddToCart(item)}
                        disabled={isOutOfStock}
                    >
                        <Entypo name={"plus"} color={"#FFFFFF"} size={wp("4.1%")} />
                    </TouchableOpacity>
                )}
                <View style={styles.priceView}>
                    <MaterialIcons name={'currency-rupee'} color={'#0CA201'} size={wp("3.7%")} style={styles.rupeeIconBig}
                    />
                    <Text style={styles.priceText}>{item.specialPrice || item.unitPrice}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default React.memo(WishlistProductCard);

const styles = StyleSheet.create({
    productCard: {
        width: wp("90%"),
        height: hp("10.5%"),
        borderWidth: 1,
        borderColor: "#DADADA",
        borderRadius: wp("4.65%"),
        padding: wp("2%"),
        flexDirection: "row",
        marginTop: hp("0.8%"),
        alignSelf: 'center'
    },
    plusIconView: {
        backgroundColor: "#F04B1B",
        padding: wp("1.2%"),
        borderRadius: 100,
        alignSelf: "flex-end"
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F04B1B',
        borderRadius: 15,
        paddingHorizontal: wp('1.5%'),
        paddingVertical: hp('0.3%'),
        alignSelf: 'flex-end',
    },
    counterButton: {
        padding: wp('0.5%'),
    },
    quantityText: {
        color: '#FFFFFF',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3%'),
        marginHorizontal: wp('1.5%'),
    },
    priceView: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#0CA201",
        borderWidth: 1,
        borderRadius: 8,
        padding: wp("0.7%"),
        alignSelf: "flex-end"
    },
    priceText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp("3.7%"),
        color: "#0CA201"
    },
    productCardViewOne: {
        flexDirection: "row",
        // backgroundColor: "green"
    },
    productHeart: {
        width: wp("4.6%"),
        height: wp("4.3%")
    },
    productImage: {
        width: wp("20%"),
        height: wp("18.6%"),
        resizeMode: "contain",
        // alignSelf: "center"
        marginTop: hp("0.2%")
    },
    productCardViewTwo: {
        width: wp('33%'),
        // backgroundColor: "green"
        justifyContent: "space-between"
    },
    productNameText: {
        fontFamily: FONTS.outfit.light,
        fontSize: wp("3.3%"),
        color: "#000000"
    },
    offerText: {
        color: "#F04B1B",
        fontSize: wp("3%"),
        fontFamily: FONTS.outfit.semiBold,
    },
    productCardViewThree: {
        justifyContent: "flex-end",
        // backgroundColor: "blue"
    },
    mrpView: {
        flexDirection: "row",
        alignItems: "center"
    },
    mrpText: {
        fontFamily: FONTS.poppins.light,
        fontSize: wp("2.4%"),
        color: "#777777",
    },
    rupeeIconSmall: {
        bottom: hp("0.05%"),
        marginLeft: wp("0.2%")
    },
    productCardViewFour: {
        justifyContent: "space-between",
        // backgroundColor: "yellow",
        flex: 1
    },
    rupeeIconBig: {
        bottom: hp("0.15%")
    },
    stockStatusText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp("2.8%"),
        marginTop: hp("0.5%")
    }
});

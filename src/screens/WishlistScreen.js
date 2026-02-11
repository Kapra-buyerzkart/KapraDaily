import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { FONTS } from '../styles/typography'
import LinearGradient from 'react-native-linear-gradient';
import WishListEmptyComponent from '../components/WishListEmptyComponent'
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import CONFIG from '../globals/config';
import ConfirmationModal from '../components/ConfirmationModal';
import { useFocusEffect } from '@react-navigation/native';

export default function WishlistScreen() {
    const { wishlistItems, removeFromWishlist, loadWishlist } = useWishlist();
    const { addToCart } = useCart();

    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);

    // Load wishlist on mount
    useEffect(() => {
        loadWishlist();
    }, []);

    // Refresh wishlist when screen is focused
    useFocusEffect(
        React.useCallback(() => {
            loadWishlist();
        }, [loadWishlist])
    );

    const handleRemoveFromWishlist = (productId, productName) => {
        setItemToRemove({ productId, productName });
        setConfirmationVisible(true);
    };

    const confirmRemove = () => {
        if (itemToRemove) {
            removeFromWishlist(itemToRemove.productId);
            setItemToRemove(null);
        }
    };


    const ProductCard = ({ item }) => {
        const [imageError, setImageError] = useState(false);

        const imageSource = imageError || !item.productImage
            ? require('../assets/images/categories/dfn.png')
            : { uri: `${CONFIG.image_base_url}${item.productImage}` };

        const discountPercentage = item.unitPrice && item.specialPrice
            ? Math.round(((item.unitPrice - item.specialPrice) / item.unitPrice) * 100)
            : 0;

        return (
            <TouchableOpacity style={styles.productCard}>
                <View style={styles.productCardViewOne}>
                    <TouchableOpacity onPress={() => handleRemoveFromWishlist(item.productId, item.productName)}>
                        <Image style={styles.productHeart} source={require("../assets/images/heart_red.png")} />
                    </TouchableOpacity>
                    <Image
                        style={styles.productImage}
                        source={imageSource}
                        onError={() => setImageError(true)}
                    />
                </View>
                <View style={styles.productCardViewTwo}>
                    <Text style={styles.productNameText} numberOfLines={2}>{item.productName}</Text>
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
                    <TouchableOpacity style={styles.plusIconView} onPress={() => addToCart(item)}>
                        <Entypo name={"plus"} color={"#FFFFFF"} size={wp("4.1%")} />
                    </TouchableOpacity>
                    <View style={styles.priceView}>
                        <MaterialIcons name={'currency-rupee'} color={'#0CA201'} size={wp("3.7%")} style={styles.rupeeIconBig}
                        />
                        <Text style={styles.priceText}>{item.specialPrice || item.unitPrice}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView edges={['top']}
            style={styles.mainContainer}>
            <LinearGradient
                colors={['#FFE7DB', '#FFFFFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                {/* <Text style={styles.header}>Wishlist</Text>
                <View style={styles.giftImageView}>
                    <Image source={require("../assets/images/gift_two.png")} style={styles.giftImage} />
                </View> */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // alignItems: "flex-start",
                    // bottom: hp()
                }}>
                    <Text style={styles.header}>Wishlist</Text>
                    <Image style={styles.giftImage} source={require('../assets/images/gift_two.png')} />
                </View>
            </LinearGradient>
            <View style={styles.productListView}>
                <FlatList
                    data={wishlistItems}
                    keyExtractor={(item) => item.wishlistItemId?.toString() || item.productId?.toString()}
                    renderItem={({ item }) => <ProductCard item={item} />}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<WishListEmptyComponent />}
                />
                <TouchableOpacity style={styles.newWishesContainer}>
                    <Image source={require("../assets/images/heart_two.png")} style={styles.newWishesHeart} />

                    <Text style={styles.newWishesText}>New wishes</Text>
                </TouchableOpacity>
            </View>

            <ConfirmationModal
                visible={confirmationVisible}
                onClose={() => setConfirmationVisible(false)}
                onConfirm={confirmRemove}
                title="Remove from Wishlist"
                message={itemToRemove ? `Are you sure you want to remove "${itemToRemove.productName}" from your wishlist?` : ''}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: hp("1%"),
        backgroundColor: "#FFFFFF"
    },
    header: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.65%'),
        alignSelf: 'center',
        marginLeft: wp('10%')
    },
    giftImageView: {
        // backgroundColor: "yellow",
        alignItems: "flex-end",
        // bottom: hp("0.5%"),
        paddingRight: wp("2.5%"),
        top: hp("0.8%"),
    },
    giftImage: {
        width: wp('37.9%'),
        height: hp('14%'),
        resizeMode: 'contain',
        bottom: hp('-3.8%'),
        marginRight: wp('6%')
    },
    productListView: {
        flex: 1,
        borderTopLeftRadius: wp("9.3%"),
        borderTopRightRadius: wp("9.3%"),
        borderWidth: 1,
        borderColor: "#b6b6b6",
        backgroundColor: "#FFFFFF",
        // paddingTop: hp("1.7%"),
        alignItems: "center",
        // bottom: hp('0.5%'),
        borderBottomColor: "#FFFFFF",
        paddingTop: hp('1.5%')
    },
    productCard: {
        width: wp("90%"),
        height: hp("10.5%"),
        borderWidth: 1,
        borderColor: "#DADADA",
        borderRadius: wp("4.65%"),
        padding: wp("2%"),
        flexDirection: "row",
        marginTop: hp("0.8%")
    },
    plusIconView: {
        backgroundColor: "#F04B1B",
        padding: wp("1.2%"),
        borderRadius: 100,
        alignSelf: "flex-end"
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
    newWishesContainer: {
        width: wp("27.2%"),
        height: hp("3.75%"),
        borderWidth: 1,
        borderColor: "#DADADA",
        borderRadius: wp("2.33%"),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: wp("1.8%"),
        alignSelf: "flex-end",
        marginRight: wp("5%"),
        marginTop: hp("0.5%"),
        marginBottom: hp('0.5%')
    },
    newWishesHeart: {
        height: wp("4.6%"),
        width: wp("4.6%")
    },
    newWishesText: {
        color: "#000000",
        fontFamily: FONTS.outfit.regular,
        fontSize: wp("3.25%")
    }
})
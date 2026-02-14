import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Platform, ScrollView, Animated, ActivityIndicator } from 'react-native'
import React, { useRef, useState, useEffect, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'
import { useNavigation, useRoute } from '@react-navigation/native'
import CONFIG from '../globals/config'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ProductCard from '../components/ProductCard'
import SelectedProducts from '../components/SelectedProducts'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useProductDetails } from '../hooks/useProductDetails'
import { LoaderContext } from '../context/loaderContext'
import Entypo from 'react-native-vector-icons/Entypo'

const images = [
    require('../assets/images/lays.png'),
    require('../assets/images/lays2.png'),
    require('../assets/images/lays3.png'),
    require('../assets/images/lays4.png'),
]

const selectedProducts = [
    { id: "1", image: require('../assets/images/product1.png') },
    { id: "2", image: require('../assets/images/product2.png') },
    { id: "3", image: require('../assets/images/product3.png') },
    { id: "4", image: require('../assets/images/product1.png') },
    { id: "5", image: require('../assets/images/product2.png') },
    { id: "6", image: require('../assets/images/product3.png') },
];

const ProductDetailsScreen = () => {
    const [selectedImage, setSelectedImage] = useState(null)
    const [showDetails, setShowDetails] = useState(false)
    const animation = useRef(new Animated.Value(0)).current

    const navigation = useNavigation()
    const route = useRoute()
    const { product: initialProduct, productId } = route.params || {}
    const { isInWishlist, toggleWishlist } = useWishlist()
    const { addToCart, cartItems, updateCartItemQuantity, removeFromCart } = useCart()

    const {
        loading,
        product,
        images: apiImages,
        attributes,
        productImage,
        productName,
        productDescription,
        shortDescription,
        unitPrice,
        specialPrice,
        discountPercentage,
        stockQty,
        isAvailable,
        bTokenValue,
        productId: finalProductId,
        relatedProducts,
        relatedLoading,
    } = useProductDetails(productId, initialProduct)

    const isLiked = isInWishlist(finalProductId)

    const toggleDetails = () => {
        Animated.timing(animation, {
            toValue: showDetails ? 0 : 1,
            duration: 250,
            useNativeDriver: false,
        }).start()
        setShowDetails(!showDetails)
    }

    const heightInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, hp('25%')],
    })
    // Set selected image from productImage
    useEffect(() => {
        if (productImage) {
            setSelectedImage(productImage)
        } else if (apiImages && apiImages.length > 0) {
            setSelectedImage(apiImages[0])
        }
    }, [productImage, apiImages])

    const products = [
        { id: "1", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
        { id: "2", name: "Green Chilli", img: require('../assets/images/products/chilli.png'), price: "₹324" },
        { id: "3", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
        { id: "4", name: "Green Chilli", img: require('../assets/images/products/chilli.png'), price: "₹324" },
        { id: "5", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
    ];

    if (loading && !product) {
        return (
            <SafeAreaView edges={['top']} style={styles.mainContainer}>
                <View style={styles.headerView}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image style={styles.leftArrowIcon} source={require('../assets/images/left_arrow.png')} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Product Details</Text>
                </View>
                {/* Global loader handles the visual feedback */}
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView edges={['top']} style={styles.mainContainer}>
            <View style={styles.headerView}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={styles.leftArrowIcon} source={require('../assets/images/left_arrow.png')} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Product Details</Text>
            </View>
            <ScrollView
                contentContainerStyle={{ paddingBottom: hp("9%") }}
                showsVerticalScrollIndicator={false}
            >
                <Image style={styles.imageStyle} source={selectedImage || (apiImages && apiImages[0])} />
                <View style={styles.thumbnailContainer}>
                    <FlatList
                        data={apiImages && apiImages.length > 0 ? apiImages : []}
                        horizontal
                        keyExtractor={(_, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.thumbnailList}
                        renderItem={({ item }) => {
                            const isSelected = selectedImage?.uri === item?.uri
                            return (
                                <TouchableOpacity
                                    style={[
                                        styles.thumbnailWrapper,
                                        isSelected && styles.activeThumbnail,
                                    ]}
                                    onPress={() => setSelectedImage(item)}
                                >
                                    <Image
                                        source={item}
                                        style={styles.thumbnailImage}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            )
                        }}
                    />
                </View>
                <View style={styles.detailsContainer}>
                    <View style={styles.detailsContainerTopView}>
                        <View style={styles.btokenView}>
                            <Image style={Platform.OS === 'android' ? [styles.btokenIcon, {
                                bottom: hp('0.2%')
                            }] : styles.btokenIcon} source={require('../assets/images/btoken-icon-three.png')} />
                            <Text style={styles.btokenText}>{Number(bTokenValue)} Token</Text>
                        </View>
                        <View style={styles.heartShareButtonContainer}>
                            <TouchableOpacity style={{
                                marginRight: wp('4%')
                            }} onPress={() => product && toggleWishlist(product)}>
                                <FontAwesome
                                    name={isLiked ? 'heart' : 'heart-o'}
                                    size={wp('5%')}
                                    color={isLiked ? '#FF0048' : '#000000'}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image style={styles.shareIcon} source={require('../assets/images/share.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={styles.productName}>{productName}</Text>
                    <Text style={styles.productDescription}>{shortDescription}</Text>
                    <View style={styles.quantityCategoryContainer}>
                        <View>
                            {/* <Text style={styles.quantity}>{product?.sku || 'SKU'}</Text> */}
                            {/* <Text style={styles.quantityTwo}>{stockQty > 0 ? `${stockQty} in stock` : 'Out of stock'}</Text> */}
                        </View>
                        {/* <Text style={styles.category}>{isAvailable ? 'Available' : 'Unavailable'}</Text> */}
                    </View>
                    <View style={styles.offerPriceAddButtonContainer}>
                        <View>
                            {discountPercentage > 0 && <Text style={styles.offerText}>{discountPercentage}% OFF</Text>}
                            <View style={styles.priceContainer}>
                                <Text style={styles.sellingPrice}>₹{specialPrice}</Text>
                                {unitPrice && unitPrice !== specialPrice && (
                                    <Text style={styles.mrpText}>₹{unitPrice}</Text>
                                )}
                            </View>
                        </View>

                        <View style={{ alignItems: 'center' }}>
                            {(() => {
                                const cartItem = cartItems.find(i => String(i.productId || i.id) === String(finalProductId));
                                const quantity = cartItem ? cartItem.quantity : 0;
                                const cartItemId = cartItem?.cartItemId || finalProductId;

                                if (quantity > 0) {
                                    return (
                                        <View style={[styles.quantitySelector, { marginTop: 0 }]}>
                                            <TouchableOpacity
                                                style={styles.qtyButton}
                                                onPress={() => {
                                                    if (quantity === 1) {
                                                        removeFromCart(cartItemId);
                                                    } else {
                                                        updateCartItemQuantity(cartItemId, quantity - 1);
                                                    }
                                                }}
                                            >
                                                <Entypo name="minus" size={wp('4%')} color="#FFF" />
                                            </TouchableOpacity>
                                            <Text style={styles.qtyText}>{quantity}</Text>
                                            <TouchableOpacity
                                                style={styles.qtyButton}
                                                onPress={() => updateCartItemQuantity(cartItemId, quantity + 1)}
                                            >
                                                <Entypo name="plus" size={wp('4%')} color="#FFF" />
                                            </TouchableOpacity>
                                        </View>
                                    );
                                }

                                return (
                                    <TouchableOpacity
                                        style={[styles.addButton, ((isAvailable === false) || stockQty === 0) && { backgroundColor: '#CCCCCC' }]}
                                        onPress={() => {
                                            if ((isAvailable === false) || stockQty === 0) return;
                                            product && addToCart(product);
                                        }}
                                        disabled={(isAvailable === false) || stockQty === 0}
                                    >
                                        <Text style={styles.addButtonText}>{((isAvailable !== false) && stockQty > 0) ? 'ADD' : 'OUT OF STOCK'}</Text>
                                    </TouchableOpacity>
                                );
                            })()}
                            {stockQty > 0 && stockQty < 10 && (
                                <Text style={styles.lowStockText}>Only {stockQty} left!</Text>
                            )}
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <TouchableOpacity onPress={toggleDetails} style={styles.viewProductDetailsButton}>
                        <Text style={styles.viewProductDetailsButtonText}>View product details</Text>
                        <AntDesign
                            name={showDetails ? 'up' : 'down'}
                            size={wp('3%')}
                            color="#000"
                        />
                    </TouchableOpacity>
                    <Animated.View style={[styles.productDetailsView, {
                        height: heightInterpolate,
                        overflow: 'hidden'
                    }]}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.productDetailsText}>{productDescription?.replace(/<[^>]*>?/gm, '')}</Text>
                            {attributes && attributes.length > 0 && (
                                <>
                                    <Text style={[styles.productsContainerHeader, { marginLeft: 0, marginBottom: hp('1%') }]}>Attributes</Text>
                                    <View style={styles.specsContainer}>

                                        {attributes.map((attr, idx) => (
                                            <View key={idx} style={[styles.specRow, (idx + (product?.sku ? 1 : 0)) % 2 !== 0 && styles.specRowAlt]}>
                                                <Text style={styles.specLabel}>{attr.attrName}</Text>
                                                <Text style={styles.specValue}>{attr.attrValue}</Text>
                                            </View>
                                        ))}
                                    </View>

                                </>
                            )}
                            <View style={{ marginTop: hp('2%') }} />
                        </ScrollView>
                    </Animated.View>
                </View>
                <View style={styles.productsMainContainerTwo}>
                    <View style={styles.productsContainerViewOne}>
                        <Text style={styles.productsContainerHeader}>Similar Products</Text>
                        {relatedProducts && relatedProducts.length > 0 && (
                            <TouchableOpacity style={styles.viewAllContainer}>
                                <Text style={styles.viewAllText}>View All</Text>
                                <MaterialIcons name={"arrow-forward-ios"} color={"#FF7B3A"} size={wp("3.3%")} style={styles.viewAllRightArrowIcon} />
                            </TouchableOpacity>
                        )}
                    </View>
                    {relatedLoading ? (
                        <View style={{ paddingVertical: hp('2%'), alignItems: 'center' }}>
                            <ActivityIndicator size="small" color="#F25000" />
                        </View>
                    ) : (
                        <FlatList
                            horizontal={true}
                            data={relatedProducts}
                            keyExtractor={(item, index) => (item.productId || item.id || index).toString()}
                            renderItem={({ item }) => <ProductCard item={item} />}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={[
                                { paddingLeft: wp('4.6%') },
                                (!relatedProducts || relatedProducts.length === 0) && { flex: 1, justifyContent: 'center', paddingLeft: 0 }
                            ]}
                            ListEmptyComponent={!relatedLoading && (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>No similar products found</Text>
                                </View>
                            )}
                        />
                    )}
                </View>
            </ScrollView >
            <View style={styles.floatingContainer}>
                <SelectedProducts selectedProducts={selectedProducts} />
            </View>
        </SafeAreaView >
    )
}

export default ProductDetailsScreen

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        // paddingHorizontal: wp('4.65%')
    },
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: hp('1.5%'),
        paddingHorizontal: wp('4.65%'),
        paddingBottom: hp('1%')
    },
    leftArrowIcon: {
        height: hp('2%'),
        width: wp('2.32%')
    },
    headerText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.65%'),
        marginLeft: wp('6%')
    },
    thumbnailContainer: {
        height: hp('9%'),   // ✅ controls FlatList height
        marginTop: hp('2%'),
        alignSelf: 'center'
    },

    thumbnailList: {
        alignItems: 'center',
        // gap: wp('3%'),      // optional spacing
    },

    thumbnailWrapper: {
        width: wp('16.75%'),
        height: hp('7.72%'),
        borderRadius: wp('2.32%'),
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.3,
        marginRight: wp('1%')
    },
    activeThumbnail: {
        borderWidth: 2,
        borderColor: '#FF6A00',
        backgroundColor: '#FFFFFF',
        opacity: 1
    },
    thumbnailImage: {
        width: wp('13.95%'),
        height: hp('6.44%'),
    },
    imageStyle: {
        width: wp('48.14%'),
        height: hp('22.21%'),
        resizeMode: 'contain',
        alignSelf: 'center',
        // marginTop: hp('2.5%')
    },
    detailsContainer: {
        paddingTop: hp('2%'),
        // paddingHorizontal: wp('9.3%'),
        marginTop: hp('1.5%'),
        backgroundColor: '#FFFFFF',
        borderRadius: wp('9.3%'),

        // iOS shadow
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0, // matches Figma Y = -11
        },
        shadowOpacity: 0.3, // 10%
        shadowRadius: 10,   // Blur = 15

        // Android shadow
        elevation: 10,
    },
    detailsContainerTopView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // borderRadius: wp('9.3%')
        paddingHorizontal: wp('9.3%')
    },
    btokenView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    btokenIcon: {
        width: wp('6%'),
        height: hp('1.5%'),
        // resizeMode: 'cover'
    },
    btokenText: {
        color: '#5E3568',
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('4%'),
        marginLeft: wp('2%')
    },
    heartShareButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    shareIcon: {
        height: hp('2.36%'),
        width: wp('4.65%'),
        resizeMode: 'contain'
    },
    productName: {
        color: '#000000',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.5%'),
        marginLeft: wp('4.65%'),
        marginTop: hp('1.8%')
    },
    productDescription: {
        color: '#616161',
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.5%'),
        marginLeft: wp('4.65%'),
        marginTop: hp('0.8%')
    },
    quantity: {
        color: '#616161',
        fontSize: wp('3.9%'),
        fontFamily: FONTS.poppins.medium,
    },
    quantityTwo: {
        color: '#969696',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('2.9%'),
        marginTop: hp('0.5%')
    },
    category: {
        color: '#000000',
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.5%'),
    },
    quantityCategoryContainer: {
        flexDirection: 'row',
        marginTop: hp('3.5%'),
        paddingHorizontal: wp('4.65%'),
        justifyContent: 'space-between',
        // paddingRight: wp('9.3%')
    },
    offerText: {
        fontSize: wp('2.9%'),
        color: '#0CA201',
        fontFamily: FONTS.poppins.semiBold
    },
    priceContainer: {
        flexDirection: 'row',
        marginTop: hp('0.1%'),
        alignItems: 'center'
    },
    sellingPrice: {
        color: '#000000',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('5%')
    },
    mrpText: {
        fontFamily: FONTS.poppins.semiBold,
        color: '#616161',
        fontSize: wp('4.1%'),
        textDecorationLine: 'line-through',
        marginLeft: wp('2%')
    },
    addButton: {
        width: wp('33.72%'),
        height: hp('5.36%'),
        backgroundColor: '#F25000',
        borderRadius: wp('2.33%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('2%')
    },
    addButtonText: {
        fontSize: wp('4.1%'),
        color: '#FFFFFF',
        fontFamily: FONTS.outfit.bold
    },
    offerPriceAddButtonContainer: {
        flexDirection: 'row',
        marginTop: hp('2.5%'),
        paddingHorizontal: wp('4.65%'),
        justifyContent: 'space-between',
        paddingBottom: hp('2.5%')
    },
    divider: {
        backgroundColor: '#DADADA',
        height: 1,
        marginHorizontal: wp('4.65%'),
    },
    viewProductDetailsButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('2%')
    },
    viewProductDetailsButtonText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.5%'),
        color: '#000000',
        marginRight: wp('1.5%')
    },
    productDetailsView: {
        paddingHorizontal: wp('4.65%'),
        paddingTop: hp('2%')
    },
    productDetailsText: {
        fontFamily: FONTS.poppins.light,
        fontSize: wp('3.3%'),
        color: '#616161',
        lineHeight: hp('2.5%')
    },
    productsMainContainerTwo: {
        marginTop: hp("6%"),
        // paddingLeft: wp("4.6%"),
        height: hp("29.5%"),
        // width: wp("100%"),
    },
    productsContainerViewOne: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    productsContainerHeader: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp("4.2%"),
        marginLeft: wp('4.6%')
    },
    viewAllContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: wp("4.6%")
    },
    viewAllText: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp("3.5%"),
        color: "#FF7B3A"
    },
    viewAllRightArrowIcon: {
        marginLeft: 5
    },
    floatingContainer: {
        position: "absolute",
        bottom: hp("0.7%"),
        left: 0,
        right: 0,
        // alignItems: "center",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: hp('30%'),
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: wp('33.72%'),
        height: hp('5.36%'),
        backgroundColor: '#F25000',
        borderRadius: wp('2.33%'),
        paddingHorizontal: wp('2%'),
        marginTop: hp('2%')
    },
    qtyButton: {
        width: wp('8%'),
        height: wp('8%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%'),
        color: '#FFFFFF',
    },
    loadingText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('4%'),
        color: '#666666',
        marginTop: hp('2%'),
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: wp('90.7%'),
        marginTop: hp('2%'),
    },
    emptyText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.5%'),
        color: '#616161',
        textAlign: 'center'
    },
    lowStockText: {
        color: '#FF0000',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3%'),
        marginTop: hp('0.5%')
    },
    specsContainer: {
        marginTop: hp('2%'),
        backgroundColor: '#F8F8F8',
        borderRadius: wp('2%'),
        padding: wp('2%')
    },
    specRow: {
        flexDirection: 'row',
        paddingVertical: hp('1.2%'),
        paddingHorizontal: wp('3%'),
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE'
    },
    specRowAlt: {
        backgroundColor: '#FFFFFF'
    },
    specLabel: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.3%'),
        color: '#333333',
        width: wp('35%')
    },
    specValue: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.3%'),
        color: '#616161',
        flex: 1
    },
})

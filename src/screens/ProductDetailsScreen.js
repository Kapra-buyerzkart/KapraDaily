import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Platform, ScrollView, Animated } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'
import { useNavigation } from '@react-navigation/native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ProductCard from '../components/ProductCard'
import SelectedProducts from '../components/SelectedProducts'

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
    const [selectedImage, setSelectedImage] = useState(images[0])
    const [liked, setLiked] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const animation = useRef(new Animated.Value(0)).current

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
    const navigation = useNavigation()

    const products = [
        { id: "1", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
        { id: "2", name: "Green Chilli", img: require('../assets/images/products/chilli.png'), price: "₹324" },
        { id: "3", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
        { id: "4", name: "Green Chilli", img: require('../assets/images/products/chilli.png'), price: "₹324" },
        { id: "5", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
    ];

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
                <Image style={styles.imageStyle} source={selectedImage} />
                <View style={styles.thumbnailContainer}>
                    <FlatList
                        data={images}
                        horizontal
                        keyExtractor={(_, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.thumbnailList}
                        renderItem={({ item }) => {
                            const isSelected = selectedImage === item
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
                            <Text style={styles.btokenText}>1B Token</Text>
                        </View>
                        <View style={styles.heartShareButtonContainer}>
                            <TouchableOpacity style={{
                                marginRight: wp('4%')
                            }} onPress={() => setLiked(!liked)}>
                                <FontAwesome
                                    name={liked ? 'heart' : 'heart-o'}
                                    size={wp('5%')}
                                    color={'#000000'}
                                />

                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image style={styles.shareIcon} source={require('../assets/images/share.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={styles.productName}>BBQ Flavored Potato Chips.</Text>
                    <Text style={styles.productDescription}>Made with BBQ flavour chilly power and chips</Text>
                    <View style={styles.quantityCategoryContainer}>
                        <View>
                            <Text style={styles.quantity}>210 g</Text>
                            <Text style={styles.quantityTwo}>13.9/100g</Text>
                        </View>
                        <Text style={styles.category}>Hot and Spicy</Text>
                    </View>
                    <View style={styles.offerPriceAddButtonContainer}>
                        <View>
                            <Text style={styles.offerText}>20% OFF</Text>
                            <View style={styles.priceContainer}>
                                <Text style={styles.sellingPrice}>₹300</Text>
                                <Text style={styles.mrpText}>₹324</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.addButton}>
                            <Text style={styles.addButtonText}>ADD</Text>
                        </TouchableOpacity>
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
                    }]}>
                        <Text style={styles.productDetailsText}>Lay's is a globally recognized brand of potato chips, owned by PepsiCo through its Frito-Lay subsidiary, known for its wide variety of flavors made from real potatoes, offering a classic salty snack that's a staple worldwide, evolving from its 1930s origins into a huge international snack empire with distinct regional tastes like Walkers in the UK.</Text>
                    </Animated.View>
                </View>
                <View style={styles.productsMainContainerTwo}>
                    <View style={styles.productsContainerViewOne}>
                        <Text style={styles.productsContainerHeader}>Similar Products</Text>
                        <TouchableOpacity style={styles.viewAllContainer}>
                            <Text style={styles.viewAllText}>View All</Text>
                            <MaterialIcons name={"arrow-forward-ios"} color={"#FF7B3A"} size={wp("3.3%")} style={styles.viewAllRightArrowIcon} />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        horizontal={true}
                        data={products}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={({ item }) => <ProductCard item={item} />}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingLeft: wp('4.6%'), // 👈 first card left spacing
                        }}
                    />
                </View>
            </ScrollView>
            <View style={styles.floatingContainer}>
                <SelectedProducts selectedProducts={selectedProducts} />
            </View>
        </SafeAreaView>
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
})
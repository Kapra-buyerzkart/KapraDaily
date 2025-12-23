import { View, Text, StyleSheet, Image, Platform, ScrollView, TouchableOpacity, FlatList, Modal, Pressable } from 'react-native'
import React, { startTransition, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native'
import OfferCard from '../components/OfferCard'
import ProductCard from '../components/ProductCard'
import LinearGradient from 'react-native-linear-gradient'

const CartScreen = () => {

    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(1)
    const [addClicked, setAddClicked] = useState(false);
    const [showBill, setShowBill] = useState(false);
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const products = [
        {
            id: "1",
            name: "Lorem lpsum is simply dummy text",
            mrpPrice: 400,
            sellingPrice: 380,
            image: require("../assets/images/wl1.png"),
            soldOut: false
        },
        {
            id: "2",
            name: "Lorem lpsum is simply dummy text",
            mrpPrice: 400,
            sellingPrice: 380,
            image: require("../assets/images/wl1.png"),
            soldOut: true
        },
        {
            id: "3",
            name: "Lorem lpsum is simply dummy text",
            mrpPrice: 400,
            sellingPrice: 380,
            image: require("../assets/images/wl1.png"),
            soldOut: false
        },
        {
            id: "4",
            name: "Lorem lpsum is simply dummy text",
            mrpPrice: 400,
            sellingPrice: 380,
            image: require("../assets/images/wl1.png"),
            soldOut: false
        },
        {
            id: "5",
            name: "Lorem lpsum is simply dummy text",
            mrpPrice: 400,
            sellingPrice: 380,
            image: require("../assets/images/wl1.png"),
            soldOut: false
        },
    ]

    const wishlistProducts = [
        { id: "1", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
        { id: "2", name: "Green Chilli", img: require('../assets/images/products/chilli.png'), price: "₹324" },
        { id: "3", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
        { id: "4", name: "Green Chilli", img: require('../assets/images/products/chilli.png'), price: "₹324" },
        { id: "5", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
    ];


    const CartProductCard = (item) => {
        return (
            <View style={styles.productCardView}>
                {item.item.soldOut && (
                    <View style={styles.removeView}>
                        <Image style={styles.removeAlertImage} source={require("../assets/images/alert.png")} />
                        <Text style={styles.removeText}>Remove it for ordering</Text>
                    </View>
                )}
                {/* <View style={styles.productCardInnerViewOne}>
                        <TouchableOpacity style={styles.heartContainer} onPress={() => setLiked(!liked)}>
                            <FontAwesome
                                name={liked ? 'heart' : 'heart-o'}
                                size={wp('5%')}
                                color={liked ? 'red' : '#979797'}
                            />
                        </TouchableOpacity>
                        <Image style={styles.productImage} source={require('../assets/images/wl1.png')} />
                    </View> */}
                <View style={styles.productCardInnerViewOne}>
                    <TouchableOpacity style={styles.heartContainer} onPress={() => setLiked(!liked)}>
                        <FontAwesome
                            name={liked ? 'heart' : 'heart-o'}
                            size={wp('5%')}
                            color={liked ? 'red' : '#979797'}
                        />
                    </TouchableOpacity>
                    <Image style={styles.productImage} source={item.item.image} />
                    {item.item.soldOut && (
                        <View style={styles.soldOutView}>
                            <Text style={styles.soldText}>Sold</Text>
                            <Text style={styles.outText}>out</Text>
                        </View>
                    )}
                </View>

                <View style={styles.productCardInnerViewTwo}>
                    <Text style={styles.productNameText}>{item.item.name}</Text>
                    <View style={styles.btokenView}>
                        <Image source={require('../assets/images/btoken-icon.png')} style={styles.btokenImage} />
                        <Text style={styles.btokenText}>1B Token</Text>
                    </View>
                </View>
                <View style={styles.itemCountContainer}>
                    <TouchableOpacity onPress={() => setCount(count - 1)}>
                        <Image source={require('../assets/images/minus.png')}
                            style={styles.minusButton}
                        />
                    </TouchableOpacity>
                    <Text style={styles.countText}>{count}</Text>
                    <TouchableOpacity onPress={() => setCount(count + 1)}>
                        <Image source={require('../assets/images/plus.png')}
                            style={styles.plusButton}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.productCardInnerViewThree}>
                    <View style={styles.mrpPriceView}>
                        <Text style={styles.mrpText}>MRP </Text>
                        <MaterialIcons name={'currency-rupee'} color={'#777777'} size={wp("2.5%")} style={{
                            bottom: hp("0.1%")
                        }} />
                        <Text style={[styles.mrpText, {
                            textDecorationLine: "line-through",
                            textDecorationColor: "#777777",
                        }]}>{item.item.mrpPrice}</Text>

                    </View>
                    <View style={styles.sellingPriceView}>
                        <MaterialIcons name={'currency-rupee'} color={'#0CA201'} size={wp("3.7%")} style={{
                            bottom: hp("0.15%")
                        }} />
                        <Text style={styles.sellingPriceText}>{item.item.sellingPrice}</Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView edges={['top']}
            style={[styles.mainContainer, Platform.OS === 'android' && {
                paddingBottom: insets.bottom
            }]}>
            <Modal
                transparent
                animationType="slide"
                visible={showBill}
                onRequestClose={() => setShowBill(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeaderView}>
                            <Entypo name={'chevron-left'} color={'#777777'} size={wp('6%')} />
                            {/* <Text style={}>View Your Bill</Text> */}
                        </View>

                    </View>
                </View>
            </Modal>
            <ScrollView>
                <View style={styles.topView}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.leftArrowView}>
                        <Entypo name={"chevron-thin-left"} size={wp("5%")} color={"#777777"} />
                    </TouchableOpacity>
                    <View style={styles.locationView}>
                        <View style={styles.locationIconView}>
                            <Image source={require('../assets/images/location.png')} style={[styles.locationImage, Platform.OS === 'android' && {
                                bottom: hp('0.2%')
                            }]} />
                            <Text style={styles.unsavedText}>Unsaved Location</Text>
                        </View>
                        <View style={styles.locationInnerView}>
                            <Text style={styles.locationText}
                                ellipsizeMode="tail"
                                numberOfLines={1}
                            >Vennala: Chakkaraparambu abcdef</Text>
                            <Entypo name={"chevron-small-down"} size={wp("4.5%")} color={"#454545CC"} />
                        </View>
                    </View>
                    <View style={styles.timeView}>
                        <Text style={styles.timeText}>20 min</Text>
                        <Image source={require('../assets/images/dots.png')} style={styles.dotImage} />
                    </View>
                </View>
                <Image
                    source={require('../assets/images/free_delivery.png')}
                    style={styles.freeDelivery}
                />
                <View style={styles.productsContainer}>
                    <FlatList
                        data={products}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => {
                            return (
                                <CartProductCard item={item} />
                            )
                        }}
                    // contentContainerStyle={{
                    //     // backgroundColor: 'red',
                    //     marginTop: hp('1.5%'),
                    //     paddingTop: hp('2%'),
                    //     marginHorizontal: wp('3%'),
                    //     borderRadius: wp('4.65%'),
                    //     borderWidth: 1,
                    //     borderColor: '#DADADA',
                    // }}
                    />
                    <View style={styles.productsContainerInnerView}>
                        <Text style={styles.itemsText}>{products.length} items</Text>
                        <View style={styles.btokenView}>
                            <Image source={require('../assets/images/btoken-icon.png')} style={styles.btokenImageTwo} />
                            <Text style={[styles.btokenText, {
                                fontSize: wp('3.5%'),
                            }]}>1B Token</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.offersContainer}>
                    <View style={styles.offersHeaderView}>
                        <Image style={styles.offersHeaderImage} source={require('../assets/images/add_offer.png')} />
                        <Text style={styles.offersHeaderText}>Add offers</Text>
                    </View>
                    <OfferCard
                        name={'Smart point'}
                        content={'get flat 50%'}
                        image={require('../assets/images/smart_point.png')}
                    />
                    <OfferCard
                        name={'Bcoin'}
                        content={'1000.00'}
                        image={require('../assets/images/bcoin.png')}
                    />
                    <OfferCard
                        name={'Coupon'}
                        content={'get flat 50%'}
                        image={require('../assets/images/coupon.png')}
                    />
                </View>
                <View style={styles.wishListContainer}>
                    <Text style={styles.headerText}>Wishlist</Text>
                    <FlatList
                        horizontal={true}
                        data={wishlistProducts}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={({ item }) => <ProductCard item={item} />}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingLeft: wp('3%')
                        }}
                    />
                </View>

                <View style={styles.didyouforgetContainer}>
                    <Text style={styles.headerText}>Did you forget</Text>
                    <FlatList
                        horizontal={true}
                        data={wishlistProducts}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={({ item }) => <ProductCard item={item} />}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingLeft: wp('3%')
                        }}
                    />
                </View>

                <View style={styles.bottomContainer}>
                    <View style={styles.bottomContainerInnerViewOne}>
                        <TouchableOpacity onPress={() => setShowBill(true)} style={styles.billView}>
                            <Image style={styles.billIcon} source={require('../assets/images/coupon.png')} />
                            <Text style={styles.billText}>View Your Bill</Text>
                        </TouchableOpacity>
                        <View style={styles.priceMainView}>
                            <View style={styles.priceInnerView}>
                                <Text style={styles.mrpText}>
                                    MRP
                                </Text>
                                <Text style={[styles.mrpText, {
                                    marginLeft: wp('0.8%'),
                                }]}>
                                    ₹324
                                </Text>

                            </View>
                            <Text style={styles.priceText}>
                                ₹324
                            </Text>
                        </View>
                    </View>
                    <View style={styles.bottomContainerInnerViewTwo}>
                        <TouchableOpacity style={styles.selectYourLocationButton}>
                            <Text style={styles.selectYourLocationText}>Select Your Location</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveYourLocation}>
                            <LinearGradient colors={["#F25000", "#FF7B3A"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.saveYourLocationGradientStyle}
                            >
                                <Text style={[styles.selectYourLocationText, {
                                    color: '#FFFFFF',
                                }]}>Save Your Location</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default CartScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    topView: {
        borderBottomLeftRadius: wp("9.3%"),
        borderBottomRightRadius: wp("9.3%"),
        borderWidth: 1,
        borderColor: "#F25000",
        // backgroundColor: "green",
        borderTopWidth: 0,
        height: hp('8%'),
        flexDirection: "row",
        paddingLeft: wp('2.5%'),
        alignItems: "center",
        paddingRight: wp('3.5%')
    },
    unsavedText: {
        fontFamily: 'Poppins-Regular',
        fontSize: wp('3.9%'),
        marginLeft: wp('2%')
    },
    locationImage: {
        width: wp('2.3%'),
        height: wp('3.02%'),
    },
    leftArrowView: {
        bottom: hp('0.9%')
    },
    locationView: {
        // backgroundColor: 'blue',
        flex: 1,
        paddingLeft: wp('3%')
    },
    locationIconView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationInnerView: {
        flexDirection: 'row',
        alignItems: "center",
        marginLeft: wp('4.5%')
    },
    locationText: {
        color: "#454545CC",
        fontFamily: 'Poppins-Regular',
        fontSize: wp('2.3%'),
    },
    timeView: {
        flexDirection: "row",
        alignItems: 'center',
        // backgroundColor: 'yellow',
        bottom: hp('0.7%')
    },
    timeText: {
        fontFamily: 'Poppins-ExtraBold',
        fontSize: wp('5.1%'),
        color: '#252525'
    },
    dotImage: {
        width: wp('0.69%'),
        height: wp('3.48%'),
        marginLeft: wp('6%'),
        bottom: hp('0.2%')
    },
    freeDelivery: {
        width: wp('62.8%'),
        height: hp('2.6%'),
        resizeMode: "contain",
        alignSelf: "center",
        marginTop: hp('1.5%')
    },
    mrpPriceView: {
        flexDirection: "row",
        alignItems: "center"
    },
    mrpText: {
        fontFamily: "Poppins-Light",
        fontSize: wp("2.5%"),
        color: "#777777"
    },
    sellingPriceView: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#0CA201",
        borderWidth: 1,
        borderRadius: 8,
        padding: wp("0.5%"),
        marginTop: hp('0.2%'),
        alignSelf: "flex-end"
    },
    sellingPriceText: {
        fontFamily: "Poppins-SemiBold",
        fontSize: wp("3.7%"),
        color: "#0CA201"
    },
    productCardView: {
        flexDirection: 'row',
        // backgroundColor: 'yellow',
        alignSelf: 'center',
        // alignItems: "center"
        marginBottom: hp('1.5%')
    },
    productCardInnerViewOne: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        width: wp('18.5%'),
        height: wp('17.5%'),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: wp('2.32%'),
    },
    heartContainer: {
        position: "absolute",
        top: wp('0.5%'),
        left: wp('0.5%')
    },
    productImage: {
        width: wp('14%'),
        height: wp('13%'),
        resizeMode: 'contain',
        marginTop: wp('1%')
    },
    productCardInnerViewTwo: {
        width: wp("30%"),
        // justifyContent: "space-between",
        // paddingBottom: hp('0.5%')
        // backgroundColor: 'blue',
        justifyContent: "space-between",
        paddingVertical: hp('0.5%'),
        marginLeft: wp('2%')
    },
    productNameText: {
        fontFamily: 'Poppins-Regular',
        fontSize: wp('3.02%'),
        color: '#000000'
    },
    btokenView: {
        flexDirection: "row",
        alignItems: 'center'
    },
    btokenImage: {
        width: wp('2.8%'),
        height: wp('1.8%')
    },
    btokenImageTwo: {
        width: wp('4.65%'),
        height: wp('2.79%')
    },
    btokenText: {
        color: "#5E3568",
        fontFamily: 'Outfit-Regular',
        fontSize: wp('2.4%'),
        marginLeft: wp('1%')
    },
    itemCountContainer: {
        width: wp('17.4%'),
        height: hp('3.86%'),
        backgroundColor: '#F04B1B1A',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#F25000',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: wp('1.5%'),
        marginTop: hp('1%'),
        marginLeft: wp('3%')
    },
    minusButton: {
        height: wp('0.5%'),
        width: wp('2.8%')
    },
    countText: {
        fontFamily: 'Outfit-Regular',
        fontSize: wp('4.2%'),
        color: '#F25000'
    },
    plusButton: {
        height: wp('2.8%'),
        width: wp('2.8%')
    },
    productCardInnerViewThree: {
        paddingTop: hp('0.8%'),
        marginLeft: wp('2%')
    },
    removeView: {
        fontSize: 10,
        position: "absolute",
        bottom: hp('-0.6%'),
        right: 0,
        flexDirection: 'row',
        alignItems: "center",
    },
    removeAlertImage: {
        width: wp('2.5%'),
        height: wp('2.3%')
    },
    removeText: {
        color: '#F25000',
        fontSize: wp('2.8%'),
        fontFamily: "Outfit-Light",
        bottom: hp('-0.1%'),
        marginLeft: wp("1%")
    },
    soldOutView: {
        height: wp('17.5%'),
        backgroundColor: "#F25000",
        position: "absolute",
        top: 0,
        right: 0,
        justifyContent: 'center',
        borderTopRightRadius: wp('2.32%'),
        borderBottomRightRadius: wp('2.32%'),
        width: "55%",
        alignItems: 'center'
    },
    soldText: {
        color: "#FFFFFF",
        fontFamily: 'Poppins-ExtraBold',
        fontSize: wp('3%'),
        top: hp('0.4%')
    },
    outText: {
        color: "#FFFFFF",
        fontFamily: 'Poppins-ExtraBold',
        fontSize: wp('3.6%'),
        bottom: hp('0.4%')
    },
    productsContainer: {
        borderColor: '#DADADA',
        borderWidth: 1,
        borderRadius: wp('4.65%'),
        marginHorizontal: wp('4.5%'),
        paddingVertical: hp('1.5%'),
        marginTop: hp('1.5%')
    },
    productsContainerInnerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: wp('3%'),
        borderTopColor: '#DADADA',
        borderTopWidth: 1,
        paddingTop: hp('1.2%')
    },
    itemsText: {
        fontFamily: 'Poppins-Medium',
        fontSize: wp('3.5%')
    },
    offersContainer: {
        marginTop: hp('2.3%')
    },
    offersHeaderView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp('1%')
    },
    offersHeaderImage: {
        width: wp('4.65%'),
        height: wp('4.65%')
    },
    offersHeaderText: {
        fontFamily: 'Poppins-Medium',
        fontSize: wp('4.1%'),
        color: '#000000',
        marginLeft: wp('1.5%')
    },
    headerText: {
        fontFamily: "Poppins-Medium",
        color: "#000000",
        fontSize: wp('4.2%'),
        alignSelf: 'center'
    },
    wishListContainer: {
        marginTop: hp('1.7%'),
        // backgroundColor: 'red',
        height: hp('30%')

    },
    didyouforgetContainer: {
        marginTop: hp('2%'),
        // paddingBottom: 10
        // backgroundColor: 'blue',
        height: hp('30%')
    },
    bottomContainer: {
        borderColor: '#F25000',
        borderWidth: 1,
        borderTopLeftRadius: wp('4.65%'),
        borderTopRightRadius: wp('4.65%'),
        paddingTop: hp('0.7%'),
        borderBottomWidth: 0,
        marginTop: hp('2%'),
        paddingBottom: hp('2%')
    },
    bottomContainerInnerViewOne: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: wp('6%')
    },
    billView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    billIcon: {
        height: wp('3.72%'),
        width: wp('3.72%')
    },
    billText: {
        fontFamily: 'Poppins-Regular',
        color: '#000000',
        fontSize: wp('3.25%'),
        textDecorationLine: "underline",
        marginLeft: wp('2.5%')
    },
    priceMainView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    priceInnerView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    mrpText: {
        fontFamily: 'Poppins-Light',
        color: '#777777',
        fontSize: wp('3.25%')
    },
    priceText: {
        fontFamily: 'Poppins-SemiBold',
        color: '#0CA201',
        fontSize: wp('5.1%'),
        marginLeft: wp('2%')
    },
    bottomContainerInnerViewTwo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp('4%'),
        marginTop: hp('0.5%')
    },
    selectYourLocationButton: {
        backgroundColor: '#FFF3EC',
        // padding: wp('2.5%'),
        borderWidth: 1,
        borderColor: '#F25000',
        borderRadius: 10,
        width: wp('44.18%'),
        justifyContent: "center",
        alignItems: "center",
        height: hp('5.36%'),
    },
    selectYourLocationText: {
        color: '#F25000',
        fontFamily: 'Poppins-Bold',
        fontSize: wp('3.72%')
    },
    saveYourLocation: {
        backgroundColor: 'blue',
        borderRadius: 10,
        width: wp('44.18%'),
        height: hp('6.43%'),
    },
    saveYourLocationGradientStyle: {
        flex: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: wp('4.65%'),
        borderTopRightRadius: wp('4.65%'),
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('4.5%'),
        shadowColor: '#F25000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 3,
    },
    modalHeaderView: {
        flexDirection: "row"
    }
})
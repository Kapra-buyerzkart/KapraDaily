import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { FONTS } from '../styles/typography'

export default function WishlistScreen() {

    const products = [
        {
            id: "1",
            image: require("../assets/images/wl1.png"),
            name: "Lorem lpsum is simply dummy text",
            offer: 17,
            mrpPrice: 394,
            sellingPrice: 324
        },
        {
            id: "2",
            image: require("../assets/images/wl2.png"),
            name: "Lorem lpsum is simply dummy text",
            offer: 17,
            mrpPrice: 394,
            sellingPrice: 324
        },
        {
            id: "3",
            image: require("../assets/images/wl1.png"),
            name: "Lorem lpsum is simply dummy text",
            offer: 17,
            mrpPrice: 394,
            sellingPrice: 324
        },
        {
            id: "4",
            image: require("../assets/images/wl2.png"),
            name: "Lorem lpsum is simply dummy text",
            offer: 17,
            mrpPrice: 394,
            sellingPrice: 324
        },
        {
            id: "5",
            image: require("../assets/images/wl1.png"),
            name: "Lorem lpsum is simply dummy text",
            offer: 17,
            mrpPrice: 394,
            sellingPrice: 324
        },
        {
            id: "6",
            image: require("../assets/images/wl2.png"),
            name: "Lorem lpsum is simply dummy text",
            offer: 17,
            mrpPrice: 394,
            sellingPrice: 324
        },
        {
            id: "7",
            image: require("../assets/images/wl2.png"),
            name: "Lorem lpsum is simply dummy text",
            offer: 17,
            mrpPrice: 394,
            sellingPrice: 324
        },
        {
            id: "8",
            image: require("../assets/images/wl1.png"),
            name: "Lorem lpsum is simply dummy text",
            offer: 17,
            mrpPrice: 394,
            sellingPrice: 324
        },
        {
            id: "9",
            image: require("../assets/images/wl2.png"),
            name: "Lorem lpsum is simply dummy text",
            offer: 17,
            mrpPrice: 394,
            sellingPrice: 324
        },
    ]

    const ProductCard = (item) => {
        return (
            <TouchableOpacity style={styles.productCard}>
                <View style={styles.productCardViewOne}>
                    <Image style={styles.productHeart} source={require("../assets/images/heart_red.png")} />
                    <Image style={styles.productImage} source={item.item.image} />
                </View>
                <View style={styles.productCardViewTwo}>
                    <Text style={styles.productNameText}>{item.item.name}</Text>
                    <Text style={styles.offerText}>{item.item.offer} OFF</Text>
                </View>

                <View style={styles.productCardViewThree}>
                    <View style={styles.mrpView}>
                        <Text style={styles.mrpText}>MRP</Text>
                        <MaterialIcons name={'currency-rupee'} color={'#777777'} size={wp("2.4%")} style={styles.rupeeIconSmall} />
                        <Text style={[styles.mrpText, {
                            left: wp("-0.4%"),
                            textDecorationLine: "line-through",
                            textDecorationColor: "#777777"
                        }]}>{item.item.mrpPrice}</Text>
                    </View>
                </View>
                <View style={styles.productCardViewFour}>
                    <View style={styles.plusIconView}>
                        <Entypo name={"plus"} color={"#FFFFFF"} size={wp("4.1%")} />
                    </View>
                    <View style={styles.priceView}>
                        <MaterialIcons name={'currency-rupee'} color={'#0CA201'} size={wp("3.7%")} style={styles.rupeeIconBig}
                        />
                        <Text style={styles.priceText}>{item.item.sellingPrice}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView edges={['top']}
            style={styles.mainContainer}>
            <Text style={styles.header}>Wishlist</Text>
            <View style={styles.giftImageView}>
                <Image source={require("../assets/images/gift.png")} style={styles.giftImage} />
            </View>
            <View style={styles.productListView}>
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <ProductCard item={item} />}
                    showsVerticalScrollIndicator={false}
                />
                <TouchableOpacity style={styles.newWishesContainer}>
                    <Image source={require("../assets/images/heart_two.png")} style={styles.newWishesHeart} />

                    <Text style={styles.newWishesText}>New wishes</Text>
                </TouchableOpacity>
            </View>
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
        fontSize: wp("5%"),
        alignSelf: "center"
    },
    giftImageView: {
        // backgroundColor: "yellow",
        alignItems: "flex-end",
        // bottom: hp("0.5%"),
        paddingRight: wp("2.5%"),
        top: hp("0.8%"),
    },
    giftImage: {
        height: hp("5.6%"),
        width: wp("40%"),
        resizeMode: "contain",
        // backgroundColor: "red"
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
        bottom: hp('0.5%'),
        borderBottomColor: "#FFFFFF"
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
        marginTop: hp("0.5%")
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
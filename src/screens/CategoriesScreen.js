import { View, Text, TouchableOpacity, FlatList, Image, TextInput, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import ProductCard from '../components/ProductCard';
import SelectedProducts from '../components/SelectedProducts';
import LinearGradient from 'react-native-linear-gradient';
import { FONTS } from '../styles/typography'


const categories = [
    { id: "1", name: 'Fresh Vegetables', image: require("../assets/images/fv.png") },
    { id: "2", name: 'Fresh Fruits', image: require("../assets/images/ff.png") },
    { id: "3", name: 'Exotics', image: require("../assets/images/exotics.png") },
    { id: "4", name: 'Leafy', image: require("../assets/images/leafy.png") },
    { id: "5", name: 'Flowers & Leaves', image: require("../assets/images/fl.png") },
    { id: "6", name: 'Freshly Cut', image: require("../assets/images/fc.png") },
];

const categoryContent = {
    "1": [
        { id: "1", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
        { id: "2", name: "Green Chilli", img: require('../assets/images/products/chilli.png'), price: "₹324" },
        { id: "3", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
        { id: "4", name: "Green Chilli", img: require('../assets/images/products/chilli.png'), price: "₹324" },
        { id: "5", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
    ],
    "2": [
        { id: "1", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
        { id: "2", name: "Green Chilli", img: require('../assets/images/products/chilli.png'), price: "₹324" },
        { id: "3", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
        { id: "4", name: "Green Chilli", img: require('../assets/images/products/chilli.png'), price: "₹324" },
        { id: "5", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
    ],
    "3": [
        { id: "1", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
        { id: "2", name: "Green Chilli", img: require('../assets/images/products/chilli.png'), price: "₹324" },
        { id: "3", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
        { id: "4", name: "Green Chilli", img: require('../assets/images/products/chilli.png'), price: "₹324" },
        { id: "5", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
    ],
};

const selectedProducts = [
    { id: "1", image: require('../assets/images/product1.png') },
    { id: "2", image: require('../assets/images/product2.png') },
    { id: "3", image: require('../assets/images/product3.png') },
    { id: "4", image: require('../assets/images/product1.png') },
    { id: "5", image: require('../assets/images/product2.png') },
    { id: "6", image: require('../assets/images/product3.png') },
];

const dummyProducts = [
    { id: "1", image: require('../assets/images/mango.jpg'), name: "Mango" },
    { id: "2", image: require('../assets/images/apple.jpg'), name: "Apple" },
    { id: "3", image: require('../assets/images/mango.jpg'), name: "Mango" },
    { id: "4", image: require('../assets/images/apple.jpg'), name: "Apple" },
    { id: "5", image: require('../assets/images/mango.jpg'), name: "Mango" },
    { id: "6", image: require('../assets/images/apple.jpg'), name: "Apple" },
]


export default function CategoriesScreen() {
    const [selectedId, setSelectedId] = useState("1");
    const [selectedSubCatId, setSelectedSubCatId] = useState("1");

    // const [categoryName, setCategoryName] = useState(categories[selectedId].name);
    const categoryName =
        categories.find(cat => cat.id === selectedId)?.name || "";

    const renderItem = ({ item }) => {
        const isSelected = item.id === selectedId;

        return (
            <TouchableOpacity
                onPress={() => setSelectedId(item.id)}
                activeOpacity={0.8}
                style={{
                    marginBottom: hp("1.7%"),
                    marginLeft: wp("1.7%")
                }}
            >
                {isSelected ? (<LinearGradient
                    colors={["#FFFFFF", "#FFDB99"]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    // style={[styles.card, isSelected && styles.activeCard]}
                    style={styles.activeCard}
                >
                    <Image
                        source={item.image}
                        style={styles.image}
                        resizeMode="contain"
                    />


                </LinearGradient>
                ) : (<View
                    style={styles.card}
                >
                    <Image
                        source={item.image}
                        style={styles.image}
                        resizeMode="contain"
                    />

                </View>
                )}
                <Text style={isSelected ? styles.title : [styles.title, {
                    color: "#666666", marginTop: 0
                }]}>
                    {item.name}
                </Text>

            </TouchableOpacity>
        );
    };

    const renderSubCategory = ({ item }) => {
        const isSelected = item.id === selectedSubCatId;

        return (
            <>
                {isSelected ? (<TouchableOpacity onPress={() => setSelectedSubCatId(item.id)} style={styles.selectedSubCategory}>
                    <View style={styles.selectedSubCategoryImageView}>
                        <Image style={styles.selectedSubCategoryImage} source={item.image} />
                    </View>
                    <Text style={styles.selectedSubCatText}>{item.name}</Text>
                </TouchableOpacity>) : (
                    <TouchableOpacity onPress={() => setSelectedSubCatId(item.id)} style={[styles.selectedSubCategory, {
                        justifyContent: "center"
                    }]}>
                        <View style={styles.unselectedSubCatImageView}>
                            <Image style={styles.unselectedSubCatImage} source={item.image} />
                        </View>
                        <Text style={styles.unselectedSubCatText}>{item.name}</Text>
                    </TouchableOpacity>)}
            </>
        );
    };


    return (
        <SafeAreaView style={styles.mainContainer} edges={['top', 'left', 'right']}>
            <View style={{
                flexDirection: "row"
            }}>
                <View style={styles.viewOne} />
                <View style={styles.viewTwo}>
                    <Text style={styles.categoryHeaderText}>{categoryName}</Text>
                    <View style={styles.viewThree}>
                        <View style={styles.searchContainer}>
                            <Feather name="search" color={"#2D0F0D"} size={wp("5%")} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search product"
                                placeholderTextColor="#000000"
                            />
                            {/* <View style={styles.divider} />
                        <Ionicons name="clipboard-outline" color={"#8F8F8F"} size={wp("6%")} style={styles.clipboardIcon} /> */}
                        </View>
                        <View style={styles.filterView}>
                            <Image source={require("../assets/images/filter.png")} style={styles.filterIconStyle} />
                            <Text style={styles.filterText}>Filter</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.row}>

                {/* LEFT MENU */}
                <View style={styles.leftMenu}>
                    <FlatList
                        data={categories}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: hp("6%"),
                            // alignItems: "flex-end"
                        }}
                    />
                </View>

                {/* RIGHT CONTENT */}
                <ScrollView style={styles.rightContent}>
                    {/* <View style={{
                        alignItems: 'center'
                    }}>
                        <Image source={require("../assets/images/cat-banner.jpeg")}
                            style={styles.categoryBanner}
                        />
                    </View> */}
                    <FlatList
                        data={dummyProducts}
                        keyExtractor={(item) => item.id}
                        renderItem={renderSubCategory}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingLeft: wp("2.3%"),
                            marginTop: hp("0.8%")
                            // alignItems: "flex-end"
                        }}
                    />
                    {/* <TouchableOpacity style={{
                        // alignItems: "center"
                        // backgroundColor: "green",
                        width: wp("18.6%"),
                        alignItems: "center"
                    }}>
                        <View style={{
                            width: wp("18.6%"),
                            height: hp("8.04%"),
                            borderRadius: 10,
                            backgroundColor: "#FFDB99",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <Image style={{
                                width: wp("13.95%"),
                                height: wp("13.95%"),
                                borderRadius: 60,
                                resizeMode: "cover"
                            }} source={require("../assets/images/mango.jpg")} />
                        </View>
                        <Text style={{
                            color: "#000000",
                            fontFamily: "Lexend-Medium",
                            fontSize: wp("2.79%"),
                            marginTop: hp("0.1%")
                        }}>Orange</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        // backgroundColor: "red",
                        width: wp("16.28%"),
                        alignItems: "center"
                    }}>
                        <Image style={{
                            width: wp("11.63%"),
                            height: wp("11.63%%"),
                            borderRadius: 60,
                            resizeMode: "cover"
                        }} source={require("../assets/images/mango.jpg")} />
                        <Text style={{
                            color: "#666666",
                            fontFamily: "Lexend-Medium",
                            fontSize: wp("2.79%"),
                            marginTop: hp("0.1%")
                        }}>Orange</Text>
                    </TouchableOpacity> */}

                    <FlatList
                        data={categoryContent[selectedId] || []}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <ProductCard item={item} />}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingLeft: wp("2.3%"),
                            paddingBottom: hp("8.5%"),
                            paddingTop: hp("0.5%")
                        }}
                    />
                </ScrollView>
            </View>
            <View style={styles.floatingContainer}>
                <SelectedProducts selectedProducts={selectedProducts} />
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    row: {
        flex: 1,
        flexDirection: "row",
    },
    leftMenu: {
        width: wp("22%"),
        // paddingVertical: hp("1%"),
        // backgroundColor: "yellow",
        borderRightWidth: 1,
        borderColor: "#FFF3E8"
    },
    rightContent: {
        flex: 1,
        // backgroundColor: "red",
        // paddingLeft: wp("3.2%")
        // paddingBottom: 10
    },

    itemWrapper: {
        flexDirection: "row",
        backgroundColor: "#F6F1EF",
        // height: hp("15%"),
        // marginBottom: hp("1.8%"),
    },

    activeIndicator: {
        width: wp("1.86%"),
        backgroundColor: "#F25000",
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        marginVertical: hp("2%")
    },

    card: {
        alignItems: "center",
        width: wp("18.6%"),
        height: hp("8%"),
        justifyContent: "center"
    },

    activeCard: {
        // backgroundColor: "#FFFFFF",
        alignItems: "center",
        borderRadius: 10,
        borderWidth: 0.2,
        borderColor: "#FF7B3A",
        width: wp("18.6%"),
        height: hp("8%"),
        justifyContent: "center"
    },

    topCurve: {
        position: "absolute",
        top: -hp("8%"),
        width: "100%",
        height: hp("10%"),
        backgroundColor: "#F6F1EF",
        // borderBottomLeftRadius: 200,
        borderBottomRightRadius: wp("7%"),
    },

    bottomCurve: {
        position: "absolute",
        bottom: -hp("8%"),
        width: "100%",
        height: hp("10%"),
        backgroundColor: "#F6F1EF",
        // borderTopLeftRadius: 200,
        borderTopRightRadius: wp("7%"),
    },

    image: {
        width: wp("15%"),
        height: wp("15%"),
        // marginBottom: hp("1%"),
        // zIndex: 1,
    },

    title: {
        fontSize: wp("3%"),
        // fontWeight: "700",
        textAlign: "center",
        color: "#000000",
        // lineHeight: 18,
        // zIndex: 1,
        fontFamily: FONTS.poppins.medium,
        marginTop: hp("0.5%")
    },
    searchContainer: {
        // marginTop: hp('1.7%'),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: wp('1.4%'),
        paddingHorizontal: wp('2%'),
        height: hp('4.5%'),
        width: wp("46.52%"),
        // marginHorizontal: wp('4.7%'),
        borderWidth: 1,
        borderColor: "#E3E3E3"
    },
    searchInput: {
        flex: 1,
        fontSize: wp('3.25%'),
        marginHorizontal: wp('1.5%'),
        color: '#000000',
        fontFamily: FONTS.outfit.light,
    },
    floatingContainer: {
        position: "absolute",
        bottom: hp("0.7%"),
        left: 0,
        right: 0,
        alignItems: "center",
    },
    categoryHeaderText: {
        fontFamily: FONTS.lexend.semiBold,
        fontSize: wp("5.1%"),
        marginLeft: wp("10%")
    },
    filterText: {
        fontFamily: FONTS.lexend.medium,
        fontSize: wp("3.48%")
    },
    categoryBanner: {
        width: wp("64.65%"),
        height: hp("9.12%"),
        borderRadius: wp("3.48%"),
        marginTop: hp("1%"),
    },
    filterView: {
        width: wp("20%"),
        height: hp("4.5%"),
        borderWidth: 1,
        borderColor: "#E3E3E3",
        borderRadius: wp('1.4%'),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: wp("3%"),
    },
    filterIconStyle: {
        height: wp("3.25%"),
        width: wp("3.25%")
    },
    viewOne: {
        width: wp("21.7%"),
        backgroundColor: "#FFFFFF"
    },
    viewTwo: {
        backgroundColor: "#FFFFFF",
        flex: 1,
        paddingTop: hp("3%"),
        paddingBottom: hp("0.5%"),
        borderLeftWidth: 1,
        borderLeftColor: "#FFF3E8"
    },
    viewThree: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: wp("2.2%"),
        paddingRight: wp("4%"),
        marginTop: hp("1.3%")
    },
    subCatCard: {
        width: wp("16.28%"),
        alignItems: "center"
    },
    selectedSubCategory: {
        // alignItems: "center"
        // backgroundColor: "green",
        width: wp("18.6%"),
        alignItems: "center"
    },
    selectedSubCategoryImageView: {
        width: wp("18.6%"),
        height: hp("8.04%"),
        borderRadius: 10,
        backgroundColor: "#FFDB99",
        justifyContent: "center",
        alignItems: "center"
    },
    selectedSubCategoryImage: {
        width: wp("13.95%"),
        height: wp("13.95%"),
        borderRadius: 60,
        resizeMode: "cover"
    },
    selectedSubCatText: {
        color: "#000000",
        fontFamily: FONTS.lexend.medium,
        fontSize: wp("2.79%"),
        marginTop: hp("0.1%")
    },
    unselectedSubCatImageView: {
        width: wp("18.6%"),
        height: hp("6.5%"),
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center"
    },
    unselectedSubCatImage: {
        width: wp("11.63%"),
        height: wp("11.63%%"),
        borderRadius: 60,
        resizeMode: "cover"
    },
    unselectedSubCatText: {
        color: "#666666",
        fontFamily: FONTS.lexend.medium,
        fontSize: wp("2.79%"),
    }
});

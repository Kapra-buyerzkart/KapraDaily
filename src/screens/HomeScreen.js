import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, TextInput, FlatList, ScrollView, Dimensions } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import Svg, { Defs, RadialGradient, Stop, Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const { width } = Dimensions.get("window");
const BANNER_HEIGHT = (283 / 390) * width;

const banners = [
    require("../assets/images/image.png"),
    require("../assets/images/image.png"),
    require("../assets/images/image.png"),
];

const HomeScreen = () => {

    const categories = [
        {
            name: "Fruits & Vegetables",
            image: require('../assets/images/categories/fnv.png'),
        },
        {
            name: "Dairy, Egg & Bread",
            image: require('../assets/images/categories/cnb.png'),
        },
        {
            name: "Tea, Coffee More",
            image: require('../assets/images/categories/deb.png'),
        },
        {
            name: "Dry Fruits & Nuts",
            image: require('../assets/images/categories/dfn.png'),
        },
        {
            name: "Fish & Meat",
            image: require('../assets/images/categories/fnm.png'),
        },
        {
            name: "Snacks & Crips",
            image: require('../assets/images/categories/sdj.png'),
        },
        {
            name: "Soft Drinks & Juices",
            image: require('../assets/images/categories/snc.png'),
        },
        {
            name: "Cereals & Breakfast",
            image: require('../assets/images/categories/tcm.png'),
        },
    ];

    const products = [
        { id: "1", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
        { id: "2", name: "Green Chilli", img: require('../assets/images/products/chilli.png'), price: "₹324" },
        { id: "3", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
        { id: "4", name: "Green Chilli", img: require('../assets/images/products/chilli.png'), price: "₹324" },
        { id: "5", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
    ];

    const scrollRef = useRef();
    const [activeIndex, setActiveIndex] = useState(0);

    const onScroll = (e) => {
        const offsetX = e.nativeEvent.contentOffset.x;
        const width = e.nativeEvent.layoutMeasurement.width;

        const slideIndex = Math.round(offsetX / width);
        if (slideIndex !== activeIndex) {
            setActiveIndex(slideIndex);
        }
    };

    const GradientUserIcon = ({ size }) => {
        return (
            <Svg width={size} height={size} viewBox="0 0 24 24">

                <Defs>
                    <RadialGradient
                        id="grad"
                        cx="50%" cy="50%"
                        r="60%"
                    >
                        <Stop offset="0%" stopColor="#FFF09C" />
                        <Stop offset="100%" stopColor="#D2B200" />
                    </RadialGradient>
                </Defs>

                <Path
                    fill="url(#grad)"
                    d="M12 12c2.76 0 5-2.46 5-5.5S14.76 1 12 1 7 3.46 7 6.5 9.24 12 12 12zm0 2c-3.33 0-10 1.67-10 5v4h20v-4c0-3.33-6.67-5-10-5z"
                />
            </Svg>
        );
    };

    const CategoryItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.item}>
                <LinearGradient
                    colors={['#FF9D61', '#FFFFFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientBox}
                >
                    <Image source={item.image} style={styles.image} resizeMode="contain" />
                </LinearGradient>

                <Text style={styles.label}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    const ProductCard = ({ item }) => {
        return (
            <TouchableOpacity style={styles.productCard}>
                <View style={styles.productCardViewOne}>
                    <EvilIcons name={"heart"} size={wp("7%")} />
                    <Text style={styles.btokenText}>Upto 1B Token</Text>
                    <View style={styles.plusIconView}>
                        <Entypo name={"plus"} color={"#FFFFFF"} size={wp("3.8%")} />
                    </View>
                </View>
                <View style={styles.productCardViewTwo}>
                    <Image source={item.img} style={styles.productCardImage} />
                </View>

                <View style={styles.productCardViewThree}>
                    <View>
                        <Text style={styles.offerText}>17% OFF</Text>
                    </View>

                    <View>
                        <View style={styles.productCardViewFour}>
                            <Text style={styles.mrpText}>MRP </Text>
                            <MaterialIcons name={'currency-rupee'} color={'#777777'} size={wp("2.5%")} style={{
                                bottom: hp("0.1%")
                            }} />
                            <Text style={[styles.mrpText, {
                                textDecorationLine: "line-through",
                                textDecorationColor: "#777777"
                            }]}>394</Text>

                        </View>
                        <View style={styles.priceView}>
                            <MaterialIcons name={'currency-rupee'} color={'#0CA201'} size={wp("3.7%")} />
                            <Text style={styles.priceText}>324</Text>
                        </View>
                    </View>
                </View>
                <View style={{
                    // alignSelf: "center"
                }}>
                    <Text style={styles.productNameText}>Lorem lpsum is simply dummy text</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView
            edges={['top']}
            style={styles.mainContainer}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 0 }}
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={styles.headerMainView}>
                    <Image
                        source={require('../assets/images/curves.png')}
                        style={styles.topLeftCurve}
                    />
                    <View style={styles.headerViewOne}>
                        <View>
                            <Text style={styles.timeText}>20 min</Text>
                            <TouchableOpacity style={styles.addressView}>
                                <Text style={styles.addressText}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >Vennala: Chakkarapparambuabcdefg</Text>
                                <Entypo name={"chevron-right"} size={wp('3.6%')} color={"#FFFFFF"} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bcoinContainer}>

                            <LinearGradient
                                colors={['#FFEF94', '#FFF6C5', '#FFBA33', '#FFBA3300']}
                                locations={[0, 0.3, 0.7, 1]}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                                style={styles.bcoinRupee}
                            >
                                <MaterialIcons name={'currency-rupee'} size={wp('4%')} color={'#DB8000'} />
                            </LinearGradient>

                            {/* Badge */}
                            <LinearGradient
                                colors={['#FDED94', '#DEC32B']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.badge}
                            >
                                <Text style={styles.bcoinText}>10.0 B</Text>
                            </LinearGradient>

                        </View>
                        <TouchableOpacity style={styles.profileIconMainView}>
                            <Image source={require('../assets/images/crown.png')} width={wp('6.3%')} height={hp('2.6%')} />
                            <View style={styles.profileIconView}>
                                <GradientUserIcon size={wp('6%')} />
                            </View>
                        </TouchableOpacity>

                    </View>
                    <View style={styles.searchContainer}>
                        <Feather name="search" color={"#8F8F8F"} size={wp("6%")} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search product"
                            placeholderTextColor="#3A3A3A"
                        />
                        <View style={styles.divider} />
                        <Ionicons name="clipboard-outline" color={"#8F8F8F"} size={wp("6%")} style={styles.clipboardIcon} />
                    </View>
                </View>
                <View style={styles.headerBannerView}>
                    <Image source={require("../assets/images/banner.png")} style={styles.headerBannerImage} />
                </View>
                <View style={styles.categoryMainView}>
                    <Text style={styles.categoryHeaderText}>Category</Text>
                    <FlatList
                        data={categories}
                        numColumns={4}
                        keyExtractor={(item, index) => index.toString()}
                        columnWrapperStyle={styles.row}
                        renderItem={({ item }) => <CategoryItem item={item} />}
                        showsVerticalScrollIndicator={false}
                    />
                </View>

                <View style={styles.productsMainContainer}>
                    <ImageBackground
                        source={require("../assets/images/curve.png")}
                        style={styles.topBG}
                        resizeMode="stretch"
                    >
                        <View style={styles.productsContainerViewOne}>
                            <Text style={styles.productsContainerHeader}>Todays Special</Text>
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
                        />
                    </ImageBackground>
                </View>

                <View style={styles.productsMainContainerTwo}>
                    <View style={styles.productsContainerViewOne}>
                        <Text style={styles.productsContainerHeader}>Weekend offers</Text>
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
                    />
                </View>

                <TouchableOpacity style={styles.wrapper}>

                    <Image
                        source={require("../assets/images/rneb3.png")}
                        style={styles.leftConfetti}
                    />

                    <Image
                        source={require("../assets/images/rneb2.png")}
                        style={styles.benefitsBackground}
                    />


                    <Image
                        source={require("../assets/images/rneb.png")}
                        style={styles.mainBanner}
                    />

                    <Image
                        source={require("../assets/images/rneb4.png")}
                        style={styles.borderOverlay}
                    />

                </TouchableOpacity>

                <View style={styles.bannerContainer}>
                    {/* Scrollable Banner */}
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={onScroll}
                        ref={scrollRef}
                        scrollEventThrottle={16}
                        style={styles.scroll}
                        onMomentumScrollEnd={onScroll}
                    >
                        {banners.map((img, index) => (
                            <Image key={index} source={img} style={styles.bannerImage} />
                        ))}
                    </ScrollView>

                    {/* Pagination Dots */}
                    <View style={styles.pagination}>
                        {banners.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.dot,
                                    { opacity: i === activeIndex ? 1 : 0.3 },
                                    i === activeIndex && styles.activeDot,
                                ]}
                            />
                        ))}
                    </View>
                </View>
                <LinearGradient
                    colors={['#B700FF', '#FFFFFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.offerGradient}>
                    <View style={styles.offerView}>
                        <Image source={require('../assets/images/star1.png')} style={styles.starImage} />
                        <View style={styles.offerViewTwo}>
                            <Image source={require('../assets/images/offer.png')} style={styles.offerImage} />
                        </View>
                        <Image source={require('../assets/images/star2.png')} style={styles.starImage} />
                    </View>
                    <FlatList
                        style={{
                            marginLeft: wp("3%"),
                            marginTop: hp("3%")
                        }}
                        horizontal={true}
                        data={products}
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={({ item }) => <ProductCard item={item} />}
                        showsHorizontalScrollIndicator={false}
                    />
                </LinearGradient>
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    headerMainView: {
        backgroundColor: "#CD827F",
        paddingBottom: hp("1.4%")
    },
    topLeftCurve: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: wp('33%'),
        height: wp('33%'),
        resizeMode: 'contain',
    },
    headerBackground: {
        width: wp('100%'),
        height: hp('38%'),
    },

    headerImageStyle: {
        resizeMode: 'cover',
        borderBottomLeftRadius: wp('10%'),
        borderBottomRightRadius: wp('10%'),
    },
    headerViewOne: {
        flexDirection: "row",
        marginTop: hp('4%'),
        marginHorizontal: wp('6.9%'),
        justifyContent: "space-between",
    },
    timeText: {
        fontFamily: "Poppins-ExtraBold",
        color: "#FFFFFF",
        fontSize: wp('6%'),
    },
    addressView: {
        flexDirection: "row",
        alignItems: 'center',
    },
    addressText: {
        color: "#FFFFFF",
        fontSize: wp('3.3%'),
        fontFamily: "Poppins-Medium",
        maxWidth: wp('53%'),
    },
    bcoinContainer: {
        alignItems: 'center',
        width: wp('20%'),
    },
    bcoinRupee: {
        width: wp('6.5%'),
        height: wp('6.5%'),
        borderRadius: wp('4%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinSymbol: {
        color: '#FFD98F',
        fontSize: wp('4%'),
        fontFamily: 'Poppins-Bold',
    },
    badge: {
        width: wp('14%'),
        height: hp('2.1%'),
        borderRadius: wp('4%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -hp('1%'),

        shadowColor: '#744700',
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: -1 },
        elevation: 3,
    },
    bcoinText: {
        color: '#000000',
        fontSize: wp('3%'),
        fontFamily: 'Poppins-Bold',
    },
    profileIconView: {
        width: wp('8.8%'),
        height: wp('8.8%'),
        borderRadius: wp('7.5%'),
        borderColor: "#D2B200",
        borderWidth: wp("0.3%"),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        top: hp("-1.1%")
    },
    bear: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: wp('33%'),
        height: wp('33%'),
        resizeMode: "cover",
    },
    searchContainer: {
        marginTop: hp('1.7%'),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: wp('2.5%'),
        paddingHorizontal: wp('4%'),
        height: hp('5.4%'),
        marginHorizontal: wp('4.7%'),
    },
    searchInput: {
        flex: 1,
        fontSize: wp('3.8%'),
        marginHorizontal: wp('1.5%'),
        color: '#000000',
        fontFamily: 'Poppins-Light',
    },
    divider: {
        width: 1,
        height: hp('3.5%'),
        backgroundColor: '#8F8F8F',
        marginLeft: wp('2%'),
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: hp('2%'),
    },
    item: {
        width: wp('18%'),
        alignItems: 'center',
    },
    gradientBox: {
        width: wp('18%'),
        height: wp('18%'),
        borderRadius: wp('3%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: wp("17"),
        height: wp("17"),
    },
    label: {
        marginTop: hp('1%'),
        fontSize: wp('2.8%'),
        textAlign: 'center',
        color: '#190A07',
        fontFamily: "Poppins-Medium",
    },
    profileIconMainView: {
        alignItems: "center",
        top: hp("-1.1%")
    },
    headerBannerImage: {
        width: "100%",
        resizeMode: "contain",
    },
    categoryMainView: {
        marginHorizontal: wp("4.6%"),
        marginTop: hp("2%")
    },
    categoryHeaderText: {
        fontFamily: "Outfit-Medium",
        fontSize: wp("4.2%"),
        marginBottom: hp("2%")
    },
    productsMainContainer: {
        marginTop: hp("0.2%"),
    },

    /* TOP CURVED IMAGE */
    topBG: {
        width: wp("100%"),
        height: hp("35%"),
        // justifyContent: "flex-end",
        // paddingBottom: hp("3%"),
        paddingLeft: wp("4.6%"),
        paddingTop: hp("6%"),
        // backgroundColor: "yellow"
    },
    clipboardIcon: {
        marginLeft: wp('4%')
    },
    headerBannerView: {
        marginTop: hp("-2%")
    },
    productCard: {
        width: wp('34.7%'),
        height: hp('24.2%'),
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: wp('1.9%'),
        marginRight: wp('3.8%'),
        shadowColor: '#000000',
        shadowOpacity: 0.10,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 4,
        elevation: 3,
        marginTop: hp("1.5%"),
        // alignItems:'center'
        // width: wp('34%'),
        // height: hp('23%'),
        // backgroundColor: '#FFFFFF',
        // borderRadius: 20,
        // padding: wp('3%'),
        // marginRight: wp('4%'),
        // shadowColor: '#000',
        // shadowOpacity: 0.10,
        // shadowOffset: { width: 0, height: 2 },
        // shadowRadius: 4,
        // elevation: 3,
    },
    productsContainerViewOne: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    productsContainerHeader: {
        fontFamily: "Outfit-Medium",
        fontSize: wp("4.2%"),
    },
    viewAllContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: wp("4.6%")
    },
    viewAllText: {
        fontFamily: "Outfit-Regular",
        fontSize: wp("3.5%"),
        color: "#FF7B3A"
    },
    viewAllRightArrowIcon: {
        marginLeft: 5
    },
    productCardViewOne: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        // backgroundColor: "yellow",
    },
    btokenText: {
        fontFamily: "Outfit-Regular",
        fontSize: wp("2.3%"),
        color: "#5E3568"
    },
    plusIconView: {
        backgroundColor: "#F04B1B",
        padding: wp("1%"),
        borderRadius: 100
    },
    productCardViewTwo: {
        // backgroundColor:"blue",
        alignItems: "center"
    },
    productCardImage: {
        width: wp("24.65%"),
        height: wp("23.25%")
    },
    productCardViewThree: {
        flexDirection: "row",
        justifyContent: "space-between",
        // backgroundColor: "yellow",
        alignItems: "center"
    },
    offerText: {
        color: "#F04B1B",
        fontSize: wp("2.5%"),
        fontFamily: "Outfit-SemiBold"
    },
    productCardViewFour: {
        flexDirection: "row",
        alignItems: "center"
    },
    mrpText: {
        fontFamily: "Poppins-Light",
        fontSize: wp("2.5%"),
        color: "#777777"
    },
    priceView: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#0CA201",
        borderWidth: 1,
        borderRadius: 8,
        padding: wp("0.5%")
    },
    priceText: {
        fontFamily: "Poppins-SemiBold",
        fontSize: wp("3.7%"),
        color: "#0CA201"
    },
    productNameText: {
        fontFamily: "Outfit-Light",
        fontSize: wp("3.25%"),
        color: "#000000",
        textAlign: "center",
        marginTop: hp("0.5%")
    },
    productsMainContainerTwo: {
        marginTop: hp("2.7%"),
        paddingLeft: wp("4.6%"),
        height: hp("29.5%"),
        // width: wp("100%"),
    },
    bannerContainer: {
        marginTop: hp("4%"),
    },
    scroll: {
        width: wp("100%"),
        height: hp("20.38%"),
        // paddingLeft: wp("4.6%"),
    },
    bannerImage: {
        width: wp("84.88%"),
        height: hp("20.38%"),
        resizeMode: "cover",
        borderRadius: 8,
        marginLeft: wp("4.6%")
    },
    pagination: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: hp("1.5%"),
    },
    dot: {
        width: wp("2.32%"),
        height: wp("2.32%"),
        backgroundColor: "#F25000",
        borderRadius: 30,
        marginHorizontal: wp("1.17%"),
    },
    activeDot: {
        width: wp("3.25%"),
        height: wp("3.25"),
        borderRadius: 30
    },
    offerContainer: {
        marginTop: hp('2%'),
    },
    offerGradient: {
        width: wp("92%"),
        height: hp("50%"),
        marginTop: hp('3.5%'),
        // marginHorizontal: wp("1.86%")
        marginHorizontal: wp("4%"),
        borderRadius: wp("9.3%"),
        borderWidth: 1,
        borderColor: "#D4D4D4",
        marginBottom: hp("1%")
    },
    offerView: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: wp("3%"),
        marginTop: hp("4%"),
        // backgroundColor: "red"
    },
    starImage: {
        width: wp("10.46%"),
        height: hp("5.79%"),
        alignSelf: "flex-start"
    },
    offerViewTwo: {
        height: hp("10%"),
        // backgroundColor: "green",
        justifyContent: "flex-end"
    },
    offerImage: {
        width: wp("36.79%"),
        height: hp("8.66%"),
        // marginTop: hp(".5%")
    },
    wrapper: {
        width: wp("92%"),
        height: hp("5.5%"),
        alignSelf: "center",
        marginTop: hp("2%"),
        justifyContent: "center",
    },

    leftConfetti: {
        position: "absolute",
        left: 0,
        width: wp("15%"),
        height: "100%",
        resizeMode: "contain",
    },

    mainBanner: {
        width: wp("67.4%"),
        height: "100%",
        resizeMode: "contain",
        // alignSelf: "center"
        marginLeft: wp("15.5%")
    },

    borderOverlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        resizeMode: "stretch",
    },
    benefitsBackground: {
        position: "absolute",
        right: wp("7%"),
        width: wp("20%"),
        height: "70%",
        resizeMode: "contain",
    }
})
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, TextInput, FlatList, ScrollView, Dimensions } from 'react-native'
import React, { startTransition, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import Svg, { Defs, RadialGradient, LinearGradient as SvgLinearGradient, Stop, Path } from 'react-native-svg';
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

    const selectedProducts = [
        { id: "1", image: require('../assets/images/product1.png') },
        { id: "2", image: require('../assets/images/product2.png') },
        { id: "3", image: require('../assets/images/product3.png') },
        { id: "4", image: require('../assets/images/product1.png') },
        { id: "5", image: require('../assets/images/product2.png') },
        { id: "6", image: require('../assets/images/product3.png') },
    ];

    const fruits = [
        {
            id: "1",
            name: "Alfonso Mango",
            offer: 17,
            price: 324,
            image: require("../assets/images/mango.png")
        },
        {
            id: "2",
            name: "Alfonso Mango",
            offer: 17,
            price: 324,
            image: require("../assets/images/mango.png")
        },
        {
            id: "3",
            name: "Alfonso Mango",
            offer: 17,
            price: 324,
            image: require("../assets/images/mango.png")
        },
    ]

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

    const FruitCard = ({ item }) => {
        const nameParts = item.name?.split(" ") || [];
        const firstLine = nameParts[0] || "";
        const secondLine = nameParts.slice(1).join(" ");
        return (
            <ImageBackground source={require("../assets/images/mango.png")} style={styles.fruitsImageBackground}
                imageStyle={{
                    borderRadius: wp("4.65%"),
                }}>
                <View style={styles.fruitsImageView}>
                    <View>
                        <Text style={styles.fruitsNameText}>{firstLine}{"\n"}{secondLine}</Text>
                    </View>
                    <View style={{
                        // backgroundColor: "green",
                        // alignItems: "flex-start"
                    }}>
                        <View>
                            <Text style={styles.fruitsOfferText}>{item.offer}% OFF</Text>
                        </View>
                        <View style={styles.fruitsInnerview}>
                            <View style={styles.fruitsInnerviewTwo}>
                                <MaterialIcons name={'currency-rupee'} color={'#FFFFFF'} size={wp("5.12%")} style={styles.fruitsRupeeIcon} />
                                <Text style={styles.fruitsPriceText}>{item.price}</Text>
                            </View>
                            <View style={styles.fruitsInnerviewThree}>
                                <MaterialIcons name={'currency-rupee'} color={'#FFFFFF'} size={wp("2.79%")} style={styles.fruitsRupeeIcon} />
                                <Text style={styles.fruitsPriceTextTwo}>{item.price}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.addButtonContainer}>
                    <TouchableOpacity
                        style={styles.addButtonView}
                    >
                        <Text style={styles.addText}>ADD</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        )
    }

    const CurvedSection = ({ children }) => {
        const height = hp("29%");     // total height of section
        const curveDepth = 50; // downward curve depth

        const d = `
    M 0 0
    C ${width * 0.25} ${curveDepth},
      ${width * 0.75} ${curveDepth},
      ${width} 0
    L ${width} ${height}
    L 0 ${height}
    Z
  `;

        return (
            <View style={{
                width,
                height,
                position: "relative"
            }}>
                {/* Background curved SVG */}
                <Svg width={width} height={height} style={styles.curvedSectionSvg}>
                    <Defs>
                        <SvgLinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor="#FFC7AC" />
                            <Stop offset="1" stopColor="#FFFFFF" />
                        </SvgLinearGradient>
                    </Defs>
                    <Path d={d} fill="url(#grad)" />
                </Svg>

                {/* Content over the curved shape */}
                <View style={styles.curvedSectionView}>
                    {children}
                </View>
            </View>
        );
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
                {/* <LinearGradient
                    colors={['#FFC7AC', '#FFFFFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{
                        height: hp("55%"),
                        width: "100%"
                    }}
                >

                </LinearGradient> */}
                {/* <View style={{ width: "100%", height: 300 }}>
/                    <Svg
                        width="100%"
                        height="120"
                        style={{ position: "absolute", top: 0 }}
                        viewBox="0 0 1440 320"
                    >
                        <Path
                            fill="#FFFFFF"
                            d="M0,160 C400,10 1040,10 1440,160 L1440,0 L0,0 Z"
                        />
                    </Svg>

/                    <LinearGradient
                        colors={['#FFC7AC', '#FFFFFF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{
                            flex: 1,
                            marginTop: 60,  // pushes gradient below the curve
                        }}
                    />
                </View> */}
                <View style={styles.fruitsContainer}>
                    <View style={styles.fruitsHeaderView}>
                        <Text style={styles.fruitsHeaderText}>Seasonal fruits</Text>
                        <TouchableOpacity style={styles.viewAllContainer}>
                            <Text style={styles.viewAllText}>View All</Text>
                            <MaterialIcons name={"arrow-forward-ios"} color={"#FF7B3A"} size={wp("3.3%")} style={styles.viewAllRightArrowIcon} />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        style={styles.fruitsFlatlist}
                        data={fruits}
                        keyExtractor={(item, index) => item.id}
                        horizontal={true}
                        renderItem={({ item }) => <FruitCard item={item} />}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>

                <View style={styles.searchingForSomethingView}>

                    <CurvedSection>

                        {/* ADD ANYTHING YOU WANT INSIDE! */}
                        {/* <View style={{ alignItems: "center" }}> */}
                        <View style={styles.searchingForSomethingViewTwo}>
                            <View>
                                <Image
                                    source={require("../assets/images/boy.png")}
                                    style={styles.searchingForSomethingImageOne}
                                />
                                <Image
                                    source={require("../assets/images/shadow.png")}
                                    style={styles.searchingForSomethingImageTwo}
                                />
                            </View>
                            <View style={styles.searchingForSomethingViewThree}>
                                <Text style={[styles.searchingForSomethingText, {
                                    color: "#000000"
                                }]}>Searching for something</Text>
                                <Text style={[styles.searchingForSomethingText, {
                                    color: "#FF0000"
                                }]}>but couldn't find it?</Text>
                            </View>

                        </View>
                    </CurvedSection>

                </View>
                <View style={styles.tellusContainer}>
                    <Text style={styles.tellUsText}>Don't worry. Tel us what you require</Text>
                    <View style={styles.searchContainerTwo}>
                        {/* <Feather name="search" color={"#8F8F8F"} size={wp("6%")} /> */}
                        <TextInput
                            style={styles.searchInput}
                            placeholder="example: apple"
                            placeholderTextColor="#767676"
                        />
                        <TouchableOpacity style={styles.enterContainer}>
                            <Text style={styles.enterText}>enter</Text>
                        </TouchableOpacity>
                    </View>
                    <Image style={styles.kapraLogo} source={require("../assets/images/logo.png")} />
                    <Text style={[styles.tellUsText, { marginTop: hp("2.5%") }]}>Is here to help you</Text>
                </View>

                <TouchableOpacity style={{
                    alignSelf: "center",
                    marginTop: hp("2%"),
                    marginBottom: hp("0.7%")
                }}>
                    <LinearGradient colors={["#F25000", "#FF7B3A", "#F25000"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            width: wp("90.69%"),
                            height: hp("6.86%"),
                            borderRadius: wp("2.8%"),
                            alignItems: "center",
                            flexDirection: "row",
                            justifyContent:'space-between'
                            // paddingLeft: wp("2.5%"),
                            // paddingRight: wp("4%")
                        }}
                    >
                        {/* <View style={styles.selectedProductsImageStack}> */}
                        {/* {selectedProducts.slice(0, 3).map((item, index, arr) => {
                                const isTopImage = index === arr.length - 1;

                                return (
                                    <View
                                        key={item.id || index}
                                        style={[
                                            styles.selectedProductsImageWrapper,
                                            {
                                                right: (arr.length - 1 - index) * 14, // 👈 reverse position
                                                zIndex: index + 1,                    // 👈 top image highest
                                                opacity: isTopImage ? 1 : 0.35,       // 👈 dim below images
                                            },
                                        ]}
                                    >
                                        <Image
                                            source={item.image}
                                            style={styles.selectedProductsImage}
                                        />
                                    </View>
                                );
                            })} */}
                        {/* </View> */}
                        {/* <Image source={require("../assets/images/product1.png")} style={{
                            height: 40,
                            width: 40,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: "#F25000"
                        }}/> */}
                        <View style={styles.stackContainer}>
                            {selectedProducts.slice(0, 3).map((item, index) => (
                                <Image
                                    key={index}
                                    source={item.image}
                                    style={[
                                        styles.productImage,
                                        {
                                            marginLeft: index === 0 ? 0 : wp("-5.4%"), // overlap to left
                                            // zIndex: index + 1,                 // last image on top
                                        },
                                    ]}
                                />
                            ))}
                        </View>
                        <View style={{
                            flex: 0.5,
                            paddingLeft: wp("2%")
                        }}>
                            <Text style={{
                                fontSize: wp("3.25%"),
                                color: "#FFFFFF",
                                fontFamily: "Poppins-Medium"
                            }}>{selectedProducts.length} ITEMS</Text>
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                bottom: hp("0.2%")
                            }}>
                                <Text style={{
                                    fontFamily: "Poppins-Regular",
                                    fontSize: wp("2.8%"),
                                    color: "#FFFFFF"
                                }}>You save</Text>
                                <MaterialIcons name={'currency-rupee'} color={'#FFFFFF'} size={wp("2.8%")} style={{
                                    bottom: hp("0.1%"),
                                    marginLeft: wp('0.5%')
                                }} />
                                <Text style={{
                                    fontFamily: "Poppins-Regular",
                                    fontSize: wp("2.8%"),
                                    color: "#FFFFFF"
                                }}>94</Text>
                            </View>
                        </View>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            flex: 0.2
                        }}>
                            <MaterialIcons name={'currency-rupee'} color={'#FFFFFF'} size={wp("5.6%")} style={{
                                bottom: hp("0.2%"),
                                // marginLeft: wp('0.5%')
                            }} />
                            <Text style={{
                                fontFamily: "Poppins-Medium",
                                fontSize: wp("5.6%"),
                                color: "#FFFFFF",
                                left: wp("-0.5%")
                            }}>394</Text>
                        </View>
                        <Image source={require("../assets/images/right-arrows.png")} style={{
                            width: wp("8.14%"),
                            height: hp("1.93%"),
                            // bottom: hp("0.2%"),
                            marginRight: wp("6%"),
                        }} />

                    </LinearGradient>
                </TouchableOpacity>
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
        height: hp("5.2%"),
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
    },
    tellusContainer: {
        height: hp("36.05%"),
        width: wp("90.69%"),
        backgroundColor: "#481300",
        alignSelf: "center",
        borderRadius: 20,
        alignItems: "center"
    },
    tellUsText: {
        fontFamily: "Poppins-Regular",
        color: "#FFFFFF",
        fontSize: wp("3.95%"),
        marginTop: hp("3.1%")
    },
    searchContainerTwo: {
        marginTop: hp('1.7%'),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D9D9D9',
        borderRadius: 20,
        paddingLeft: wp('6%'),
        height: hp('5.4%'),
        marginHorizontal: wp('5%'),
    },
    searchInput: {
        flex: 1,
        fontSize: wp('3.8%'),
        // marginHorizontal: wp('1.5%'),
        color: '#000000',
        fontFamily: 'Poppins-Light',
    },
    enterContainer: {
        width: wp("16%"),
        height: hp('3.5%'),
        // backgroundColor: 'red',
        // marginLeft: wp('2%'),
        justifyContent: "center",
        alignItems: "center",
        borderLeftWidth: 2,
        borderLeftColor: "#000000",
        marginLeft: wp("1%"),
        paddingRight: wp("1%")
    },
    enterText: {
        color: "#000000",
        fontSize: wp("3.8%"),
        fontFamily: "Poppins-SemiBold"
    },
    kapraLogo: {
        width: wp("64.65%"),
        height: hp("10.73%"),
        marginTop: hp("2.5%")
    },
    curvedSectionSvg: {
        position: "absolute"
    },
    curvedSectionView: {
        flex: 1,
        paddingTop: 40,
        justifyContent: "flex-end",
        paddingBottom: hp("0.4%"),
    },
    searchingForSomethingView: {
        flex: 1
    },
    searchingForSomethingViewTwo: {
        flexDirection: "row",
    },
    searchingForSomethingImageOne: {
        width: wp("42.51%"),
        height: hp("19.03%"),
        resizeMode: "contain",
        marginLeft: wp("2%")
    },
    searchingForSomethingImageTwo: {
        width: wp("31.62%"),
        height: hp("1.18%"),
        resizeMode: "contain",
        top: -4
    },
    searchingForSomethingViewThree: {
        // backgroundColor: "red",
        justifyContent: "flex-end",
        paddingBottom: hp("2%")
    },
    searchingForSomethingText: {
        fontFamily: "Poppins-SemiBold",
        fontSize: wp("3.95%"),
    },
    fruitsHeaderView: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: hp("3%"),
        marginBottom: hp("1.5%")
    },
    fruitsHeaderText: {
        fontFamily: "Outfit-Medium",
        color: "#000000",
        fontSize: wp("4.2%"),
        marginLeft: wp("5%")
    },
    fruitsFlatlist: {
        marginLeft: wp("5%")
    },
    fruitsImageBackground: {
        width: wp("74.88%"),
        height: hp("19.35%"),
        flexDirection: "row",
        marginRight: wp("5%")
    },
    fruitsImageView: {
        justifyContent: "space-between",
        flex: 1,
        paddingLeft: wp("5.11%"),
        paddingTop: hp("3.8%"),
        paddingBottom: hp("1.3%"),
    },
    fruitsNameText: {
        color: "#FFFFFF",
        fontFamily: "Outfit-Regular",
        fontSize: wp("4.7%"),
        lineHeight: wp("5.7%")
    },
    fruitsOfferText: {
        fontFamily: "Poppins-SemiBold",
        fontSize: wp("2.79%"),
        color: "#FFFFFF"
    },
    fruitsInnerview: {
        flexDirection: "row",
        left: wp("-1%")
    },
    fruitsInnerviewTwo: {
        flexDirection: "row",
        alignItems: "center",
    },
    fruitsRupeeIcon: {
        bottom: hp("0.2%")
    },
    fruitsPriceText: {
        fontSize: wp("5.12%"),
        color: "#FFFFFF",
        fontFamily: "Poppins-SemiBold",
        left: wp("-0.7%")
    },
    fruitsInnerviewThree: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: wp("2%")
    },
    fruitsPriceTextTwo: {
        fontSize: wp("2.79%"),
        color: "#FFFFFF",
        fontFamily: "Poppins-Light",
        left: wp("-0.4%"),
        textDecorationLine: "line-through",
        textDecorationColor: "#FFFFFF"
    },
    addButtonContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "flex-end",
        paddingBottom: hp("2.2%"),
        paddingRight: wp("5.5%")
    },
    addButtonView: {
        // paddingHorizontal: wp("5%"),
        backgroundColor: "#FFFFFF",
        width: wp("19.76%"),
        height: hp("3.86%"),
        borderRadius: wp("2.6%"),
        justifyContent: "center",
        alignItems: "center",
        // alignSelf:"flex-end"
    },
    addText: {
        fontFamily: "Poppins-SemiBold",
        color: "#F1BF2D",
        fontSize: wp("3.95%")
    },
    fruitsContainer: {
        marginBottom: hp("4.5%")
    },
    stackContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: wp("3%")
    },

    productImage: {
        height: wp("9.3%"),
        width: wp("9.3%"),
        borderRadius: wp("2.4%"),
        borderWidth: 1,
        borderColor: "#F25000",
        // backgroundColor: "#fff",
    },
})
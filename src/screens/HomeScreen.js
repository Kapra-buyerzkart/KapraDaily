import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, TextInput, FlatList, ScrollView, Dimensions, RefreshControl } from 'react-native'
import React, { startTransition, useEffect, useRef, useState, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import Svg, { Defs, RadialGradient, LinearGradient as SvgLinearGradient, Stop, Path } from 'react-native-svg';
const SvgAvailable = false; // Forced false for debugging
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import ProductCard from '../components/ProductCard';
import SelectedProducts from '../components/SelectedProducts';
import { useNavigation } from '@react-navigation/native';
import { FONTS } from '../styles/typography'
import { getAccessToken, setTokens } from '../api/tokenService';
import useHomeData from '../hooks/useHomeData';
import CONFIG from '../globals/config';
import ShimmerPlaceholder from '../components/ShimmerPlaceholder';
import { getDashboardDataApi, requestProductApi } from '../api/userService';
import { LoaderContext } from '../context/loaderContext';

import EmptySection from '../components/EmptySection';
import { AppContext } from '../context/appContext';
import LoginScreen from './LoginScreen';


const { width } = Dimensions.get("window");
const BANNER_HEIGHT = (283 / 390) * width;
const staticBanners = [
    require("../assets/images/image.png"),
    require("../assets/images/image.png"),
    require("../assets/images/image.png"),
];

const PlacementBannerCarousel = ({ banners, onBannerPress, style, fullWidth = false }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!banners || banners.length === 0) return null;

    const BANNER_WIDTH = fullWidth ? wp('100%') : wp('85%');
    const BANNER_SPACING = fullWidth ? 0 : wp('4%');
    const SNAP_INTERVAL = BANNER_WIDTH + BANNER_SPACING;

    const onScroll = (e) => {
        const offsetX = e.nativeEvent.contentOffset.x;
        const slideIndex = Math.round(offsetX / SNAP_INTERVAL);
        if (slideIndex !== activeIndex) {
            setActiveIndex(slideIndex);
        }
    };

    if (banners.length === 1) {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => onBannerPress(banners[0])}
                style={[fullWidth ? styles.topHomeBannerViewFull : styles.topHomeBannerView, style]}
            >
                <Image
                    source={banners[0].uri}
                    style={styles.topHomeBannerImage}
                    resizeMode="stretch"
                />
            </TouchableOpacity>
        );
    }

    return (
        <View style={style}>
            <FlatList
                data={banners}
                horizontal
                pagingEnabled={fullWidth}
                snapToInterval={fullWidth ? undefined : SNAP_INTERVAL}
                snapToAlignment={fullWidth ? undefined : "start"}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={fullWidth ? undefined : { paddingHorizontal: wp('4.6%') }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => onBannerPress(item)}
                        style={{
                            width: BANNER_WIDTH,
                            height: hp('20%'),
                            marginRight: BANNER_SPACING,
                            borderRadius: fullWidth ? 0 : wp('4%'),
                            overflow: 'hidden'
                        }}
                    >
                        <Image
                            source={item.uri}
                            style={styles.topHomeBannerImage}
                            resizeMode="stretch"
                        />
                    </TouchableOpacity>
                )}
            />
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
    );
};

const HomeScreen = () => {
    console.log('HomeScreen Rendered');
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
            image: require("../assets/images/mango_banner.png")
        },
        {
            id: "2",
            name: "Alfonso Mango",
            offer: 17,
            price: 324,
            image: require("../assets/images/mango_banner.png")
        },
        {
            id: "3",
            name: "Alfonso Mango",
            offer: 17,
            price: 324,
            image: require("../assets/images/mango_banner.png")
        },
    ]
    const BANNER_WIDTH = wp("84.88%");
    const BANNER_SPACING = wp("4.6%");
    const SNAP_INTERVAL = BANNER_WIDTH + BANNER_SPACING;

    const scrollRef = useRef();
    const [activeIndex, setActiveIndex] = useState(0);
    const [accessToken, setAccessToken] = useState(null);
    const [isProfileLoaded, setIsProfileLoaded] = useState(false);

    const { profile, loadProfile, loadProfileTwo, logout } = useContext(AppContext);


    // useEffect(() => {
    //     const fetchProfile = async () => {
    //         showLoader(true);
    //         await loadProfile();
    //         showLoader(false);
    //         setIsProfileLoaded(true);   // ✅ IMPORTANT
    //     };
    //     fetchProfile();
    // }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                showLoader(true);
                await loadProfileTwo();   // or loadProfileTwo() if guest-first
            } catch (error) {
                console.error('Profile load error:', error);
            } finally {
                showLoader(false);
                setIsProfileLoaded(true);
            }
        };

        fetchProfile();
    }, []);

    useEffect(() => {
        if (!isProfileLoaded) return; // ⛔ wait till profile loads
        if (!profile) return;         // ⛔ safety

        console.log("PROFILE CHECK:", profile);

        if (!profile.custId) {
            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: 'LoginScreen',
                        params: { type: 'login' }
                    }
                ],
            });
        }
    }, [profile, isProfileLoaded]);

    console.log("OOOOPPPPP", profile)

    const onScroll = (e) => {
        const offsetX = e.nativeEvent.contentOffset.x;
        const width = e.nativeEvent.layoutMeasurement.width;

        const slideIndex = Math.round(offsetX / width);
        if (slideIndex !== activeIndex) {
            setActiveIndex(slideIndex);
        }
    };

    const [dashboardData, setDashboardData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const {
        bestOffers,
        featuredProducts,
        halfPriceStore,
        pincodeAreas,
        homepageData,
        banners,
        categories,
        userLocation,
        featuredProductsTitle,
        topBanner,
        midBanner,
        midBannerBottom,
        bottomBanner,
        refreshHomeData,
        isHomeLoading,
        isStoreUnavailable,
        storeUnavailableData
    } = useHomeData();
    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        try {
            await Promise.all([
                fetchDashboardData(),
                loadProfileTwo(),
                refreshHomeData()
            ]);
        } catch (error) {
            console.error('Refresh error:', error);
        } finally {
            setRefreshing(false);
        }
    }, [loadProfileTwo, refreshHomeData]);

    const [requestText, setRequestText] = useState('');
    const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

    const handleRequestProduct = async () => {
        if (!requestText.trim()) return;

        try {
            setIsSubmittingRequest(true);
            const response = await requestProductApi({ requestdetails: requestText });
            if (response && response.success) {
                alert('Thank you! Your request has been submitted.');
                setRequestText('');
            } else {
                alert(response?.message || 'Failed to submit request. Please try again.');
            }
        } catch (error) {
            console.error('Request product error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmittingRequest(false);
        }
    };

    const navigation = useNavigation();
    const { showLoader } = useContext(LoaderContext);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // showLoader(true);
            const response = await getDashboardDataApi();
            if (response && response.success) {
                setDashboardData(response.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            // showLoader(false);
        }
    };

    const GradientUserIcon = ({ size }) => {
        return (
            <FontAwesome6 name="user" size={size * 0.7} color="#D2B200" />
        );
    };


    // Helper for category images
    const getCategoryPlaceholder = (name) => {
        const lowerName = name?.toLowerCase() || '';
        if (lowerName.includes('fruit') || lowerName.includes('vegetable')) return require('../assets/images/categories/fnv.png');
        if (lowerName.includes('dairy') || lowerName.includes('bread') || lowerName.includes('egg')) return require('../assets/images/categories/cnb.png');
        if (lowerName.includes('tea') || lowerName.includes('coffee')) return require('../assets/images/categories/deb.png');
        if (lowerName.includes('dry') || lowerName.includes('nut')) return require('../assets/images/categories/dfn.png');
        if (lowerName.includes('fish') || lowerName.includes('meat')) return require('../assets/images/categories/fnm.png');
        if (lowerName.includes('snack')) return require('../assets/images/categories/sdj.png');
        if (lowerName.includes('drink') || lowerName.includes('juice')) return require('../assets/images/categories/snc.png');
        if (lowerName.includes('break') || lowerName.includes('cereal')) return require('../assets/images/categories/tcm.png');
        return require('../assets/images/categories/dfn.png'); // Default fallback
    };


    const CategoryItem = ({ item }) => {
        const [imageLoading, setImageLoading] = useState(false);
        const [imageError, setImageError] = useState(false);

        let imageSource;
        if (imageError || (!item.image && !item.imageUrl)) {
            imageSource = getCategoryPlaceholder(item.catName || item.name);
        } else if (item.image) {
            imageSource = item.image;
        } else {
            imageSource = { uri: `${CONFIG.image_base_url}${item.imageUrl}` };
        }

        return (
            <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('SearchScreen', {
                    catId: item.catId || item.id,
                    catName: item.catName || item.name
                })}
            >
                <LinearGradient
                    colors={['#FF9D61', '#FFFFFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientBox}
                >
                    {imageLoading && <ShimmerPlaceholder style={[styles.image, { position: 'absolute', borderRadius: wp('3%') }]} />}
                    <Image
                        source={imageSource}
                        style={styles.image}
                        resizeMode="contain"
                        onLoadStart={() => setImageLoading(true)}
                        onLoadEnd={() => setImageLoading(false)}
                        onError={() => {
                            setImageError(true);
                            setImageLoading(false);
                        }}
                    />
                </LinearGradient>

                <Text style={styles.label} numberOfLines={2}>{item.catName || item.name}</Text>
            </TouchableOpacity>
        );
    };


    const FruitCard = ({ item }) => {
        const nameParts = item.name?.split(" ") || [];
        const firstLine = nameParts[0] || "";
        const secondLine = nameParts.slice(1).join(" ");
        return (
            <ImageBackground source={require("../assets/images/mango_banner.png")} style={styles.fruitsImageBackground}
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
        if (!SvgAvailable) return <View style={[styles.curvedSectionView, { backgroundColor: '#FFC7AC' }]}>{children}</View>;

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


    const handleBannerPress = (banner) => {
        console.log('Banner Pressed:', banner);
        if (banner.linkType === 'Product') {
            navigation.navigate('ProductDetailsScreen', { productId: banner.linkValue });
        } else if (banner.linkType === 'Category') {
            navigation.navigate('SearchScreen', {
                catId: banner.linkValue,
                catName: banner.linkName || banner.title || 'Category'
            });
        }
    };



    return (
        <SafeAreaView
            edges={['top']}
            style={styles.mainContainer}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: hp("0.7%") }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >

                <View
                    style={styles.headerMainView}>
                    {/* ... (Header content preserved) ... */}
                    <Image
                        source={require('../assets/images/curves.png')}
                        style={styles.topLeftCurve}
                    />
                    <View style={styles.headerViewOne}>
                        <View>
                            <Text style={styles.timeText}>20 min</Text>
                            <TouchableOpacity
                                style={styles.addressView}
                                onPress={() => navigation.navigate('SearchScreen', { type: 'location' })}
                            >
                                <Entypo name={"location-pin"} size={wp('3.6%')} color={"#FFFFFF"} style={{ marginRight: wp('1%') }} />
                                <Text style={styles.addressText}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {userLocation ? `${userLocation.locality || ''}: ${userLocation.area || ''}` : 'Select Location'}
                                </Text>
                                <Entypo name={"chevron-right"} size={wp('3.6%')} color={"#FFFFFF"} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.headerRightWrapper}>
                            <TouchableOpacity onPress={() => navigation.navigate("BCoinScreen")} style={styles.bcoinContainer}>
                                <Image style={styles.rupeeImageTwo} source={require('../assets/images/premium_rupee.png')} />
                                <LinearGradient
                                    colors={['#FDED94', '#DEC32B']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.badge}
                                >
                                    <Text style={styles.bcoinText}>{dashboardData?.wallet?.bCoins || '0.0'} B</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                navigation.navigate('ProfileScreen', {
                                    type: "login"
                                })
                            }} style={styles.profileIconMainView}>
                                {profile?.isPrivileged && (
                                    <Image source={require('../assets/images/crown.png')} width={wp('6.3%')} height={hp('2.3%')} />
                                )}
                                <View style={styles.profileIconView}>
                                    <GradientUserIcon size={wp('6%')} />
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <TouchableOpacity
                        onPress={() => !isStoreUnavailable && navigation.navigate('SearchScreen')}
                        style={[styles.searchContainer, isStoreUnavailable && { opacity: 0.6 }]}
                        activeOpacity={isStoreUnavailable ? 1 : 0.7}
                    >
                        <Feather name="search" color={"#8F8F8F"} size={wp("6%")} />
                        <View style={styles.searchProductContainer}>
                            <Text style={styles.searchProductText}>Search product</Text>
                        </View>
                        <Image style={styles.clipboardIcon} source={require('../assets/images/clip_board.png')} />
                    </TouchableOpacity>
                </View>
                {isStoreUnavailable ? (
                    <View style={styles.unavailableContainer}>
                        {storeUnavailableData.image ? (
                            <Image
                                source={{ uri: `${CONFIG.image_base_url}${storeUnavailableData.image}` }}
                                style={styles.unavailableImage}
                                resizeMode="contain"
                            />
                        ) : (
                            <View style={styles.fallbackIconContainer}>
                                <Ionicons name="storefront-outline" size={wp('30%')} color="#FF7B3A" />
                            </View>
                        )}
                        <Text style={styles.unavailableText}>
                            {storeUnavailableData.text || "Service not available in your area yet. We're coming soon!"}
                        </Text>

                        {/* <TouchableOpacity
                            style={styles.changeLocationButton}
                            onPress={() => navigation.navigate('SearchScreen', { type: 'location' })}
                        >
                            <Text style={styles.changeLocationButtonText}>Change Location</Text>
                        </TouchableOpacity> */}
                    </View>) : (<>
                        {/* Top Home Banner */}
                        <PlacementBannerCarousel banners={topBanner} onBannerPress={handleBannerPress} fullWidth />



                        <View style={styles.categoryMainView}>
                            <Text style={styles.categoryHeaderText}>Shop By Categories</Text>
                            <View style={styles.categoriesContainer}>
                                {categories.map((item, index) => (
                                    <CategoryItem key={index.toString()} item={item} />
                                ))}
                            </View>
                        </View>

                        {/* Mid Home Banner */}
                        <PlacementBannerCarousel banners={midBanner} onBannerPress={handleBannerPress} style={{ marginTop: hp('2%') }} />

                        <View style={styles.productsMainContainer}>
                            <ImageBackground
                                source={require("../assets/images/curve.png")}
                                style={styles.topBG}
                                resizeMode="stretch"
                            >
                                <View style={styles.productsContainerViewOne}>
                                    <Text style={styles.productsContainerHeader}>Todays Special</Text>
                                    <TouchableOpacity
                                        style={styles.viewAllContainer}
                                        onPress={() => navigation.navigate('ProductListScreen', {
                                            title: "Today's Special",
                                            products: bestOffers
                                        })}
                                    >
                                        <Text style={styles.viewAllText}>View All</Text>
                                        <MaterialIcons name={"arrow-forward-ios"} color={"#FF7B3A"} size={wp("3.3%")} style={styles.viewAllRightArrowIcon} />
                                    </TouchableOpacity>
                                </View>
                                <FlatList
                                    horizontal={true}
                                    data={bestOffers}
                                    keyExtractor={(item, index) => item.productId ? item.productId.toString() : index.toString()}
                                    renderItem={({ item }) => <ProductCard item={item} />}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{
                                        paddingLeft: wp('4.6%')
                                    }}
                                />
                            </ImageBackground>
                        </View>

                        {/* Mid Bottom Home Banner */}
                        <PlacementBannerCarousel banners={midBannerBottom} onBannerPress={handleBannerPress} style={{ marginTop: hp('2%') }} />

                        <View style={styles.productsMainContainerTwo}>
                            <View style={styles.productsContainerViewOne}>
                                <Text style={styles.productsContainerHeader}>{featuredProductsTitle}</Text>
                                <TouchableOpacity
                                    style={styles.viewAllContainer}
                                    onPress={() => navigation.navigate('ProductListScreen', {
                                        title: featuredProductsTitle,
                                        products: featuredProducts
                                    })}
                                >
                                    <Text style={styles.viewAllText}>View All</Text>
                                    <MaterialIcons name={"arrow-forward-ios"} color={"#FF7B3A"} size={wp("3.3%")} style={styles.viewAllRightArrowIcon} />
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                horizontal={true}
                                data={featuredProducts}
                                keyExtractor={(item, index) => item.productId ? item.productId.toString() : index.toString()}
                                renderItem={({ item }) => <ProductCard item={item} />}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    paddingLeft: wp('4.6%'), // 👈 first card left spacing
                                }}
                            />
                        </View>

                        <TouchableOpacity onPress={() => navigation.navigate('ReferralScreen')} style={styles.wrapper}>

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
                            <FlatList
                                data={banners}
                                horizontal
                                pagingEnabled={false}
                                showsHorizontalScrollIndicator={false}
                                snapToInterval={SNAP_INTERVAL}
                                decelerationRate="fast"
                                snapToAlignment="start"
                                contentContainerStyle={{ paddingRight: wp("4.6%") }}
                                onScroll={onScroll}
                                scrollEventThrottle={16}
                                renderItem={({ item }) => (
                                    <TouchableOpacity activeOpacity={0.9} onPress={() => handleBannerPress(item)}>
                                        <Image source={item.uri} style={styles.bannerImage} />
                                    </TouchableOpacity>
                                )}
                            />

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
                                    // marginLeft: wp("3%"),
                                    marginTop: hp("3%")
                                }}
                                horizontal={true}
                                data={bestOffers}
                                keyExtractor={(item, index) => item.productId ? item.productId.toString() : index.toString()}
                                renderItem={({ item }) => <ProductCard item={item} />}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    marginLeft: wp('3%')
                                }}
                            />
                        </LinearGradient>

                        {/* Bottom Home Banner */}
                        <PlacementBannerCarousel banners={bottomBanner} onBannerPress={handleBannerPress} style={{ marginTop: hp('2%') }} />

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
                        {/* Pincode Area List Display */}
                        {/* <View style={{ padding: 20 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Pincode Areas (Nearby)</Text>
                        </View> */}
                        <View style={styles.tellusContainer}>
                            <Text style={styles.tellUsText}>Don't worry. Tel us what you require</Text>
                            <View style={styles.searchContainerTwo}>
                                {/* <Feather name="search" color={"#8F8F8F"} size={wp("6%")} /> */}
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="example: apple"
                                    placeholderTextColor="#767676"
                                    value={requestText}
                                    onChangeText={setRequestText}
                                />
                                <TouchableOpacity
                                    style={styles.enterContainer}
                                    onPress={handleRequestProduct}
                                    disabled={isSubmittingRequest}
                                >
                                    <Text style={styles.enterText}>
                                        {isSubmittingRequest ? '...' : 'enter'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <Image style={styles.kapraLogo} source={require("../assets/images/logo.png")} />
                            <Text style={[styles.tellUsText, { marginTop: hp("2.5%") }]}>Is here to help you</Text>
                        </View>
                    </>
                )}
            </ScrollView>
            <View style={styles.floatingContainer}>
                <SelectedProducts />
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
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
        alignItems: 'flex-end',
    },
    timeText: {
        fontFamily: FONTS.poppins.extraBold,
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
        fontFamily: FONTS.poppins.medium,
        maxWidth: wp('53%'),
    },
    bcoinContainer: {
        alignItems: 'center',
        width: wp('20%'),
        // backgroundColor: 'red',
        //    left: wp('18.9%')

        // width: wp('20%'),
    },
    headerRightWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('3%'),
    },
    bcoinRupee: {
        width: wp('6.5%'),
        height: wp('6.5%'),
        borderRadius: wp('4%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    bcoinRupeeTwo: {
        width: wp('6.5%'),
        height: wp('6.5%'),
        borderRadius: wp('4%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    coinSymbol: {
        color: '#FFD98F',
        fontSize: wp('4%'),
        fontFamily: FONTS.poppins.bold,
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
        fontFamily: FONTS.poppins.bold,
    },
    bcoinTextTwo: {
        color: '#FFBA33',
        fontSize: wp('3%'),
        fontFamily: FONTS.poppins.bold,
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
        top: hp("-1.0%")
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
        fontFamily: FONTS.poppins.light,
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
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginTop: hp('0.5%'),
    },
    item: {
        width: wp('22.7%'),
        alignItems: 'center',
        marginBottom: hp('2.5%'),
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
        fontFamily: FONTS.poppins.medium,
    },
    profileIconMainView: {
        alignItems: "center",
    },
    // headerBannerImage: {
    //     width: "100%",
    //     resizeMode: "contain",
    // },
    headerBannerImage: {
        width: "100%",
        height: hp("22%"),   // adjust based on design
    },
    categoryMainView: {
        marginHorizontal: wp("4.6%"),
        marginTop: hp("2%")
    },
    categoryHeaderText: {
        fontFamily: FONTS.outfit.medium,
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
        // paddingLeft: wp("4.6%"),
        paddingTop: hp("6%"),
        // backgroundColor: "yellow"
    },
    clipboardIcon: {
        width: wp('5%'),
        height: hp('3%'),
        resizeMode: 'contain',
        marginLeft: wp('4%')
    },
    // headerBannerView: {
    //     marginTop: hp("-2%"),
    //     backgroundColor: 'yellow'
    // },
    headerBannerView: {
        width: wp('100%'),
        alignSelf: 'center'
        // marginTop: hp("-2%"),
    },
    // productCard: {
    //     width: wp('34.7%'),
    //     height: hp('24.2%'),
    //     backgroundColor: '#FFFFFF',
    //     borderRadius: 20,
    //     padding: wp('1.9%'),
    //     marginRight: wp('3.8%'),
    //     shadowColor: '#000000',
    //     shadowOpacity: 0.10,
    //     shadowOffset: { width: 0, height: 0 },
    //     shadowRadius: 4,
    //     elevation: 3,
    //     marginTop: hp("1.5%"),
    //     // alignItems:'center'
    //     // width: wp('34%'),
    //     // height: hp('23%'),
    //     // backgroundColor: '#FFFFFF',
    //     // borderRadius: 20,
    //     // padding: wp('3%'),
    //     // marginRight: wp('4%'),
    //     // shadowColor: '#000',
    //     // shadowOpacity: 0.10,
    //     // shadowOffset: { width: 0, height: 2 },
    //     // shadowRadius: 4,
    //     // elevation: 3,
    // },
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
    productsMainContainerTwo: {
        marginTop: hp("2.7%"),
        // paddingLeft: wp("4.6%"),
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
    // bannerImage: {
    //     width: wp("84.88%"),
    //     height: hp("20.38%"),
    //     resizeMode: "cover",
    //     borderRadius: 8,
    //     marginLeft: wp("4.6%")
    // },
    bannerImage: {
        width: wp("84.88%"),
        height: hp("20.38%"),
        resizeMode: "cover",
        borderRadius: 8,
        marginLeft: wp("4.6%"),
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
        width: wp("96%"),
        height: hp("50%"),
        marginTop: hp('3.5%'),
        // marginHorizontal: wp("1.86%")
        // marginHorizontal: wp("4%"),
        borderRadius: wp("9.3%"),
        borderWidth: 1,
        borderColor: "#D4D4D4",
        marginBottom: hp("1%"),
        alignSelf: 'center'
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
        marginTop: hp("2%"),
        height: hp("36.05%"),
        width: wp("90.69%"),
        backgroundColor: "#481300",
        alignSelf: "center",
        borderRadius: 20,
        alignItems: "center",
        marginBottom: hp("7.5%"),
    },
    tellUsText: {
        fontFamily: FONTS.poppins.regular,
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
        fontFamily: FONTS.poppins.light,
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
        fontFamily: FONTS.poppins.semiBold,
    },
    kapraLogo: {
        width: wp("64.65%"),
        height: hp("10.73%"),
        marginTop: hp("2.5%"),
        resizeMode: "contain"
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
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp("3.95%"),
    },
    fruitsHeaderView: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: hp("3%"),
        marginBottom: hp("1.5%")
    },
    fruitsHeaderText: {
        fontFamily: FONTS.outfit.medium,
        color: "#000000",
        fontSize: wp("4.2%"),
        marginLeft: wp("5%")
    },
    fruitsFlatlist: {
        // marginLeft: wp("5%")
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
        fontFamily: FONTS.outfit.regular,
        fontSize: wp("4.7%"),
        lineHeight: wp("5.7%")
    },
    fruitsOfferText: {
        fontFamily: FONTS.poppins.semiBold,
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
        fontFamily: FONTS.poppins.semiBold,
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
        fontFamily: FONTS.poppins.light,
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
        fontFamily: FONTS.poppins.semiBold,
        color: "#F1BF2D",
        fontSize: wp("3.95%")
    },
    fruitsContainer: {
        marginBottom: hp("4.5%")
    },
    floatingContainer: {
        position: "absolute",
        bottom: hp("0.7%"),
        left: 0,
        right: 0,
        alignItems: "center",
    },
    unavailableImage: {
        width: wp('70%'),
        height: hp('25%'),
        marginBottom: hp('2%'),
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    fallbackIconContainer: {
        marginBottom: hp('2%'),
        alignItems: 'center',
        justifyContent: 'center',
        height: hp('25%'),
    },
    unavailableText: {
        fontFamily: FONTS.outfit.light,
        fontSize: wp('3.7%'),
        color: '#333',
        textAlign: 'center',
        marginHorizontal: wp('5%'),
    },
    changeLocationButton: {
        marginTop: hp('3%'),
        backgroundColor: '#FF7B3A',
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('8%'),
        borderRadius: wp('2%'),
    },
    changeLocationButtonText: {
        fontFamily: FONTS.outfit.bold,
        fontSize: wp('4%'),
        color: '#FFFFFF',
    },
    rupeeImageOne: {
        width: hp('3%'),
        height: hp('3%'),
        bottom: hp('-0.5%')
    },
    rupeeImageTwo: {
        width: hp('3%'),
        height: hp('3%'),
        bottom: hp('-0.4%')
    },
    searchProductContainer: {
        borderRightWidth: 1,
        borderRightColor: '#8F8F8F',
        height: hp('3.65%'),
        justifyContent: 'center',
        marginLeft: wp('2%'),
        width: wp('65%')
    },
    searchProductText: {
        fontFamily: FONTS.poppins.light,
        fontSize: wp('3.72%'),
        color: '#3A3A3A',
    },
    topHomeBannerView: {
        width: wp('90.8%'),
        height: hp('20%'),
        alignSelf: 'center',
        borderRadius: wp('4%'),
        overflow: 'hidden',
    },
    topHomeBannerViewFull: {
        width: wp('100%'),
        height: hp('20%'),
        overflow: 'hidden',
    },
    topHomeBannerImage: {
        width: '100%',
        height: '100%',
    }
})
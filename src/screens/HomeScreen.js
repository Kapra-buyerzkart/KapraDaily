import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, TextInput, FlatList, ScrollView, Dimensions, RefreshControl, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { startTransition, useEffect, useRef, useState, useContext, useCallback, useMemo } from 'react'
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

import TokenProductCard from '../components/TokenProductCard';
import SelectedProducts from '../components/SelectedProducts';
import { useNavigation } from '@react-navigation/native';
import { FONTS } from '../styles/typography'
import { getAccessToken, setTokens } from '../api/tokenService';
import useHomeData from '../hooks/useHomeData';
import { getCategoryProducts, postPopupSeenApi } from '../api/homeService';
import CONFIG from '../globals/config';
import { getDashboardDataApi, requestProductApi } from '../api/userService';
import { LoaderContext } from '../context/loaderContext';

import EmptySection from '../components/EmptySection';
import { AppContext } from '../context/appContext';
import LoginScreen from './LoginScreen';
import LocationModal from '../components/LocationModal';
import StatusModal from '../components/StatusModal';
import StoreUnavailable from '../components/StoreUnavailable';
import SeeAllButton from '../components/SeeAllButton';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import CoinCountSVG from '../components/CoinCountSVG';
import KapraSVG from '../components/KapraSVG';
import ShimmerPlaceholder from '../components/ShimmerPlaceholder';
import HomePopupModal from '../components/HomePopupModal';



const { width } = Dimensions.get("window");
const BANNER_HEIGHT = (283 / 390) * width;
// Top hero banner design size ~430x328 → use this to preserve aspect ratio
const TOP_BANNER_ASPECT_RATIO = 430 / 328;
const staticBanners = [
    require("../assets/images/image.png"),
    require("../assets/images/image.png"),
    require("../assets/images/image.png"),
];

const PlacementBannerCarousel = ({ banners, onBannerPress, style, fullWidth = false, showDots = true }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!banners || banners.length === 0) return null;

    const BANNER_WIDTH = fullWidth ? wp('100%') : wp('85%');
    const BANNER_SPACING = fullWidth ? 0 : wp('4%');
    const SNAP_INTERVAL = BANNER_WIDTH + BANNER_SPACING;
    // const bannerHeight = fullWidth ? BANNER_WIDTH / TOP_BANNER_ASPECT_RATIO : BANNER_HEIGHT;

    const onScroll = (e) => {
        const offsetX = e.nativeEvent.contentOffset.x;
        const slideIndex = Math.round(offsetX / SNAP_INTERVAL);
        if (slideIndex !== activeIndex) {
            setActiveIndex(slideIndex);
        }
    };

    if (banners.length === 1) {
        return (
            <View style={[!fullWidth && styles.carouselShadowWrapper, { width: BANNER_WIDTH, alignSelf: 'center' }, style]}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => onBannerPress(banners[0])}
                    style={fullWidth ? styles.topHomeBannerViewFull : styles.topHomeBannerView}
                >
                    <Image
                        source={banners[0].uri}
                        style={styles.topHomeBannerImage}
                    //  resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[style, !fullWidth && { overflow: 'visible' }]}>
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
                contentContainerStyle={fullWidth ? undefined : { paddingHorizontal: wp('4.6%'), paddingVertical: hp('1%') }}
                renderItem={({ item }) => (
                    <View
                        style={[
                            !fullWidth && styles.carouselShadowWrapper,
                            {
                                width: BANNER_WIDTH,
                                marginRight: BANNER_SPACING,
                                height: '100%',
                            },
                        ]}
                    >
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => onBannerPress(item)}
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: fullWidth ? 0 : wp('4%'),
                                overflow: 'hidden',
                            }}
                        >
                            <Image
                                source={item.uri}
                                style={styles.topHomeBannerImage}
                                resizeMode="stretch"
                            />
                        </TouchableOpacity>
                    </View>
                )}
            />
            {showDots && (
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
            )}
        </View>
    );
};

const ExploreCard = React.memo(({ item }) => {
    const navigation = useNavigation();
    const { addToCart, cartItems, updateCartItemQuantity, removeFromCart } = useCart();
    const [imageError, setImageError] = useState(false);
    const itemId = item.productId || item.id;
    const cartItem = cartItems.find(i => String(i.productId || i.id) === String(itemId));
    const quantity = cartItem?.quantity || cartItem?.addedQty || 0;
    const cartItemId = cartItem?.cartItemId || itemId;
    const name = item.prName || item.name || '';
    const price = item.specialPrice || item.price || '';
    const mrp = item.unitPrice || item.mrp || '';
    let offer = item.discountPercentage ? Math.round(item.discountPercentage) : item.offer || 0;
    if (!offer && mrp && price && mrp > price) offer = Math.round(((mrp - price) / mrp) * 100);
    const getImg = (img) => {
        if (!img || imageError) return require('../assets/images/categories/dfn.png');
        if (typeof img === 'string') {
            if (img.startsWith('http')) return { uri: img };
            return { uri: `${CONFIG.image_base_url}${img}` };
        }
        return img;
    };
    const imageSource = getImg(item.featuredImage || item.img || item.imageUrl);
    return (
        <TouchableOpacity
            style={styles.exploreCard}
            onPress={() => navigation.navigate('ProductDetailsScreen', { productId: itemId, product: item })}
            activeOpacity={0.85}
        >
            <View style={styles.exploreImageContainer}>
                {offer > 0 && (
                    <View style={styles.exploreOfferBadge}>
                        <Text style={styles.exploreOfferBadgeText}>{offer}% OFF</Text>
                    </View>
                )}
                <Image source={imageSource} style={[styles.exploreCardImage, ((item.stockQty === 0 || item.stockQty === '0') || item.isAvailable === false) && { opacity: 0.5 }]} resizeMode="contain" onError={() => setImageError(true)} />
                {((item.stockQty === 0 || item.stockQty === '0') || item.isAvailable === false) && (
                    <View style={styles.exploreOutOfStockOverlay}>
                        <Text style={styles.exploreOutOfStockText}>Out of Stock</Text>
                    </View>
                )}
            </View>
            <Text style={styles.exploreCardName} numberOfLines={3}>{name}</Text>
            <View style={styles.exploreCardBottom}>
                <View>
                    {mrp !== price && <Text style={styles.exploreMrpText}>MRP <Text style={{ textDecorationLine: 'line-through' }}>₹{mrp}</Text></Text>}
                    <Text style={styles.exploreCardPrice}>₹{price}</Text>
                </View>
                {quantity > 0 ? (
                    <View style={styles.exploreCounterContainer}>
                        <TouchableOpacity onPress={() => quantity === 1 ? removeFromCart(cartItemId) : updateCartItemQuantity(cartItemId, quantity - 1)}>
                            <Entypo name="minus" size={wp('3%')} color="#F04B1B" />
                        </TouchableOpacity>
                        <Text style={styles.exploreQuantityText}>{quantity}</Text>
                        <TouchableOpacity onPress={() => updateCartItemQuantity(cartItemId, quantity + 1)}>
                            <Entypo name="plus" size={wp('3%')} color="#F04B1B" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={[styles.exploreAddBtn, ((item.stockQty === 0 || item.stockQty === '0') || item.isAvailable === false) && { backgroundColor: '#CCCCCC' }]}
                        onPress={() => addToCart(item)}
                        disabled={(item.stockQty === 0 || item.stockQty === '0') || item.isAvailable === false}
                    >
                        <Entypo name="plus" color="#FFFFFF" size={wp('3.5%')} />
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
});

const HomeScreen = () => {

    const BANNER_WIDTH = wp("84.88%");
    const BANNER_SPACING = wp("4.6%");
    const SNAP_INTERVAL = BANNER_WIDTH + BANNER_SPACING;

    const scrollRef = useRef();
    const [activeIndex, setActiveIndex] = useState(0);
    const [accessToken, setAccessToken] = useState(null);
    const [isProfileLoaded, setIsProfileLoaded] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDiscoveryCategory, setSelectedDiscoveryCategory] = useState(null);
    const [discoveryProducts, setDiscoveryProducts] = useState([]);
    const [isDiscoveryLoading, setIsDiscoveryLoading] = useState(false);
    const { profile, loadProfile, loadProfileTwo, logout } = useContext(AppContext);


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
        topSideBySide,
        firstProductBlock,
        secondProductBlock,
        thirdProductBlock,
        firstProductBlockTitleImage,
        secondProductBlockTitleImage,
        bottomShowcaseBanner,
        bottomShowcaseProducts,
        categoryDiscovery,
        refreshHomeData,
        isHomeLoading,
        isStoreUnavailable,
        storeUnavailableData,
        topSectionBanner,
        topAnnouncementBanner,
        categoryDiscoveryBackgroundImage,
        thirdProductBlockTitleImage,
        popupData
    } = useHomeData();

    const [isHomePopupVisible, setIsHomePopupVisible] = useState(false);
    const [hasPopupBeenShown, setHasPopupBeenShown] = useState(false);

    useEffect(() => {
        if (popupData && popupData.showPopup === 1 && !hasPopupBeenShown) {
            setIsHomePopupVisible(true);
            setHasPopupBeenShown(true);
        }
    }, [popupData, hasPopupBeenShown]);

    const fruits = bottomBanner || [];

    // Normalized block data helpers (support both camelCase and PascalCase keys)
    const firstBlockItems = firstProductBlock?.Items || firstProductBlock?.items || [];
    const secondBlockItems = secondProductBlock?.Items || secondProductBlock?.items || [];
    const thirdBlockItems = thirdProductBlock?.Items || thirdProductBlock?.items || [];

    const shouldShowFirstBlock = !!firstProductBlock && firstBlockItems.length > 0;
    const shouldShowSecondBlock = !!secondProductBlock && secondBlockItems.length > 0;
    const shouldShowThirdBlock = !!thirdProductBlock && thirdBlockItems.length > 0;

    const discoveryCategories = categoryDiscovery?.Categories || categoryDiscovery?.categories || [];
    const normalizedDiscoveryProducts = discoveryProducts || [];
    const shouldShowCategoryDiscovery = !!categoryDiscovery && discoveryCategories.length > 0;

    const ProductBlockShimmer = () => (
        <View style={styles.headerBackgroundbg}>
            <View style={{ paddingHorizontal: wp('5%'), paddingTop: hp('2%') }}>
                <ShimmerPlaceholder style={{ width: wp('40%'), height: hp('3%'), borderRadius: 5, marginBottom: hp('2%') }} />
                <View style={{ flexDirection: 'row' }}>
                    {[1, 2, 3].map((_, i) => (
                        <View key={i} style={{ width: wp('35%'), height: hp('22%'), backgroundColor: '#F3F4F6', borderRadius: 20, marginRight: wp('4%'), overflow: 'hidden' }}>
                            <ShimmerPlaceholder style={{ width: '100%', height: '100%' }} />
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );

    const CategoryShimmer = () => (
        <View style={styles.categoryMainView}>
            <Text style={styles.categoryHeaderText}>Shop By Category</Text>
            <View style={styles.categoriesContainer}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => (
                    <View key={i} style={styles.item}>
                        <View style={styles.categoryItemContainer}>
                            <ShimmerPlaceholder style={{ width: wp("17%"), height: wp("17%"), borderRadius: 15 }} />
                        </View>
                        <ShimmerPlaceholder style={{ marginTop: hp('1%'), width: wp('15%'), height: hp('1.5%'), borderRadius: 4 }} />
                    </View>
                ))}
            </View>
        </View>
    );

    const SeasonalFruitsShimmer = () => (
        <View style={styles.fruitsContainer}>
            <View style={styles.fruitsHeaderView}>
                <ShimmerPlaceholder style={{ width: wp('40%'), height: hp('2.5%'), borderRadius: 5, marginLeft: wp('5%') }} />
            </View>
            <View style={{ flexDirection: 'row', marginLeft: wp('5%') }}>
                {[1, 2].map((_, i) => (
                    <ShimmerPlaceholder key={i} style={{ width: wp('74.88%'), height: hp('19.35%'), borderRadius: wp('4.65%'), marginRight: wp('5%') }} />
                ))}
            </View>
        </View>
    );

    const ExploreShimmer = () => (
        <View style={styles.headerBackgroundbg}>
            <View style={{ paddingHorizontal: wp('5%'), paddingTop: hp('3%'), paddingBottom: hp('3%') }}>
                <ShimmerPlaceholder style={{ width: wp('30%'), height: hp('3%'), borderRadius: 5, marginBottom: hp('2%') }} />
                <View style={{ flexDirection: 'row', marginBottom: hp('3%') }}>
                    {[1, 2, 4].map((_, i) => (
                        <View key={i} style={{ marginRight: wp('4%'), alignItems: 'center', width: wp('22.7%') }}>
                            <View style={styles.categoryItemContainer}>
                                <ShimmerPlaceholder style={{ width: wp('17%'), height: wp('17%'), borderRadius: 15 }} />
                            </View>
                            <ShimmerPlaceholder style={{ width: wp('15%'), height: hp('1.2%'), borderRadius: 3, marginTop: hp('1%') }} />
                        </View>
                    ))}
                </View>
                <View style={{ flexDirection: 'row' }}>
                    {[1, 2].map((_, i) => (
                        <ShimmerPlaceholder key={i} style={{ width: wp('35%'), height: hp('22%'), borderRadius: 20, marginRight: wp('4%') }} />
                    ))}
                </View>
            </View>
        </View>
    );

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await Promise.all([
                fetchDashboardData(),
                refreshHomeData()
            ]);
        } catch (error) {
            console.error('Refresh error:', error);
        } finally {
            setRefreshing(false);
        }
    }, [fetchDashboardData, refreshHomeData]);

    const [requestText, setRequestText] = useState('');
    const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
    const [statusModal, setStatusModal] = useState({
        visible: false,
        type: 'success',
        title: '',
        message: ''
    });
    const [showError, setShowError] = useState(false);

    const handleRequestProduct = async () => {
        if (!requestText.trim() || requestText.trim().length < 3) {
            setShowError(true);
            return;
        }
        setShowError(false);
        try {
            setIsSubmittingRequest(true);
            const response = await requestProductApi({ requestdetails: requestText });
            if (response && response.success) {
                setStatusModal({
                    visible: true,
                    type: 'orange',
                    title: 'Request Submitted',
                    message: 'Thank you! Your request has been submitted.'
                });
                setRequestText('');
            } else {
                setStatusModal({
                    visible: true,
                    type: 'error',
                    title: 'Request Failed',
                    message: response?.message || 'Failed to submit request. Please try again.'
                });
            }
        } catch (error) {
            console.error('Request product error:', error);
            setStatusModal({
                visible: true,
                type: 'error',
                title: 'Error',
                message: 'Something went wrong. Please try again.'
            });
        } finally {
            setIsSubmittingRequest(false);
        }
    };

    const navigation = useNavigation();
    const { showLoader } = useContext(LoaderContext);

    useEffect(() => {
        if (profile?.custId) {
            fetchDashboardData();
        }
        console.log('firstProductBlockTitleImage', firstProductBlockTitleImage);
    }, [fetchDashboardData, profile?.custId]);

    // Auto-refresh when location changes
    useEffect(() => {
        if (profile?.pincode) {
            onRefresh();
            // Reset discovery category to null to trigger auto-select of the first one in the new location
            setSelectedDiscoveryCategory(null);
        }
    }, [profile?.pincode]);

    const fetchDashboardData = useCallback(async () => {
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
    }, []);

    const GradientUserIcon = ({ size }) => {
        return (
            <LinearGradient
                colors={['#848484', '#606060']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: size / 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Image source={require('../assets/images/profile.png')} style={styles.profileIcon} resizeMode="contain" />
            </LinearGradient>
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
                <View style={styles.categoryItemContainer}>
                    {/* <LinearGradient
                    colors={['#FF9D61', '#FFFFFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientBox}
                > */}

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
                </View>
                {/* </LinearGradient> */}

                <Text style={styles.label} numberOfLines={2}>{item.catName || item.name}</Text>
            </TouchableOpacity>
        );
    };

    const FruitCard = ({ item, onPress }) => {
        const name = item.name || item.bannerName || "";
        const imageSource = item.uri || (item.imageUrl ? { uri: `${CONFIG.image_base_url}${item.imageUrl}` } : require("../assets/images/mango_banner.png"));
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
                <ImageBackground
                    source={imageSource}
                    style={styles.fruitsImageBackground}
                    imageStyle={{
                        borderRadius: wp("4.65%"),
                        resizeMode: "cover",
                    }}
                >
                    {/* <View style={styles.fruitsImageView}> */}
                    {/* <View>
                        <Text style={styles.fruitsNameText}>{name}</Text>
                    </View> */}
                    {/* </View> */}
                </ImageBackground>
            </TouchableOpacity>
        );
    };

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
        if (!banner) return;
        console.log('Banner Pressed:', banner);

        const linkType = (banner.linkType || banner.LinkType || '').toLowerCase();
        const linkValue = banner.linkValue || banner.LinkValue;
        const linkName = banner.linkName || banner.LinkName || banner.bannerName || banner.BannerName || banner.title || '';

        if (linkType === 'product') {
            navigation.navigate('ProductDetailsScreen', { productId: linkValue });
        } else if (linkType === 'category') {
            let actualCatName = '';
            if (categories && categories.length > 0) {
                const foundCat = categories.find(c => String(c.catId || c.id) === String(linkValue));
                if (foundCat) actualCatName = foundCat.catName || foundCat.name;
            }

            navigation.navigate('SearchScreen', {
                catId: linkValue,
                catName: actualCatName || 'Category'
            });
        }
    };

    const handleDiscoveryCategoryPress = async (category) => {
        setSelectedDiscoveryCategory(category);
        setIsDiscoveryLoading(true);
        try {
            const storedPincodeAreaId = await AsyncStorage.getItem('pincodeAreaId');
            const areaId = storedPincodeAreaId ? parseInt(storedPincodeAreaId) : (profile?.pincode || null);
            const response = await getCategoryProducts(category.catId, areaId);
            console.log('Category Selection API Response:', response);

            if (response && response.success && response.data) {
                const products = response.data.items || [];
                setDiscoveryProducts(products);
            } else {
                setDiscoveryProducts([]);
            }
        } catch (error) {
            console.error('Failed to fetch category products:', error);
            setDiscoveryProducts([]);
        } finally {
            setIsDiscoveryLoading(false);
        }
    };

    useEffect(() => {
        if (discoveryCategories && discoveryCategories.length > 0 && !selectedDiscoveryCategory) {
            const initialProducts = categoryDiscovery?.Products || categoryDiscovery?.products || [];
            if (initialProducts.length > 0) {
                // If the API already provided products for the first category, use them
                setSelectedDiscoveryCategory(discoveryCategories[0]);
                setDiscoveryProducts(initialProducts);
            } else {
                handleDiscoveryCategoryPress(discoveryCategories[0]);
            }
        }
    }, [categoryDiscovery]);


    return (
        <SafeAreaView
            edges={['top']}
            style={styles.mainContainer}>
            <HomePopupModal
                visible={isHomePopupVisible}
                onClose={() => {
                    setIsHomePopupVisible(false);
                    if (popupData?.popupId) {
                        postPopupSeenApi(popupData.popupId).catch(err => console.error('Popup seen API error:', err));
                    }
                }}
                imageUrl={popupData?.uri}
            />
            {modalVisible && (
                <LocationModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    // getAreasBySearch={getAreasBySearch}
                    onSelect={(item) => console.log(item)}
                />
            )}
            {/* Persistent Header Section (Fixed at Top) */}
            {topSectionBanner && topSectionBanner.length > 0 ? (
                <TouchableOpacity activeOpacity={0.9} onPress={() => handleBannerPress(topSectionBanner[0])}>
                    <ImageBackground
                        source={topSectionBanner[0].uri}
                        style={{
                            width: wp('100%'),
                            paddingTop: hp('0.1%'),
                            paddingBottom: hp('1%'),
                        }}
                        imageStyle={{
                            resizeMode: 'cover',
                        }}
                    >
                        <View style={styles.headerViewOne}>
                            <View>
                                <Text style={styles.timeText}>20  min</Text>
                                <TouchableOpacity
                                    style={styles.addressView}
                                    onPress={() => setModalVisible(true)}
                                >
                                    <Entypo name={"location-pin"} size={wp('4%')} color={"#FFFFFF"} style={{ marginRight: wp('1%') }} />
                                    <Text style={styles.addressText}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    >
                                        {profile?.pinAddress || 'Select Location'}
                                    </Text>
                                    <Entypo name={"chevron-right"} size={wp('3.6%')} color={"#FFFFFF"} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.headerRightWrapper}>
                                <TouchableOpacity onPress={() => navigation.navigate("BCoinScreen")} style={styles.bcoinContainer}>
                                    <CoinCountSVG width={wp('14%')} height={hp('5%')} style={styles.tokenSvg} />
                                    <Text style={styles.tokenText}>{dashboardData?.wallet?.bTokens || '0'} B</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('ProfileScreen', {
                                        type: "login"
                                    })
                                }} style={styles.profileIconMainView}>
                                    <View style={styles.profileIconView}>
                                        <GradientUserIcon size={wp('10%')} />
                                    </View>
                                    {profile?.isPrivileged && (
                                        <Image source={require('../assets/images/crown.png')} style={[styles.crownImage, { width: wp('5%'), height: hp('1.8%'), zIndex: 2, position: 'absolute', top: - hp('0.1%'), alignSelf: 'center' }]} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => !isStoreUnavailable && navigation.navigate('SearchScreen')}
                            style={[styles.searchContainer, isStoreUnavailable && { opacity: 0.6 }]}
                            activeOpacity={isStoreUnavailable ? 1 : 0.7}
                        >
                            <Feather name="search" color={"#f25000"} size={wp("6%")} />
                            <View style={styles.searchProductContainer}>
                                <Text style={styles.searchProductText}>Search product</Text>
                            </View>
                            <Image style={styles.clipboardIcon} source={require('../assets/images/clip_board.png')} />
                        </TouchableOpacity>
                    </ImageBackground>
                </TouchableOpacity>
            ) : (
                <View style={[styles.headerMainView, { paddingTop: hp('2%') }]}>
                    <View style={styles.headerViewOne}>
                        <View>
                            <Text style={styles.timeText}>20  min</Text>
                            <TouchableOpacity
                                style={styles.addressView}
                                onPress={() => setModalVisible(true)}
                            >
                                <Entypo name={"location-pin"} size={wp('4%')} color={"#FFFFFF"} style={{ marginRight: wp('1%') }} />
                                <Text style={styles.addressText}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {profile?.pinAddress || 'Select Location'}
                                </Text>
                                <Entypo name={"chevron-right"} size={wp('3.6%')} color={"#FFFFFF"} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.headerRightWrapper}>
                            <TouchableOpacity onPress={() => navigation.navigate("BCoinScreen")} style={styles.bcoinContainer}>
                                <CoinCountSVG width={wp('14%')} height={hp('5%')} style={styles.tokenSvg} />
                                <Text style={styles.tokenText}>{dashboardData?.wallet?.bTokens || '0'} B</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                navigation.navigate('ProfileScreen', {
                                    type: "login"
                                })
                            }} style={styles.profileIconMainView}>
                                <View style={styles.profileIconView}>
                                    <GradientUserIcon size={wp('10%')} />
                                </View>
                                {profile?.isPrivileged && (
                                    <Image source={require('../assets/images/crown.png')} style={[styles.crownImage, { width: wp('5%'), height: hp('1.8%'), zIndex: 2, position: 'absolute', top: - hp('0.1%'), alignSelf: 'center' }]} />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => !isStoreUnavailable && navigation.navigate('SearchScreen')}
                        style={[styles.searchContainer, isStoreUnavailable && { opacity: 0.6 }]}
                        activeOpacity={isStoreUnavailable ? 1 : 0.7}
                    >
                        <Feather name="search" color={"#f25000"} size={wp("6%")} />
                        <View style={styles.searchProductContainer}>
                            <Text style={styles.searchProductText}>Search product</Text>
                        </View>
                        <Image style={styles.clipboardIcon} source={require('../assets/images/clip_board.png')} />
                    </TouchableOpacity>
                </View>
            )}

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    paddingBottom: hp("0.7%"),
                    flexGrow: 1
                }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >

                {/* Main Top Banner Section (Below Header) */}
                {topBanner && topBanner.length > 0 && (
                    <ImageBackground
                        source={topBanner[0]?.uri}
                        style={styles.topShowcaseContainer}
                        imageStyle={{
                            width: '100%',
                            height: '100%',
                            resizeMode: 'cover',
                        }}
                    >
                        {topAnnouncementBanner && topAnnouncementBanner.length > 0 && (
                            <Image
                                source={topAnnouncementBanner[0].uri}
                                style={styles.topShowcaseMain}
                                resizeMode="cover"
                            />
                        )}

                        {topSideBySide.length > 0 && (
                            <View style={styles.topShowcaseRow}>
                                {topSideBySide.slice(0, 5).map((banner, index) => (
                                    <TouchableOpacity
                                        key={banner.bannerId || index}
                                        style={styles.topShowcaseCard}
                                        activeOpacity={0.85}
                                        onPress={() => handleBannerPress(banner)}
                                    >
                                        <Image
                                            source={banner.uri}
                                            style={styles.topShowcaseCardImage}
                                            resizeMode="contain"
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </ImageBackground>
                )}
                {!isStoreUnavailable && (
                    isHomeLoading && categories.length === 0 ? (
                        <CategoryShimmer />
                    ) : categories.length > 0 && (
                        <View style={styles.categoryMainView}>
                            <Text style={styles.categoryHeaderText}>Shop By Category</Text>
                            <View style={styles.categoriesContainer}>
                                {categories.map((item, index) => (
                                    <CategoryItem key={(item.catId || item.id || index).toString()} item={item} />
                                ))}
                            </View>
                        </View>
                    )
                )}
                {isStoreUnavailable ? (
                    <StoreUnavailable
                        image={storeUnavailableData.image}
                        text={storeUnavailableData.text}
                        onChangeLocation={() => setModalVisible(true)}
                    />
                ) : (
                    <>


                        {isHomeLoading && firstBlockItems.length === 0 ? (
                            <ProductBlockShimmer />
                        ) : shouldShowFirstBlock && (
                            <ImageBackground
                                source={require('../assets/images/homebg.png')}
                                style={styles.headerBackgroundbg}
                                imageStyle={styles.headerBackgroundbgImage}
                            >

                                {((firstProductBlockTitleImage && firstProductBlockTitleImage.uri) || (firstProductBlock?.Image || firstProductBlock?.image)) && (
                                    <Image
                                        source={firstProductBlockTitleImage ? firstProductBlockTitleImage.uri : { uri: `${CONFIG.image_base_url}${firstProductBlock?.Image || firstProductBlock?.image}` }}
                                        style={styles.starImage}
                                    />
                                )}
                                <Text style={styles.featuredProductsText}>
                                    {firstProductBlock?.Title || firstProductBlock?.title}
                                </Text>

                                <View style={styles.tokenTopDivider} />

                                <FlatList
                                    horizontal
                                    data={firstBlockItems}
                                    keyExtractor={(item, index) =>
                                        (item.productId || item.id || index).toString()
                                    }
                                    renderItem={({ item }) => (
                                        <TokenProductCard
                                            item={item}
                                            onPress={() =>
                                                navigation.navigate('ProductDetailsScreen', {
                                                    productId: item.productId || item.id,
                                                    product: item,
                                                })
                                            }
                                        />
                                    )}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{
                                        paddingLeft: wp('2%'),
                                        paddingRight: wp('1%'),
                                        paddingTop: hp('1%'),
                                    }}
                                />

                                {firstBlockItems.length > 3 && (
                                    <SeeAllButton
                                        onPress={() =>
                                            navigation.navigate('ProductListScreen', {
                                                title: firstProductBlock.Title || firstProductBlock.title,
                                                products: firstBlockItems,
                                            })
                                        }
                                        style={{
                                            alignSelf: 'center',
                                            //  marginTop: hp('1%'),
                                            // marginBottom: hp('2%'),
                                        }}
                                    />
                                )}

                            </ImageBackground>
                        )}

                        {midBanner && midBanner.length > 0 && (
                            <View style={{ marginVertical: hp('1%'), marginBottom: hp('2%') }}>
                                <PlacementBannerCarousel
                                    banners={midBanner}
                                    onBannerPress={handleBannerPress}
                                    style={{ height: hp('22%') }}
                                    showDots={false}
                                    fullWidth={false}
                                />
                            </View>
                        )}

                        {/* {midBannerBottom && midBannerBottom.length > 0 && (
                            <View style={{ marginVertical: hp('1%'), marginBottom: hp('2%') }}>
                                <PlacementBannerCarousel
                                    banners={midBannerBottom}
                                    onBannerPress={handleBannerPress}
                                    style={{ height: hp('22%') }}
                                    showDots={false}
                                    fullWidth={false}
                                />
                            </View>
                        )} */}

                        {isHomeLoading && secondBlockItems.length === 0 ? (
                            <ProductBlockShimmer />
                        ) : shouldShowSecondBlock && (
                            <>
                                <ImageBackground
                                    source={require('../assets/images/homebg.png')}
                                    style={styles.headerBackgroundbg}
                                    imageStyle={styles.headerBackgroundbgImage}
                                >

                                    {(secondProductBlock?.image !== null && secondProductBlock?.image !== undefined) && (
                                        <Image
                                            source={secondProductBlockTitleImage ? secondProductBlockTitleImage.uri : { uri: `${CONFIG.image_base_url}${secondProductBlock?.Image || secondProductBlock?.image}` }}
                                            style={styles.starImage}
                                        />
                                    )}

                                    <Text style={[styles.featuredProductsText, { marginTop: hp('2%') }]}>
                                        {secondProductBlock?.Title || secondProductBlock?.title}
                                    </Text>

                                    <View style={styles.tokenTopDivider} />

                                    <FlatList
                                        horizontal
                                        data={secondBlockItems}
                                        keyExtractor={(item, index) =>
                                            (item.productId || item.id || index).toString()
                                        }
                                        renderItem={({ item }) => (
                                            <TokenProductCard
                                                item={item}
                                                onPress={() =>
                                                    navigation.navigate('ProductDetailsScreen', {
                                                        productId: item.productId || item.id,
                                                        product: item,
                                                    })
                                                }
                                            />
                                        )}
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{
                                            paddingLeft: wp('5%'),
                                            paddingRight: wp('1%'),
                                            paddingTop: hp('1%'),
                                        }}
                                    />

                                    {secondBlockItems.length >= 3 && (
                                        <SeeAllButton
                                            onPress={() =>
                                                navigation.navigate('ProductListScreen', {
                                                    title: secondProductBlock.Title || secondProductBlock.title,
                                                    products: secondBlockItems,
                                                })
                                            }
                                            style={{
                                                alignSelf: 'center',
                                                marginTop: hp('1%'),
                                                // marginBottom: hp('2%'),
                                            }}
                                        />
                                    )}
                                </ImageBackground>
                                {/* <View style={{ height: hp('2%') }} /> */}
                            </>
                        )}

                        {/* {bottomBanner && bottomBanner.length > 0 && (
                            <PlacementBannerCarousel
                                banners={bottomBanner}
                                onBannerPress={handleBannerPress}
                                style={{ marginTop: hp('2%'), marginBottom: 10 }}
                                showDots={false}
                            />
                        )} */}

                        {isHomeLoading && fruits.length === 0 ? (
                            <SeasonalFruitsShimmer />
                        ) : fruits?.length > 0 && (
                            <View style={{ marginVertical: hp('0.5%'), marginBottom: hp('0.2%') }}>
                                <PlacementBannerCarousel
                                    banners={fruits}
                                    onBannerPress={handleBannerPress}
                                    style={{ height: hp('22%') }}
                                    showDots={false}
                                    fullWidth={false}
                                />
                            </View>
                            // <LinearGradient
                            //     colors={['rgba(255, 123, 58, 0.1)', 'rgba(255, 255, 255, 0.1)']}
                            //     start={{ x: 0.2, y: 0 }}
                            //     end={{ x: 0.8, y: 1 }}
                            //     locations={[0.036, 0.354]}
                            //     style={styles.fruitsGradientContainer}
                            // >
                            //     <View style={styles.fruitsContainer}>
                            //         <View style={styles.fruitsHeaderView}>
                            //             {/* <Text style={styles.fruitsHeaderText}>{dashboardData?.fruits?.title || "Seasonal Fruits"}</Text> */}
                            //             <TouchableOpacity style={styles.viewAllContainer}>
                            //                 {/* <Text style={styles.viewAllText}>View All</Text>
                            //                 <MaterialIcons name={"arrow-forward-ios"} color={"#FF7B3A"} size={wp("3.3%")} style={styles.viewAllRightArrowIcon} /> */}
                            //             </TouchableOpacity>
                            //         </View>
                            //         <FlatList
                            //             data={fruits}
                            //             keyExtractor={(item, index) => (item.id || item.bannerId || index).toString()}
                            //             horizontal={true}
                            //             renderItem={({ item }) => <FruitCard item={item} onPress={() => handleBannerPress(item)} />}
                            //             showsHorizontalScrollIndicator={false}
                            //             contentContainerStyle={{
                            //                 paddingHorizontal: wp("5%"),
                            //                 paddingBottom: hp('2%')
                            //             }}
                            //         />
                            //     </View>
                            // </LinearGradient>
                        )}
                        {isHomeLoading && thirdBlockItems.length === 0 ? (
                            <ProductBlockShimmer />
                        ) : shouldShowThirdBlock && (
                            <>
                                <ImageBackground
                                    source={require('../assets/images/combobg.png')}
                                    style={styles.headerBackgroundbg}
                                    imageStyle={styles.headerBackgroundbgImage}
                                >
                                    {/* Header Section with Image and Title */}
                                    <View style={styles.headerBackgroundbgContent}>
                                        {((thirdProductBlockTitleImage && thirdProductBlockTitleImage.uri) || (thirdProductBlock?.Image || thirdProductBlock?.image)) && (
                                            <Image
                                                source={thirdProductBlockTitleImage ? thirdProductBlockTitleImage.uri : { uri: `${CONFIG.image_base_url}${thirdProductBlock.Image || thirdProductBlock.image}` }}
                                                style={styles.starImage}
                                                resizeMode="contain"
                                            />
                                        )}

                                        <Text style={styles.featuredProductsText}>
                                            {thirdProductBlock.Title || thirdProductBlock.title}
                                        </Text>
                                        <View style={styles.tokenTopDivider} />

                                        <FlatList
                                            horizontal
                                            data={thirdBlockItems}
                                            keyExtractor={(item, index) => (item.productId || item.id || index).toString()}
                                            renderItem={({ item }) => (
                                                <TokenProductCard
                                                    item={item}
                                                    onPress={() => navigation.navigate('ProductDetailsScreen', { productId: item.productId || item.id, product: item })}
                                                />
                                            )}
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{
                                                paddingHorizontal: wp('4.6%'),
                                                paddingTop: hp('1%'),
                                                // paddingBottom: hp('2.5%'),
                                            }}
                                        />

                                        {thirdBlockItems.length > 3 && (
                                            <SeeAllButton
                                                onPress={() =>
                                                    navigation.navigate('ProductListScreen', {
                                                        title: thirdProductBlock.Title || thirdProductBlock.title,
                                                        products: thirdBlockItems,
                                                    })
                                                }
                                                style={{ alignSelf: 'center', }}
                                            />
                                        )}
                                    </View>
                                </ImageBackground>
                                <View style={{ height: hp('1%') }} />
                            </>
                        )}

                        {bottomShowcaseBanner && bottomShowcaseProducts.length > 0 && (
                            <>
                                <TouchableOpacity activeOpacity={0.9} onPress={() => handleBannerPress(bottomShowcaseBanner)}>
                                    <ImageBackground
                                        source={bottomShowcaseBanner.uri}
                                        style={styles.headerBackgroundbg2}
                                        imageStyle={styles.headerBackgroundbgImage2}
                                    >
                                        <View style={styles.headerBackgroundbgContent}>
                                            <FlatList
                                                horizontal
                                                data={bottomShowcaseProducts}
                                                keyExtractor={(item, index) => (item.bannerId || item.id || index).toString()}
                                                renderItem={({ item }) => (
                                                    <TouchableOpacity
                                                        onPress={() => handleBannerPress(item)}
                                                        style={{ marginRight: wp('1%') }}
                                                    >
                                                        <Image
                                                            source={item.uri}
                                                            style={{
                                                                width: wp('33%'),
                                                                height: wp('33%'),
                                                                borderRadius: wp('4%'),
                                                                marginTop: hp('14%'),
                                                            }}
                                                            resizeMode="contain"
                                                        />
                                                    </TouchableOpacity>
                                                )}
                                                showsHorizontalScrollIndicator={false}
                                                contentContainerStyle={{
                                                    paddingHorizontal: wp('3.6%'),
                                                    paddingTop: hp('2%'),
                                                    //paddingBottom: hp('2.5%'),

                                                }}
                                            />
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                                <View style={{ height: hp('2%') }} />
                            </>
                        )}

                        {isHomeLoading && !categoryDiscovery ? (
                            <ExploreShimmer />
                        ) : shouldShowCategoryDiscovery && (
                            <>
                                <ImageBackground
                                    source={categoryDiscoveryBackgroundImage ? categoryDiscoveryBackgroundImage.uri : require('../assets/images/homebg.png')}
                                    style={styles.headerBackgroundbg}
                                    imageStyle={styles.headerBackgroundbgImage}
                                >
                                    <View style={styles.headerBackgroundbgContent}>
                                        {discoveryCategories.length > 0 && (
                                            <>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: hp('2%'), paddingHorizontal: wp('5%') }}>
                                                    <Text style={[styles.featuredProductsText, { marginLeft: 0, marginVertical: 0, marginTop: 0 }]}>Explore</Text>
                                                </View>
                                                <ScrollView
                                                    horizontal
                                                    showsHorizontalScrollIndicator={false}
                                                    contentContainerStyle={{
                                                        paddingHorizontal: wp('4.6%'),
                                                        paddingTop: hp('1%'),
                                                        //  height: '100%'
                                                    }}
                                                >
                                                    {discoveryCategories.map((item, index) => (
                                                        <TouchableOpacity
                                                            key={(item.catId || item.id || index).toString()}
                                                            style={styles.item}
                                                            onPress={() => handleDiscoveryCategoryPress(item)}
                                                        >
                                                            <View style={[
                                                                styles.categoryItemContainer,
                                                                selectedDiscoveryCategory?.catId === item.catId && styles.categoryItemContainerActive
                                                            ]}>
                                                                <Image
                                                                    source={{ uri: `${CONFIG.image_base_url}${item.imageUrl}` }}
                                                                    style={styles.image}
                                                                    resizeMode="contain"
                                                                />
                                                            </View>

                                                            <Text style={[styles.label, selectedDiscoveryCategory?.catId === item.catId && { color: '#F25000', fontFamily: FONTS.poppins.semiBold }]} numberOfLines={2}>{item.catName || item.name}</Text>

                                                            {selectedDiscoveryCategory?.catId === item.catId && (
                                                                <View style={{
                                                                    height: 2,
                                                                    backgroundColor: '#F25000',
                                                                    width: '80%',
                                                                    marginTop: 4,
                                                                    borderRadius: 2
                                                                }} />
                                                            )}
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>

                                            </>
                                        )}

                                        {isDiscoveryLoading ? (
                                            <View style={{ height: hp('30%') }}>
                                                <ProductBlockShimmer />
                                            </View>
                                        ) : (
                                            discoveryProducts.length > 0 && (
                                                <View style={{}}>
                                                    <FlatList
                                                        horizontal
                                                        data={discoveryProducts}
                                                        keyExtractor={(item, index) => (item.productId || item.id || index).toString()}
                                                        renderItem={({ item }) => (
                                                            <TokenProductCard
                                                                item={item}
                                                                onPress={() => navigation.navigate('ProductDetailsScreen', { productId: item.productId || item.id, product: item })}
                                                            />
                                                        )}
                                                        showsHorizontalScrollIndicator={false}
                                                        contentContainerStyle={{
                                                            paddingHorizontal: wp('4.6%'),
                                                            // paddingTop: hp('1%'),
                                                            //  paddingBottom: hp('2.5%'),
                                                        }}
                                                    />
                                                </View>
                                            )
                                        )}
                                        {shouldShowCategoryDiscovery && selectedDiscoveryCategory && (
                                            <SeeAllButton
                                                onPress={() => navigation.navigate('SearchScreen', {
                                                    catId: selectedDiscoveryCategory.catId,
                                                    catName: selectedDiscoveryCategory.catName
                                                })}
                                                style={{
                                                    alignSelf: 'center',
                                                    // marginTop: hp('1%'),
                                                    //marginBottom: hp('2%'),
                                                }}
                                            />
                                        )}
                                    </View>
                                </ImageBackground>
                                <View style={{ height: hp('2%') }} />
                            </>
                        )}

                    </>
                )}

                {!isStoreUnavailable &&

                    <LinearGradient
                        colors={['#FFFFFF', '#F1F1F1']}
                        style={styles.footerBranding}
                    >
                        <KapraSVG
                            width={wp('85%')}
                            height={hp('15%')}
                            style={{
                                alignSelf: 'flex-start',
                                marginLeft: wp('-5%'),
                            }}
                        />
                        <View style={{ height: hp('10%') }} />
                    </LinearGradient>
                }
            </ScrollView>
            <View style={styles.floatingContainer}>
                {!isStoreUnavailable && <SelectedProducts />}
            </View>

            <StatusModal
                visible={statusModal.visible}
                type={statusModal.type}
                title={statusModal.title}
                message={statusModal.message}
                onClose={() => setStatusModal({ ...statusModal, visible: false })}
            />
        </SafeAreaView >
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerMainView: {
        backgroundColor: "#F25000",
        paddingBottom: hp("1.4%")
    },
    topLeftCurve: {
        // position: 'absolute',
        top: 0,
        left: 0,
        width: wp('100%'),
        height: wp('50%'),
        resizeMode: 'contain',
    },
    headerBackground: {
        width: wp('100%'),
        height: hp('38%'),
        //  bottom:10
    },
    headerBackground2: {
        width: wp('100%'),
        height: hp('22%'),
        alignSelf: 'center',
        resizeMode: 'cover',
    },
    headerBackgroundbg: {
        width: wp('100%'),
        marginTop: hp('1%'),
        paddingBottom: hp('3%'),
        borderRadius: wp('8%'),
        overflow: 'hidden',
        alignSelf: 'center',
    },
    headerBackgroundbgImage: {
        resizeMode: 'cover',
        borderRadius: wp('8%'),
    },
    topShowcaseContainer: {
        width: wp('100%'),
        aspectRatio: 0.8,
    },
    headerBackgroundbg2: {
        width: wp('98%'),
        height: hp('32%'),   // important
        alignSelf: 'center',
        borderTopLeftRadius: wp('8%'),
        borderTopRightRadius: wp('8%'),
        overflow: 'hidden',
    },

    headerBackgroundbgImage2: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderTopLeftRadius: wp('8%'),
        borderTopRightRadius: wp('8%'),
    },

    headerBackgroundbgContent: {
        // paddingTop: hp('2%'),
        //  paddingBottom: hp('2%'),
    },
    discoveryCategoryItem: {
        alignItems: 'center',
        marginRight: wp('4%'),
        paddingVertical: hp('0.5%'),
        paddingHorizontal: wp('1%'),
        borderRadius: wp('3%'),
        borderWidth: 1,
        borderColor: 'transparent',
    },
    discoveryCategoryItemActive: {
        borderColor: '#FF6B35',
        backgroundColor: 'rgba(255, 107, 53, 0.1)',
    },
    discoveryCategoryImage: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: wp('6%'),
    },
    profileIcon: {
        width: wp('7%'),
        height: wp('7%'),
        borderRadius: wp('3.5%'),
        position: 'absolute',
        top: 15,
        left: 5,
        alignSelf: 'center'
    },
    discoveryCategoryText: {
        fontSize: wp('2.8%'),
        fontFamily: FONTS.medium,
        color: '#333',
        textAlign: 'center',
        marginTop: hp('0.2%'),
        width: wp('15%'),
    },
    discoveryCategoryTextActive: {
        color: '#FF6B35',
        fontFamily: FONTS.bold,
    },
    headerImageStyle: {
        resizeMode: 'cover',
        borderBottomLeftRadius: wp('10%'),
        borderBottomRightRadius: wp('10%'),
    },
    headerViewOne: {
        flexDirection: "row",
        marginTop: hp('0.2%'),
        marginHorizontal: wp('6.9%'),
        justifyContent: "space-between",
        alignItems: 'center',
    },
    timeText: {
        fontFamily: FONTS.poppins.extraBold,
        color: "#FFFFFF",
        fontSize: wp('5.5%'),
        top: Platform.OS !== 'ios' ? hp('2%') : hp('0%'),
    },
    addressView: {
        flexDirection: "row",
        alignItems: 'center',
        top: Platform.OS === 'ios' ? hp('0.5%') : hp('1%'),
        left: Platform.OS === 'ios' ? wp('0%') : -wp('0.5%'),
    },
    addressText: {
        color: "#FFFFFF",
        fontSize: wp('3%'),
        fontFamily: FONTS.poppins.medium,
        maxWidth: wp('53%'),
        // top: Platform.OS === 'ios' ? hp('1%') : 0,
        //  bottom: hp('1%'),
    },
    bcoinContainer: {
        alignItems: 'center',
        width: wp('20%'),
        justifyContent: 'center',
        top: Platform.OS === 'ios' ? hp('1%') : hp('2%')
    },
    headerRightWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('1%'),
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
        // marginTop: -hp('1%'),

        shadowColor: '#744700',
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: -1 },
        elevation: 3,
    },
    tokenContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('2%'),
        position: 'relative',
        top: hp('1%')
    },
    tokenSvg: {
    },
    tokenText: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? hp('1%') : hp('0.5%'),
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('2.8%'),
        color: '#000000',
        textAlign: 'center',
    },
    bcoinText: {
        color: '#000000',
        fontSize: wp('3%'),
        fontFamily: FONTS.poppins.extraBold,
        fontWeight: 'bold',
    },
    bcoinTextTwo: {
        color: '#FFBA33',
        fontSize: wp('3%'),
        fontFamily: FONTS.poppins.extraBold,
        fontWeight: 'bold',
    },
    profileIconView: {
        width: wp('9.8%'),
        height: wp('9.8%'),
        borderRadius: wp('4.9%'),
        // borderColor: "#198FFF",
        // borderWidth: wp("0.5%"),
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        // top: hp("-1.0%")
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
        marginTop: hp('2%'),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: wp('5.5%'),
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
        marginBottom: hp('1%'),
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        // marginTop: hp('0.5%'),
    },
    item: {
        width: wp('22%'),
        alignItems: 'center',
        marginBottom: hp('.5%'),
        //  backgroundColor: 'white',

    },
    gradientBox: {
        // width: wp('18%'),
        height: wp('18%'),
        borderRadius: wp('3%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryItemContainer: {
        borderColor: '#f25000',
        borderRadius: 15,
        borderWidth: 0.3,
        // opacity:0.8
    },
    categoryItemContainerActive: {
        backgroundColor: '#FFE9E0',
        borderColor: '#F25000',
        borderWidth: 0.6,
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
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#D2B200',
        borderRadius: wp('5%'),
        top: Platform.OS === 'ios' ? hp('0.5%') : hp('1.3%')
    },
    crownImage: {
        position: 'absolute',
        top: -hp('1.5%'),
        zIndex: 1,
        left: wp('2.1%'),
        alignSelf: 'center',
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
        // backgroundColor: '#FFFFFF',
        marginHorizontal: wp("4.6%"),
        marginTop: hp("1.5%"),
        // backgroundColor: 'red'
    },
    categoryHeaderText: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp("4.2%"),
        marginBottom: hp("1%")
    },
    productsMainContainer: {
        marginTop: hp("0.2%"),
    },
    featuredProductsText: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp("4.5%"),
        color: "#1E1E1E",
        marginLeft: wp("8%"),
        marginLeft: wp("5%"),
        marginTop: hp("1%"),
        marginBottom: hp("1%"),

        //  marginVertical: hp("3%"),
    },
    tokenTopDivider: {
        marginTop: hp('1%'),
        marginHorizontal: wp('5%'),
        height: 1,
        backgroundColor: '#D6D6D6',
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
        marginTop: hp("1%"),
        // paddingLeft: wp("4.6%"),
        height: hp("29.5%"),
        // width: wp("100%"),
    },
    bannerContainer: {
        //   marginTop: hp("0.5%"),
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
        marginTop: hp('1%'),
    },
    offerGradient: {
        width: wp("96%"),
        height: hp("45%"),
        marginTop: hp('1%'),
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
        marginTop: hp("2%"),
        // backgroundColor: "red"
    },
    starImage: {
        width: wp("100%"),
        height: hp("13%"),
        resizeMode: "contain",
        //   /  alignSelf: "center",
        //  marginBottom: hp('1%'),
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
        marginTop: hp("1%"),
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
    sendButton: {
        backgroundColor: '#F25000',
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('0.5%'),
        borderRadius: 15,
        marginRight: wp('1%'),
        height: hp('4%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.2%'),
    },
    sendImage: {
        width: wp('18.6%'),
        height: hp('4.3%'),
        resizeMode: 'contain'
    },
    kapraLogo: {
        width: wp("64.65%"),
        height: hp("10.73%"),
        marginTop: hp("1%"),
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
        marginTop: hp("1%"),
        marginBottom: hp("1%")
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
        width: wp("90%"),
        height: hp("19.35%"),
        flexDirection: "row",
        borderRadius: wp("2.6%"),
        marginRight: wp("4%"),
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.18,
        shadowRadius: 4.5,
        elevation: 6,
        backgroundColor: '#FFFFFF',
        borderRadius: wp('4%'), // Same as carousel BANNER_SPACING
        //   backgroundColor: '#fff',
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
        // marginBottom: hp("4.5%")
        paddingVertical: hp('1%'),
    },
    fruitsGradientContainer: {
        width: wp('100%'),
        marginTop: hp('1%'),
        marginBottom: hp('1%'),
        borderTopLeftRadius: wp('6%'),
        borderTopRightRadius: wp('6%'),
        overflow: 'visible',
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
        width: '100%',
        height: hp('20%'),
        alignSelf: 'center',
        borderRadius: wp('4%'),
        overflow: 'hidden',
    },
    carouselShadowWrapper: {
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.18,
        shadowRadius: 4.5,
        elevation: 6,
        backgroundColor: '#FFFFFF',
        borderRadius: wp('4%'),
    },
    topHomeBannerViewFull: {
        width: wp('100%'),
        height: hp('67%'),
        //overflow: 'hidden',
    },
    topHomeBannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    errorText: {
        color: '#FF0000',
        fontSize: wp('3%'),
        fontFamily: FONTS.poppins.regular,
        marginTop: hp('1%'),
        marginBottom: hp('1%'),
        textAlign: 'left'
    },
    // ===== FEE CARDS SECTION =====
    feeSection: {
        marginHorizontal: wp('4.6%'),
        marginTop: hp('2%'),
    },
    topShowcaseWrapper: {
        marginTop: hp('1.5%'),
        marginHorizontal: wp('4.6%'),
    },
    topShowcaseMain: {
        width: '91%',
        aspectRatio: 5,
        borderRadius: wp('4.65%'),
        top: '52.5%',
        position: 'absolute',
        alignSelf: 'center',
        // marginBottom: hp('1.2%'),
    },
    topShowcaseRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        bottom: '-7%',
        position: 'absolute',
        width: '100%',
        // backgroundColor: 'red'
    },
    topShowcaseCard: {
        //flex: 0.7,
        // flex: 1,
        height: wp('52%'),
        width: wp('48%'),
        top: Platform.OS === 'ios' ? '10%' : '7%',
        borderRadius: wp('4%'),
        overflow: 'hidden',
        marginHorizontal: Platform.OS == 'ios' ? -wp('0.5%') : -wp('1%'),
        // marginHorizontal: -wp('5.5%'),
        //  backgroundColor: 'red'
        //    / marginRight: wp('2%'),
    },
    topShowcaseCardImage: {
        width: '100%',
        height: '65%',
    },
    feeImagesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp('1.5%'),
    },
    feeProductImage: {
        width: wp('43%'),
        height: hp('10%'),
        borderRadius: wp('3%'),
        backgroundColor: '#F9F1E7',
    },
    feeInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8F0',
        borderRadius: wp('3%'),
        paddingVertical: hp('1.2%'),
        paddingHorizontal: wp('3%'),
    },
    amboFeeBadge: {
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('0.8%'),
        borderRadius: wp('2.5%'),
        alignItems: 'center',
        marginRight: wp('3%'),
    },
    amboFeeTitle: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('3.5%'),
        color: '#FFFFFF',
    },
    amboFeeSubtitle: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('2.8%'),
        color: '#FFFFFF',
        marginTop: -2,
    },
    feeItemsContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    feeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('0.3%'),
    },
    feeItemText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('2.6%'),
        color: '#333333',
        marginLeft: wp('0.5%'),
    },
    // ===== TAG PILLS =====
    tagPillsRow: {
        flexDirection: 'row',
        marginHorizontal: wp('4.6%'),
        marginTop: hp('2%'),
        gap: wp('3%'),
    },
    tagPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('1.2%'),
        borderRadius: wp('6%'),
        gap: wp('2%'),
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    tagPillText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.5%'),
        color: '#FFFFFF',
    },
    // ===== SECTION HEADERS =====
    sectionContainer: {
        marginTop: hp('2.5%'),
    },
    seasonalCardWrapper: {
        marginTop: hp('2.5%'),
        marginHorizontal: wp('4.6%'),
        borderTopLeftRadius: wp('10%'),
        borderTopRightRadius: wp('10%'),
        overflow: 'hidden',
    },
    seasonalCardGradient: {
        borderTopLeftRadius: wp('10%'),
        borderTopRightRadius: wp('10%'),
    },
    seasonalCardInner: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: wp('10%'),
        borderTopRightRadius: wp('10%'),
        paddingTop: hp('2%'),
        paddingBottom: hp('2%'),
    },
    seasonalTitle: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('4.2%'),
        color: '#222222',
    },
    seasonalSeeAllRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    seasonalSeeAllText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.5%'),
        color: '#000000',
        marginRight: wp('1%'),
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: wp('4.6%'),
        marginBottom: hp('1%'),
    },
    sectionHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('3%'),
    },
    sectionTitle: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('4.5%'),
        color: '#1A1A1A',
    },
    sectionPriceHighlight: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4.5%'),
        color: '#0CA201',
    },
    seeAllBtnCompact: {
        height: 36,
        borderRadius: 18,
        paddingHorizontal: 14,
    },
    wrapper: {
        backgroundColor: '#F3EDE6',
        paddingVertical: 20,
        paddingLeft: 16,
        borderRadius: 28,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 20,
        marginBottom: 15,
    },

    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E1E1E',
    },

    seeAll: {
        fontSize: 14,
        fontWeight: '500',
    },

    card: {
        width: 300,
        height: 170,
        borderRadius: 24,
        overflow: 'hidden',
        marginRight: 15,
    },
    // ===== EXPLORE GRID =====
    exploreGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: wp('4.6%'),
    },
    exploreCard: {
        width: wp('43%'),
        backgroundColor: '#FFFFFF',
        borderRadius: wp('4%'),
        padding: wp('2.5%'),
        marginBottom: hp('1.5%'),
        shadowColor: '#000000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 3,
    },
    exploreImageContainer: {
        width: '100%',
        height: wp('30%'),
        backgroundColor: '#F5FFF5',
        borderRadius: wp('3%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp('0.8%'),
        overflow: 'hidden',
    },
    exploreOfferBadge: {
        position: 'absolute',
        top: wp('1.5%'),
        left: wp('1.5%'),
        backgroundColor: '#F04B1B',
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('0.2%'),
        borderRadius: wp('1.5%'),
        zIndex: 1,
    },
    exploreOfferBadgeText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('2.2%'),
        color: '#FFFFFF',
    },
    exploreCardImage: {
        width: wp('25%'),
        height: wp('25%'),
    },
    exploreOutOfStockOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: 12,
    },
    exploreOutOfStockText: {
        color: '#FF0000',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('2.5%'),
        transform: [{ rotate: '-15deg' }],
        borderWidth: 1,
        borderColor: '#FF0000',
        paddingHorizontal: 3,
        paddingVertical: 1,
        borderRadius: 4,
    },
    exploreCardName: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('3%'),
        color: '#1A1A1A',
        marginBottom: hp('0.3%'),
    },
    exploreMrpText: {
        fontFamily: FONTS.poppins.light,
        fontSize: wp('2.3%'),
        color: '#999999',
    },
    exploreCardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp('0.3%'),
    },
    exploreCardPrice: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.5%'),
        color: '#0CA201',
    },
    exploreAddBtn: {
        backgroundColor: '#F04B1B',
        padding: wp('1.2%'),
        borderRadius: 100,
    },
    exploreCounterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.7,
        borderColor: '#F04B1B',
        borderRadius: 7,
        paddingHorizontal: wp('1%'),
        paddingVertical: hp('0.1%'),
    },
    exploreQuantityText: {
        color: '#F04B1B',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('2.8%'),
        marginHorizontal: wp('1.5%'),
        textAlign: 'center',
    },
    // ===== FRESHNESS SECTION =====
    freshnessSection: {
        marginTop: hp('2.5%'),
        marginHorizontal: wp('4.6%'),
    },
    freshnessGradient: {
        // width: '100%',
        paddingVertical: hp('4%'),
        borderRadius: wp('5%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    freshnessTitle: {
        fontFamily: FONTS.outfit.bold,
        fontSize: wp('6%'),
        color: '#2E7D32',
        textAlign: 'center',
        lineHeight: wp('8%'),
    },
    // ===== BOTTOM BRANDING =====
    bottomBrandingSection: {
        alignItems: 'center',
        marginTop: hp('3%'),
        marginBottom: hp('1%'),
        paddingVertical: hp('2%'),
    },
    kapraLogoBottom: {
        width: wp('50%'),
        height: hp('8%'),
        resizeMode: 'contain',
        marginBottom: hp('1%'),
    },
    footerBranding: {
        alignItems: 'center',
        paddingVertical: hp('2%'),
        marginBottom: 0,
    },
})
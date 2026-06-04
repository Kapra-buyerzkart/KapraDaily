import {useState, useRef, useContext, useCallback, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Dimensions, RefreshControl} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { FONTS } from '../styles/typography';
import { AppContext } from '../context/appContext';
import useHomeData from '../hooks/useHomeData';
import CONFIG from '../globals/config';
const { width } = Dimensions.get('window');

const KshopeScreen = () => {
    const navigation = useNavigation();
    const { profile } = useContext(AppContext);
    const {
        categories,
        topBanner,
        midBanner,
        bottomBanner,
        topSideBySide,
        firstProductBlock,
        secondProductBlock,
        refreshHomeData,
        isHomeLoading,
        banners,
    } = useHomeData();

    const [refreshing, setRefreshing] = useState(false);
    const [bannerIndex, setBannerIndex] = useState(0);
    const bannerRef = useRef(null);

    const userName = profile?.custName || profile?.name || profile?.firstName || 'Guest';

    // Auto-scroll banners
    useEffect(() => {
        if (!topBanner || topBanner.length <= 1) return;
        const timer = setInterval(() => {
            setBannerIndex(prev => {
                const next = (prev + 1) % topBanner.length;
                bannerRef.current?.scrollToIndex({ index: next, animated: true });
                return next;
            });
        }, 4000);
        return () => clearInterval(timer);
    }, [topBanner]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await refreshHomeData();
        } catch (e) {
} finally {
            setRefreshing(false);
        }
    }, [refreshHomeData]);

    const getImageSource = (imgPath) => {
        if (!imgPath) return null;
        if (typeof imgPath === 'object' && imgPath.uri) return imgPath;
        if (typeof imgPath === 'string') {
            if (imgPath.startsWith('http')) return { uri: imgPath };
            return { uri: `${CONFIG.image_base_url}${imgPath}` };
        }
        return imgPath;
    };

    const handleBannerPress = (banner) => {
        if (!banner) return;
        const linkType = (banner.linkType || banner.LinkType || '').toLowerCase();
        const linkValue = banner.linkValue || banner.LinkValue;
        if (linkType === 'product') {
            navigation.navigate('ProductDetailsScreen', { productId: linkValue });
        } else if (linkType === 'category') {
            navigation.navigate('SearchScreen', { catId: linkValue, catName: 'Category' });
        }
    };

    const handleCategoryPress = (cat) => {
        navigation.navigate('SearchScreen', {
            catId: cat.catId || cat.id,
            catName: cat.catName || cat.name,
        });
    };

    // Prepare data
    const displayCategories = (categories || []).slice(0, 8);
    const accessorizeCategories = (categories || []).slice(0, 4);
    const topBrands = (banners || []).filter(
        b => (b.placementKey || b.PlacementKey) === 'app_top_brands'
    );
    const midBanners = midBanner || [];

    const renderBannerItem = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleBannerPress(item)}
            style={styles.bannerSlide}
        >
            <Image
                source={item.uri || getImageSource(item.imageUrl)}
                style={styles.bannerImage}
                resizeMode="cover"
            />
        </TouchableOpacity>
    );

    const renderCategoryItem = ({ item }) => {
        const imgSrc = item.image || (item.imageUrl ? getImageSource(item.imageUrl) : require('../assets/images/categories/dfn.png'));
        return (
            <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategoryPress(item)}>
                <View style={styles.categoryCircle}>
                    <Image source={imgSrc} style={styles.categoryImage} resizeMode="contain" />
                </View>
                <Text style={styles.categoryLabel} numberOfLines={2}>{item.catName || item.name}</Text>
            </TouchableOpacity>
        );
    };

    const renderAccessorizeItem = ({ item }) => {
        const imgSrc = item.image || (item.imageUrl ? getImageSource(item.imageUrl) : require('../assets/images/categories/dfn.png'));
        return (
            <TouchableOpacity style={styles.accessorizeCard} onPress={() => handleCategoryPress(item)}>
                <Image source={imgSrc} style={styles.accessorizeImage} resizeMode="cover" />
                <Text style={styles.accessorizeLabel} numberOfLines={1}>{item.catName || item.name}</Text>
            </TouchableOpacity>
        );
    };

    const renderMidBanner = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleBannerPress(item)}
            style={styles.midBannerCard}
        >
            <Image
                source={item.uri || getImageSource(item.imageUrl)}
                style={styles.midBannerImage}
                resizeMode="cover"
            />
        </TouchableOpacity>
    );

    const renderBrandItem = ({ item }) => (
        <TouchableOpacity style={styles.brandCard} onPress={() => handleBannerPress(item)}>
            <Image
                source={item.uri || getImageSource(item.imageUrl)}
                style={styles.brandImage}
                resizeMode="contain"
            />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* HEADER */}
            <LinearGradient
                colors={['#00BCD4', '#0097A7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.headerRow}>
                    <View style={styles.headerLeft}>
                        <View style={styles.avatarCircle}>
                            <Ionicons name="person-outline" size={wp('5%')} color="#00BCD4" />
                        </View>
                        <Text style={styles.userName}>{userName}</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity onPress={() => navigation.navigate('CartScreen')} style={styles.headerIcon}>
                            <Ionicons name="bag-outline" size={wp('5.5%')} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerIcon}>
                            <Ionicons name="notifications-outline" size={wp('5.5%')} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* SEARCH BAR */}
                <TouchableOpacity
                    style={styles.searchBar}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('SearchScreen', {})}
                >
                    <Feather name="search" size={wp('4.5%')} color="#999999" />
                    <Text style={styles.searchPlaceholder}>Search product</Text>
                    <Ionicons name="mic-outline" size={wp('5%')} color="#333333" />
                </TouchableOpacity>
            </LinearGradient>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00BCD4" />
                }
                contentContainerStyle={{ paddingBottom: hp('12%') }}
            >
                {/* FLASH SALE BANNER CAROUSEL */}
                {topBanner && topBanner.length > 0 && (
                    <View style={styles.bannerContainer}>
                        <FlatList
                            ref={bannerRef}
                            data={topBanner}
                            renderItem={renderBannerItem}
                            keyExtractor={(_, i) => i.toString()}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onMomentumScrollEnd={(e) => {
                                const idx = Math.round(e.nativeEvent.contentOffset.x / width);
                                setBannerIndex(idx);
                            }}
                        />
                        {topBanner.length > 1 && (
                            <View style={styles.dotsRow}>
                                {topBanner.map((_, i) => (
                                    <View
                                        key={i}
                                        style={[
                                            styles.dot,
                                            bannerIndex === i && styles.activeDot,
                                        ]}
                                    />
                                ))}
                            </View>
                        )}
                    </View>
                )}

                {/* OUR CATEGORIES */}
                {displayCategories.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>OUR CATEGORIES</Text>
                        <FlatList
                            data={displayCategories}
                            renderItem={renderCategoryItem}
                            keyExtractor={(item, i) => (item.catId || i).toString()}
                            numColumns={4}
                            scrollEnabled={false}
                            contentContainerStyle={styles.categoriesGrid}
                        />
                    </View>
                )}

                {/* ACCESSORIZE */}
                {accessorizeCategories.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>ACCESSORIZE</Text>
                        <FlatList
                            data={accessorizeCategories}
                            renderItem={renderAccessorizeItem}
                            keyExtractor={(item, i) => `acc_${item.catId || i}`}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: wp('4%') }}
                        />
                    </View>
                )}

                {/* MID BANNERS (Gents/Ladies footware style) */}
                {midBanners.length > 0 && (
                    <View style={styles.section}>
                        <FlatList
                            data={midBanners}
                            renderItem={renderMidBanner}
                            keyExtractor={(_, i) => `mid_${i}`}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={wp('48%')}
                            decelerationRate="fast"
                            contentContainerStyle={{ paddingHorizontal: wp('4%') }}
                        />
                    </View>
                )}

                {/* SIDE BY SIDE BANNERS (fallback if midBanners empty) */}
                {midBanners.length === 0 && topSideBySide && topSideBySide.length > 0 && (
                    <View style={styles.section}>
                        <FlatList
                            data={topSideBySide}
                            renderItem={renderMidBanner}
                            keyExtractor={(_, i) => `side_${i}`}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={wp('48%')}
                            decelerationRate="fast"
                            contentContainerStyle={{ paddingHorizontal: wp('4%') }}
                        />
                    </View>
                )}

                {/* TOP BRANDS */}
                {topBrands.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>TOP BRANDS</Text>
                        <FlatList
                            data={topBrands}
                            renderItem={renderBrandItem}
                            keyExtractor={(_, i) => `brand_${i}`}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: wp('4%') }}
                        />
                    </View>
                )}

                {/* BOTTOM BANNERS */}
                {bottomBanner && bottomBanner.length > 0 && (
                    <View style={styles.section}>
                        <FlatList
                            data={bottomBanner}
                            renderItem={renderMidBanner}
                            keyExtractor={(_, i) => `bottom_${i}`}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={wp('48%')}
                            decelerationRate="fast"
                            contentContainerStyle={{ paddingHorizontal: wp('4%') }}
                        />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    // Header
    header: {
        paddingHorizontal: wp('4%'),
        paddingTop: hp('1%'),
        paddingBottom: hp('1.5%'),
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('1.2%'),
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarCircle: {
        width: wp('9%'),
        height: wp('9%'),
        borderRadius: wp('4.5%'),
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('2.5%'),
    },
    userName: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%'),
        color: '#FFFFFF',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('4%'),
    },
    headerIcon: {
        padding: wp('1%'),
    },
    // Search
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: wp('6%'),
        paddingHorizontal: wp('4%'),
        height: hp('5%'),
    },
    searchPlaceholder: {
        flex: 1,
        marginLeft: wp('2%'),
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.5%'),
        color: '#999999',
    },
    // Banners
    bannerContainer: {
        marginTop: hp('0.5%'),
    },
    bannerSlide: {
        width: width,
        height: hp('22%'),
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    dotsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('1%'),
        marginBottom: hp('0.5%'),
    },
    dot: {
        width: wp('2%'),
        height: wp('2%'),
        borderRadius: wp('1%'),
        backgroundColor: '#CCCCCC',
        marginHorizontal: wp('0.8%'),
    },
    activeDot: {
        backgroundColor: '#00BCD4',
        width: wp('2.5%'),
        height: wp('2.5%'),
    },
    // Sections
    section: {
        marginTop: hp('2%'),
    },
    sectionTitle: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%'),
        color: '#222222',
        textAlign: 'center',
        marginBottom: hp('1.5%'),
        letterSpacing: 1.5,
    },
    // Categories
    categoriesGrid: {
        paddingHorizontal: wp('4%'),
    },
    categoryItem: {
        width: (width - wp('8%')) / 4,
        alignItems: 'center',
        marginBottom: hp('2%'),
    },
    categoryCircle: {
        width: wp('16%'),
        height: wp('16%'),
        borderRadius: wp('8%'),
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    categoryImage: {
        width: wp('11%'),
        height: wp('11%'),
    },
    categoryLabel: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('2.8%'),
        color: '#444444',
        textAlign: 'center',
        marginTop: hp('0.5%'),
        width: wp('18%'),
    },
    // Accessorize
    accessorizeCard: {
        width: wp('20%'),
        alignItems: 'center',
        marginRight: wp('3%'),
    },
    accessorizeImage: {
        width: wp('18%'),
        height: wp('18%'),
        borderRadius: wp('3%'),
        backgroundColor: '#F0F0F0',
    },
    accessorizeLabel: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('2.8%'),
        color: '#444444',
        textAlign: 'center',
        marginTop: hp('0.5%'),
    },
    // Mid Banners
    midBannerCard: {
        width: wp('45%'),
        height: hp('18%'),
        borderRadius: wp('3%'),
        overflow: 'hidden',
        marginRight: wp('3%'),
    },
    midBannerImage: {
        width: '100%',
        height: '100%',
    },
    // Brands
    brandCard: {
        width: wp('20%'),
        height: wp('12%'),
        borderRadius: wp('2%'),
        backgroundColor: '#F9F9F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('3%'),
        borderWidth: 1,
        borderColor: '#F0F0F0',
        paddingHorizontal: wp('1%'),
    },
    brandImage: {
        width: wp('16%'),
        height: wp('8%'),
    },
});

export default KshopeScreen;
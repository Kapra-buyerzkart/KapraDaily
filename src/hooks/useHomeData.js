import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHomepageData } from '../api/homeService';
import CONFIG from '../globals/config';
import { useWishlist } from '../context/WishlistContext';
import { LoaderContext } from '../context/loaderContext';
import { AppContext } from '../context/appContext';
import { getGeneralSettingsApi } from '../api/userService';

const useHomeData = () => {
    const [bestOffers, setBestOffers] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [halfPriceStore, setHalfPriceStore] = useState([]);
    const [pincodeAreas, setPincodeAreas] = useState([]);
    const [homepageData, setHomepageData] = useState(null);
    const [banners, setBanners] = useState([]);
    const [categories, setCategories] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [featuredProductsTitle, setFeaturedProductsTitle] = useState('Featured Products');
    const [topBanner, setTopBanner] = useState([]);
    const [midBanner, setMidBanner] = useState([]);
    const [midBannerBottom, setMidBannerBottom] = useState([]);
    const [bottomBanner, setBottomBanner] = useState([]);
    const [topSectionBanner, setTopSectionBanner] = useState([]);
    const [topAnnouncementBanner, setTopAnnouncementBanner] = useState([]);
    const [topSideBySide, setTopSideBySide] = useState([]);
    const [firstProductBlock, setFirstProductBlock] = useState(null);
    const [firstProductBlockTitleImage, setFirstProductBlockTitleImage] = useState(null);
    const [secondProductBlock, setSecondProductBlock] = useState(null);
    const [thirdProductBlock, setThirdProductBlock] = useState(null);
    const [secondProductBlockTitleImage, setSecondProductBlockTitleImage] = useState(null);
    const [bottomShowcaseBanner, setBottomShowcaseBanner] = useState(null);
    const [bottomShowcaseProducts, setBottomShowcaseProducts] = useState([]);
    const [categoryDiscovery, setCategoryDiscovery] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const { loadWishlist } = useWishlist();
    const { showLoader } = useContext(LoaderContext);
    const { profile, loadProfileTwo, isStoreUnavailable, storeUnavailableData, setStoreUnavailable } = useContext(AppContext);

    // Main homepage data fetcher, reused for initial load and pull-to-refresh
    const fetchHomepageData = useCallback(async (isRefreshing = false) => {
        try {
            if (isRefreshing) {
                setRefreshing(true);
                // Refresh Profile
                loadProfileTwo().catch(err => console.error("Profile refresh failed:", err));
            }

            const [storedPincodeAreaId, storedLocality, storedArea] = await Promise.all([
                AsyncStorage.getItem('pincodeAreaId'),
                AsyncStorage.getItem('locality'),
                AsyncStorage.getItem('area')
            ]);

            // Fetch general settings for store unavailable info
            let currentUnavailableData = null;
            try {
                const settingsRes = await getGeneralSettingsApi();
                if (settingsRes && settingsRes.success && settingsRes.data?.items) {
                    const items = settingsRes.data.items;
                    const imageItem = items.find(i => i.stName === 'store_not_available_image');
                    const textItem = items.find(i => i.stName === 'store_not_available_text');

                    currentUnavailableData = {
                        image: imageItem ? imageItem.stValue : null,
                        text: textItem ? textItem.stValue : ''
                    };
                }
            } catch (settingsError) {
                console.error("Failed to fetch general settings:", settingsError);
            }

            const areaId = storedPincodeAreaId ? parseInt(storedPincodeAreaId) : (profile?.pincode || null);
            if (storedArea) {
                setUserLocation({
                    locality: storedLocality || '',
                    area: storedArea
                });
            } else {
                const [storedLocality2, storedArea2] = await Promise.all([
                    AsyncStorage.getItem('locality'),
                    AsyncStorage.getItem('area')
                ]);
                if (storedArea2) {
                    setUserLocation({
                        locality: storedLocality2 || '',
                        area: storedArea2
                    });
                }
            }

            const response = await getHomepageData(areaId, 100);

            // Check for STORE_NOT_FOUND in banners or response
            let storeNotFound = false;
            if (response?.status === 'STORE_NOT_FOUND' || response?.data?.status === 'STORE_NOT_FOUND') {
                storeNotFound = true;
            } else if (response?.data?.banners && Array.isArray(response.data.banners)) {
                const errorBanner = response.data.banners.find(b => b.status === 'STORE_NOT_FOUND');
                if (errorBanner) {
                    storeNotFound = true;
                }
            }

            if (storeNotFound) {
                setStoreUnavailable(true, currentUnavailableData);
                setHomepageData(null);
                setBanners([]);
                setTopBanner([]);
                setMidBanner([]);
                setMidBannerBottom([]);
                setBottomBanner([]);
                setCategories([]);
                setBestOffers([]);
                setFeaturedProducts([]);
                setHalfPriceStore([]);
                setTopSectionBanner([]);
                setTopAnnouncementBanner([]);
                setCategoryDiscovery(null);
                setFirstProductBlock(null);
                setSecondProductBlock(null);
                setThirdProductBlock(null);
                setBottomShowcaseBanner(null);
                setBottomShowcaseProducts([]);
            } else {
                setStoreUnavailable(false);
                setHomepageData(response);

                if (response?.data) {
                    if (response.data.banners) {
                        const allBanners = response.data.banners;

                        const mapBanner = (banner) => ({
                            ...banner,
                            uri: { uri: `${CONFIG.image_base_url}${banner.imageUrl}` }
                        });

                        const sortByOrder = (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0);

                        // Extract and Map Banner Sets
                        const getBannerSet = (key) => allBanners.filter(b => b.placementKey === key).sort(sortByOrder).map(mapBanner);

                        setTopBanner(getBannerSet('app_home_top_banner'));
                        setMidBanner(getBannerSet('app_home_mid_banner'));
                        setMidBannerBottom(getBannerSet('app_home_mid_banner_bottom'));
                        setBottomBanner(getBannerSet('app_home_bottom'));
                        setTopSectionBanner(getBannerSet('app_home_top_banner_top_section'));
                        setTopAnnouncementBanner(getBannerSet('app_home_top_announcement_image'));
                        setTopSideBySide(getBannerSet('app_home_top_sidebyside_two'));

                        const firstBlock = allBanners.find(b => b.placementKey === 'app_home_first_productblock_title_image');
                        setFirstProductBlockTitleImage(firstBlock ? mapBanner(firstBlock) : null);

                        const secondBlock = allBanners.find(b => b.placementKey === 'app_home_second_productblock_title_image');
                        setSecondProductBlockTitleImage(secondBlock ? mapBanner(secondBlock) : null);

                        const showcaseBg = allBanners.find(b => b.placementKey === 'app_home_bottom_showcase_banner_image');
                        setBottomShowcaseBanner(showcaseBg ? mapBanner(showcaseBg) : null);

                        const showcaseProducts = allBanners.filter(b => b.placementKey === 'app_home_bottom_showcase_product_image').sort(sortByOrder).map(mapBanner);
                        setBottomShowcaseProducts(showcaseProducts);

                        // Slider Banners (exclude specifically placed ones)
                        const specificPlacementKeys = [
                            'app_home_top_banner',
                            'app_home_top_banner_top_section',
                            'app_home_top_announcement_image',
                            'app_home_mid_banner',
                            'app_home_mid_banner_bottom',
                            'app_home_bottom',
                            'app_home_top_sidebyside_two',
                            'app_home_first_productblock_title_image',
                            'app_home_second_productblock_title_image',
                            'app_home_bottom_showcase_banner_image',
                            'app_home_bottom_showcase_product_image',
                        ];
                        const sliderBanners = allBanners
                            .filter(b => !specificPlacementKeys.includes(b.placementKey))
                            .sort(sortByOrder)
                            .map(mapBanner);
                        setBanners(sliderBanners);
                    }

                    if (response.data.featuredCategories) {
                        setCategories(response.data.featuredCategories);
                    }

                    if (response.data.firstProductBlock) {
                        setFirstProductBlock(response.data.firstProductBlock);
                    }

                    if (response.data.secondProductBlock) {
                        setSecondProductBlock(response.data.secondProductBlock);
                    }

                    if (response.data.thirdProductBlock) {
                        setThirdProductBlock(response.data.thirdProductBlock);
                    }

                    if (response.data.categoryDiscovery) {
                        setCategoryDiscovery(response.data.categoryDiscovery);
                    }

                    if (response.data.bestOffers) {
                        setBestOffers(response.data.bestOffers);
                    }
                    if (response.data.featuredProducts) {
                        setFeaturedProducts(response.data.featuredProducts);
                    }

                    if (response.data.featuredProductsTitle) {
                        setFeaturedProductsTitle(response.data.featuredProductsTitle);
                    }

                    if (response.data.halfPriceStore) {
                        setHalfPriceStore(response.data.halfPriceStore);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching homepage data:', error);
            // Universal fallback for any unexpected error
            setStoreUnavailable(true, null);
            setHomepageData(null);
            setBanners([]);
            setTopBanner([]);
            setTopSectionBanner([]);
            setTopAnnouncementBanner([]);
            setCategories([]);
            setCategoryDiscovery(null);
            setFeaturedProducts([]);
        } finally {
            if (isRefreshing) setRefreshing(false);
        }
    }, [profile?.pincode, loadProfileTwo, setStoreUnavailable, loadWishlist]);

    useEffect(() => {
        fetchHomepageData().catch(e => console.error('Initial fetchHomepageData failed', e));
    }, [fetchHomepageData]);

    const value = useMemo(() => ({
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
        refreshHomeData: () => fetchHomepageData(true),
        isHomeLoading: refreshing,
        isStoreUnavailable,
        storeUnavailableData,
        topSectionBanner,
        topAnnouncementBanner
    }), [
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
        fetchHomepageData,
        refreshing,
        isStoreUnavailable,
        storeUnavailableData,
        topSectionBanner,
        topAnnouncementBanner
    ]);

    return value;
};

export default useHomeData;

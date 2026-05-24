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
    const [thirdProductBlockTitleImage, setThirdProductBlockTitleImage] = useState(null);
    const [secondProductBlockTitleImage, setSecondProductBlockTitleImage] = useState(null);
    const [categoryDiscoveryBackgroundImage, setCategoryDiscoveryBackgroundImage] = useState(null);
    const [bottomShowcaseBanner, setBottomShowcaseBanner] = useState(null);
    const [bottomShowcaseProducts, setBottomShowcaseProducts] = useState([]);
    const [categoryDiscovery, setCategoryDiscovery] = useState(null);
    const [popupData, setPopupData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const { loadWishlist } = useWishlist();
    const { showLoader } = useContext(LoaderContext);
    const { profile, loadProfileTwo, isStoreUnavailable, storeUnavailableData, setStoreUnavailable } = useContext(AppContext);

    // Main homepage data fetcher, reused for initial load and pull-to-refresh
    const fetchHomepageData = useCallback(async (isRefreshing = false) => {
        let currentUnavailableData = null;
        let currentClosedData = null;
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
            try {
                const settingsRes = await getGeneralSettingsApi();
                if (settingsRes && settingsRes.success && settingsRes.data?.items) {
                    const items = settingsRes.data.items;
                    const imageItem = items.find(i => i.stName === 'store_not_available_image');
                    const textItem = items.find(i => i.stName === 'store_not_available_text');
                    const closedImageItem = items.find(i => i.stName === 'store_no_delivery_image');

                    currentUnavailableData = {
                        image: imageItem ? imageItem.stValue : null,
                        text: textItem ? textItem.stValue : ''
                    };

                    currentClosedData = {
                        image: closedImageItem ? closedImageItem.stValue : null,
                        text: "" // Will be populated from API response message
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
            console.log('🏠 [HOME API] Raw Response Data:', JSON.stringify(response, null, 2));

            // Check for STORE_NOT_FOUND or STORE_CLOSED_FOR_DELIVERY
            let storeNotFound = false;
            let storeClosed = false;
            if (response?.status === 'STORE_NOT_FOUND' || response?.data?.status === 'STORE_NOT_FOUND') {
                storeNotFound = true;
            } else if (response?.status === 'STORE_CLOSED_FOR_DELIVERY' || response?.data?.status === 'STORE_CLOSED_FOR_DELIVERY') {
                storeClosed = true;
            } else if (response?.data?.banners && Array.isArray(response.data.banners)) {
                const errorBanner = response.data.banners.find(b => b.status === 'STORE_NOT_FOUND');
                if (errorBanner) {
                    storeNotFound = true;
                }
            }

            // 🎁 PRIORITIZE POPUP EXTRACTION: must happen regardless of store status or success flag
            // Check all possible nesting locations based on common API patterns: data.popup, popup, details.popup
            const pObj = response?.data?.popup || response?.popup || response?.details?.popup;
            
            if (pObj && (pObj.popupImageUrl || pObj.popupImage) && Number(pObj.showPopup) === 1) {
                console.log('🎁 [HOME POPUP] Found in response, mapping keys:', { id: pObj.popupId, show: pObj.showPopup });
                setPopupData({
                    ...pObj,
                    uri: { uri: `${CONFIG.image_base_url}${pObj.popupImageUrl || pObj.popupImage}` },
                    popupLink: pObj.popupLink || pObj.popup_link || pObj.Link || pObj.link
                });
            } else {
                console.log('🎁 [HOME POPUP] No valid popup object found in response paths.');
                setPopupData(null);
            }

            if (storeNotFound || storeClosed) {
                const displayMessage = response?.message || response?.data?.message || (storeClosed ? "Store is currently closed for delivery." : "Service not available in your area yet.");
                const displayData = storeClosed
                    ? { ...currentClosedData, text: displayMessage }
                    : currentUnavailableData;

                setStoreUnavailable(true, displayData);
                // Clear all home data when store is unavailable
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
                setThirdProductBlockTitleImage(null);
                setCategoryDiscoveryBackgroundImage(null);
                setBottomShowcaseBanner(null);
                setBottomShowcaseProducts([]);
            } else {
                setStoreUnavailable(false);
                setHomepageData(response);
                if (response?.data) {
                    const data = response.data;
                    const banners = data.banners || data.Banners || [];

                    if (banners.length > 0) {
                        const mapBanner = (banner) => ({
                            ...banner,
                            uri: { uri: `${CONFIG.image_base_url}${banner.imageUrl || banner.ImageUrl}` }
                        });

                        const sortByOrder = (a, b) => (a.displayOrder || a.DisplayOrder || 0) - (b.displayOrder || b.DisplayOrder || 0);

                        // Extract and Map Banner Sets
                        const getBannerSet = (key) => banners.filter(b => b.placementKey === key || b.PlacementKey === key).sort(sortByOrder).map(mapBanner);

                        setTopBanner(getBannerSet('app_home_top_banner'));
                        setMidBanner(getBannerSet('app_home_mid_banner'));
                        setMidBannerBottom(getBannerSet('app_home_mid_banner_bottom'));
                        setBottomBanner(getBannerSet('app_home_bottom'));
                        setTopSectionBanner(getBannerSet('app_home_top_banner_top_section'));
                        setTopAnnouncementBanner(getBannerSet('app_home_top_announcement_image'));
                        setTopSideBySide(getBannerSet('app_home_top_sidebyside_two'));

                        const firstBlock = banners.find(b => b.placementKey === 'app_home_first_productblock_title_image' || b.PlacementKey === 'app_home_first_productblock_title_image');
                        setFirstProductBlockTitleImage(firstBlock ? mapBanner(firstBlock) : null);

                        const secondBlock = banners.find(b => b.placementKey === 'app_home_second_productblock_title_image' || b.PlacementKey === 'app_home_second_productblock_title_image');
                        setSecondProductBlockTitleImage(secondBlock ? mapBanner(secondBlock) : null);

                        const thirdBlock = banners.find(b => b.placementKey === 'app_home_third_productblock_title_image' || b.PlacementKey === 'app_home_third_productblock_title_image');
                        setThirdProductBlockTitleImage(thirdBlock ? mapBanner(thirdBlock) : null);

                        const discBg = banners.find(b => b.placementKey === 'app_home_category_discovery_background_image' || b.PlacementKey === 'app_home_category_discovery_background_image');
                        setCategoryDiscoveryBackgroundImage(discBg ? mapBanner(discBg) : null);

                        const showcaseBg = banners.find(b => b.placementKey === 'app_home_bottom_showcase_banner_image' || b.PlacementKey === 'app_home_bottom_showcase_banner_image');
                        setBottomShowcaseBanner(showcaseBg ? mapBanner(showcaseBg) : null);

                        const showcaseProducts = banners.filter(b => b.placementKey === 'app_home_bottom_showcase_product_image' || b.PlacementKey === 'app_home_bottom_showcase_product_image').sort(sortByOrder).map(mapBanner);
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
                            'app_home_third_productblock_title_image',
                            'app_home_category_discovery_background_image',
                            'app_home_bottom_showcase_banner_image',
                            'app_home_bottom_showcase_product_image',
                        ];
                        const sliderBanners = banners
                            .filter(b => !specificPlacementKeys.includes(b.placementKey || b.PlacementKey))
                            .sort(sortByOrder)
                            .map(mapBanner);
                        setBanners(sliderBanners);
                    }

                    setCategories(data.featuredCategories || data.FeaturedCategories || []);
                    setFirstProductBlock(data.firstProductBlock || data.FirstProductBlock || null);
                    setSecondProductBlock(data.secondProductBlock || data.SecondProductBlock || null);
                    setThirdProductBlock(data.thirdProductBlock || data.ThirdProductBlock || null);
                    setCategoryDiscovery(data.categoryDiscovery || data.CategoryDiscovery || null);
                    setBestOffers(data.bestOffers || data.BestOffers || []);
                    setFeaturedProducts(data.featuredProducts || data.FeaturedProducts || []);
                    setFeaturedProductsTitle(data.featuredProductsTitle || data.FeaturedProductsTitle || 'Featured Products');
                    setHalfPriceStore(data.halfPriceStore || data.HalfPriceStore || []);
                }
            }
        } catch (error) {
            console.error('Error fetching homepage data:', error);
            
            // Still try to extract popup from error data
            // Supports both legacy axios errors and our new rich error object from networkUtils
            // Explicitly checking data.data.popup and data.popup for the user's snippet
            const errBody = error?.data || error?.response?.data || error || error?.data?.data;
             console.error('Error fetching homepage data------->', errBody);
            
            const p = errBody?.data?.popup || errBody?.popup || errBody?.details?.popup;
            console.error('Error fetching homepage data -> Checking for popup in error body:', !!p);
            
            if (p && (p.popupImage || p.popupImageUrl) && Number(p.showPopup) === 1) {
                console.log('🎁 [HOME POPUP] Extracted from error object path:', p.popupId, 'show:', p.showPopup);
                setPopupData({
                    ...p,
                    uri: { uri: `${CONFIG.image_base_url}${p.popupImageUrl || p.popupImage}` },
                    popupLink: p.popupLink || p.popup_link || p.Link || p.link
                });
            }
            
            // Distinguish between store closed and general unavailability in catch block
            const errorMsg = typeof error === 'string' ? error : (error?.message || error?.Message || '');
            
            // Ignore auth, network, or generic errors so we don't mistakenly show "Delivery not available"
            if (
                errorMsg.toLowerCase().includes('session expired') || 
                errorMsg.toLowerCase().includes('unauthorized') ||
                errorMsg.toLowerCase().includes('network error') ||
                errorMsg.toLowerCase().includes('something went wrong') ||
                error?.status === 401
            ) {
                return;
            }

            const isClosed = errorMsg.toLowerCase().includes('closed') || errorMsg.toLowerCase().includes('07:00');

            const displayData = isClosed
                ? { ...currentClosedData, text: errorMsg }
                : currentUnavailableData;

            setStoreUnavailable(true, displayData);
            setHomepageData(null);
            setBanners([]);
            setTopBanner([]);
            setTopSectionBanner([]);
            setTopAnnouncementBanner([]);
            setCategories([]);
            setCategoryDiscovery(null);
            setCategoryDiscoveryBackgroundImage(null);
            setFeaturedProducts([]);
            setThirdProductBlockTitleImage(null);
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
        thirdProductBlockTitleImage,
        firstProductBlockTitleImage,
        secondProductBlockTitleImage,
        categoryDiscoveryBackgroundImage,
        bottomShowcaseBanner,
        bottomShowcaseProducts,
        categoryDiscovery,
        refreshHomeData: () => fetchHomepageData(true),
        isHomeLoading: refreshing,
        isStoreUnavailable,
        storeUnavailableData,
        topSectionBanner,
        topAnnouncementBanner,
        popupData,
        setPopupData
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
        thirdProductBlockTitleImage,
        firstProductBlockTitleImage,
        secondProductBlockTitleImage,
        categoryDiscoveryBackgroundImage,
        bottomShowcaseBanner,
        bottomShowcaseProducts,
        categoryDiscovery,
        fetchHomepageData,
        refreshing,
        isStoreUnavailable,
        storeUnavailableData,
        topSectionBanner,
        topAnnouncementBanner,
        popupData,
        setPopupData
    ]);

    return value;
};

export default useHomeData;

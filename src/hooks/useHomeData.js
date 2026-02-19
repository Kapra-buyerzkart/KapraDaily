import { useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHomepageData } from '../api/homeService';
// import { searchPincodeArea } from '../api/pincodeService';
// import { getCurrentLocation } from '../utils/locationUtils';
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
    const [refreshing, setRefreshing] = useState(false);

    // Store Unavailable State
    const [isStoreUnavailable, setIsStoreUnavailable] = useState(false);
    const [storeUnavailableData, setStoreUnavailableData] = useState({ image: null, text: '' });

    const { loadWishlist } = useWishlist();
    const { showLoader } = useContext(LoaderContext);
    const { profile, loadProfileTwo } = useContext(AppContext);

    useEffect(() => {
        // const fetchPincodeAreas = async () => {
        //     try {
        //         showLoader(true);
        //         let searchTerm = 'ven';
        //         try {
        //             const locationData = await getCurrentLocation();
        //             console.log('User Location:', locationData);
        //             if (locationData) {
        //                 setUserLocation(locationData); // Store location
        //                 if (locationData.pincode) {
        //                     searchTerm = locationData.pincode;
        //                     console.log('Searching Pincode Areas for:', searchTerm);
        //                 }
        //             }
        //         } catch (locError) {
        //             console.warn('Location fetch failed, using default:', locError);
        //         }

        //         const response = await searchPincodeArea(searchTerm, 20);
        //         if (response?.Data) {
        //             setPincodeAreas(response.Data);
        //         } else if (Array.isArray(response)) {
        //             setPincodeAreas(response);
        //         } else {
        //             setPincodeAreas([]);
        //         }
        //     } catch (error) {
        //         console.error('Error fetching pincode areas:', error);
        //     } finally {
        //         showLoader(false);
        //     }
        // };

        const fetchHomepageData = async (isRefreshing = false) => {
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

                        setStoreUnavailableData({
                            image: imageItem ? imageItem.stValue : null,
                            text: textItem ? textItem.stValue : ''
                        });
                    }
                } catch (settingsError) {
                    console.error("Failed to fetch general settings:", settingsError);
                }

                const areaId = 105; // Hardcoded for testing // storedPincodeAreaId ? parseInt(storedPincodeAreaId) : (profile?.pincode || null);
                if (storedArea) {
                    setUserLocation({
                        locality: storedLocality || '',
                        area: storedArea
                    });
                } else {
                    const [storedLocality, storedArea] = await Promise.all([
                        AsyncStorage.getItem('locality'),
                        AsyncStorage.getItem('area')
                    ]);
                    if (storedArea) {
                        setUserLocation({
                            locality: storedLocality || '',
                            area: storedArea
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

                // Also check if homepage is empty and we have a manual trigger or just no data
                if (!storeNotFound && (!response?.data || (response?.data?.banners?.length === 0 && response?.data?.featuredCategories?.length === 0))) {
                    console.log("No data found, but status not STORE_NOT_FOUND. Checking if we should show unavailable.");
                }

                if (storeNotFound) {
                    setIsStoreUnavailable(true);
                    setHomepageData(null); // Clear data if store is unavailable
                    setBanners([]);
                    setTopBanner([]);
                    setMidBanner([]);
                    setMidBannerBottom([]);
                    setBottomBanner([]);
                    setCategories([]);
                    setBestOffers([]);
                    setFeaturedProducts([]);
                    setHalfPriceStore([]);
                } else {
                    setIsStoreUnavailable(false);
                    setHomepageData(response);

                    if (response?.data) {
                        if (response.data.banners) {
                            const allBanners = response.data.banners;

                            const mapBanner = (banner) => ({
                                ...banner,
                                uri: { uri: `${CONFIG.image_base_url}${banner.imageUrl}` }
                            });

                            // Extract Specific Banners
                            const top = allBanners.filter(b => b.placementKey === 'app_home_top_banner');
                            setTopBanner(top.length > 0 ? top.map(mapBanner) : []);

                            const mid = allBanners.filter(b => b.placementKey === 'app_home_mid_banner');
                            setMidBanner(mid.length > 0 ? mid.map(mapBanner) : []);

                            const midBot = allBanners.filter(b => b.placementKey === 'app_home_mid_banner_bottom');
                            setMidBannerBottom(midBot.length > 0 ? midBot.map(mapBanner) : []);

                            const bot = allBanners.filter(b => b.placementKey === 'app_home_bottom');
                            setBottomBanner(bot.length > 0 ? bot.map(mapBanner) : []);

                            // Slider Banners (exclude specifically placed ones)
                            const specificPlacementKeys = [
                                'app_home_top_banner',
                                'app_home_mid_banner',
                                'app_home_mid_banner_bottom',
                                'app_home_bottom'
                            ];
                            const sliderBanners = allBanners
                                .filter(b => !specificPlacementKeys.includes(b.placementKey))
                                .map(mapBanner);
                            setBanners(sliderBanners);
                        }

                        if (response.data.featuredCategories) {
                            setCategories(response.data.featuredCategories);
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
            } finally {
                if (isRefreshing) setRefreshing(false);
            }
        };
        fetchHomepageData().catch(e => console.error('fetchHomepageData failed', e));
    }, [profile?.pincode, loadProfileTwo]);

    return {
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
        refreshHomeData: () => fetchHomepageData(true),
        isHomeLoading: refreshing,
        isStoreUnavailable,
        storeUnavailableData
    };
};

export default useHomeData;

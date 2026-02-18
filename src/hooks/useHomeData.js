import { useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHomepageData } from '../api/homeService';
// import { searchPincodeArea } from '../api/pincodeService';
// import { getCurrentLocation } from '../utils/locationUtils';
import CONFIG from '../globals/config';
import { useWishlist } from '../context/WishlistContext';
import { LoaderContext } from '../context/loaderContext';
import { AppContext } from '../context/appContext';

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

    const { loadWishlist } = useWishlist();
    const { showLoader } = useContext(LoaderContext);
    const { profile } = useContext(AppContext);

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
                if (isRefreshing) setRefreshing(true);
                // showLoader(true);
                const [storedPincodeAreaId, storedLocality, storedArea] = await Promise.all([
                    AsyncStorage.getItem('pincodeAreaId'),
                    AsyncStorage.getItem('locality'),
                    AsyncStorage.getItem('area')
                ]);

                const areaId = storedPincodeAreaId ? parseInt(storedPincodeAreaId) : 105;
                if (storedArea) {
                    // Use pincode from profile (AppContext) if available, otherwise fallback
                    // const areaId = profile?.pincode ? parseInt(profile.pincode) : 105;

                    // Update user location from profile for consistency

                    setUserLocation({
                        locality: storedLocality || '',
                        area: storedArea
                    });
                } else {
                    // Fallback to local storage for guest/initial state if needed
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

            } catch (error) {
                console.error('Error fetching homepage data:', error);
            } finally {
                if (isRefreshing) setRefreshing(false);
            }
        };
        fetchHomepageData().catch(e => console.error('fetchHomepageData failed', e));
    }, [profile?.pincode]);

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
        isHomeLoading: refreshing
    };
};

export default useHomeData;

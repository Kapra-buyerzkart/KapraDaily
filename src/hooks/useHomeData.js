import { useState, useEffect, useContext } from 'react';
import { getHomepageData } from '../api/homeService';
// import { searchPincodeArea } from '../api/pincodeService';
// import { getCurrentLocation } from '../utils/locationUtils';
import CONFIG from '../globals/config';
import { useWishlist } from '../context/WishlistContext';
import { LoaderContext } from '../context/loaderContext';

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

    const { loadWishlist } = useWishlist();
    const { showLoader } = useContext(LoaderContext);

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

        const fetchHomepageData = async () => {
            try {
                // showLoader(true);
                const response = await getHomepageData(105, 20);
                setHomepageData(response);

                if (response?.data) {
                    if (response.data.banners) {
                        const mappedBanners = response.data.banners.map(b => {
                            let imageUri = b.imageUrl;
                            imageUri = `${CONFIG.image_base_url}${b.imageUrl}`;
                            return { ...b, uri: { uri: imageUri } };
                        });
                        setBanners(mappedBanners);
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
                // showLoader(false);
            }
        };
        fetchHomepageData().catch(e => console.error('fetchHomepageData failed', e));
        // Removed redundant loadWishlist here as it's better handled where needed or once at root if desired
    }, []);

    return {
        bestOffers,
        featuredProducts,
        halfPriceStore,
        pincodeAreas,
        homepageData,
        banners,
        categories,
        userLocation,
        featuredProductsTitle
    };
};

export default useHomeData;

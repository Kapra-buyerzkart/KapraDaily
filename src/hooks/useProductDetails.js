import { useState, useEffect, useContext } from 'react';
import { getProductDetails, getRelatedProductsApi } from '../api/productService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPincodeAreaId } from '../api/pincodeService';
import CONFIG from '../globals/config';
import { LoaderContext } from '../context/loaderContext';
import { AppContext } from '../context/appContext';

export const useProductDetails = (productId, initialProduct = null) => {
    const [loading, setLoading] = useState(true);
    const [relatedLoading, setRelatedLoading] = useState(false);
    const [product, setProduct] = useState(initialProduct?.product || initialProduct);
    const [images, setImages] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [customerSpecific, setCustomerSpecific] = useState(null);
    const [error, setError] = useState(null);
    const [productImage, setProductImage] = useState(null);
    const [pincodeAreaId, setPincodeAreaId] = useState(null);
    const { showLoader } = useContext(LoaderContext);
    const { profile } = useContext(AppContext);

    useEffect(() => {
        const fetchProductData = async () => {
            if (productId) {
                //  console.log(' nm,./,mnbvnjkml;', getPincodeAreaId());
                try {
                    setLoading(true);
                    showLoader(true);
                    setError(null);
                    // const pincodeAreaId = await getPincodeAreaId();
                    console.log(' nm,./,mnbvnjkml;', pincodeAreaId);


                    let currentPincodeId = pincodeAreaId || profile?.pincode;
                    if (!currentPincodeId) {
                        const stored = await AsyncStorage.getItem('pincodeAreaId');
                        if (stored) {
                            currentPincodeId = parseInt(stored);
                            setPincodeAreaId(currentPincodeId);
                        }
                    }

                    // Fetch product details and related products in parallel
                    const [detailsResponse, relatedResponse] = await Promise.all([
                        getProductDetails(productId, currentPincodeId),
                        getRelatedProductsApi(productId, currentPincodeId)
                    ]);

                    console.log('Product Details Response:', detailsResponse);
                    console.log('Related Products Response:', relatedResponse);

                    if (detailsResponse?.data) {
                        const productData = detailsResponse.data.product || detailsResponse.data;
                        setProduct(productData);
                        setCustomerSpecific(detailsResponse.data.customerspecific);
                        setAttributes(detailsResponse.data.attributes || []);

                        if (detailsResponse.data.images && Array.isArray(detailsResponse.data.images)) {
                            const mappedImages = detailsResponse.data.images.map(img => ({
                                uri: `${CONFIG.image_base_url}${img.imageUrl}`
                            }));
                            setImages(mappedImages);
                            if (mappedImages.length > 0) {
                                setProductImage(mappedImages[0]);
                            }
                        } else if (productData.featuredImage) {
                            const mainImg = { uri: `${CONFIG.image_base_url}${productData.featuredImage}` };
                            setProductImage(mainImg);
                            setImages([mainImg]);
                        }
                    }

                    if (relatedResponse?.data?.items) {
                        setRelatedProducts(relatedResponse.data.items);
                    }
                } catch (err) {
                    console.error('Error fetching product data:', err);
                    setError(err);
                } finally {
                    setLoading(false);
                    showLoader(false);
                }
            } else {
                const initialData = initialProduct?.product || initialProduct;
                setProduct(initialData);
                setLoading(false);

                if (initialData?.featuredImage) {
                    const mainImg = { uri: `${CONFIG.image_base_url}${initialData.featuredImage}` };
                    setProductImage(mainImg);
                    setImages(initialProduct?.images ? initialProduct.images.map(img => ({ uri: `${CONFIG.image_base_url}${img.imageUrl}` })) : [mainImg]);
                }
                if (initialProduct?.attributes) setAttributes(initialProduct.attributes);
                if (initialProduct?.customerspecific) setCustomerSpecific(initialProduct.customerspecific);
            }
        };

        fetchProductData();
    }, [productId]);

    return {
        loading,
        relatedLoading,
        product,
        images,
        attributes,
        relatedProducts,
        customerSpecific,
        error,
        productImage,
        productName: product?.prName || product?.name || 'Product Name',
        productDescription: product?.description || 'Product Description',
        shortDescription: product?.shortDescription || '',
        unitPrice: product?.unitPrice || 0,
        specialPrice: product?.specialPrice || product?.price || 0,
        discountPercentage: product?.discountPercentage
            ? Math.round(product.discountPercentage)
            : (product?.unitPrice && product?.specialPrice)
                ? Math.round(((product.unitPrice - product.specialPrice) / product.unitPrice) * 100)
                : 0,
        stockQty: product?.stockQty || 0,
        isAvailable: product?.isAvailable !== false,
        bTokenValue: product?.bTokenValue || 0,
        productId: productId || product?.productId || product?.id,
        urlKey: product?.urlKey || product?.slug || '',
    };
};

import { useState, useEffect, useContext } from 'react';
import { getProductDetails, getRelatedProductsApi } from '../api/productService';
import { getPincodeAreaId } from '../api/pincodeService';
import CONFIG from '../globals/config';
import { LoaderContext } from '../context/loaderContext';

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
    const [pincodeAreaId, setPincodeAreaId] = useState(105);
    const { showLoader } = useContext(LoaderContext);

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


                    // Fetch product details and related products in parallel
                    const [detailsResponse, relatedResponse] = await Promise.all([
                        getProductDetails(productId, pincodeAreaId),
                        getRelatedProductsApi(productId, pincodeAreaId)
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

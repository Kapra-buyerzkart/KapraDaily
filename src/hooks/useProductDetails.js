import { useState, useEffect } from 'react';
import { getProductDetails } from '../api/productService';
import CONFIG from '../globals/config';

export const useProductDetails = (productId, initialProduct = null) => {
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(initialProduct?.product || initialProduct);
    const [images, setImages] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [customerSpecific, setCustomerSpecific] = useState(null);
    const [error, setError] = useState(null);
    const [productImage, setProductImage] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (productId) {
                try {
                    setLoading(true);
                    setError(null);
                    const response = await getProductDetails(productId);
                    console.log('Product Details Response:', response);

                    if (response?.data) {
                        const productData = response.data.product || response.data;
                        setProduct(productData);
                        setCustomerSpecific(response.data.customerspecific);
                        setAttributes(response.data.attributes || []);

                        if (response.data.images && Array.isArray(response.data.images)) {
                            const mappedImages = response.data.images.map(img => ({
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
                } catch (err) {
                    console.error('Error fetching product details:', err);
                    setError(err);
                } finally {
                    setLoading(false);
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

        fetchProduct();
    }, [productId]);

    return {
        loading,
        product,
        images,
        attributes,
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
        productId: productId || product?.productId || product?.id,
    };
};

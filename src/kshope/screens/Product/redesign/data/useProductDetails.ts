import { useCallback, useContext, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import { LoaderContext } from '../../../../context/loaderContext';
import { useCart } from '../../../../context/CartContext';
import {
  getProductDetails,
  getRelatedProductsApi,
} from '../../../../api/services/productService';
import {
  addToCartApi,
  removeFromCartApi,
  updateCartItemApi,
} from '../../../../api/services/cartService';
import { getKshopeAreaId } from '../../../../globals/storage';
import {
  cartErrorMessage,
  isCartSuccess,
} from '../../../../utils/cartFeedback';

const ADD_FAILED = 'Could not add this item to your cart';
const UPDATE_FAILED = 'Could not update the quantity';
const REMOVE_FAILED = 'Could not remove this item';

const STOCK_ERROR = /(insufficient|out of stock|not enough|stock unavailable|no stock)/i;

export const useProductDetails = (productId: string, fallback: any) => {
  const { cartItems, cartSummary, loadCart } = useCart();
  const { showLoader } = useContext(LoaderContext) || { showLoader: () => {} };

  const [details, setDetails] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [areaId, setAreaId] = useState<number | null>(null);
  const [areaReady, setAreaReady] = useState(false);
  const [stockBlocked, setStockBlocked] = useState(false);

  useEffect(() => {
    setStockBlocked(false);
  }, [productId]);

  useEffect(() => {
    let active = true;
    getKshopeAreaId()
      .then(stored => {
        if (active) {
          setAreaId(stored);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) {
          setAreaReady(true);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const fetchAll = useCallback(async () => {
    try {
      showLoader(true);
      const [response, relatedResponse] = await Promise.all([
        getProductDetails(productId, areaId),
        getRelatedProductsApi(productId, areaId),
      ]);

      setDetails(response?.success && response?.data ? response.data : null);
      setRelated(
        relatedResponse?.success && relatedResponse?.data
          ? relatedResponse.data?.items || []
          : [],
      );
    } catch {
      setDetails(null);
      setRelated([]);
    } finally {
      showLoader(false);
    }
  }, [areaId, productId, showLoader]);

  useFocusEffect(
    useCallback(() => {
      if (!areaReady || !productId) {
        return;
      }
      fetchAll();
      loadCart();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [areaReady, fetchAll, productId]),
  );

  const product = details?.product || fallback || {};

  const cartItem = cartItems.find(
    (entry: any) => String(entry.productId) === String(productId),
  );

  const cartQty = cartItem
    ? cartItem.quantity
    : details?.customerspecific?.cartQty || 0;

  const setLocalQty = (quantity: number) =>
    setDetails((prev: any) => ({
      ...prev,
      customerspecific: { ...prev?.customerspecific, cartQty: quantity },
    }));

  const runCartAction = async (
    action: () => Promise<any>,
    failure: string,
    nextQty: number,
  ) => {
    try {
      showLoader(true);
      const response = await action();
      if (!isCartSuccess(response)) {
        const message = cartErrorMessage(response, failure);
        if (STOCK_ERROR.test(message)) {
          setStockBlocked(true);
        }
        Toast.show(message, Toast.SHORT);
        await loadCart();
        return;
      }
      await loadCart();
      setLocalQty(nextQty);
    } catch (error) {
      const message = cartErrorMessage(error, failure);
      if (STOCK_ERROR.test(message)) {
        setStockBlocked(true);
      }
      Toast.show(message, Toast.SHORT);
    } finally {
      showLoader(false);
    }
  };

  const addToCart = () =>
    runCartAction(
      () =>
        cartItem
          ? updateCartItemApi(
              cartItem.cartItemId,
              cartItem.quantity + 1,
              cartSummary?.cartVersion,
              productId,
              areaId,
            )
          : addToCartApi(productId, 1, areaId),
      ADD_FAILED,
      cartQty + 1,
    );

  const setQuantity = (quantity: number) => {
    if (quantity < 1) {
      return removeFromCart();
    }
    return runCartAction(
      () =>
        cartItem
          ? updateCartItemApi(
              cartItem.cartItemId,
              quantity,
              cartSummary?.cartVersion,
              productId,
              areaId,
            )
          : addToCartApi(productId, 1, areaId),
      UPDATE_FAILED,
      quantity,
    );
  };

  const removeFromCart = () =>
    runCartAction(
      () =>
        cartItem
          ? removeFromCartApi(
              cartItem.cartItemId,
              cartSummary?.cartVersion,
              productId,
              areaId,
            )
          : Promise.resolve({ success: true }),
      REMOVE_FAILED,
      0,
    );

  return {
    details,
    product,
    related,
    cartQty,
    stockBlocked,
    addToCart,
    setQuantity,
    removeFromCart,
  };
};

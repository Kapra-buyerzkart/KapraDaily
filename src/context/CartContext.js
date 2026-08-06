import logger from '../utils/logger';
import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import secureStore from '../utils/secureStore';
import { AppContext } from './appContext';
import Toast from 'react-native-simple-toast';
import {
  addToCartApi,
  removeFromCartApi,
  updateCartItemApi,
  getCartApi,
  getCartSummaryApi,
  clearCartApi,
  applyCouponApi,
  removeCouponApi,
  applyGiftCardApi,
  removeGiftCardApi,
  applyBCoinApi,
  removeBCoinApi,
} from '../api/cartService';
import { getAddressListApi, deleteAddressApi } from '../api/addressService';
import ConfirmationModal from '../components/ConfirmationModal';
import StatusModal from '../components/StatusModal';
import QuantityLimitModal from '../components/QuantityLimitModal';
import { prefetchProductImages } from '../utils/imageUrl';

export const CartContext = createContext();

const isMaxQuantityMessage = message =>
  /max(imum)?\s+(quantity|qty)/i.test(message || '');

const parseMaxQuantity = message => {
  const match = /\b(?:is|of|limit(?:ed)?\s*(?:to)?)\s*:?\s*(\d+)/i.exec(
    message || '',
  );
  return match ? Number(match[1]) : null;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const cartItemsRef = useRef([]);
  useEffect(() => {
    cartItemsRef.current = cartItems;
  }, [cartItems]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartSummary, setCartSummary] = useState(null);
  const [isStoreUnavailable, setIsStoreUnavailable] = useState(false);
  const [storeUnavailableData, setStoreUnavailableData] = useState({
    image: null,
    text: '',
  });
  const [serviceabilityTrigger, setServiceabilityTrigger] = useState(false);
  const [hasAlertedServiceability, setHasAlertedServiceability] =
    useState(false);
  const [cartId, setCartId] = useState(null);
  const cartIdRef = useRef(null);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState([]);
  const debounceTimersRef = useRef({});

  const [addresses, setAddresses] = useState([]);
  const addressesRef = useRef([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressConfirmationData, setAddressConfirmationData] = useState(null);
  const [confirmationConfig, setConfirmationConfig] = useState(null);
  const [statusConfig, setStatusConfig] = useState(null);
  const [quantityLimitConfig, setQuantityLimitConfig] = useState(null);

  const cartVersionRef = useRef(null);
  const [cartVersion, setCartVersion] = useState(null);
  const loadRequestRef = useRef(null);
  const summaryRequestRef = useRef(null);
  const failedPincodesRef = useRef(new Set());

  const updateCartVersion = useCallback(newVersion => {
    cartVersionRef.current = newVersion;
    setCartVersion(newVersion);
  }, []);

  const { profile, editPincode } = useContext(AppContext);
  const lastPincodeRef = useRef(profile?.pincode);
  const lastUserIdRef = useRef(profile?.custId || profile?.id || null);

  useEffect(() => {
    loadCart();
    fetchAddresses();
  }, []);

  useEffect(() => {
    const currentUserId = profile?.custId || profile?.id || null;
    if (
      lastUserIdRef.current !== null &&
      currentUserId !== lastUserIdRef.current
    ) {
      logger.log(
        '👤 [CART] User changed, resetting cart:',
        lastUserIdRef.current,
        '->',
        currentUserId,
      );
      setCartItems([]);
      setCartSummary(null);
      setCartId(null);
      cartIdRef.current = null;
      updateCartVersion(null);
      setAddresses([]);
      setError(null);
      loadCart();
      fetchAddresses();
    }
    lastUserIdRef.current = currentUserId;
  }, [profile?.custId, profile?.id]);

  useEffect(() => {
    const currentPincode = profile?.pincode;
    if (currentPincode !== lastPincodeRef.current) {
      logger.log(
        '📍 [CART] Location changed, refreshing cart:',
        lastPincodeRef.current,
        '->',
        currentPincode,
      );
      lastPincodeRef.current = currentPincode;
      refreshCart();
    }
  }, [profile?.pincode, refreshCart]);

  const showConfirmation = useCallback(config => {
    setConfirmationConfig(config);
  }, []);

  const showStatus = useCallback(config => {
    if (config && typeof config.message === 'object') {
      config.message =
        config.message.message ||
        config.message.Message ||
        String(config.message);
    }
    setStatusConfig(config);
  }, []);

  const fetchAddresses = useCallback(async () => {
    setIsLoadingAddresses(true);
    try {
      const response = await getAddressListApi();
      logger.log(
        '📍 [ADDRESS] Raw API Response:',
        response,
      );

      const addressList = Array.isArray(response?.data)
        ? response.data
        : response?.data?.items || response?.data || [];

      if (addressList.length > 0) {
        const storedSelectedId = await secureStore.getItem('selectedAddressId');

        let selectionFound = false;
        const mappedAddresses = addressList
          .map(addr => {
            const validId = addr.custAddressId || addr.addressId || addr.id;
            if (!validId)
              logger.warn('⚠️ [ADDRESS] Found address with no ID:', addr);

            let isSelected = false;
            if (storedSelectedId && String(validId) === storedSelectedId) {
              isSelected = true;
              selectionFound = true;
            }

            const rawWithId = { ...addr, addressId: validId };

            return {
              id: validId,
              type: addr.addressType || 'Home',
              address: `${addr.addLine1}, ${addr.addLine2}${
                addr.landmark ? `, ${addr.landmark}` : ''
              }`,
              phone: addr.phone,
              pin: addr.pincode,
              pincodeAreaId: addr.pincodeAreaId,
              icon:
                addr.addressType?.toLowerCase() === 'home'
                  ? require('../assets/images/home_icon.png')
                  : require('../assets/images/office_icon.png'),
              selected: isSelected,
              threeDotsClicked: false,
              raw: rawWithId,
            };
          })
          .filter(addr => {
            if (!addr.id) {
              logger.warn(
                '⚠️ [ADDRESS] Skipping address due to missing ID:',
                addr,
              );
              return false;
            }
            return true;
          });

        if (mappedAddresses.length > 0 && !selectionFound) {
        }
        logger.log('📍 [ADDRESS] Mapped addresses:', mappedAddresses.length);
        setAddresses(mappedAddresses);
        addressesRef.current = mappedAddresses;
      } else {
        logger.log('📍 [ADDRESS] No addresses found in response');
        setAddresses([]);
        addressesRef.current = [];
      }
    } catch (error) {
      logger.error('Error fetching addresses:', error);
    } finally {
      setIsLoadingAddresses(false);
    }
  }, []);

  const onSelectAddress = useCallback(
    async (addressId, showConfirmationPopup = true) => {
      logger.log(
        '👆 [ADDRESS] Selecting addressId:',
        addressId,
        'showConfirmationPopup:',
        showConfirmationPopup,
      );
      if (!addressId) {
        logger.warn(
          '⚠️ [ADDRESS] Attempted to select invalid addressId:',
          addressId,
        );
        return;
      }

      try {
        await secureStore.setItem('selectedAddressId', String(addressId));
      } catch (e) {
        logger.log('Error saving selectedAddressId', e);
      }

      const selectedAddr = addresses.find(
        item => String(item.id) === String(addressId),
      );
      if (!selectedAddr) {
        logger.warn(
          '⚠️ [ADDRESS] Selected address not found in local list:',
          addressId,
        );
        return;
      }

      setHasAlertedServiceability(false);
      setAddresses(prev =>
        prev.map(item => ({
          ...item,
          selected: String(item.id) === String(addressId),
        })),
      );

      if (showConfirmationPopup) {
        const pincode = selectedAddr.pin || '';
        const area =
          selectedAddr.raw?.areaName ||
          selectedAddr.raw?.pincodeAreaName ||
          selectedAddr.raw?.area_name ||
          'N/A';

        setShowAddressModal(false);

        try {
          const loadRes = await loadCart(selectedAddr.pincodeAreaId);
          logger.log(
            '📍 [ADDRESS] Selection List Response:',
            loadRes,
          );

          const isUnserviceable = loadRes?.isUnserviceable;

          setTimeout(() => {
            if (isUnserviceable) {
              logger.log(
                '📍 [ADDRESS] Store not found detected in list, skipping summary and popup.',
              );
              setHasAlertedServiceability(true);
            } else {
              setError(null);
              setServiceabilityTrigger(false);
              setHasAlertedServiceability(false);
              setAddressConfirmationData({
                pincode,
                areaName: area,
                isServiceable: true,
              });
              refreshCart(selectedAddr.pincodeAreaId);
            }
          }, 400);
        } catch (err) {
          logger.error('Validation error in onSelectAddress:', err);
          setTimeout(() => {
            setServiceabilityTrigger(true);
            setHasAlertedServiceability(true);
          }, 400);
        }
      } else {
        refreshCart(selectedAddr.pincodeAreaId);
      }
    },
    [addresses, refreshCart, loadCart],
  );

  const onThreeDotsClicked = useCallback(addressId => {
    setAddresses(prev =>
      prev.map(item => ({ ...item, threeDotsClicked: item.id === addressId })),
    );
  }, []);

  const onDeleteClicked = useCallback(
    async addressId => {
      setShowAddressModal(false);

      setTimeout(() => {
        showConfirmation({
          title: 'Delete Address',
          message: 'Are you sure you want to delete this address?',
          confirmText: 'Delete',
          onConfirm: async () => {
            try {
              const response = await deleteAddressApi(addressId);
              if (response?.success) {
                setAddresses(prev => {
                  const deletedItem = prev.find(item => item.id === addressId);
                  const newList = prev.filter(item => item.id !== addressId);

                  if (deletedItem?.selected && newList.length > 0) {
                    newList[0].selected = true;
                  }
                  return newList;
                });
                Toast.show('Address deleted successfully');
              } else {
                showStatus({
                  type: 'error',
                  title: 'Error',
                  message: response?.message || 'Failed to delete address',
                });
              }
            } catch (error) {
              logger.error('Error deleting address:', error);
              showStatus({
                type: 'error',
                title: 'Error',
                message:
                  typeof error === 'string'
                    ? error
                    : 'Failed to delete address',
              });
            }
          },
        });
      }, 400);
    },
    [deleteAddressApi, showConfirmation, showStatus],
  );

  const onCloseThreeDots = useCallback(() => {
    setAddresses(prev =>
      prev.map(item => ({ ...item, threeDotsClicked: false })),
    );
  }, []);

  const clearSelectedAddress = useCallback(async () => {
    try {
      await secureStore.removeItem('selectedAddressId');
    } catch (e) {
      logger.log('Error clearing selectedAddressId', e);
    }
    setAddresses(prev => prev.map(item => ({ ...item, selected: false })));
  }, []);

  const loadCart = useCallback(
    async pincodeAreaIdOverride => {
      if (loadRequestRef.current) {
        return loadRequestRef.current;
      }

      setIsLoading(true);
      const promise = (async () => {
        try {
          const response = await getCartApi(pincodeAreaIdOverride);
          logger.log(
            '🛒 [CART] API Response:',
            response,
          );
          let fetchedCartVersion = null;
          let normalizedItems = [];

          if (response && response.data) {
            if (response.data.cart && response.data.cart.cartVersion) {
              fetchedCartVersion = response.data.cart.cartVersion;
              updateCartVersion(fetchedCartVersion);
            }
            if (response.data.cart && response.data.cart.cartId) {
              setCartId(response.data.cart.cartId);
              cartIdRef.current = response.data.cart.cartId;
            }
            if (response.data.items) {
              const items = Array.isArray(response.data.items)
                ? response.data.items
                : [];
              normalizedItems = items.map(item => ({
                ...item,
                quantity: item.quantity || item.addedQty || 1,
              }));
              setCartItems(normalizedItems);
              prefetchProductImages(normalizedItems);
            } else {
              setCartItems([]);
            }
          } else {
            setCartItems([]);
          }

          const isUnserviceable =
            response?.status === 'STORE_NOT_FOUND' ||
            response?.status === 'STORE_CLOSED_FOR_DELIVERY' ||
            String(response?.message || '')
              .toLowerCase()
              .includes('no store') ||
            String(response?.message || '')
              .toLowerCase()
              .includes('not found');

          if (response && isUnserviceable) {
            setError(
              'Delivery not available to the selected address.Please select another address.',
            );
            if (!hasAlertedServiceability) {
              setServiceabilityTrigger(true);
              setHasAlertedServiceability(true);
            }
          } else {
            setError(null);
            setServiceabilityTrigger(false);
            failedPincodesRef.current.clear();
          }
          return {
            success: true,
            cartVersion: fetchedCartVersion,
            isUnserviceable,
            status: response?.status,
            message: response?.message,
            items: normalizedItems,
          };
        } catch (error) {
          logger.error('🛒 [CART] Error loading cart:', error);
          setCartItems([]);
          const errorMsg =
            error?.message || error || 'Store not found for this area';
          setError(errorMsg);
          return { success: false, error: errorMsg, isUnserviceable: true };
        } finally {
          setIsLoading(false);
          loadRequestRef.current = null;
        }
      })();

      loadRequestRef.current = promise;
      return promise;
    },
    [updateCartVersion],
  );

  const getCartSummary = useCallback(
    async (
      deliveryMode = 'express',
      deliverySlotId = null,
      cartVersionOverride = null,
      pincodeAreaId = null,
      cartIdOverride = null,
      isAutoReload = false,
    ) => {
      if (summaryRequestRef.current) {
        return summaryRequestRef.current;
      }

      const promise = (async () => {
        try {
          const versionToUse = cartVersionOverride || cartVersionRef.current;
          const idToUse = cartIdOverride || cartIdRef.current;
          logger.log(
            '📊 [SUMMARY] Calling with version:',
            versionToUse,
            'cartId:',
            idToUse,
            'pincodeAreaId:',
            pincodeAreaId,
          );
          const response = await getCartSummaryApi(
            deliveryMode,
            deliverySlotId,
            versionToUse,
            idToUse,
            pincodeAreaId,
          );
          logger.log(
            '📊 [SUMMARY] Response:',
            response,
          );

          if (response && response.success && response.data) {
            setCartSummary(response.data);

            if (
              response.status === 'STORE_NOT_FOUND' ||
              response.status === 'STORE_CLOSED_FOR_DELIVERY'
            ) {
              setError(response.message || 'Store not available for this area');
              if (!hasAlertedServiceability) {
                setServiceabilityTrigger(true);
                setHasAlertedServiceability(true);
              }
            } else {
              setError(null);
              setServiceabilityTrigger(false);
              failedPincodesRef.current.clear();
            }

            if (response.data.cartVersion) {
              updateCartVersion(response.data.cartVersion);
              logger.log(
                '📊 [SUMMARY] Updated cartVersion to:',
                response.data.cartVersion,
              );
            }
            if (response.data.cartId) {
              setCartId(response.data.cartId);
              cartIdRef.current = response.data.cartId;
            }
            return {
              success: true,
              data: response.data,
              cartVersion: response.data.cartVersion,
            };
          } else {
            const status = response?.status;
            const isKnownUnserviceableStatus =
              status === 'STORE_NOT_FOUND' ||
              status === 'STORE_CLOSED_FOR_DELIVERY';

            const defaultErrorMsg =
              isKnownUnserviceableStatus || serviceabilityTrigger
                ? 'Delivery not available to the selected address.Please select another address'
                : 'Some items in cart are unavailable.Remove them or change address';

            const errorMsg = response?.message || defaultErrorMsg;

            if (
              errorMsg.toLowerCase().includes('cart not found') ||
              status === 'CART_NOT_FOUND'
            ) {
              logger.log(
                '🔄 [SUMMARY] Cart not found/expired. Resetting local cart...',
              );
              setCartId(null);
              cartIdRef.current = null;
              updateCartVersion(null);
              setCartItems([]);
              setCartSummary(null);
              setTimeout(() => loadCart(), 100);
              return {
                success: false,
                error: 'Your cart session has expired. Refreshing...',
                status: 'CART_NOT_FOUND',
              };
            }

            if (!isAutoReload && errorMsg.toLowerCase().includes('modified')) {
              logger.log(
                '🔄 [SUMMARY] Cart modified error caught. Auto-reloading...',
              );
              setTimeout(async () => {
                const loadResult = await loadCart();
                const newListVersion = loadResult?.cartVersion;
                await getCartSummary(
                  deliveryMode,
                  deliverySlotId,
                  newListVersion,
                  pincodeAreaId,
                  cartIdOverride,
                  true,
                );
              }, 0);

              setCartSummary(null);
              setError(null);
              return { success: false, error: 'Auto-reloading...', status };
            }

            setCartSummary(null);
            setError(errorMsg);

            const isLiteralUnserviceable =
              isKnownUnserviceableStatus ||
              String(errorMsg).toLowerCase().includes('no store') ||
              String(errorMsg).toLowerCase().includes('not found') ||
              String(errorMsg).toLowerCase().includes('pincode area') ||
              String(errorMsg).toLowerCase().includes('closed for delivery');

            if (isLiteralUnserviceable) {
              if (!hasAlertedServiceability) {
                setServiceabilityTrigger(true);
                setHasAlertedServiceability(true);
              }
            }

            return {
              success: false,
              error: errorMsg,
              status: status,
            };
          }
        } catch (error) {
          logger.error('Error fetching cart summary:', error);
          setError('Error fetching cart summary');
          return { success: false, error };
        } finally {
          summaryRequestRef.current = null;
        }
      })();

      summaryRequestRef.current = promise;
      return promise;
    },
    [updateCartVersion, loadCart],
  );

  const refreshCart = useCallback(
    async pincodeAreaIdOverride => {
      const selectedAddress = addressesRef.current.find(a => a.selected);
      const pincodeAreaId =
        pincodeAreaIdOverride !== undefined
          ? pincodeAreaIdOverride
          : selectedAddress?.pincodeAreaId;

      logger.log('🔄 [CART] Refreshing items and summary sequentially...');
      const loadRes = await loadCart(pincodeAreaId);

      const items = loadRes?.items || [];

      const hasInvalidItems = items.some(
        item =>
          item.unavailable === 1 ||
          item.insufficientStock === 1 ||
          item.notAvailableInStore === 1 ||
          item.qtyAvailable === 0,
      );

      if (loadRes?.isUnserviceable || hasInvalidItems) {
        logger.log(
          `🔄 [CART] Skipping summary refresh: ${
            loadRes?.isUnserviceable
              ? 'Area unserviceable'
              : 'Has sold-out items'
          }.`,
        );
        setCartSummary(null);
        return;
      }

      const version = loadRes?.cartVersion || cartVersionRef.current;
      await getCartSummary('express', null, version, pincodeAreaId);
    },
    [loadCart, getCartSummary],
  );

  const handleStoreNotFound = useCallback(async () => {
    if (!serviceabilityTrigger) return;
    logger.log('📍 [CART] Serviceability trigger activated');
  }, [serviceabilityTrigger]);

  useEffect(() => {
    if (serviceabilityTrigger) {
      handleStoreNotFound();
    }
  }, [serviceabilityTrigger, handleStoreNotFound]);

  const addToCart = useCallback(
    async (item, pincodeAreaIdOverride = null) => {
      const productId = item.productId || item.id;

      prefetchProductImages([item]);

      logger.log('➕ [ADD TO CART] Adding product:', {
        productId,
        name: item.prName || item.productName || item.name,
        price: item.specialPrice || item.unitPrice || item.price,
      });

      setCartItems(prevItems => {
        const itemId = String(productId);
        const existingItem = prevItems.find(i => {
          const cartProdId = String(i.productId || i.id);
          return cartProdId === itemId;
        });

        if (existingItem) {
          return prevItems.map(i => {
            const cartProdId = String(i.productId || i.id);
            return cartProdId === itemId
              ? { ...i, quantity: (i.quantity || 1) + 1 }
              : i;
          });
        }
        return [...prevItems, { ...item, productId, quantity: 1 }];
      });

      const rollback = () => {
        setCartItems(prevItems => {
          const existingItem = prevItems.find(
            i => String(i.productId || i.id) === String(productId),
          );
          if (existingItem && existingItem.quantity > 1) {
            return prevItems.map(i =>
              String(i.productId || i.id) === String(productId)
                ? { ...i, quantity: i.quantity - 1 }
                : i,
            );
          }
          return prevItems.filter(
            i => String(i.productId || i.id) !== String(productId),
          );
        });
      };

      try {
        const response = await addToCartApi(
          productId,
          1,
          pincodeAreaIdOverride || profile?.pincode,
        );
        logger.log(
          '➕ [ADD TO CART] API Response:',
          response,
        );

        if (response && response.success === false) {
          rollback();
          const isStoreNotFound = response.message
            ?.toLowerCase()
            .includes('store not found');
          if (isMaxQuantityMessage(response.message)) {
            if (!isStoreNotFound) {
              setQuantityLimitConfig({
                message: response.message,
                maxQuantity: parseMaxQuantity(response.message),
              });
            }
          } else if (
            response.status === 'INSUFFICIENT_STOCK' ||
            response.message?.includes('stock')
          ) {
            if (!isStoreNotFound) {
              Toast.show('Requested qty is not available', Toast.LONG);
            }
          } else if (!response.message?.toLowerCase().includes('modified')) {
            if (!isStoreNotFound) {
              Toast.show(
                response.message || 'Failed to add to cart',
                Toast.SHORT,
              );
            }
          }
          await refreshCart();
          return;
        }

        await refreshCart(pincodeAreaIdOverride || profile?.pincode);
      } catch (error) {
        logger.error('➕ [ADD TO CART] API Error:', error);
        const errorMsg =
          typeof error === 'string'
            ? error
            : error?.Message || error?.message || '';
        const isStoreNotFound =
          error &&
          (String(error).toLowerCase().includes('store not found') ||
            error?.message?.toLowerCase().includes('store not found'));
        const lowerMsg = errorMsg.toLowerCase();
        const isStockError =
          lowerMsg.includes('stock') || lowerMsg.includes('available');
        if (isMaxQuantityMessage(errorMsg) && !isStoreNotFound) {
          setQuantityLimitConfig({
            message: errorMsg,
            maxQuantity: parseMaxQuantity(errorMsg),
          });
        } else if (isStockError && !isStoreNotFound) {
          Toast.show('Requested qty is not available', Toast.LONG);
        } else if (errorMsg && !isStoreNotFound) {
        }

        rollback();
        await refreshCart(pincodeAreaIdOverride || profile?.pincode);
      }
    },
    [refreshCart],
  );

  const removeFromCart = useCallback(
    async (identifier, pincodeAreaIdOverride = null) => {
      let removedItem = null;
      let cartItemId = identifier;
      const identifierStr = String(identifier);
      const itemToRemove = cartItems.find(
        item =>
          String(item.cartItemId) === identifierStr ||
          String(item.productId || item.id) === identifierStr,
      );

      if (itemToRemove) {
        cartItemId = itemToRemove.cartItemId;
        removedItem = itemToRemove;
      } else {
        logger.warn('🛒 [REMOVE] Item not found for identifier:', identifier);
        return;
      }
      setCartItems(prevItems => {
        const newItems = prevItems.filter(item => item !== removedItem);
        if (newItems.length === 0) {
          try {
            secureStore.removeItem('selectedAddressId');
            setAddresses(prev => prev.map(a => ({ ...a, selected: false })));
          } catch (e) {
            logger.log('Error removing selectedAddressId', e);
          }
        }
        return newItems;
      });

      logger.log('Removed from cart local:', cartItemId);

      try {
        const version = cartVersionRef.current;
        const response = await removeFromCartApi(
          cartItemId,
          version,
          removedItem?.productId || removedItem?.id,
          pincodeAreaIdOverride,
        );
        logger.log('Removed from cart API:', response);
        await refreshCart(pincodeAreaIdOverride);
      } catch (error) {
        logger.error('Error removing from cart API:', error);
        if (removedItem) {
          setCartItems(prevItems => [...prevItems, removedItem]);
        }
        await refreshCart(pincodeAreaIdOverride);
      }
    },
    [cartItems, refreshCart],
  );

  const updateCartItemQuantity = useCallback(
    async (cartItemId, quantity, pincodeAreaIdOverride = null) => {
      const cartItemIdStr = String(cartItemId);
      logger.log('🔄 [UPDATE QTY] Requested:', {
        cartItemId: cartItemIdStr,
        newQuantity: quantity,
      });

      if (quantity <= 0) {
        logger.log('🔄 [UPDATE QTY] Quantity is 0, removing item');
        return removeFromCart(cartItemId);
      }

      let oldQuantity = 1;
      setCartItems(prevItems => {
        const updated = prevItems.map(item => {
          if (
            String(item.cartItemId || item.productId || item.id) ===
            cartItemIdStr
          ) {
            oldQuantity = item.quantity || 1;
            return { ...item, quantity, addedQty: quantity };
          }
          return item;
        });
        cartItemsRef.current = updated;
        return updated;
      });

      if (debounceTimersRef.current[cartItemIdStr]) {
        clearTimeout(debounceTimersRef.current[cartItemIdStr]);
      }

      setUpdatingItems(prev =>
        prev.includes(cartItemIdStr) ? prev : [...prev, cartItemIdStr],
      );

      debounceTimersRef.current[cartItemIdStr] = setTimeout(async () => {
        try {
          const version = cartVersionRef.current;
          const response = await updateCartItemApi(
            cartItemId,
            quantity,
            version,
            null,
            pincodeAreaIdOverride,
          );
          logger.log(
            '🔄 [UPDATE QTY] API Response:',
            response,
          );

          if (response && response.success) {
            const freshVersion = response.data?.cart?.cartVersion;

            if (freshVersion) {
              updateCartVersion(freshVersion);

              const selectedAddress = addressesRef.current.find(
                a => a.selected,
              );
              const pincodeAreaId =
                pincodeAreaIdOverride !== undefined
                  ? pincodeAreaIdOverride
                  : selectedAddress?.pincodeAreaId;

              const hasInvalidItems = cartItemsRef.current.some(
                cartItem =>
                  cartItem.unavailable === 1 ||
                  cartItem.insufficientStock === 1 ||
                  cartItem.notAvailableInStore === 1 ||
                  cartItem.qtyAvailable === 0,
              );

              if (hasInvalidItems) {
                logger.log(
                  '🔄 [UPDATE QTY] Skipping summary refresh: has sold-out items.',
                );
                setCartSummary(null);
              } else {
                await getCartSummary(
                  'express',
                  null,
                  freshVersion,
                  pincodeAreaId,
                );
              }
            } else {
              await refreshCart(pincodeAreaIdOverride);
            }
          } else if (response && response.message) {
            throw response.message;
          }
        } catch (error) {
          logger.error('🔄 [UPDATE QTY] API Error:', error);
          const errorMsg =
            typeof error === 'string'
              ? error
              : error?.Message || error?.message || '';
          const isStoreNotFound =
            error &&
            (String(error).toLowerCase().includes('store not found') ||
              error?.message?.toLowerCase().includes('store not found'));

          const lowerMsg = errorMsg.toLowerCase();

          if (!isStoreNotFound) {
            if (isMaxQuantityMessage(errorMsg)) {
              setQuantityLimitConfig({
                message: errorMsg,
                maxQuantity: parseMaxQuantity(errorMsg),
              });
            } else if (
              lowerMsg.includes('stock') ||
              lowerMsg.includes('available')
            ) {
              Toast.show('Requested qty is not available', Toast.LONG);
            }
          }

          setCartItems(prevItems =>
            prevItems.map(item =>
              String(item.cartItemId || item.productId || item.id) ===
              cartItemIdStr
                ? { ...item, quantity: oldQuantity, addedQty: oldQuantity }
                : item,
            ),
          );
          await refreshCart(pincodeAreaIdOverride);
        } finally {
          setUpdatingItems(prev => prev.filter(id => id !== cartItemIdStr));
          delete debounceTimersRef.current[cartItemIdStr];
        }
      }, 500);
    },
    [removeFromCart, refreshCart, updateCartVersion, getCartSummary],
  );

  const clearCart = useCallback(async () => {
    const previousItems = cartItems;
    try {
      setCartItems([]);
      setCartSummary(null);

      try {
        await secureStore.removeItem('selectedAddressId');
        setAddresses(prev => prev.map(item => ({ ...item, selected: false })));
      } catch (clearErr) {
        logger.log('Error clearing selectedAddressId', clearErr);
      }

      const version = cartVersionRef.current;
      const response = await clearCartApi(version, cartIdRef.current);
      logger.log('Cart cleared:', response);
    } catch (error) {
      logger.error('Error clearing cart:', error);
      setCartItems(previousItems);
      await refreshCart();
    }
  }, [cartItems, refreshCart]);

  const applyCoupon = useCallback(
    async couponCode => {
      try {
        const version = cartVersionRef.current;
        const selectedAddress = addresses.find(a => a.selected);
        const pincodeAreaId = selectedAddress?.pincodeAreaId;

        const response = await applyCouponApi(
          couponCode,
          version,
          pincodeAreaId,
          cartIdRef.current,
        );
        logger.log('Coupon Applied:', response);
        if (
          response &&
          (response.success === true || response.status === 'OK')
        ) {
          await refreshCart();
          return {
            success: true,
            message: response.message || 'Coupon applied successfully',
          };
        } else {
          const msg = response?.message || 'Failed to apply coupon';
          if (msg.toLowerCase().includes('modified')) {
            logger.log(
              '🔄 [CART] Auto-refreshing cart due to modified error in applyCoupon',
            );
            await refreshCart();
          }
          return { success: false, message: msg, status: response?.status };
        }
      } catch (error) {
        logger.error('Error applying coupon:', error);
        const msg =
          error.message ||
          error.Message ||
          (typeof error === 'string' ? error : 'Failed to apply coupon');
        if (
          msg.toLowerCase().includes('modified') ||
          error?.response?.data?.status === 'CART_VERSION_MISMATCH' ||
          error?.data?.status === 'CART_VERSION_MISMATCH'
        ) {
          logger.log(
            '🔄 [CART] Auto-refreshing cart due to modified error in applyCoupon catch',
          );
          await refreshCart();
        }
        return { success: false, message: msg };
      }
    },
    [refreshCart],
  );

  const removeCoupon = useCallback(async () => {
    try {
      const version = cartVersionRef.current;
      const response = await removeCouponApi(version, cartIdRef.current);
      logger.log('Coupon Removed:', response);
      await refreshCart();
      return { success: true };
    } catch (error) {
      logger.error('Error removing coupon:', error);
      return {
        success: false,
        message: error.Message || 'Failed to remove coupon',
      };
    }
  }, [refreshCart]);

  const applyBCoins = useCallback(
    async bcoins => {
      try {
        const version = cartVersionRef.current;
        logger.log('🪙 [BCOIN] Applying with version:', version);
        const response = await applyBCoinApi(
          bcoins,
          version,
          cartIdRef.current,
        );
        logger.log('🪙 [BCOIN] Applied:', response);
        if (response && response.success) {
          await refreshCart();
          return {
            success: true,
            message: response.message || 'UD Coins applied successfully',
          };
        } else {
          if (msg?.toLowerCase().includes('modified')) {
            logger.log('🚫 [CART] Suppressing modified Toast:', msg);
          } else {
            Toast.show(msg, Toast.LONG);
          }
          return { success: false, message: msg };
        }
      } catch (error) {
        logger.error('Error applying BCoins:', error);
        const msg =
          error.message ||
          error.Message ||
          (typeof error === 'string' ? error : 'Failed to apply UD Coins');
        if (
          error?.response?.data?.status === 'CART_VERSION_MISMATCH' ||
          error?.data?.status === 'CART_VERSION_MISMATCH'
        ) {
          await refreshCart();
        }
        if (!msg.toLowerCase().includes('modified')) {
          Toast.show(msg, Toast.LONG);
        }
        return { success: false, message: msg };
      }
    },
    [refreshCart],
  );

  const removeBCoins = useCallback(async () => {
    try {
      const version = cartVersionRef.current;
      logger.log('🪙 [BCOIN] Removing with version:', version);
      const response = await removeBCoinApi(version, cartIdRef.current);
      logger.log('🪙 [BCOIN] Removed:', response);
      if (response && response.success) {
        await refreshCart();
        return { success: true };
      } else {
        if (msg?.toLowerCase().includes('modified')) {
          logger.log('🚫 [CART] Suppressing modified Toast:', msg);
        } else {
          Toast.show(msg, Toast.LONG);
        }
        return { success: false, message: msg };
      }
    } catch (error) {
      logger.error('Error removing BCoins:', error);
      const msg =
        error.message ||
        error.Message ||
        (typeof error === 'string' ? error : 'Failed to remove UD Coins');
      if (
        error?.response?.data?.status === 'CART_VERSION_MISMATCH' ||
        error?.data?.status === 'CART_VERSION_MISMATCH'
      ) {
        await refreshCart();
      }
      if (!msg.toLowerCase().includes('modified')) {
        Toast.show(msg, Toast.LONG);
      }
      return { success: false, message: msg };
    }
  }, [refreshCart]);

  const applyGiftCard = useCallback(
    async giftCode => {
      try {
        const version = cartVersionRef.current;
        const selectedAddress = addresses.find(a => a.selected);
        const pincodeAreaId = selectedAddress?.pincodeAreaId;

        const response = await applyGiftCardApi(
          giftCode,
          version,
          pincodeAreaId,
          cartIdRef.current,
        );
        logger.log('Gift Card Applied:', response);
        if (
          response &&
          (response.success === true || response.status === 'OK')
        ) {
          await refreshCart();
          return {
            success: true,
            message: response.message || 'Gift card applied successfully',
          };
        } else {
          const msg = response?.message || 'Failed to apply gift card';
          if (msg.toLowerCase().includes('modified')) {
            logger.log(
              '🔄 [CART] Auto-refreshing cart due to modified error in applyGiftCard',
            );
            await refreshCart();
          }
          return { success: false, message: msg, status: response?.status };
        }
      } catch (error) {
        logger.error('Error applying gift card:', error);
        const msg =
          error.Message || error.message || 'Failed to apply gift card';
        if (
          msg.toLowerCase().includes('modified') ||
          error?.response?.data?.status === 'CART_VERSION_MISMATCH'
        ) {
          logger.log(
            '🔄 [CART] Auto-refreshing cart due to modified error in applyGiftCard catch',
          );
          await refreshCart();
        }
        return { success: false, message: msg };
      }
    },
    [refreshCart],
  );

  const removeGiftCard = useCallback(async () => {
    try {
      const version = cartVersionRef.current;
      const response = await removeGiftCardApi(version, cartIdRef.current);
      logger.log('Gift Card Removed:', response);
      await refreshCart();
      return { success: true };
    } catch (error) {
      logger.error('Error removing gift card:', error);
      return {
        success: false,
        message: error.Message || 'Failed to remove gift card',
      };
    }
  }, [refreshCart]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = item.specialPrice || item.unitPrice || item.price || 0;
      const quantity = item.quantity || 1;
      return sum + price * quantity;
    }, 0);
  }, [cartItems]);

  const cartEntryById = useMemo(() => {
    const index = new Map();
    for (const item of cartItems) {
      const id = item.productId ?? item.id;
      if (id === undefined || id === null) continue;
      index.set(String(id), {
        quantity: item.quantity || item.addedQty || 0,
        cartItemId: item.cartItemId,
      });
    }
    return index;
  }, [cartItems]);

  const value = useMemo(
    () => ({
      cartItems,
      cartEntryById,
      cartCount,
      cartTotal,
      cartSummary,
      isLoading,
      error,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      loadCart,
      getCartSummary,
      refreshCart,
      clearCart,
      applyCoupon,
      removeCoupon,
      applyGiftCard,
      removeGiftCard,
      applyBCoins,
      removeBCoins,
      updatingItems,

      addresses,
      isLoadingAddresses,
      fetchAddresses,
      onSelectAddress,
      onThreeDotsClicked,
      onDeleteClicked,
      onCloseThreeDots,
      clearSelectedAddress,
      showAddressModal,
      setShowAddressModal,
      addressConfirmationData,
      setAddressConfirmationData,
      showConfirmation,
      showStatus,
      serviceabilityTrigger,
      setServiceabilityTrigger,
    }),
    [
      cartItems,
      cartEntryById,
      cartCount,
      cartTotal,
      cartSummary,
      isLoading,
      error,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      loadCart,
      getCartSummary,
      refreshCart,
      clearCart,
      applyCoupon,
      removeCoupon,
      applyGiftCard,
      removeGiftCard,
      applyBCoins,
      removeBCoins,
      updatingItems,
      addresses,
      isLoadingAddresses,
      fetchAddresses,
      onSelectAddress,
      onThreeDotsClicked,
      onDeleteClicked,
      onCloseThreeDots,
      clearSelectedAddress,
      showAddressModal,
      setShowAddressModal,
      addressConfirmationData,
      setAddressConfirmationData,
      showConfirmation,
      showStatus,
      serviceabilityTrigger,
      setServiceabilityTrigger,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {confirmationConfig && (
        <ConfirmationModal
          visible={!!confirmationConfig}
          onClose={() => setConfirmationConfig(null)}
          onConfirm={confirmationConfig.onConfirm}
          onCancel={confirmationConfig.onCancel}
          title={confirmationConfig.title}
          message={confirmationConfig.message}
          confirmText={confirmationConfig.confirmText}
          cancelText={confirmationConfig.cancelText}
          dismissible={confirmationConfig.dismissible !== false}
        />
      )}
      {statusConfig && (
        <StatusModal
          visible={!!statusConfig}
          type={statusConfig.type}
          title={statusConfig.title}
          message={statusConfig.message}
          onClose={() => {
            statusConfig.onClose?.();
            setStatusConfig(null);
          }}
        />
      )}
      {quantityLimitConfig && (
        <QuantityLimitModal
          visible={!!quantityLimitConfig}
          message={quantityLimitConfig.message}
          maxQuantity={quantityLimitConfig.maxQuantity}
          onClose={() => setQuantityLimitConfig(null)}
        />
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

const EMPTY_CART_ENTRY = { quantity: 0, cartItemId: undefined };

export const useCartEntry = itemId => {
  const { cartEntryById } = useContext(CartContext);
  return useMemo(() => {
    const entry = cartEntryById?.get(String(itemId));
    if (!entry) return EMPTY_CART_ENTRY;
    return {
      quantity: entry.quantity,
      cartItemId: entry.cartItemId ?? itemId,
    };
  }, [cartEntryById, itemId]);
};

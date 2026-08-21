import { useCallback, useEffect, useMemo, useState } from 'react';
import Toast from 'react-native-simple-toast';
import { useCartActions, useCartEntry } from '@/context/CartContext';
import { maxQtyMessage } from '@/utils/cartQuantityLimits';
import { useIsWishlisted, useWishlistActions } from '@/context/WishlistContext';
import { impactTick, selectionTick } from '@/utils/haptics';
import useOpaqueImageWell from '@/hooks/useOpaqueImageWell';
import { NO_IMAGE_SOURCE } from '../constants';
import {
  buildAccessibilityActions,
  buildCardAccessibilityLabel,
  deriveProductFields,
  getRawImage,
  resolveImageSource,
} from '../utils';

/**
 * All of the card's state: derived product fields, cart/wishlist wiring,
 * image fallback handling and the accessibility surface.
 */
const useTokenProductCard = ({
  item,
  onAdd,
  onToggleWishlist,
  onPress,
  isInWishlist: propIsInWishlist,
  hideWishlist,
}) => {
  const [imageError, setImageError] = useState(false);

  const { addToCart, changeCartItemQuantity } = useCartActions();
  const { toggleWishlist } = useWishlistActions();

  const product = useMemo(() => deriveProductFields(item), [item]);
  const {
    productId,
    name,
    mrp,
    price,
    offer,
    weight,
    isOutOfStock,
    maxQty,
    maxQtyIsStock,
  } = product;

  const { quantity, cartItemId } = useCartEntry(productId);

  const isAtMaxQty = maxQty !== null && quantity >= maxQty;

  const notifyMaxQty = useCallback(() => {
    Toast.show(maxQtyMessage({ maxQty, maxQtyIsStock }), Toast.SHORT);
  }, [maxQty, maxQtyIsStock]);

  const isWishlisted = useIsWishlisted(productId);
  const liked = propIsInWishlist ? propIsInWishlist(productId) : isWishlisted;

  const rawImage = getRawImage(item);

  useEffect(() => {
    setImageError(false);
  }, [rawImage]);

  const imageSource = useMemo(
    () => resolveImageSource(rawImage, imageError),
    [rawImage, imageError],
  );

  const handleImageError = useCallback(() => setImageError(true), []);

  const sampledUri = imageError ? null : imageSource?.uri || null;
  const isOpaqueImage = useOpaqueImageWell(sampledUri);

  const handleToggleWishlist = useCallback(() => {
    selectionTick();
    if (onToggleWishlist) {
      onToggleWishlist(item);
    } else {
      toggleWishlist(item);
    }
  }, [onToggleWishlist, toggleWishlist, item]);

  // Deltas, not absolute targets: the context resolves the new quantity, so
  // taps in the same batch cannot read a stale `quantity` and cancel out.
  // Stepping down to zero removes the line item inside the context.
  const handleDecrement = useCallback(() => {
    selectionTick();
    changeCartItemQuantity(cartItemId, -1);
  }, [cartItemId, changeCartItemQuantity]);

  const handleIncrement = useCallback(() => {
    if (isAtMaxQty) {
      notifyMaxQty();
      return;
    }
    selectionTick();
    changeCartItemQuantity(cartItemId, 1);
  }, [cartItemId, changeCartItemQuantity, isAtMaxQty, notifyMaxQty]);

  const handleAdd = useCallback(() => {
    if (isAtMaxQty) {
      notifyMaxQty();
      return;
    }
    impactTick();
    if (onAdd) {
      onAdd(item);
    } else {
      addToCart(item);
    }
  }, [onAdd, addToCart, item, isAtMaxQty, notifyMaxQty]);

  const cardAccessibilityLabel = useMemo(
    () =>
      buildCardAccessibilityLabel({
        name,
        weight,
        price,
        mrp,
        offer,
        isOutOfStock,
      }),
    [name, weight, price, mrp, offer, isOutOfStock],
  );

  const accessibilityActions = useMemo(
    () =>
      buildAccessibilityActions({
        isOutOfStock,
        quantity,
        hideWishlist,
        liked,
        isAtMaxQty,
      }),
    [isOutOfStock, quantity, hideWishlist, liked, isAtMaxQty],
  );

  const handleAccessibilityAction = useCallback(
    event => {
      switch (event.nativeEvent.actionName) {
        case 'addToCart':
          handleAdd();
          break;
        case 'increment':
          handleIncrement();
          break;
        case 'decrement':
          handleDecrement();
          break;
        case 'toggleWishlist':
          handleToggleWishlist();
          break;
        default:
          onPress?.();
      }
    },
    [
      handleAdd,
      handleIncrement,
      handleDecrement,
      handleToggleWishlist,
      onPress,
    ],
  );

  return {
    product,
    quantity,
    isAtMaxQty,
    liked,
    imageSource,
    isPlaceholder: imageSource === NO_IMAGE_SOURCE,
    isOpaqueImage,
    handleImageError,
    handleToggleWishlist,
    handleIncrement,
    handleDecrement,
    handleAdd,
    cardAccessibilityLabel,
    accessibilityActions,
    handleAccessibilityAction,
  };
};

export default useTokenProductCard;

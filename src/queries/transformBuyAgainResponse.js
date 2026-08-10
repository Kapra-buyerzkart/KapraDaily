/**
 * "Buy it again" has no endpoint of its own — `order/mine` returns an image CSV
 * rather than line items, so the rail is assembled here: walk the newest orders,
 * dedupe the products inside them, then re-read each product so the card quotes
 * today's price instead of what the customer paid last month.
 */

const asArray = value => (Array.isArray(value) ? value : []);

const extractOrders = response => {
  const data = response?.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data)) return data;
  return [];
};

export const orderIdOf = order => order?.orderId ?? order?.id ?? null;

const isCancelled = order =>
  String(order?.orderStatusText || order?.status || '')
    .toLowerCase()
    .includes('cancel');

/** Unparseable dates collapse to 0, which sorts them last without throwing. */
const orderedAtOf = order => {
  const parsed = Date.parse(
    order?.orderDate || order?.date || order?.time || '',
  );
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const selectRecentOrders = (response, limit) =>
  extractOrders(response)
    .filter(order => orderIdOf(order) !== null && !isCancelled(order))
    .sort((a, b) => orderedAtOf(b) - orderedAtOf(a))
    .slice(0, limit);

const extractOrderItems = response =>
  asArray(response?.data?.items || response?.data?.order_items);

const productIdOf = item => {
  const id = item?.productId ?? item?.id;
  return id === undefined || id === null || id === '' ? null : id;
};

const imageOf = item =>
  item?.image ||
  item?.prImage ||
  item?.productImage ||
  item?.featuredImage ||
  item?.img ||
  null;

/**
 * `orders` is newest-first, so the first sighting of a product is also its most
 * recent one — later sightings only bump the purchase count. Orders whose detail
 * call failed are skipped rather than failing the whole rail.
 */
export const collectPurchases = (orders, detailResults) => {
  const byProduct = new Map();

  orders.forEach((order, index) => {
    if (detailResults[index]?.status !== 'fulfilled') return;

    const orderedAt = orderedAtOf(order);

    extractOrderItems(detailResults[index].value).forEach(item => {
      const productId = productIdOf(item);
      if (productId === null) return;

      const seen = byProduct.get(String(productId));
      if (seen) {
        seen.timesOrdered += 1;
        seen.lastOrderedAt = Math.max(seen.lastOrderedAt, orderedAt);
        return;
      }

      byProduct.set(String(productId), {
        productId,
        orderItem: item,
        timesOrdered: 1,
        lastOrderedAt: orderedAt,
      });
    });
  });

  return Array.from(byProduct.values()).sort(
    (a, b) => b.lastOrderedAt - a.lastOrderedAt,
  );
};

/** `product/{id}` wraps the product on some routes and returns it bare on others. */
const extractProduct = response => {
  const payload = response?.data;
  const product = payload?.product || payload;
  if (!product || (product.productId ?? product.id) === undefined) return null;
  return { product, images: asArray(payload?.images) };
};

// Only an explicit signal counts as unavailable: a missing stockQty is unknown,
// not zero, and dropping those would empty the rail on leaner payloads.
const isUnavailable = product =>
  product?.isAvailable === false || Number(product?.stockQty) === 0;

/**
 * Folds the live product over the purchase record. Returns null when the product
 * can no longer be bought here, so one dead lookup costs one card rather than
 * putting a stale price on screen.
 */
export const mergePurchase = (purchase, response) => {
  const extracted = extractProduct(response);
  if (!extracted) return null;

  const { product, images } = extracted;
  if (isUnavailable(product)) return null;

  return {
    ...product,
    productId: product.productId ?? product.id,
    featuredImage:
      product.featuredImage ||
      images[0]?.imageUrl ||
      imageOf(purchase.orderItem),
    timesOrdered: purchase.timesOrdered,
    lastOrderedAt: purchase.lastOrderedAt,
  };
};

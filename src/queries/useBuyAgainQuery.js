import { useQuery } from '@tanstack/react-query';
import { getMyOrdersApi, getOrderApi } from '../api/orderService';
import { getProductDetails } from '../api/productService';
import { buyAgainKeys } from './queryKeys';
import {
  collectPurchases,
  mergePurchase,
  orderIdOf,
  selectRecentOrders,
} from './transformBuyAgainResponse';

// The rail is one screenful, so the scan stays deliberately shallow: a cold
// fetch costs 1 + ORDERS_SCANNED + RAIL_SIZE requests and never grows past it.
const ORDERS_SCANNED = 3;
const RAIL_SIZE = 8;

const useBuyAgainQuery = (custId, areaId, enabled = true) =>
  useQuery({
    queryKey: buyAgainKeys.list(custId, areaId),
    queryFn: async () => {
      const orders = selectRecentOrders(await getMyOrdersApi(), ORDERS_SCANNED);
      if (orders.length === 0) return [];

      const details = await Promise.allSettled(
        orders.map(order => getOrderApi(orderIdOf(order))),
      );

      const purchases = collectPurchases(orders, details).slice(0, RAIL_SIZE);
      if (purchases.length === 0) return [];

      const live = await Promise.allSettled(
        purchases.map(purchase =>
          getProductDetails(purchase.productId, areaId),
        ),
      );

      return purchases
        .map((purchase, index) =>
          live[index].status === 'fulfilled'
            ? mergePurchase(purchase, live[index].value)
            : null,
        )
        .filter(Boolean);
    },
    enabled: enabled && !!custId && !!areaId,
    staleTime: 5 * 60 * 1000,
  });

export default useBuyAgainQuery;

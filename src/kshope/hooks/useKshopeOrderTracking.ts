import { useEffect } from 'react';
import kshopeSignalRService from '../api/services/kshopeSignalRService';
import logger from '../../utils/logger';

export const useKshopeOrderTracking = (
  orderId?: string | number | null,
  onStatusUpdate?: (data: any) => void,
) => {
  useEffect(() => {
    if (!orderId) {
      return;
    }

    const normalizedOrderId = String(orderId);

    const unsubscribe = kshopeSignalRService.onEvent((type, data) => {
      if (type === 'orderUpdate') {
        const updateOrderId = data?.orderId ?? data?.OrderId;

        if (
          updateOrderId !== undefined &&
          updateOrderId !== null &&
          String(updateOrderId) === normalizedOrderId
        ) {
          logger.log(
            `📡 [Kshope Hook] Live order update for #${normalizedOrderId}:`,
            data,
          );
          onStatusUpdate?.(data);
        }
      }
    });

    kshopeSignalRService.subscribeToOrder(orderId).catch(() => {});

    return () => {
      unsubscribe();
      kshopeSignalRService.unsubscribeFromOrder(orderId);
    };
  }, [orderId, onStatusUpdate]);
};

export default useKshopeOrderTracking;

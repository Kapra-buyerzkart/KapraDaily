import { useEffect } from 'react';
import signalRService from '../api/signalRService';

/**
 * Hook to manage real-time order tracking via SignalR.
 * @param {number|string} orderId The ID of the order to track.
 * @param {Function} onStatusUpdate Callback when an order status update is received.
 * @param {Function} onLocationUpdate Callback when a driver location update is received.
 */
export const useOrderTracking = (orderId, onStatusUpdate, onLocationUpdate) => {
    useEffect(() => {
        if (!orderId) return;

        // Register for events
        const unsubscribe = signalRService.onEvent((type, data) => {
            if (type === 'reconnected') {
                // Resubscribe on reconnection
                signalRService.subscribeToOrder(orderId);
                return;
            }

            // Check if the update belongs to this order
            const updateOrderId = data?.orderId || data?.OrderId;

            if (updateOrderId && String(updateOrderId) === String(orderId)) {
                if (type === 'orderUpdate') {
                    onStatusUpdate?.(data);
                }
            }
        });

        const connectAndSubscribe = async () => {
            await signalRService.startConnection();
            await signalRService.subscribeToOrder(orderId);
        };

        connectAndSubscribe();

        return () => {
            unsubscribe();
            // We don't stop the global connection here as other orders or features might use it
        };
    }, [orderId, onStatusUpdate, onLocationUpdate]);
};

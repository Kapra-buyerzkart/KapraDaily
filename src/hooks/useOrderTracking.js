import { useEffect, useState } from 'react';
import signalRService from '../api/signalRService';

export const useOrderTracking = (orderId, onStatusUpdate, onLocationUpdate) => {
    useEffect(() => {
        if (!orderId) return;

        const unsubscribe = signalRService.onEvent((type, data) => {
            if (type === 'reconnected') {
                signalRService.subscribeToOrder(orderId);
                return;
            }

            const updateOrderId = data?.orderId || data?.OrderId;

            if (updateOrderId && String(updateOrderId) === String(orderId)) {
                if (type === 'orderUpdate') {
                    console.log(`📡 [Hook] Order update for ${orderId}:`, data);
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
        };
    }, [orderId, onStatusUpdate, onLocationUpdate]);
};

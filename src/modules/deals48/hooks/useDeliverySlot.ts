import { useState, useCallback, useEffect } from 'react';
import { getDeliverySlotsApi } from '../api/services/cartService';
import { getDeliveryModesApi } from '../api/services/configService';

export const useDeliverySlot = () => {
    const [selectedDeliveryType, setSelectedDeliveryType] = useState<'express' | 'slot'>('express');
    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const [showSlotModal, setShowSlotModal] = useState(false);
    const [datesList, setDatesList] = useState<any[]>([]);
    const [slotsByDate, setSlotsByDate] = useState<any>({});
    const [deliveryMode, setDeliveryMode] = useState<'express' | 'slotted'>('express');
    const [deliveryModes, setDeliveryModes] = useState<any[]>([]);

    useEffect(() => {
        setDeliveryMode(selectedDeliveryType === 'slot' ? 'slotted' : 'express');
    }, [selectedDeliveryType]);

    // Fetch available delivery modes on mount
    useEffect(() => {
        const fetchDeliveryModes = async () => {
            try {
                const response = await getDeliveryModesApi();
                if (response?.success && response?.data) {
                    setDeliveryModes(response.data);
                }
            } catch (error) {
                console.error('Error fetching delivery modes:', error);
            }
        };
        fetchDeliveryModes();
    }, []);

    const fetchSlots = useCallback(async (pincodeAreaId?: number) => {
        try {
            console.log('📅 [SLOTS] Fetching slots for area:', pincodeAreaId);
            const response = await getDeliverySlotsApi(pincodeAreaId);
            if (response && response.success && response.data?.items) {
                const items = response.data.items;
                const dates: any[] = [];
                const grouped: any = {};

                items.forEach((item: any) => {
                    const slots = item.slots || [];
                    if (slots.length === 0) return;

                    // Use the first slot's date as the key for this group
                    const firstSlot = slots[0];
                    const dateVal = firstSlot.slotDate?.split('T')[0];
                    if (!dateVal) return;

                    dates.push({
                        value: dateVal,
                        display: item.title || dateVal
                    });

                    grouped[dateVal] = slots.map((slot: any) => ({
                        ...slot,
                        id: slot.deliverySlotId,
                        date: dateVal,
                        display: slot.slotDisplayText || slot.slotValue,
                        available: slot.isAvailable === 1,
                        // Keep original fields for safety
                        slotValue: slot.slotValue
                    }));
                });

                console.log('📅 [SLOTS] Processed:', dates.length, 'dates');
                setDatesList(dates);
                setSlotsByDate(grouped);
            }
        } catch (error) {
            console.error('Error fetching delivery slots:', error);
        }
    }, [getDeliverySlotsApi]);

    const onSelectDate = useCallback((date: string) => {
        // Logic to handle date selection
    }, []);

    return {
        deliveryMode,
        deliveryModes,
        selectedSlot,
        selectedDeliveryType,
        setSelectedDeliveryType,
        setSelectedSlot,
        showSlotModal,
        setShowSlotModal,
        datesList,
        slotsByDate,
        onSelectDate,
        fetchSlots
    };
};

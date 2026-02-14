import { useState, useMemo, useEffect } from 'react';
import { getDeliveryModesApi } from '../api/configService';

const formatDDMMYYYY = (date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
};

const getNextDates = () => {
    const dates = [];
    for (let i = 0; i < 3; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        dates.push({
            id: i,
            label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'long' }),
            date: d,
            formatted: formatDDMMYYYY(d)
        });
    }
    return dates;
};

export const useDeliverySlot = () => {
    const [selectedDeliveryType, setSelectedDeliveryType] = useState('quick');
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showSlotModal, setShowSlotModal] = useState(false);
    const [deliveryModes, setDeliveryModes] = useState([]);
    const [slotsByDate, setSlotsByDate] = useState({});

    useEffect(() => {
        const fetchDeliveryModes = async () => {
            try {
                const response = await getDeliveryModesApi();
                if (response?.success && response?.data) {
                    setDeliveryModes(response.data);

                    // Map API slots to slotsByDate structure
                    // Assuming API returns data like: [{ type: 'slotted', dates: [{ date: '...', slots: [...] }] }]
                    const slottedMode = response.data.find(m => m.type === 'slotted');
                    if (slottedMode && slottedMode.dates) {
                        const newSlots = {};
                        slottedMode.dates.forEach((d, idx) => {
                            newSlots[idx] = d.slots;
                        });
                        setSlotsByDate(newSlots);
                    }
                }
            } catch (error) {
                console.error('Error fetching delivery modes:', error);
            }
        };
        fetchDeliveryModes();
    }, []);

    const datesList = useMemo(() => getNextDates(), []);

    // Computed delivery mode for API calls
    const deliveryMode = selectedDeliveryType === 'quick' ? 'express' : 'slot';

    const onSelectDate = (index) => {
        setSelectedDateIndex(index);
        setSelectedSlot(null);
    };

    return {
        selectedDeliveryType,
        setSelectedDeliveryType,
        selectedDateIndex,
        selectedSlot,
        setSelectedSlot,
        showSlotModal,
        setShowSlotModal,
        datesList,
        slotsByDate,
        deliveryMode,
        deliveryModes,
        onSelectDate,
    };
};

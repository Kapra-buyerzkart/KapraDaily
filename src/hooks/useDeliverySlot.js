import { useState, useMemo } from 'react';

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

const SLOTS_BY_DATE = {
    0: ['6:00pm - 7:00pm', '7:00pm - 8:00pm', '8:00pm - 9:00pm'],
    1: ['10:00am - 11:00am', '11:00am - 12:00pm', '6:00pm - 7:00pm'],
    2: ['9:00am - 10:00am', '5:00pm - 6:00pm'],
};

export const useDeliverySlot = () => {
    const [selectedDeliveryType, setSelectedDeliveryType] = useState('quick');
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showSlotModal, setShowSlotModal] = useState(false);

    const datesList = useMemo(() => getNextDates(), []);
    const slotsByDate = SLOTS_BY_DATE;

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
        onSelectDate,
    };
};

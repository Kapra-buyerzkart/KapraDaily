import { useState, useCallback } from 'react';

const DEFAULT_ADDRESSES = [
    {
        id: '1',
        type: 'Home',
        address: 'american city main street road 1234',
        phone: '9999999999',
        pin: '676501',
        icon: require('../assets/images/home_icon.png'),
        selected: true,
        threeDotsClicked: false,
    },
    {
        id: '2',
        type: 'Office',
        address: 'indian city main street road 1234',
        phone: '8888888888',
        pin: '676502',
        icon: require('../assets/images/office_icon.png'),
        selected: false,
        threeDotsClicked: false,
    },
];

export const useAddresses = () => {
    const [addresses, setAddresses] = useState(DEFAULT_ADDRESSES);
    const [showAddressModal, setShowAddressModal] = useState(false);

    const onSelectAddress = useCallback((addressId) => {
        setAddresses(prev =>
            prev.map(item => ({ ...item, selected: item.id === addressId }))
        );
    }, []);

    const onThreeDotsClicked = useCallback((addressId) => {
        setAddresses(prev =>
            prev.map(item => ({ ...item, threeDotsClicked: item.id === addressId }))
        );
    }, []);

    const onDeleteClicked = useCallback((addressId) => {
        setAddresses(prev => prev.filter(item => item.id !== addressId));
    }, []);

    const onCloseThreeDots = useCallback(() => {
        setAddresses(prev =>
            prev.map(item => ({ ...item, threeDotsClicked: false }))
        );
    }, []);

    return {
        addresses,
        showAddressModal,
        setShowAddressModal,
        onSelectAddress,
        onThreeDotsClicked,
        onDeleteClicked,
        onCloseThreeDots,
    };
};

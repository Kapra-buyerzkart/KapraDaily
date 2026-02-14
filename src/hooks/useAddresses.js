import { useState, useCallback, useEffect } from 'react';
import { getAddressListApi, deleteAddressApi } from '../api/addressService';

export const useAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchAddresses = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getAddressListApi();
            if (response && response.data) {
                const mappedAddresses = response.data.map(addr => ({
                    id: addr.addressId,
                    type: addr.addressType || 'Home',
                    address: `${addr.addLine1}, ${addr.addLine2}${addr.landmark ? `, ${addr.landmark}` : ''}`,
                    phone: addr.phone,
                    pin: addr.pincode,
                    pincodeAreaId: addr.pincodeAreaId,
                    icon: addr.addressType?.toLowerCase() === 'home'
                        ? require('../assets/images/home_icon.png')
                        : require('../assets/images/office_icon.png'),
                    selected: addr.isDefaultShippingAddress,
                    threeDotsClicked: false,
                    raw: addr // keep raw data for editing
                }));

                // If no shipping address is selected, select the first one
                if (mappedAddresses.length > 0 && !mappedAddresses.find(a => a.selected)) {
                    mappedAddresses[0].selected = true;
                }

                setAddresses(mappedAddresses);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

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

    const onDeleteClicked = useCallback(async (addressId) => {
        try {
            await deleteAddressApi(addressId);
            setAddresses(prev => prev.filter(item => item.id !== addressId));
        } catch (error) {
            console.error('Error deleting address:', error);
        }
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
        isLoading,
        refreshAddresses: fetchAddresses,
    };
};

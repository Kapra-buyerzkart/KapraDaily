import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export const useAddresses = () => {
    const {
        addresses,
        isLoadingAddresses: isLoading,
        fetchAddresses: refreshAddresses,
        onSelectAddress,
        onThreeDotsClicked,
        onDeleteClicked,
        onCloseThreeDots,
        setShowAddressModal,
        showAddressModal
    } = useContext(CartContext);

    return {
        addresses,
        showAddressModal,
        setShowAddressModal,
        onSelectAddress,
        onThreeDotsClicked,
        onDeleteClicked,
        onCloseThreeDots,
        isLoading,
        refreshAddresses,
    };
};

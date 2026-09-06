import { useCart } from '../context/CartContext';

export const useAddresses = () => {
    const {
        addresses,
        isLoadingAddresses: isLoading,
        fetchAddresses: refreshAddresses,
        onSelectAddress,
        onThreeDotsClicked,
        onDeleteClicked,
        onCloseThreeDots,
        addressConfirmationData,
        setAddressConfirmationData,
        selectedAddress,
        selectedAddressId,
        clearSelectedAddress
    } = useCart();

    return {
        addresses,
        isLoading,
        refreshAddresses,
        onSelectAddress,
        onThreeDotsClicked,
        onDeleteClicked,
        onCloseThreeDots,
        addressConfirmationData,
        setAddressConfirmationData,
        selectedAddress,
        selectedAddressId,
        clearSelectedAddress
    };
};

import { useState, useEffect, useMemo } from 'react';
import { getOrderDetailsApi, cancelOrderApi, returnOrderItemApi } from '../api/orderService';

export const useOrderDetails = (orderId) => {
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orderStatus, setOrderStatus] = useState('placed');
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [selectedReturnItem, setSelectedReturnItem] = useState(null);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails(orderId);
        }
    }, [orderId]);

    const fetchOrderDetails = async (id) => {
        try {
            const response = await getOrderDetailsApi(id);
            console.log('Order Details Response:', JSON.stringify(response, null, 2));
            if (response && response.success && response.data) {
                setOrderData(response.data);

                // Update status from response
                const responseHeader = response.data.header || {};
                const newStatus = (responseHeader.orderStatusKey || response.data.orderStatus || 'placed').toLowerCase();
                setOrderStatus(newStatus);
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        try {
            setLoading(true);
            const payload = {
                orderId: orderData?.header?.orderId || orderData?.id || orderData?.orderId || orderId,
                reason: "Cancelled by Customer",
                requestedFromDevice: "app"
            };
            console.log('Cancelling Order:', payload);
            const response = await cancelOrderApi(payload);
            console.log('Cancel Order Response:', response);

            if (response && response.success) {
                fetchOrderDetails(orderId);
                alert("Order cancelled successfully");
                setShowCancelModal(false);
            } else {
                alert(response?.message || "Failed to cancel order");
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert("An error occurred while cancelling");
        } finally {
            setLoading(false);
        }
    };

    const handleReturnItem = async (reason) => {
        try {
            setLoading(true);
            const payload = {
                orderId: orderData?.header?.orderId || orderData?.id || orderId,
                orderItemId: selectedReturnItem?.orderItemId || selectedReturnItem?.id,
                quantity: selectedReturnItem?.quantity || 1,
                requestReason: reason
            };
            console.log('Returning Item:', payload);
            const response = await returnOrderItemApi(payload);
            console.log('Return Item Response:', response);

            if (response && response.success) {
                fetchOrderDetails(orderId);
                alert("Return request submitted successfully");
                setShowReturnModal(false);
            } else {
                alert(response?.message || "Failed to submit return request");
            }
        } catch (error) {
            console.error('Error returning item:', error);
            alert("An error occurred while returning item");
        } finally {
            setLoading(false);
            setSelectedReturnItem(null);
        }
    };

    // Derived Data using useMemo for performance
    const derivedData = useMemo(() => {
        const header = orderData?.header || {};
        const shipping = orderData?.shippingAddress || {};
        const items = orderData?.items || [];
        const payment = orderData?.payments?.[0] || {};

        return {
            orderDetails: header,
            effectiveOrderStatus: (header.orderStatusKey || orderData?.orderStatus || orderStatus).toLowerCase(),
            storeName: header.storeName || 'Store Name',
            shippingAddress: shipping,
            addressType: shipping.addressType || 'Home',
            fullAddress: [shipping.addLine1, shipping.addLine2].filter(Boolean).join(', '),
            cityStateZip: [shipping.district, shipping.state, shipping.pincode].filter(Boolean).join(', ') || '',
            paymentMethod: payment.paymentMethod || orderData?.paymentMethod || 'Cash on delivery',
            grandTotal: header.grandTotal || orderData?.grandTotal || '0',
            displayOrderId: header.orderNumber || orderData?.orderNumber || orderData?.orderId || `ORD ${orderId}`,
            orderDate: header.orderDate || orderData?.orderDate || '',
            orderItems: items,
            itemCount: items.length
        };
    }, [orderData, orderStatus, orderId]);

    return {
        // State
        loading,
        orderStatus, // Expose local state which is synced with derived data
        showCancelModal,
        setShowCancelModal,
        showReturnModal,
        setShowReturnModal,
        selectedReturnItem,
        setSelectedReturnItem,

        // Data
        ...derivedData,

        // Actions
        handleCancelOrder,
        handleReturnItem,
        refreshOrder: () => fetchOrderDetails(orderId)
    };
};

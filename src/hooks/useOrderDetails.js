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

    const mapOrderStatus = (status) => {
        if (!status) return 'placed';
        const s = String(status).toLowerCase();
        if (s === 'placed' || s === 'pending' || s === 'new' || s === 'created') return 'placed';
        if (s === 'confirmed' || s === 'accepted' || s === 'processing') return 'accepted';
        if (s === 'packed') return 'packed';
        if (s === 'shipped' || s === 'dispatched') return 'dispatched';
        // assigned or out_for_delivery
        if (s === 'assigned' || s === 'out_for_delivery') return 'assigned';
        if (s === 'delivered' || s === 'completed') return 'delivered';
        if (s === 'cancelled') return 'cancelled';
        if (s === 'returned') return 'returned';
        return s; // Default to returning original status if no match, maybe it works directly
    };

    const fetchOrderDetails = async (id) => {
        try {
            const response = await getOrderDetailsApi(id);
            console.log('Order Details Response:', JSON.stringify(response, null, 2));
            if (response && response.success && response.data) {
                setOrderData(response.data);

                // Update status from response
                const responseHeader = response.data.header || {};
                const rawStatus = responseHeader.orderStatusKey || response.data.orderStatus || 'placed';
                setOrderStatus(mapOrderStatus(rawStatus));
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
        const shipping = orderData?.shippingAddress || orderData?.shipping_address || {};
        const items = orderData?.items || orderData?.order_items || [];
        const payment = orderData?.payments?.[0] || orderData?.payment || {};

        return {
            orderDetails: header,
            effectiveOrderStatus: mapOrderStatus(header.orderStatusKey || orderData?.orderStatus || orderStatus),
            storeName: header.storeName || header.store_name || 'Kapra Daily',
            shippingAddress: shipping,
            addressType: shipping.addressType || shipping.address_type || 'Home',
            fullAddress: [shipping.addLine1 || shipping.add_line1 || shipping.addressLine1 || shipping.address_line1, shipping.addLine2 || shipping.add_line2 || shipping.addressLine2 || shipping.address_line2].filter(Boolean).join(', '),
            cityStateZip: [shipping.district, shipping.state, shipping.pincode].filter(Boolean).join(', ') || '',
            paymentMethod: payment.paymentMethod || payment.payment_method || orderData?.paymentMethod || orderData?.payment_method || 'Cash on delivery',
            grandTotal: header.grandTotal || orderData?.grandTotal || '0',
            displayOrderId: header.orderNumber || orderData?.orderNumber || orderData?.orderId || `ORD ${orderId}`,
            orderDate: header.orderDate || orderData?.orderDate || '',
            orderItems: items,
            itemCount: items.length,
            deliveryAgentName: orderData?.deliveryAgent?.name || orderData?.deliveryAgentName || orderData?.driverName || null,
            deliveryAgentPhone: orderData?.deliveryAgent?.phone || orderData?.deliveryAgentPhone || orderData?.driverPhone || null,
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

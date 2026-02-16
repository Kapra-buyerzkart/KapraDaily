import { useState, useEffect, useMemo } from 'react';
import { getOrderDetailsApi, cancelOrderApi, returnOrderItemApi } from '../api/orderService';
import Toast from 'react-native-simple-toast';

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
        const s = String(status).toLowerCase().replace(/_/g, '').trim();

        if (['placed', 'pending', 'new', 'created'].includes(s)) return 'placed';
        if (['confirmed', 'accepted', 'processing', 'orderaccepted'].includes(s)) return 'accepted';
        if (['packed'].includes(s)) return 'packed';
        if (['shipped', 'dispatched', 'outfordelivery'].includes(s)) return 'dispatched';
        if (['assigned', 'deliveryagentaccepted'].includes(s)) return 'assigned';
        if (['delivered', 'completed', 'received'].includes(s)) return 'delivered';
        if (['cancelled'].includes(s)) return 'cancelled';
        if (['returned', 'itemreturned'].includes(s)) return 'returned';

        return s;
    };

    const fetchOrderDetails = async (id) => {
        try {
            const response = await getOrderDetailsApi(id);
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
            const rawOrderId = orderData?.header?.orderId || orderData?.id || orderData?.orderId || orderId;
            const payload = {
                orderId: String(rawOrderId), // Specified as string in user request
                reason: "Cancelled by Customer",
                requestedFromDevice: "app"
            };
            console.log('Cancelling Order:', payload);
            const response = await cancelOrderApi(payload);
            console.log('Cancel Order Response:', response);

            if (response && response.success) {
                fetchOrderDetails(orderId);
                Toast.show("Order cancelled successfully", Toast.LONG);
                setShowCancelModal(false);
            } else {
                Toast.show(response?.message || "Failed to cancel order", Toast.SHORT);
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            Toast.show("An error occurred while cancelling", Toast.SHORT);
        } finally {
            setLoading(false);
        }
    };

    const handleReturnItem = async (reason) => {
        try {
            setLoading(true);
            const rawOrderId = orderData?.header?.orderId || orderData?.id || orderId;
            const payload = {
                orderId: Number(rawOrderId),
                orderItemId: Number(selectedReturnItem?.orderItemId || selectedReturnItem?.id || selectedReturnItem?.productId),
                quantity: Number(selectedReturnItem?.quantity || 1),
                requestReason: reason
            };
            console.log('Returning Item:', payload);
            const response = await returnOrderItemApi(payload);
            console.log('Return Item Response:', response);

            if (response && response.success) {
                fetchOrderDetails(orderId);
                Toast.show("Return request submitted successfully", Toast.LONG);
                setShowReturnModal(false);
            } else {
                Toast.show(response?.message || "Failed to submit return request", Toast.SHORT);
            }
        } catch (error) {
            console.error('Error returning item:', error);
            Toast.show("An error occurred while returning item", Toast.SHORT);
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

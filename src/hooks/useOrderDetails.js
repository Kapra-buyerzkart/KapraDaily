import { useState, useEffect, useMemo } from 'react';
import { getOrderDetailsApi, cancelOrderApi, returnOrderItemApi, rateDeliveryAgentApi, rateOrderApi } from '../api/orderService';
import Toast from 'react-native-simple-toast';

export const useOrderDetails = (orderId, initialOrderData = null) => {
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

    const fetchOrderDetails = async (id, silent = false) => {
        if (!id) return;
        try {
            if (!silent) setLoading(true);
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
                await fetchOrderDetails(orderId);
                Toast.show("Order cancelled successfully", Toast.LONG);
                setShowCancelModal(false);
            } else {
                Toast.show(response?.message || "Failed to cancel order", Toast.SHORT);
                setShowCancelModal(false); // Close even on failure if it's a known error
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
                await fetchOrderDetails(orderId);
                Toast.show("Return request submitted successfully", Toast.LONG);
                setShowReturnModal(false);
            } else {
                Toast.show(response?.message || "Failed to submit return request", Toast.SHORT);
                setShowReturnModal(false);
            }
        } catch (error) {
            console.error('Error returning item:', error);
            Toast.show("An error occurred while returning item", Toast.SHORT);
        } finally {
            setLoading(false);
            setSelectedReturnItem(null);
        }
    };

    const submitDeliveryAgentRating = async (rating, review) => {
        try {
            setLoading(true);
            const payload = {
                orderId: Number(orderId),
                rating: Number(rating),
                reviewText: review || ""
            };
            const response = await rateDeliveryAgentApi(payload);
            if (response && response.success) {
                Toast.show("Delivery agent rated successfully", Toast.SHORT);
                return true;
            } else {
                Toast.show(response?.message || "Failed to submit rating", Toast.SHORT);
                return false;
            }
        } catch (error) {
            console.error('Error rating delivery agent:', error);
            Toast.show("An error occurred", Toast.SHORT);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const submitOrderRating = async (rating, review) => {
        try {
            setLoading(true);
            const payload = {
                orderId: Number(orderId),
                rating: Number(rating),
                reviewText: review || ""
            };
            const response = await rateOrderApi(payload);
            if (response && response.success) {
                Toast.show("Order rated successfully", Toast.SHORT);
                return true;
            } else {
                Toast.show(response?.message || "Failed to submit rating", Toast.SHORT);
                return false;
            }
        } catch (error) {
            console.error('Error rating order:', error);
            Toast.show("An error occurred", Toast.SHORT);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Derived Data using useMemo for performance
    const derivedData = useMemo(() => {
        const header = orderData?.header || {};
        const shipping = orderData?.shippingAddress || orderData?.shipping_address || {};
        const items = orderData?.items || orderData?.order_items || [];
        const payment = orderData?.payments?.[0] || orderData?.payment || {};
        const timeline = orderData?.timeline || [];

        // Image merging logic: If API items don't have images, try to find them in navigation data
        const initialItems = initialOrderData?.items || initialOrderData?.products || initialOrderData?.selectedProducts || [];

        const mergedItems = items.map(apiItem => {
            if (apiItem.image || apiItem.prImage || apiItem.productImage || apiItem.featuredImage) return apiItem;

            // Try to find a match in navigation data
            const match = initialItems.find(navItem =>
                String(navItem.productId || navItem.id) === String(apiItem.productId || apiItem.id) ||
                (navItem.sku && navItem.sku === apiItem.sku)
            );

            if (match) {
                return {
                    ...apiItem,
                    image: match.image || match.prImage || match.productImage || match.featuredImage
                };
            }
            return apiItem;
        });

        const formatFriendlyDate = (dateString) => {
            if (!dateString) return '';
            try {
                const date = new Date(dateString);
                // Manual formatting for better cross-platform consistency without extra libs
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                const d = days[date.getDay()];
                const day = date.getDate().toString().padStart(2, '0');
                const m = months[date.getMonth()];
                const y = date.getFullYear();

                let hours = date.getHours();
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'

                return `${d}, ${day} ${m} ${y}, ${hours}:${minutes} ${ampm}`;
            } catch (e) {
                return dateString;
            }
        };

        // Improved status mapping using timeline if available
        let rawStatus = header.orderStatusKey || orderData?.orderStatus || orderStatus;
        if (timeline.length > 0) {
            const latestStatus = timeline[timeline.length - 1];
            rawStatus = latestStatus.statusKey || latestStatus.orderStatusKey || rawStatus;
        }

        return {
            orderDetails: header,
            effectiveOrderStatus: mapOrderStatus(rawStatus),
            storeName: header.storeName || header.store_name || 'Kapra Daily',
            shippingAddress: shipping,
            addressType: shipping.addressType || shipping.address_type || 'Home',
            fullAddress: [shipping.addLine1 || shipping.add_line1 || shipping.addressLine1 || shipping.address_line1, shipping.addLine2 || shipping.add_line2 || shipping.addressLine2 || shipping.address_line2].filter(Boolean).join(', '),
            cityStateZip: [shipping.district, shipping.state, shipping.pincode].filter(Boolean).join(', ') || '',
            paymentMethod: payment.paymentMethod || payment.payment_method || orderData?.paymentMethod || orderData?.payment_method || 'Cash on delivery',
            grandTotal: header.grandTotal || orderData?.grandTotal || '0',
            displayOrderId: header.orderNumber || orderData?.orderNumber || orderData?.orderId || `ORD ${orderId}`,
            orderDate: header.orderDate || orderData?.orderDate || '',
            formattedOrderDate: formatFriendlyDate(header.orderDate || orderData?.orderDate),
            orderItems: mergedItems,
            itemCount: mergedItems.length,
            deliveryAgentName: orderData?.deliveryAgent?.name || orderData?.deliveryAgentName || orderData?.driverName || null,
            deliveryAgentPhone: orderData?.deliveryAgent?.phone || orderData?.deliveryAgentPhone || orderData?.driverPhone || null,

            // Bill Breakdown Aligned with provided JSON
            bill: {
                subTotal: Number(header.subtotal || header.subTotal || 0),
                taxTotal: Number(header.taxTotal || header.totalTax || 0),
                discountTotal: Number(header.discountTotal || header.totalDiscount || 0),
                deliveryCharge: Number(header.deliveryCharge || header.deliveryAmount || 0),
                grandTotal: Number(header.grandTotal || 0),
                couponDiscount: Number(header.couponDiscount || header.couponAmount || 0),
                giftCardAmount: Number(header.giftCardAmount || 0),
                bCoinAppliedCoins: Number(header.bCoinAppliedCoins || 0),
                bCoinAppliedValue: Number(header.bCoinAppliedValue || header.bcoinsAppliedValue || 0),
            },
            invoiceUrl: header.invoiceFileUrl || orderData?.invoiceFileUrl || `order/${header.orderId || orderId}/invoice`,
            invoiceNumber: header.invoiceNumber || orderData?.invoiceNumber || null,
        };
    }, [orderData, orderStatus, orderId, initialOrderData]);

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
        submitDeliveryAgentRating,
        submitOrderRating,
        refreshOrder: (silent = false) => fetchOrderDetails(orderId, silent)
    };
};

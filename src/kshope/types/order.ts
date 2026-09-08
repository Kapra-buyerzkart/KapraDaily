export interface OrderLineItem {
  orderItemId?: number | string;
  productId?: number | string;
  productName?: string;
  featuredImage?: string;
  quantity?: number;
  unitPrice?: number;
  price?: number;
  lineTotal?: number;
  soldPrice?: number;
  taxAmount?: number;
  bTokenValue?: number;
  sku?: string;
  canReturn?: boolean;
  returnRefundStatus?: string | null;
  orderId?: string | number;
  orderNumber?: string | number;
  [key: string]: any;
}

export interface OrderListItem {
  orderId: string | number;
  orderNumber?: string | number;
  orderStatus?: string;
  orderStatusText?: string;
  orderDate?: string;
  grandTotal?: number;
  items?: string | OrderLineItem[];
  canCancel?: boolean;
  [key: string]: any;
}

export interface OrderTimelineStep {
  statusText?: string;
  notes?: string;
  changedAt?: string;
  [key: string]: any;
}

export interface OrderShippingAddress {
  addressType?: string;
  custName?: string;
  phone?: string;
  addLine1?: string;
  addLine2?: string;
  landmark?: string;
  district?: string;
  state?: string;
  pincodeAreaName?: string;
  pincode?: string | number;
  [key: string]: any;
}

export interface OrderPayment {
  paymentMethod?: string;
  paymentStatus?: string;
  paymentAmount?: number;
  transactionId?: string | null;
  initiatedAt?: string;
  completedAt?: string;
  [key: string]: any;
}

export interface OrderHeader {
  orderId?: string | number;
  orderNumber?: string | number;
  orderStatus?: string;
  status?: string;
  orderStatusText?: string;
  orderDate?: string;
  canCancel?: boolean;
  canRetryPayment?: boolean;
  razorPayOrderId?: string;
  razorPayKeyId?: string;
  razorPayAmount?: number;
  subTotal?: number;
  subtotal?: number;
  itemTotal?: number;
  item_total?: number;
  discountTotal?: number;
  productDiscount?: number;
  product_discount?: number;
  discountAmount?: number;
  savings?: number;
  totalDiscount?: number;
  total_discount?: number;
  deliveryCharge?: number;
  deliveryAmount?: number;
  delivery_amount?: number;
  shippingFee?: number;
  taxTotal?: number;
  totalTax?: number;
  taxAmount?: number;
  tax_total?: number;
  couponDiscount?: number;
  couponAmount?: number;
  appliedCouponAmount?: number;
  giftCardAmount?: number;
  giftcardValue?: number;
  appliedGiftCardAmount?: number;
  bCoinAppliedValue?: number;
  bcoinsAppliedValue?: number;
  appliedBcoins?: number;
  bcoinValue?: number;
  totalSavings?: number;
  grandTotal?: number;
  grand_total?: number;
  totalAmount?: number;
  total_amount?: number;
  toPay?: number;
  invoiceFileUrl?: string;
  invoiceNumber?: string;
  deliveryMode?: string;
  canReorder?: boolean;
  canMarkOverallReview?: boolean;
  overallRating?: number;
  reviewRating?: number;
  reviewText?: string;
  canMarkDeliveryReview?: boolean;
  deliveryAgentName?: string;
  deliveryAgentRating?: number;
  deliveryAgentReviewText?: string;
  hasOnlinePaid?: boolean;
  [key: string]: any;
}

export interface OrderDetails {
  header?: OrderHeader;
  items?: OrderLineItem[];
  timeline?: OrderTimelineStep[];
  payments?: OrderPayment[];
  shippingAddress?: OrderShippingAddress;
  billingAddress?: OrderShippingAddress;
  [key: string]: any;
}

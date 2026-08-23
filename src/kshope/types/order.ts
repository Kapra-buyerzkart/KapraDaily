export interface OrderLineItem {
  orderItemId?: number | string;
  productId?: number | string;
  productName?: string;
  featuredImage?: string;
  quantity?: number;
  unitPrice?: number;
  price?: number;
  lineTotal?: number;
  canReturn?: boolean;
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
  addLine1?: string;
  pincodeAreaName?: string;
  pincode?: string | number;
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
  [key: string]: any;
}

export interface OrderDetails {
  header?: OrderHeader;
  items?: OrderLineItem[];
  timeline?: OrderTimelineStep[];
  shippingAddress?: OrderShippingAddress;
  [key: string]: any;
}

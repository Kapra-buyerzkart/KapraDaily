export interface OrderItem {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  image: any;
  size?: number | string;
  colorHex?: string;
}

export interface Order {
  orderId: string;
  status: 'Out For Order' | 'Cancelled' | 'Delivered';
  date: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress?: string;
  deliveryType?: string;
  statusDescription?: string;
  deliveryDateText?: string;
  returnWindowText?: string;
}

export const myOrders: Order[] = [
  {
    orderId: '#ORD43446456547',
    status: 'Out For Order',
    date: '21/02/2025',
    totalAmount: 324.00,
    deliveryAddress: 'Nishamanzil(h),Vennala Chakkaraparambu Road\n,ernakulam district 654443',
    deliveryType: 'Home',
    statusDescription: 'Order reached the hub',
    deliveryDateText: 'Delivered on Fri 24 Oct',
    returnWindowText: 'Return window close after 7 days',
    items: [
      {
        id: '1',
        name: 'Lorem Ipsum is simply dummy textbngbnbnghbn',
        originalPrice: 350.00,
        discountedPrice: 324.00,
        image: require('../../assets/images/img.png'),
        size: 32,
        colorHex: '#9c6b30',
      },
      {
        id: '2',
        name: 'Leather Shoe',
        originalPrice: 350.00,
        discountedPrice: 324.00,
        image: require('../../assets/images/img.png'),
      },
      {
        id: '3',
        name: 'Brown Shoe',
        originalPrice: 350.00,
        discountedPrice: 324.00,
        image: require('../../assets/images/img.png'),
      }
    ]
  },
  {
    orderId: '#ORD43446456547',
    status: 'Cancelled',
    date: '21/02/2025',
    totalAmount: 324.00,
    items: [
      {
        id: '4',
        name: 'ORD43446456547',
        originalPrice: 350.00,
        discountedPrice: 324.00,
        image: require('../../assets/images/img.png'),
      }
    ]
  },
  {
    orderId: '#ORD43446456547',
    status: 'Delivered',
    date: '21/02/2025',
    totalAmount: 324.00,
    items: [
      {
        id: '5',
        name: 'dfgfrgtjhghjkhlk;j;',
        originalPrice: 350.00,
        discountedPrice: 324.00,
        image: require('../../assets/images/img.png'),
      },
      {
        id: '6',
        name: 'dfgfrgtjhghjkhlk;j;',
        originalPrice: 350.00,
        discountedPrice: 324.00,
        image: require('../../assets/images/img.png'),
      }
    ]
  }
];

import React from 'react';
import renderer from 'react-test-renderer';
import { isCashOnDelivery } from '../src/screens/cart/paymentMeta';
import { isCashOnDelivery as kshopeIsCashOnDelivery } from '../src/kshope/screens/Order/status/paymentMeta';
import { useCartDerivedState } from '../src/hooks/useCartDerivedState';
import StickyCheckoutBar from '../src/screens/cart/components/StickyCheckoutBar';
import CheckoutBar from '../src/kshope/screens/Cart/components/CheckoutBar';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 40, bottom: 20, left: 0, right: 0 }),
  SafeAreaView: ({ children, style }) => {
    const ReactRuntime = require('react');
    const { View } = require('react-native');
    return ReactRuntime.createElement(View, { style }, children);
  },
}));

describe('isCashOnDelivery helper', () => {
  it('correctly detects cash on delivery across variations', () => {
    expect(isCashOnDelivery('COD')).toBe(true);
    expect(isCashOnDelivery('cod')).toBe(true);
    expect(isCashOnDelivery('Cash on Delivery')).toBe(true);
    expect(isCashOnDelivery('Cash')).toBe(true);
    expect(isCashOnDelivery('online')).toBe(false);
    expect(isCashOnDelivery('razorpay')).toBe(false);
    expect(isCashOnDelivery('upi')).toBe(false);

    expect(kshopeIsCashOnDelivery('COD')).toBe(true);
    expect(kshopeIsCashOnDelivery('cash on delivery')).toBe(true);
    expect(kshopeIsCashOnDelivery('online')).toBe(false);
  });
});

describe('useCartDerivedState ctaLabel', () => {
  const HookTester = ({ props, onResult }) => {
    const result = useCartDerivedState(props);
    onResult(result);
    return null;
  };

  it('returns "Place Order" when paymentMethod is COD', () => {
    let state;
    renderer.act(() => {
      renderer.create(
        <HookTester
          props={{
            cartItems: [{ id: 1, name: 'Item 1' }],
            cartSummary: { grandTotal: 100 },
            cartError: null,
            serviceabilityTrigger: false,
            chosenSlot: null,
            paymentMethod: 'COD',
          }}
          onResult={r => {
            state = r;
          }}
        />,
      );
    });
    expect(state.ctaLabel).toBe('Place Order');
  });

  it('returns "Pay" when paymentMethod is online', () => {
    let state;
    renderer.act(() => {
      renderer.create(
        <HookTester
          props={{
            cartItems: [{ id: 1, name: 'Item 1' }],
            cartSummary: { grandTotal: 100 },
            cartError: null,
            serviceabilityTrigger: false,
            chosenSlot: null,
            paymentMethod: 'Online',
          }}
          onResult={r => {
            state = r;
          }}
        />,
      );
    });
    expect(state.ctaLabel).toBe('Pay');
  });
});

describe('StickyCheckoutBar button text', () => {
  it('renders "Place Order" button text when ctaLabel is "Place Order"', () => {
    let tree;
    renderer.act(() => {
      tree = renderer.create(
        <StickyCheckoutBar
          paymentMethod="COD"
          totalToPay={100}
          ctaLabel="Place Order"
          ctaDisabled={false}
          onCheckout={jest.fn()}
        />,
      );
    });
    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Place Order');
  });

  it('renders "Pay" button text when ctaLabel is "Pay"', () => {
    let tree;
    renderer.act(() => {
      tree = renderer.create(
        <StickyCheckoutBar
          paymentMethod="Online"
          totalToPay={100}
          ctaLabel="Pay"
          ctaDisabled={false}
          onCheckout={jest.fn()}
        />,
      );
    });
    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Pay');
  });
});

describe('kshope CheckoutBar button text', () => {
  it('renders "Place Order" when paymentMethod is COD', () => {
    let tree;
    renderer.act(() => {
      tree = renderer.create(
        <CheckoutBar
          totalSavings={10}
          toPay={100}
          paymentMethod="COD"
          onSelectPayment={jest.fn()}
          onPay={jest.fn()}
        />,
      );
    });
    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Place Order');
  });

  it('renders "Pay ₹100.00" when paymentMethod is online', () => {
    let tree;
    renderer.act(() => {
      tree = renderer.create(
        <CheckoutBar
          totalSavings={10}
          toPay={100}
          paymentMethod="Online"
          onSelectPayment={jest.fn()}
          onPay={jest.fn()}
        />,
      );
    });
    const json = JSON.stringify(tree.toJSON());
    expect(json).toContain('Pay ₹100.00');
  });
});

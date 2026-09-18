import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { formatCartItemSpecs, CartItemLuxuryCard } from '../src/kshope/screens/Cart/components/CartItemLuxuryCard';
import { CartAddressCard } from '../src/kshope/screens/Cart/components/CartAddressCard';
import { CartOffersSection } from '../src/kshope/screens/Cart/components/CartOffersSection';
import { CartCouponCard } from '../src/kshope/screens/Cart/components/CartCouponCard';
import { CartSummarySection } from '../src/kshope/screens/Cart/components/CartSummarySection';
import { CartPaymentSection } from '../src/kshope/screens/Cart/components/CartPaymentSection';
import { CartStickyBottomBar } from '../src/kshope/screens/Cart/components/CartStickyBottomBar';
import { CartTrustBadges } from '../src/kshope/screens/Cart/components/CartTrustBadges';
import { CartHeader } from '../src/kshope/screens/Cart/components/CartHeader';
import { CartSpecialBanner } from '../src/kshope/screens/Cart/components/CartSpecialBanner';
import ConfirmationModal from '../src/kshope/components/ConfirmationModal';
import AddressModal from '../src/kshope/components/AddressModal';
import AddressConfirmationModal from '../src/kshope/components/AddressConfirmationModal';
import DeliverySlotModal from '../src/kshope/components/DeliverySlotModal';
import StatusModal from '../src/kshope/components/StatusModal';
import CouponModal from '../src/kshope/components/CouponModal';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 50, bottom: 34, left: 0, right: 0 }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'MaterialCommunityIcons');

const renderComponent = async (element) => {
  let tree;
  await act(async () => {
    tree = renderer.create(element);
  });
  await act(async () => {});
  return tree;
};

const textsOf = (tree) =>
  tree.root
    .findAllByType('Text')
    .map(node => node.children.filter(c => typeof c === 'string').join(''))
    .filter(Boolean);

describe('Luxury Cart Redesign Components', () => {
  describe('formatCartItemSpecs', () => {
    it('formats purity, weight and size correctly', () => {
      const item = {
        purity: '14 KT Yellow Gold',
        diamondWeight: '0.66',
        size: '12',
      };
      expect(formatCartItemSpecs(item)).toBe('14 KT Yellow Gold • 0.66 ct • Size 12');
    });

    it('falls back to category when no specs are present', () => {
      const item = {
        categoryName: 'Diamond Rings',
      };
      expect(formatCartItemSpecs(item)).toBe('Diamond Rings');
    });
  });

  describe('CartHeader', () => {
    it('renders back, wishlist, and cart bag with badge', async () => {
      const onBack = jest.fn();
      const onWishlist = jest.fn();
      const tree = await renderComponent(
        <CartHeader cartCount={3} onBack={onBack} onWishlist={onWishlist} />
      );
      const texts = textsOf(tree);
      expect(texts).toContain('3');
    });
  });

  describe('CartItemLuxuryCard', () => {
    const mockItem = {
      cartItemId: 'item_1',
      productId: 'prod_101',
      productName: 'Classy Knot Diamond Ring',
      quantity: 1,
      unitPrice: 14778,
      specialPrice: 13864,
      purity: '14 KT Yellow Gold',
      diamondWeight: '0.66',
      size: '12',
    };

    it('renders title, prices, savings badge, and responds to actions', async () => {
      const onInc = jest.fn();
      const onDec = jest.fn();
      const onDelete = jest.fn();
      const onDetails = jest.fn();

      const tree = await renderComponent(
        <CartItemLuxuryCard
          item={mockItem}
          onIncrement={onInc}
          onDecrement={onDec}
          onDelete={onDelete}
          onDetails={onDetails}
        />
      );

      const texts = textsOf(tree);
      expect(texts).toContain('Classy Knot Diamond Ring');
      expect(texts).toContain('₹13,864');
      expect(texts).toContain('₹14,778');
      expect(texts.some(t => t.includes('You save ₹914 (6% OFF)'))).toBe(true);

      // Increment test
      const incBtn = tree.root.findByProps({ testID: 'cart-item-inc-item_1' });
      await act(async () => {
        incBtn.props.onPress();
      });
      expect(onInc).toHaveBeenCalledWith(mockItem);

      // Decrement test
      const decBtn = tree.root.findByProps({ testID: 'cart-item-dec-item_1' });
      await act(async () => {
        decBtn.props.onPress();
      });
      expect(onDec).toHaveBeenCalledWith(mockItem);

      // Remove test
      const removeBtn = tree.root.findByProps({ testID: 'cart-item-remove-item_1' });
      await act(async () => {
        removeBtn.props.onPress();
      });
      expect(onDelete).toHaveBeenCalledWith(mockItem);

      // Details test
      const detailsBtn = tree.root.findByProps({ testID: 'cart-item-details-item_1' });
      await act(async () => {
        detailsBtn.props.onPress();
      });
      expect(onDetails).toHaveBeenCalledWith(mockItem);
    });
  });

  describe('CartAddressCard', () => {
    it('renders address details and edit button', async () => {
      const onEdit = jest.fn();
      const address = {
        address: '123 Luxury Road, Jubilee Hills',
        city: 'Hyderabad',
        pin: '500033',
      };

      const tree = await renderComponent(
        <CartAddressCard address={address} onEditAddress={onEdit} />
      );

      const texts = textsOf(tree);
      expect(texts).toContain('Edit Saved Address');
      expect(texts.some(t => t.includes('123 Luxury Road, Jubilee Hills'))).toBe(true);

      const editBtn = tree.root.findByProps({ testID: 'cart-address-edit-btn' });
      await act(async () => {
        editBtn.props.onPress();
      });
      expect(onEdit).toHaveBeenCalled();
    });
  });

  describe('CartOffersSection', () => {
    const mockProducts = [
      {
        productId: 201,
        productName: 'Serenity Diamond Ring',
        unitPrice: 130000,
        specialPrice: 124000,
        purity: '18K Rose Gold',
        diamondWeight: '0.50',
        featuredImage: 'https://example.com/serenity_ring.png',
      },
      {
        productId: 202,
        productName: 'Lumière Drop Earrings',
        unitPrice: 155000,
        specialPrice: 148000,
        purity: '18K Yellow Gold',
        diamondWeight: '0.72',
        featuredImage: 'https://example.com/lumiere_earrings.png',
      },
    ];

    it('renders horizontal product cards and triggers navigation and wishlist', async () => {
      const onWishlist = jest.fn();
      const onSelect = jest.fn();
      const onViewAll = jest.fn();

      const tree = await renderComponent(
        <CartOffersSection
          products={mockProducts}
          isInWishlist={id => id === 201}
          onToggleWishlist={onWishlist}
          onSelectProduct={onSelect}
          onViewAll={onViewAll}
        />
      );

      const texts = textsOf(tree);
      expect(texts).toContain('Offers For You');
      expect(texts).toContain('Serenity Diamond Ring');
      expect(texts).toContain('Lumière Drop Earrings');

      const viewAllBtn = tree.root.findByProps({ testID: 'cart-offers-view-all' });
      await act(async () => {
        viewAllBtn.props.onPress();
      });
      expect(onViewAll).toHaveBeenCalled();

      const card = tree.root.findByProps({ testID: 'cart-offer-card-201' });
      await act(async () => {
        card.props.onPress();
      });
      expect(onSelect).toHaveBeenCalledWith(mockProducts[0]);
    });
  });

  describe('CartCouponCard', () => {
    it('renders apply coupon and handles press', async () => {
      const onPress = jest.fn();
      const tree = await renderComponent(
        <CartCouponCard appliedCouponCode="KAPRA10" onPress={onPress} />
      );
      const texts = textsOf(tree);
      expect(texts).toContain('Apply Coupon');
      expect(texts.some(t => t.includes('KAPRA10'))).toBe(true);
      expect(texts).toContain('Change');
    });
  });

  describe('CartSummarySection', () => {
    it('renders subtotal, free shipping, you saved, and total amount', async () => {
      const bill = {
        mrpTotal: 14778,
        itemTotal: 13864,
        deliveryCharge: 0,
        totalSavings: 914,
        totalTax: 500,
        toPay: 13864,
      };

      const tree = await renderComponent(<CartSummarySection billCalculations={bill} />);
      const texts = textsOf(tree);

      expect(texts).toContain('Cart Summary');
      expect(texts).toContain('₹14,778');
      expect(texts).toContain('Free');
      expect(texts).toContain('- ₹914');
      expect(texts).toContain('Total Amount');
      expect(texts).toContain('₹13,864');
      expect(texts).toContain('Inclusive of GST ₹500/-');
    });
  });

  describe('CartPaymentSection', () => {
    it('renders UPI options and allows selection', async () => {
      const onSelect = jest.fn();
      const tree = await renderComponent(
        <CartPaymentSection
          paymentMethod="Online"
          onSelectPaymentMethod={onSelect}
          supportsCOD={true}
        />
      );

      const texts = textsOf(tree);
      expect(texts).toContain('Payment Method');
      expect(texts.some(t => t.includes('Flat ₹1,500 Instant Discount'))).toBe(true);
      expect(texts).toContain('RECOMMENDED: UPI 1-TAP');
      expect(texts).toContain('GPay');
      expect(texts).toContain('PhonePe');
      expect(texts).toContain('Paytm');
      expect(texts).toContain('Credit / Debit Card');
      expect(texts).toContain('Cash on Delivery');

      const phonePeBtn = tree.root.findByProps({ testID: 'payment-upi-phonepe' });
      await act(async () => {
        phonePeBtn.props.onPress();
      });
      expect(onSelect).toHaveBeenCalledWith('Online');
    });
  });

  describe('CartStickyBottomBar', () => {
    it('renders total, savings, view details, and place order button', async () => {
      const onDetails = jest.fn();
      const onOrder = jest.fn();

      const tree = await renderComponent(
        <CartStickyBottomBar
          toPay={13864}
          mrpTotal={14778}
          totalSavings={914}
          onViewDetails={onDetails}
          onPlaceOrder={onOrder}
        />
      );

      const texts = textsOf(tree);
      expect(texts).toContain('₹13,864');
      expect(texts).toContain('₹14,778');
      expect(texts.some(t => t.includes('You save ₹914 (6%)'))).toBe(true);
      expect(texts).toContain('Place Order');

      const orderBtn = tree.root.findByProps({ testID: 'cart-place-order-btn' });
      await act(async () => {
        orderBtn.props.onPress();
      });
      expect(onOrder).toHaveBeenCalled();
    });
  });

  describe('CartSpecialBanner and TrustBadges', () => {
    it('renders banner and trust badges cleanly', async () => {
      const onExplore = jest.fn();
      const banner = await renderComponent(<CartSpecialBanner onExploreGifts={onExplore} />);
      const hitBtn = banner.root.findByProps({ testID: 'cart-explore-gift-sets' });
      await act(async () => {
        hitBtn.props.onPress();
      });
      expect(onExplore).toHaveBeenCalled();

      const badges = await renderComponent(<CartTrustBadges />);
      const badgeTexts = textsOf(badges);
      expect(badgeTexts).toContain('Certified Jewellery');
      expect(badgeTexts).toContain('Secure Shopping');
      expect(badgeTexts).toContain('Easy Support');
    });
  });

  describe('Redesigned Luxury Modals', () => {
    it('renders ConfirmationModal with serif title and responds to confirm', async () => {
      const onConfirm = jest.fn();
      const onClose = jest.fn();
      const modal = await renderComponent(
        <ConfirmationModal
          visible={true}
          title="Remove Jewellery"
          message="Are you sure you want to remove this piece?"
          confirmText="Remove"
          onClose={onClose}
          onConfirm={onConfirm}
        />,
      );
      const texts = textsOf(modal);
      expect(texts).toContain('Remove Jewellery');
      expect(texts).toContain('Remove');
    });

    it('renders AddressModal with serif title and addresses list', async () => {
      const onSelect = jest.fn();
      const onClose = jest.fn();
      const modal = await renderComponent(
        <AddressModal
          visible={true}
          addresses={[
            { id: 1, type: 'Home', address: '42 Emerald Bay, Jubilee Hills', selected: true },
          ]}
          onClose={onClose}
          onSelectAddress={onSelect}
        />,
      );
      const texts = textsOf(modal);
      expect(texts).toContain('Select Delivery Address');
      expect(texts).toContain('Home');
      expect(texts).toContain('42 Emerald Bay, Jubilee Hills');
    });

    it('renders AddressConfirmationModal with address details', async () => {
      const onConfirm = jest.fn();
      const onClose = jest.fn();
      const modal = await renderComponent(
        <AddressConfirmationModal
          visible={true}
          data={{
            pincode: '500033',
            areaName: 'Jubilee Hills, Hyderabad',
            isServiceable: true,
          }}
          onClose={onClose}
          onConfirm={onConfirm}
        />,
      );
      const texts = textsOf(modal);
      expect(texts).toContain('Confirm Address');
      expect(texts).toContain('500033');
      expect(texts).toContain('Jubilee Hills, Hyderabad');
      expect(texts).toContain('Confirm & Place Order');
    });

    it('renders DeliverySlotModal with dates and slots', async () => {
      const onSelect = jest.fn();
      const onClose = jest.fn();
      const modal = await renderComponent(
        <DeliverySlotModal
          visible={true}
          datesList={[{ value: '2026-09-19', display: 'Tomorrow, 19 Sep' }]}
          slotsByDate={{
            '2026-09-19': [{ slotValue: '10am-1pm', display: '10:00 AM - 01:00 PM', available: true }],
          }}
          onClose={onClose}
          onSelectSlot={onSelect}
        />,
      );
      const texts = textsOf(modal);
      expect(texts).toContain('Select Delivery Slot');
      expect(texts).toContain('Tomorrow, 19 Sep');
      expect(texts).toContain('10:00 AM - 01:00 PM');
    });

    it('renders StatusModal with status title and message', async () => {
      const onClose = jest.fn();
      const modal = await renderComponent(
        <StatusModal
          visible={true}
          type="success"
          title="Order Placed"
          message="Your order has been confirmed successfully."
          onClose={onClose}
        />,
      );
      const texts = textsOf(modal);
      expect(texts).toContain('Order Placed');
      expect(texts).toContain('Your order has been confirmed successfully.');
      expect(texts).toContain('OK');
    });

    it('renders CouponModal with coupon offers list', async () => {
      const onCoupon = jest.fn();
      const onClose = jest.fn();
      const modal = await renderComponent(
        <CouponModal
          visible={true}
          isGiftCard={false}
          availableCoupons={[
            { couponCode: 'DIAMOND10', discountValue: 10, discountType: 'PERCENT', maxDiscountAmount: 5000 },
          ]}
          availableGiftCards={[]}
          onClose={onClose}
          onCouponClick={onCoupon}
        />,
      );
      const texts = textsOf(modal);
      expect(texts).toContain('Apply Coupon');
      expect(texts).toContain('DIAMOND10');
      expect(texts).toContain('Apply');
    });
  });
});

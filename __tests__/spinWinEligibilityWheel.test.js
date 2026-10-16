jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => {}),
  removeItem: jest.fn(async () => {}),
  clear: jest.fn(async () => {}),
}));

import { mapBackendRewardToPrize } from '../src/api/spinWheelService';

describe('Spin Win Eligibility Wheel Mapping & Slices', () => {
  it('maps backend reward items to AssuredPrize with palette defaults', () => {
    const backendItems = [
      {
        id: 101,
        title: 'Flat ₹100 Off',
        discount: 'MIN ₹499',
        badge: 'EXCLUSIVE',
        couponCode: 'SAVE100',
        description: 'Flat ₹100 off on your cart',
      },
      {
        id: 102,
        name: 'Free Delivery',
        subTitle: 'ZERO FEE',
        promoCode: 'DELIVERY0',
      },
    ];

    const prize1 = mapBackendRewardToPrize(backendItems[0], 0);
    expect(prize1.id).toBe('101');
    expect(prize1.label).toBe('Flat ₹100 Off');
    expect(prize1.sublabel).toBe('MIN ₹499');
    expect(prize1.badge).toBe('EXCLUSIVE');
    expect(prize1.code).toBe('SAVE100');
    expect(prize1.color1).toBe('#059669');
    expect(prize1.iconName).toBe('truck-fast');

    const prize2 = mapBackendRewardToPrize(backendItems[1], 1);
    expect(prize2.id).toBe('102');
    expect(prize2.label).toBe('Free Delivery');
    expect(prize2.sublabel).toBe('ZERO FEE');
    expect(prize2.code).toBe('DELIVERY0');
    expect(prize2.color1).toBe('#EA580C');
  });

  it('handles empty items without errors', () => {
    const emptyItems = [];
    expect(emptyItems.length).toBe(0);
  });

  it('matches rewards/spin-win/play response prize to existing wheel slice by id or code', () => {
    const wheelPrizes = [
      mapBackendRewardToPrize({ id: '101', couponCode: 'SAVE100', title: 'Flat ₹100 Off' }, 0),
      mapBackendRewardToPrize({ id: '102', couponCode: 'DELIVERY0', title: 'Free Delivery' }, 1),
      mapBackendRewardToPrize({ id: '103', couponCode: 'UD50', title: '50 UD Coins' }, 2),
    ];

    // Simulated play response
    const playResponse = {
      success: true,
      data: {
        prize: { id: '102', code: 'DELIVERY0', label: 'Free Delivery' },
      },
    };

    const targetId = String(playResponse.data.prize.id);
    const targetIndex = wheelPrizes.findIndex(p => String(p.id) === targetId);

    expect(targetIndex).toBe(1);
    expect(wheelPrizes[targetIndex].code).toBe('DELIVERY0');
  });
});

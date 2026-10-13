import { buildOffersItems } from '../src/screens/ProfileScreen/menuItems';

describe('Spin Wheel Rewards in Profile Screen', () => {
  it('buildOffersItems includes Spin Wheel Rewards item with onSpinWheel handler', () => {
    const onSpinWheel = jest.fn();
    const items = buildOffersItems({
      onBCoin: jest.fn(),
      onSmartPoint: jest.fn(),
      onCoupons: jest.fn(),
      onSpinWheel,
    });

    const spinItem = items.find(item => item.key === 'spin-wheel');
    expect(spinItem).toBeDefined();
    expect(spinItem.label).toBe('Spin Wheel Rewards');
    expect(spinItem.badge).toBeDefined();

    spinItem.onPress();
    expect(onSpinWheel).toHaveBeenCalledTimes(1);
  });
});

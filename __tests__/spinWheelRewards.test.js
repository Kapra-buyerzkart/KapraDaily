import { buildOffersItems } from '../src/screens/ProfileScreen/menuItems';

describe('Spin Wheel Rewards in Profile Screen', () => {
  it('buildOffersItems does not include spin-wheel item and includes My Rewards item', () => {
    const onMyRewards = jest.fn();
    const items = buildOffersItems({
      onBCoin: jest.fn(),
      onSmartPoint: jest.fn(),
      onCoupons: jest.fn(),
      onMyRewards,
    });

    const spinItem = items.find(item => item.key === 'spin-wheel');
    expect(spinItem).toBeUndefined();

    const myRewardsItem = items.find(item => item.key === 'my-rewards');
    expect(myRewardsItem).toBeDefined();
    expect(myRewardsItem?.label).toBe('My Rewards');
  });
});

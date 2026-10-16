import { buildOffersItems } from '../src/screens/ProfileScreen/menuItems';

describe('My Rewards in Profile Screen and History Integration', () => {
  it('buildOffersItems includes My Rewards item that triggers onMyRewards callback', () => {
    const onMyRewards = jest.fn();
    const items = buildOffersItems({
      onBCoin: jest.fn(),
      onSmartPoint: jest.fn(),
      onCoupons: jest.fn(),
      onMyRewards,
    });

    const myRewardsItem = items.find(item => item.key === 'my-rewards');
    expect(myRewardsItem).toBeDefined();
    expect(myRewardsItem?.label).toBe('My Rewards');
    expect(myRewardsItem?.badge).toBeDefined();

    myRewardsItem?.onPress();
    expect(onMyRewards).toHaveBeenCalledTimes(1);
  });
});

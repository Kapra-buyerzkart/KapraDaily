jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => {}),
  removeItem: jest.fn(async () => {}),
  clear: jest.fn(async () => {}),
}));

import { buildOffersItems } from '../src/screens/ProfileScreen/menuItems';
import { getHomeWheelMySpins, getSpinWinHistory } from '../src/api/spinWheelService';
import { get } from '../src/api/networkUtils';

jest.mock('../src/api/networkUtils', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('My Rewards in Profile Screen and History Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

    myRewardsItem?.onPress();
    expect(onMyRewards).toHaveBeenCalledTimes(1);
  });

  it('calls rewards/home-wheel/my-spins?pageNumber=1&pageSize=20 for joining rewards', async () => {
    const mockResponse = {
      success: true,
      data: {
        items: [
          {
            id: 101,
            rewardName: '15 UD Tokens',
            rewardType: 'TOKEN',
            awardedValue: 15,
            wonAt: '2026-10-23T10:00:00Z',
            status: 'ACTIVE',
          },
        ],
      },
    };
    get.mockResolvedValueOnce(mockResponse);

    const result = await getHomeWheelMySpins({ pageNumber: 1, pageSize: 20 });
    expect(get).toHaveBeenCalledWith('rewards/home-wheel/my-spins?pageNumber=1&pageSize=20');
    expect(result).toEqual(mockResponse);
  });

  it('calls rewards/spin-win/history?pageNumber=1&pageSize=20 for buying rewards', async () => {
    const mockResponse = {
      success: true,
      data: {
        items: [
          {
            id: 201,
            rewardName: '₹50 OFF on Fresh Vegetables',
            code: 'FRESH50',
            wonAt: '2026-10-23T11:00:00Z',
            status: 'ACTIVE',
          },
        ],
      },
    };
    get.mockResolvedValueOnce(mockResponse);

    const result = await getSpinWinHistory({ pageNumber: 1, pageSize: 20 });
    expect(get).toHaveBeenCalledWith('rewards/spin-win/history?pageNumber=1&pageSize=20');
    expect(result).toEqual(mockResponse);
  });
});


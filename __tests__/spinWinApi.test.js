jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => {}),
  removeItem: jest.fn(async () => {}),
  clear: jest.fn(async () => {}),
}));

jest.mock('../src/api/networkUtils', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

import { get, post } from '../src/api/networkUtils';
import {
  checkSpinWinEligibility,
  playSpinWin,
  getSpinWinHistory,
  getSpinWheelStatusApi,
  executeSpinWheelApi,
  mapBackendRewardToPrize,
  extractCampaignAndRewards,
  selectWeightedRewardIndex,
  DEFAULT_OCTOBER_CAMPAIGN,
} from '../src/api/spinWheelService';

describe('Spin & Win API Endpoints (using base_url)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkSpinWinEligibility', () => {
    it('calls GET rewards/spin-win/eligible?orderId=18265 when orderId is provided', async () => {
      get.mockResolvedValueOnce({ success: true, data: { isEligible: true } });

      const result = await checkSpinWinEligibility(18265);

      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith('rewards/spin-win/eligible?orderId=18265');
      expect(result.data.isEligible).toBe(true);
    });

    it('calls GET rewards/spin-win/eligible when no orderId is provided', async () => {
      get.mockResolvedValueOnce({ success: true, data: { isEligible: true } });

      const result = await checkSpinWinEligibility();

      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith('rewards/spin-win/eligible');
      expect(result.data.isEligible).toBe(true);
    });
  });

  describe('playSpinWin', () => {
    it('calls POST rewards/spin-win/play with orderId and campaignId', async () => {
      const mockResponse = {
        success: true,
        data: {
          prize: { id: 'p1', code: 'FREEDEL', label: 'Free Delivery' },
        },
      };
      post.mockResolvedValueOnce(mockResponse);

      const result = await playSpinWin({
        orderId: 18265,
        campaignId: 1,
      });

      expect(post).toHaveBeenCalledTimes(1);
      expect(post).toHaveBeenCalledWith('rewards/spin-win/play', {
        orderId: 18265,
        campaignId: 1,
      });
      expect(result).toEqual(mockResponse);
      expect(result.data.prize.code).toBe('FREEDEL');
    });

    it('handles response without orderId when spinning from profile', async () => {
      const mockResponse = {
        success: true,
        data: {
          winningIndex: 2,
          reward: { id: 'p3', code: 'BONUS100', title: 'Bonus 100 Coins' },
        },
      };
      post.mockResolvedValueOnce(mockResponse);

      const result = await playSpinWin({ campaignId: 1 });

      expect(post).toHaveBeenCalledWith('rewards/spin-win/play', {
        campaignId: 1,
      });
      expect(result.data.winningIndex).toBe(2);
      expect(result.data.reward.code).toBe('BONUS100');
    });

    it('defaults campaignId to 1 if not specified', async () => {
      post.mockResolvedValueOnce({ success: true });

      await playSpinWin({ orderId: '18265' });

      expect(post).toHaveBeenCalledWith('rewards/spin-win/play', {
        orderId: 18265,
        campaignId: 1,
      });
    });
  });

  describe('getSpinWinHistory', () => {
    it('calls GET rewards/spin-win/history with pagination parameters', async () => {
      const mockHistory = {
        success: true,
        data: [{ id: 1, rewardTitle: 'Free Delivery', wonAt: '2026-10-15' }],
        totalCount: 1,
        pageNumber: 1,
        pageSize: 20,
      };
      get.mockResolvedValueOnce(mockHistory);

      const result = await getSpinWinHistory({ pageNumber: 1, pageSize: 20 });

      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith('rewards/spin-win/history?pageNumber=1&pageSize=20');
      expect(result).toEqual(mockHistory);
    });

    it('uses default pageNumber 1 and pageSize 20 if omitted', async () => {
      get.mockResolvedValueOnce({ success: true, data: [] });

      await getSpinWinHistory();

      expect(get).toHaveBeenCalledWith('rewards/spin-win/history?pageNumber=1&pageSize=20');
    });
  });

  describe('executeSpinWheelApi integration', () => {
    it('calls playSpinWin and marks order claimed upon successful response', async () => {
      post.mockResolvedValueOnce({
        data: {
          prize: { id: 'p2', code: 'PANTRY50' },
        },
      });

      const res = await executeSpinWheelApi({
        orderId: '18265',
        campaignId: 1,
        winningIndex: 1,
        prize: { id: 'p2', code: 'PANTRY50' },
      });

      expect(post).toHaveBeenCalledWith('rewards/spin-win/play', {
        orderId: 18265,
        campaignId: 1,
      });
      expect(res.success).toBe(true);
      expect(res.prize.code).toBe('PANTRY50');
    });
  });

  describe('getSpinWheelStatusApi integration', () => {
    it('returns spinsAvailable based on backend eligibility response', async () => {
      get.mockResolvedValueOnce({
        data: {
          isEligible: true,
          spinsAvailable: 1,
          campaignId: 1,
        },
      });

      const status = await getSpinWheelStatusApi('18265');

      expect(get).toHaveBeenCalledWith('rewards/spin-win/eligible?orderId=18265');
      expect(status.spinsAvailable).toBe(1);
      expect(status.isClaimed).toBe(false);
    });

    it('extracts campaign details and rewards from data.items[0]', async () => {
      get.mockResolvedValueOnce({
        success: true,
        status: 'OK',
        message: 'Eligible campaigns fetched.',
        data: {
          items: [DEFAULT_OCTOBER_CAMPAIGN],
        },
      });

      const status = await getSpinWheelStatusApi('18265');
      expect(status.spinsAvailable).toBe(1);
      expect(status.campaignId).toBe(1);
    });
  });

  describe('October Spin & Win Campaign Data Mapping', () => {
    const rawApiPayload = {
      success: true,
      status: 'OK',
      message: 'Eligible campaigns fetched.',
      data: {
        items: [DEFAULT_OCTOBER_CAMPAIGN],
      },
    };

    it('extractCampaignAndRewards extracts campaign and rewards properly preserving all items', () => {
      const extracted = extractCampaignAndRewards(rawApiPayload);
      expect(extracted.campaignId).toBe(1);
      expect(extracted.campaignName).toBe('October Spin & Win 2026');
      expect(extracted.rewards).toHaveLength(8);
      expect(extracted.minOrderAmount).toBe(16);
      expect(extracted.eligibleOrderAmount).toBe(1694);

      // Verify that rewards list from payload is extracted completely without dropping items
      const payloadWithAll = {
        data: {
          items: [
            {
              ...DEFAULT_OCTOBER_CAMPAIGN,
              rewards: [
                ...DEFAULT_OCTOBER_CAMPAIGN.rewards,
                {
                  campaignItemId: 99,
                  rewardName: 'Better Luck Next Time',
                  rewardType: 'NoPrize',
                  displayText: 'BETTER LUCK NEXT TIME',
                },
              ],
            },
          ],
        },
      };
      const result = extractCampaignAndRewards(payloadWithAll);
      expect(result.rewards).toHaveLength(9);
    });

    it('maps all 8 October rewards with correct attributes, palettes, and badges', () => {
      const rewards = DEFAULT_OCTOBER_CAMPAIGN.rewards;
      const mapped = rewards.map((r, i) => mapBackendRewardToPrize(r, i));

      expect(mapped).toHaveLength(8);

      // 1. ₹50 Off Coupon
      expect(mapped[0].label).toBe('₹50 Off Coupon');
      expect(mapped[0].wheelLabel).toBe('₹50 Off');
      expect(mapped[0].titleLine1).toBe('₹50');
      expect(mapped[0].titleLine2).toBe('Off');
      expect(mapped[0].sublabel).toBe('COUPON');
      expect(mapped[0].badge).toBe('FLAT ₹50');
      expect(mapped[0].code).toBe('');
      expect(mapped[0].iconName).toBe('ticket-percent');
      expect(mapped[0].isNoPrize).toBe(false);

      // 2. Partner Voucher ₹200
      expect(mapped[1].label).toBe('Partner Voucher ₹200');
      expect(mapped[1].sublabel).toBe('PARTNER');
      expect(mapped[1].badge).toBe('₹200 OFF');
      expect(mapped[1].code).toBe('');
      expect(mapped[1].iconName).toBe('gift');
      expect(mapped[1].isNoPrize).toBe(false);

      // 3. 100% Cashback
      expect(mapped[2].label).toBe('100% Cashback');
      expect(mapped[2].sublabel).toBe('CASHBACK');
      expect(mapped[2].badge).toBe('UP TO ₹100');
      expect(mapped[2].code).toBe('');
      expect(mapped[2].iconName).toBe('wallet-giftcard');
      expect(mapped[2].isNoPrize).toBe(false);

      // 4. 100 BCoins
      expect(mapped[3].label).toBe('100 BCoins');
      expect(mapped[3].sublabel).toBe('BCOINS');
      expect(mapped[3].badge).toBe('COINS');
      expect(mapped[3].code).toBe('');
      expect(mapped[3].iconName).toBe('cash-multiple');
      expect(mapped[3].isNoPrize).toBe(false);

      // 5. ₹100 Gift Card
      expect(mapped[4].label).toBe('₹100 Gift Card');
      expect(mapped[4].sublabel).toBe('GIFT CARD');
      expect(mapped[4].badge).toBe('SPECIAL');
      expect(mapped[4].code).toBe('');
      expect(mapped[4].iconName).toBe('gift');
      expect(mapped[4].isNoPrize).toBe(false);

      // 6. Free Delivery
      expect(mapped[5].label).toBe('Free Delivery');
      expect(mapped[5].sublabel).toBe('ZERO FEE');
      expect(mapped[5].badge).toBe('FREE DEL');
      expect(mapped[5].code).toBe('');
      expect(mapped[5].iconName).toBe('truck-fast');
      expect(mapped[5].isNoPrize).toBe(false);

      // 7. Flat ₹25 OFF
      expect(mapped[6].label).toBe('Flat ₹25 OFF');
      expect(mapped[6].sublabel).toBe('COUPON');
      expect(mapped[6].badge).toBe('FLAT ₹25');
      expect(mapped[6].isNoPrize).toBe(false);

      // 8. 50 Bonus Coins
      expect(mapped[7].label).toBe('50 Bonus Coins');
      expect(mapped[7].sublabel).toBe('BCOINS');
      expect(mapped[7].badge).toBe('COINS');
      expect(mapped[7].isNoPrize).toBe(false);
    });

    it('selectWeightedRewardIndex selects an index between 0 and 7', () => {
      const rewards = DEFAULT_OCTOBER_CAMPAIGN.rewards.map((r, i) =>
        mapBackendRewardToPrize(r, i),
      );
      for (let i = 0; i < 20; i++) {
        const idx = selectWeightedRewardIndex(rewards);
        expect(idx).toBeGreaterThanOrEqual(0);
        expect(idx).toBeLessThan(8);
      }
    });
  });
});

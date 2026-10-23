import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { post } from '../src/api/networkUtils';
import { getAccessToken } from '../src/api/tokenService';
import {
  checkHomeWheelVisibilityApi,
  playHomeWheelApi,
  isUserEntitledToSpin,
  extractCampaignAndRewards,
  mapBackendRewardToPrize,
  getStoredWheelRequestState,
  saveWheelRequestState,
  clearWheelRequestState,
  getOrCreateWheelRequestId,
  checkLandingScreenWheelEntitlement,
  WHEEL_VISIBILITY_REQUEST_STATE_KEY,
} from '../src/api/spinWheelService';

jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {};
  return {
    getItem: jest.fn(async key => store[key] || null),
    setItem: jest.fn(async (key, value) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn(async key => {
      delete store[key];
    }),
    clear: jest.fn(async () => {
      store = {};
    }),
  };
});

jest.mock('../src/api/networkUtils', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

jest.mock('../src/api/tokenService', () => ({
  getAccessToken: jest.fn(),
}));

jest.mock('react-native-simple-toast', () => ({
  show: jest.fn(),
  SHORT: 0,
}));

describe('Home Wheel Visibility API & Entitlement Management', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  describe('checkHomeWheelVisibilityApi', () => {
    it('calls POST rewards/home-wheel/visibility with requestId and anonymousId: null', async () => {
      post.mockResolvedValueOnce({
        success: true,
        data: { isEligible: true, canSpin: true },
      });

      const payload = {
        requestId: 'a9c04d28-93c5-4b35-a76a-7d9e8d1f2021',
        anonymousId: null,
      };

      const result = await checkHomeWheelVisibilityApi(payload);

      expect(post).toHaveBeenCalledTimes(1);
      expect(post).toHaveBeenCalledWith('rewards/home-wheel/visibility', {
        requestId: 'a9c04d28-93c5-4b35-a76a-7d9e8d1f2021',
        anonymousId: null,
      });
      expect(result.success).toBe(true);
      expect(result.data.isEligible).toBe(true);
    });

    it('throws when the API request fails', async () => {
      post.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        checkHomeWheelVisibilityApi({
          requestId: 'test-req-id',
          anonymousId: null,
        }),
      ).rejects.toThrow('Network error');
    });
  });

  describe('playHomeWheelApi', () => {
    it('calls POST rewards/home-wheel/play with dynamic campaignId, requestId, and anonymousId', async () => {
      post.mockResolvedValueOnce({
        success: true,
        data: {
          prize: { id: '901', rewardName: '₹100 Off', code: 'WELCOME100' },
        },
      });

      const payload = {
        campaignId: 2,
        requestId: 'a9c04d28-93c5-4b35-a76a-7d9e8d1f2001',
        anonymousId: null,
      };

      const result = await playHomeWheelApi(payload);

      expect(post).toHaveBeenCalledTimes(1);
      expect(post).toHaveBeenCalledWith('rewards/home-wheel/play', {
        campaignId: 2,
        requestId: 'a9c04d28-93c5-4b35-a76a-7d9e8d1f2001',
        anonymousId: null,
      });
      expect(result.success).toBe(true);
      expect(result.data.prize.code).toBe('WELCOME100');
    });

    it('generates a dynamic UUID if requestId is omitted and defaults anonymousId to null', async () => {
      post.mockResolvedValueOnce({ success: true, data: {} });

      await playHomeWheelApi({ campaignId: 3 });

      expect(post).toHaveBeenCalledTimes(1);
      const calledWith = post.mock.calls[0];
      expect(calledWith[0]).toBe('rewards/home-wheel/play');
      expect(calledWith[1].campaignId).toBe(3);
      expect(typeof calledWith[1].requestId).toBe('string');
      expect(calledWith[1].requestId.length).toBeGreaterThan(10);
      expect(calledWith[1].anonymousId).toBeNull();
    });

    it('passes dynamic anonymousId string when provided', async () => {
      post.mockResolvedValueOnce({ success: true, data: {} });

      await playHomeWheelApi({
        campaignId: 2,
        requestId: 'custom-req-id',
        anonymousId: 'anon-visitor-123',
      });

      expect(post).toHaveBeenCalledTimes(1);
      expect(post).toHaveBeenCalledWith('rewards/home-wheel/play', {
        campaignId: 2,
        requestId: 'custom-req-id',
        anonymousId: 'anon-visitor-123',
      });
    });

    it('throws when the play API request fails', async () => {
      post.mockRejectedValueOnce(new Error('Backend play error'));

      await expect(
        playHomeWheelApi({
          campaignId: 2,
          requestId: 'test-id',
        }),
      ).rejects.toThrow('Backend play error');
    });
  });

  describe('isUserEntitledToSpin', () => {
    const valid3Rewards = [
      { rewardId: 1, rewardName: '₹50 Off' },
      { rewardId: 2, rewardName: 'Free Delivery' },
      { rewardId: 3, rewardName: '100 Coins' },
    ];

    it('returns true when isEligible is true and rewards count >= 3', () => {
      expect(
        isUserEntitledToSpin({
          success: true,
          data: { isEligible: true, rewards: valid3Rewards },
        }),
      ).toBe(true);
    });

    it('returns true when canSpin is true and rewards count >= 3', () => {
      expect(
        isUserEntitledToSpin({
          data: { canSpin: true, rewards: valid3Rewards },
        }),
      ).toBe(true);
    });

    it('returns true when isVisible or isEntitled is true and rewards count >= 3', () => {
      expect(
        isUserEntitledToSpin({
          data: { isVisible: true, rewards: valid3Rewards },
        }),
      ).toBe(true);
      expect(
        isUserEntitledToSpin({
          data: { isEntitled: true, rewards: valid3Rewards },
        }),
      ).toBe(true);
    });

    it('returns true when spinsAvailable > 0 and rewards count >= 3', () => {
      expect(
        isUserEntitledToSpin({
          data: { spinsAvailable: 2, rewards: valid3Rewards },
        }),
      ).toBe(true);
    });

    it('returns false when rewards are less than 3 (e.g. 0, 1, or 2 rewards)', () => {
      // 0 rewards
      expect(
        isUserEntitledToSpin({
          success: true,
          data: { isEligible: true, rewards: [] },
        }),
      ).toBe(false);

      // 1 reward
      expect(
        isUserEntitledToSpin({
          success: true,
          data: {
            isEligible: true,
            rewards: [{ rewardId: 1, rewardName: '₹50 Off' }],
          },
        }),
      ).toBe(false);

      // 2 rewards
      expect(
        isUserEntitledToSpin({
          success: true,
          data: {
            isEligible: true,
            rewards: [
              { rewardId: 1, rewardName: '₹50 Off' },
              { rewardId: 2, rewardName: 'Free Delivery' },
            ],
          },
        }),
      ).toBe(false);
    });

    it('returns false when no rewards array is present at all', () => {
      expect(
        isUserEntitledToSpin({
          success: true,
          data: { isEligible: true },
        }),
      ).toBe(false);
    });

    it('returns false when items array is empty or message indicates no promotions', () => {
      expect(
        isUserEntitledToSpin({
          success: true,
          status: 'OK',
          message: 'No home wheel promotions are available for this visitor.',
          data: { items: [] },
        }),
      ).toBe(false);
      expect(isUserEntitledToSpin({ success: true, data: { items: [] } })).toBe(false);
    });

    it('returns true when items array has 3 or more promotions available', () => {
      expect(
        isUserEntitledToSpin({
          success: true,
          status: 'OK',
          data: {
            items: [
              {
                campaignId: 10,
                title: 'Welcome Wheel',
                rewards: valid3Rewards,
              },
            ],
          },
        }),
      ).toBe(true);
    });
  });

  describe('UUID Persistence & Retry State', () => {
    it('creates a new UUID when no stored state exists', async () => {
      const id1 = await getOrCreateWheelRequestId();
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(10);

      const stored = await getStoredWheelRequestState();
      expect(stored?.requestId).toBe(id1);
      expect(stored?.failureCount).toBe(0);
    });

    it('reuses the same UUID when failureCount < 3 (user quit in between / backend failed)', async () => {
      const fixedId = 'a9c04d28-93c5-4b35-a76a-7d9e8d1f2021';
      await saveWheelRequestState({
        requestId: fixedId,
        failureCount: 1,
        createdAt: Date.now(),
      });

      const retrievedId = await getOrCreateWheelRequestId();
      expect(retrievedId).toBe(fixedId);
    });

    it('generates a fresh UUID when previous failureCount >= 3', async () => {
      const oldId = 'old-failed-id-1234';
      await saveWheelRequestState({
        requestId: oldId,
        failureCount: 3,
        createdAt: Date.now(),
      });

      const newId = await getOrCreateWheelRequestId();
      expect(newId).not.toBe(oldId);
    });
  });

  describe('checkLandingScreenWheelEntitlement', () => {
    it('sends user to normal flow if user is not registered (no access token)', async () => {
      getAccessToken.mockResolvedValueOnce(null);

      const onEntitled = jest.fn();
      const onNormalFlow = jest.fn();

      await checkLandingScreenWheelEntitlement({ onEntitled, onNormalFlow });

      expect(post).not.toHaveBeenCalled();
      expect(onEntitled).not.toHaveBeenCalled();
      expect(onNormalFlow).toHaveBeenCalledTimes(1);
    });

    it('calls onEntitled when registered user is eligible with >= 3 rewards and clears stored request state', async () => {
      getAccessToken.mockResolvedValueOnce('valid-bearer-token');
      post.mockResolvedValueOnce({
        success: true,
        data: {
          isEligible: true,
          canSpin: true,
          rewards: [
            { rewardId: 1, rewardName: '₹50 Off' },
            { rewardId: 2, rewardName: 'Free Delivery' },
            { rewardId: 3, rewardName: '100 Coins' },
          ],
        },
      });

      const onEntitled = jest.fn();
      const onNormalFlow = jest.fn();

      await checkLandingScreenWheelEntitlement({ onEntitled, onNormalFlow });

      expect(post).toHaveBeenCalledTimes(1);
      const postArgs = post.mock.calls[0][1];
      expect(postArgs.anonymousId).toBeNull();
      expect(typeof postArgs.requestId).toBe('string');

      expect(onEntitled).toHaveBeenCalledTimes(1);
      expect(onNormalFlow).not.toHaveBeenCalled();

      // Verified stored state is cleared after success
      const stored = await getStoredWheelRequestState();
      expect(stored).toBeNull();
    });

    it('sends user to normal flow when rewards count is less than 3', async () => {
      getAccessToken.mockResolvedValueOnce('valid-bearer-token');
      post.mockResolvedValueOnce({
        success: true,
        data: {
          isEligible: true,
          canSpin: true,
          rewards: [
            { rewardId: 1, rewardName: '₹50 Off' },
            { rewardId: 2, rewardName: 'Free Delivery' },
          ], // Only 2 rewards (< 3)
        },
      });

      const onEntitled = jest.fn();
      const onNormalFlow = jest.fn();

      await checkLandingScreenWheelEntitlement({ onEntitled, onNormalFlow });

      expect(onEntitled).not.toHaveBeenCalled();
      expect(onNormalFlow).toHaveBeenCalledTimes(1);
    });

    it('sends user to normal flow when registered user is NOT entitled', async () => {
      getAccessToken.mockResolvedValueOnce('valid-bearer-token');
      post.mockResolvedValueOnce({
        success: true,
        data: { isEligible: false },
      });

      const onEntitled = jest.fn();
      const onNormalFlow = jest.fn();

      await checkLandingScreenWheelEntitlement({ onEntitled, onNormalFlow });

      expect(onEntitled).not.toHaveBeenCalled();
      expect(onNormalFlow).toHaveBeenCalledTimes(1);
    });

    it('reuses existing UUID across quit / failure, retries up to 2 repetitions, then shows failure message and sends to normal flow', async () => {
      getAccessToken.mockResolvedValue('valid-bearer-token');
      // Simulate existing UUID from prior attempt where user quit
      const priorId = 'a9c04d28-93c5-4b35-a76a-7d9e8d1f2021';
      await saveWheelRequestState({
        requestId: priorId,
        failureCount: 1, // 1 previous failure
        createdAt: Date.now(),
      });

      // Subsequent 2 repetitions will fail
      post.mockRejectedValue(new Error('Backend 500 error'));

      const onEntitled = jest.fn();
      const onNormalFlow = jest.fn();

      await checkLandingScreenWheelEntitlement({ onEntitled, onNormalFlow });

      // Total attempts made in this run: 2 more repetitions (reaching 3 total)
      expect(post).toHaveBeenCalledTimes(2);
      expect(post.mock.calls[0][1].requestId).toBe(priorId);
      expect(post.mock.calls[1][1].requestId).toBe(priorId);

      // Failure toast shown
      expect(Toast.show).toHaveBeenCalledWith(
        'Something went wrong. Continuing to app...',
        Toast.SHORT,
      );

      // Sent to normal flow
      expect(onNormalFlow).toHaveBeenCalledTimes(1);
      expect(onEntitled).not.toHaveBeenCalled();

      // State is cleared so future sessions start fresh
      const stored = await getStoredWheelRequestState();
      expect(stored).toBeNull();
    });
  });

  describe('Backend Rewards Population for Onboarding Wheel', () => {
    it('populates campaign and rewards from backend items array', () => {
      const backendVisibilityData = {
        success: true,
        data: {
          items: [
            {
              campaignId: 2,
              campaignName: 'New User Welcome Wheel',
              rewards: [
                {
                  rewardId: 101,
                  rewardName: '₹150 OFF',
                  rewardType: 'Coupon',
                  rewardValue: 150,
                  code: 'NEW150',
                },
                {
                  rewardId: 102,
                  rewardName: 'Free Delivery',
                  rewardType: 'FreeDelivery',
                  code: 'FREEDEL',
                },
                {
                  rewardId: 103,
                  rewardName: '500 BCoins',
                  rewardType: 'BCoin',
                  rewardValue: 500,
                  code: 'COINS500',
                },
              ],
            },
          ],
        },
      };

      const extracted = extractCampaignAndRewards(backendVisibilityData);
      expect(extracted.campaignId).toBe(2);
      expect(extracted.campaignName).toBe('New User Welcome Wheel');
      expect(extracted.rewards).toHaveLength(3);

      const prizes = extracted.rewards.map((r, idx) =>
        mapBackendRewardToPrize(r, idx),
      );
      expect(prizes[0].wheelLabel).toBe('₹150 Off');
      expect(prizes[0].code).toBe('NEW150');
      expect(prizes[1].wheelLabel).toBe('Free Delivery');
      expect(prizes[1].code).toBe('FREEDEL');
      expect(prizes[2].wheelLabel).toBe('500 BCoins');
      expect(prizes[2].code).toBe('COINS500');
    });

    it('populates campaign and rewards from direct campaign/wheel object', () => {
      const backendVisibilityData = {
        success: true,
        data: {
          campaign: {
            campaignId: 5,
            campaignName: 'Super Onboarding Special',
            rewards: [
              {
                campaignItemId: 501,
                rewardName: 'Flat ₹200 Voucher',
                rewardType: 'PartnerVoucher',
                rewardValue: 200,
              },
              {
                campaignItemId: 502,
                rewardName: 'Better Luck Next Time',
                rewardType: 'NoPrize',
              },
            ],
          },
        },
      };

      const extracted = extractCampaignAndRewards(backendVisibilityData);
      expect(extracted.campaignId).toBe(5);
      expect(extracted.campaignName).toBe('Super Onboarding Special');
      expect(extracted.rewards).toHaveLength(2);

      const prizes = extracted.rewards.map((r, idx) =>
        mapBackendRewardToPrize(r, idx),
      );
      expect(prizes[0].wheelLabel).toBe('₹200 Voucher');
      expect(prizes[1].isNoPrize).toBe(true);
      expect(prizes[1].wheelLabel).toBe('Better Luck');
    });
  });
});

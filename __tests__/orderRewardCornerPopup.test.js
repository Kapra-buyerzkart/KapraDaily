jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => {}),
  removeItem: jest.fn(async () => {}),
  clear: jest.fn(async () => {}),
}));

import { mapBackendRewardToPrize } from '../src/api/spinWheelService';

describe('OrderRewardCornerPopup & Spin Wheel Segment Attributes', () => {
  it('correctly maps rewardName, displayText, rewardType, icon, value, and redemptionInstructions', () => {
    const rawReward = {
      id: 501,
      rewardName: 'Flat 20% OFF',
      displayText: 'MEGA DISCOUNT',
      rewardType: 'PERCENT_OFF',
      icon: 'ticket-percent',
      value: '20% OFF',
      code: 'MEGA20',
      redemptionInstructions: 'Valid on groceries above ₹499.',
    };

    const prize = mapBackendRewardToPrize(rawReward, 0);

    expect(prize.id).toBe('501');
    expect(prize.rewardName).toBe('Flat 20% OFF');
    expect(prize.displayText).toBe('MEGA DISCOUNT');
    expect(prize.rewardType).toBe('PERCENT_OFF');
    expect(prize.icon).toBe('ticket-percent');
    expect(prize.value).toBe('20% OFF');
    expect(prize.code).toBe('MEGA20');
    expect(prize.redemptionInstructions).toBe('Valid on groceries above ₹499.');

    // Backward compatibility mappings
    expect(prize.label).toBe('Flat 20% OFF');
    expect(prize.sublabel).toBe('MEGA DISCOUNT');
    expect(prize.iconName).toBe('ticket-percent');
  });

  it('falls back to default properties when optional backend fields are omitted', () => {
    const minimalReward = {
      id: 502,
      name: 'Free Delivery',
    };

    const prize = mapBackendRewardToPrize(minimalReward, 1);

    expect(prize.id).toBe('502');
    expect(prize.rewardName).toBe('Free Delivery');
    expect(prize.displayText).toBe('Free Delivery');
    expect(prize.code).toBe('SPIN2');
    expect(prize.label).toBe('Free Delivery');
    expect(prize.iconName).toBeDefined();
  });

  it('applies distinct neutral theme for rewardType: "NoPrize"', () => {
    const noPrizeReward = {
      id: 503,
      rewardName: 'Better Luck Next Time',
      displayText: 'TRY AGAIN',
      rewardType: 'NoPrize',
    };

    const prize = mapBackendRewardToPrize(noPrizeReward, 0);

    expect(prize.isNoPrize).toBe(true);
    expect(prize.rewardType).toBe('NoPrize');
    expect(prize.color1).toBe('#64748B');
    expect(prize.badge).toBe('TRY AGAIN');
    expect(prize.code).toBe('');
  });
});

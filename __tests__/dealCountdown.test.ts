import {
  computeDealTimeRemaining,
  sharedDealTicker,
} from '../src/utils/dealCountdown';

describe('dealCountdown', () => {
  it('computes remaining time accurately for future timestamps', () => {
    const now = 1700000000000;
    // 1 day, 2 hours, 3 minutes, 4 seconds
    const future = now + (1 * 86400 + 2 * 3600 + 3 * 60 + 4) * 1000;

    const result = computeDealTimeRemaining(future, now);
    expect(result.isEnded).toBe(false);
    expect(result.days).toBe(1);
    expect(result.hours).toBe(2);
    expect(result.minutes).toBe(3);
    expect(result.seconds).toBe(4);
    expect(result.formatted).toBe('Offer ends in 1days 2hrs 3mins 4secs');
  });

  it('handles expired timestamps without crashing', () => {
    const now = 1700000000000;
    const past = now - 5000;

    const result = computeDealTimeRemaining(past, now);
    expect(result.isEnded).toBe(true);
    expect(result.distance).toBe(0);
    expect(result.formatted).toBe('Offer ended');
  });

  it('manages singleton ticker subscriptions correctly', () => {
    const initialCount = sharedDealTicker.getSubscriberCount();
    const listener = jest.fn();

    const unsubscribe = sharedDealTicker.subscribe(listener);
    expect(sharedDealTicker.getSubscriberCount()).toBe(initialCount + 1);

    unsubscribe();
    expect(sharedDealTicker.getSubscriberCount()).toBe(initialCount);
  });
});

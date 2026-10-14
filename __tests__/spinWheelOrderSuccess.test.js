const mockAsyncStore = new Map();
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async k => (mockAsyncStore.has(k) ? mockAsyncStore.get(k) : null)),
  setItem: jest.fn(async (k, v) => { mockAsyncStore.set(k, v); }),
  removeItem: jest.fn(async k => { mockAsyncStore.delete(k); }),
  clear: jest.fn(async () => { mockAsyncStore.clear(); }),
}));

import {
  isOrderSpinClaimed,
  getOrderSpinReward,
  markOrderSpinClaimed,
  getSpinWheelStatusApi,
  executeSpinWheelApi,
} from '../src/api/spinWheelService';

describe('Spin Wheel Order Success Flow & Service', () => {
  beforeEach(async () => {
    mockAsyncStore.clear();
    jest.clearAllMocks();
  });

  it('marks an order spin as claimed and stores won reward', async () => {
    const testOrderId = 'order_test_999';
    const mockPrize = {
      id: 'p2',
      label: '₹50 Off Pantry',
      code: 'PANTRY50',
    };

    // Initially unclaimed
    const initialStatus = await isOrderSpinClaimed(testOrderId);
    expect(initialStatus).toBe(false);

    // Claim order spin
    await markOrderSpinClaimed(testOrderId, mockPrize);

    // Should now be claimed
    const updatedStatus = await isOrderSpinClaimed(testOrderId);
    expect(updatedStatus).toBe(true);

    // Should retrieve stored reward
    const rewardData = await getOrderSpinReward(testOrderId);
    expect(rewardData).toBeDefined();
    expect(rewardData?.orderId).toBe(testOrderId);
    expect(rewardData?.prize?.code).toBe('PANTRY50');
  });

  it('executes spin wheel API with fallback and persists to storage', async () => {
    const testOrderId = 'order_test_888';
    const mockPrize = {
      id: 'p1',
      label: 'Free Delivery',
      code: 'FREEDEL',
    };

    const result = await executeSpinWheelApi({
      orderId: testOrderId,
      source: 'ORDER_SUCCESS',
      winningIndex: 0,
      prize: mockPrize,
    });

    expect(result.success).toBe(true);
    expect(result.prize.code).toBe('FREEDEL');

    // Verification: order should now be recorded as claimed
    const isClaimed = await isOrderSpinClaimed(testOrderId);
    expect(isClaimed).toBe(true);
  });

  it('reports correct status for unclaimed vs claimed order', async () => {
    const testOrderId = 'order_test_777';

    // Unclaimed status
    const statusBefore = await getSpinWheelStatusApi(testOrderId);
    expect(statusBefore.isClaimed).toBe(false);
    expect(statusBefore.spinsAvailable).toBe(1);

    // Claim
    await markOrderSpinClaimed(testOrderId, { id: 'p3', label: '50 UD Coins' });

    // Claimed status
    const statusAfter = await getSpinWheelStatusApi(testOrderId);
    expect(statusAfter.isClaimed).toBe(true);
    expect(statusAfter.spinsAvailable).toBe(0);
  });
});

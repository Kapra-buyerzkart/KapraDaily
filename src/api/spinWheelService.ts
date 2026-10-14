import AsyncStorage from '@react-native-async-storage/async-storage';
import { get, post } from './networkUtils';
import logger from '../utils/logger';

const ORDER_SPIN_PREFIX = '@kapra_spin_order_';

export interface OrderSpinRewardData {
  orderId: string;
  claimedAt: string;
  prize: any;
}

export interface SpinWheelStatusResult {
  spinsAvailable: number;
  isOrderSpin: boolean;
  orderId?: string | null;
  isClaimed: boolean;
}

export interface ExecuteSpinPayload {
  orderId?: string | null;
  source?: string;
  winningIndex?: number;
  prize?: any;
}

/**
 * Checks if a specific order has already redeemed its spin.
 */
export const isOrderSpinClaimed = async (
  orderId?: string | null,
): Promise<boolean> => {
  if (!orderId) return false;
  try {
    const raw = await AsyncStorage.getItem(`${ORDER_SPIN_PREFIX}${orderId}`);
    return !!raw;
  } catch (error) {
    logger.error('Error checking order spin status:', error);
    return false;
  }
};

/**
 * Retrieves the won reward details for a given orderId (if claimed).
 */
export const getOrderSpinReward = async (
  orderId?: string | null,
): Promise<OrderSpinRewardData | null> => {
  if (!orderId) return null;
  try {
    const raw = await AsyncStorage.getItem(`${ORDER_SPIN_PREFIX}${orderId}`);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    logger.error('Error getting order spin reward:', error);
    return null;
  }
};

/**
 * Marks an order spin as claimed and stores the won prize details.
 */
export const markOrderSpinClaimed = async (
  orderId: string,
  prizeData: any,
): Promise<void> => {
  if (!orderId) return;
  try {
    const payload: OrderSpinRewardData = {
      orderId,
      claimedAt: new Date().toISOString(),
      prize: prizeData,
    };
    await AsyncStorage.setItem(
      `${ORDER_SPIN_PREFIX}${orderId}`,
      JSON.stringify(payload),
    );
  } catch (error) {
    logger.error('Error saving claimed order spin:', error);
  }
};

/**
 * Fetch spin wheel status from backend, with graceful local fallback.
 */
export const getSpinWheelStatusApi = async (
  orderId?: string | null,
): Promise<SpinWheelStatusResult> => {
  try {
    const response: any = await get(
      `spin-wheel/status${orderId ? `?orderId=${orderId}` : ''}`,
    );
    if (response?.data) {
      return response.data;
    }
  } catch (err) {
    logger.log(
      'Spin wheel API not reachable or pending backend; using fallback state.',
    );
  }

  // Fallback: check local storage for this order
  let isClaimed = false;
  if (orderId) {
    isClaimed = await isOrderSpinClaimed(orderId);
  }

  return {
    spinsAvailable: isClaimed ? 0 : 1,
    isOrderSpin: !!orderId,
    orderId,
    isClaimed,
  };
};

/**
 * Execute spin on backend, with graceful local fallback.
 */
export const executeSpinWheelApi = async ({
  orderId,
  source = 'ORDER_SUCCESS',
  winningIndex,
  prize,
}: ExecuteSpinPayload): Promise<any> => {
  try {
    const response: any = await post('spin-wheel/spin', {
      orderId,
      source,
      clientPrizeId: prize?.id,
    });
    if (response?.data) {
      if (orderId) {
        await markOrderSpinClaimed(orderId, response.data.prize || prize);
      }
      return response.data;
    }
  } catch (err) {
    logger.log(
      'Spin execution backend offline; committing to local storage fallback.',
    );
  }

  // Graceful local commit
  if (orderId && prize) {
    await markOrderSpinClaimed(orderId, prize);
  }

  return {
    success: true,
    winningIndex,
    prize,
  };
};

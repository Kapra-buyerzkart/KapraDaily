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
  campaignId?: number;
  raw?: any;
}

export interface PlaySpinWinPayload {
  orderId?: string | number | null;
  campaignId?: number;
  source?: string;
  winningIndex?: number;
  prize?: any;
}

export interface ExecuteSpinPayload extends PlaySpinWinPayload {}

export interface SpinWinHistoryParams {
  pageNumber?: number;
  pageSize?: number;
}

export interface SpinWinHistoryResponse {
  success?: boolean;
  data?: any;
  items?: any[];
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
  [key: string]: any;
}

export interface AssuredPrize {
  id: string;
  label: string;
  sublabel: string;
  badge: string;
  code: string;
  description: string;
  rewardName?: string;
  displayText?: string;
  rewardType?: string;
  icon?: string;
  value?: string | number;
  rewardValue?: number;
  rewardValueType?: string;
  validityDays?: number | null;
  couponMaxDiscountAmount?: number | null;
  couponMinOrderAmount?: number | null;
  couponUsageLimitPerUser?: number | null;
  winWeight?: number;
  campaignItemId?: number;
  campaignId?: number;
  rewardId?: number;
  wheelLabel?: string;
  titleLine1?: string;
  titleLine2?: string;
  redemptionInstructions?: string;
  color1: string;
  color2: string;
  textColor: string;
  iconName: string;
  isNoPrize?: boolean;
  [key: string]: any;
}

export const DEFAULT_OCTOBER_CAMPAIGN = {
  campaignId: 1,
  campaignName: 'October Spin & Win 2026',
  description: 'Sample Uden Deal post-order rewards campaign.',
  startDate: '2026-10-01T00:00:00',
  endDate: '2026-11-01T00:00:00',
  minOrderAmount: 16,
  maxBudgetAmount: 25000,
  storeId: 13,
  eligibleOrderAmount: 1694,
  rewards: [
    {
      campaignItemId: 1,
      campaignId: 1,
      rewardId: 1,
      rewardName: '₹50 Off Coupon',
      rewardType: 'Coupon',
      rewardValue: 50,
      rewardValueType: 'Fixed',
      validityDays: 15,
      couponMaxDiscountAmount: null,
      couponMinOrderAmount: null,
      couponUsageLimitPerUser: null,
      winWeight: 2000,
      displayText: '₹50 Off Coupon',
      icon: 'ticket',
    },
    {
      campaignItemId: 2,
      campaignId: 1,
      rewardId: 2,
      rewardName: 'Partner Voucher ₹200',
      rewardType: 'PartnerVoucher',
      rewardValue: 200,
      rewardValueType: 'Fixed',
      validityDays: 30,
      couponMaxDiscountAmount: null,
      couponMinOrderAmount: null,
      couponUsageLimitPerUser: null,
      winWeight: 500,
      displayText: 'Partner Voucher ₹200',
      icon: 'gift',
    },
    {
      campaignItemId: 3,
      campaignId: 1,
      rewardId: 3,
      rewardName: '100% Cashback',
      rewardType: 'Cashback',
      rewardValue: 100,
      rewardValueType: 'Percentage',
      validityDays: 7,
      couponMaxDiscountAmount: 100,
      couponMinOrderAmount: null,
      couponUsageLimitPerUser: null,
      winWeight: 10,
      displayText: '100% Cashback',
      icon: 'wallet',
    },
    {
      campaignItemId: 4,
      campaignId: 1,
      rewardId: 4,
      rewardName: '100 BCoins',
      rewardType: 'BCoin',
      rewardValue: 100,
      rewardValueType: 'Fixed',
      validityDays: 90,
      couponMaxDiscountAmount: null,
      couponMinOrderAmount: null,
      couponUsageLimitPerUser: null,
      winWeight: 2500,
      displayText: '100 BCOINS',
      icon: 'coins',
    },
    {
      campaignItemId: 5,
      campaignId: 1,
      rewardId: 5,
      rewardName: '₹100 Gift Card',
      rewardType: 'GiftCard',
      rewardValue: 100,
      rewardValueType: 'Fixed',
      validityDays: 30,
      couponMaxDiscountAmount: null,
      couponMinOrderAmount: null,
      couponUsageLimitPerUser: null,
      winWeight: 100,
      displayText: '₹100 Gift Card',
      icon: 'gift',
    },
    {
      campaignItemId: 6,
      campaignId: 1,
      rewardId: 6,
      rewardName: 'Free Delivery',
      rewardType: 'FreeDelivery',
      rewardValue: 0,
      rewardValueType: 'NotApplicable',
      validityDays: 7,
      couponMaxDiscountAmount: null,
      couponMinOrderAmount: null,
      couponUsageLimitPerUser: null,
      winWeight: 1500,
      displayText: 'FREE DELIVERY',
      icon: 'truck',
    },
    {
      campaignItemId: 7,
      campaignId: 1,
      rewardId: 7,
      rewardName: 'Better Luck Next Time',
      rewardType: 'NoPrize',
      rewardValue: 0,
      rewardValueType: 'NotApplicable',
      validityDays: null,
      couponMaxDiscountAmount: null,
      couponMinOrderAmount: null,
      couponUsageLimitPerUser: null,
      winWeight: 3390,
      displayText: 'BETTER LUCK NEXT TIME',
      icon: 'sparkles',
    },
  ],
};

export const REWARD_PALETTES = [
  { color1: '#059669', color2: '#047857', textColor: '#FFFFFF', iconName: 'ticket-percent', badge: 'COUPON' },
  { color1: '#7C3AED', color2: '#6D28D9', textColor: '#FFFFFF', iconName: 'gift', badge: 'VOUCHER' },
  { color1: '#EA580C', color2: '#C2410C', textColor: '#FFFFFF', iconName: 'wallet-giftcard', badge: 'CASHBACK' },
  { color1: '#D97706', color2: '#B45309', textColor: '#FFFFFF', iconName: 'cash-multiple', badge: 'BCOINS' },
  { color1: '#E11D48', color2: '#BE123C', textColor: '#FFFFFF', iconName: 'gift', badge: 'GIFT CARD' },
  { color1: '#0284C7', color2: '#0369A1', textColor: '#FFFFFF', iconName: 'truck-fast', badge: 'FREE DEL' },
  { color1: '#64748B', color2: '#475569', textColor: '#FFFFFF', iconName: 'clover', badge: 'TRY AGAIN' },
  { color1: '#0D9488', color2: '#0F766E', textColor: '#FFFFFF', iconName: 'star-circle', badge: 'SAVINGS' },
];

export const mapIconNameToMaterialIcon = (rawIcon?: string, rewardType?: string): string => {
  const icon = (rawIcon || '').toLowerCase().trim();
  const type = (rewardType || '').toLowerCase().trim();

  if (icon === 'ticket') return 'ticket-percent';
  if (icon === 'gift') return 'gift';
  if (icon === 'wallet') return 'wallet-giftcard';
  if (icon === 'coins' || icon === 'coin' || icon === 'bcoin' || icon === 'bcoins') return 'cash-multiple';
  if (icon === 'truck' || icon === 'delivery') return 'truck-fast';
  if (icon === 'sparkles' || icon === 'sparkle') return 'star-four-points';

  if (type === 'coupon') return 'ticket-percent';
  if (type === 'partnervoucher') return 'gift';
  if (type === 'cashback') return 'wallet-giftcard';
  if (type === 'bcoin') return 'cash-multiple';
  if (type === 'giftcard') return 'gift';
  if (type === 'freedelivery') return 'truck-fast';
  if (type === 'noprize') return 'clover';

  return icon || 'gift';
};

export const formatWheelTitle = (name: string, type: string, value: any) => {
  const cleanName = (name || '').trim();
  const lowerName = cleanName.toLowerCase();
  const lowerType = (type || '').toLowerCase();

  if (lowerType === 'noprize' || lowerName.includes('better luck')) {
    return { wheelLabel: 'Better Luck', line1: 'Better', line2: 'Luck' };
  }
  if (lowerType === 'freedelivery' || lowerName.includes('free delivery')) {
    return { wheelLabel: 'Free Delivery', line1: 'Free', line2: 'Delivery' };
  }
  if (lowerType === 'coupon' || lowerName.includes('coupon')) {
    const valText = value ? `₹${value}` : '';
    return {
      wheelLabel: valText ? `${valText} Off` : cleanName,
      line1: valText || cleanName,
      line2: valText ? 'Off' : '',
    };
  }
  if (lowerType === 'partnervoucher' || lowerName.includes('partner')) {
    const valText = value ? `₹${value}` : '';
    return {
      wheelLabel: valText ? `${valText} Voucher` : cleanName,
      line1: valText || cleanName,
      line2: valText ? 'Voucher' : '',
    };
  }
  if (lowerType === 'cashback' || lowerName.includes('cashback')) {
    const valText = value ? `${value}%` : '';
    return {
      wheelLabel: valText ? `${valText} Cashback` : cleanName,
      line1: valText || cleanName,
      line2: valText ? 'Cashback' : '',
    };
  }
  if (lowerType === 'bcoin' || lowerName.includes('bcoin')) {
    const valText = value ? `${value}` : '';
    return {
      wheelLabel: valText ? `${valText} BCoins` : cleanName,
      line1: valText || cleanName,
      line2: valText ? 'BCoins' : '',
    };
  }
  if (lowerType === 'giftcard' || lowerName.includes('gift card')) {
    const valText = value ? `₹${value}` : '';
    return {
      wheelLabel: valText ? `${valText} Gift` : cleanName,
      line1: valText || cleanName,
      line2: valText ? 'Gift' : '',
    };
  }

  // Fallback: split on middle space if long
  const words = cleanName.split(' ');
  if (words.length >= 2 && cleanName.length > 9) {
    const mid = Math.ceil(words.length / 2);
    return {
      wheelLabel: cleanName,
      line1: words.slice(0, mid).join(' '),
      line2: words.slice(mid).join(' '),
    };
  }

  return { wheelLabel: cleanName, line1: cleanName, line2: '' };
};

export const mapBackendRewardToPrize = (item: any, index: number): AssuredPrize => {
  const palette = REWARD_PALETTES[index % REWARD_PALETTES.length];
  const rName = String(
    item.rewardName || item.label || item.title || item.name || 'Reward',
  );
  const dText = String(
    item.displayText ||
      item.sublabel ||
      item.subTitle ||
      item.discount ||
      item.tag ||
      rName ||
      'ASSURED',
  );
  const rType = String(item.rewardType || item.type || item.badge || palette.badge);
  const rawIcon = String(item.icon || item.iconName || palette.iconName);
  const rValue =
    item.rewardValue !== undefined
      ? item.rewardValue
      : item.value !== undefined
      ? item.value
      : item.discountAmount || item.discountPercent || item.amount || '';

  const isNoPrize =
    rType.toLowerCase() === 'noprize' ||
    rName.toLowerCase().includes('no prize') ||
    rName.toLowerCase().includes('better luck') ||
    dText.toLowerCase().includes('better luck');

  const { wheelLabel, line1, line2 } = formatWheelTitle(rName, rType, rValue);

  // Sublabel (shown in badge pill on wheel slice)
  let sublabel = 'ASSURED';
  if (isNoPrize) {
    sublabel = 'NEXT TIME';
  } else if (rType.toLowerCase() === 'coupon') {
    sublabel = 'COUPON';
  } else if (rType.toLowerCase() === 'partnervoucher') {
    sublabel = 'PARTNER';
  } else if (rType.toLowerCase() === 'cashback') {
    sublabel = 'CASHBACK';
  } else if (rType.toLowerCase() === 'bcoin') {
    sublabel = 'BCOINS';
  } else if (rType.toLowerCase() === 'giftcard') {
    sublabel = 'GIFT CARD';
  } else if (rType.toLowerCase() === 'freedelivery') {
    sublabel = 'ZERO FEE';
  } else if (item.sublabel) {
    sublabel = String(item.sublabel).toUpperCase();
  } else if (dText.length <= 10 && dText.toLowerCase() !== rName.toLowerCase()) {
    sublabel = dText.toUpperCase();
  }

  // Showcase Badge
  let badge = palette.badge;
  if (isNoPrize) {
    badge = 'TRY AGAIN';
  } else if (rType.toLowerCase() === 'coupon') {
    badge = rValue ? `FLAT ₹${rValue}` : 'COUPON';
  } else if (rType.toLowerCase() === 'partnervoucher') {
    badge = rValue ? `₹${rValue} OFF` : 'VOUCHER';
  } else if (rType.toLowerCase() === 'cashback') {
    badge = item.couponMaxDiscountAmount ? `UP TO ₹${item.couponMaxDiscountAmount}` : '100% BACK';
  } else if (rType.toLowerCase() === 'bcoin') {
    badge = 'COINS';
  } else if (rType.toLowerCase() === 'giftcard') {
    badge = 'SPECIAL';
  } else if (rType.toLowerCase() === 'freedelivery') {
    badge = 'FREE DEL';
  } else if (item.badge) {
    badge = String(item.badge);
  }

  // Promo / Coupon Code: prioritize backend code
  let code = String(item.code || item.couponCode || item.promoCode || '').trim();
  if (!code && !isNoPrize) {
    if (rType.toLowerCase() === 'coupon') code = `FLAT${rValue || 50}`;
    else if (rType.toLowerCase() === 'partnervoucher') code = `PV${rValue || 200}`;
    else if (rType.toLowerCase() === 'cashback') code = `CASH${rValue || 100}`;
    else if (rType.toLowerCase() === 'bcoin') code = `BCOIN${rValue || 100}`;
    else if (rType.toLowerCase() === 'giftcard') code = `GIFT${rValue || 100}`;
    else if (rType.toLowerCase() === 'freedelivery') code = 'FREEDEL';
  }

  // Description / Redemption Instructions: strictly from backend
  const rInstructions = String(
    item.redemptionInstructions ||
      item.instructions ||
      item.terms ||
      item.description ||
      item.displayText ||
      rName,
  ).trim();

  const defaultColor1 = isNoPrize ? '#64748B' : palette.color1;
  const defaultColor2 = isNoPrize ? '#475569' : palette.color2;
  const defaultIcon = isNoPrize ? 'clover' : mapIconNameToMaterialIcon(rawIcon, rType);

  return {
    id: String(item.campaignItemId ?? item.rewardId ?? item.id ?? item.prizeId ?? `p_${index}`),
    campaignItemId: item.campaignItemId,
    campaignId: item.campaignId,
    rewardId: item.rewardId,
    label: rName,
    wheelLabel,
    titleLine1: line1,
    titleLine2: line2,
    sublabel,
    badge,
    code,
    description: rInstructions,
    rewardName: rName,
    displayText: dText,
    rewardType: rType,
    rewardValue: typeof rValue === 'number' ? rValue : undefined,
    rewardValueType: item.rewardValueType,
    validityDays: item.validityDays,
    couponMaxDiscountAmount: item.couponMaxDiscountAmount,
    couponMinOrderAmount: item.couponMinOrderAmount,
    couponUsageLimitPerUser: item.couponUsageLimitPerUser,
    winWeight: item.winWeight,
    icon: rawIcon,
    value: rValue,
    redemptionInstructions: rInstructions,
    isNoPrize,
    color1: item.color1 || defaultColor1,
    color2: item.color2 || defaultColor2,
    textColor: item.textColor || palette.textColor,
    iconName: item.iconName || defaultIcon,
  };
};

export interface ExtractedCampaignRewards {
  campaignId: number;
  campaignName: string;
  description?: string;
  minOrderAmount?: number;
  maxBudgetAmount?: number;
  storeId?: number;
  eligibleOrderAmount?: number;
  rewards: any[];
}

export const extractCampaignAndRewards = (responseOrData: any): ExtractedCampaignRewards => {
  const data =
    responseOrData?.data !== undefined ? responseOrData.data : responseOrData;

  let campaignObj: any = null;
  let rewardsList: any[] = [];

  if (Array.isArray(data?.items) && data.items.length > 0) {
    if (Array.isArray(data.items[0]?.rewards)) {
      campaignObj = data.items[0];
      rewardsList = campaignObj.rewards;
    } else {
      rewardsList = data.items;
    }
  } else if (Array.isArray(data?.rewards)) {
    rewardsList = data.rewards;
  } else if (Array.isArray(data?.prizes)) {
    rewardsList = data.prizes;
  } else if (Array.isArray(data)) {
    if (data.length > 0 && Array.isArray(data[0]?.rewards)) {
      campaignObj = data[0];
      rewardsList = campaignObj.rewards;
    } else {
      rewardsList = data;
    }
  } else if (Array.isArray(responseOrData?.rewards)) {
    rewardsList = responseOrData.rewards;
  } else if (Array.isArray(responseOrData?.items)) {
    if (responseOrData.items.length > 0 && Array.isArray(responseOrData.items[0]?.rewards)) {
      campaignObj = responseOrData.items[0];
      rewardsList = campaignObj.rewards;
    } else {
      rewardsList = responseOrData.items;
    }
  }

  const campaignId =
    campaignObj?.campaignId ??
    data?.campaignId ??
    responseOrData?.campaignId ??
    1;

  const campaignName =
    campaignObj?.campaignName ??
    campaignObj?.name ??
    data?.campaignName ??
    data?.campaignTitle ??
    data?.title ??
    responseOrData?.campaignName ??
    'October Spin & Win 2026';

  const description = campaignObj?.description ?? data?.description;
  const minOrderAmount = campaignObj?.minOrderAmount ?? data?.minOrderAmount;
  const maxBudgetAmount = campaignObj?.maxBudgetAmount ?? data?.maxBudgetAmount;
  const storeId = campaignObj?.storeId ?? data?.storeId;
  const eligibleOrderAmount = campaignObj?.eligibleOrderAmount ?? data?.eligibleOrderAmount;

  return {
    campaignId,
    campaignName,
    description,
    minOrderAmount,
    maxBudgetAmount,
    storeId,
    eligibleOrderAmount,
    rewards: rewardsList,
  };
};

export const selectWeightedRewardIndex = (rewards: AssuredPrize[]): number => {
  if (!rewards || rewards.length === 0) return 0;
  const totalWeight = rewards.reduce((sum, r) => sum + (Number(r.winWeight) || 100), 0);
  let randomVal = Math.random() * totalWeight;
  for (let i = 0; i < rewards.length; i++) {
    const weight = Number(rewards[i].winWeight) || 100;
    if (randomVal < weight) {
      return i;
    }
    randomVal -= weight;
  }
  return rewards.length - 1;
};

export const isOrderSpinClaimed = async (
  orderId?: string | number | null,
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

export const getOrderSpinReward = async (
  orderId?: string | number | null,
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

export const markOrderSpinClaimed = async (
  orderId: string | number,
  prizeData: any,
): Promise<void> => {
  if (!orderId) return;
  try {
    const payload: OrderSpinRewardData = {
      orderId: String(orderId),
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

export const checkSpinWinEligibility = async (
  orderId?: string | number | null,
): Promise<any> => {
  const query = orderId ? `?orderId=${encodeURIComponent(String(orderId))}` : '';
  try {
    const data = await get(`rewards/spin-win/eligible${query}`);
    console.log('checkSpinWinEligibility response:', data);
    return data;
  } catch (error: any) {
    const errorData = error?.response?.data || error?.data || error?.message || error;
    console.log('checkSpinWinEligibility response:', errorData);
    throw error;
  }
};

export const playSpinWin = async ({
  orderId,
  campaignId = 1,
}: PlaySpinWinPayload = {}): Promise<any> => {
  const payload: Record<string, any> = {
    campaignId: campaignId !== undefined && campaignId !== null ? Number(campaignId) || campaignId : 1,
  };

  if (orderId !== undefined && orderId !== null && String(orderId).trim() !== '') {
    const parsedOrderId = Number(orderId);
    payload.orderId = !isNaN(parsedOrderId) ? parsedOrderId : orderId;
  }

  try {
    const data = await post('rewards/spin-win/play', payload);
    console.log('playSpinWin response:', data);
    return data;
  } catch (error: any) {
    const errorData = error?.response?.data || error?.data || error?.message || error;
    console.log('playSpinWin response:', errorData);
    throw error;
  }
};

export const getSpinWinHistory = async ({
  pageNumber = 1,
  pageSize = 20,
}: SpinWinHistoryParams = {}): Promise<SpinWinHistoryResponse> => {
  try {
    const data = await get(`rewards/spin-win/history?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    console.log('getSpinWinHistory response:', data);
    return data;
  } catch (error: any) {
    const errorData = error?.response?.data || error?.data || error?.message || error;
    console.log('getSpinWinHistory response:', errorData);
    throw error;
  }
};

export const getSpinWheelStatusApi = async (
  orderId?: string | number | null,
): Promise<SpinWheelStatusResult> => {
  let isClaimedLocally = false;
  if (orderId) {
    isClaimedLocally = await isOrderSpinClaimed(orderId);
  }

  try {
    const response: any = await checkSpinWinEligibility(orderId);
    console.log('getSpinWheelStatusApi response:', response);
    const data = response?.data !== undefined ? response.data : response;
    const campaignInfo = extractCampaignAndRewards(response);

    let isEligible = true;
    if (typeof data === 'boolean') {
      isEligible = data;
    } else if (data && typeof data === 'object') {
      if (typeof data.isEligible === 'boolean') {
        isEligible = data.isEligible;
      } else if (typeof data.canSpin === 'boolean') {
        isEligible = data.canSpin;
      } else if (typeof data.spinsAvailable === 'number') {
        isEligible = data.spinsAvailable > 0;
      } else if (campaignInfo.rewards && campaignInfo.rewards.length > 0) {
        isEligible = true;
      }
    }

    const spins = isEligible && !isClaimedLocally ? (data?.spinsAvailable ?? 1) : 0;

    return {
      spinsAvailable: spins,
      isOrderSpin: !!orderId,
      orderId: orderId ? String(orderId) : null,
      isClaimed: isClaimedLocally || !isEligible,
      campaignId: campaignInfo.campaignId || data?.campaignId,
      raw: data,
    };
  } catch (err) {
    logger.log(
      'Spin wheel eligibility API not reachable or pending backend; using fallback state.',
    );
  }

  return {
    spinsAvailable: isClaimedLocally ? 0 : 1,
    isOrderSpin: !!orderId,
    orderId: orderId ? String(orderId) : null,
    isClaimed: isClaimedLocally,
  };
};

export const executeSpinWheelApi = async ({
  orderId,
  campaignId = 1,
  winningIndex,
  prize,
}: ExecuteSpinPayload): Promise<any> => {
  try {
    const response: any = await playSpinWin({
      orderId,
      campaignId,
      winningIndex,
      prize,
    });
    console.log('executeSpinWheelApi response:', response);

    const responseData = response?.data !== undefined ? response.data : response;

    if (orderId) {
      await markOrderSpinClaimed(orderId, responseData?.prize || prize);
    }

    return {
      success: true,
      winningIndex,
      prize: responseData?.prize || prize,
      data: responseData,
    };
  } catch (err) {
    logger.log(
      'Spin execution backend offline; committing to local storage fallback.',
    );
  }

  if (orderId && prize) {
    await markOrderSpinClaimed(orderId, prize);
  }

  return {
    success: true,
    winningIndex,
    prize,
  };
};

import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { get, post } from './networkUtils';
import { getAccessToken } from './tokenService';
import { generateUUID as uuidv4 } from '../utils/uuid';
import logger from '../utils/logger';

const ORDER_SPIN_PREFIX = '@kapra_spin_order_';
const ONBOARDING_SPIN_KEY = '@kapra_spin_onboarding_welcome';

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

export const DUMMY_ONBOARDING_CAMPAIGN = {
  campaignId: 9999,
  campaignName: 'New User Welcome Rewards',
  description: 'Welcome bonus spin for newly registered KapraDaily users.',
  rewards: [
    {
      campaignItemId: 901,
      rewardId: 901,
      rewardName: '₹100 Off Welcome Gift',
      rewardType: 'Coupon',
      rewardValue: 100,
      rewardValueType: 'Fixed',
      validityDays: 14,
      displayText: '₹100 OFF',
      icon: 'ticket',
      code: 'WELCOME100',
      description: 'Flat ₹100 off on your first order above ₹299.',
      winWeight: 3000,
    },
    {
      campaignItemId: 902,
      rewardId: 902,
      rewardName: 'Free Delivery',
      rewardType: 'FreeDelivery',
      rewardValue: 0,
      rewardValueType: 'NotApplicable',
      validityDays: 30,
      displayText: 'FREE DEL',
      icon: 'truck-fast',
      code: 'FREEDEL3',
      description: 'Zero delivery fee on your first 3 grocery orders.',
      winWeight: 2500,
    },
    {
      campaignItemId: 903,
      rewardId: 903,
      rewardName: '50 UD Coins Welcome Bonus',
      rewardType: 'BCoin',
      rewardValue: 50,
      rewardValueType: 'Fixed',
      validityDays: 60,
      displayText: '50 COINS',
      icon: 'coins',
      code: 'COINS50',
      description: '50 UD Coins credited to your wallet for instant savings.',
      winWeight: 2000,
    },
    {
      campaignItemId: 904,
      rewardId: 904,
      rewardName: '₹50 Off Fresh Fruits & Veggies',
      rewardType: 'Coupon',
      rewardValue: 50,
      rewardValueType: 'Fixed',
      validityDays: 14,
      displayText: '₹50 OFF',
      icon: 'tag',
      code: 'FRESH50',
      description: '₹50 off on farm fresh vegetables & fruits.',
      winWeight: 2000,
    },
    {
      campaignItemId: 905,
      rewardId: 905,
      rewardName: 'Flat 20% Off Essentials',
      rewardType: 'Coupon',
      rewardValue: 20,
      rewardValueType: 'Percentage',
      validityDays: 14,
      displayText: '20% OFF',
      icon: 'percent',
      code: 'SAVE20',
      description: 'Flat 20% discount on daily essentials and groceries.',
      winWeight: 1500,
    },
    {
      campaignItemId: 906,
      rewardId: 906,
      rewardName: '₹75 Off Super Saver',
      rewardType: 'Coupon',
      rewardValue: 75,
      rewardValueType: 'Fixed',
      validityDays: 14,
      displayText: '₹75 OFF',
      icon: 'gift',
      code: 'SAVER75',
      description: 'Save ₹75 on order value of ₹399 and above.',
      winWeight: 1500,
    },
    {
      campaignItemId: 907,
      rewardId: 907,
      rewardName: 'Double Coins (2X) on First Order',
      rewardType: 'BCoin',
      rewardValue: 2,
      rewardValueType: 'Multiplier',
      validityDays: 30,
      displayText: '2X COINS',
      icon: 'lightning-bolt',
      code: '2XCOINS',
      description: 'Earn 2X UD coins on your entire first order purchase.',
      winWeight: 1000,
    },
    {
      campaignItemId: 908,
      rewardId: 908,
      rewardName: 'Jackpot Mystery Gift Box',
      rewardType: 'GiftCard',
      rewardValue: 150,
      rewardValueType: 'Fixed',
      validityDays: 14,
      displayText: 'JACKPOT',
      icon: 'crown',
      code: 'MEGA150',
      description: 'Mega ₹150 off on orders above ₹599.',
      winWeight: 800,
    },
  ],
};

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
      rewardName: 'Flat ₹25 OFF',
      rewardType: 'Coupon',
      rewardValue: 25,
      rewardValueType: 'Fixed',
      validityDays: 15,
      couponMaxDiscountAmount: null,
      couponMinOrderAmount: null,
      couponUsageLimitPerUser: null,
      winWeight: 2000,
      displayText: 'FLAT ₹25 OFF',
      icon: 'ticket',
    },
    {
      campaignItemId: 8,
      campaignId: 1,
      rewardId: 8,
      rewardName: '50 Bonus Coins',
      rewardType: 'BCoin',
      rewardValue: 50,
      rewardValueType: 'Fixed',
      validityDays: 60,
      couponMaxDiscountAmount: null,
      couponMinOrderAmount: null,
      couponUsageLimitPerUser: null,
      winWeight: 1390,
      displayText: '50 BCOINS',
      icon: 'coins',
    },
  ],
};

export const REWARD_PALETTES = [
  { color1: '#FF5722', color2: '#D84315', textColor: '#FFFFFF', iconName: 'ticket-percent', badge: 'COUPON' },
  { color1: '#10B981', color2: '#059669', textColor: '#FFFFFF', iconName: 'truck-fast', badge: 'FREE DEL' },
  { color1: '#F59E0B', color2: '#D97706', textColor: '#FFFFFF', iconName: 'cash-multiple', badge: 'BCOINS' },
  { color1: '#06B6D4', color2: '#0891B2', textColor: '#FFFFFF', iconName: 'ticket-percent', badge: 'COUPON' },
  { color1: '#8B5CF6', color2: '#6D28D9', textColor: '#FFFFFF', iconName: 'percent', badge: 'OFFER' },
  { color1: '#EC4899', color2: '#DB2777', textColor: '#FFFFFF', iconName: 'gift', badge: 'VOUCHER' },
  { color1: '#FBBF24', color2: '#D97706', textColor: '#FFFFFF', iconName: 'star-four-points', badge: 'BONUS' },
  { color1: '#EF4444', color2: '#DC2626', textColor: '#FFFFFF', iconName: 'wallet-giftcard', badge: 'GIFT' },
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
  const cleanName = (name || '')
    .replace(/^home\s*wheel\s*[-–—:]\s*/i, '')
    .trim();
  const lowerName = cleanName.toLowerCase();
  const lowerType = (type || '').toLowerCase();

  if (lowerType === 'noprize' || lowerName.includes('better luck')) {
    return { wheelLabel: 'Better Luck', line1: 'Better', line2: 'Luck' };
  }
  if (lowerType === 'freedelivery' || lowerName.includes('free delivery')) {
    return { wheelLabel: 'Free Delivery', line1: 'Free', line2: 'Delivery' };
  }
  if (lowerType === 'coupon' || lowerName.includes('coupon') || lowerName.includes('off')) {
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
  if (
    lowerType === 'bcoin' ||
    lowerName.includes('bcoin') ||
    lowerName.includes('token') ||
    lowerName.includes('coin')
  ) {
    const numMatch = cleanName.match(/\d+/);
    const num = value || (numMatch ? numMatch[0] : '');
    const unit = lowerName.includes('token') ? 'Tokens' : 'BCoins';
    const label = num ? `${num} ${unit}` : cleanName;
    return {
      wheelLabel: label,
      line1: String(num || cleanName),
      line2: num ? unit : '',
    };
  }
  if (lowerType === 'giftcard' || lowerName.includes('gift card') || lowerName.includes('gift')) {
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
      'LUCKY',
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
  let sublabel = 'LUCKY';
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

  // Promo / Coupon Code: strictly from backend only
  const code = String(item.code || item.couponCode || item.promoCode || '').trim();

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

  const directCampaign =
    data?.campaign || data?.wheel || data?.homeWheel || data?.rewardWheel;
  if (directCampaign && typeof directCampaign === 'object') {
    campaignObj = directCampaign;
    if (Array.isArray(directCampaign.rewards)) {
      rewardsList = directCampaign.rewards;
    } else if (Array.isArray(directCampaign.slices)) {
      rewardsList = directCampaign.slices;
    } else if (Array.isArray(directCampaign.items)) {
      rewardsList = directCampaign.items;
    } else if (Array.isArray(directCampaign.prizes)) {
      rewardsList = directCampaign.prizes;
    }
  } else if (Array.isArray(data?.items) && data.items.length > 0) {
    if (Array.isArray(data.items[0]?.rewards)) {
      campaignObj = data.items[0];
      rewardsList = campaignObj.rewards;
    } else if (Array.isArray(data.items[0]?.slices)) {
      campaignObj = data.items[0];
      rewardsList = campaignObj.slices;
    } else if (Array.isArray(data.items[0]?.items)) {
      campaignObj = data.items[0];
      rewardsList = campaignObj.items;
    } else if (Array.isArray(data.items[0]?.prizes)) {
      campaignObj = data.items[0];
      rewardsList = campaignObj.prizes;
    } else {
      rewardsList = data.items;
    }
  } else if (Array.isArray(data?.promotions) && data.promotions.length > 0) {
    if (Array.isArray(data.promotions[0]?.rewards)) {
      campaignObj = data.promotions[0];
      rewardsList = campaignObj.rewards;
    } else if (Array.isArray(data.promotions[0]?.items)) {
      campaignObj = data.promotions[0];
      rewardsList = campaignObj.items;
    } else {
      rewardsList = data.promotions;
    }
  } else if (Array.isArray(data?.rewards)) {
    rewardsList = data.rewards;
  } else if (Array.isArray(data?.prizes)) {
    rewardsList = data.prizes;
  } else if (Array.isArray(data?.slices)) {
    rewardsList = data.slices;
  } else if (Array.isArray(data)) {
    if (data.length > 0 && Array.isArray(data[0]?.rewards)) {
      campaignObj = data[0];
      rewardsList = campaignObj.rewards;
    } else if (data.length > 0 && Array.isArray(data[0]?.items)) {
      campaignObj = data[0];
      rewardsList = campaignObj.items;
    } else {
      rewardsList = data;
    }
  } else if (Array.isArray(responseOrData?.rewards)) {
    rewardsList = responseOrData.rewards;
  } else if (Array.isArray(responseOrData?.items)) {
    if (responseOrData.items.length > 0 && Array.isArray(responseOrData.items[0]?.rewards)) {
      campaignObj = responseOrData.items[0];
      rewardsList = campaignObj.rewards;
    } else if (responseOrData.items.length > 0 && Array.isArray(responseOrData.items[0]?.items)) {
      campaignObj = responseOrData.items[0];
      rewardsList = campaignObj.items;
    } else {
      rewardsList = responseOrData.items;
    }
  }

  const campaignId =
    campaignObj?.campaignId ??
    campaignObj?.id ??
    data?.campaignId ??
    data?.id ??
    responseOrData?.campaignId ??
    responseOrData?.id ??
    0;

  const campaignName =
    campaignObj?.campaignName ??
    campaignObj?.name ??
    campaignObj?.title ??
    data?.campaignName ??
    data?.campaignTitle ??
    data?.name ??
    data?.title ??
    responseOrData?.campaignName ??
    responseOrData?.title ??
    '';

  const description = campaignObj?.description ?? data?.description;
  const minOrderAmount = campaignObj?.minOrderAmount ?? data?.minOrderAmount;
  const maxBudgetAmount = campaignObj?.maxBudgetAmount ?? data?.maxBudgetAmount;
  const storeId = campaignObj?.storeId ?? data?.storeId;
  const eligibleOrderAmount = campaignObj?.eligibleOrderAmount ?? data?.eligibleOrderAmount;

  const finalRewards =
    Array.isArray(rewardsList) ? rewardsList : [];

  return {
    campaignId,
    campaignName,
    description,
    minOrderAmount,
    maxBudgetAmount,
    storeId,
    eligibleOrderAmount,
    rewards: finalRewards,
  };
};

export const isRewardValidGift = (item: any): boolean => {
  if (!item) return false;
  const type = String(item?.rewardType || item?.type || '').toLowerCase().trim();
  const name = String(item?.rewardName || item?.name || item?.label || item?.title || '').toLowerCase().trim();
  const dText = String(item?.displayText || item?.sublabel || '').toLowerCase().trim();
  return (
    type !== 'noprize' &&
    !name.includes('better luck') &&
    !name.includes('no prize') &&
    !dText.includes('better luck') &&
    !dText.includes('no prize') &&
    !item?.isNoPrize
  );
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

export const isOnboardingSpinClaimed = async (): Promise<boolean> => {
  try {
    const val = await AsyncStorage.getItem(ONBOARDING_SPIN_KEY);
    return val !== null;
  } catch (error) {
    return false;
  }
};

export const getOnboardingSpinReward = async (): Promise<any | null> => {
  try {
    const raw = await AsyncStorage.getItem(ONBOARDING_SPIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

export const markOnboardingSpinClaimed = async (
  prizeData: any,
): Promise<void> => {
  try {
    const payload = {
      claimedAt: new Date().toISOString(),
      prize: prizeData,
    };
    await AsyncStorage.setItem(ONBOARDING_SPIN_KEY, JSON.stringify(payload));
  } catch (error) {
    logger.error('Error saving claimed onboarding spin:', error);
  }
};

export const resetOnboardingSpinClaim = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ONBOARDING_SPIN_KEY);
  } catch (error) {
    logger.error('Error resetting claimed onboarding spin:', error);
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

export interface HomeWheelMySpinsParams {
  pageNumber?: number;
  pageSize?: number;
}

export interface HomeWheelMySpinsResponse {
  success?: boolean;
  status?: string;
  message?: string;
  data?: any;
  items?: any[];
  [key: string]: any;
}

/**
 * Fetches joining / welcome spin rewards history for the authenticated user
 * Endpoint: api/v1/rewards/home-wheel/my-spins?pageNumber=X&pageSize=Y
 */
export const getHomeWheelMySpins = async ({
  pageNumber = 1,
  pageSize = 20,
}: HomeWheelMySpinsParams = {}): Promise<HomeWheelMySpinsResponse> => {
  try {
    const data = await get(`rewards/home-wheel/my-spins?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    console.log('getHomeWheelMySpins response:', data);
    return data;
  } catch (error: any) {
    const errorData = error?.response?.data || error?.data || error?.message || error;
    console.log('getHomeWheelMySpins response error:', errorData);
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

export interface HomeWheelVisibilityPayload {
  requestId: string;
  anonymousId?: string | null;
}

export interface HomeWheelVisibilityResponse {
  success?: boolean;
  status?: string;
  message?: string;
  data?: any;
  [key: string]: any;
}

export interface WheelRequestState {
  requestId: string;
  failureCount: number;
  createdAt: number;
}

export const WHEEL_VISIBILITY_REQUEST_STATE_KEY = '@kapra_home_wheel_request_state';

/**
 * Checks visibility/eligibility for the home/onboarding spin wheel
 * Endpoint: api/v1/rewards/home-wheel/visibility
 * Payload: { requestId: string, anonymousId: null }
 */
export const checkHomeWheelVisibilityApi = async (
  payload: HomeWheelVisibilityPayload,
): Promise<HomeWheelVisibilityResponse> => {
  const requestBody = {
    requestId: payload.requestId,
    anonymousId: payload.anonymousId ?? null,
  };
  console.log(
    'checkHomeWheelVisibilityApi request payload:\n',
requestBody,"===================+++++",
  );
  try {
    const data = await post('rewards/home-wheel/visibility', requestBody);
    console.log(
      'checkHomeWheelVisibilityApi response data:\n',
      data,
      '===================+++++',
    );
    return data;
  } catch (error: any) {
    const errorData =
      error?.response?.data || error?.data || error?.message || error;
    console.log(
      'checkHomeWheelVisibilityApi error response:\n',
      JSON.stringify(errorData, null, 2),
    );
    throw error;
  }
};

export interface PlayHomeWheelPayload {
  campaignId: number | string;
  requestId?: string;
  anonymousId?: string | null;
}

export interface PlayHomeWheelResponse {
  success?: boolean;
  status?: string;
  message?: string;
  data?: any;
  [key: string]: any;
}

/**
 * Plays the home/onboarding spin wheel
 * Endpoint: api/v1/rewards/home-wheel/play
 * Payload: { campaignId: number | string, requestId: string, anonymousId: null | string }
 */
export const playHomeWheelApi = async (
  payload: PlayHomeWheelPayload,
): Promise<PlayHomeWheelResponse> => {
  const requestBody = {
    campaignId:
      payload.campaignId !== undefined && payload.campaignId !== null
        ? !isNaN(Number(payload.campaignId))
          ? Number(payload.campaignId)
          : payload.campaignId
        : 2,
    requestId: payload.requestId || uuidv4(),
    anonymousId: payload.anonymousId !== undefined ? payload.anonymousId : null,
  };
  console.log(
    'playHomeWheelApi request payload:\n',
    requestBody,
    '===================+++++',
  );
  try {
    const data = await post('rewards/home-wheel/play', requestBody);
    console.log(
      'playHomeWheelApi response data:\n',
      data,
      '===================+++++',
    );
    return data;
  } catch (error: any) {
    const errorData =
      error?.response?.data || error?.data || error?.message || error;
    console.log(
      'playHomeWheelApi error response:\n',
      JSON.stringify(errorData, null, 2),
    );
    throw error;
  }
};


/**
 * Determines whether the user is entitled to spin the wheel based on backend response
 */
export const isUserEntitledToSpin = (responseOrData: any): boolean => {
  if (!responseOrData) return false;
  if (typeof responseOrData === 'boolean') return responseOrData;
  if (responseOrData.success === false) return false;

  const data =
    responseOrData?.data !== undefined ? responseOrData.data : responseOrData;

  if (typeof data === 'boolean') return data;

  // Explicit negative eligibility indicators from backend
  if (data?.isEligible === false) return false;
  if (data?.canSpin === false) return false;
  if (data?.isVisible === false) return false;
  if (data?.isEntitled === false) return false;
  if (data?.hasAvailableSpin === false) return false;
  if (data?.spinsAvailable === 0) return false;
  if (data?.spinsLeft === 0) return false;
  if (data?.availableSpins === 0) return false;

  if (typeof responseOrData.isEligible === 'boolean' && !responseOrData.isEligible) return false;
  if (typeof responseOrData.canSpin === 'boolean' && !responseOrData.canSpin) return false;
  if (typeof responseOrData.isVisible === 'boolean' && !responseOrData.isVisible) return false;
  if (typeof responseOrData.isEntitled === 'boolean' && !responseOrData.isEntitled) return false;

  if (
    typeof responseOrData.message === 'string' &&
    (responseOrData.message.toLowerCase().includes('no home wheel') ||
      responseOrData.message.toLowerCase().includes('not eligible') ||
      responseOrData.message.toLowerCase().includes('no promotions'))
  ) {
    return false;
  }

  // Extract rewards strictly from backend data (no dummy fallback)
  const { rewards } = extractCampaignAndRewards(responseOrData);

  // STRICT REQUIREMENT: If the rewards are less than 3, do NOT show the spin wheel or its flow!
  if (!Array.isArray(rewards) || rewards.length < 3) {
    return false;
  }

  // Positive eligibility checks
  if (
    data?.isEligible === true ||
    data?.canSpin === true ||
    data?.isVisible === true ||
    data?.isEntitled === true ||
    data?.hasAvailableSpin === true ||
    (typeof data?.spinsAvailable === 'number' && data.spinsAvailable > 0) ||
    (typeof data?.spinsLeft === 'number' && data.spinsLeft > 0) ||
    (typeof data?.availableSpins === 'number' && data.availableSpins > 0) ||
    data?.campaignId !== undefined ||
    data?.wheelId !== undefined ||
    rewards.length >= 3
  ) {
    return true;
  }

  return false;
};

export const getStoredWheelRequestState = async (): Promise<WheelRequestState | null> => {
  try {
    const raw = await AsyncStorage.getItem(WHEEL_VISIBILITY_REQUEST_STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    logger.error('Error getting stored wheel request state:', error);
    return null;
  }
};

export const saveWheelRequestState = async (state: WheelRequestState): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      WHEEL_VISIBILITY_REQUEST_STATE_KEY,
      JSON.stringify(state),
    );
  } catch (error) {
    logger.error('Error saving wheel request state:', error);
  }
};

export const clearWheelRequestState = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(WHEEL_VISIBILITY_REQUEST_STATE_KEY);
  } catch (error) {
    logger.error('Error clearing wheel request state:', error);
  }
};

export const getOrCreateWheelRequestId = async (): Promise<string> => {
  try {
    const state = await getStoredWheelRequestState();
    // Re-use same UUID if failureCount < 3 (initial attempt + up to 2 repetitions)
    if (
      state &&
      state.requestId &&
      typeof state.failureCount === 'number' &&
      state.failureCount < 3
    ) {
      return state.requestId;
    }
    const newId = uuidv4();
    await saveWheelRequestState({
      requestId: newId,
      failureCount: 0,
      createdAt: Date.now(),
    });
    return newId;
  } catch {
    return uuidv4();
  }
};

export interface CheckLandingWheelParams {
  onEntitled: (visibilityData?: any) => void;
  onNormalFlow: () => void;
}

/**
 * Handles landing screen button press wheel entitlement check:
 * 1. Checks if the registered user is logged in (has valid token)
 * 2. Generates random UUID or reuses existing stored UUID if user previously quit or backend failed (< 3 total attempts)
 * 3. Calls api/v1/rewards/home-wheel/visibility
 * 4. If entitled: executes onEntitled(data)
 * 5. If not entitled: executes onNormalFlow()
 * 6. If API fails: reuses same UUID for up to 2 more repetitions (3 attempts total).
 *    On 3rd failure: shows failure toast and sends user to normal flow.
 */
export const checkLandingScreenWheelEntitlement = async ({
  onEntitled,
  onNormalFlow,
}: CheckLandingWheelParams): Promise<void> => {
  try {
    // 1. Check if user is registered: registered user has valid access token
    const token = await getAccessToken();
    if (!token) {
      logger.log('[WheelVisibility] User is not registered; sending to normal flow.');
      onNormalFlow();
      return;
    }

    // 2. Retrieve existing state or create a fresh UUID
    let state = await getStoredWheelRequestState();
    if (
      !state ||
      !state.requestId ||
      (typeof state.failureCount === 'number' && state.failureCount >= 3)
    ) {
      state = {
        requestId: uuidv4(),
        failureCount: 0,
        createdAt: Date.now(),
      };
      await saveWheelRequestState(state);
    }

    const currentRequestId = state.requestId;
    let failureCount = state.failureCount || 0;
    let callSuccess = false;
    let lastError: any = null;
    let response: any = null;

    // 3. Attempt API call with up to 2 repetitions (3 attempts total)
    while (failureCount < 3 && !callSuccess) {
      try {
        response = await checkHomeWheelVisibilityApi({
          requestId: currentRequestId,
          anonymousId: null,
        });
        callSuccess = true;
      } catch (err: any) {
        lastError = err;
        failureCount += 1;
        // Persist failure count immediately in AsyncStorage so if user quits in between, it is preserved
        await saveWheelRequestState({
          requestId: currentRequestId,
          failureCount,
          createdAt: state.createdAt || Date.now(),
        });

        if (failureCount < 3) {
          // Short pause before repetition
          await new Promise<void>(res => setTimeout(() => res(), 500));
        }
      }
    }

    if (callSuccess) {
      // Clear stored UUID on success
      await clearWheelRequestState();

      const entitled = isUserEntitledToSpin(response);
      console.log(
        '[WheelVisibility] Entitlement check result:',
        entitled ? 'ENTITLED (Spin Allowed)' : 'NOT ENTITLED (Normal Flow)',
        '\nData:',
        JSON.stringify(response?.data !== undefined ? response.data : response, null, 2),
      );

      if (entitled) {
        onEntitled(response?.data !== undefined ? response.data : response);
      } else {
        onNormalFlow();
      }
    } else {
      // All 3 attempts failed (initial + 2 repetitions)
      logger.warn('[WheelVisibility] Failed after 2 repetitions:', lastError);
      await clearWheelRequestState();
      Toast.show('Something went wrong. Continuing to app...', Toast.SHORT);
      onNormalFlow();
    }
  } catch (error) {
    logger.error('[WheelVisibility] Unexpected error in checkLandingScreenWheelEntitlement:', error);
    onNormalFlow();
  }
};


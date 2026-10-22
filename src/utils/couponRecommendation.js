/**
 * Smart Coupon Recommendation & Evaluation Engine
 *
 * Automatically evaluates available coupons from the backend against the
 * current cart state, determines eligibility, calculates estimated savings,
 * and identifies the best recommended coupon or switch offers.
 */

export const normalizeCoupon = item => {
  if (!item) return null;
  const code = String(
    item.couponCode || item.code || item.giftCode || item.promoCode || '',
  ).trim();
  if (!code) return null;

  const rawType = String(
    item.discountType || item.type || item.couponType || '',
  ).toUpperCase();
  const discountType =
    rawType.includes('PERCENT') || rawType === '%' ? 'PERCENT' : 'FLAT';

  const discountValue = Number(
    item.discountValue ?? item.discount ?? item.value ?? 0,
  );

  const maxDiscountAmount =
    item.maxDiscountAmount != null
      ? Number(item.maxDiscountAmount)
      : item.maxDiscount != null
      ? Number(item.maxDiscount)
      : null;

  const minOrderAmount = Number(
    item.minOrderAmount ??
      item.minOrderValue ??
      item.minCartValue ??
      item.minOrder ??
      0,
  );

  const title =
    item.couponName ||
    item.title ||
    item.name ||
    (discountType === 'PERCENT'
      ? `${discountValue}% OFF`
      : `Flat ₹${discountValue} OFF`);

  let description = item.description || '';
  if (!description) {
    if (discountType === 'PERCENT') {
      description =
        maxDiscountAmount && maxDiscountAmount > 0
          ? `Get ${discountValue}% OFF up to ₹${maxDiscountAmount}`
          : `Get ${discountValue}% OFF`;
    } else {
      description = `Flat ₹${discountValue} OFF`;
    }
  }

  const validTo =
    item.validTo ||
    item.expiresAt ||
    item.validTill ||
    item.expiryDate ||
    null;
  const validFrom = item.validFrom || item.startDate || null;

  return {
    raw: item,
    id: item.couponId || item.id || code,
    code,
    title,
    description,
    discountType,
    discountValue,
    maxDiscountAmount,
    minOrderAmount,
    validTo,
    validFrom,
    terms: item.termsAndConditions || item.terms || '',
  };
};

export const isCouponExpired = validTo => {
  if (!validTo) return false;
  const expiryDate = new Date(validTo);
  return !isNaN(expiryDate.getTime()) && expiryDate.getTime() < Date.now();
};

export const isCouponNotYetActive = validFrom => {
  if (!validFrom) return false;
  const startDate = new Date(validFrom);
  return !isNaN(startDate.getTime()) && startDate.getTime() > Date.now();
};

/**
 * Calculates the estimated discount for a coupon given a cart value.
 * Never exceeds cartValue. Capped at maxDiscountAmount if percentage-based.
 */
export const calculateCouponDiscount = (coupon, cartValue) => {
  const value = Math.max(0, Number(cartValue) || 0);
  if (!coupon || value <= 0) return 0;

  let estimated = 0;
  if (coupon.discountType === 'PERCENT') {
    estimated = (value * (Number(coupon.discountValue) || 0)) / 100;
    if (coupon.maxDiscountAmount && coupon.maxDiscountAmount > 0) {
      estimated = Math.min(estimated, coupon.maxDiscountAmount);
    }
  } else {
    estimated = Math.min(Number(coupon.discountValue) || 0, value);
  }

  return Math.round(estimated * 100) / 100;
};

/**
 * Evaluates coupon eligibility against current cart value.
 */
export const evaluateCoupon = (rawCoupon, cartValue = 0) => {
  const coupon = normalizeCoupon(rawCoupon);
  if (!coupon) return null;

  if (isCouponExpired(coupon.validTo)) {
    return {
      ...coupon,
      isEligible: false,
      reason: 'Offer has expired',
      shortfall: 0,
      estimatedDiscount: 0,
    };
  }

  if (isCouponNotYetActive(coupon.validFrom)) {
    return {
      ...coupon,
      isEligible: false,
      reason: 'Offer is not active yet',
      shortfall: 0,
      estimatedDiscount: 0,
    };
  }

  const currentCartValue = Math.max(0, Number(cartValue) || 0);

  if (coupon.minOrderAmount > 0 && currentCartValue < coupon.minOrderAmount) {
    const shortfall =
      Math.round((coupon.minOrderAmount - currentCartValue) * 100) / 100;
    const potentialDiscount = calculateCouponDiscount(
      coupon,
      coupon.minOrderAmount,
    );
    return {
      ...coupon,
      isEligible: false,
      shortfall,
      reason: `Add ₹${Math.ceil(shortfall)} more to unlock this offer`,
      estimatedDiscount: potentialDiscount,
    };
  }

  const estimatedDiscount = calculateCouponDiscount(coupon, currentCartValue);
  return {
    ...coupon,
    isEligible: estimatedDiscount > 0,
    shortfall: 0,
    reason:
      estimatedDiscount > 0
        ? null
        : 'Cart value too low for discount',
    estimatedDiscount,
  };
};

/**
 * Evaluates all available coupons and identifies:
 * - bestCoupon: top eligible coupon with highest valid savings
 * - betterCoupon: an eligible coupon offering higher savings than currently applied coupon
 * - unlockableCoupon: the closest ineligible coupon by shortfall
 * - eligibleCoupons: all eligible coupons sorted by savings
 */
export const getCouponRecommendations = ({
  coupons = [],
  cartValue = 0,
  appliedCouponCode = null,
  appliedDiscountAmount = 0,
}) => {
  const evaluated = (coupons || [])
    .map(c => evaluateCoupon(c, cartValue))
    .filter(Boolean);

  const nonExpired = evaluated.filter(c => !isCouponExpired(c.validTo));

  const eligibleCoupons = nonExpired
    .filter(c => c.isEligible && c.estimatedDiscount > 0)
    .sort((a, b) => {
      // 1. Highest estimated savings first
      if (b.estimatedDiscount !== a.estimatedDiscount) {
        return b.estimatedDiscount - a.estimatedDiscount;
      }
      // 2. Lower min order requirement first
      if (a.minOrderAmount !== b.minOrderAmount) {
        return a.minOrderAmount - b.minOrderAmount;
      }
      // 3. Earlier expiry first
      if (a.validTo && b.validTo) {
        return new Date(a.validTo) - new Date(b.validTo);
      }
      return 0;
    });

  const ineligibleCoupons = nonExpired
    .filter(c => !c.isEligible && c.shortfall > 0)
    .sort((a, b) => a.shortfall - b.shortfall);

  const bestCoupon = eligibleCoupons.length > 0 ? eligibleCoupons[0] : null;

  // Check if a better coupon is available compared to what is currently applied
  let betterCoupon = null;
  let extraSavings = 0;
  if (appliedCouponCode && eligibleCoupons.length > 0) {
    const currentAppliedNorm = appliedCouponCode.trim().toUpperCase();
    const currentDiscount = Number(appliedDiscountAmount) || 0;

    // Find if any other eligible coupon gives higher savings
    const candidate = eligibleCoupons.find(
      c =>
        c.code.trim().toUpperCase() !== currentAppliedNorm &&
        c.estimatedDiscount > currentDiscount,
    );

    if (candidate) {
      betterCoupon = candidate;
      extraSavings =
        Math.round((candidate.estimatedDiscount - currentDiscount) * 100) /
        100;
    }
  }

  // Next tier coupon: higher savings than bestCoupon if user adds more to cart
  let nextTierCoupon = null;
  if (bestCoupon && ineligibleCoupons.length > 0) {
    const higherTierCandidates = ineligibleCoupons.filter(
      c => c.estimatedDiscount > bestCoupon.estimatedDiscount,
    );
    if (higherTierCandidates.length > 0) {
      nextTierCoupon = higherTierCandidates[0];
    }
  }

  const unlockableCoupon =
    ineligibleCoupons.length > 0 ? ineligibleCoupons[0] : null;

  return {
    bestCoupon,
    betterCoupon,
    extraSavings,
    nextTierCoupon,
    unlockableCoupon,
    eligibleCoupons,
    ineligibleCoupons,
    allValidCoupons: nonExpired,
    totalCount: nonExpired.length,
  };
};

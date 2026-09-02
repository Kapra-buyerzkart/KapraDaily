import { resolveImageSource } from '../../../Home/redesign/data/mappers';
import { PDP_ART } from '../assets';

const FEATURE_ICONS = [
  PDP_ART.featFire,
  PDP_ART.featStar,
  PDP_ART.featGasStove,
  PDP_ART.featShield,
];

export type Feature = {
  id: string;
  icon: any;
  title: string;
  subtitle: string;
};

export const money = (value: any) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    return '';
  }
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const galleryImages = (details: any, fallback: any) => {
  const images = details?.images || [];
  const sources = images
    .map((entry: any) => resolveImageSource(entry?.imageUrl || entry))
    .filter(Boolean);

  if (sources.length > 0) {
    return sources;
  }

  const single = resolveImageSource(
    fallback?.featuredImage || fallback?.imageUrl || fallback?.image,
  );
  return single ? [single] : [];
};

export const productTitle = (product: any) =>
  product?.prName || product?.title || product?.name || '';

export const productSubtitle = (product: any) =>
  product?.shortDescription || product?.catName || product?.brandName || '';

export const productDescription = (product: any) => {
  const raw = product?.description || product?.shortDescription || '';
  return String(raw)
    .replace(/<\/?[^>]+(>|$)/g, '')
    .trim();
};

export const pricing = (product: any) => {
  const mrp = Number(product?.unitPrice) || 0;
  const price = Number(product?.specialPrice) || mrp;
  const saved = mrp > price ? mrp - price : 0;
  const percent = mrp > 0 && saved > 0 ? Math.round((saved / mrp) * 100) : 0;

  return {
    price: money(price),
    mrp: saved > 0 ? money(mrp) : '',
    saved: money(saved),
    percent,
    discountLabel: percent > 0 ? `${percent}%` : '',
    saveLabel: saved > 0 ? `You save ${money(saved)} (${percent}% OFF)` : '',
  };
};

export const ratingSummary = (details: any) => ({
  average: Number(details?.ratingSummary?.avgRating || 0).toFixed(1),
  ratings:
    details?.ratingSummary?.ratingCount ??
    details?.ratingSummary?.reviewCount ??
    0,
  reviews: details?.ratingSummary?.reviewCount ?? 0,
});

export const isOutOfStock = (product: any) =>
  Number(product?.stockQty) <= 0 ||
  product?.stockAvailability === 'Out Of Stock';

export const featureList = (details: any): Feature[] =>
  (details?.attributes || [])
    .slice(0, 4)
    .map((attr: any, index: number) => ({
      id: String(attr?.attrId ?? index),
      icon: FEATURE_ICONS[index % FEATURE_ICONS.length],
      title: attr?.attrName || '',
      subtitle: attr?.attrValue || '',
    }))
    .filter((feature: Feature) => Boolean(feature.title));

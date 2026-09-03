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

export type ReviewBar = {
  star: number;
  percent: number;
};

export type ReviewEntry = {
  id: string;
  name: string;
  date: string;
  rating: number;
  comment: string;
};

const reviewDate = (value: any) => {
  if (!value) {
    return '';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }
  return parsed
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .replace(/ (\w+) /, ' $1, ');
};

export const reviewList = (details: any): ReviewEntry[] =>
  (details?.reviews || []).map((entry: any, index: number) => ({
    id: String(entry?.reviewId ?? entry?.id ?? index),
    name:
      entry?.customerName || entry?.userName || entry?.name || 'Anonymous',
    date: reviewDate(entry?.createdDate || entry?.reviewDate || entry?.date),
    rating: Number(entry?.rating ?? entry?.ratingValue ?? 0),
    comment: String(entry?.comment || entry?.review || entry?.description || '')
      .replace(/<\/?[^>]+(>|$)/g, '')
      .trim(),
  }));

export const reviewSummary = (details: any) => {
  const summary = details?.ratingSummary;
  const reviews = reviewList(details);

  const total = Number(
    summary?.ratingCount ?? summary?.reviewCount ?? reviews.length ?? 0,
  );

  const counts = [5, 4, 3, 2, 1].map(star => {
    const fromSummary =
      summary?.[`star${star}`] ??
      summary?.[`rating${star}`] ??
      summary?.[`count${star}`];
    if (fromSummary !== undefined && fromSummary !== null) {
      return Number(fromSummary) || 0;
    }
    return reviews.filter(entry => Math.round(entry.rating) === star).length;
  });

  const totalCounts = counts.reduce((sum, value) => sum + value, 0);

  const bars: ReviewBar[] = counts.map((count, index) => ({
    star: 5 - index,
    percent: totalCounts > 0 ? Math.round((count / totalCounts) * 100) : 0,
  }));

  const average = Number(
    summary?.avgRating ??
      summary?.averageRating ??
      (reviews.length
        ? reviews.reduce((sum, entry) => sum + entry.rating, 0) / reviews.length
        : 0),
  );

  return {
    average: average.toFixed(1),
    total,
    bars,
    hasData: totalCounts > 0 || reviews.length > 0,
  };
};

export const specificationList = (details: any) =>
  (details?.attributes || []).map((attr: any, index: number) => ({
    id: String(attr?.productAttrId ?? attr?.attrId ?? index),
    label: attr?.attrName || '',
    value: attr?.attrValue || '',
  }));

export const warrantyText = (details: any, product: any) => {
  const attr = (details?.attributes || []).find((entry: any) =>
    String(entry?.attrName || '')
      .toLowerCase()
      .includes('warranty'),
  );
  if (attr?.attrValue) {
    return String(attr.attrValue);
  }
  return product?.warranty
    ? String(product.warranty)
    : 'Warranty details are not available for this product.';
};

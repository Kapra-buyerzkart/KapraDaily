import type { ProductTile, Tile } from '../../../Home/redesign/content';
import {
  mapCategoryTile,
  mapProductTile,
  resolveImageSource,
} from '../../../Home/redesign/data/mappers';
import { CATEGORY_ART } from '../categoryAssets';

export const ALL_TILE_ID = '__all__';

export const resolveCategoryFallback = (name: string) => {
  const lower = (name || '').toLowerCase();
  if (lower.includes('ring')) return CATEGORY_ART.catRings;
  if (lower.includes('earring')) return CATEGORY_ART.catEarrings;
  if (lower.includes('necklace') || lower.includes('pendant'))
    return CATEGORY_ART.catNecklaces;
  if (lower.includes('bangle') || lower.includes('bracelet'))
    return CATEGORY_ART.catBangles;
  if (lower.includes('chain')) return CATEGORY_ART.catChains;
  if (lower.includes('gift')) return CATEGORY_ART.catGifts;
  return CATEGORY_ART.catRings;
};

export const toCategoryTiles = (items: any[], includeAll = false): Tile[] => {
  const mapped = (items || []).map((cat, idx) => {
    const tile = mapCategoryTile(cat, idx);
    if (!tile.image) {
      tile.image = resolveCategoryFallback(tile.label);
    }
    return tile;
  });

  if (includeAll) {
    const allTile: Tile = {
      id: ALL_TILE_ID,
      label: 'All',
      image: CATEGORY_ART.catAll,
      raw: null,
    };
    return [allTile, ...mapped];
  }

  return mapped;
};

export const toSubCategoryTiles = (items: any[], parent?: any): Tile[] => {
  if (!items || items.length === 0) {
    return [];
  }

  const parentImg = resolveImageSource(parent?.imageUrl ?? parent?.ImageUrl);

  const allTile: Tile = {
    id: ALL_TILE_ID,
    label: 'All',
    image: parentImg || null,
    raw: parent,
  };

  const mapped = items.map((cat, idx) => mapCategoryTile(cat, idx));

  return [allTile, ...mapped];
};

export const formatProductSubtitle = (raw: any): string => {
  if (!raw) return '';
  const purity =
    raw.purity ||
    raw.goldPurity ||
    raw.metalPurity ||
    (raw.goldType ? `${raw.goldType} Gold` : '');
  const stone =
    raw.gemstone ||
    raw.stoneType ||
    raw.diamondType ||
    raw.material ||
    raw.stone ||
    raw.subCategoryName;
  const cat = raw.catName || raw.categoryName;

  if (purity && stone) return `${purity} | ${stone}`;
  if (purity && cat) return `${purity} | ${cat}`;
  if (purity) return purity;
  if (stone) return stone;
  if (cat) return cat;
  return '';
};

export const toProductCards = (items: any[]): ProductTile[] =>
  (items || []).map((item, idx) => {
    const tile = mapProductTile(item, idx);
    if (!tile.subtitle) {
      tile.subtitle = formatProductSubtitle(item);
    }
    return tile;
  });

export const bannerSource = (category: any) =>
  resolveImageSource(category?.mobBannerImgUrl ?? category?.MobBannerImgUrl);

export const findCategory = (items: any[], id: string | null) =>
  (items || []).find(
    cat =>
      cat?.catId?.toString() === id ||
      cat?.id?.toString() === id ||
      cat?.catName?.toLowerCase() === id?.toLowerCase(),
  );

export const isOutOfStock = (item: any) =>
  item?.stockQty <= 0 || item?.stockAvailability === 'Out Of Stock';

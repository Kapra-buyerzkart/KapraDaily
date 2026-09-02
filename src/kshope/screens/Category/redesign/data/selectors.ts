import type { ProductTile, Tile } from '../../../Home/redesign/content';
import {
  mapCategoryTile,
  mapProductTile,
  resolveImageSource,
} from '../../../Home/redesign/data/mappers';

export const ALL_TILE_ID = '__all__';

export const toCategoryTiles = (items: any[]): Tile[] =>
  (items || []).map(mapCategoryTile);

export const toSubCategoryTiles = (items: any[], parent?: any): Tile[] => {
  if (!items || items.length === 0) {
    return [];
  }
  const allTile: Tile = {
    id: ALL_TILE_ID,
    label: 'All',
    image: resolveImageSource(parent?.imageUrl ?? parent?.ImageUrl),
    raw: parent,
  };
  return [allTile, ...items.map(mapCategoryTile)];
};

export const toProductCards = (items: any[]): ProductTile[] =>
  (items || []).map(mapProductTile);

export const bannerSource = (category: any) =>
  resolveImageSource(category?.mobBannerImgUrl ?? category?.MobBannerImgUrl);

export const findCategory = (items: any[], id: string | null) =>
  (items || []).find(cat => cat?.catId?.toString() === id);

export const isOutOfStock = (item: any) =>
  item?.stockQty <= 0 || item?.stockAvailability === 'Out Of Stock';

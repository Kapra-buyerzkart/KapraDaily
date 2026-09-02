const {
  resolveImageSource,
  toPricing,
  mapProductTile,
  mapRecCard,
  mapCategoryTile,
  mapBrandTile,
  mapRecentlyViewed,
  orFallback,
} = require('../src/kshope/screens/Home/redesign/data/mappers');

describe('resolveImageSource', () => {
  it('returns null when there is no path', () => {
    expect(resolveImageSource(null)).toBeNull();
    expect(resolveImageSource('')).toBeNull();
  });

  it('passes absolute urls through as a uri source', () => {
    expect(resolveImageSource('https://cdn.test/a.png')).toEqual({
      uri: 'https://cdn.test/a.png',
    });
  });

  it('prefixes relative paths with the image base url', () => {
    expect(resolveImageSource('media/a.png')).toEqual({
      uri: 'https://kshadmin.kapradaily.com/media/a.png',
    });
    expect(resolveImageSource('/media/a.png')).toEqual({
      uri: 'https://kshadmin.kapradaily.com/media/a.png',
    });
  });

  it('leaves an already-built source object alone', () => {
    const src = { uri: 'https://cdn.test/a.png' };
    expect(resolveImageSource(src)).toBe(src);
  });
});

describe('toPricing', () => {
  it('formats special price against unit price and derives the discount', () => {
    expect(toPricing({ specialPrice: 1500, unitPrice: 2000 })).toEqual({
      price: '₹1500/-',
      mrp: '₹2000/-',
      discount: '25% OFF',
    });
  });

  it('prefers an explicit discount percent', () => {
    expect(toPricing({ price: 900, mrp: 1000, discountPercent: 42.4 })).toEqual({
      price: '₹900/-',
      mrp: '₹1000/-',
      discount: '42% OFF',
    });
  });

  it('blanks the mrp and discount when there is no markdown', () => {
    expect(toPricing({ price: 1000, mrp: 1000 })).toEqual({
      price: '₹1000/-',
      mrp: '',
      discount: '',
    });
  });

  it('survives an item with no pricing at all', () => {
    expect(toPricing({})).toEqual({ price: '', mrp: '', discount: '' });
  });
});

describe('mapProductTile', () => {
  it('maps an api product onto the featured tile shape', () => {
    const item = {
      productId: 77,
      brandName: 'Impex',
      prName: '900 w Iron Box',
      specialPrice: 1500,
      unitPrice: 2000,
      featuredImage: 'media/iron.png',
    };

    expect(mapProductTile(item, 0)).toEqual({
      id: '77',
      brand: 'Impex',
      name: '900 w Iron Box',
      price: '₹1500/-',
      mrp: '₹2000/-',
      discount: '25% OFF',
      image: { uri: 'https://kshadmin.kapradaily.com/media/iron.png' },
      raw: item,
    });
  });

  it('falls back to the index when the product carries no id', () => {
    expect(mapProductTile({ prName: 'x' }, 3).id).toBe('product-3');
  });
});

describe('mapRecCard', () => {
  it('splits the product name across name and subtitle', () => {
    const item = {
      id: 12,
      prName: 'boAt Rockerz 450 Bluetooth Headphones',
      catName: 'Bluetooth Headphones',
      price: 1499,
      mrp: 2499,
      imageUrl: 'media/boat.png',
    };

    expect(mapRecCard(item, 0)).toEqual({
      id: '12',
      name: 'boAt Rockerz 450 Bluetooth Headphones',
      subtitle: 'Bluetooth Headphones',
      price: '₹1499/-',
      mrp: '₹2499/-',
      discount: '40% OFF',
      image: { uri: 'https://kshadmin.kapradaily.com/media/boat.png' },
      raw: item,
    });
  });

  it('leaves the subtitle empty when the item has no category', () => {
    expect(mapRecCard({ id: 1, prName: 'Thing' }, 0).subtitle).toBe('');
  });
});

describe('mapCategoryTile', () => {
  it('reads the pascal-cased field names the api also emits', () => {
    const cat = { CatId: 5, CatName: 'Television', ImageUrl: 'media/tv.png' };

    expect(mapCategoryTile(cat, 0)).toEqual({
      id: '5',
      label: 'Television',
      image: { uri: 'https://kshadmin.kapradaily.com/media/tv.png' },
      raw: cat,
    });
  });
});

describe('mapBrandTile', () => {
  it('keys off the banner id and image', () => {
    const banner = { bannerId: 9, imageUrl: 'media/apple.png' };

    expect(mapBrandTile(banner, 0)).toEqual({
      id: '9',
      image: { uri: 'https://kshadmin.kapradaily.com/media/apple.png' },
      raw: banner,
    });
  });
});

describe('mapRecentlyViewed', () => {
  it('maps to the label/price pair the strip renders', () => {
    const item = { productId: 4, prName: 'Earpods', price: 1499, mrp: 2499 };

    expect(mapRecentlyViewed(item, 0)).toEqual({
      id: '4',
      label: 'Earpods',
      price: '₹1499/-',
      mrp: '₹2499/-',
      raw: item,
    });
  });
});

describe('orFallback', () => {
  const fallback = [{ id: 'static' }];

  it('uses the mapped api rows when there are any', () => {
    expect(orFallback([{ id: 'live' }], fallback)).toEqual([{ id: 'live' }]);
  });

  it('falls back to the static design content when the block is empty', () => {
    expect(orFallback([], fallback)).toBe(fallback);
    expect(orFallback(null, fallback)).toBe(fallback);
    expect(orFallback(undefined, fallback)).toBe(fallback);
  });
});

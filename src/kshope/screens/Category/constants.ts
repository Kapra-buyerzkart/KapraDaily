export const filterOptions = {
  Prize: ['Below ₹500', '₹500 - ₹1000', '₹1000 - ₹2000', 'Above ₹2000'],
  'Sort by': ['relevance', 'price_low_to_high', 'price_high_to_low', 'rating', 'newest'],
};

export const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Latest', value: 'latest' },
  { label: 'A to Z', value: 'a-z' },
  { label: 'Z to A', value: 'z-a' },
  { label: 'Price: Low to High', value: 'lowToHigh' },
  { label: 'Price: High to Low', value: 'highToLow' },
];

export const DEFAULT_PRICE_MIN = 0;
export const DEFAULT_PRICE_MAX = 50000;

export const CATEGORY_SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevance', value: 'relevance' },
  { id: 'latest', label: 'Newest first', value: 'latest' },
  { id: 'lowToHigh', label: 'Price: Low to High', value: 'lowToHigh' },
  { id: 'highToLow', label: 'Price: High to Low', value: 'highToLow' },
  { id: 'a-z', label: 'Name: A to Z', value: 'a-z' },
  { id: 'z-a', label: 'Name: Z to A', value: 'z-a' },
];

export const CATEGORY_PRICE_BANDS = [
  {
    id: 'any',
    label: 'Any price',
    min: DEFAULT_PRICE_MIN,
    max: DEFAULT_PRICE_MAX,
  },
  { id: '0-500', label: 'Below ₹500', min: 0, max: 500 },
  { id: '500-1000', label: '₹500 - ₹1000', min: 500, max: 1000 },
  { id: '1000-2000', label: '₹1000 - ₹2000', min: 1000, max: 2000 },
  { id: '2000-5000', label: '₹2000 - ₹5000', min: 2000, max: 5000 },
  {
    id: '5000-up',
    label: 'Above ₹5000',
    min: 5000,
    max: DEFAULT_PRICE_MAX,
  },
];

export const DEFAULT_CATEGORY_FILTERS = {
  sortBy: 'relevance',
  priceMin: DEFAULT_PRICE_MIN,
  priceMax: DEFAULT_PRICE_MAX,
};

export const isDefaultCategoryFilters = (filters: {
  sortBy: string;
  priceMin: number;
  priceMax: number;
}) =>
  filters.sortBy === DEFAULT_CATEGORY_FILTERS.sortBy &&
  filters.priceMin === DEFAULT_CATEGORY_FILTERS.priceMin &&
  filters.priceMax === DEFAULT_CATEGORY_FILTERS.priceMax;

export const priceBandIdFor = (min: number, max: number) =>
  CATEGORY_PRICE_BANDS.find(band => band.min === min && band.max === max)?.id ??
  'any';

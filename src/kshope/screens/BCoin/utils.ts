const AMOUNT_FORMAT = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

export interface HistoryItem {
  historyId?: string | number;
  description?: string;
  transactionDate?: string;
  transactionType?: string;
  amount?: number;
  orderId?: string | number;
}

export interface HistorySection {
  key: string;
  title: string;
  sortValue: number;
  data: HistoryItem[];
}

export interface RateItem {
  id?: string | number;
  updatedOn: string;
  bCoinValue?: number;
  newValue?: number;
  value?: number;
  changeType?: 'up' | 'down';
}

export const toNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatAmount = (value: unknown) =>
  toNumber(value).toLocaleString('en-IN', AMOUNT_FORMAT);

export const formatCurrency = (value: unknown) => `₹${formatAmount(value)}`;

export const formatShortDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

export const formatTime = (date?: string) =>
  date
    ? new Date(date).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : '';

export const groupHistoryByMonth = (
  items?: HistoryItem[] | null,
): HistorySection[] => {
  if (!items || items.length === 0) return [];

  const groups = new Map<string, HistorySection>();

  items.forEach(item => {
    const date = item.transactionDate ? new Date(item.transactionDate) : null;
    const isValidDate = Boolean(date && !Number.isNaN(date.getTime()));
    const key =
      isValidDate && date
        ? `${date.getFullYear()}-${date.getMonth()}`
        : 'other';

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        title:
          isValidDate && date
            ? date
                .toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })
                .toUpperCase()
            : 'EARLIER',
        sortValue: isValidDate && date ? date.getTime() : 0,
        data: [],
      });
    }

    groups.get(key)!.data.push(item);
  });

  return [...groups.values()].sort((a, b) => b.sortValue - a.sortValue);
};

export const withRateTrend = (items: RateItem[]): RateItem[] => {
  const ascending = [...items].sort(
    (a, b) => new Date(a.updatedOn).getTime() - new Date(b.updatedOn).getTime(),
  );

  return ascending
    .map((item, index) => {
      const previous = index > 0 ? ascending[index - 1].bCoinValue : null;
      const isDown =
        previous != null &&
        item.bCoinValue != null &&
        item.bCoinValue < previous;
      return { ...item, changeType: (isDown ? 'down' : 'up') as 'up' | 'down' };
    })
    .reverse();
};

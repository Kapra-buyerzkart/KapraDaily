const AMOUNT_FORMAT = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

export const toNumber = value => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatAmount = value =>
  toNumber(value).toLocaleString('en-IN', AMOUNT_FORMAT);

export const formatCurrency = value => `₹${formatAmount(value)}`;

export const formatShortDate = date =>
  date
    ? new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

export const formatDayMonth = date =>
  date
    ? new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
      })
    : '';

export const formatTime = date =>
  date
    ? new Date(date).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : '';

// SectionList wants { title, data }; months stay newest-first so the most
// recent activity is the first thing in view.
export const groupHistoryByMonth = items => {
  if (!items || items.length === 0) return [];

  const groups = new Map();

  items.forEach(item => {
    const date = item.transactionDate ? new Date(item.transactionDate) : null;
    const isValidDate = date && !Number.isNaN(date.getTime());
    const key = isValidDate
      ? `${date.getFullYear()}-${date.getMonth()}`
      : 'other';

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        title: isValidDate
          ? date
              .toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              .toUpperCase()
          : 'EARLIER',
        sortValue: isValidDate ? date.getTime() : 0,
        data: [],
      });
    }

    groups.get(key).data.push(item);
  });

  return [...groups.values()].sort((a, b) => b.sortValue - a.sortValue);
};

// Each entry is flagged against the previous rate so the sheet can colour the
// row without the caller re-deriving direction.
export const withRateTrend = items => {
  const ascending = [...items].sort(
    (a, b) => new Date(a.updatedOn) - new Date(b.updatedOn),
  );

  return ascending
    .map((item, index) => {
      const previous = index > 0 ? ascending[index - 1].bCoinValue : null;
      const isDown = previous !== null && item.bCoinValue < previous;
      return { ...item, changeType: isDown ? 'down' : 'up' };
    })
    .reverse();
};

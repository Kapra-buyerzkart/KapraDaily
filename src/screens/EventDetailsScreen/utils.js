export const formatDate = value => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (value, fallback) => {
  if (fallback) return fallback;
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const formatPrice = value => {
  if (value === null || value === undefined || value === '') return '';
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);
  return `₹${amount.toLocaleString('en-IN')}`;
};

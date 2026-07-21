import CONFIG from '@/globals/config';

export const formatTicketDate = value => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const weekday = date
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase();
  return `${month} ${date.getDate()}, ${weekday}`;
};

export const resolveQr = path => {
  if (!path || typeof path !== 'string') return null;
  return /^https?:\/\//i.test(path) ? path : CONFIG.image_base_url + path;
};

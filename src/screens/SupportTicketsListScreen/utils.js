const DATE_FORMAT = { day: 'numeric', month: 'short', year: 'numeric' };

export const formatTicketDate = value => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', DATE_FORMAT);
};

export const normalizeTickets = response => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

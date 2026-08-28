export const isCartSuccess = (response: any): boolean =>
  !!(response && response.success === true);

const readMessage = (value: any): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const cartErrorMessage = (response: any, fallback: string): string =>
  readMessage(response) ??
  readMessage(response?.message) ??
  readMessage(response?.Message) ??
  readMessage(response?.data?.message) ??
  readMessage(response?.data?.Message) ??
  fallback;

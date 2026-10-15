import KSHOPE_CONFIG from '../../../../globals/config';

/**
 * Distinguishes network connectivity/timeout failures from legitimate empty responses,
 * authentication errors (401/403), validation errors (400/422), and server errors (5xx).
 */
export const isNetworkInterruption = (error: any): boolean => {
  if (!error) {
    return false;
  }

  // If HTTP status code is present from the server, the device reached the server.
  // It is NOT a network interruption (e.g., 400 validation, 401/403 auth, 404 not found, 500 server error).
  const status =
    error?.status ??
    error?.response?.status ??
    error?.statusCode ??
    error?.response?.statusCode;

  if (typeof status === 'number' && status > 0) {
    return false;
  }

  // Check error message or string representations
  const rawString =
    typeof error === 'string'
      ? error
      : typeof error?.message === 'string'
      ? error.message
      : '';

  const lowerStr = rawString.toLowerCase();

  // Known strings from createApiClient.js, axios, and native network layers
  if (
    lowerStr.includes('network error') ||
    lowerStr.includes('connected to internet') ||
    lowerStr.includes('server is not responding') ||
    lowerStr.includes('network request failed') ||
    lowerStr.includes('timed out') ||
    lowerStr.includes('timeout') ||
    lowerStr.includes('offline') ||
    lowerStr.includes('econnrefused') ||
    lowerStr.includes('enotfound')
  ) {
    return true;
  }

  // Check standard axios / network error codes
  const code = error?.code;
  if (
    code === 'ECONNABORTED' ||
    code === 'ERR_NETWORK' ||
    code === 'ETIMEDOUT' ||
    code === 'ENOTFOUND' ||
    code === 'ECONNREFUSED'
  ) {
    return true;
  }

  // Check axios error without a response
  if (error?.isAxiosError && !error?.response) {
    return true;
  }

  if (error?.name === 'AbortError') {
    return true;
  }

  return false;
};

/**
 * Lightweight probe to check if device currently has active internet connectivity.
 * Uses a HEAD request with a tight timeout to prevent blocking.
 */
export const checkInternetConnectivity = async (
  timeoutMs: number = 3500,
): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const probeUrl = `${KSHOPE_CONFIG.siteUrl.replace(/\/$/, '')}/?_=${Date.now()}`;
    const response = await fetch(probeUrl, {
      method: 'HEAD',
      signal: controller.signal,
      headers: { 'Cache-Control': 'no-cache' },
    });

    clearTimeout(timer);
    return typeof response?.status === 'number' && response.status > 0;
  } catch {
    return false;
  }
};

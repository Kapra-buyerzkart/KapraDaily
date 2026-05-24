export const ONE_SIGNAL_APP_ID = '266dbe6c-b4a8-458c-ba84-28f64cac2796';

export function isValidOneSignalAppId(appId: string): boolean {
  if (!appId) {
    return false;
  }

  if (appId.includes('YOUR_ONESIGNAL_APP_ID')) {
    return false;
  }

  return appId.length >= 8;
}

require('react-native-gesture-handler/jestSetup');

jest.mock('react-native-keyboard-controller', () =>
  require('react-native-keyboard-controller/jest'),
);

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-localize', () => ({
  getLocales: () => [
    { countryCode: 'IN', languageTag: 'en-IN', languageCode: 'en', isRTL: false },
  ],
  findBestLanguageTag: () => ({ languageTag: 'en', isRTL: false }),
  getNumberFormatSettings: () => ({ decimalSeparator: '.', groupingSeparator: ',' }),
  getCalendar: () => 'gregorian',
  getCountry: () => 'IN',
  getCurrencies: () => ['INR'],
  getTemperatureUnit: () => 'celsius',
  getTimeZone: () => 'Asia/Kolkata',
  uses24HourClock: () => true,
  usesMetricSystem: () => true,
  usesAutoDateAndTime: () => true,
  usesAutoTimeZone: () => true,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// The real service schedules a deferred diagnostic log, which keeps the Jest
// process alive after the run finishes. Push init is not what these tests cover.
jest.mock('./src/services/OneSignalService', () => ({
  getNotificationBadgeCount: jest.fn(() => Promise.resolve(0)),
  setNotificationBadgeCount: jest.fn(() => Promise.resolve(0)),
  incrementNotificationBadgeCount: jest.fn(() => Promise.resolve(0)),
  clearNotificationBadgeCount: jest.fn(() => Promise.resolve(0)),
  subscribeNotificationBadgeCount: jest.fn(() => jest.fn()),
  checkOneSignalStatus: jest.fn(() => Promise.resolve()),
  initOneSignal: jest.fn(),
  requestPushPermissionIfNeeded: jest.fn(() => Promise.resolve(true)),
  oneSignalLogin: jest.fn(),
  oneSignalLogout: jest.fn(),
}));

jest.mock('react-native-onesignal', () => ({
  OneSignal: {
    initialize: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    setConsentGiven: jest.fn(),
    setConsentRequired: jest.fn(),
    Debug: { setLogLevel: jest.fn(), setAlertLevel: jest.fn() },
    Notifications: {
      requestPermission: jest.fn(() => Promise.resolve(true)),
      hasPermission: jest.fn(() => true),
      permissionNative: jest.fn(() => Promise.resolve(1)),
      getPermissionAsync: jest.fn(() => Promise.resolve(true)),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      clearAll: jest.fn(),
    },
    InAppMessages: {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    User: {
      addTag: jest.fn(),
      addTags: jest.fn(),
      removeTag: jest.fn(),
      getOnesignalId: jest.fn(() => Promise.resolve('test-onesignal-id')),
      getExternalId: jest.fn(() => Promise.resolve(null)),
      pushSubscription: {
        getIdAsync: jest.fn(() => Promise.resolve('test-subscription-id')),
        getTokenAsync: jest.fn(() => Promise.resolve('test-token')),
        getOptedInAsync: jest.fn(() => Promise.resolve(true)),
        optIn: jest.fn(),
        optOut: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      },
    },
  },
  LogLevel: { None: 0, Fatal: 1, Error: 2, Warn: 3, Info: 4, Debug: 5, Verbose: 6 },
}));

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(() => Promise.resolve(true)),
  getGenericPassword: jest.fn(() => Promise.resolve(false)),
  resetGenericPassword: jest.fn(() => Promise.resolve(true)),
  ACCESSIBLE: { WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WhenUnlockedThisDeviceOnly' },
}));

jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock'),
);

jest.mock('react-native-device-info', () =>
  require('react-native-device-info/jest/react-native-device-info-mock'),
);

jest.mock('react-native-razorpay', () => ({
  open: jest.fn(() => Promise.resolve({ razorpay_payment_id: 'test' })),
}));

jest.mock('react-native-simple-toast', () => ({
  show: jest.fn(),
  showWithGravity: jest.fn(),
  SHORT: 0,
  LONG: 1,
  BOTTOM: 2,
}));

jest.mock('@microsoft/signalr', () => ({
  HubConnectionBuilder: jest.fn(() => ({
    withUrl: jest.fn().mockReturnThis(),
    withAutomaticReconnect: jest.fn().mockReturnThis(),
    build: jest.fn(() => ({
      start: jest.fn(() => Promise.resolve()),
      stop: jest.fn(() => Promise.resolve()),
      on: jest.fn(),
      off: jest.fn(),
    })),
  })),
  LogLevel: { Information: 2 },
}));

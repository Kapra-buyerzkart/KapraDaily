module.exports = {
  preset: 'react-native',
  // Worklets' .native entrypoints require a live JSI runtime; this resolver
  // strips the .native extension so Jest picks the plain JS implementation.
  resolver: 'react-native-worklets/jest/resolver.js',
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(?:@react-native|react-native|@react-navigation|react-native-.*|@gorhom|@microsoft/signalr|uuid)/)',
  ],
};

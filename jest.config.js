module.exports = {
  preset: 'react-native',
  // The preset only transpiles react-native itself; responsive-screen ships ESM
  // and is pulled in by the shared theme, so anything importing it fails to load.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-responsive-screen)/)',
  ],
};

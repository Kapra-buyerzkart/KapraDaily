module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Strip all console.* calls from production (release) bundles so stray logs
    // can never leak data to logcat / device console. `warn` and `error` are kept
    // for diagnostics — sensitive args routed through them are redacted by
    // src/utils/logger.js. Dev builds keep all logs (NODE_ENV !== 'production').
    ...(process.env.NODE_ENV === 'production'
      ? [['transform-remove-console', { exclude: ['error', 'warn'] }]]
      : []),
    // react-native-reanimated/plugin must remain LAST in the plugins list.
    'react-native-reanimated/plugin',
  ],
};

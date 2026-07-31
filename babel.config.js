module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Path aliasing: import from '@/...' instead of deep '../../../' relatives.
    // '@' maps to the project's src/ directory. Editor support lives in jsconfig.json.
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: { '@': './src' },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    ],
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
  env: {
    // Metro handles `import()` natively for lazy loading, but Jest's CJS runtime
    // rejects it without --experimental-vm-modules. App.tsx lazy-loads
    // OneSignalService this way, so tests need it lowered to a require.
    test: {
      plugins: ['@babel/plugin-transform-dynamic-import'],
    },
  },
};

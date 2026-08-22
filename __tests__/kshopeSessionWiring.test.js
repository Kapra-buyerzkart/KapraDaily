const fs = require('fs');
const path = require('path');

const read = p => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');

const AUTH_SUCCESS_SITES = [
  'src/screens/LoginPwdScreen.js',
  'src/screens/OtpScreen.js',
  'src/screens/RegistrationScreen.js',
];

test.each(AUTH_SUCCESS_SITES)('%s syncs the kshope session after storing host tokens', file => {
  const source = read(file);
  expect(source).toMatch(/import\s*{\s*syncKshopeSession\s*}\s*from\s*'\.\.\/kshope\/api\/session'/);
  expect(source).toMatch(/syncKshopeSession\(/);
});

test('logout clears the kshope session', () => {
  const source = read('src/context/appContext.js');
  expect(source).toMatch(/clearKshopeSession\(/);
});

test('every host setTokens call site also syncs kshope', () => {
  AUTH_SUCCESS_SITES.forEach(file => {
    const source = read(file);
    const setTokensCalls = (source.match(/await setTokens\(/g) || []).length;
    const syncCalls = (source.match(/syncKshopeSession\(/g) || []).length;
    expect(syncCalls).toBeGreaterThanOrEqual(setTokensCalls);
  });
});

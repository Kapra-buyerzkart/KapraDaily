const fs = require('fs');
const path = require('path');

const read = p => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const exists = p => fs.existsSync(path.join(__dirname, '..', p));

test('the placeholder KshopeScreen is gone', () => {
  expect(exists('src/screens/KshopeScreen.js')).toBe(false);
});

test('the module entry point exists', () => {
  expect(exists('src/kshope/index.ts')).toBe(true);
});

test('the root navigator renders the module on the KshopeScreen route', () => {
  const source = read('src/navigation/RootNavigator.js');
  expect(source).toMatch(/require\('\.\.\/kshope'\)/);
  expect(source).toMatch(/name="KshopeScreen"/);
  expect(source).not.toMatch(/require\('\.\.\/screens\/KshopeScreen'\)/);
});

test('the existing entry points still target the KshopeScreen route', () => {
  expect(read('src/config/services.js')).toMatch(/route: 'KshopeScreen'/);
  expect(read('src/screens/AuthSuccessScreen/useAuthSuccess.js')).toMatch(
    /navigate\('KshopeScreen'\)/,
  );
});

test('nothing outside the module imports from inside it except the mount point', () => {
  const offenders = [];
  const walk = dir => {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'kshope') walk(full);
        return;
      }
      if (!/\.(ts|tsx|js|jsx)$/.test(entry.name)) return;
      const source = fs.readFileSync(full, 'utf8');
      const matches = source.match(/from '[^']*kshope\/[^']+'/g) || [];
      matches
        .filter(m => !m.includes('kshope/api/session'))
        .forEach(m => offenders.push(`${full}: ${m}`));
    });
  };
  walk(path.join(__dirname, '..', 'src'));
  expect(offenders).toEqual([]);
});

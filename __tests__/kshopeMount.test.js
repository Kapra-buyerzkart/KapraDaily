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

const KSHOPE_DEEP_IMPORT_RE = /(?:from '|require\('|require\(")[^'"]*kshope\/[^'"]+['"]/g;

const findKshopeOffenders = source =>
  (source.match(KSHOPE_DEEP_IMPORT_RE) || []).filter(
    m => !m.includes('kshope/api/session'),
  );

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
      findKshopeOffenders(source).forEach(m => offenders.push(`${full}: ${m}`));
    });
  };
  walk(path.join(__dirname, '..', 'src'));
  expect(offenders).toEqual([]);
});

test('the offender matcher catches a CommonJS deep-require, not just ESM imports', () => {
  const esmDeepImport = `import KshopeRoot from '../kshope/navigation/KshopeRoot';`;
  const cjsDeepRequire = `const KshopeRoot = require('../kshope/navigation/KshopeRoot');`;
  const cjsBarrelRequire = `const KshopeScreen = lazyScreen(() => require('../kshope'));`;
  const cjsSessionRequire = `const { ensureKshopeSession } = require('../kshope/api/session');`;

  expect(findKshopeOffenders(esmDeepImport)).toHaveLength(1);
  expect(findKshopeOffenders(cjsDeepRequire)).toHaveLength(1);
  expect(findKshopeOffenders(cjsBarrelRequire)).toHaveLength(0);
  expect(findKshopeOffenders(cjsSessionRequire)).toHaveLength(0);
});

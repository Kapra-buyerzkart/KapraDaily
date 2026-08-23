const colours = require('../src/kshope/theme/colours');
const { Fonts } = require('../src/kshope/theme/fonts');

test('the kshope palette is the source app palette, not KapraDaily orange by accident', () => {
  const palette = colours.default || colours.colors || colours;
  expect(palette.themeTeal).toBe('#F25000');
  expect(palette.primary).toBe('#1A72DD');
});

test('font families name real files that ship with the app', () => {
  const gilroy = ['Gilroy-Regular', 'Gilroy-Medium', 'Gilroy-SemiBold', 'Gilroy-Bold', 'Gilroy-ExtraBold', 'Gilroy-Light'];
  gilroy.forEach(family => {
    expect(Object.values(Fonts)).toContain(family);
  });
});

test('theme files carry no ported comments', () => {
  const fs = require('fs');
  const path = require('path');
  ['colours.ts', 'fonts.ts', 'typography.ts'].forEach(file => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'src/kshope/theme', file), 'utf8');
    expect(src).not.toMatch(/^\s*\/\//m);
    expect(src).not.toMatch(/\/\*/);
  });
});

test('the param list has no leftover POS-template routes', () => {
  const fs = require('fs');
  const path = require('path');
  const src = fs.readFileSync(path.join(__dirname, '..', 'src/kshope/types/index.ts'), 'utf8');
  ['OwnerLogin', 'EmployeeLogin', 'ManageStore', 'OrderTaking', 'StoreItemsList'].forEach(dead => {
    expect(src).not.toContain(dead);
  });
});

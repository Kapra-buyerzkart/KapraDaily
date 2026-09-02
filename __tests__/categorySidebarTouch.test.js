const fs = require('fs');
const path = require('path');

const read = p => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');

const CATEGORIES = 'src/screens/CategoriesScreen.js';

test('the floating cart overlay spans the full width of the screen', () => {
  const source = read(CATEGORIES);
  expect(source).toMatch(
    /floatingContainer: \{\s*position: 'absolute',\s*bottom: [^\n]+\s*left: 0,\s*right: 0,/,
  );
});

test('the floating cart overlay does not swallow taps meant for the content behind it', () => {
  const source = read(CATEGORIES);
  const start = source.indexOf('<Animated.View');
  const overlayStart = source.indexOf('styles.floatingContainer');
  const overlay = source.slice(
    source.lastIndexOf('<Animated.View', overlayStart),
    source.indexOf('</Animated.View>', overlayStart),
  );

  expect(start).toBeGreaterThan(-1);
  expect(overlay).toContain('pointerEvents="box-none"');
});

const fs = require('fs');
const path = require('path');

const read = p => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');

const SCREEN = 'src/kshope/screens/AddLocation/AddLocationScreen.tsx';

test('the map is uncontrolled so region updates cannot feed back into it', () => {
  const source = read(SCREEN);
  const map = source.slice(source.indexOf('<MapView'), source.indexOf('</MapView>'));

  expect(map).toContain('initialRegion=');
  expect(map).not.toMatch(/\n\s*region=\{/);
});

test('region changes reported by the map are not written straight back to state', () => {
  const source = read(SCREEN);
  expect(source).not.toContain('onRegionChangeComplete={setRegion}');
});

test('camera moves are driven imperatively through a map ref', () => {
  const source = read(SCREEN);
  expect(source).toContain('animateToRegion');
});

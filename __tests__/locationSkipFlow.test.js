const fs = require('fs');
const path = require('path');

const read = p => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');

describe('Location Skip Flow Verification', () => {
  const SCREEN = 'src/screens/LocationFetchingNewScreen/LocationFetchingNewScreen.js';
  const TOP_BAR = 'src/screens/LocationFetchingNewScreen/components/organisms/LocationTopBar.js';
  const SHEET = 'src/screens/LocationFetchingNewScreen/components/organisms/AreaSelectionSheet.js';
  const HOOK = 'src/hooks/useLocationFetching.js';

  test('LocationFetchingNewScreen renders LocationTopBar when loading (!addressComponent)', () => {
    const source = read(SCREEN);
    const loadingBlock = source.slice(
      source.indexOf('if (!addressComponent)'),
      source.indexOf('return (', source.indexOf('if (!addressComponent)') + 20) + 300,
    );

    expect(loadingBlock).toContain('<LocationTopBar onSkip={onSkip}');
    expect(loadingBlock).toContain('<LocatingView />');
  });

  test('LocationTopBar has zIndex, elevation, and pointerEvents="box-none"', () => {
    const source = read(TOP_BAR);
    expect(source).toMatch(/import\s*\{[^}]*hitSlopTo[^}]*\}\s*from\s*['"]\.\.\/\.\.\/theme['"]/);
    expect(source).toContain('pointerEvents="box-none"');
    expect(source).toMatch(/zIndex:\s*100/);
    expect(source).toMatch(/elevation:\s*10/);
    expect(source).toContain('hitSlop={hitSlopTo(');
  });

  test('AreaSelectionSheet has hitSlop for touch responsiveness on Skip button', () => {
    const source = read(SHEET);
    expect(source).toContain('hitSlop={hitSlopTo(12)}');
  });

  test('useLocationFetching forces navigation and clears pending timeouts onSkip', () => {
    const source = read(HOOK);
    expect(source).toContain('pendingTimeoutsRef.current.forEach(clearTimeout)');
    expect(source).toContain('navigateAfterLocation(true)');
  });
});

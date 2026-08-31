const fs = require('fs');
const path = require('path');

const read = p => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');

const HOME = 'src/kshope/screens/Home/HomeScreen.tsx';
const HEADER = 'src/kshope/components/HomeHeader.tsx';

test('the header floats over the content instead of taking space in the flow', () => {
  const source = read(HOME);
  // An in-flow header would relayout the whole list every frame as it shrinks.
  expect(source).toMatch(/headerOverlay: \{\s*position: 'absolute'/);
  expect(source).toMatch(/<View style={styles\.headerOverlay}>/);
});

test('the overlay is painted after the scroll content so it stays on top', () => {
  const source = read(HOME);
  expect(source.indexOf('</Animated.ScrollView>')).toBeLessThan(
    source.indexOf('styles.headerOverlay'),
  );
});

test('the content is inset by the measured header height, not a magic number', () => {
  const source = read(HOME);
  expect(source).toMatch(/onHeightChange={setHeaderHeight}/);
  expect(source).toMatch(/paddingTop: headerHeight/);
  // Otherwise the refresh spinner spins behind the header.
  expect(source).toMatch(/progressViewOffset={headerHeight}/);
});

test('scroll offset reaches the header on the UI thread', () => {
  const source = read(HOME);
  expect(source).toMatch(/useAnimatedScrollHandler/);
  expect(source).toMatch(/scrollEventThrottle=\{16\}/);
  expect(source).toMatch(/scrollY={scrollY}/);
});

test('the search bar and tab strip sit outside both collapsing shells', () => {
  const source = read(HEADER);
  const pinnedStart = source.indexOf("onLayout={measureSection('pinned')}");
  const pinnedEnd = source.indexOf('styles.collapsible', pinnedStart);

  expect(pinnedStart).toBeGreaterThan(-1);
  const pinned = source.slice(pinnedStart, pinnedEnd);
  expect(pinned).toContain('styles.searchRow');
  expect(pinned).toContain('styles.tabsSection');
  expect(pinned).not.toContain('styles.titleRow');
  expect(pinned).not.toContain('styles.panel');
});

test('the collapsing shells clip their rows instead of squashing them', () => {
  expect(read(HEADER)).toMatch(/collapsible: \{\s*overflow: 'hidden'/);
});

test('the header still renders unchanged when no scrollY is supplied', () => {
  const source = read(HEADER);
  // Both animated styles are gated, so HomeHeader stays usable as a plain block.
  expect(source).toMatch(/const collapsible = !!scrollY;/);
  expect(source).toMatch(/collapsible && sizes\.title > 0 && titleStyle/);
  expect(source).toMatch(/collapsible && sizes\.panel > 0 && panelStyle/);
});

test('content stays hidden until the header inset is known', () => {
  const source = read(HOME);
  // Painting at paddingTop 0 for a frame flashes the content up under the header.
  expect(source).toMatch(
    /style={headerHeight \? styles\.scrollReady : styles\.scrollMeasuring}/,
  );
  expect(source).toMatch(/scrollMeasuring: \{\s*opacity: 0,/);
});

test('measured heights are frozen so the animation cannot ratchet them down', () => {
  const source = read(HEADER);
  // The shells animate the height of the very rows we measure; letting a
  // re-measure through shrinks the metrics a little on every scroll until the
  // header collapses for good.
  expect(source).toMatch(/setSizes\(prev => freezeSize\(prev, key, next\)\)/);
});

test('each measured row has a floor so the shell clips instead of squashing it', () => {
  const source = read(HEADER);
  expect(source).toMatch(/sizes\.title > 0 && \{ minHeight: sizes\.title \}/);
  expect(source).toMatch(/sizes\.panel > 0 && \{ minHeight: sizes\.panel \}/);
});

test('the search bar takes over the icon strip as the header goes sticky', () => {
  const source = read(HEADER);
  // The search bar is flex:1, so closing the icon shell is what widens it.
  expect(source).toMatch(
    /actionsShell: \{\s*flexDirection: 'row',\s*overflow: 'hidden'/,
  );
  expect(source).toMatch(/collapsible && sizes\.actions > 0 && actionsStyle/);
  expect(source).toMatch(/onLayout=\{measureActions\}/);
});

test('the icon strip is measured by width and frozen like the rows', () => {
  const source = read(HEADER);
  expect(source).toMatch(
    /e\.nativeEvent\.layout\.width[\s\S]{0,120}freezeSize\(prev, 'actions', next\)/,
  );
});

test('the icons keep their natural width so the shell clips instead of squashing them', () => {
  const source = read(HEADER);
  expect(source).toMatch(/sizes\.actions > 0 && \{ width: sizes\.actions \}/);
});

test('no debug instrumentation is left in the header', () => {
  expect(read(HEADER)).not.toMatch(/dbg|debugBadge|console\.log/);
});

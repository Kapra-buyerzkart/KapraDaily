import {
  COLLAPSE_FADE,
  collapseDistance,
  collapseHeader,
} from '../src/kshope/components/homeHeaderCollapse';

const METRICS = { titleHeight: 60, panelHeight: 100 };

describe('collapseDistance', () => {
  it('is the combined height of the two collapsing rows', () => {
    expect(collapseDistance(METRICS)).toBe(160);
  });

  it('is zero before either row has been measured', () => {
    expect(collapseDistance({ titleHeight: 0, panelHeight: 0 })).toBe(0);
  });
});

describe('collapseHeader', () => {
  it('leaves both rows at full height at rest', () => {
    const s = collapseHeader(0, METRICS);

    expect(s.titleHeight).toBe(60);
    expect(s.panelHeight).toBe(100);
    expect(s.titleOpacity).toBe(1);
    expect(s.panelOpacity).toBe(1);
  });

  it('collapses the title row first and leaves the panel untouched', () => {
    const s = collapseHeader(30, METRICS);

    expect(s.titleHeight).toBe(30);
    expect(s.panelHeight).toBe(100);
    expect(s.panelOpacity).toBe(1);
  });

  it('only starts on the panel once the title row is fully gone', () => {
    const s = collapseHeader(60 + 40, METRICS);

    expect(s.titleHeight).toBe(0);
    expect(s.panelHeight).toBe(60);
  });

  it('shrinks the header exactly as fast as the content scrolls', () => {
    // This 1:1 invariant is what keeps the content flush against the header
    // bottom the whole way down instead of opening a gap or double-scrolling.
    const full = collapseDistance(METRICS);

    [0, 15, 60, 60.0001, 99, 160].forEach(scrollY => {
      const s = collapseHeader(scrollY, METRICS);
      const shrunk = full - (s.titleHeight + s.panelHeight);
      expect(shrunk).toBeCloseTo(scrollY, 5);
    });
  });

  it('clamps past the end so over-scrolling cannot invert the header', () => {
    const s = collapseHeader(9999, METRICS);

    expect(s.titleHeight).toBe(0);
    expect(s.panelHeight).toBe(0);
    expect(s.titleOpacity).toBe(0);
    expect(s.panelOpacity).toBe(0);
  });

  it('clamps a pull-to-refresh overscroll instead of growing the header', () => {
    const s = collapseHeader(-120, METRICS);

    expect(s.titleHeight).toBe(60);
    expect(s.panelHeight).toBe(100);
    expect(s.titleOpacity).toBe(1);
  });

  it('fades each row out before its height finishes collapsing', () => {
    // Squashing legible text down to nothing looks broken; it should be gone
    // well before the row closes.
    const mid = collapseHeader(60 * COLLAPSE_FADE, METRICS);
    expect(mid.titleOpacity).toBeCloseTo(0, 5);
    expect(mid.titleHeight).toBeGreaterThan(0);

    expect(collapseHeader(30, METRICS).titleOpacity).toBeLessThan(1);
  });

  it('reports null heights for a row that has not been measured yet', () => {
    // Pinning an unmeasured row to height 0 would blank it on first paint.
    const s = collapseHeader(0, { titleHeight: 0, panelHeight: 0 });

    expect(s.titleHeight).toBeNull();
    expect(s.panelHeight).toBeNull();
    expect(s.titleOpacity).toBe(1);
    expect(s.panelOpacity).toBe(1);
  });

  it('still collapses a measured row when its neighbour is unmeasured', () => {
    const s = collapseHeader(30, { titleHeight: 60, panelHeight: 0 });

    expect(s.titleHeight).toBe(30);
    expect(s.panelHeight).toBeNull();
  });
});

describe('freezeSize', () => {
  const { freezeSize } = require('../src/kshope/components/homeHeaderCollapse');
  const prev = { title: 0, pinned: 0, panel: 0 };

  it('takes the first real measurement', () => {
    expect(freezeSize(prev, 'title', 52)).toEqual({
      title: 52,
      pinned: 0,
      panel: 0,
    });
  });

  it('ignores a later re-measure so the animation cannot feed back into it', () => {
    // The shell height is animated; if a squashed re-measure got through, the
    // metrics would drift toward zero and strand the row collapsed.
    const measured = { title: 52, pinned: 128, panel: 109 };

    expect(freezeSize(measured, 'title', 26)).toBe(measured);
    expect(freezeSize(measured, 'title', 0)).toBe(measured);
    expect(freezeSize(measured, 'panel', 0)).toBe(measured);
  });

  it('never records a zero, so a measured row can never un-measure', () => {
    expect(freezeSize(prev, 'title', 0)).toBe(prev);
  });

  it('returns the same object when nothing changes so React can bail out', () => {
    expect(freezeSize(prev, 'title', 0)).toBe(prev);
    const measured = { title: 52, pinned: 0, panel: 0 };
    expect(freezeSize(measured, 'title', 52)).toBe(measured);
  });
});

describe('collapseProgress', () => {
  const {
    collapseProgress,
  } = require('../src/kshope/components/homeHeaderCollapse');

  it('is zero at rest and one once both rows are gone', () => {
    expect(collapseProgress(0, METRICS)).toBe(0);
    expect(collapseProgress(160, METRICS)).toBe(1);
  });

  it('runs the whole collapse, not just the first row', () => {
    expect(collapseProgress(80, METRICS)).toBeCloseTo(0.5, 5);
  });

  it('clamps an overscroll in either direction', () => {
    expect(collapseProgress(-200, METRICS)).toBe(0);
    expect(collapseProgress(9999, METRICS)).toBe(1);
  });

  it('stays at zero before the rows are measured', () => {
    expect(collapseProgress(40, { titleHeight: 0, panelHeight: 0 })).toBe(0);
  });
});

describe('collapseActions', () => {
  const {
    collapseActions,
  } = require('../src/kshope/components/homeHeaderCollapse');
  const ICONS = 108;

  it('leaves the icons at full width at rest', () => {
    const s = collapseActions(0, METRICS, ICONS);

    expect(s.width).toBe(108);
    expect(s.opacity).toBe(1);
  });

  it('closes the icons completely once the header is sticky', () => {
    // Any leftover width here is a gap the search bar never gets back.
    const s = collapseActions(160, METRICS, ICONS);

    expect(s.width).toBe(0);
    expect(s.opacity).toBe(0);
  });

  it('gives the search bar back exactly what the icons give up', () => {
    [0, 40, 80, 160].forEach(scrollY => {
      const s = collapseActions(scrollY, METRICS, ICONS);
      const gained = ICONS - s.width;
      expect(gained).toBeCloseTo(ICONS * collapseProgressOf(scrollY), 5);
    });
  });

  it('fades the icons out before their width finishes closing', () => {
    const mid = collapseActions(160 * COLLAPSE_FADE, METRICS, ICONS);

    expect(mid.opacity).toBeCloseTo(0, 5);
    expect(mid.width).toBeGreaterThan(0);
  });

  it('clamps a pull-to-refresh overscroll instead of widening the icons', () => {
    const s = collapseActions(-120, METRICS, ICONS);

    expect(s.width).toBe(108);
    expect(s.opacity).toBe(1);
  });

  it('reports a null width until the icons have been measured', () => {
    // Pinning them to 0 would blank the icons on first paint.
    const s = collapseActions(0, METRICS, 0);

    expect(s.width).toBeNull();
    expect(s.opacity).toBe(1);
  });
});

function collapseProgressOf(scrollY) {
  return Math.min(1, Math.max(0, scrollY / 160));
}

import {
  TAB_GEOMETRY,
  buildTabPath,
} from '../src/kshope/components/homeHeaderTabPath';

const { height, flare, radius, stroke } = TAB_GEOMETRY;

// Pull every "L x y" / "A rx ry rot large sweep x y" endpoint out of a path.
const points = d =>
  d
    .split(/(?=[MLAZ])/)
    .map(seg => seg.trim())
    .filter(seg => /^[MLA]/.test(seg))
    .map(seg => seg.slice(1).trim().split(/\s+/).map(Number))
    .map(nums => ({ x: nums[nums.length - 2], y: nums[nums.length - 1] }));

describe('buildTabPath', () => {
  it('spans the tab plus a flare on each side, starting and ending on the baseline', () => {
    const { outline } = buildTabPath(120, 0);
    const pts = points(outline);
    const first = pts[0];
    const last = pts[pts.length - 1];

    // The notch sits at x=0 with the flare tails reaching out symmetrically.
    expect(first.x).toBeCloseTo(-flare * 2, 5);
    expect(last.x).toBeCloseTo(120 + flare * 2, 5);
    expect(first.y).toBeCloseTo(height - stroke / 2, 5);
    expect(last.y).toBeCloseTo(height - stroke / 2, 5);
  });

  it('offsets the whole shape by x so the notch can slide between tabs', () => {
    const at0 = points(buildTabPath(120, 0).outline);
    const at75 = points(buildTabPath(120, 75).outline);

    expect(at75).toHaveLength(at0.length);
    at0.forEach((p, i) => {
      expect(at75[i].x).toBeCloseTo(p.x + 75, 5);
      expect(at75[i].y).toBeCloseTo(p.y, 5);
    });
  });

  it('keeps the flat top a full radius in from each corner at the design width', () => {
    const pts = points(buildTabPath(120, 0).outline);
    const top = pts.filter(p => Math.abs(p.y - stroke / 2) < 1e-6);

    expect(top).toHaveLength(2);
    expect(top[0].x).toBeCloseTo(radius, 5);
    expect(top[1].x).toBeCloseTo(120 - radius, 5);
  });

  it('shrinks the corner radius instead of overshooting on a narrow tab', () => {
    // A 10pt tab cannot fit two full corners; the arcs must meet, not cross.
    const pts = points(buildTabPath(10, 0).outline);
    const top = pts.filter(p => Math.abs(p.y - stroke / 2) < 1e-6);

    expect(top[0].x).toBeLessThanOrEqual(top[1].x);
    expect(top[0].x).toBeCloseTo(5, 5);
  });

  it('closes the fill back along the baseline so the body is watertight', () => {
    const { outline, fill } = buildTabPath(120, 0);

    expect(fill.startsWith(outline)).toBe(true);
    expect(fill.trim().endsWith('Z')).toBe(true);
  });

  it('degrades to an empty path before the tab has been measured', () => {
    expect(buildTabPath(0, 0).outline).toBe('');
    expect(buildTabPath(0, 0).fill).toBe('');
  });
});

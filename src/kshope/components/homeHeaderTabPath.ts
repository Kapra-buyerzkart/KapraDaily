export const TAB_GEOMETRY = {
  height: 44,
  radius: 10,
  flare: 15,
  stroke: .8,
};

export interface TabPath {
  outline: string;
  fill: string;
}

export const buildTabPath = (width: number, x: number): TabPath => {
  'worklet';
  if (!width || width <= 0) return { outline: '', fill: '' };

  const { height, radius, flare, stroke } = TAB_GEOMETRY;
  const top = stroke / 2;
  const base = height - stroke / 2;
  const left = x;
  const right = x + width;

  const r = Math.min(radius, width / 2, base - top);
  const f = Math.min(flare, base - top - r);
  const reach = flare * 2;

  const outline =
    `M ${left - reach} ${base}` +
    ` L ${left - f} ${base}` +
    ` A ${f} ${f} 0 0 0 ${left} ${base - f}` +
    ` L ${left} ${top + r}` +
    ` A ${r} ${r} 0 0 1 ${left + r} ${top}` +
    ` L ${right - r} ${top}` +
    ` A ${r} ${r} 0 0 1 ${right} ${top + r}` +
    ` L ${right} ${base - f}` +
    ` A ${f} ${f} 0 0 0 ${right + f} ${base}` +
    ` L ${right + reach} ${base}`;

  const fill =
    outline +
    ` L ${right + reach} ${height}` +
    ` L ${left - reach} ${height}` +
    ' Z';

  return { outline, fill };
};

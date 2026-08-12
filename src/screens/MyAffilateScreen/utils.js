const ORDINALS = ['', '1st', '2nd', '3rd'];

export const formatBT = value => {
  const rounded = Math.round((value ?? 0) * 100) / 100;
  const [intPart, decPart] = rounded.toString().split('.');
  const withSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decPart ? `${withSep}.${decPart}` : withSep;
};

export const levelLabel = levelNumber => {
  if (levelNumber === 1) return 'Direct referrals';
  const ordinal = ORDINALS[levelNumber] ?? `${levelNumber}th`;
  return `${ordinal} level`;
};

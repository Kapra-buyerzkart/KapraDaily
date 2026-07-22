export const normalizeString = str => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/([tdfpghkz])h/g, '$1')
    .replace(/(.)\1+/g, '$1');
};

// Loose match between a saved address label and a GPS reverse-geocoded
// address. Falls back to Longest Common Substring to tolerate minor
// spelling variations between what a user typed and what Google returns.
export const isFuzzyMatch = (saved, gps) => {
  if (!saved || !gps) return false;
  const sNorm = normalizeString(saved);
  const gNorm = normalizeString(gps);

  if (sNorm.length < 3) return false;

  if (gNorm.includes(sNorm) || sNorm.includes(gNorm)) {
    return true;
  }

  let max = 0;
  const dp = Array(sNorm.length + 1)
    .fill(0)
    .map(() => Array(gNorm.length + 1).fill(0));
  for (let i = 1; i <= sNorm.length; i++) {
    for (let j = 1; j <= gNorm.length; j++) {
      if (sNorm[i - 1] === gNorm[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        if (dp[i][j] > max) max = dp[i][j];
      } else {
        dp[i][j] = 0;
      }
    }
  }

  return max >= Math.ceil(sNorm.length * 0.8);
};

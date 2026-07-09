// Returns a new array with the elements randomly reordered (Fisher-Yates).
// Does not mutate the input, so it is safe to call on query/select results
// that other renders still reference. Non-array input yields an empty array.
export const shuffle = list => {
  if (!Array.isArray(list)) return [];
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const cache = {
  getItem: () => undefined,
  setItem: () => {},
  removeItem: () => true,
  clear: () => true,
};

module.exports = {
  __esModule: true,
  default: { getColors: () => Promise.resolve(null), cache },
  getColors: () => Promise.resolve(null),
  cache,
};

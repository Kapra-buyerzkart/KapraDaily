const logger = {
  debug: (...args) => {
    if (__DEV__) {
      console.log(...args);
    }
  },
  log: (...args) => {
    if (__DEV__) {
      console.log(...args);
    }
  },
  info: (...args) => {
    if (__DEV__) {
      console.info(...args);
    }
  },
  warn: (...args) => {
    console.warn(...args);
  },
  error: (...args) => {
    console.error(...args);
  },
};

export default logger;

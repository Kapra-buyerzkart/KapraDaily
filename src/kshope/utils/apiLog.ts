const CHUNK = 3500;

const stringify = (payload: any) => {
  try {
    const text = JSON.stringify(payload, null, 2);
    return typeof text === 'string' ? text : String(payload);
  } catch {
    return String(payload);
  }
};

export const logApi = (tag: string, payload: any) => {
  if (!__DEV__) {
    return;
  }
  const text = stringify(payload);
  if (text.length <= CHUNK) {
    console.log(`[API] ${tag}`, text);
    return;
  }
  const parts = Math.ceil(text.length / CHUNK);
  for (let i = 0; i < parts; i += 1) {
    console.log(
      `[API] ${tag} (${i + 1}/${parts})`,
      text.slice(i * CHUNK, (i + 1) * CHUNK),
    );
  }
};

export const logApiBlocks = (tag: string, payload: any) => {
  if (!__DEV__ || !payload || typeof payload !== 'object') {
    return;
  }
  Object.entries(payload).forEach(([key, value]) => {
    const size = Array.isArray(value) ? `[${value.length}]` : '';
    logApi(`${tag} · ${key}${size}`, value);
  });
};

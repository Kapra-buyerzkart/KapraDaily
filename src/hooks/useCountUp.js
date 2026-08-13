import { useEffect, useRef, useState } from 'react';

const EASE_OUT = t => 1 - Math.pow(1 - t, 3);

export const useCountUp = (target, duration = 900) => {
  const [value, setValue] = useState(0);
  const frame = useRef(null);

  useEffect(() => {
    const to = Number(target) || 0;

    if (to === 0 || duration <= 0) {
      setValue(to);
      return undefined;
    }

    let start = null;
    const step = now => {
      if (start === null) start = now;
      const t = Math.min((now - start) / duration, 1);
      setValue(to * EASE_OUT(t));
      if (t < 1) frame.current = requestAnimationFrame(step);
    };

    frame.current = requestAnimationFrame(step);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [target, duration]);

  return value;
};

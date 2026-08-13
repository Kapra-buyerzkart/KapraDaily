import { useState, useCallback } from 'react';

const useStoreSwitcher = applyStatusBar => {
  const [visible, setVisible] = useState(false);

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => {
    setVisible(false);
    setTimeout(applyStatusBar, 350);
  }, [applyStatusBar]);

  return { visible, open, close };
};

export default useStoreSwitcher;

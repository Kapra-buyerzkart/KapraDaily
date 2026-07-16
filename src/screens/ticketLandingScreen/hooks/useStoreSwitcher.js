import { useState, useCallback } from 'react';

// Owns the service-switcher modal's visibility, re-applying the status bar
// style after it closes since the switcher can change it.
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

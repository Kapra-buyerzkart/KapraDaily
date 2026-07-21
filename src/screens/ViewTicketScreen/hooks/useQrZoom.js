import { useCallback, useState } from 'react';
import {
  Easing,
  runOnJS,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

// Drives the full-screen enlarged QR overlay: which ticket is zoomed, whether
// it is mounted, and the shared progress value the overlay animates against.
const useQrZoom = () => {
  const [zoomIndex, setZoomIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const progress = useSharedValue(0);

  const open = useCallback(
    index => {
      setZoomIndex(typeof index === 'number' ? index : 0);
      setVisible(true);
      progress.value = withTiming(1, {
        duration: 260,
        easing: Easing.out(Easing.cubic),
      });
    },
    [progress],
  );

  const close = useCallback(() => {
    progress.value = withTiming(
      0,
      { duration: 200, easing: Easing.in(Easing.cubic) },
      finished => {
        if (finished) runOnJS(setVisible)(false);
      },
    );
  }, [progress]);

  return { zoomIndex, visible, progress, open, close };
};

export default useQrZoom;

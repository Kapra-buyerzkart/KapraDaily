import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getCameraDevice,
  useCameraDevices,
  useCameraPermission,
} from 'react-native-vision-camera';
import logger from '../../../utils/logger';
import { TORCH_ERROR_CODES } from '../constants';

const useScannerCamera = () => {
  const devices = useCameraDevices();

  const device = useMemo(() => {
    const best = getCameraDevice(devices, 'back');
    if (best?.hasTorch) return best;
    return devices.find(d => d.position === 'back' && d.hasTorch) ?? best;
  }, [devices]);

  const { hasPermission, requestPermission } = useCameraPermission();
  const [permissionAsked, setPermissionAsked] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  useEffect(() => {
    if (hasPermission) return;
    requestPermission().finally(() => setPermissionAsked(true));
  }, [hasPermission, requestPermission]);

  const toggleTorch = useCallback(() => setTorchOn(prev => !prev), []);

  const clearCameraError = useCallback(() => setCameraError(null), []);

  const handleCameraError = useCallback(error => {
    logger.error(
      '[QRScannerScreen] camera error:',
      error?.code,
      error?.message,
    );
    if (TORCH_ERROR_CODES.includes(error?.code)) {
      setTorchOn(false);
      return;
    }
    setCameraError(error?.message || 'The camera stopped unexpectedly.');
  }, []);

  return {
    device,
    hasPermission,
    permissionAsked,
    torchOn,
    toggleTorch,
    cameraError,
    handleCameraError,
    clearCameraError,
  };
};

export default useScannerCamera;

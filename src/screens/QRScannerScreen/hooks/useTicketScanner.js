import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCodeScanner } from 'react-native-vision-camera';
import { useTicketValidation } from '../../../hooks/useTicketValidation';
import logger from '../../../utils/logger';
import { RESULT_STYLES, VALID_DISMISS_MS } from '../constants';
import { buildTicketInfo, notifyVerdict } from '../utils';

const useTicketScanner = () => {
  const [scannedValue, setScannedValue] = useState(null);
  const scanLockRef = useRef(false);
  const notifiedResultRef = useRef(null);

  const { validateTicket, validating, result, resetResult } =
    useTicketValidation();

  const handleCodeScanned = useCallback(
    codes => {
      const value = codes?.[0]?.value;
      if (!value || scanLockRef.current) return;
      scanLockRef.current = true;
      logger.log('[QRScannerScreen] decoded qr:', {
        type: codes[0]?.type,
        value,
        length: value.length,
        trimmedLength: value.trim().length,
      });
      setScannedValue(value);
      validateTicket(value);
    },
    [validateTicket],
  );

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: handleCodeScanned,
  });

  const scanAgain = useCallback(() => {
    resetResult();
    setScannedValue(null);
    scanLockRef.current = false;
  }, [resetResult]);

  const retryValidation = useCallback(() => {
    if (scannedValue) validateTicket(scannedValue);
  }, [scannedValue, validateTicket]);

  useEffect(() => {
    if (validating || !result || notifiedResultRef.current === result) return;
    notifiedResultRef.current = result;
    notifyVerdict(result.status);
  }, [result, validating]);

  useEffect(() => {
    if (validating || result?.status !== 'valid') return;
    const timer = setTimeout(scanAgain, VALID_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [result?.status, validating, scanAgain]);

  const resultStyle = RESULT_STYLES[result?.status] ?? RESULT_STYLES.error;
  const showVerdict = Boolean(result) && !validating;
  const ticketInfo = useMemo(
    () => buildTicketInfo(result?.ticket),
    [result?.ticket],
  );

  return {
    scannedValue,
    codeScanner,
    validating,
    result,
    resultStyle,
    showVerdict,
    ticketInfo,
    scanAgain,
    retryValidation,
  };
};

export default useTicketScanner;

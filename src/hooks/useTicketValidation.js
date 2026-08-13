import { useCallback, useContext, useState } from 'react';
import { validateEventTicketApi } from '../api/eventService';
import { AppContext } from '../context/appContext';
import logger from '../utils/logger';

export const useTicketValidation = () => {
  const { profile } = useContext(AppContext);
  const [validating, setValidating] = useState(false);
  const [result, setResult] = useState(null);

  const validateTicket = useCallback(
    async (qRCode, remarks = '') => {
      if (!qRCode) return null;

      setValidating(true);
      try {
        const checkedInBy = profile?.custId;

        const payload = {
          qRCode,
          checkedInBy: String(checkedInBy),
          deviceInfo: 'app',
          remarks,
        };
        logger.log('[useTicketValidation] validate payload:', {
          ...payload,
          qRCodeLength: String(qRCode).length,
          checkedInByResolved: checkedInBy != null,
        });

        const res = await validateEventTicketApi(payload);

        const valid = res?.success === true;
        const next = {
          status: valid ? 'valid' : 'invalid',
          message:
            res?.message ||
            (valid ? 'Ticket checked in.' : 'This ticket is not valid.'),
          ticket: res?.data ?? null,
        };
        setResult(next);
        return next;
      } catch (error) {
        const isStringError = typeof error === 'string';
        logger.error('[useTicketValidation] eventticket/validate failed:', {
          status: error?.status ?? error?.response?.status,
          message: isStringError ? error : error?.message,
          data: error?.data ?? error?.response?.data,
        });
        const next = {
          status: 'error',
          message:
            error?.message ||
            'Could not reach the server. Check the connection and try again.',
          ticket: null,
        };
        setResult(next);
        return next;
      } finally {
        setValidating(false);
      }
    },
    [profile?.custId],
  );

  const resetResult = useCallback(() => setResult(null), []);

  return { validateTicket, validating, result, resetResult };
};

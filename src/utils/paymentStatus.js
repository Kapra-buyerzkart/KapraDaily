/**
 * Payment / booking verification can settle asynchronously via backend
 * webhooks. When that happens, by the time the app calls the verify (or
 * confirm) endpoint the payment is already done, so the backend may respond
 * with `success: false` — or even a non-2xx error — carrying a message like:
 *
 *   - "Booking already processed."
 *   - "Payment already completed."
 *   - "Transaction already processed."
 *   - "Payment completed successfully."
 *   - "Payment confirmed successfully."
 *
 * Every one of these means the money was collected and the order/booking is
 * complete, so the UI must treat them as SUCCESS instead of showing a
 * pending/error state.
 */

const ALREADY_COMPLETED_PATTERNS = [
  /already\s+processed/i,
  /already\s+completed/i,
  /already\s+paid/i,
  /already\s+confirmed/i,
  /completed\s+successfully/i,
  /confirmed\s+successfully/i,
  /processed\s+successfully/i,
];

/**
 * Extracts a human-readable message from either an API response object
 * ({ message } / { Message }) or a thrown Error/string.
 * @param {Object|Error|string} source
 * @returns {string}
 */
const extractMessage = source => {
  if (!source) return '';
  if (typeof source === 'string') return source;
  return (
    source.message ||
    source.Message ||
    source?.data?.message ||
    source?.data?.Message ||
    source?.response?.data?.message ||
    source?.response?.data?.Message ||
    ''
  );
};

/**
 * Returns true when a verify/confirm response (or thrown error) indicates the
 * payment was actually completed — already processed / completed successfully —
 * and should therefore be treated as a success rather than a failure/pending.
 *
 * @param {Object|Error|string} source Verify response, thrown error, or message.
 * @returns {boolean}
 */
export const isPaymentAlreadyCompleted = source => {
  const message = extractMessage(source);
  if (!message) return false;
  return ALREADY_COMPLETED_PATTERNS.some(re => re.test(message));
};

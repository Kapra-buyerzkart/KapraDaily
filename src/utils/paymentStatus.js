const ALREADY_COMPLETED_PATTERNS = [
  /already\s+processed/i,
  /already\s+completed/i,
  /already\s+paid/i,
  /already\s+confirmed/i,
  /completed\s+successfully/i,
  /confirmed\s+successfully/i,
  /processed\s+successfully/i,
];

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

export const isPaymentAlreadyCompleted = source => {
  const message = extractMessage(source);
  if (!message) return false;
  return ALREADY_COMPLETED_PATTERNS.some(re => re.test(message));
};

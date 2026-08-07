import CONFIG from '../globals/config';

export const INVOICE_NOT_GENERATED_MESSAGE =
  "Invoice hasn't been generated yet. Please contact customer support.";

/**
 * The backend exposes a generated invoice as `.../order/{orderId}/invoice/{invoiceNo}`.
 * When the invoice hasn't been generated it stops at `.../invoice`, which 404s.
 */
const GENERATED_INVOICE_PATTERN = /(?:^|\/)invoice\/[^/?#]+/i;

export const isInvoiceGenerated = url => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  const path = url.trim().split('?')[0].split('#')[0].replace(/\/+$/, '');
  return GENERATED_INVOICE_PATTERN.test(path);
};

export const resolveInvoiceUrl = url => {
  if (!url || typeof url !== 'string') {
    return null;
  }
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }
  return trimmed.startsWith('http')
    ? trimmed
    : `${CONFIG.image_base_url}${trimmed}`;
};

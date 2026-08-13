import CONFIG from '../globals/config';

export const INVOICE_NOT_GENERATED_MESSAGE =
  "Invoice hasn't been generated yet. Please contact customer support.";

const GENERATED_INVOICE_PATTERN = /(?:^|\/)invoices?\/[^/?#]+/i;

export const isInvoiceGenerated = url => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  const path = url.trim().split('?')[0].split('#')[0].replace(/\/+$/, '');
  if (/\.pdf$/i.test(path)) {
    return true;
  }
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

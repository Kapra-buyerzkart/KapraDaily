import KSHOPE_CONFIG from '../globals/config';

export const INVOICE_NOT_GENERATED_MESSAGE =
  "Invoice hasn't been generated yet. Please contact customer support.";

const GENERATED_INVOICE_PATTERN = /(?:^|\/)invoices?\/[^/?#]+/i;

export const isInvoiceGenerated = (url?: string | null): boolean => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  const path = url.trim().split('?')[0].split('#')[0].replace(/\/+$/, '');
  if (/\.pdf$/i.test(path)) {
    return true;
  }
  return GENERATED_INVOICE_PATTERN.test(path);
};

export const resolveInvoiceUrl = (url?: string | null): string => {
  if (!url || typeof url !== 'string') {
    return '';
  }
  const trimmed = url.trim();
  if (!trimmed) {
    return '';
  }
  if (trimmed.startsWith('http')) {
    return trimmed;
  }
  return `${KSHOPE_CONFIG.image_base_url}/${trimmed}`.replace(
    /([^:]\/)\/+/g,
    '$1',
  );
};

export const buildInvoiceFileName = (
  invoiceNumber?: string | null,
  url?: string | null,
): string => {
  const fromNumber = (invoiceNumber || '').replace(/[^A-Za-z0-9-]+/g, '_');
  if (fromNumber) {
    return `${fromNumber.replace(/^_+|_+$/g, '')}.pdf`;
  }
  const fromUrl = (url || '').split('?')[0].split('/').pop();
  return fromUrl && fromUrl.toLowerCase().endsWith('.pdf')
    ? fromUrl
    : `invoice_${Date.now()}.pdf`;
};

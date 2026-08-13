export const HEADER_TOP_GAP = 16;

export const getHeaderPaddingTop = insets =>
  (insets?.top || 24) + HEADER_TOP_GAP;

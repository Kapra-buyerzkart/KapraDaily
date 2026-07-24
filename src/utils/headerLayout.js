// Shared vertical layout for stacked-screen headers (My Bookings, Ticket
// Landing, Booking Details, ...). Every one of these headers must place its
// title at the SAME distance from the top of the screen, otherwise the heading
// visibly jumps up/down as the user navigates between screens.
//
// The value is the safe-area top inset (status bar / notch) plus a fixed gap so
// there's consistent breathing room below the status bar. The `|| 24` fallback
// covers the rare case where insets aren't available yet (e.g. cold Android
// render) so the header never collapses under the status bar.
export const HEADER_TOP_GAP = 16;

export const getHeaderPaddingTop = insets =>
  (insets?.top || 24) + HEADER_TOP_GAP;

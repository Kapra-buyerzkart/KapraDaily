import { useMemo } from 'react';
import { formatTime } from '../../EventDetailsScreen/utils';
import { formatTicketDate, resolveQr, titleCaseWords } from '../utils';

// Each ticket in the booking-detail response references its category by id
// (`ticketCategoryId` / `bookingItemId`); the human-readable name ("Gold Chair",
// "Silver Chair", …) lives on the matching `bookingItems` entry. This builds the
// id -> name lookup so a ticket can resolve its own type.
const buildCategoryNames = bookingItems => {
  const map = new Map();
  (Array.isArray(bookingItems) ? bookingItems : []).forEach(item => {
    const name = item?.categoryName || item?.ticketCategoryName;
    if (!name) return;
    if (item?.ticketCategoryId != null)
      map.set(`c${item.ticketCategoryId}`, name);
    if (item?.bookingItemId != null) map.set(`b${item.bookingItemId}`, name);
  });
  return map;
};

// Prefers a name carried on the ticket itself, then falls back to the booking
// item it belongs to. Returns undefined when the backend gives us nothing, so
// the card hides the field instead of inventing a category.
const rawTicketType = (ticket, categoryNames) =>
  ticket?.ticketCategoryName ||
  ticket?.categoryName ||
  (typeof ticket?.ticketCategory === 'string'
    ? ticket.ticketCategory
    : ticket?.ticketCategory?.categoryName) ||
  (ticket?.ticketCategoryId != null
    ? categoryNames.get(`c${ticket.ticketCategoryId}`)
    : undefined) ||
  (ticket?.bookingItemId != null
    ? categoryNames.get(`b${ticket.bookingItemId}`)
    : undefined) ||
  // Single-category bookings: every ticket is that one category.
  (categoryNames.size === 1
    ? categoryNames.values().next().value
    : undefined) ||
  undefined;

// The backend stores these unevenly cased ("silver standing"), so title-case
// for display.
const resolveTicketType = (ticket, categoryNames) =>
  titleCaseWords(rawTicketType(ticket, categoryNames));

// The session carries both ends of the window, so the ticket shows the full
// range ("9:00 AM - 4:00 AM"). Falls back to whichever end the backend gave us
// when the other is missing.
const formatTimeRange = (start, end) =>
  [formatTime(start), formatTime(end)].filter(Boolean).join(' - ');

// Normalizes the raw booking/ticket route params into a uniform list of ticket
// view models. Returns an empty list when the backend passes no tickets.
const useTicketList = (booking, rawTickets, bookingItems) =>
  useMemo(() => {
    console.log(booking, 'booking====>');

    const shared = {
      eventTitle: booking?.eventName || booking?.sessionName,
      eventCategory: booking?.sessionName,
      location: booking?.eventVenue,
      date: formatTicketDate(booking?.startDateTime),
      time: formatTimeRange(booking?.startDateTime, booking?.endDateTime),
      // The booking-details screen hands over the source it already resolved.
      ticketImage: booking?.ticketImage,
    };

    const list = Array.isArray(rawTickets) ? rawTickets : [];
    const categoryNames = buildCategoryNames(bookingItems);

    return list.map((t, i) => ({
      ...shared,
      ticketType: resolveTicketType(t, categoryNames),
      seatNo: t.seatNumber || t.seatNo || t.seat || '-',
      ticketId:
        t.ticketNumber || t.ticketId || booking?.bookingNumber || `T${i + 1}`,
      qrCodeUri: resolveQr(t.qrImagePath),
      qrValue: t.ticketNumber || t.ticketId || null,
      id: String(t.ticketId ?? t.ticketNumber ?? i),
    }));
  }, [booking, rawTickets, bookingItems]);

export default useTicketList;

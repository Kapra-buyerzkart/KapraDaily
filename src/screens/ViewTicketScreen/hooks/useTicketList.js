import { useMemo } from 'react';
import { formatTime } from '../../EventDetailsScreen/utils';
import logger from '../../../utils/logger';
import { formatTicketDate, resolveQr, titleCaseWords } from '../utils';
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

// Describes what will actually end up inside the rendered QR, so a code that
// fails at the gate can be traced back to how it was produced. The card prefers
// the server-rendered image and only encodes a string itself when there is no
// `qrImagePath`, and those two paths fail for completely different reasons.
const describeQr = (raw, view) => {
  const serverImage = Boolean(view.qrCodeUri);
  const encoded = view.qrValue || view.ticketId;
  return {
    id: view.id,
    source: serverImage ? 'server-image' : 'local-encode',
    qrImagePath: raw?.qrImagePath ?? null,
    qrCodeUri: view.qrCodeUri,
    encodedValue: serverImage ? null : encoded,
    encodedLength: serverImage ? null : String(encoded).length,
    rawTicketNumber: raw?.ticketNumber ?? null,
    rawTicketId: raw?.ticketId ?? null,

    synthetic:
      !serverImage && raw?.ticketNumber == null && raw?.ticketId == null,
  };
};

// Normalizes the raw booking/ticket route params into a uniform list of ticket
// view models. Returns an empty list when the backend passes no tickets.
const useTicketList = (booking, rawTickets, bookingItems) =>
  useMemo(() => {
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

    const tickets = list.map((t, i) => ({
      ...shared,
      ticketType: resolveTicketType(t, categoryNames),
      seatNo: t.seatNumber || t.seatNo || t.seat || '-',
      ticketId:
        t.ticketNumber || t.ticketId || booking?.bookingNumber || `T${i + 1}`,
      qrCodeUri: resolveQr(t.qrImagePath),
      qrValue: t.ticketNumber || t.ticketId || null,
      id: String(t.ticketId ?? t.ticketNumber ?? i),
    }));

    logger.log(
      '[useTicketList] booking:',
      booking?.bookingNumber,
      'qr per ticket:',
      tickets.map((view, i) => describeQr(list[i], view)),
    );

    return tickets;
  }, [booking, rawTickets, bookingItems]);

export default useTicketList;

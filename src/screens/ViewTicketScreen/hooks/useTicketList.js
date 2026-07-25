import { useMemo } from 'react';
import { formatTime } from '../../EventDetailsScreen/utils';
import { formatTicketDate, resolveImageSource, resolveQr } from '../utils';

// Normalizes the raw booking/ticket route params into a uniform list of ticket
// view models. Returns an empty list when the backend passes no tickets.
const useTicketList = (booking, rawTickets) =>
  useMemo(() => {
    const shared = {
      eventTitle: booking?.eventName || booking?.sessionName,
      eventCategory: booking?.sessionName,
      location: booking?.eventVenue,
      date: formatTicketDate(booking?.startDateTime),
      time: formatTime(booking?.startDateTime),
      eventImage: resolveImageSource(booking?.thumbnailImage),
    };

    const list = Array.isArray(rawTickets) ? rawTickets : [];

    return list.map((t, i) => ({
      ...shared,
      ticketType:
        t.ticketCategoryName || t.ticketCategory || t.categoryName || 'General',
      seatNo: t.seatNumber || t.seatNo || t.seat || '-',
      ticketId:
        t.ticketNumber || t.ticketId || booking?.bookingNumber || `T${i + 1}`,
      qrCodeUri: resolveQr(t.qrImagePath),
      qrValue: t.ticketNumber || t.ticketId || null,
      id: String(t.ticketId ?? t.ticketNumber ?? i),
    }));
  }, [booking, rawTickets]);

export default useTicketList;

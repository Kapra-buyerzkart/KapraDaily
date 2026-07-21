import { useMemo } from 'react';
import { formatTime } from '../../EventDetailsScreen/utils';
import { formatTicketDate, resolveQr } from '../utils';

// Normalizes the raw booking/ticket route params into a uniform list of ticket
// view models. Falls back to a single placeholder ticket when none are passed.
const useTicketList = (booking, rawTickets) =>
  useMemo(() => {
    const shared = {
      eventTitle: booking?.eventName || booking?.sessionName,
      eventCategory: booking?.sessionName,
      location: booking?.eventVenue,
      date: formatTicketDate(booking?.startDateTime),
      time: formatTime(booking?.startDateTime),
    };

    const list = Array.isArray(rawTickets) ? rawTickets : [];
    if (list.length === 0) {
      return [
        {
          ...shared,
          ticketType: 'Gold Chair',
          seatNo: 'S4',
          ticketId: booking?.bookingNumber || 'SDFGDH2335BNN',
          id: 'dummy',
        },
      ];
    }

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

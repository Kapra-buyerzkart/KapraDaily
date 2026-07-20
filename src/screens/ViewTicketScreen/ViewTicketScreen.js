import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import CONFIG from '@/globals/config';
import TicketQRModal from '../ticketLandingScreen/components/TicketQRModal';
import { formatTime } from '../EventDetailsScreen/utils';

const formatTicketDate = value => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const weekday = date
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase();
  return `${month} ${date.getDate()}, ${weekday}`;
};

// The QR lives on the backend as a stored image; `qrImagePath` is a relative
// path, so resolve it to an absolute URL the same way the rest of the app does.
const resolveQr = path => {
  if (!path || typeof path !== 'string') return null;
  return /^https?:\/\//i.test(path) ? path : CONFIG.image_base_url + path;
};

/**
 * ViewTicketScreen
 *
 * Thin host for the full-screen TicketQRModal. It opens the modal as soon as
 * the screen mounts and pops itself off the stack once the modal is dismissed,
 * so the modal reads as its own route while all the visuals live in the
 * reanimated portal (see TicketQRModal / CustomModal).
 */
const ViewTicketScreen = ({ navigation, route }) => {
  const modalRef = useRef(null);
  const booking = route?.params?.booking ?? null;
  const rawTickets = route?.params?.tickets ?? null;

  useEffect(() => {
    modalRef.current?.open();
  }, []);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Booking-level fields are shared by every ticket; per-ticket fields (type,
  // seat, number, QR image) come from the tickets array. Falls back to a single
  // dummy ticket when the booking carries no tickets yet.
  const tickets = useMemo(() => {
    const shared = {
      eventTitle:
        booking?.eventName || booking?.sessionName || 'PAPON LIVE CONCERT',
      eventCategory: booking?.sessionName || 'Musical concert',
      location: 'Edappally , kochi ,kerala',
      date: formatTicketDate(booking?.startDateTime) || 'July 25, monday',
      time: formatTime(booking?.startDateTime) || '5:30 pm',
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
      ticketId: t.ticketNumber || t.ticketId || booking?.bookingNumber || `T${i + 1}`,
      qrCodeUri: resolveQr(t.qrImagePath),
      qrValue: t.ticketNumber || t.ticketId || null,
      id: String(t.ticketId ?? t.ticketNumber ?? i),
    }));
  }, [booking, rawTickets]);

  return (
    <View style={styles.container}>
      <TicketQRModal ref={modalRef} tickets={tickets} onClose={handleClose} />
    </View>
  );
};

const styles = StyleSheet.create({
  // Transparent so the previous screen stays visible until the modal's own
  // fade finishes; the modal itself paints above everything via the portal.
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default ViewTicketScreen;

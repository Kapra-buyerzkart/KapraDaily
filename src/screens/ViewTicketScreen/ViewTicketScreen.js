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
const resolveQr = path => {
  if (!path || typeof path !== 'string') return null;
  return /^https?:\/\//i.test(path) ? path : CONFIG.image_base_url + path;
};

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

  const tickets = useMemo(() => {
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

  return (
    <View style={styles.container}>
      <TicketQRModal ref={modalRef} tickets={tickets} onClose={handleClose} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default ViewTicketScreen;

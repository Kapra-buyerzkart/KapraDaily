import React, { useCallback } from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp } from '../../utils/responsive';
import styles from './styles';
import TicketHeader from './components/TicketHeader';
import TicketCarousel from './components/TicketCarousel';
import QrZoomOverlay from './components/QrZoomOverlay';
import useTicketList from './hooks/useTicketList';
import useTicketEntrance from './hooks/useTicketEntrance';
import useQrZoom from './hooks/useQrZoom';

const ViewTicketScreen = ({ navigation, route }) => {
  const booking = route?.params?.booking ?? null;
  const rawTickets = route?.params?.tickets ?? null;
  const bookingItems = route?.params?.bookingItems ?? null;

  console.log(
    'ViewTicketScreen backend tickets:',
    JSON.stringify(rawTickets, null, 2),
  );

  const insets = useSafeAreaInsets();

  const tickets = useTicketList(booking, rawTickets, bookingItems);
  const entranceStyle = useTicketEntrance();
  const qrZoom = useQrZoom();

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  const zoomTicket = tickets[qrZoom.zoomIndex] || tickets[0];

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + hp(2),
          paddingBottom: insets.bottom + hp(2),
        },
      ]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#000000"
        translucent
      />

      <TicketHeader onBack={goBack} />

      <TicketCarousel
        tickets={tickets}
        entranceStyle={entranceStyle}
        onQrPress={qrZoom?.open}
      />

      <TouchableOpacity
        style={styles.closeBtn}
        onPress={goBack}
        activeOpacity={0.85}
      >
        <Text style={styles.closeBtnText}>✕</Text>
      </TouchableOpacity>

      {qrZoom?.visible && (
        <QrZoomOverlay
          ticket={zoomTicket}
          progress={qrZoom?.progress}
          onClose={qrZoom?.close}
        />
      )}
    </View>
  );
};

export default ViewTicketScreen;

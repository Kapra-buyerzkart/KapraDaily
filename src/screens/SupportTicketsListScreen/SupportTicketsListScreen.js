import { View, StatusBar } from 'react-native';
import React from 'react';
import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSupportTickets } from './useSupportTickets';
import { styles } from './styles';
import { BORDER_FADE_RANGE } from './motion';
import TicketsTopBar from './components/organisms/TicketsTopBar';
import TicketList from './components/organisms/TicketList';

export default function SupportTicketsListScreen() {
  const {
    navigation,
    tickets,
    isLoading,
    isFirstLoad,
    refreshTickets,
    handleRaise,
    handleOpenTicket,
  } = useSupportTickets();

  const scrollY = useSharedValue(0);

  const topBarBorderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      BORDER_FADE_RANGE,
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const subtitle = tickets.length
    ? `${tickets.length} ${tickets.length === 1 ? 'ticket' : 'tickets'}`
    : null;

  return (
    <View style={styles.screen}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <TicketsTopBar
        title="Support tickets"
        subtitle={subtitle}
        onBack={() => navigation.goBack()}
        onAdd={handleRaise}
        borderStyle={topBarBorderStyle}
      />

      <TicketList
        tickets={tickets}
        isLoading={isLoading}
        isFirstLoad={isFirstLoad}
        onRefresh={refreshTickets}
        onRaise={handleRaise}
        onOpenTicket={handleOpenTicket}
        scrollY={scrollY}
      />
    </View>
  );
}

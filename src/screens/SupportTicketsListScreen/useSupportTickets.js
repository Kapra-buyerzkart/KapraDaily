import { useCallback, useRef, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getSupportTicketsApi } from '@/api/supportService';
import { normalizeTickets } from './utils';

export const useSupportTickets = () => {
  const navigation = useNavigation();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const inFlight = useRef(false);

  const fetchTickets = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setIsLoading(true);
    try {
      const response = await getSupportTicketsApi();
      setTickets(normalizeTickets(response));
    } catch (error) {
      console.error('Error fetching support tickets:', error);
    } finally {
      inFlight.current = false;
      setIsLoading(false);
      setHasLoadedOnce(true);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTickets();
    }, [fetchTickets]),
  );

  const handleRaise = useCallback(
    () => navigation.navigate('SupportTicketScreen'),
    [navigation],
  );

  const handleOpenTicket = useCallback(
    ticketId => navigation.navigate('TicketDetailsScreen', { ticketId }),
    [navigation],
  );

  return {
    navigation,
    tickets,
    isLoading,
    isFirstLoad: !hasLoadedOnce && tickets.length === 0,
    refreshTickets: fetchTickets,
    handleRaise,
    handleOpenTicket,
  };
};

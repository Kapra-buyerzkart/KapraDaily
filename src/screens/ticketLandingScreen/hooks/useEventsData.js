import { useState, useCallback } from 'react';
import { getEventDetailsListApi } from '../../../api/eventService';
import logger from '../../../utils/logger';

// Owns the Events tab's list fetching and card-press navigation.
const useEventsData = navigation => {
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  const fetchEventDetailsList = useCallback(() => {
    setEventsLoading(true);
    getEventDetailsListApi()
      .then(res => {
        const items = res?.data?.items || res?.data || [];
        setEvents(Array.isArray(items) ? items : []);
      })
      .catch(err => {
        logger.error('Failed to load event details list:', err?.message);
        setEvents([]);
      })
      .finally(() => setEventsLoading(false));
  }, []);

  const handleEventPress = useCallback(
    event => {
      const eventId = event?.eventId ?? event?.id;
      if (eventId === undefined || eventId === null) {
        return;
      }
      navigation.navigate('EventDetailsScreen', { event, eventId });
    },
    [navigation],
  );

  return {
    events,
    eventsLoading,
    fetchEventDetailsList,
    handleEventPress,
  };
};

export default useEventsData;

import { useState, useCallback, useEffect } from 'react';
import { getEventDetailsListApi, getPopularListApi } from '../../../api/eventService';
import logger from '../../../utils/logger';

// Joins each event with its own eventimages entry (banner type preferred,
// else the lowest displayOrder) so cards can resolve a real image without
// guessing at other fields — everything besides `image` is passed through
// from the API untouched.
const mapPopularEvents = data => {
  const rawEvents = Array.isArray(data?.events) ? data.events : [];
  const eventImages = Array.isArray(data?.eventimages) ? data.eventimages : [];

  return rawEvents.map(event => {
    const images = eventImages
      .filter(image => image?.eventId === event?.eventId)
      .sort((a, b) => (a?.displayOrder ?? 0) - (b?.displayOrder ?? 0));
    const bestImage =
      images.find(image => image?.imageType === 'banner') || images[0];

    return { ...event, image: bestImage?.imageUrl || null };
  });
};

// Owns the Events tab's list fetching and card-press navigation.
const useEventsData = navigation => {
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [popularEvents, setPopularEvents] = useState([]);
  const [popularEventsLoading, setPopularEventsLoading] = useState(true);

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

  useEffect(() => {
    setPopularEventsLoading(true);
    getPopularListApi()
      .then(res => {
        setPopularEvents(mapPopularEvents(res?.data));
      })
      .catch(err => {
        logger.error('Failed to load popular list:', err?.message);
        setPopularEvents([]);
      })
      .finally(() => setPopularEventsLoading(false));
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
    popularEvents,
    popularEventsLoading,
    fetchEventDetailsList,
    handleEventPress,
  };
};

export default useEventsData;

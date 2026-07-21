import { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getEventDetailsByIdApi } from '../../../api/eventService';
import logger from '../../../utils/logger';
import { formatDate, formatTime } from '../utils';

const deriveDetails = event => {
  const sessionStart =
    event?.SessionStart ||
    event?.sessionStart ||
    event?.eventDate ||
    event?.date ||
    event?.startDate;

  const sessions = Array.isArray(event?.sessions) ? event.sessions : [];
  const activeSession =
    sessions.find(session => session?.statusKey === 'active') ||
    sessions[0] ||
    null;
  const ticketCategoriesMap = event?.ticketCategories || {};
  const ticketCategories = activeSession
    ? ticketCategoriesMap[String(activeSession.sessionId)] || []
    : Object.values(ticketCategoriesMap)[0] || [];

  return {
    name: event?.eventName || event?.title || event?.name || 'Event',
    category: event?.categoryName || event?.category || '',
    organizer: event?.organizerName || event?.organizer || '',
    minPrice: event?.MinPrice ?? event?.minPrice ?? null,
    bannerImage: event?.bannerImage || event?.thumbnailImage || null,
    dateText: formatDate(sessionStart),
    timeText: formatTime(sessionStart, event?.time),
    venue:
      event?.venueName ||
      event?.venue ||
      event?.location ||
      event?.address ||
      '',
    city:
      [event?.city, event?.state].filter(Boolean).join(', ') ||
      event?.region ||
      '',
    ageLimit: event?.ageLimit || event?.age || null,
    language: event?.language || event?.languages || null,
    artists: Array.isArray(event?.artists)
      ? event.artists
      : Array.isArray(event?.cast)
      ? event.cast
      : [],
    detailsText: event?.details || event?.description || event?.about || '',
    terms: event?.termsAndConditions || event?.terms || event?.tnc || '',
    sessionId: activeSession?.sessionId ?? null,
    ticketCategories,
  };
};

export default function useEventDetails(route) {
  const initialEvent = route?.params?.event ?? null;
  const eventId =
    route?.params?.eventId ?? initialEvent?.eventId ?? initialEvent?.id ?? null;

  const [event, setEvent] = useState(initialEvent);
  const [loading, setLoading] = useState(!initialEvent);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setTranslucent(true);
        StatusBar.setBackgroundColor('transparent');
      }
    }, []),
  );

  const loadDetails = useCallback(() => {
    if (eventId === null || eventId === undefined) return Promise.resolve();
    return getEventDetailsByIdApi(eventId)
      .then(res => {
        const data = res?.data ?? res;
        if (data) {
          const { eventDetails, ...rest } = data;
          setEvent(prev => ({
            ...(prev || {}),
            ...rest,
            ...(eventDetails || {}),
          }));
        }
      })
      .catch(err =>
        logger.error('Failed to load event details:', err?.message),
      );
  }, [eventId]);

  useEffect(() => {
    if (eventId === null || eventId === undefined) return;
    setLoading(!initialEvent);
    loadDetails().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    loadDetails().finally(() => setRefreshing(false));
  }, [loadDetails]);

  const details = useMemo(() => deriveDetails(event), [event]);

  return useMemo(
    () => ({ event, loading, details, refreshing, refresh }),
    [event, loading, details, refreshing, refresh],
  );
}

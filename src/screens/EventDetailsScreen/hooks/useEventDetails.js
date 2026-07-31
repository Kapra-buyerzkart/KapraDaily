import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getEventDetailsByIdApi } from '../../../api/eventService';
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

  // "Starts from" price is the cheapest ticket category on the session.
  const categoryPrices = ticketCategories
    .map(category => Number(category?.totalAmount))
    .filter(Number.isFinite);

  return {
    name: event?.eventName || event?.title || event?.name || 'Event',
    category: event?.categoryName || event?.category || '',
    organizer: event?.organizerName || event?.organizer || '',
    minPrice: categoryPrices.length ? Math.min(...categoryPrices) : null,
    bannerImage: event?.ticketImage || event?.thumbnailImage || null,
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

const hasId = id => id !== null && id !== undefined;

// The payload is always stored next to the id it belongs to. Anything rendered
// from a mismatched pair would be the *previous* event's artwork and copy, so
// the two are only ever swapped together.
const stateForEvent = (id, seedEvent) => ({
  id,
  event: seedEvent ?? null,
  loading: hasId(id),
});

export default function useEventDetails(route) {
  const initialEvent = route?.params?.event ?? null;
  const eventId =
    route?.params?.eventId ?? initialEvent?.eventId ?? initialEvent?.id ?? null;

  const [state, setState] = useState(() =>
    stateForEvent(eventId, initialEvent),
  );
  const [refreshing, setRefreshing] = useState(false);
  const requestIdRef = useRef(0);

  const current =
    state.id === eventId ? state : stateForEvent(eventId, initialEvent);
  if (current !== state) {
    setState(current);
  }

  const { event, loading } = current;

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
    if (!hasId(eventId)) return Promise.resolve();
    const requestId = (requestIdRef.current += 1);

    return getEventDetailsByIdApi(eventId)
      .then(res => {
        // Another event was opened (or another refresh fired) while this call
        // was in flight. Dropping the answer stops a slow response for the
        // event the user already left from landing on top of the current one.
        if (requestIdRef.current !== requestId) return;

        const data = res?.data ?? res;
        if (!data) return;

        const { eventDetails, ...rest } = data;
        setState(prev =>
          prev.id === eventId
            ? {
                ...prev,
                event: {
                  ...(prev.event || {}),
                  ...rest,
                  ...(eventDetails || {}),
                },
              }
            : prev,
        );
      })
      .catch(err =>
        console.error('Failed to load event details:', err?.message),
      );
  }, [eventId]);

  useEffect(() => {
    if (!hasId(eventId)) return;
    loadDetails().finally(() =>
      setState(prev =>
        prev.id === eventId && prev.loading
          ? { ...prev, loading: false }
          : prev,
      ),
    );
  }, [eventId, loadDetails]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    loadDetails().finally(() => setRefreshing(false));
  }, [loadDetails]);

  const details = useMemo(() => deriveDetails(event), [event]);

  return useMemo(
    () => ({ event, eventId, loading, details, refreshing, refresh }),
    [event, eventId, loading, details, refreshing, refresh],
  );
}

import { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { getLandingPagesApi } from '../api/landingPageService';
import { getImageUrl } from '../utils/imageUrl';

const LANDING_PAGES_STALE_TIME = 6 * 60 * 60 * 1000;

// Module-level cache so the splash prefetch and the screens that mount later
// share one network call instead of each firing their own.
let cachedData;
let cachedAt = 0;
let inFlight = null;
const subscribers = new Set();

const isFresh = () => cachedData && Date.now() - cachedAt < LANDING_PAGES_STALE_TIME;

/**
 * Fetches landing pages, de-duping concurrent callers and reusing the cached
 * payload while it is still fresh.
 * @param {boolean} force skip the freshness check and refetch.
 * @returns {Promise<Object|undefined>} the `data` object off the response.
 */
export const fetchLandingPages = async (force = false) => {
  if (!force && isFresh()) return cachedData;
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const response = await getLandingPagesApi();
      cachedData = response?.success ? response.data : undefined;
      cachedAt = Date.now();
      subscribers.forEach(notify => notify(cachedData));
      return cachedData;
    } catch (error) {
      console.log('[landingPages] Error:', {
        message: error?.message,
        status: error?.status,
        data: error?.data,
      });
      throw error;
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
};

export const findLandingImage = (images, name) => {
  const names = Array.isArray(name) ? name : [name];
  return images?.find(
    path =>
      typeof path === 'string' &&
      names.some(candidate => path.endsWith(candidate)),
  );
};

export const prefetchLandingPageImages = images => {
  if (!Array.isArray(images)) return;
  images.forEach(path => {
    const source = path && getImageUrl(path);
    if (source?.uri) Image.prefetch(source.uri).catch(() => {});
  });
};

export const prefetchLandingPages = async () => {
  try {
    const data = await fetchLandingPages();
    prefetchLandingPageImages(data?.landingPageImages);
  } catch {}
};

const useLandingPages = () => {
  const [data, setData] = useState(cachedData);

  useEffect(() => {
    let active = true;
    const notify = next => {
      if (active) setData(next);
    };
    subscribers.add(notify);

    fetchLandingPages()
      .then(notify)
      .catch(() => {});

    return () => {
      active = false;
      subscribers.delete(notify);
    };
  }, []);

  return { data };
};

export default useLandingPages;

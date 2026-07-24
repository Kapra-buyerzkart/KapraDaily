import { useState, useCallback, useEffect } from 'react';
import {
  getEventDetailsListApi,
  getPopularListApi,
  getPopularCategoriesApi,
} from '../../../api/eventService';
import logger from '../../../utils/logger';
import CONFIG from '../../../globals/config';

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

// Main banners can point at either an event (has a start date) or a
// voucher (no start date) - flagged with `isEvent` so callers know how
// to route a press.
const mapBanners = data => {
  const rawBanners = Array.isArray(data?.banners) ? data.banners : [];

  return rawBanners.map(banner => ({
    voucherId: banner?.mainBannerId,
    title: banner?.mainBannerName,
    imageUrl: banner?.mainBannerImage,
    denomination: banner?.mainBannerPrice,
    eventStartDate: banner?.mainBannerEventStartDate,
    isEvent: banner?.mainBannerEventStartDate != null,
  }));
};

const mapPopularVouchers = data => {
  const rawVouchers = Array.isArray(data?.vouchers) ? data.vouchers : [];

  return rawVouchers.map(voucher => ({
    voucherId: voucher?.voucherId,
    title: voucher?.title,
    imageUrl: voucher?.imageUrl || voucher?.shortImageUrl,
    denomination: voucher?.denomination,
    redeemValidityDays: voucher?.redeemValidityDays,
    isActive: voucher?.isActive,
    expiryDate: voucher?.ExpiryDate,
  }));
};

const mapMoreToExplore = data => {
  const rawItems = Array.isArray(data?.moreToExplore) ? data.moreToExplore : [];

  return rawItems.map(item => ({
    catName: item?.catName,
    catImageUrl: item?.catImageUrl,
    isActive: item?.isActive,
  }));
};

// Prefer the highest-resolution icon; remote images aren't auto-@2x/@3x'd.
const CATEGORY_ICON_KEYS = ['iconImage3x', 'iconImage2x', 'iconImage1x'];

const buildCategoryIconUri = item => {
  const path =
    CATEGORY_ICON_KEYS.map(key => item?.[key]).find(Boolean) ??
    item?.catImageUrl ??
    item?.imageUrl;
  if (!path) return null;
  // The API returns server-relative asset paths; prefix the CDN base unless
  // it's already an absolute URL.
  return /^https?:\/\//.test(path) ? path : CONFIG.image_base_url + path;
};

const mapPopularCategories = data => {
  const rawItems = Array.isArray(data)
    ? data
    : Array.isArray(data?.categories)
    ? data.categories
    : Array.isArray(data?.data)
    ? data.data
    : [];

  return rawItems.map(item => ({
    catId: item?.catId ?? item?.categoryId ?? item?.id,
    catName: item?.catName ?? item?.categoryName ?? item?.name,
    iconUri: buildCategoryIconUri(item),
    isActive: Boolean(item?.isActive),
  }));
};

// Owns the Events tab's list fetching and card-press navigation.
const useEventsData = navigation => {
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [popularEvents, setPopularEvents] = useState([]);
  const [popularEventsLoading, setPopularEventsLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [popularVouchers, setPopularVouchers] = useState([]);
  const [moreToExplore, setMoreToExplore] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);
  const [popularCategoriesLoading, setPopularCategoriesLoading] =
    useState(true);

  const fetchEventDetailsList = useCallback(() => {
    setEventsLoading(true);
    return getEventDetailsListApi()
      .then(res => {
        console.log(res, 'eventdetails/list api response');
        const items = res?.data?.items || res?.data || [];
        setEvents(Array.isArray(items) ? items : []);
      })
      .catch(err => {
        logger.error('Failed to load event details list:', err?.message);
        setEvents([]);
      })
      .finally(() => setEventsLoading(false));
  }, []);

  const fetchPopularEvents = useCallback(() => {
    setPopularEventsLoading(true);
    return getPopularListApi()
      .then(res => {
        console.log(res, 'popular/list api response');
        setPopularEvents(mapPopularEvents(res?.data));
        setBanners(mapBanners(res?.data));
        setPopularVouchers(mapPopularVouchers(res?.data));
        setMoreToExplore(mapMoreToExplore(res?.data));
      })
      .catch(err => {
        logger.error('Failed to load popular list:', err?.message);
        setPopularEvents([]);
        setBanners([]);
        setPopularVouchers([]);
        setMoreToExplore([]);
      })
      .finally(() => setPopularEventsLoading(false));
  }, []);

  const fetchPopularCategories = useCallback(() => {
    setPopularCategoriesLoading(true);
    return getPopularCategoriesApi()
      .then(res => {
        console.log(res, 'popular/categories api response');
        setPopularCategories(mapPopularCategories(res?.data ?? res));
      })
      .catch(err => {
        logger.error('Failed to load popular categories:', err?.message);
        setPopularCategories([]);
      })
      .finally(() => setPopularCategoriesLoading(false));
  }, []);

  useEffect(() => {
    fetchPopularEvents();
    fetchPopularCategories();
  }, [fetchPopularEvents, fetchPopularCategories]);

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
    banners,
    bannersLoading: popularEventsLoading,
    popularVouchers,
    moreToExplore,
    popularCategories,
    popularCategoriesLoading,
    fetchEventDetailsList,
    fetchPopularEvents,
    fetchPopularCategories,
    handleEventPress,
  };
};

export default useEventsData;

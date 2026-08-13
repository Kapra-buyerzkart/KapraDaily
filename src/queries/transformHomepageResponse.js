import CONFIG from '../globals/config';

const SPECIFIC_PLACEMENT_KEYS = [
  'app_home_top_banner',
  'app_home_top_banner_top_section',
  'app_home_top_announcement_image',
  'app_home_mid_banner',
  'app_home_mid_banner_bottom',
  'app_home_bottom',
  'app_home_top_sidebyside_two',
  'app_home_first_productblock_title_image',
  'app_home_second_productblock_title_image',
  'app_home_third_productblock_title_image',
  'app_home_category_discovery_background_image',
  'app_home_bottom_showcase_banner_image',
  'app_home_bottom_showcase_product_image',
];

const placementKeyOf = (banner) => banner.placementKey || banner.PlacementKey;

const mapBanner = (banner) => ({
  ...banner,
  uri: { uri: `${CONFIG.image_base_url}${banner.imageUrl || banner.ImageUrl}` },
});

const sortByOrder = (a, b) => (a.displayOrder || a.DisplayOrder || 0) - (b.displayOrder || b.DisplayOrder || 0);

const getBannerSet = (banners, key) =>
  banners.filter((b) => placementKeyOf(b) === key).sort(sortByOrder).map(mapBanner);

const findBanner = (banners, key) => banners.find((b) => placementKeyOf(b) === key);

export const extractPopupFromResponse = (response) => {
  const pObj = response?.data?.popup || response?.popup || response?.details?.popup;
  if (pObj && (pObj.popupImageUrl || pObj.popupImage) && Number(pObj.showPopup) === 1) {
    return {
      ...pObj,
      uri: { uri: `${CONFIG.image_base_url}${pObj.popupImageUrl || pObj.popupImage}` },
      popupLink: pObj.popupLink || pObj.popup_link || pObj.Link || pObj.link,
    };
  }
  return null;
};

export const isIgnorableHomepageError = (error) => {
  const errorMsg = typeof error === 'string' ? error : (error?.message || error?.Message || '');
  const lower = errorMsg.toLowerCase();
  return (
    lower.includes('session expired') ||
    lower.includes('unauthorized') ||
    lower.includes('network error') ||
    lower.includes('something went wrong') ||
    error?.status === 401
  );
};

export const isClosedErrorMessage = (errorMsg) =>
  errorMsg.toLowerCase().includes('closed') || errorMsg.toLowerCase().includes('07:00');

export const deriveStoreUnavailableState = ({ homepageData, error, generalSettings }) => {
  if (homepageData?.storeStatus === 'CLOSED') {
    return {
      isStoreUnavailable: true,
      reason: 'closed',
      storeUnavailableData: {
        image: generalSettings?.closed?.image,
        text: homepageData.storeUnavailableMessage || 'Store is currently closed for delivery.',
      },
    };
  }
  if (homepageData?.storeStatus === 'NOT_FOUND') {
    return {
      isStoreUnavailable: true,
      reason: 'unserved',
      storeUnavailableData: generalSettings?.unavailable,
    };
  }
  if (error && !isIgnorableHomepageError(error)) {
    const errorMsg = typeof error === 'string' ? error : (error?.message || error?.Message || '');
    const isClosed = isClosedErrorMessage(errorMsg);
    return {
      isStoreUnavailable: true,
      reason: isClosed ? 'closed' : 'unserved',
      storeUnavailableData: isClosed
        ? { image: generalSettings?.closed?.image, text: errorMsg }
        : generalSettings?.unavailable,
    };
  }
  return { isStoreUnavailable: false, reason: null, storeUnavailableData: null };
};

export const transformHomepageResponse = (response) => {
  let storeStatus = 'OK';
  if (response?.status === 'STORE_NOT_FOUND' || response?.data?.status === 'STORE_NOT_FOUND') {
    storeStatus = 'NOT_FOUND';
  } else if (response?.status === 'STORE_CLOSED_FOR_DELIVERY' || response?.data?.status === 'STORE_CLOSED_FOR_DELIVERY') {
    storeStatus = 'CLOSED';
  } else if (response?.data?.banners && Array.isArray(response.data.banners)) {
    const errorBanner = response.data.banners.find((b) => b.status === 'STORE_NOT_FOUND');
    if (errorBanner) storeStatus = 'NOT_FOUND';
  }

  const popup = extractPopupFromResponse(response);

  if (storeStatus !== 'OK') {
    return {
      storeStatus,
      storeUnavailableMessage: response?.message || response?.data?.message || null,
      popup,
      banners: {},
      categories: [],
      bestOffers: [],
      featuredProducts: [],
      halfPriceStore: [],
      featuredProductsTitle: 'Featured Products',
      firstProductBlock: null,
      secondProductBlock: null,
      thirdProductBlock: null,
      categoryDiscovery: null,
    };
  }

  const data = response?.data || {};
  const allBanners = data.banners || data.Banners || [];

  const banners = {
    slider: allBanners
      .filter((b) => !SPECIFIC_PLACEMENT_KEYS.includes(placementKeyOf(b)))
      .sort(sortByOrder)
      .map(mapBanner),
    topBanner: getBannerSet(allBanners, 'app_home_top_banner'),
    midBanner: getBannerSet(allBanners, 'app_home_mid_banner'),
    midBannerBottom: getBannerSet(allBanners, 'app_home_mid_banner_bottom'),
    bottomBanner: getBannerSet(allBanners, 'app_home_bottom'),
    topSectionBanner: getBannerSet(allBanners, 'app_home_top_banner_top_section'),
    topAnnouncementBanner: getBannerSet(allBanners, 'app_home_top_announcement_image'),
    topSideBySide: getBannerSet(allBanners, 'app_home_top_sidebyside_two'),
    firstProductBlockTitleImage: (() => {
      const b = findBanner(allBanners, 'app_home_first_productblock_title_image');
      return b ? mapBanner(b) : null;
    })(),
    secondProductBlockTitleImage: (() => {
      const b = findBanner(allBanners, 'app_home_second_productblock_title_image');
      return b ? mapBanner(b) : null;
    })(),
    thirdProductBlockTitleImage: (() => {
      const b = findBanner(allBanners, 'app_home_third_productblock_title_image');
      return b ? mapBanner(b) : null;
    })(),
    categoryDiscoveryBackgroundImage: (() => {
      const b = findBanner(allBanners, 'app_home_category_discovery_background_image');
      return b ? mapBanner(b) : null;
    })(),
    bottomShowcaseBanner: (() => {
      const b = findBanner(allBanners, 'app_home_bottom_showcase_banner_image');
      return b ? mapBanner(b) : null;
    })(),
    bottomShowcaseProducts: getBannerSet(allBanners, 'app_home_bottom_showcase_product_image'),
  };

  return {
    storeStatus,
    storeUnavailableMessage: null,
    popup,
    homepageData: response,
    banners,
    categories: data.featuredCategories || data.FeaturedCategories || [],
    bestOffers: data.bestOffers || data.BestOffers || [],
    featuredProducts: data.featuredProducts || data.FeaturedProducts || [],
    halfPriceStore: data.halfPriceStore || data.HalfPriceStore || [],
    featuredProductsTitle: data.featuredProductsTitle || data.FeaturedProductsTitle || 'Featured Products',
    firstProductBlock: data.firstProductBlock || data.FirstProductBlock || null,
    secondProductBlock: data.secondProductBlock || data.SecondProductBlock || null,
    thirdProductBlock: data.thirdProductBlock || data.ThirdProductBlock || null,
    categoryDiscovery: data.categoryDiscovery || data.CategoryDiscovery || null,
  };
};

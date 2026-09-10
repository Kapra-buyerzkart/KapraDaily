import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { AppContext } from '@/context/appContext';
import useLandingPages, {
  findLandingImage,
  prefetchLandingPageImages,
} from '@/hooks/useLandingPages';
import { getImageUrl } from '@/utils/imageUrl';

import { LANDING_IMAGE_DIR, SERVICE_TILES } from './constants';

export const useAuthSuccess = () => {
  const navigation = useNavigation();
  const { generalSettings } = useContext(AppContext);
  const { data: landingPages } = useLandingPages();
  const [isComingSoonVisible, setIsComingSoonVisible] = useState(false);

  const landingPageImages = landingPages?.landingPageImages;

  const tiles = useMemo(
    () =>
      SERVICE_TILES.map(tile => {
        const names = Array.isArray(tile.image) ? tile.image : [tile.image];
        const path =
          findLandingImage(landingPageImages, tile.image) ||
          `${LANDING_IMAGE_DIR}${names[0]}`;
        return { ...tile, source: getImageUrl(path) };
      }),
    [landingPageImages],
  );

  useEffect(() => {
    prefetchLandingPageImages(landingPageImages);
  }, [landingPageImages]);

  // TEMP: backend gate disabled while the kshope module is being tested.
  // Restore the commented expression to gate on general/settings again.
  // const isKshopeEnabled =
  //   generalSettings?.showkshope === '1' || generalSettings?.showkshope === 1;
  const isKshopeEnabled = true;

  const actions = useMemo(
    () => ({
      kapra: () =>
        navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] }),
      tickets: () => navigation.navigate('TicketSplashScreen'),
      d2c: () => navigation.navigate('D2cScreen'),
      kshope: () =>
        isKshopeEnabled
          ? navigation.navigate('KshopeScreen')
          : setIsComingSoonVisible(true),
    }),
    [isKshopeEnabled, navigation],
  );

  const handleSelect = useCallback(id => actions[id]?.(), [actions]);

  const closeComingSoon = useCallback(() => setIsComingSoonVisible(false), []);

  return { tiles, handleSelect, isComingSoonVisible, closeComingSoon };
};

export default useAuthSuccess;

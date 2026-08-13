import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { AppContext } from '@/context/appContext';
import useLandingPages, {
  findLandingImage,
  prefetchLandingPageImages,
} from '@/hooks/useLandingPages';
import { getImageUrl } from '@/utils/imageUrl';

import { SERVICE_TILES } from './constants';

export const useAuthSuccess = () => {
  const navigation = useNavigation();
  const { generalSettings } = useContext(AppContext);
  const { data: landingPages } = useLandingPages();
  const [isComingSoonVisible, setIsComingSoonVisible] = useState(false);

  const landingPageImages = landingPages?.landingPageImages;

  const tiles = useMemo(
    () =>
      SERVICE_TILES.map(tile => {
        const path = findLandingImage(landingPageImages, tile.image);
        return { ...tile, source: path ? getImageUrl(path) : null };
      }),
    [landingPageImages],
  );

  useEffect(() => {
    prefetchLandingPageImages(landingPageImages);
  }, [landingPageImages]);

  const isKshopeEnabled =
    generalSettings?.showkshope === '1' || generalSettings?.showkshope === 1;

  const actions = useMemo(
    () => ({
      kapra: () =>
        navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] }),
      tickets: () => navigation.navigate('TicketSplashScreen'),
      d2c: () => navigation.navigate('D2cScreen'),
      kshope: () =>
        isKshopeEnabled
          ? navigation.navigate('Deals48')
          : setIsComingSoonVisible(true),
    }),
    [isKshopeEnabled, navigation],
  );

  const handleSelect = useCallback(id => actions[id]?.(), [actions]);

  const closeComingSoon = useCallback(() => setIsComingSoonVisible(false), []);

  return { tiles, handleSelect, isComingSoonVisible, closeComingSoon };
};

export default useAuthSuccess;

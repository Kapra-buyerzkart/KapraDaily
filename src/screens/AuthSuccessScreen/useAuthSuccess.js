import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { AppContext } from '@/context/appContext';
import useLandingPages, {
  findLandingImage,
  prefetchLandingPageImages,
} from '@/hooks/useLandingPages';
import { getImageUrl } from '@/utils/imageUrl';

export const useAuthSuccess = () => {
  const navigation = useNavigation();
  const { generalSettings } = useContext(AppContext);
  const { data: landingPages } = useLandingPages();
  const [isComingSoonVisible, setIsComingSoonVisible] = useState(false);

  const images = landingPages?.landingPageImages;

  const sources = useMemo(() => {
    const resolve = name => {
      const path = findLandingImage(images, name);
      return path ? getImageUrl(path) : null;
    };

    return {
      backdrop: resolve('landbg.png'),
      kapra: resolve(['assetsimagesapp20min3x.png', '20min.png']),
      kshope: resolve(['assetsimagesapp48hrs3x.png', '48hrs.png']),
      tickets: resolve(['assetsimagesappudentickets3x.png', 'udentickets.png']),
      d2c: resolve(['assetsimagesappd2c3x.png', 'd2cimg1.png', 'd2c.png']),
    };
  }, [images]);

  useEffect(() => {
    prefetchLandingPageImages(images);
  }, [images]);

  // TEMP: backend gate disabled while the kshope module is being tested.
  // Restore the commented expression to gate on general/settings again.
  // const isKshopeEnabled =
  //   generalSettings?.showkshope === '1' || generalSettings?.showkshope === 1;
  const isKshopeEnabled = true;

  const openKapra = useCallback(
    () => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] }),
    [navigation],
  );

  const openKshope = useCallback(() => {
    if (isKshopeEnabled) navigation.navigate('KshopeScreen');
    else setIsComingSoonVisible(true);
  }, [isKshopeEnabled, navigation]);

  const openTickets = useCallback(
    () => navigation.navigate('TicketSplashScreen'),
    [navigation],
  );

  const openD2c = useCallback(
    () => navigation.navigate('D2cScreen'),
    [navigation],
  );

  const closeComingSoon = useCallback(() => setIsComingSoonVisible(false), []);

  return {
    sources,
    openKapra,
    openKshope,
    openTickets,
    openD2c,
    isComingSoonVisible,
    closeComingSoon,
  };
};

export default useAuthSuccess;

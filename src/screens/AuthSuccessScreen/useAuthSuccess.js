import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import useLandingPages, {
  findLandingImage,
  prefetchLandingPageImages,
} from '@/hooks/useLandingPages';
import {
  checkLandingScreenWheelEntitlement,
  extractCampaignAndRewards,
} from '@/api/spinWheelService';
import { getImageUrl } from '@/utils/imageUrl';

import { LANDING_IMAGE_DIR, SERVICE_TILES } from './constants';

// Entitlement check and landing tiles hook
export const useAuthSuccess = ({ onEntitled } = {}) => {
  const navigation = useNavigation();
  const { data: landingPages } = useLandingPages();
  const [isComingSoonVisible, setIsComingSoonVisible] = useState(false);
  const [isCheckingWheel, setIsCheckingWheel] = useState(false);

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

  const handleSelect = useCallback(
    async id => {
      const normalFlow = actions[id];
      if (!normalFlow) return;

      if (isCheckingWheel) return;

      console.log(
        `[LandingScreen] Button pressed: "${id}" — checking wheel eligibility`,
      );
      setIsCheckingWheel(true);
      try {
        await checkLandingScreenWheelEntitlement({
          onEntitled: data => {
            const campaignInfo = extractCampaignAndRewards(data);
            if (
              !Array.isArray(campaignInfo?.rewards) ||
              campaignInfo.rewards.length < 3
            ) {
              console.log(
                `[LandingScreen] Backend rewards count (${campaignInfo?.rewards?.length || 0}) < 3; bypassing spin wheel flow.`,
              );
              setIsCheckingWheel(false);
              normalFlow();
              return;
            }

            console.log(
              `[LandingScreen] User is entitled to spin! Data:\n`,
              JSON.stringify(data, null, 2),
            );
            setIsCheckingWheel(false);
            if (typeof onEntitled === 'function') {
              onEntitled(data, normalFlow);
            } else {
              const firstItem = Array.isArray(data?.items) ? data.items[0] : null;
              navigation.navigate('SpinWheelRewardsScreen', {
                source: 'ONBOARDING',
                theme: 'welcome',
                campaignId: firstItem?.campaignId || data?.campaignId || 2,
                requestId: data?.requestId,
                anonymousId: null,
                visibilityData: data,
              });
            }
          },
          onNormalFlow: () => {
            console.log(`[LandingScreen] Proceeding to normal flow for "${id}"`);
            setIsCheckingWheel(false);
            normalFlow();
          },
        });
      } catch (err) {
        console.log(`[LandingScreen] Error checking wheel; falling back to normal flow for "${id}":`, err);
        setIsCheckingWheel(false);
        normalFlow();
      }
    },
    [actions, isCheckingWheel, onEntitled, navigation],
  );

  const closeComingSoon = useCallback(() => setIsComingSoonVisible(false), []);

  return {
    tiles,
    handleSelect,
    isComingSoonVisible,
    closeComingSoon,
    isCheckingWheel,
  };
};

export default useAuthSuccess;

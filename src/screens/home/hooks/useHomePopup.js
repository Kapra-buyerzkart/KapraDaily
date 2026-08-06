import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { postPopupSeenApi } from '../../../api/homeService';
import { openExternalUrl } from '../../../utils/safeUrl';
import logger from '../../../utils/logger';

const useHomePopup = (popupData) => {
  const navigation = useNavigation();
  const [isHomePopupVisible, setIsHomePopupVisible] = useState(false);
  const [lastShownPopupId, setLastShownPopupId] = useState(null);

  useEffect(() => {
    const canShow =
      popupData &&
      Number(popupData.showPopup) === 1 &&
      popupData?.uri?.uri &&
      lastShownPopupId !== popupData?.popupId;

    if (canShow) {
      setIsHomePopupVisible(true);
      setLastShownPopupId(popupData?.popupId);
    }
  }, [popupData, lastShownPopupId]);

  const markSeen = () => {
    if (popupData?.popupId) {
      postPopupSeenApi(popupData.popupId).catch(err =>
        logger.error('Popup seen API error:', err?.message),
      );
    }
  };

  const handleClose = () => {
    setIsHomePopupVisible(false);
    markSeen();
  };

  const handlePopupPress = () => {
    if (!popupData) return;
    markSeen();

    const numericProductId = Number(popupData.productId) || 0;
    if (numericProductId > 0) {
      navigation.navigate('ProductDetailsScreen', { productId: numericProductId });
      setIsHomePopupVisible(false);
      return;
    }

    const finalLink =
      popupData.popupLink ||
      popupData.popup_link ||
      popupData.Link ||
      popupData.link ||
      popupData.linkValue ||
      popupData.LinkValue;

    if (finalLink) {
      openExternalUrl(finalLink);
    }

    setIsHomePopupVisible(false);
  };

  return { isHomePopupVisible, handleClose, handlePopupPress };
};

export default useHomePopup;

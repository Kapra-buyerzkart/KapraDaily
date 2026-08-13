import { useQuery } from '@tanstack/react-query';
import { getGeneralSettingsApi } from '../api/userService';
import { homeKeys } from './queryKeys';

const selectStoreUnavailableData = (response) => {
  const items = response?.data?.items;
  if (!response?.success || !items) return null;

  const imageItem = items.find((i) => i.stName === 'store_not_available_image');
  const textItem = items.find((i) => i.stName === 'store_not_available_text');
  const closedImageItem = items.find((i) => i.stName === 'store_no_delivery_image');

  return {
    unavailable: {
      image: imageItem ? imageItem.stValue : null,
      text: textItem ? textItem.stValue : '',
    },
    closed: {
      image: closedImageItem ? closedImageItem.stValue : null,
      text: '',
    },
  };
};

const useGeneralSettingsQuery = () =>
  useQuery({
    queryKey: homeKeys.generalSettings(),
    queryFn: getGeneralSettingsApi,
    select: selectStoreUnavailableData,
    staleTime: 60 * 60 * 1000,
  });

export default useGeneralSettingsQuery;

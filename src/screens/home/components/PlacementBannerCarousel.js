import React from 'react';
import GenericBannerCarousel, {
  DEFAULT_DUMMY_BANNERS,
} from '@/components/GenericBannerCarousel';

const PlacementBannerCarousel = ({
  banners,
  onBannerPress,
  style,
  fullWidth,
  showDots = true,
  autoPlay = true,
  navigation,
  ...rest
}) => {
  return (
    <GenericBannerCarousel
      banners={banners && banners.length > 0 ? banners : DEFAULT_DUMMY_BANNERS}
      onBannerPress={onBannerPress}
      style={style}
      showPagination={showDots}
      autoPlay={autoPlay}
      navigation={navigation}
      {...rest}
    />
  );
};

export { DEFAULT_DUMMY_BANNERS };
export default React.memo(PlacementBannerCarousel);

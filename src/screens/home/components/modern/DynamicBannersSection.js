import React from 'react';
import { View, StyleSheet } from 'react-native';
import GenericBannerCarousel, {
  DEFAULT_DUMMY_BANNERS,
} from '@/components/GenericBannerCarousel';

const DynamicBannersSection = ({ onBannerPress, navigation }) => {
  return (
    <View style={styles.container}>
      <GenericBannerCarousel
        banners={DEFAULT_DUMMY_BANNERS}
        onBannerPress={onBannerPress}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default React.memo(DynamicBannersSection);

import React, { useCallback, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { HOME_COLORS, s } from './theme';
import { ProductTile, RecCard, Tile } from './content';
import HeroHeader from './sections/HeroHeader';
import FeaturedRow from './sections/FeaturedRow';
import ShopByCategory from './sections/ShopByCategory';
import BestSelling from './sections/BestSelling';
import {
  BestForYou,
  BrandsSpotlight,
  MoreDeals,
  TopDeals,
} from './sections/PromoSections';
import Recommended from './sections/Recommended';
import RecentlyViewed from './sections/RecentlyViewed';
import MoreToExplore from './sections/MoreToExplore';

const HomeStatusBar: React.FC = () => {
  const isFocused = useIsFocused();

  if (!isFocused) {
    return null;
  }

  return (
    <StatusBar
      translucent
      backgroundColor="transparent"
      barStyle="light-content"
    />
  );
};

const HomeRedesignScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [activeTab, setActiveTab] = useState('All');
  const [activeChip, setActiveChip] = useState('all');
  const [wishlisted, setWishlisted] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshing(false);
  }, []);

  const toggleWishlist = useCallback((item: ProductTile) => {
    setWishlisted(prev =>
      prev.includes(item.id)
        ? prev.filter(id => id !== item.id)
        : [...prev, item.id],
    );
  }, []);

  const openSearch = useCallback(() => {
    navigation.navigate('Search');
  }, [navigation]);

  const openProduct = useCallback(
    (item: ProductTile | RecCard) => {
      navigation.navigate('ProductDetails', { productId: item.id });
    },
    [navigation],
  );

  const openCategory = useCallback(
    (item: Tile) => {
      navigation.navigate('Category', { categoryId: item.id });
    },
    [navigation],
  );

  return (
    <View style={styles.root}>
      <HomeStatusBar />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + s(24) },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={HOME_COLORS.orange}
            colors={[HOME_COLORS.orange]}
          />
        }
      >
        <HeroHeader
          topInset={insets.top}
          activeTab={activeTab}
          onTabPress={setActiveTab}
          onSearchPress={openSearch}
        />

        <FeaturedRow
          wishlisted={wishlisted}
          onToggleWishlist={toggleWishlist}
          onPressProduct={openProduct}
        />

        <ShopByCategory
          activeChip={activeChip}
          onChipPress={setActiveChip}
          onCardPress={openCategory}
        />

        <BestSelling onPressTile={openCategory} />

        <BestForYou />

        <BrandsSpotlight />

        <TopDeals />

        <MoreDeals />

        <Recommended onPressCard={openProduct} />

        <RecentlyViewed />

        <MoreToExplore onPressTile={openCategory} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: HOME_COLORS.white,
  },
  content: {
    backgroundColor: HOME_COLORS.white,
  },
});

export default HomeRedesignScreen;

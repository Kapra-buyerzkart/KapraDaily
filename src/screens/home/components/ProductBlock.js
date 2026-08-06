import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ProductBlockShimmer from './ProductBlockShimmer';
import ProductRail from './ProductRail';
import SectionHeader from './SectionHeader';
import { SPACE, divider } from '@/styles/homeTheme';

const defaultShouldShowSeeAll = count => count > 3;
const DEFAULT_SEE_ALL_STYLE = { alignSelf: 'center' };

const ProductBlock = ({
  isLoading,
  shouldShow,
  title,
  titleExtraStyle,
  items,
  contentContainerStyle,
  shouldShowSeeAll = defaultShouldShowSeeAll,
  seeAllButtonStyle = DEFAULT_SEE_ALL_STYLE,
  trailingSpacer = false,
  navigation,
}) => {
  const handleViewAll = useCallback(
    () => navigation.navigate('SearchScreen', { title, products: items }),
    [navigation, title, items],
  );

  if (isLoading) return <ProductBlockShimmer />;
  if (!shouldShow) return null;

  return (
    <>
      <View style={styles.divider} />
      <View style={styles.surface}>
        <SectionHeader
          title={title}
          titleStyle={titleExtraStyle}
          onAction={shouldShowSeeAll(items.length) ? handleViewAll : undefined}
        />

        <ProductRail
          items={items}
          navigation={navigation}
          contentContainerStyle={contentContainerStyle}
        />
      </View>
      {trailingSpacer && <View style={styles.trailingSpacer} />}
    </>
  );
};

const styles = StyleSheet.create({
  surface: {
    paddingTop: SPACE.xs,
    paddingBottom: SPACE.sm,
  },
  divider,
  trailingSpacer: {
    height: hp('1%'),
  },
});

export default React.memo(ProductBlock);

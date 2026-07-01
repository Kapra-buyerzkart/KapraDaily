import React, { useCallback, useMemo, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FONTS } from '../../../styles/typography';
import { CART_SPACING, wp, hp } from '../../../styles/cartTheme';
import TokenProductCard from '../../../components/TokenProductCard';
import useHomepageDataQuery from '../../../queries/useHomepageDataQuery';
import useResolvedAreaId from '../../../queries/useResolvedAreaId';
import { AppContext } from '../../../context/appContext';

const RecommendationSection = ({ productId }) => {
  const navigation = useNavigation();
  const { profile } = useContext(AppContext);
  const { areaId } = useResolvedAreaId(profile?.pincode);
  const { data: homepageData } = useHomepageDataQuery(areaId);

  console.log(homepageData, 'what is the recommendations');
  const relatedProducts = useMemo(
    () =>
      (
        homepageData?.thirdProductBlock?.Items ||
        homepageData?.thirdProductBlock?.items ||
        []
      ).filter(item => String(item.productId || item.id) !== String(productId)),
    [homepageData, productId],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <TokenProductCard
        item={item}
        onPress={() =>
          navigation.navigate('ProductDetailsScreen', {
            productId: item.productId || item.id,
            product: item,
          })
        }
      />
    ),
    [navigation],
  );

  const keyExtractor = useCallback(
    (item, index) => String(item.productId || item.id || index),
    [],
  );

  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended to you</Text>
      <FlatList
        horizontal
        data={relatedProducts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews
        initialNumToRender={4}
      />
    </View>
  );
};

export default React.memo(RecommendationSection);

const styles = StyleSheet.create({
  container: {
    marginTop: hp('2.5%'),
  },
  title: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: wp('3.8%'),
    color: '#000000',
    paddingHorizontal: CART_SPACING.lg,
    marginBottom: hp('0.5%'),
  },
  listContent: {
    paddingHorizontal: CART_SPACING.md,
  },
});

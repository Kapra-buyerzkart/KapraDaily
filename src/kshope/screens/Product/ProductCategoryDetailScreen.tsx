import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../theme/colours';
import { searchProductsApi } from '../../api/services/productService';
import { getCategoryProducts } from '../../api/services/homeService';
import { LoaderContext } from '../../context/loaderContext';
import { styles } from './ProductCategoryDetailStyles';
import { AppIcons } from '../../assets/icons';
import { useWishlist } from '../../context/WishlistContext';
import ExploreItem from '../../components/ExploreItem';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getKshopeAreaId } from '../../globals/storage';

const ProductCategoryDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {
    catId,
    title,
    products: initialProducts,
  } = (route.params as any) || {};

  const [productsList, setProductsList] = useState<any[]>(
    initialProducts || [],
  );
  const [, setPincodeAreaId] = useState<number | null>(null);
  const { showLoader } = useContext(LoaderContext) || { showLoader: () => {} };
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const init = async () => {
      try {
        const pId = await getKshopeAreaId();
        setPincodeAreaId(pId);

        if ((!initialProducts || initialProducts.length === 0) && catId) {
          fetchProducts(catId, pId);
        }
      } catch (error) {
        console.error('Error in init:', error);
      }
    };
    init();
  }, [catId]);

  const fetchProducts = async (categoryId: string, pId: number | null) => {
    try {
      showLoader(true);
      let response = await getCategoryProducts(categoryId, pId);

      if (!response || !response.success || !response.data?.items?.length) {
        response = await searchProductsApi({
          catId: parseInt(categoryId),
          pincodeAreaId: pId,
          pageNumber: 1,
          pageSize: 50,
        });
      }

      if (
        response &&
        response.success &&
        response.data &&
        response.data.items
      ) {
        setProductsList(response.data.items);
      } else {
        setProductsList([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProductsList([]);
    } finally {
      showLoader(false);
    }
  };

  const renderProduct = ({ item }: { item: any }) => {
    return (
      <ExploreItem
        item={item}
        onPress={() =>
          navigation.navigate('KshopeProductDetails', {
            productId: item.productId,
            product: item,
          })
        }
        toggleWishlist={() => toggleWishlist(item)}
        isInWishlist={id => isInWishlist(id)}
        style={{
          width: wp('29%'),
          marginBottom: hp('1.5%'),
          contentContainer: { padding: 6 },
          image: { height: 80 },
          caption: { fontSize: 9, height: 28 },
          pricePill: {
            minWidth: 45,
            height: 20,
            borderRadius: 6,
            paddingHorizontal: 4,
          },
          pricePillText: { fontSize: 10 },
          originalPriceText: { fontSize: 7 },
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <AppIcons.ArrowBack size={28} color={colors.themeBlack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title || 'Products'}</Text>
      </View>
      <FlatList
        data={productsList}
        renderItem={renderProduct}
        keyExtractor={(item, index) =>
          (item.productId || item.id || index).toString()
        }
        numColumns={3}
        key={3}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={{ justifyContent: 'flex-start', gap: wp('0.1%') }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 100,
            }}
          >
            <Text style={{ fontFamily: 'Gilroy-Medium', color: '#999' }}>
              No products found
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default ProductCategoryDetailScreen;

import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../assets/theme/colours';
import { searchProductsApi } from '../../api/services/productService';
import { getCategoryProducts } from '../../api/services/homeService';
// The loader is host-owned UI chrome, not service-specific state, so this
// module shares it rather than standing up a second one.
import { LoaderContext } from '../../../../context/loaderContext';
import { getPincodeAreaId } from '../../globals/storage';
import CONFIG from '../../globals/config';
import { styles } from './styles';
import { AppIcons } from '../../assets/icons';
import { useWishlist } from '../../context/WishlistContext';
import ExploreItem from '../../components/ExploreItem/ExploreItem';
import { DEALS48_ROUTES } from '../../navigation/routes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ProductCategoryDetail = () => {
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
  const [pincodeAreaId, setPincodeAreaId] = useState<number | null>(null);
  const { showLoader } = useContext(LoaderContext) || { showLoader: () => {} };
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const init = async () => {
      try {
        const storedPincodeAreaId = await getPincodeAreaId();
        const pId = storedPincodeAreaId ? parseInt(storedPincodeAreaId) : null;
        setPincodeAreaId(pId);

        // If we don't have products passed in, and we have a category ID, fetch them
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

  const imageSource = (item: any) => {
    const img = item?.imageUrl || item?.featuredImage;
    if (!img) return require('../../assets/images/logos/noimage.png');
    if (typeof img === 'string') {
      if (img.startsWith('http')) return { uri: img };
      return {
        uri: `${CONFIG.image_base_url}/${img}`.replace(/([^:]\/)\/+/g, '$1'),
      };
    }
    return img;
  };

  const renderProduct = ({ item }: { item: any }) => {
    return (
      <ExploreItem
        item={item}
        onPress={() =>
          navigation.navigate(DEALS48_ROUTES.PRODUCT_DETAILS, {
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
          image: { height: 80 }, // Shorter image for 3 columns
          caption: { fontSize: 9, height: 28 }, // Slightly smaller font
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

export default ProductCategoryDetail;

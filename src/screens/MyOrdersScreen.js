import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
  BackHandler,
} from 'react-native';
import React, { useContext, useState, useCallback } from 'react';
import logger from '../utils/logger';
import { AppContext } from '../context/appContext';
import StoreUnavailable from '../components/StoreUnavailable';
import LocationModal from '../components/LocationModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@/assets/icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import {
  INK,
  ACCENT,
  SURFACE,
  HAIRLINE,
  RADIUS,
  SPACE,
  TYPE,
} from '@/styles/homeTheme';
import MyOrdersProductCard from '../components/MyOrdersProductCard';
import { getMyOrdersApi } from '../api/orderService';
import { LoaderContext } from '../context/loaderContext';

const MyOrdersScreen = () => {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { showLoader } = useContext(LoaderContext);
  const { isStoreUnavailable, storeUnavailableData, generalSettings } =
    useContext(AppContext);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

  const fetchOrders = async () => {
    try {
      showLoader(true);
      const response = await getMyOrdersApi();
      logger.log('My Orders Response:', response);
      // Assuming response structure: { success: true, data: { items: [...] } } or similar
      // User did not provide response example for list, but usually consistent.
      if (
        response &&
        response.success &&
        response.data &&
        response.data.items
      ) {
        setOrders(response.data.items);
      } else if (response && response.data && Array.isArray(response.data)) {
        setOrders(response.data);
      }
    } catch (error) {
      logger.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      showLoader(false);
    }
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchOrders();
    });
    return unsubscribe;
  }, [navigation]);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('HomeScreen');
        }
        return true; // Prevent default (closing the app)
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, [navigation]),
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('HomeScreen');
            }
          }}
        >
          <Image source={icons.backArrowNew} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.headerText}>My Orders</Text>
        {/* <Image
            style={styles.bearImage}
            source={require('../assets/images/bear2.png')}
          /> */}
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={orders}
          keyExtractor={(item, index) =>
            (item.id || item.orderId || index).toString()
          }
          renderItem={(item, index) => <MyOrdersProductCard item={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {generalSettings?.show_temporary_message === '1' && (
          <View style={styles.orderNoteContainer}>
            <Text style={styles.orderNoteText}>
              Orders placed from 1 April 2025 onward are available.
            </Text>
          </View>
        )}
      </View>
      <LocationModal
        visible={isLocationModalVisible}
        onClose={() => setIsLocationModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default MyOrdersScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: SURFACE.base,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: wp('4.65%'),
    justifyContent: 'space-between',
    paddingTop: hp('1.5%'),
    paddingBottom: hp('1.5%'),
    paddingRight: wp('7%'),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: HAIRLINE,
  },
  backIcon: {
    resizeMode: 'contain',
    tintColor: INK.strong,
  },
  headerText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.65%'),
    color: INK.strong,
    flex: 1,
    marginLeft: wp('3%'),
    letterSpacing: -0.3,
  },
  listContainer: {
    flex: 1,
    alignItems: 'center',
  },
  listContent: {
    paddingTop: SPACE.base,
    paddingBottom: hp('7%'),
    width: wp('100%'),
  },
  bearImage: {
    width: wp('21.86%'),
    height: hp('7.86%'),
    resizeMode: 'contain',
  },
  orderNoteContainer: {
    backgroundColor: SURFACE.tint,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.sm,
    borderRadius: RADIUS.sm,
    marginTop: SPACE.sm,
    marginBottom: SPACE.xs,
    marginHorizontal: wp('4.65%'),
    borderLeftWidth: 3,
    borderLeftColor: ACCENT.primary,
    alignSelf: 'stretch',
  },
  orderNoteText: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.medium,
    color: ACCENT.discount,
  },
});

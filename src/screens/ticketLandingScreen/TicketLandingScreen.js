import React, { useState, useRef, useEffect } from 'react';
import {
  Animated,
  StatusBar,
  View,
  ImageBackground,
} from 'react-native';
import Reanimated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './styles';
import ScreenHeader from './components/ScreenHeader';
import CoinBar from './components/CoinBar';
import TabBar from './components/TabBar';
import CardCarousel from './components/CardCarousel';
import VoucherGrid from './components/VoucherGrid';
import UdenTicketModal from './components/UdenTicketModal';
import VoucherBottomSheet from './components/VoucherBottomSheet';
import {
  getVouchersApi,
  getVoucherByIdApi,
  getVoucherQuoteApi,
  getMyVouchersApi,
} from '../../api/voucherService';
import { getDashboardDataApi } from '../../api/userService';

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

const TicketLandingScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [imageOpacity] = useState(() => new Animated.Value(0));
  const [activeTab, setActiveTab] = useState(0);
  const tabAnim = useRef(new Animated.Value(1)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [claimedVoucher, setClaimedVoucher] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [carouselVouchers, setCarouselVouchers] = useState([]);
  const [myVouchers, setMyVouchers] = useState([]);
  const [myVouchersLoading, setMyVouchersLoading] = useState(false);
  const [bCoins, setBCoins] = useState(0);
  const [claimedQuoteData, setClaimedQuoteData] = useState(null);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  useEffect(() => {
    getVouchersApi().then(res => {
      if (res?.data?.items) {
        setCarouselVouchers(res.data.items);
      }
    });
    getDashboardDataApi().then(res => {
      if (res?.data?.wallet?.bCoins !== undefined) {
        setBCoins(res.data.wallet.bCoins);
      }
    });
  }, []);

  useEffect(() => {
    if (activeTab === 1) {
      setMyVouchersLoading(true);
      getMyVouchersApi()
        .then(res => {
          console.log(res, 'ress======response=====>');
          if (res?.data?.items) {
            setMyVouchers(res.data.items);
          }
        })
        .finally(() => setMyVouchersLoading(false));
    }
  }, [activeTab]);

  const handleImageLoad = () => {
    Animated.timing(imageOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleClaim = voucher => {
    setClaimedQuoteData(null);
    Promise.all([
      getVoucherByIdApi(voucher?.voucherId),
      getVoucherQuoteApi(voucher?.voucherId, 1, bCoins),
    ]).then(([voucherRes, quoteRes]) => {
      if (voucherRes?.data) {
        setClaimedVoucher(voucherRes.data);
        if (quoteRes?.success) setClaimedQuoteData(quoteRes.data);
        setModalVisible(true);
      }
    });
  };

  const handleTabChange = index => {
    Animated.timing(tabAnim, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(index);
      Animated.spring(tabAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
    });
  };

  const tabContentStyle = {
    opacity: tabAnim,
    transform: [
      {
        translateY: tabAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <AnimatedImageBackground
        source={require('../../assets/images/movieTicket/ticketLandingBg.png')}
        style={[styles.imageBg, { opacity: imageOpacity }]}
        onLoad={handleImageLoad}
        resizeMode="cover"
      >
        <Reanimated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          stickyHeaderIndices={[2]}
        >
          <ScreenHeader navigation={navigation} insets={insets} scrollY={scrollY} />
          <CoinBar bCoins={bCoins} scrollY={scrollY} />
          <TabBar activeTab={activeTab} onTabChange={handleTabChange} scrollY={scrollY} insets={insets} />
          <Animated.View style={tabContentStyle}>
            {activeTab === 0 ? (
              <CardCarousel
                fadeAnim={fadeAnim}
                onClaim={handleClaim}
                vouchers={carouselVouchers}
              />
            ) : (
              <VoucherGrid
                vouchers={myVouchers}
                loading={myVouchersLoading}
                onVoucherPress={setSelectedVoucher}
              />
            )}
          </Animated.View>
        </Reanimated.ScrollView>
      </AnimatedImageBackground>

      <UdenTicketModal
        visible={modalVisible}
        voucher={claimedVoucher}
        bCoins={bCoins}
        initialQuoteData={claimedQuoteData}
        onClose={() => {
          setModalVisible(false);
          setClaimedQuoteData(null);
        }}
      />
      <VoucherBottomSheet
        visible={!!selectedVoucher}
        voucher={selectedVoucher}
        onClose={() => setSelectedVoucher(null)}
      />
    </View>
  );
};

export default TicketLandingScreen;

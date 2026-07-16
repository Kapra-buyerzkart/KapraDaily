import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import images from '@/assets/images';
import CoinBalance from '@/components/events/CoinBalance';
import { getMyVouchersApi } from '../../api/voucherService';
import { getDashboardDataApi } from '../../api/userService';
import logger from '../../utils/logger';
import VoucherGrid from '../ticketLandingScreen/components/VoucherGrid';
import VoucherBottomSheet from '../ticketLandingScreen/components/VoucherBottomSheet';

const BG_ASPECT_RATIO = 430 / 2078;

const MyBookingsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bCoins, setBCoins] = useState(0);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const pressTimeoutRef = useRef(null);
  useEffect(() => () => clearTimeout(pressTimeoutRef.current), []);

  useEffect(() => {
    setLoading(true);
    getMyVouchersApi()
      .then(res => {
        if (res?.data?.items) setVouchers(res.data.items);
      })
      .catch(err => logger.error('Failed to load my vouchers:', err?.message))
      .finally(() => setLoading(false));

    getDashboardDataApi()
      .then(res => {
        if (res?.data?.wallet?.bCoins !== undefined) {
          setBCoins(res.data.wallet.bCoins);
        }
      })
      .catch(err => logger.error('Failed to refresh bCoins:', err?.message));
  }, []);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const handleVoucherPress = useCallback(voucher => {
    clearTimeout(pressTimeoutRef.current);
    pressTimeoutRef.current = setTimeout(
      () => setSelectedVoucher(voucher),
      Platform.OS === 'ios' ? 400 : 250,
    );
  }, []);

  const handleCloseVoucherSheet = useCallback(
    () => setSelectedVoucher(null),
    [],
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Image
        source={images.bookingtabbg}
        style={styles.bgImage}
        resizeMode="cover"
      />

      <View style={[styles.header, { paddingTop: insets.top || 20 }]}>
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={16}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>My Bookings</Text>
        <CoinBalance bCoins={bCoins} />
      </View>

      <VoucherGrid
        vouchers={vouchers}
        loading={loading}
        onVoucherPress={handleVoucherPress}
        bottomInset={insets.bottom}
      />

      <VoucherBottomSheet
        visible={!!selectedVoucher}
        voucher={selectedVoucher}
        onClose={handleCloseVoucherSheet}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    aspectRatio: BG_ASPECT_RATIO,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Gilroy-Bold',
  },
});

export default React.memo(MyBookingsScreen);

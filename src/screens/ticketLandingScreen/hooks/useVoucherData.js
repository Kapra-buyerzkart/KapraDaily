import { useState, useCallback, useEffect } from 'react';
import { Image } from 'react-native';
import {
  getVouchersApi,
  getVoucherByIdApi,
  getVoucherQuoteApi,
  getMyVouchersApi,
} from '../../../api/voucherService';
import { getDashboardDataApi } from '../../../api/userService';
import logger from '../../../utils/logger';
import CONFIG from '../../../globals/config';

// Owns vouchers/gift-card/bookings data fetching plus the claim and
// voucher-detail modal flows that consume it.
const useVoucherData = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [claimedVoucher, setClaimedVoucher] = useState(null);
  const [carouselVouchers, setCarouselVouchers] = useState([]);
  const [carouselLoading, setCarouselLoading] = useState(true);
  const [myVouchers, setMyVouchers] = useState([]);
  const [myVouchersLoading, setMyVouchersLoading] = useState(false);
  const [bCoins, setBCoins] = useState(0);
  const [claimedQuoteData, setClaimedQuoteData] = useState(null);
  const [giftQuote, setGiftQuote] = useState(null);
  const [giftQuoteLoading, setGiftQuoteLoading] = useState(false);

  const refreshBCoins = useCallback(() => {
    return getDashboardDataApi()
      .then(res => {
        if (res?.data?.wallet?.bCoins !== undefined) {
          setBCoins(res.data.wallet.bCoins);
        }
      })
      .catch(err => logger.error('Failed to refresh bCoins:', err?.message));
  }, []);

  const fetchCarouselVouchers = useCallback(() => {
    setCarouselLoading(true);
    return getVouchersApi()
      .then(res => {
        if (res?.data?.items) {
          setCarouselVouchers(res.data.items);
        }
      })
      .catch(err => logger.error('Failed to load vouchers:', err?.message))
      .finally(() => setCarouselLoading(false));
  }, []);

  const fetchMyVouchers = useCallback(() => {
    setMyVouchersLoading(true);
    return getMyVouchersApi()
      .then(res => {
        if (res?.data?.items) {
          setMyVouchers(res.data.items);
        }
      })
      .catch(err => logger.error('Failed to load my vouchers:', err?.message))
      .finally(() => setMyVouchersLoading(false));
  }, []);

  const refresh = useCallback(
    () =>
      Promise.all([
        fetchCarouselVouchers(),
        fetchMyVouchers(),
        refreshBCoins(),
      ]),
    [fetchCarouselVouchers, fetchMyVouchers, refreshBCoins],
  );

  useEffect(() => {
    fetchCarouselVouchers();
    refreshBCoins();
  }, [fetchCarouselVouchers, refreshBCoins]);

  useEffect(() => {
    fetchMyVouchers();
  }, [fetchMyVouchers]);

  useEffect(() => {
    const uris = [...carouselVouchers, ...myVouchers]
      .map(item => item?.imageUrl || item?.image)
      .filter(value => typeof value === 'string' && value.length > 0)
      .map(value =>
        value.startsWith('http') ? value : CONFIG.image_base_url + value,
      );

    uris.forEach(uri => Image.prefetch(uri));
  }, [carouselVouchers, myVouchers]);

  useEffect(() => {
    const featured = carouselVouchers?.[0];
    if (!featured?.voucherId) {
      setGiftQuote(null);
      return undefined;
    }
    let cancelled = false;
    setGiftQuoteLoading(true);
    getVoucherQuoteApi(featured.voucherId, 1, bCoins)
      .then(res => {
        if (!cancelled && res?.success) setGiftQuote(res.data);
      })
      .catch(err =>
        logger.error('Failed to load gift card quote:', err?.message),
      )
      .finally(() => {
        if (!cancelled) setGiftQuoteLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [carouselVouchers, bCoins]);

  const handleClaim = useCallback(
    voucher => {
      setClaimedQuoteData(null);
      Promise.all([
        getVoucherByIdApi(voucher?.voucherId),
        getVoucherQuoteApi(voucher?.voucherId, 1, bCoins),
      ])
        .then(([voucherRes, quoteRes]) => {
          if (voucherRes?.data) {
            setClaimedVoucher(voucherRes.data);
            if (quoteRes?.success) setClaimedQuoteData(quoteRes.data);
            setModalVisible(true);
          }
        })
        .catch(err => logger.error('Failed to claim voucher:', err?.message));
    },
    [bCoins],
  );

  const handleCloseUdenModal = useCallback(() => {
    setModalVisible(false);
    setClaimedQuoteData(null);
  }, []);

  return {
    modalVisible,
    claimedVoucher,
    claimedQuoteData,
    carouselVouchers,
    carouselLoading,
    myVouchers,
    myVouchersLoading,
    bCoins,
    giftQuote,
    giftQuoteLoading,
    refreshBCoins,
    refresh,
    handleClaim,
    handleCloseUdenModal,
  };
};

export default useVoucherData;

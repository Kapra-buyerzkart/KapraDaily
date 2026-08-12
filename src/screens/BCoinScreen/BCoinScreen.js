import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppContext } from '@/context/appContext';
import StatusModal from '@/components/StatusModal';
import {
  getBCoinValueChangesApi,
  getWalletDataApi,
  redeemBCoinsApi,
} from '@/api/userService';

import { RateCard, TokenStrip, WalletSegments } from './molecules';
import {
  BCoinHero,
  FOOTER_HEIGHT,
  HistoryList,
  InfoSheet,
  RateHistorySheet,
  RedeemFooter,
  RedeemSheet,
} from './organisms';
import { PALETTE } from './theme';
import { groupHistoryByMonth, toNumber, withRateTrend } from './utils';

// The status modal is handed off from a closing sheet, so it waits for the
// sheet's exit animation before taking the screen.
const SHEET_HANDOFF_DELAY = 500;

const BCoinScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { profile, generalSettings } = useContext(AppContext);

  const [selected, setSelected] = useState('bcoin');
  const [walletData, setWalletData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [showRateSheet, setShowRateSheet] = useState(false);
  const [showInfoSheet, setShowInfoSheet] = useState(false);
  const [showRedeemSheet, setShowRedeemSheet] = useState(false);

  const [rateHistory, setRateHistory] = useState([]);
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  const [requestedCoins, setRequestedCoins] = useState('');
  const [preferredMethod, setPreferredMethod] = useState('bank');
  const [isRedeeming, setIsRedeeming] = useState(false);

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [statusType, setStatusType] = useState('success');
  const [statusTitle, setStatusTitle] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const isMounted = useRef(true);

  const balance = toNumber(walletData?.wallet?.bCoins);
  const coinValue = toNumber(walletData?.wallet?.bCoinValue);
  const tokens = walletData?.wallet?.bTokens ?? '0';
  const minCoinsToRedeem = Number(generalSettings?.min_coins_to_redeem_cash);
  const isLocked = balance < minCoinsToRedeem;
  const showHistoryNote = generalSettings?.show_temporary_message === '1';

  const isCoin = selected === 'bcoin';
  const sections = useMemo(
    () =>
      groupHistoryByMonth(
        isCoin ? walletData?.bcoinHistory : walletData?.btokenHistory,
      ),
    [isCoin, walletData],
  );

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const showStatus = useCallback((type, title, message) => {
    setStatusType(type);
    setStatusTitle(title);
    setStatusMessage(message);
    setStatusModalVisible(true);
  }, []);

  const fetchWalletData = useCallback(async () => {
    if (!isMounted.current) return;
    try {
      const response = await getWalletDataApi();
      if (isMounted.current && response?.success) {
        setWalletData(response.data);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    if (profile?.custId) {
      setIsLoading(true);
      fetchWalletData();
    } else {
      setIsLoading(false);
    }
  }, [fetchWalletData, profile?.custId]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchWalletData();
  }, [fetchWalletData]);

  const openRateSheet = useCallback(async () => {
    setShowRateSheet(true);
    setIsLoadingRates(true);
    try {
      const response = await getBCoinValueChangesApi();
      if (isMounted.current && response?.success && response.data?.items) {
        setRateHistory(withRateTrend(response.data.items));
      }
    } catch (error) {
      console.error('Error fetching UD Coin value history:', error);
    } finally {
      if (isMounted.current) setIsLoadingRates(false);
    }
  }, []);

  const handleRedeemPress = useCallback(() => {
    if (isLocked) {
      showStatus(
        'error',
        'Insufficient UD Coins',
        `You do not have enough UD Coins to redeem. A minimum of ${minCoinsToRedeem} UD Coins is required.`,
      );
      return;
    }
    setShowRedeemSheet(true);
  }, [isLocked, minCoinsToRedeem, showStatus]);

  const handleRedeem = useCallback(async () => {
    const redeemAmount = toNumber(requestedCoins);

    if (redeemAmount <= 0) {
      showStatus(
        'error',
        'Invalid Amount',
        'Please enter a valid amount of coins to redeem.',
      );
      return;
    }

    if (redeemAmount > balance) {
      showStatus(
        'error',
        'Insufficient Balance',
        'You do not have enough UD Coins.',
      );
      return;
    }

    setIsRedeeming(true);
    try {
      const response = await redeemBCoinsApi({
        requestedCoins: redeemAmount,
        preferredMethod,
      });

      if (!isMounted.current) return;
      setShowRedeemSheet(false);

      setTimeout(() => {
        if (!isMounted.current) return;

        if (response?.success) {
          setRequestedCoins('');
          fetchWalletData();
          showStatus(
            'success',
            'Success',
            response.message || 'Redemption request submitted successfully.',
          );
          return;
        }

        if (response?.status === 'PENDING_REQUEST') {
          showStatus(
            'error',
            'Request Pending',
            response.message ||
              'You already have a pending redemption request.',
          );
        } else if (response?.status === 'INSUFFICIENT_BALANCE') {
          showStatus(
            'error',
            'Insufficient Balance',
            response.message || 'You do not have enough UD Coins.',
          );
        } else {
          showStatus(
            'error',
            'Error',
            response?.message || 'Failed to submit redemption request.',
          );
        }
      }, SHEET_HANDOFF_DELAY);
    } catch (error) {
      console.error('Redemption error:', error);
      if (!isMounted.current) return;
      setShowRedeemSheet(false);
      setTimeout(() => {
        if (!isMounted.current) return;
        showStatus(
          'error',
          'Error',
          'An error occurred while processing your request.',
        );
      }, SHEET_HANDOFF_DELAY);
    } finally {
      if (isMounted.current) setIsRedeeming(false);
    }
  }, [balance, fetchWalletData, preferredMethod, requestedCoins, showStatus]);

  const listBottomPadding =
    FOOTER_HEIGHT +
    Math.max(insets.bottom, 14) +
    (showHistoryNote ? 26 : 0) +
    (isLocked ? 24 : 0);

  return (
    <View style={styles.screen}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <BCoinHero
        topInset={insets.top}
        balance={balance}
        coinValue={coinValue}
        onBack={() => navigation.goBack()}
        onInfo={() => setShowInfoSheet(true)}
      />

      <View style={styles.body}>
        <RateCard coinValue={coinValue} onPress={openRateSheet} />
        <TokenStrip tokens={tokens} />
        <WalletSegments selected={selected} onChange={setSelected} />

        <HistoryList
          sections={sections}
          isCoin={isCoin}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
          bottomPadding={listBottomPadding}
        />
      </View>

      <RedeemFooter
        bottomInset={insets.bottom}
        isLocked={isLocked}
        minCoins={minCoinsToRedeem}
        note={showHistoryNote}
        onPress={handleRedeemPress}
      />

      <RedeemSheet
        visible={showRedeemSheet}
        onClose={() => setShowRedeemSheet(false)}
        balance={balance}
        coinValue={coinValue}
        amount={requestedCoins}
        onAmountChange={setRequestedCoins}
        method={preferredMethod}
        onMethodChange={setPreferredMethod}
        isSubmitting={isRedeeming}
        onSubmit={handleRedeem}
      />

      <RateHistorySheet
        visible={showRateSheet}
        onClose={() => setShowRateSheet(false)}
        items={rateHistory}
        isLoading={isLoadingRates}
      />

      <InfoSheet
        visible={showInfoSheet}
        onClose={() => setShowInfoSheet(false)}
      />

      <StatusModal
        visible={statusModalVisible}
        onClose={() => setStatusModalVisible(false)}
        type={statusType}
        title={statusTitle}
        message={statusMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PALETTE.canvas,
  },
  body: {
    flex: 1,
    backgroundColor: PALETTE.canvas,
  },
});

export default BCoinScreen;

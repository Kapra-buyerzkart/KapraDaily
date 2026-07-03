import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
  ImageBackground,
  Modal,
  StatusBar,
} from 'react-native';
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AppContext } from '../context/appContext';
import LocationModal from '../components/LocationModal';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import {
  getWalletDataApi,
  redeemBCoinsApi,
  getBCoinValueChangesApi,
} from '../api/userService';
import StatusModal from '../components/StatusModal';

const UD_COIN_TOKEN_INFO = [
  {
    title: 'UD-Tokens (The "Earn" Points)',
    body: 'Think of UD-Tokens as bonus points you collect for helping the community grow.\n\nHow you get them: You earn them when you invite a friend (referral) and also whenever that friend buys something on the platform.\n\nThe Rule: You cannot spend UD-Tokens directly to buy things. The exact number of tokens you get for invites or purchases depends on the latest company policies.',
  },
  {
    title: 'UD-Coins (The "Cash" Points)',
    body: "UD-Coins are like real money sitting in your digital wallet. They have an actual cash value that can change over time.\n\nHow you get them: When you buy products, they often come with a specific UD-Token value. If you already have UD-Tokens in your account, the platform automatically converts those tokens into UD-Coins up to the product's limit.\n\nHow to spend them: You can use UD-Coins at checkout to get a direct discount on your shopping or to get discounts on movie/event tickets via the Uden Tickets platform.\n\nExample of How It Works:\n\nScenario A (You have enough tokens): You have 100 UD-Tokens. You buy items that offer a total of 30 tokens.\nResult: 30 UD-Tokens are converted. You get 30 UD-Coins, and your token balance drops by 30. (New Balance: 70 UD-Tokens & 30 UD-Coins).\n\nScenario B (You run low on tokens): You only have 20 UD-Tokens. You buy items that offer 30 tokens.\nResult: Since you only have 20 tokens, only 20 can convert. You get 20 UD-Coins, and your UD-Tokens become 0.",
  },
  {
    title: 'UD-Tokens (പോയിന്റുകൾ)',
    body: 'UD-Tokens എന്നത് നിങ്ങൾ സുഹൃത്തുക്കളെ ഈ പ്ലാറ്റ്‌ഫോമിലേക്ക് കൊണ്ടുവരുമ്പോൾ ലഭിക്കുന്ന ബോണസ് പോയിന്റുകളാണ്.\n\nഎങ്ങനെ ലഭിക്കും: നിങ്ങൾ ഒരു സുഹൃത്തിനെ ഇൻവൈറ്റ് ചെയ്യുമ്പോഴും (Referral), ആ സുഹൃത്ത് ഈ പ്ലാറ്റ്‌ഫോമിൽ നിന്ന് എന്തെങ്കിലും സാധനങ്ങൾ വാങ്ങുമ്പോഴും നിങ്ങൾക്ക് UD-Tokens ലഭിക്കും.\n\nപ്രത്യേകത: കമ്പനിയുടെ തീരുമാനങ്ങൾക്ക് വിധേയമായായിരിക്കും എത്ര ടോക്കൺ ലഭിക്കുമെന്ന് നിശ്ചയിക്കുന്നത്. ഈ ടോക്കണുകൾ ഉപയോഗിച്ച് നിങ്ങൾക്ക് നേരിട്ട് സാധനങ്ങൾ വാങ്ങാൻ കഴിയില്ല.',
  },
  {
    title: 'UD-Coins (പണത്തിന് തുല്യമായ കോയിനുകൾ)',
    body: 'UD-Coins എന്നാൽ നിങ്ങളുടെ വാലറ്റിലുള്ള യഥാർത്ഥ പണം പോലെയാണ്. ഇതിന് കൃത്യമായ ഒരു മൂല്യമുണ്ട് (ഇത് മാറിക്കൊണ്ടിരിക്കാം).\n\nഎങ്ങനെ ലഭിക്കും: നിങ്ങൾ ഓരോ പ്രൊഡക്റ്റ് വാങ്ങുമ്പോഴും അതിനോടൊപ്പം ചില ടോക്കൺ മൂല്യങ്ങൾ ഉണ്ടാകും. നിങ്ങളുടെ കയ്യിൽ ആവശ്യത്തിന് UD-Tokens ഉണ്ടെങ്കിൽ, അത് UD-Coins ആയി മാറും.\n\nഎങ്ങനെ ഉപയോഗിക്കാം: സാധനങ്ങൾ വാങ്ങുമ്പോൾ ബില്ലിൽ ഡിസ്‌കൗണ്ട് (കിഴിവ്) ലഭിക്കാനായി ഈ കോയിനുകൾ ഉപയോഗിക്കാം. കൂടാതെ Uden Tickets പ്ലാറ്റ്‌ഫോമിൽ നിന്ന് ടിക്കറ്റുകൾ എടുക്കുമ്പോഴും ഡിസ്‌കൗണ്ടിനായി ഇത് ഉപയോഗിക്കാവുന്നതാണ്.\n\nഇത് എങ്ങനെയെന്ന് ഒരു ഉദാഹരണത്തിലൂടെ മനസ്സിലാക്കാം:\n\nഉദാഹരണം 1: നിങ്ങളുടെ കയ്യിൽ 100 UD-Tokens ഉണ്ട്. നിങ്ങൾ വാങ്ങിയ സാധനങ്ങൾക്ക് ആകെ 30 ടോക്കണിന്റെ അർഹതയുണ്ട്.\nബാക്കി വരുന്നത്: നിങ്ങളുടെ 30 ടോക്കണുകൾ കുറയുകയും പകരം 30 UD-Coins നിങ്ങൾക്ക് ലഭിക്കുകയും ചെയ്യും. (ഇപ്പോൾ നിങ്ങളുടെ കയ്യിൽ 70 UD-Tokens-ഉം 30 UD-Coins-ഉം ഉണ്ടാകും).\n\nഉദാഹരണം 2: നിങ്ങളുടെ കയ്യിൽ 20 UD-Tokens മാത്രമേ ഉള്ളൂ. എന്നാൽ നിങ്ങൾ വാങ്ങിയ സാധനങ്ങൾക്ക് 30 ടോക്കൺ ആവശ്യമുണ്ട്.\nബാക്കി വരുന്നത്: നിങ്ങളുടെ കയ്യിൽ 20 ടോക്കൺ ഉള്ളതുകൊണ്ട് 20 UD-Coins മാത്രമേ ലഭിക്കൂ. നിങ്ങളുടെ UD-Token ബാലൻസ് 0 ആയി മാറുകയും ചെയ്യും.',
  },
];

const BCoinScreen = () => {
  const [selected, setSelected] = useState('bcoin');
  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bCoinValueHistory, setBCoinValueHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Redemption State
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [requestedCoins, setRequestedCoins] = useState('');
  const [preferredMethod, setPreferredMethod] = useState('bank');
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Status Modal State
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [statusType, setStatusType] = useState('success');
  const [statusTitle, setStatusTitle] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const navigation = useNavigation();
  const { isStoreUnavailable, storeUnavailableData, profile, generalSettings } =
    useContext(AppContext);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const isMounted = React.useRef(true);

  console.log(generalSettings, 'generalSettings====>');
  console.log(generalSettings.min_coins_to_redeem_cash, 'generalSettings====>');

  const minCoinsToRedeem = Number(generalSettings?.min_coins_to_redeem_cash);
  const isDisabledTrue = (walletData?.wallet?.bCoins || 0) < minCoinsToRedeem;
  const showHistoryNote = generalSettings?.show_temporary_message === '1';

  console.log(
    minCoinsToRedeem,
    'minCoinsToRedeem',
    walletData?.wallet?.bCoins,
    'walletData?.wallet?.bCoins',
    isDisabledTrue,
    'isDisabledTrue',
  );

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (profile?.custId) {
      fetchWalletData();
    }
  }, [profile?.custId]);

  const fetchWalletData = async () => {
    if (!isMounted.current) return;
    setIsLoading(true);
    try {
      const response = await getWalletDataApi();
      if (isMounted.current && response && response.success) {
        setWalletData(response.data);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  };

  const fetchBCoinValueHistory = async () => {
    if (!isMounted.current) return;
    setIsLoadingHistory(true);
    try {
      const response = await getBCoinValueChangesApi();
      if (
        isMounted.current &&
        response &&
        response.success &&
        response.data &&
        response.data.items
      ) {
        // Determine changeType (up/down) by comparing to the previous value over time
        const items = [...response.data.items];

        // Sort purely chronologically (oldest first) to compare correctly
        items.sort((a, b) => new Date(a.updatedOn) - new Date(b.updatedOn));

        const mappedItems = items.map((item, index) => {
          let changeType = 'up';
          if (index > 0) {
            const prevValue = items[index - 1].bCoinValue;
            if (item.bCoinValue < prevValue) {
              changeType = 'down';
            }
          }
          return {
            ...item,
            changeType,
          };
        });

        // Present newest first
        setBCoinValueHistory(mappedItems.reverse());
      }
    } catch (error) {
      console.error('Error fetching UD-coin value history:', error);
    } finally {
      if (isMounted.current) setIsLoadingHistory(false);
    }
  };

  const handleRedeem = async () => {
    console.log(
      'Redeem clicked. Requested Coins:',
      requestedCoins,
      'Preferred Method:',
      preferredMethod,
    );
    const redeemAmount = Number(requestedCoins);
    console.log('Normalized Redeem Amount:', redeemAmount);

    if (isNaN(redeemAmount) || redeemAmount <= 0) {
      console.log('Invalid amount validation failed');
      setStatusType('error');
      setStatusTitle('Invalid Amount');
      setStatusMessage('Please enter a valid amount of coins to redeem.');
      setStatusModalVisible(true);
      return;
    }

    // Assuming coinsData is walletData.wallet and totalCoins is bCoins
    console.log('Available UD-coins:', walletData?.wallet?.bCoins);
    if (redeemAmount > (walletData?.wallet?.bCoins || 0)) {
      console.log('Insufficient balance validation failed');
      setStatusType('error');
      setStatusTitle('Insufficient Balance');
      setStatusMessage('You do not have enough UD-coins.');
      setStatusModalVisible(true);
      return;
    }

    setIsRedeeming(true);
    try {
      const payload = {
        requestedCoins: Number(requestedCoins),
        preferredMethod: preferredMethod,
      };
      console.log('Sending Redeem Payload:', payload);
      const response = await redeemBCoinsApi(payload);
      console.log('Redeem API Response:', response);

      if (!isMounted.current) {
        console.log('Component unmounted, skipping response handling');
        return;
      }

      setShowRedeemModal(false);

      setTimeout(() => {
        if (!isMounted.current) return;

        if (response && response.success) {
          console.log('Redemption successful');
          setRequestedCoins('');
          fetchWalletData(); // Refresh data

          setStatusType('success');
          setStatusTitle('Success');
          setStatusMessage(
            response.message || 'Redemption request submitted successfully.',
          );
        } else {
          console.log(
            'Redemption failed or handled error:',
            response?.status,
            response?.message,
          );
          if (response?.status === 'PENDING_REQUEST') {
            setStatusType('error');
            setStatusTitle('Request Pending');
            setStatusMessage(
              response.message ||
                'You already have a pending redemption request.',
            );
          } else if (response?.status === 'INSUFFICIENT_BALANCE') {
            setStatusType('error');
            setStatusTitle('Insufficient Balance');
            setStatusMessage(
              response.message || 'You do not have enough UD-coins.',
            );
          } else {
            setStatusType('error');
            setStatusTitle('Error');
            setStatusMessage(
              response?.message || 'Failed to submit redemption request.',
            );
          }
        }
        setStatusModalVisible(true);
      }, 500);
    } catch (error) {
      console.error('Redemption error:', error);
      if (isMounted.current) {
        setShowRedeemModal(false);
        setTimeout(() => {
          if (!isMounted.current) return;
          setStatusType('error');
          setStatusTitle('Error');
          setStatusMessage('An error occurred while processing your request.');
          setStatusModalVisible(true);
        }, 500);
      }
    } finally {
      if (isMounted.current) setIsRedeeming(false);
    }
  };

  const insets = useSafeAreaInsets();

  const formatShortDate = date =>
    date
      ? new Date(date)
          .toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
          .toLowerCase()
      : '';

  // Group history rows under an uppercase month heading (e.g. JANUARY),
  // newest month first, matching the redesigned history section.
  const groupHistoryByMonth = items => {
    if (!items || items.length === 0) return [];
    const groups = {};
    const order = [];
    items.forEach(item => {
      const date = item.transactionDate ? new Date(item.transactionDate) : null;
      const key = date ? `${date.getFullYear()}-${date.getMonth()}` : 'other';
      if (!groups[key]) {
        groups[key] = {
          key,
          label: date
            ? date.toLocaleDateString('en-US', { month: 'long' }).toUpperCase()
            : 'OTHER',
          sortValue: date ? date.getTime() : 0,
          items: [],
        };
        order.push(key);
      }
      groups[key].items.push(item);
    });
    return order
      .map(key => groups[key])
      .sort((a, b) => b.sortValue - a.sortValue);
  };

  const activeHistory =
    selected === 'bcoin' ? walletData?.bcoinHistory : walletData?.btokenHistory;
  const historyGroups = groupHistoryByMonth(activeHistory);
  const historyTintColor = selected === 'bcoin' ? '#FBF0D9' : '#F1EAFB';

  return (
    <View style={[styles.mainContainer]}>
      <StatusBar
        translucent
        backgroundColor={'transparent'}
        barStyle={'light-content'}
      />
      <ImageBackground
        style={styles.hero}
        source={require('../assets/images/token_header.png')}
        resizeMode="cover"
      >
        <View
          style={[styles.heroTopRow, { paddingTop: insets.top + hp('1%') }]}
        >
          <TouchableOpacity
            style={styles.circleBtn}
            hitSlop={40}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="left" size={wp('4.5%')} color="#ffffffff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.knowMorePill}
            activeOpacity={0.85}
            onPress={() => setShowInfoModal(true)}
          >
            <AntDesign name="infocirlceo" size={wp('3.6%')} color="white" />
            <Text style={styles.knowMoreText}>Know more</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.heroCenter}>
          <Text style={styles.totalLabel}>Total UD coins</Text>
          <View style={styles.totalRow}>
            <Image
              style={styles.totalCoin}
              source={require('../assets/icons/udcoinUpdated.png')}
            />
            <Text style={styles.totalValue}>
              {Number(walletData?.wallet?.bCoins || 0).toFixed(2)}
            </Text>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.contentCard}>
        <TouchableOpacity
          style={styles.valuePill}
          activeOpacity={0.9}
          onPress={() => {
            fetchBCoinValueHistory();
            setShowModal(true);
          }}
        >
          <Text style={styles.valueLabel}>Today's value ,</Text>
          <Image
            style={styles.valueCoin}
            source={require('../assets/icons/udcoinUpdated.png')}
          />
          <Text style={styles.valueEq}>
            1 = ₹{walletData?.wallet?.bCoinValue || '0.00'}
          </Text>
        </TouchableOpacity>

        <View style={styles.tokenCard}>
          <View style={styles.tokenLeft}>
            <Image
              style={styles.tokenLogo}
              source={require('../assets/icons/tokenud.png')}
            />
            <Text style={styles.tokenTitle}>UD-Token</Text>
          </View>
          <View style={styles.tokenRight}>
            <Text style={styles.tokenBalLabel}>Available Balance</Text>
            <Text style={styles.tokenBalValue}>
              {walletData?.wallet?.bTokens || '0'}
            </Text>
          </View>
        </View>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={styles.tab}
            activeOpacity={0.8}
            onPress={() => setSelected('bcoin')}
          >
            <View style={styles.tabInner}>
              <Image
                style={styles.tabCoinIcon}
                source={require('../assets/icons/udcoinUpdated.png')}
              />
              <Text
                style={[
                  styles.tabText,
                  selected === 'bcoin' && styles.tabTextActive,
                ]}
              >
                UD coin
              </Text>
            </View>
            <View
              style={[
                styles.tabUnderline,
                selected === 'bcoin' && styles.tabUnderlineActive,
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            activeOpacity={0.8}
            onPress={() => setSelected('btoken')}
          >
            <View style={styles.tabInner}>
              <Image
                style={styles.tabTicketIcon}
                source={require('../assets/icons/tokenud.png')}
              />
              <Text
                style={[
                  styles.tabText,
                  selected === 'btoken' && styles.tabTextActive,
                ]}
              >
                UD-Token
              </Text>
            </View>
            <View
              style={[
                styles.tabUnderline,
                selected === 'btoken' && styles.tabUnderlineActive,
              ]}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.historyScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp('2%') }}
        >
          {historyGroups.map(group => (
            <View key={group.key}>
              <View style={styles.monthHeader}>
                <Text style={styles.monthHeaderText}>{group.label}</Text>
              </View>
              {group.items.map(item => {
                const isCredit =
                  item.transactionType === 'credit' ||
                  item.transactionType === 'Credit';
                return (
                  <View key={item.historyId} style={styles.historyRow}>
                    <View
                      style={[
                        styles.historyIconWrap,
                        { backgroundColor: historyTintColor },
                      ]}
                    >
                      <Image
                        style={
                          selected === 'bcoin'
                            ? styles.historyCoin
                            : styles.historyTicket
                        }
                        source={
                          selected === 'bcoin'
                            ? require('../assets/icons/udcoinUpdated.png')
                            : require('../assets/icons/tokenud.png')
                        }
                      />
                    </View>
                    <View style={styles.historyMiddle}>
                      <Text style={styles.historyTitle}>
                        {item.description || 'Unknown Transaction'}
                      </Text>
                      {item.orderId ? (
                        <Text style={styles.historySub}>
                          for order #{item.orderId}
                        </Text>
                      ) : null}
                      <Text style={styles.historyDate}>
                        {formatShortDate(item.transactionDate)}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.historyAmount,
                        { color: isCredit ? '#0CA201' : '#FF0000' },
                      ]}
                    >
                      {isCredit ? '+' : ''}
                      {item.amount.toFixed(2)}{' '}
                      {selected === 'bcoin' ? 'coins' : 'tokens'}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
          {!isLoading && historyGroups.length === 0 && (
            <View style={{ alignItems: 'center', marginTop: hp('5%') }}>
              <Text style={styles.emptyText}>No history available</Text>
            </View>
          )}
        </ScrollView>
        {showHistoryNote && (
          <View
            style={[
              styles.historyNoteContainer,
              { marginHorizontal: wp('5%'), marginBottom: hp('1%') },
            ]}
          >
            <Text style={styles.historyNoteText}>
              This app displays only the most recent transaction history
            </Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        onPress={() => {
          if (isDisabledTrue) {
            setStatusType('error');
            setStatusTitle('Insufficient UD-coins');
            setStatusMessage(
              `You do not have enough UD-coins to redeem. A minimum of ${minCoinsToRedeem} UD-coins is required.`,
            );
            setStatusModalVisible(true);
            return;
          }
          setShowRedeemModal(true);
        }}
        style={[
          styles.redeemButton,
          isDisabledTrue && {
            backgroundColor: 'gray',
            opacity: 0.5,
          },
        ]}
      >
        <Text style={styles.redeemText}>Redeem now</Text>
      </TouchableOpacity>
      <LocationModal
        visible={isLocationModalVisible}
        onClose={() => setIsLocationModalVisible(false)}
      />
      <Modal visible={showRedeemModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeaderContainer}>
              <Text style={styles.modalHeaderText}>Redeem UD-coin</Text>
              <TouchableOpacity onPress={() => setShowRedeemModal(false)}>
                <Image
                  style={styles.closeIcon}
                  source={require('../assets/images/close_two.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: wp('5%') }}>
              <Text style={styles.availableBalanceHeaderText}>
                Requested Coins
              </Text>
              <TextInput
                style={styles.redeemInput}
                placeholder="Enter requested UD-coin"
                placeholderTextColor="#AAAAAA"
                keyboardType="numeric"
                value={requestedCoins}
                onChangeText={setRequestedCoins}
              />

              <Text
                style={[
                  styles.availableBalanceHeaderText,
                  { marginTop: hp('2%') },
                ]}
              >
                Preferred Method
              </Text>
              <View style={styles.methodContainer}>
                <TouchableOpacity
                  onPress={() => setPreferredMethod('bank')}
                  style={[
                    styles.methodButton,
                    preferredMethod === 'bank' && styles.methodButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.methodText,
                      preferredMethod === 'bank' && styles.methodTextActive,
                    ]}
                  >
                    Bank Transfer
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setPreferredMethod('wallet')}
                  style={[
                    styles.methodButton,
                    preferredMethod === 'wallet' && styles.methodButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.methodText,
                      preferredMethod === 'wallet' && styles.methodTextActive,
                    ]}
                  >
                    Wallet
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleRedeem}
                disabled={isRedeeming}
                style={[
                  styles.redeemButton,
                  { marginTop: hp('4%'), width: '100%' },
                ]}
              >
                {isRedeeming ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.redeemText}>Submit Request</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeaderContainer}>
              <Text style={styles.modalHeaderText}>UD-coin rate history</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Image
                  style={styles.closeIcon}
                  source={require('../assets/images/close_two.png')}
                />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {isLoadingHistory ? (
                <ActivityIndicator
                  size="large"
                  color="#F25000"
                  style={{ marginTop: hp('5%') }}
                />
              ) : bCoinValueHistory && bCoinValueHistory.length > 0 ? (
                bCoinValueHistory.map((item, index) => (
                  <View
                    key={item.id || index}
                    style={styles.bcoinRateSingleContainer}
                  >
                    <View style={{ width: wp('30%') }}>
                      <Text style={styles.dateText}>
                        {item.updatedOn
                          ? new Date(item.updatedOn).toLocaleDateString(
                              'en-IN',
                              {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              },
                            )
                          : ''}
                      </Text>
                    </View>
                    <View style={{ width: wp('40%') }}>
                      <Text style={styles.timeText}>
                        {item.updatedOn
                          ? new Date(item.updatedOn).toLocaleTimeString(
                              'en-IN',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              },
                            )
                          : ''}
                      </Text>
                    </View>
                    <View style={styles.rateView}>
                      <Text
                        style={[
                          styles.rateText,
                          {
                            color:
                              item.changeType === 'down'
                                ? '#FF0000'
                                : '#0CA201',
                          },
                        ]}
                      >
                        ₹
                        {item.bCoinValue?.toFixed(2) ||
                          item.newValue ||
                          item.value}
                      </Text>
                      <Image
                        style={styles.upImage}
                        source={
                          item.changeType === 'down'
                            ? require('../assets/images/down.png')
                            : require('../assets/images/up.png')
                        }
                      />
                    </View>
                  </View>
                ))
              ) : (
                <View style={{ alignItems: 'center', marginTop: hp('5%') }}>
                  <Text style={styles.viewText}>No history available</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal visible={showInfoModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeaderContainer}>
              <Text style={styles.modalHeaderText}>UD-coin & UD-token</Text>
              <TouchableOpacity onPress={() => setShowInfoModal(false)}>
                <Image
                  style={styles.closeIcon}
                  source={require('../assets/images/close_two.png')}
                />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={{ paddingHorizontal: wp('4.65%') }}
              showsVerticalScrollIndicator={false}
            >
              {UD_COIN_TOKEN_INFO.map((section, index) => (
                <View
                  key={section.title}
                  style={{
                    marginBottom:
                      index === UD_COIN_TOKEN_INFO.length - 1
                        ? hp('2%')
                        : hp('2.5%'),
                  }}
                >
                  <Text style={styles.infoSectionTitle}>{section.title}</Text>
                  <Text style={styles.infoSectionBody}>{section.body}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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

export default BCoinScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,

    backgroundColor: 'white',
    paddingBottom: 20,
  },
  hero: {
    height: hp('30%'),
    width: '100%',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
  },
  circleBtn: {
    width: wp('9.5%'),
    height: wp('9.5%'),
    borderRadius: wp('9.5%') / 2,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  knowMorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('0.9%'),
    borderRadius: wp('6%'),
  },
  knowMoreText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.5%'),
    color: 'white',
    marginLeft: wp('1.5%'),
  },
  heroCenter: {
    alignItems: 'center',
    marginTop: hp('1.5%'),
  },
  totalLabel: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('4%'),
    color: '#FFFFFF',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.8%'),
  },
  totalCoin: {
    width: wp('7.5%'),
    height: wp('7.5%'),
    resizeMode: 'contain',
    marginRight: wp('2.5%'),
  },
  totalValue: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('9%'),
    color: '#FFFFFF',
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    borderTopLeftRadius: wp('8%'),
    borderTopRightRadius: wp('8%'),
    marginTop: -hp('3.5%'),
    paddingTop: hp('1%'),
  },
  valuePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: wp('7%'),
    paddingVertical: hp('1.4%'),
    paddingHorizontal: wp('7%'),
    marginTop: -hp('4.5%'),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  valueLabel: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.7%'),
    color: '#000000',
  },
  valueCoin: {
    width: wp('4.5%'),
    height: wp('4.5%'),
    resizeMode: 'contain',
    marginHorizontal: wp('1.5%'),
  },
  valueEq: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.7%'),
    color: '#000000',
  },
  tokenCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: wp('90.7%'),
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: wp('4%'),
    paddingVertical: hp('1.4%'),
    paddingHorizontal: wp('4%'),
    marginTop: hp('2.5%'),
  },
  tokenLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenLogo: {
    width: wp('9%'),
    height: wp('6%'),
    resizeMode: 'contain',
    marginRight: wp('2.5%'),
  },
  tokenTitle: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.18%'),
    color: '#000000',
  },
  tokenRight: {
    alignItems: 'flex-end',
  },
  tokenBalLabel: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('2.7%'),
    color: '#9A9A9A',
  },
  tokenBalValue: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.65%'),
    marginTop: 6,

    color: '#000000',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('2.5%'),
    marginBottom: hp('0.5%'),
  },
  tab: {
    alignItems: 'center',
    width: wp('38%'),
  },
  tabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: hp('1%'),
  },
  tabCoinIcon: {
    width: wp('5%'),
    height: wp('5%'),
    resizeMode: 'contain',
    marginRight: wp('2%'),
  },
  tabTicketIcon: {
    width: wp('7%'),
    height: wp('4.5%'),
    resizeMode: 'contain',
    marginRight: wp('2%'),
  },
  tabText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.9%'),
    color: '#9A9A9A',
  },
  tabTextActive: {
    color: '#000000',
  },
  tabUnderline: {
    height: hp('0.35%'),
    width: '70%',
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  tabUnderlineActive: {
    backgroundColor: '#F25000',
  },
  historyScroll: {
    flex: 1,
    marginTop: hp('0.5%'),
  },
  monthHeader: {
    backgroundColor: '#F4F4F4',
    paddingVertical: hp('0.9%'),
    paddingHorizontal: wp('5%'),
  },
  monthHeaderText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.2%'),
    color: '#8A8A8A',
    letterSpacing: 0.5,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('90.7%'),
    alignSelf: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    paddingVertical: hp('1.6%'),
  },
  historyIconWrap: {
    width: wp('9.5%'),
    height: wp('9.5%'),
    borderRadius: wp('9.5%') / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyCoin: {
    width: wp('6%'),
    height: wp('6%'),
    resizeMode: 'contain',
  },
  historyTicket: {
    width: wp('4%'),
    height: wp('4%'),
    resizeMode: 'contain',
  },
  historyMiddle: {
    flex: 1,
    marginLeft: wp('3%'),
  },
  historyTitle: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.6%'),
    color: '#000000',
  },
  historySub: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('2.9%'),
    color: '#000000ff',
    marginTop: hp('0.2%'),
  },
  historyDate: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('2.9%'),
    color: '#B5B5B5',
    marginTop: hp('0.5%'),
  },
  historyAmount: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.6%'),
    marginLeft: wp('2%'),
  },
  emptyText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.5%'),
    color: '#9A9A9A',
  },
  availableBalanceHeaderText: {
    color: '#616161',
    fontFamily: FONTS.gilroy.light,
    fontSize: wp('2.32%'),
  },
  viewText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.79%'),
    color: '#616161',
  },
  redeemButton: {
    width: wp('90.7%'),
    height: hp('6.11%'),
    backgroundColor: '#F25000',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  redeemText: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.18%'),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: wp('9.3%'),
    borderTopRightRadius: wp('9.3%'),
    paddingVertical: hp('3.11%'),
    // paddingHorizontal: wp('4.65%'),
    maxHeight: hp('70%'),
  },
  modalHeaderContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('4.65%'),
    borderBottomWidth: 1,
    borderBottomColor: '#8F8F8F40',
    paddingBottom: hp('1%'),
    marginBottom: hp('2.7%'),
  },
  modalHeaderText: {
    color: '#000000',
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.65%'),
  },
  closeIcon: {
    height: wp('3.72%'),
    width: wp('3.72%'),
    resizeMode: 'contain',
  },
  bcoinRateSingleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5.5%'),
    marginBottom: hp('1%'),
  },
  dateText: {
    color: '#000000',
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.72%'),
    width: wp('30%'),
  },
  timeText: {
    color: '#000000',
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.72%'),
    width: wp('40%'),
  },
  rateView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('30%'),
  },
  rateText: {
    color: '#FF0000',
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.25%'),
  },
  upImage: {
    width: wp('3.02%'),
    height: hp('0.86%'),
    resizeMode: 'contain',
    marginLeft: wp('1%'),
  },
  bcoinGif: {
    width: wp('47.44%'),
    height: hp('21.88%'),
    // resizeMode: 'contain',
    alignSelf: 'center',
    // marginTop: hp('4.1%')
    bottom: hp('1.1%'),
  },
  redeemInput: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    marginTop: hp('1%'),
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('4%'),
    color: '#000',
    backgroundColor: '#F9F9F9',
  },
  methodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('1.5%'),
  },
  methodButton: {
    flex: 0.48,
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: wp('2%'),
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  methodButtonActive: {
    borderColor: '#F25000',
    backgroundColor: '#FFF5F0',
  },
  methodText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.72%'),
    color: '#616161',
  },
  methodTextActive: {
    color: '#F25000',
  },
  historyHeaderRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    // marginTop: hp('2%'),
    marginBottom: hp('1%'),
  },
  historyNoteContainer: {
    // backgroundColor: '#FFF5F0',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('2%'),
    // marginTop: hp('0.5%'),
    borderLeftWidth: 3,
    borderLeftColor: '#F25000',
  },
  historyNoteText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.8%'),
    color: '#F25000',
  },
  infoSectionTitle: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.18%'),
    color: '#000000',
    marginBottom: hp('0.8%'),
  },
  infoSectionBody: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.5%'),
    color: '#616161',
    lineHeight: hp('2.4%'),
  },
});

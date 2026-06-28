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
} from 'react-native';
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AppContext } from '../context/appContext';
import LocationModal from '../components/LocationModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
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

  const showHistoryNote = generalSettings?.show_temporary_message === '1';

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

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ImageBackground
        style={styles.backgroundImageStyle}
        source={require('../assets/images/bcoinbg.png')}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={styles.leftArrowIcon}
              source={require('../assets/images/left_arrow.png')}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>UD-coin and UD-token</Text>
        </View>
      </ImageBackground>
      <View style={styles.innerContainer}>
        <>
          <View>
            <View style={styles.bcoinContainerOne}>
              <Image
                style={styles.bcoinImage}
                source={require('../assets/images/bcoinn.png')}
              />
              <Text style={styles.bcoinText}>UD-coin</Text>
              <View style={styles.bcoinInnerView}>
                <Text style={styles.availableBalanceHeaderText}>
                  Available Balance
                </Text>
                <Text style={styles.availableBalanceValueText}>
                  {walletData?.wallet?.bCoins || '0.00'}
                </Text>
              </View>
            </View>
            <View style={styles.bcoinContainerTwo}>
              <View style={styles.bcoinInnerViewTwo}>
                <Text style={styles.bcoinTextTwo}>
                  Today's UD-coin value :{' '}
                </Text>
                <Text style={styles.bcoinPriceText}>
                  ₹{walletData?.wallet?.bCoinValue || '0.00'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  fetchBCoinValueHistory();
                  setShowModal(true);
                }}
                style={styles.bcoinInnerViewTwo}
              >
                <Text style={styles.viewText}>View</Text>
                <Image
                  style={styles.rightArrowsIcon}
                  source={require('../assets/images/right-arrows-two.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={[
              styles.bcoinContainerOne,
              {
                borderRadius: wp('5.33%'),
                marginTop: hp('1.5%'),
              },
            ]}
          >
            <Image
              style={styles.bcoinImage}
              source={require('../assets/images/btoken.png')}
            />
            <Text style={styles.bcoinText}>UD-token</Text>
            <View style={styles.bcoinInnerView}>
              <Text style={styles.availableBalanceHeaderText}>
                Available Balance
              </Text>
              <Text style={styles.availableBalanceValueText}>
                {walletData?.wallet?.bTokens || '0'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setShowInfoModal(true)}
            style={{ paddingTop: 20 }}
          >
            <Text
              style={{
                textAlign: 'right',
                textDecorationLine: 'underline',
                textDecorationColor: '#ff6200ff',
                textDecorationStyle: 'solid',
                marginRight: wp('6%'),
                fontSize: wp('4%'),

                color: '#ff6200ff',
                fontFamily: FONTS.poppins.regular,
                fontWeight: '600',
              }}
            >
              Know more
            </Text>
          </TouchableOpacity>
          <View style={styles.historyHeaderRow}>
            <Text style={styles.historyHeaderText}>History</Text>
          </View>
          <View style={styles.bcoinTokenHeaderContainer}>
            <TouchableOpacity
              onPress={() => setSelected('bcoin')}
              style={
                selected === 'bcoin'
                  ? [
                      styles.bcoinSingleContainer,
                      {
                        borderBottomWidth: hp('0.43%'),
                        borderBottomColor: '#F25000',
                      },
                    ]
                  : styles.bcoinSingleContainer
              }
            >
              <Text
                style={
                  selected === 'bcoin'
                    ? [
                        styles.bcoinSingleText,
                        {
                          color: '#F25000',
                        },
                      ]
                    : styles.bcoinSingleText
                }
              >
                UD-coin
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelected('btoken')}
              style={
                selected === 'btoken'
                  ? [
                      styles.bcoinSingleContainer,
                      {
                        borderBottomWidth: hp('0.43%'),
                        borderBottomColor: '#F25000',
                      },
                    ]
                  : styles.bcoinSingleContainer
              }
            >
              <Text
                style={
                  selected === 'btoken'
                    ? [
                        styles.bcoinSingleText,
                        {
                          color: '#F25000',
                        },
                      ]
                    : styles.bcoinSingleText
                }
              >
                UD-token
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            {(selected === 'bcoin'
              ? walletData?.bcoinHistory
              : walletData?.btokenHistory
            )?.map((item, index, array) => (
              <View
                key={item.historyId}
                style={[
                  styles.bcoinContainer,
                  {
                    borderBottomWidth: index === array.length - 1 ? 0 : 1,
                  },
                ]}
              >
                <Image
                  style={styles.bcoinImageTwo}
                  source={
                    selected === 'bcoin'
                      ? require('../assets/images/bcoinn.png')
                      : require('../assets/images/btoken.png')
                  }
                />
                <View style={{ flex: 1, marginLeft: wp('3%') }}>
                  <Text style={styles.bcoinContent}>{item.description}</Text>
                  {/* <Text style={[styles.bcoinContent, {
                                        fontSize: wp('3.5%'),
                                        fontFamily: FONTS.poppins.semiBold,
                                        marginTop: 2
                                    }]}>
                                        {item.orderId || 'N/A'}
                                    </Text> */}
                  <View style={{ marginTop: hp('0.5%') }}>
                    <Text
                      style={[
                        styles.bcoinContent,
                        {
                          fontSize: wp('3.1%'),
                          color: '#727783',
                        },
                      ]}
                    >
                      {item.transactionDate
                        ? new Date(item.transactionDate).toLocaleDateString(
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
                </View>
                <Text
                  style={[
                    styles.bcoinPriceTextTwo,
                    {
                      color:
                        item.transactionType === 'credit' ||
                        item.transactionType === 'Credit'
                          ? '#0CA201'
                          : '#FF0000',
                    },
                  ]}
                >
                  {item.transactionType === 'credit' ||
                  item.transactionType === 'Credit'
                    ? '+'
                    : ''}
                  {item.amount.toFixed(2)}{' '}
                  {selected === 'bcoin' ? 'coins' : 'tokens'}
                </Text>
              </View>
            ))}
            {!isLoading &&
              (!walletData ||
                (selected === 'bcoin'
                  ? walletData?.bcoinHistory?.length === 0
                  : walletData?.btokenHistory?.length === 0)) && (
                <View style={{ alignItems: 'center', marginTop: hp('5%') }}>
                  <Text style={styles.viewText}>No history available</Text>
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
        </>
      </View>
      {/* <TouchableOpacity
        onPress={() => setShowRedeemModal(true)}
        style={styles.redeemButton}
      >
        <Text style={styles.redeemText}>Redeem UD-coin</Text>
      </TouchableOpacity> */}
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
    </SafeAreaView>
  );
};

export default BCoinScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp('4.65%'),
    marginTop: hp('4%'),
  },
  leftArrowIcon: {
    width: wp('2.33%'),
    height: hp('2.03%'),
    resizeMode: 'contain',
  },
  headerText: {
    color: '#000000',
    fontFamily: FONTS.poppins.semiBold,
    fontSize: wp('4.65%'),
    marginLeft: wp('6%'),
  },
  imageStyle: {
    width: wp('47.44%'),
    height: hp('21.88%'),
    resizeMode: 'contain',
    alignSelf: 'center',
    // marginTop: hp('4.1%')
    bottom: hp('1.1%'),
  },
  backgroundImageStyle: {
    height: hp('26%'),
    resizeMode: 'contain',
  },
  innerContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    borderTopLeftRadius: wp('7%'),
    borderTopRightRadius: wp('7%'),
    bottom: hp('2.5%'),
  },
  bcoinContainerOne: {
    width: wp('90.7%'),
    height: hp('6.15%'),
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#DADADA',
    borderWidth: 1,
    borderTopLeftRadius: wp('6.33%'),
    borderTopRightRadius: wp('6.33%'),
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: hp('3%'),
    paddingHorizontal: wp('3.25%'),
  },
  bcoinImage: {
    width: wp('6.23%'),
    height: hp('3.72%'),
    resizeMode: 'contain',
  },
  bcoinText: {
    fontSize: wp('4.18%'),
    fontFamily: FONTS.poppins.regular,
    color: '#000000',
  },
  bcoinInnerView: {
    alignItems: 'flex-end',
  },
  availableBalanceHeaderText: {
    color: '#616161',
    fontFamily: FONTS.poppins.light,
    fontSize: wp('2.32%'),
  },
  availableBalanceValueText: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: wp('4.65%'),
    color: '#F25000',
  },
  bcoinContainerTwo: {
    alignSelf: 'center',
    width: wp('90.7%'),
    height: hp('3.22%'),
    borderColor: '#DADADA',
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: wp('6.33%'),
    borderBottomRightRadius: wp('6.33%'),
    //  backgroundColor: '#FED7C4',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: wp('3%'),
  },
  bcoinInnerViewTwo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bcoinTextTwo: {
    fontFamily: FONTS.poppins.regular,
    color: '#616161',
    fontSize: wp('2.79%'),
  },
  bcoinPriceText: {
    fontFamily: FONTS.poppins.semiBold,
    color: '#000000',
    fontSize: wp('2.79%'),
  },
  viewText: {
    fontFamily: FONTS.poppins.medium,
    fontSize: wp('2.79%'),
    color: '#616161',
  },
  rightArrowsIcon: {
    width: wp('3.72%'),
    height: hp('1.07%'),
    marginLeft: wp('2.5%'),
  },
  historyHeaderText: {
    color: '#000000',
    fontFamily: FONTS.poppins.medium,
    fontSize: wp('4.19%'),
    marginTop: hp('3%'),
    alignSelf: 'center',
  },
  bcoinTokenHeaderContainer: {
    flexDirection: 'row',
    marginTop: hp('2%'),
    alignSelf: 'center',
  },
  bcoinSingleContainer: {
    alignItems: 'center',
    width: wp('38.4%'),
    paddingBottom: hp('0.4%'),
  },
  bcoinSingleText: {
    color: '#616161',
    fontFamily: FONTS.poppins.medium,
    fontSize: wp('3.72%'),
  },
  bcoinContainer: {
    flexDirection: 'row',
    width: wp('90.7%'),
    justifyContent: 'space-between',
    alignSelf: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DADADA',
    paddingBottom: hp('1.5%'),
    marginTop: hp('1.5%'),
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('3%'),
  },
  bcoinImageTwo: {
    width: wp('5.98%'),
    height: wp('5.98%'),
    resizeMode: 'contain',
  },
  bcoinContent: {
    fontFamily: FONTS.poppins.regular,
    color: '#000000',
    fontSize: wp('2.56%'),
  },
  bcoinPriceTextTwo: {
    color: '#FF0000',
    fontFamily: FONTS.poppins.semiBold,
    fontSize: wp('3.49%'),
  },
  redeemButton: {
    width: wp('90.7%'),
    height: hp('6.11%'),
    backgroundColor: '#F25000',
    borderRadius: wp('10.33%'),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  redeemText: {
    color: '#FFFFFF',
    fontFamily: FONTS.poppins.bold,
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
    fontFamily: FONTS.poppins.semiBold,
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
    fontFamily: FONTS.poppins.regular,
    fontSize: wp('3.72%'),
    width: wp('30%'),
  },
  timeText: {
    color: '#000000',
    fontFamily: FONTS.poppins.regular,
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
    fontFamily: FONTS.poppins.medium,
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
    fontFamily: FONTS.poppins.regular,
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
    fontFamily: FONTS.poppins.medium,
    fontSize: wp('3.72%'),
    color: '#616161',
  },
  methodTextActive: {
    color: '#F25000',
  },
  historyHeaderRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
  },
  historyNoteContainer: {
    backgroundColor: '#FFF5F0',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('2%'),
    marginTop: hp('0.5%'),
    borderLeftWidth: 3,
    borderLeftColor: '#F25000',
  },
  historyNoteText: {
    fontFamily: FONTS.poppins.medium,
    fontSize: wp('2.8%'),
    color: '#F25000',
  },
  infoSectionTitle: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: wp('4.18%'),
    color: '#000000',
    marginBottom: hp('0.8%'),
  },
  infoSectionBody: {
    fontFamily: FONTS.poppins.regular,
    fontSize: wp('3.5%'),
    color: '#616161',
    lineHeight: hp('2.4%'),
  },
});

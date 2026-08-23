import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ImageBackground,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import {
  getWalletDataApi,
  redeemBCoinsApi,
  getBCoinValueChangesApi,
} from '../../api/services/userService';
import { useUser } from '../../context/UserContext';
import { colors } from '../../theme/colours';
import { AppIcons } from '../../assets/icons';
import { styles } from './styles';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface BCoinHistoryItem {
  historyId: string | number;
  description: string;
  transactionDate: string;
  transactionType: string;
  amount: number;
}

interface BCoinRateHistoryItem {
  id?: string | number;
  updatedOn: string;
  bCoinValue?: number;
  newValue?: number;
  value?: number;
  changeType?: 'up' | 'down';
}

const BCoinScreen: React.FC = () => {
  const [selected, setSelected] = useState<'bcoin' | 'btoken'>('bcoin');
  const [showModal, setShowModal] = useState(false);
  const [walletData, setWalletData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bCoinValueHistory, setBCoinValueHistory] = useState<
    BCoinRateHistoryItem[]
  >([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [requestedCoins, setRequestedCoins] = useState('');
  const [preferredMethod, setPreferredMethod] = useState<'bank' | 'wallet'>(
    'bank',
  );
  const [isRedeeming, setIsRedeeming] = useState(false);

  const navigation = useNavigation<any>();
  const { profile } = useUser();

  const generalSettings = {
    show_temporary_message: '0',
  };
  const showHistoryNote = generalSettings?.show_temporary_message === '1';

  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (profile) {
      fetchWalletData();
    }
  }, [profile]);

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
        const items = [...response.data.items];

        items.sort(
          (a, b) =>
            new Date(a.updatedOn).getTime() - new Date(b.updatedOn).getTime(),
        );

        const mappedItems: BCoinRateHistoryItem[] = items.map((item, index) => {
          let changeType: 'up' | 'down' = 'up';
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

        setBCoinValueHistory(mappedItems.reverse());
      }
    } catch (error) {
      console.error('Error fetching B-Coin value history:', error);
    } finally {
      if (isMounted.current) setIsLoadingHistory(false);
    }
  };

  const handleRedeem = async () => {
    const redeemAmount = Number(requestedCoins);

    if (isNaN(redeemAmount) || redeemAmount <= 0) {
      Alert.alert(
        'Invalid Amount',
        'Please enter a valid amount of coins to redeem.',
      );
      return;
    }

    if (redeemAmount > (walletData?.wallet?.bCoins || 0)) {
      Alert.alert('Insufficient Balance', 'You do not have enough B-Coins.');
      return;
    }

    setIsRedeeming(true);
    try {
      const payload = {
        requestedCoins: Number(requestedCoins),
        preferredMethod: preferredMethod,
      };
      const response = await redeemBCoinsApi(payload);

      if (!isMounted.current) return;

      setShowRedeemModal(false);

      setTimeout(() => {
        if (!isMounted.current) return;

        if (response && response.success) {
          setRequestedCoins('');
          fetchWalletData();
          Alert.alert(
            'Success',
            response.message || 'Redemption request submitted successfully.',
          );
        } else {
          let title = 'Error';
          let message =
            response?.message || 'Failed to submit redemption request.';

          if (response?.status === 'PENDING_REQUEST') {
            title = 'Request Pending';
          } else if (response?.status === 'INSUFFICIENT_BALANCE') {
            title = 'Insufficient Balance';
          }

          Alert.alert(title, message);
        }
      }, 500);
    } catch (error) {
      console.error('Redemption error:', error);
      if (isMounted.current) {
        setShowRedeemModal(false);
        setTimeout(() => {
          if (!isMounted.current) return;
          Alert.alert(
            'Error',
            'An error occurred while processing your request.',
          );
        }, 500);
      }
      if (isMounted.current) setIsRedeeming(false);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ImageBackground
        style={styles.backgroundImageStyle}
        source={require('../../assets/images/bcoinscreen.png')}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AppIcons.Back size={wp('6%')} color={colors.themeWhite} />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: colors.themeWhite }]}>
            B-Coin and B-token
          </Text>
        </View>

        <View style={{ flex: 1, marginTop: hp('25%') }}>
          <View style={styles.unifiedCard}>
            <View style={styles.cardRow}>
              <Image
                source={require('../../assets/images/bcoinnew.png')}
                style={styles.coinIcon}
              />
              <Text style={styles.cardTitle}>B-Coin</Text>
              <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>Available balance : </Text>
                <View style={styles.balancePill}>
                  <Text style={styles.balanceValue}>
                    {walletData?.wallet?.bCoins || '0'}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                fetchBCoinValueHistory();
                setShowModal(true);
              }}
              style={styles.valueRow}
            >
              <Text style={styles.valueLabel}>Today’s B-coin value : </Text>
              <Text style={styles.valueHighlight}>
                ₹{walletData?.wallet?.bCoinValue || '0'}
              </Text>
              <AppIcons.Forward
                size={18}
                color={colors.themeTeal}
                style={{ marginLeft: wp('2%') }}
              />
            </TouchableOpacity>

            <View style={styles.cardDivider} />

            <View style={styles.cardRow}>
              <Image
                source={require('../../assets/images/btokenn.png')}
                style={styles.coinIcon}
              />
              <Text style={styles.cardTitle}>B-Token</Text>
              <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>Available balance : </Text>
                <View style={styles.balancePill}>
                  <Text style={styles.balanceValue}>
                    {walletData?.wallet?.bTokens || '0'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>

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
                    borderBottomWidth: 4,
                    borderBottomColor: colors.themeTeal,
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
                      color: colors.themeTeal,
                    },
                  ]
                : styles.bcoinSingleText
            }
          >
            B-Coin
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelected('btoken')}
          style={
            selected === 'btoken'
              ? [
                  styles.bcoinSingleContainer,
                  {
                    borderBottomWidth: 4,
                    borderBottomColor: colors.themeTeal,
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
                      color: colors.themeTeal,
                    },
                  ]
                : styles.bcoinSingleText
            }
          >
            B-Token
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {(selected === 'bcoin'
          ? walletData?.bcoinHistory
          : walletData?.btokenHistory
        )?.map(
          (
            item: BCoinHistoryItem,
            index: number,
            array: BCoinHistoryItem[],
          ) => (
            <View
              key={item.historyId}
              style={[
                styles.bcoinContainer,
                {
                  borderBottomWidth: index === array.length - 1 ? 0 : 1,
                },
              ]}
            >
              {selected === 'bcoin' ? (
                <Image
                  source={require('../../assets/images/bcoinnew.png')}
                  style={styles.coinIcon}
                />
              ) : (
                <Image
                  source={require('../../assets/images/btokenn.png')}
                  style={styles.coinIcon}
                />
              )}
              <View style={{ flex: 1, marginLeft: wp('3%') }}>
                <Text style={styles.bcoinContent}>{item.description}</Text>
                <View style={{ marginTop: 5 }}>
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
          ),
        )}
        {!isLoading &&
          (!walletData ||
            (selected === 'bcoin'
              ? walletData?.bcoinHistory?.length === 0
              : walletData?.btokenHistory?.length === 0)) && (
            <View style={{ alignItems: 'center', marginTop: wp('10%') }}>
              <Text style={styles.viewText}>No history available</Text>
            </View>
          )}
      </ScrollView>
      {showHistoryNote && (
        <View
          style={[
            styles.historyNoteContainer,
            { marginHorizontal: wp('5%'), marginBottom: 10 },
          ]}
        >
          <Text style={styles.historyNoteText}>
            This app displays only the most recent transaction history
          </Text>
        </View>
      )}
      <TouchableOpacity
        onPress={() => setShowRedeemModal(true)}
        style={styles.redeemButton}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={['#F25000', '#FF6A00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.redeemGradient}
        >
          <Text style={styles.redeemText}>Redeem B-Coin</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Modal visible={showRedeemModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeaderContainer}>
              <Text style={styles.modalHeaderText}>Redeem B-Coin</Text>
              <TouchableOpacity onPress={() => setShowRedeemModal(false)}>
                <AppIcons.Close size={wp('6%')} color={colors.themeBlack} />
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: wp('5%') }}>
              <Text style={styles.availableBalanceHeaderText}>
                Requested Coins
              </Text>
              <TextInput
                style={styles.redeemInput}
                placeholder="Enter requested B-Coin"
                placeholderTextColor="#AAAAAA"
                keyboardType="numeric"
                value={requestedCoins}
                onChangeText={setRequestedCoins}
              />

              <Text
                style={[styles.availableBalanceHeaderText, { marginTop: 20 }]}
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
                  { marginTop: 30, width: '100%', marginBottom: 20 },
                ]}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#F25000', '#FF6A00']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.redeemGradient}
                >
                  {isRedeeming ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.redeemText}>Submit Request</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeaderContainer}>
              <Text style={styles.modalHeaderText}>B-Coin rate history</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <AppIcons.Close size={wp('6%')} color={colors.themeBlack} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {isLoadingHistory ? (
                <ActivityIndicator
                  size="large"
                  color={colors.themeTeal}
                  style={{ marginTop: 30 }}
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
                                ? colors.red
                                : colors.green,
                          },
                        ]}
                      >
                        ₹
                        {item.bCoinValue?.toFixed(2) ||
                          item.newValue ||
                          item.value ||
                          0}
                      </Text>
                      {item.changeType === 'down' ? (
                        <AppIcons.ArrowDown
                          size={wp('4%')}
                          color={colors.red}
                        />
                      ) : (
                        <AppIcons.ArrowUp
                          size={wp('4%')}
                          color={colors.green}
                        />
                      )}
                    </View>
                  </View>
                ))
              ) : (
                <View style={{ alignItems: 'center', marginTop: 30 }}>
                  <Text style={styles.viewText}>No history available</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default BCoinScreen;

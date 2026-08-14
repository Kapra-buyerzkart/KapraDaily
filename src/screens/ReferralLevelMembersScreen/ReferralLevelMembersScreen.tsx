import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ListRenderItemInfo,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  NavigationProp,
} from '@react-navigation/native';
import icons from '@/assets/icons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useReferralLevelMembersScreen } from './useReferralLevelMembersScreen';
import styles from './styles';
import BallPulse from '@/components/BallPulse';

export interface ReferralLevelMember {
  custId: number;
  custName: string;
  phoneNo?: string;
  referralCode?: string;
  joinedAt?: string;
  currentBTokenBalance?: number;
  btEarnedForYou?: number;
  ordersThatEarnedYou?: number;
}

const formatBT = (n: number): string => {
  const rounded = Math.round(n * 100) / 100;
  const [intPart, decPart] = rounded.toString().split('.');
  const withSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decPart ? `${withSep}.${decPart}` : withSep;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  const [date] = dateString.split('T');
  const [year, month, day] = date.split('-');
  return `${day}-${month}-${year}`;
};

const extractMembers = (data: any): ReferralLevelMember[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.members)) return data.members;
  if (Array.isArray(data.items)) return data.items;
  return [];
};

const ReferralLevelMembersScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const route = useRoute<any>();
  const { levelNumber, label } = route.params ?? {};

  const { members, isLoading, error } =
    useReferralLevelMembersScreen(levelNumber);
  const memberList = extractMembers(members);

  const renderBackButton = () => (
    <TouchableOpacity
      style={styles.backButton}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={() => navigation.goBack()}
    >
      <Image
        source={icons.backArrowNew}
        style={{
          resizeMode: 'contain',
          tintColor: '#1A1A1A',
        }}
      />
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {renderBackButton()}
      <View style={styles.headerTextWrap}>
        <Text style={styles.headerTitle}>
          {label || `Level ${levelNumber}`}
        </Text>
        <Text style={styles.headerSub}>
          {memberList.length} {memberList.length === 1 ? 'member' : 'members'}
        </Text>
      </View>
    </View>
  );

  const renderMember = ({ item }: ListRenderItemInfo<ReferralLevelMember>) => (
    <View style={styles.memberRow}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {(item.custName || 'U').charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.custName || 'User'}</Text>
        <Text style={styles.memberSub}>
          Joined {formatDate(item.joinedAt)}
          {item.phoneNo ? ` · ${item.phoneNo}` : ''}
        </Text>
        {item.ordersThatEarnedYou != null && (
          <Text style={styles.memberSub}>
            {item.ordersThatEarnedYou}{' '}
            {item.ordersThatEarnedYou === 1 ? 'order' : 'orders'} earned you BT
          </Text>
        )}
      </View>
      {item.btEarnedForYou != null && (
        <View style={styles.memberRight}>
          <Text style={styles.memberBt}>
            {formatBT(item.btEarnedForYou)} UD
          </Text>
          <Text style={styles.memberBtLabel}>earned for you</Text>
        </View>
      )}
    </View>
  );

  if (isLoading && !members) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {renderHeader()}
        <View style={[styles.container, styles.centered]}>
          <BallPulse color="#1A1A1A" />
        </View>
      </View>
    );
  }

  if (error && !members) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {renderHeader()}
        <View style={[styles.container, styles.centered]}>
          <Text style={styles.errorText}>Failed to load members</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {renderHeader()}
      <FlatList
        data={memberList}
        keyExtractor={(item, index) => `M${item.custId ?? index}`}
        renderItem={renderMember}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No members found at this level</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ReferralLevelMembersScreen;

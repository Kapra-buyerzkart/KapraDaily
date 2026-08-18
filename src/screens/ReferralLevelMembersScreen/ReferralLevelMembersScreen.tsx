import React from 'react';
import { View, FlatList, StatusBar, ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  NavigationProp,
} from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import { entrance } from '@/styles/motion';
import AffiliateMessage from '@/screens/MyAffilateScreen/molecules/AffiliateMessage';
import { useReferralLevelMembersScreen } from './useReferralLevelMembersScreen';
import { extractMembers } from './utils';
import MembersHeader from './organisms/MembersHeader';
import MemberCard from './molecules/MemberCard';
import { styles } from './styles';

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

const ReferralLevelMembersScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const route = useRoute<any>();
  const { levelNumber, label } = route.params ?? {};

  const { members, isLoading, error } =
    useReferralLevelMembersScreen(levelNumber);
  const memberList: ReferralLevelMember[] = extractMembers(members);

  const renderShell = (children: React.ReactNode) => (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <MembersHeader
          onBack={() => navigation.goBack()}
          levelNumber={levelNumber}
          label={label}
          countLabel={
            members
              ? `${memberList.length} ${
                  memberList.length === 1 ? 'member' : 'members'
                }`
              : ''
          }
        />
      </View>

      {children}
    </View>
  );

  if (isLoading && !members) {
    return renderShell(<AffiliateMessage loading />);
  }

  if (error && !members) {
    return renderShell(
      <AffiliateMessage
        title="Couldn’t load members"
        message="Check your connection and try again in a moment."
      />,
    );
  }

  const renderMember = ({
    item,
    index,
  }: ListRenderItemInfo<ReferralLevelMember>) => (
    <Animated.View entering={entrance(Math.min(index, 4))}>
      <MemberCard member={item} />
    </Animated.View>
  );

  return renderShell(
    <FlatList
      data={memberList}
      keyExtractor={(item, index) => `M${item.custId ?? index}`}
      renderItem={renderMember}
      contentContainerStyle={[
        styles.listContent,
        { paddingBottom: insets.bottom + 24 },
      ]}
      ListEmptyComponent={
        <AffiliateMessage
          title="No members yet"
          message="Members who join at this level will show up here with the UD they earn you."
        />
      }
      showsVerticalScrollIndicator={false}
    />,
  );
};

export default ReferralLevelMembersScreen;

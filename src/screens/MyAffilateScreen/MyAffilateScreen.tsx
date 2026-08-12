import React from 'react';
import { View, FlatList, StatusBar, ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import { entrance } from '@/styles/motion';
import { useMyAffilateScreen } from './useMyAffilateScreen';
import { styles } from './styles';
import AffiliateHeader from './organisms/AffiliateHeader';
import NetworkSummaryCard from './organisms/NetworkSummaryCard';
import LevelRow from './molecules/LevelRow';
import AffiliateEmptyState from './molecules/AffiliateEmptyState';
import AffiliateMessage from './molecules/AffiliateMessage';
import type { ReferralLevel, ReferralLevelSummary } from './types';

export type { ReferralLevel, ReferralLevelSummary, ReferralSummary } from './types';

const MyAffilateScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const { networkLevels, isLoading, error } = useMyAffilateScreen();
  const data = networkLevels as ReferralLevelSummary | null;

  const renderShell = (children: React.ReactNode) => (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <AffiliateHeader
          onBack={() => navigation.goBack()}
          levelsLabel={data ? `${data.totalLevels} levels` : ''}
        />
      </View>

      {children}
    </View>
  );

  if (isLoading && !data) {
    return renderShell(<AffiliateMessage loading />);
  }

  if (error && !data) {
    return renderShell(
      <AffiliateMessage
        title="Couldn’t load your network"
        message="Check your connection and try again in a moment."
      />,
    );
  }

  if (!data) {
    return renderShell(<AffiliateEmptyState />);
  }

  const { totalLevels, levels, summary } = data;

  const renderLevel = ({ item, index }: ListRenderItemInfo<ReferralLevel>) => (
    <Animated.View entering={entrance(Math.min(index + 1, 4))}>
      <LevelRow
        level={item}
        onPress={() =>
          navigation.navigate('ReferralLevelMembersScreen', {
            levelNumber: item.levelNumber,
            label: item.label,
          })
        }
      />
    </Animated.View>
  );

  return renderShell(
    levels?.length === 0 ? (
      <AffiliateEmptyState />
    ) : (
      <FlatList
        data={levels}
        keyExtractor={level => `L${level.levelNumber}`}
        renderItem={renderLevel}
        ListHeaderComponent={
          <Animated.View entering={entrance(0)} style={styles.summaryBlock}>
            <NetworkSummaryCard summary={summary} totalLevels={totalLevels} />
          </Animated.View>
        }
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      />
    ),
  );
};

export default MyAffilateScreen;

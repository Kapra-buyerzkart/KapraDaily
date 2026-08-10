import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ListRenderItemInfo,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useMyAffilateScreen } from './useMyAffilateScreen';
import styles from './styles';
import images from '@/assets/images';
import icons from '@/assets/icons';
import { hp } from '@/styles/cartTheme';
import { FONTS } from '@/styles/typography';

export interface ReferralLevel {
  levelNumber: number;
  memberCount: number;
  totalBTEarned: number;
  hasMembers: boolean;
  label: string;
}

export interface ReferralSummary {
  totalMembers: number;
  totalBTEarned: number;
  filledLevels: number;
  emptyLevels: number;
}

export interface ReferralLevelSummary {
  custId: number;
  totalLevels: number;
  levels: ReferralLevel[];
  summary: ReferralSummary;
}

const formatBT = (n: number): string => {
  const rounded = Math.round(n * 100) / 100;
  const [intPart, decPart] = rounded.toString().split('.');
  const withSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decPart ? `${withSep}.${decPart}` : withSep;
};

const ORDINALS = ['', '1st', '2nd', '3rd'];
const levelLabel = (levelNumber: number): string => {
  if (levelNumber === 1) return 'Direct referrals';
  const ord = ORDINALS[levelNumber] ?? `${levelNumber}th`;
  return `${ord} level`;
};

const MyAffilateScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const { networkLevels, isLoading, error } = useMyAffilateScreen();
  const data = networkLevels as ReferralLevelSummary | null;

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

  const renderEmpty = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: hp('20%'),
        }}
      >
        <Image source={images.noAffliate}></Image>
        <Text style={styles.afliatTextStyle}>Affiliate is empty</Text>
      </View>
    );
  };
  if (isLoading && !data) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>{renderBackButton()}</View>
        <View style={[styles.container, styles.centered]}>
          <ActivityIndicator color="#1A1A1A" />
        </View>
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>{renderBackButton()}</View>
        <View style={[styles.container, styles.centered]}>
          <Text style={styles.errorText}>Failed to load network levels</Text>
        </View>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>{renderBackButton()}</View>
      </View>
    );
  }

  const { totalLevels, levels, summary } = data;

  const renderHeader = () => (
    <View>
      <View style={styles.summaryStrip}>
        <View style={styles.sumCard}>
          <Text style={styles.sumLabel}>Total members</Text>
          <Text style={styles.sumVal}>{summary.totalMembers}</Text>
        </View>
        <View style={[styles.sumCard, styles.sumCardAccent]}>
          <Text style={styles.sumLabel}>BT earned</Text>
          <Text style={styles.sumVal}>{formatBT(summary.totalBTEarned)}</Text>
        </View>
        <View style={styles.sumCard}>
          <Text style={styles.sumLabel}>Active levels</Text>
          <Text style={styles.sumVal}>
            {summary.filledLevels}/{totalLevels}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderLevel = ({ item }: ListRenderItemInfo<ReferralLevel>) => {
    const filled = item.hasMembers;

    if (!filled) {
      return (
        <View style={[styles.levelRow, styles.levelRowEmpty]}>
          <View style={styles.levelMain}>
            <View style={[styles.levelBadge, styles.levelBadgeEmpty]}>
              <Text style={styles.levelBadgeEmptyText}>{item.label}</Text>
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelNameEmpty}>
                Level {item.levelNumber}
              </Text>
              <Text style={styles.levelDescEmpty}>No members yet</Text>
            </View>
            <View style={styles.levelRight}>
              <Text style={styles.levelCountEmpty}>—</Text>
            </View>
          </View>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={[styles.levelRow, styles.levelRowFilled]}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`View level ${item.levelNumber} members`}
        onPress={() =>
          navigation.navigate('ReferralLevelMembersScreen', {
            levelNumber: item.levelNumber,
            label: item.label,
          })
        }
      >
        <View style={styles.levelMain}>
          <View style={[styles.levelBadge, styles.levelBadgeFilled]}>
            <Text style={styles.levelBadgeFilledText}>{item.label}</Text>
          </View>
          <View style={styles.levelInfo}>
            <Text style={styles.levelName}>
              Level {item.levelNumber} · {levelLabel(item.levelNumber)}
            </Text>
            <Text style={styles.levelDesc}>
              {item.memberCount} {item.memberCount === 1 ? 'member' : 'members'}
            </Text>
          </View>
          <View style={styles.levelRight}>
            <Text style={styles.levelCount}>
              {item.memberCount}{' '}
              <Text style={styles.levelCountUnit}>people</Text>
            </Text>
            <Text style={styles.levelBt}>
              {formatBT(item.totalBTEarned)} UD
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        {renderBackButton()}
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>My network</Text>
          <Text style={styles.headerSub}>Referral commission overview</Text>
        </View>
      </View>

      {levels?.length === 0 ? (
        renderEmpty()
      ) : (
        <FlatList
          data={levels}
          keyExtractor={l => `L${l.levelNumber}`}
          renderItem={renderLevel}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default MyAffilateScreen;

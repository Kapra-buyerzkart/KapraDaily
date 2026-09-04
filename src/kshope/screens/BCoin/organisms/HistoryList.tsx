import React, { useCallback } from 'react';
import { RefreshControl, SectionList, StyleSheet, View } from 'react-native';

import { Divider } from '../../../components/atoms';
import {
  HistoryEmpty,
  HistoryRow,
  HistorySkeleton,
  SectionLabel,
} from '../molecules';
import { HistoryItem, HistorySection } from '../utils';
import { GUTTER, PALETTE, SPACING } from '../theme';

const rowPosition = (index: number, count: number) => {
  if (count === 1) return 'single' as const;
  if (index === 0) return 'top' as const;
  if (index === count - 1) return 'bottom' as const;
  return 'middle' as const;
};

interface HistoryListProps {
  sections: HistorySection[];
  isCoin: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  bottomPadding: number;
}

const HistoryList: React.FC<HistoryListProps> = ({
  sections,
  isCoin,
  isLoading,
  isRefreshing,
  onRefresh,
  bottomPadding,
}) => {
  const renderItem = useCallback(
    ({
      item,
      index,
      section,
    }: {
      item: HistoryItem;
      index: number;
      section: HistorySection;
    }) => (
      <HistoryRow
        item={item}
        isCoin={isCoin}
        position={rowPosition(index, section.data.length)}
      />
    ),
    [isCoin],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: HistorySection }) => (
      <SectionLabel title={section.title} />
    ),
    [],
  );

  const renderSeparator = useCallback(
    ({ leadingItem, section }: any) =>
      section.data[section.data.length - 1] === leadingItem ? null : (
        <View style={styles.separatorWrap}>
          <Divider />
        </View>
      ),
    [],
  );

  const renderEmpty = useCallback(
    () => (isLoading ? <HistorySkeleton /> : <HistoryEmpty isCoin={isCoin} />),
    [isCoin, isLoading],
  );

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item, index) => String(item.historyId ?? index)}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      ItemSeparatorComponent={renderSeparator}
      ListEmptyComponent={renderEmpty}
      stickySectionHeadersEnabled
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }]}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={[PALETTE.textSecondary]}
          tintColor={PALETTE.textSecondary}
        />
      }
    />
  );
};

export default React.memo(HistoryList);

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  separatorWrap: {
    marginHorizontal: GUTTER,
    paddingHorizontal: SPACING.lg,
    backgroundColor: PALETTE.surface,
  },
});

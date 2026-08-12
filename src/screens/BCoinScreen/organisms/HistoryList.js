import React, { useCallback } from 'react';
import { RefreshControl, SectionList, StyleSheet, View } from 'react-native';
import { CART_SPACING } from '@/styles/cartTheme';

import { CoinDivider } from '../atoms';
import {
  HistoryEmpty,
  HistoryRow,
  HistorySkeleton,
  SectionLabel,
} from '../molecules';
import { GUTTER, PALETTE } from '../theme';

const rowPosition = (index, count) => {
  if (count === 1) return 'single';
  if (index === 0) return 'top';
  if (index === count - 1) return 'bottom';
  return 'middle';
};

const HistoryList = ({
  sections,
  isCoin,
  isLoading,
  isRefreshing,
  onRefresh,
  bottomPadding,
}) => {
  const renderItem = useCallback(
    ({ item, index, section }) => (
      <HistoryRow
        item={item}
        isCoin={isCoin}
        position={rowPosition(index, section.data.length)}
      />
    ),
    [isCoin],
  );

  const renderSectionHeader = useCallback(
    ({ section }) => <SectionLabel title={section.title} />,
    [],
  );

  const renderSeparator = useCallback(
    ({ leadingItem, section }) =>
      section.data[section.data.length - 1] === leadingItem ? null : (
        <View style={styles.separatorWrap}>
          <CoinDivider />
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

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  separatorWrap: {
    marginHorizontal: GUTTER,
    paddingHorizontal: CART_SPACING.lg,
    backgroundColor: PALETTE.surface,
  },
});

export default React.memo(HistoryList);

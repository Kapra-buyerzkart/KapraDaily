import React, { useCallback } from 'react';
import { RefreshControl, SectionList, StyleSheet, Text, View } from 'react-native';
import { FONTS } from '@/styles/typography';

import HistoryRow from './HistoryRow';
import { HistoryEmpty, HistorySkeleton } from './HistoryStates';
import { PALETTE } from '../theme';

const HistoryList = ({
  sections,
  isCoin,
  isLoading,
  isRefreshing,
  onRefresh,
  bottomPadding,
}) => {
  const renderItem = useCallback(
    ({ item }) => <HistoryRow item={item} isCoin={isCoin} />,
    [isCoin],
  );

  const renderSectionHeader = useCallback(
    ({ section }) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
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
      ListEmptyComponent={renderEmpty}
      stickySectionHeadersEnabled
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: bottomPadding },
        sections.length === 0 && styles.contentEmpty,
      ]}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={[PALETTE.orange]}
          tintColor={PALETTE.orange}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: 6,
    flexGrow: 1,
  },
  contentEmpty: {
    justifyContent: 'flex-start',
  },
  sectionHeader: {
    paddingHorizontal: '4%',
    paddingVertical: 8,
    backgroundColor: PALETTE.surface,
  },
  sectionTitle: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: 11,
    letterSpacing: 1.1,
    color: PALETTE.textMuted,
  },
});

export default React.memo(HistoryList);

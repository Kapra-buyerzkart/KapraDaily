import { View, RefreshControl } from 'react-native';
import React, { useCallback } from 'react';
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import { ACCENT } from '@/styles/homeTheme';
import { styles } from '../../styles';
import { entrance } from '../../motion';
import { SKELETON_COUNT } from '../../constants';
import SectionLabel from '../atoms/SectionLabel';
import TicketCard from '../molecules/TicketCard';
import TicketCardSkeleton from '../molecules/TicketCardSkeleton';
import TicketsEmptyState from '../molecules/TicketsEmptyState';
import RaiseTicketCTA from '../molecules/RaiseTicketCTA';

export default function TicketList({
  tickets,
  isLoading,
  isFirstLoad,
  onRefresh,
  onRaise,
  onOpenTicket,
  scrollY,
}) {
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const renderItem = useCallback(
    ({ item, index }) => (
      <TicketCard
        item={item}
        index={index}
        onPress={() => onOpenTicket(item.supportId)}
      />
    ),
    [onOpenTicket],
  );

  const listHeader = useCallback(
    () => (
      <>
        <Animated.View entering={entrance(0)}>
          <RaiseTicketCTA onPress={onRaise} />
        </Animated.View>
        {isFirstLoad || tickets.length > 0 ? (
          <SectionLabel title="Your tickets" count={tickets.length} />
        ) : null}
      </>
    ),
    [onRaise, isFirstLoad, tickets.length],
  );

  const listEmpty = useCallback(
    () =>
      isFirstLoad ? (
        <View>
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <TicketCardSkeleton key={index} />
          ))}
        </View>
      ) : (
        <TicketsEmptyState onRaise={onRaise} />
      ),
    [isFirstLoad, onRaise],
  );

  return (
    <Animated.FlatList
      data={tickets}
      keyExtractor={item => String(item.supportId)}
      renderItem={renderItem}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={listHeader}
      ListEmptyComponent={listEmpty}
      refreshControl={
        <RefreshControl
          refreshing={isLoading && !isFirstLoad}
          onRefresh={onRefresh}
          tintColor={ACCENT.primary}
          colors={[ACCENT.primary]}
        />
      }
    />
  );
}

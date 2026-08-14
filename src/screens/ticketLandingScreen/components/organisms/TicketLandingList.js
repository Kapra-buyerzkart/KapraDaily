import React, { useCallback, useMemo } from 'react';
import { Animated, RefreshControl } from 'react-native';
import Reanimated from 'react-native-reanimated';
import EventHeader from '@/components/events/EventHeader';
import EventCard from '@/components/events/EventCard';
import LoadingSkeleton from '@/components/events/LoadingSkeleton';
import EventCategoryTabs, {
  TAB_IDS,
} from '@/components/events/EventCategoryTabs';
import EmptyState from '@/components/events/EmptyState';
import {
  EMPTY_COPY,
  EVENTS_ICON,
  LIST_ITEM_TYPES,
  STICKY_INDICES,
} from '../../constants';
import { COLORS } from '../../theme';
import TabContent from './TabContent';
import styles from '../../styles';

const TicketLandingList = ({
  navigation,
  insets,
  profile,
  activeTab,
  handleTabChange,
  popularCategories,
  scrollY,
  scrollHandler,
  tabContentStyle,
  events,
  eventsLoading,
  handleEventPress,
  tabContentProps,
  refreshing,
  onRefresh,
}) => {
  const listData = useMemo(() => {
    const base = [
      { type: LIST_ITEM_TYPES.HEADER },
      { type: LIST_ITEM_TYPES.TABS },
    ];
    if (activeTab === TAB_IDS.EVENTS) {
      if (eventsLoading)
        return [...base, { type: LIST_ITEM_TYPES.EVENTS_LOADING }];
      if (events.length > 0) {
        return [
          ...base,
          ...events.map((event, index) => ({
            type: LIST_ITEM_TYPES.EVENT,
            event,
            index,
          })),
        ];
      }
      return [...base, { type: LIST_ITEM_TYPES.EVENTS_EMPTY }];
    }
    return [...base, { type: LIST_ITEM_TYPES.TAB_CONTENT }];
  }, [activeTab, eventsLoading, events]);

  const keyExtractor = useCallback((item, index) => {
    if (item.type === LIST_ITEM_TYPES.EVENT) {
      return `event-${item.event?.eventId ?? item.event?.id ?? index}`;
    }
    return `${item.type}-${index}`;
  }, []);

  const renderItem = useCallback(
    ({ item }) => {
      switch (item.type) {
        case LIST_ITEM_TYPES.HEADER:
          return (
            <EventHeader
              navigation={navigation}
              insets={insets}
              profile={profile}
            />
          );
        case LIST_ITEM_TYPES.TABS:
          return (
            <EventCategoryTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              categories={popularCategories}
              scrollY={scrollY}
              insets={insets}
            />
          );
        case LIST_ITEM_TYPES.EVENT:
          return (
            <Animated.View style={tabContentStyle}>
              <EventCard
                item={item.event}
                onPress={handleEventPress}
                index={item.index}
              />
            </Animated.View>
          );
        case LIST_ITEM_TYPES.EVENTS_LOADING:
          return (
            <Animated.View style={tabContentStyle}>
              <LoadingSkeleton count={3} />
            </Animated.View>
          );
        case LIST_ITEM_TYPES.EVENTS_EMPTY:
          return (
            <Animated.View style={tabContentStyle}>
              <EmptyState
                icon={EVENTS_ICON}
                title={EMPTY_COPY.events.title}
                subtitle={EMPTY_COPY.events.subtitle}
              />
            </Animated.View>
          );
        case LIST_ITEM_TYPES.TAB_CONTENT:
        default:
          return (
            <Animated.View style={tabContentStyle}>
              <TabContent activeTab={activeTab} {...tabContentProps} />
            </Animated.View>
          );
      }
    },
    [
      navigation,
      insets,
      profile,
      activeTab,
      handleTabChange,
      popularCategories,
      scrollY,
      tabContentStyle,
      handleEventPress,
      tabContentProps,
    ],
  );

  return (
    <Reanimated.FlatList
      data={listData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={STICKY_INDICES}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.refresh}
          colors={[COLORS.refresh]}
        />
      }
    />
  );
};

export default TicketLandingList;

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
import TabContent from './TabContent';
import styles from '../styles';

const EVENTS_ICON = require('../../../assets/events/Group 1000004805.png');

const STICKY_INDICES = [1];

const TicketLandingList = ({
  navigation,
  insets,
  bCoins,
  activeTab,
  handleTabChange,
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
    const base = [{ type: 'header' }, { type: 'tabs' }];
    if (activeTab === TAB_IDS.EVENTS) {
      if (eventsLoading) return [...base, { type: 'events-loading' }];
      if (events.length > 0) {
        return [
          ...base,
          ...events.map((event, index) => ({ type: 'event', event, index })),
        ];
      }
      return [...base, { type: 'events-empty' }];
    }
    return [...base, { type: 'tab-content' }];
  }, [activeTab, eventsLoading, events]);

  const keyExtractor = useCallback((item, index) => {
    if (item.type === 'event') {
      console.log(item.event, 'item event loading here=====>');
      return `event-${item.event?.eventId ?? item.event?.id ?? index}`;
    }
    return `${item.type}-${index}`;
  }, []);

  const renderItem = useCallback(
    ({ item }) => {
      switch (item.type) {
        case 'header':
          return (
            <EventHeader
              navigation={navigation}
              insets={insets}
              bCoins={bCoins}
            />
          );
        case 'tabs':
          return (
            <EventCategoryTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              scrollY={scrollY}
              insets={insets}
            />
          );
        case 'event':
          return (
            <Animated.View style={tabContentStyle}>
              <EventCard
                item={item.event}
                onPress={handleEventPress}
                index={item.index}
              />
            </Animated.View>
          );
        case 'events-loading':
          return (
            <Animated.View style={tabContentStyle}>
              <LoadingSkeleton count={3} />
            </Animated.View>
          );
        case 'events-empty':
          return (
            <Animated.View style={tabContentStyle}>
              <EmptyState
                icon={EVENTS_ICON}
                title="No events found"
                subtitle="There are no events available right now. Please check back later."
              />
            </Animated.View>
          );
        case 'tab-content':
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
      bCoins,
      activeTab,
      handleTabChange,
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
          tintColor="#ff6600ff"
          colors={['#ff6600ff']}
        />
      }
    />
  );
};

export default TicketLandingList;

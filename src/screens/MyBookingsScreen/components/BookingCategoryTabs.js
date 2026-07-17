import React, { useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export const BOOKING_TAB_IDS = {
  ALL: 'all',
  EVENTS: 'events',
  VOUCHERS: 'vouchers',
  SPORTS: 'sports',
  POPULAR: 'popular',
};

const TABS = [
  { id: BOOKING_TAB_IDS.ALL, label: 'All' },
  { id: BOOKING_TAB_IDS.EVENTS, label: 'Events' },
  { id: BOOKING_TAB_IDS.VOUCHERS, label: 'Vouchers' },
  { id: BOOKING_TAB_IDS.SPORTS, label: 'Sports' },
  { id: BOOKING_TAB_IDS.POPULAR, label: 'Popular' },
];

const BookingTab = React.memo(({ tab, isActive, onPress }) => {
  const handlePress = useCallback(() => onPress(tab.id), [onPress, tab.id]);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={styles.tab}
    >
      <Text
        style={[styles.label, isActive && styles.labelActive]}
        numberOfLines={1}
      >
        {tab.label}
      </Text>
      <View style={[styles.indicator, isActive && styles.indicatorActive]} />
    </TouchableOpacity>
  );
});

const BookingCategoryTabs = ({ activeTab, onTabChange }) => (
  <View style={styles.container}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {TABS.map(tab => (
        <BookingTab
          key={tab.id}
          tab={tab}
          isActive={activeTab === tab.id}
          onPress={onTabChange}
        />
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  content: {
    paddingHorizontal: 30,
    paddingTop: 10,
    gap: 28,
  },
  tab: {
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Gilroy-Medium',
    color: 'rgba(255,255,255,0.45)',
  },
  labelActive: {
    color: '#FFFFFF',
    fontFamily: 'Gilroy-SemiBold',
  },
  indicator: {
    alignSelf: 'stretch',
    height: 3,
    borderRadius: 2,
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  indicatorActive: {
    backgroundColor: '#9A5CFF',
  },
});

export default React.memo(BookingCategoryTabs);

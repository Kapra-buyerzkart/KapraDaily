import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import icons from '../../../../assets/icons';
import { COLORS } from '../../theme';
import { TabBarItem } from '../molecules';

const BottomTabBar = ({
  bookingsCount = 0,
  onHomePress,
  onMyBookingsPress,
  onStorePress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}
    >
      <View style={styles.row}>
        <TabBarItem
          icon={icons.hometicket}
          label="Home"
          onPress={onHomePress}
        />

        <TabBarItem
          icon={icons.calendarticket}
          label="My bookings"
          badgeCount={bookingsCount}
          onPress={onMyBookingsPress}
        />

        <TabBarItem
          icon={icons.storeticketStore}
          label="Store"
          iconStyle={styles.storeImage}
          onPress={onStorePress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.tabBar,
    borderTopWidth: 1,
    borderTopColor: COLORS.tabBarBorder,
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeImage: {},
});

export default React.memo(BottomTabBar);

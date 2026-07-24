import React from 'react';
import { Text, TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import icons from '../../../assets/icons';

const HOME_PURPLE = '#7C3AED';

const ICON_SIZE = wp('6.12%');

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
        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.8}
          onPress={onHomePress}
        >
          <Image
            source={icons.hometicket}
            style={styles.tabImage}
            resizeMode="contain"
          />
          <Text style={styles.label}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.8}
          onPress={onMyBookingsPress}
        >
          <View>
            <Image
              source={icons.calendarticket}
              style={styles.tabImage}
              resizeMode="contain"
            />
            {bookingsCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText} numberOfLines={1}>
                  {bookingsCount > 99 ? '99+' : bookingsCount}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.label}>My bookings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.8}
          onPress={onStorePress}
        >
          <Image
            source={icons.storeticketStore}
            style={styles.storeImage}
            resizeMode="contain"
          />
          <Text style={styles.label}>Store</Text>
        </TouchableOpacity>
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
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  label: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: 'Gilroy-Medium',
    color: '#FFFFFF',
  },
  tabImage: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  storeImage: {
    // width: ICON_SIZE,
    // height: ICON_SIZE,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    backgroundColor: HOME_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 9,
    fontFamily: 'Gilroy-Bold',
    color: '#FFFFFF',
    lineHeight: 11,
  },
});

export default React.memo(BottomTabBar);

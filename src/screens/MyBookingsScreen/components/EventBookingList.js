import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import images from '@/assets/images';
import EventBookingCard from './EventBookingCard';
import EventBookingSkeleton from './EventBookingSkeleton';

const keyExtractor = (item, index) =>
  String(item?.bookingId || item?.id || index);

const EventBookingList = ({
  bookings = [],
  loading = false,
  loadingMore = false,
  onEndReached,
  bottomInset = 0,
  refreshing = false,
  onRefresh,
}) => {
  const renderItem = useCallback(
    ({ item, index }) => <EventBookingCard item={item} index={index} />,
    [],
  );

  if (loading) {
    return (
      <View style={styles.list}>
        <EventBookingSkeleton />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={bookings}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: bottomInset + 20 },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#9A5CFF"
            colors={['#9A5CFF']}
            progressBackgroundColor="#1A1A1A"
          />
        ) : undefined
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator color="#9A5CFF" style={styles.footer} />
        ) : null
      }
      ListEmptyComponent={
        <View style={styles.centered}>
          <Image
            source={images.no_vocher_booking}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyText}>No event bookings yet</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  emptyImage: {
    width: 152,
    height: 103,
  },
  footer: {
    paddingVertical: 16,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'Gilroy-Regular',
    fontSize: 14,
  },
});

export default React.memo(EventBookingList);

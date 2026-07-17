import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import EventBookingCard from './EventBookingCard';

const AllTabListHeader = ({ eventBookings = [] }) => (
  <View>
    {eventBookings.length > 0 && (
      <>
        <Text style={styles.sectionTitle}>Events</Text>
        {eventBookings.map((booking, index) => (
          <EventBookingCard
            key={String(booking?.bookingId || booking?.id || index)}
            item={booking}
            index={index}
          />
        ))}
      </>
    )}
    <Text style={styles.sectionTitle}>Vouchers</Text>
  </View>
);

const styles = StyleSheet.create({
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Gilroy-Bold',
    marginBottom: 12,
  },
});

export default React.memo(AllTabListHeader);

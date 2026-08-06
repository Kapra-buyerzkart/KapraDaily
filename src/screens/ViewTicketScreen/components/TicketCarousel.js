import React, { useCallback, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated from 'react-native-reanimated';
import ConcertTicket from '../../../components/ConcertTicket';
import { wp, hp } from '../../../utils/responsive';
const TicketCarousel = ({ tickets, entranceStyle, onQrPress }) => {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const isCarousel = tickets.length > 1;

  const onMomentumScrollEnd = useCallback(
    e => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / width);
      setActiveIndex(Math.max(0, Math.min(idx, tickets.length - 1)));
    },
    [width, tickets.length],
  );

  const renderItem = useCallback(
    ({ item, index }) => (
      <View style={[styles.page, { width }]}>
        <ConcertTicket
          {...item}
          showScanLine={index === activeIndex}
          onQrPress={() => onQrPress(index)}
        />
      </View>
    ),
    [width, activeIndex, onQrPress],
  );

  if (tickets.length === 0) {
    return (
      <Animated.View style={[styles.ticketArea, styles.empty, entranceStyle]}>
        <Text style={styles.emptyTitle}>No tickets available</Text>
        <Text style={styles.emptySubtitle}>
          Your tickets for this booking will appear here once they're issued.
        </Text>
      </Animated.View>
    );
  }

  return (
    <>
      <Animated.View style={[styles.ticketArea, entranceStyle]}>
        <FlatList
          data={tickets}
          keyExtractor={(item, i) => item.id ?? item.ticketId ?? String(i)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          style={styles.carousel}
          renderItem={renderItem}
        />
      </Animated.View>

      {isCarousel && (
        <View style={styles.pager}>
          <View style={styles.dots}>
            {tickets.map((item, i) => (
              <View
                key={item.id ?? item.ticketId ?? i}
                style={[styles.dot, i === activeIndex && styles.dotActive]}
              />
            ))}
          </View>
          <Text style={styles.counter}>
            {activeIndex + 1} of {tickets.length}
          </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  ticketArea: {
    flex: 1,
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingHorizontal: wp(10),
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Gilroy-Bold',
    color: '#FFFFFF',
    marginBottom: hp(1),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Gilroy-Medium',
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
  carousel: {
    flex: 1,
    marginHorizontal: -wp(5),
  },
  page: {
    justifyContent: 'center',
    paddingHorizontal: wp(5),
  },
  pager: {
    alignItems: 'center',
    marginTop: hp(1.5),
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    width: 20,
    backgroundColor: '#F25000',
  },
  counter: {
    marginTop: hp(1),
    fontSize: 13,
    fontFamily: 'Gilroy-Medium',
    color: 'rgba(255,255,255,0.75)',
  },
});

export default TicketCarousel;

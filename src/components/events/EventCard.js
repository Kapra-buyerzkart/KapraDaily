import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getVoucherImageSource } from './imageUtils';

const EventCard = ({ item, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.9}
    style={styles.card}
    onPress={() => onPress?.(item)}
  >
    <Image
      source={getVoucherImageSource(item)}
      style={styles.image}
      resizeMode="cover"
    />
    <View style={styles.body}>
      <Text style={styles.title} numberOfLines={1}>
        {item?.title}
      </Text>
      <View style={styles.pillsRow}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>From ₹{item?.denomination ?? 0}</Text>
        </View>
        {!!item?.brand && (
          <View style={styles.pill}>
            <Text style={styles.pillText}>{item.brand}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  image: {
    width: '100%',
    height: 160,
  },
  body: {
    padding: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Gilroy-Bold',
    marginBottom: 8,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontFamily: 'Gilroy-Medium',
  },
});

export default EventCard;

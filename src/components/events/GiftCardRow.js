import React from 'react';
import { View, Image, Text, ScrollView, StyleSheet } from 'react-native';
import { FadeInUp } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { getVoucherImageSource } from './imageUtils';
import AnimatedPressable from '@/components/AnimatedPressable';
import { getStaggerDelay } from '@/utils/staggerDelay';
import COLORS from '@/styles/colors';
import { GIFT_CARD_BORDER_GRADIENT } from '@/styles/gradients';

const GiftCardMini = React.memo(({ item, onPress, index = 0 }) => {
  const soldOut = !item?.isActive;

  return (
    <AnimatedPressable
      style={styles.card}
      entering={FadeInUp.delay(getStaggerDelay(index))}
      disabled={soldOut}
      onPress={() => !soldOut && onPress?.(item)}
    >
      <LinearGradient
        colors={GIFT_CARD_BORDER_GRADIENT}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.inner}>
        <Image
          source={getVoucherImageSource(item)}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={1}>
            {item?.title}
          </Text>
          <Text style={styles.price}>Buy ₹{item?.denomination ?? 0}</Text>
        </View>
        {soldOut && (
          <View style={styles.soldOutOverlay}>
            <View style={styles.soldOutBadge}>
              <Text style={styles.soldOutText}>SOLD OUT</Text>
            </View>
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
});

const GiftCardRow = ({ vouchers, onPress }) => {
  if (!vouchers || vouchers.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {vouchers.map((item, index) => (
        <GiftCardMini
          key={item?.voucherId ?? index}
          item={item}
          onPress={onPress}
          index={index}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    gap: 12,
    paddingHorizontal: 20,
  },
  card: {
    width: 112,
    borderRadius: 14,
    overflow: 'hidden',
  },
  inner: {
    margin: 1.5,
    borderRadius: 12.5,
    overflow: 'hidden',
    backgroundColor: COLORS.bgGiftCard,
  },
  image: {
    width: '100%',
    height: 72,
  },
  body: {
    padding: 8,
  },
  title: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Gilroy-Bold',
  },
  price: {
    color: COLORS.uddenGiftCardtext,
    fontSize: 11,
    textAlign: 'center',

    fontFamily: 'Gilroy-SemiBold',
    marginTop: 2,
  },
  soldOutOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12.5,
  },
  soldOutBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  soldOutText: {
    color: '#FFFFFF',
    fontSize: 11,
    letterSpacing: 1,
    fontFamily: 'Gilroy-Bold',
  },
});

export default React.memo(GiftCardRow);

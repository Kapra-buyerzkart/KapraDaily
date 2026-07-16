import React from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import { FadeInUp } from 'react-native-reanimated';
import AnimatedPressable from '@/components/AnimatedPressable';
import { getStaggerDelay } from '@/utils/staggerDelay';
import CONFIG from '../../globals/config';

const { width } = Dimensions.get('window');

const toImageSource = value =>
  typeof value === 'string' ? { uri: CONFIG.image_base_url + value } : value;

const VoucherCard = ({ item, onPress, index = 0 }) => (
  <AnimatedPressable
    style={styles.card}
    entering={FadeInUp.delay(getStaggerDelay(index))}
    onPress={() => onPress(item)}
  >
    <Image
      source={toImageSource(item.imageUrl || item.image)}
      style={styles.image}
      resizeMode="cover"
    />
    <View style={styles.body}>
      <Text style={styles.title} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.desc}>₹{item.denomination} Voucher</Text>
    </View>
  </AnimatedPressable>
);

const styles = StyleSheet.create({
  card: {
    width: (width - 52) / 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 110,
  },
  body: {
    padding: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Gilroy-Bold',
    marginBottom: 4,
  },
  desc: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontFamily: 'Gilroy-Regular',
    lineHeight: 16,
  },
});

export default React.memo(VoucherCard);

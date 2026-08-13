import React from 'react';
import { View, Text, Image } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import icons from '@/assets/icons';
import styles from '../styles';
import ClaimBanner from './ClaimBanner';

const MoreToKnow = ({ ageLimit, language, onClaimPress }) => (
  <Animated.View
    entering={FadeInUp.delay(160).duration(400)}
    style={styles.section}
  >
    <Text style={styles.sectionTitle}>More to know</Text>

    <ClaimBanner onPress={onClaimPress} />

    {}

    {}
  </Animated.View>
);

export default React.memo(MoreToKnow);

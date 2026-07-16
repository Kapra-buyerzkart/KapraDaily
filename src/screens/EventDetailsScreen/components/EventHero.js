import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { FadeIn } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedPressable from '@/components/AnimatedPressable';
import COLORS from '@/styles/colors';
import styles from '../styles';

const EventHero = ({ event, insets, onBack }) => (
  <ImageBackground
    source={require('../../../assets/images/noimages/fallback.png')}
    style={styles.hero}
    imageStyle={styles.heroImage}
  >
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,0.8)']}
      style={styles.heroScrim}
      pointerEvents="none"
    />
    <View
      style={[
        styles.heroTopRow,
        { paddingTop: insets.top > 0 ? insets.top + 8 : 44 },
      ]}
    >
      <AnimatedPressable
        entering={FadeIn.delay(150)}
        onPress={onBack}
        hitSlop={16}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={22} color={COLORS.white} />
      </AnimatedPressable>
      <Text style={styles.heroTitle}>Events</Text>
    </View>
  </ImageBackground>
);

export default React.memo(EventHero);

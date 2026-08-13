import React from 'react';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import CartText from '@/screens/cart/components/atoms/CartText';
import { CART_COLORS } from '@/styles/cartTheme';
import { ICON, styles } from '../../styles';

const FailedActionBar = ({ retryLabel, homeLabel, onRetry, onHome }) => (
  <SafeAreaView edges={['bottom']} style={styles.actionBar}>
    <TouchableOpacity
      style={styles.primaryBtn}
      onPress={onRetry}
      activeOpacity={0.9}
      accessibilityRole="button"
    >
      <Feather name="refresh-cw" size={ICON.cta} color={CART_COLORS.onPrimary} />
      <CartText variant="cta" tone="onDark">
        {retryLabel}
      </CartText>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.ghostBtn}
      onPress={onHome}
      activeOpacity={0.7}
      accessibilityRole="button"
    >
      <Feather name="home" size={ICON.ghost} color={CART_COLORS.textMuted} />
      <CartText variant="bodyStrong" tone="muted">
        {homeLabel}
      </CartText>
    </TouchableOpacity>
  </SafeAreaView>
);

export default React.memo(FailedActionBar);

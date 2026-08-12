import React from 'react';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import CartText from '@/screens/cart/components/atoms/CartText';
import { CART_COLORS } from '@/styles/cartTheme';
import { ICON, styles } from '../../styles';

const PendingActionBar = ({ onTrack, onHome, onLayout }) => (
  <SafeAreaView edges={['bottom']} style={styles.actionBar} onLayout={onLayout}>
    <TouchableOpacity
      style={styles.primaryBtn}
      onPress={onTrack}
      activeOpacity={0.9}
      accessibilityRole="button"
    >
      <CartText variant="cta" tone="onDark">
        Check order status
      </CartText>
      <Feather
        name="arrow-right"
        size={ICON.cta}
        color={CART_COLORS.onPrimary}
      />
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.ghostBtn}
      onPress={onHome}
      activeOpacity={0.7}
      accessibilityRole="button"
    >
      <Feather name="home" size={ICON.ghost} color={CART_COLORS.textMuted} />
      <CartText variant="bodyStrong" tone="muted">
        Continue shopping
      </CartText>
    </TouchableOpacity>
  </SafeAreaView>
);

export default React.memo(PendingActionBar);

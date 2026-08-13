import React from 'react';
import { View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Surface from '@/screens/cart/components/atoms/Surface';
import CartText from '@/screens/cart/components/atoms/CartText';
import IconDisc from '@/screens/cart/components/atoms/IconDisc';
import { CART_COLORS } from '@/styles/cartTheme';
import { DISC, ICON, styles } from '../../styles';

const SupportCard = ({ title, subtitle }) => (
  <Surface style={styles.section}>
    <View style={styles.supportRow}>
      <IconDisc size={DISC.meta} tone="neutral">
        <Feather
          name="headphones"
          size={ICON.meta}
          color={CART_COLORS.textSecondary}
        />
      </IconDisc>
      <View style={styles.supportCopy}>
        <CartText variant="labelStrong">{title}</CartText>
        <CartText variant="caption" tone="muted">
          {subtitle}
        </CartText>
      </View>
    </View>
  </Surface>
);

export default React.memo(SupportCard);

import React from 'react';
import { View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Surface from '@/screens/cart/components/atoms/Surface';
import CartText from '@/screens/cart/components/atoms/CartText';
import { CART_COLORS } from '@/styles/cartTheme';
import FailureDisc from '../atoms/FailureDisc';
import { ICON, styles } from '../../styles';

const FailureStatusCard = ({ title, subtitle, errorMessage, refundNote }) => (
  <Surface style={styles.section}>
    <View style={styles.card}>
      <View style={styles.statusRow}>
        <FailureDisc />
        <View style={styles.statusCopy}>
          <CartText variant="heading">{title}</CartText>
          <CartText variant="caption" tone="muted">
            {subtitle}
          </CartText>
        </View>
      </View>

      {errorMessage ? (
        <View style={styles.errorStrip}>
          <Feather
            name="alert-triangle"
            size={ICON.meta}
            color={CART_COLORS.danger}
          />
          <CartText
            variant="caption"
            tone="danger"
            style={styles.errorStripCopy}
          >
            {errorMessage}
          </CartText>
        </View>
      ) : null}
    </View>

    <View style={styles.footerStrip}>
      <Feather
        name="shield"
        size={ICON.meta}
        color={CART_COLORS.textSecondary}
      />
      <CartText
        variant="captionStrong"
        tone="secondary"
        style={styles.footerStripCopy}
      >
        {refundNote}
      </CartText>
    </View>
  </Surface>
);

export default React.memo(FailureStatusCard);

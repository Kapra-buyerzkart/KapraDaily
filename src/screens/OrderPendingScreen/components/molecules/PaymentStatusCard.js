import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Surface from '@/screens/cart/components/atoms/Surface';
import CartText from '@/screens/cart/components/atoms/CartText';
import Divider from '@/screens/cart/components/atoms/Divider';
import { CART_COLORS, hitSlopTo } from '@/styles/cartTheme';
import StatusDisc from '../atoms/StatusDisc';
import { ICON, styles } from '../../styles';

const MetaRow = ({ label, children }) => (
  <View style={styles.metaRow}>
    <CartText variant="label" tone="muted">
      {label}
    </CartText>
    <View style={styles.metaValueWrap}>{children}</View>
  </View>
);

const PaymentStatusCard = ({
  title,
  subtitle,
  orderNumber,
  paymentLabel,
  assuranceNote,
  onCopy,
}) => (
  <Surface style={styles.section}>
    <View style={styles.card}>
      <View style={styles.statusRow}>
        <StatusDisc />
        <View style={styles.statusCopy}>
          <CartText variant="heading">{title}</CartText>
          <CartText variant="caption" tone="muted">
            {subtitle}
          </CartText>
        </View>
      </View>

      <Divider style={styles.rule} />

      <View style={styles.metaGroup}>
        <MetaRow label="Order number">
          <CartText variant="labelStrong">#{orderNumber}</CartText>
          {onCopy ? (
            <TouchableOpacity
              style={styles.copyChip}
              onPress={onCopy}
              activeOpacity={0.75}
              hitSlop={hitSlopTo(28)}
              accessibilityRole="button"
              accessibilityLabel="Copy order number"
            >
              <Feather
                name="copy"
                size={ICON.chip}
                color={CART_COLORS.textMuted}
              />
              <CartText variant="micro" tone="muted">
                Copy
              </CartText>
            </TouchableOpacity>
          ) : null}
        </MetaRow>

        <MetaRow label="Payment">
          <CartText variant="labelStrong" tone="secondary">
            {paymentLabel}
          </CartText>
        </MetaRow>
      </View>
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
        {assuranceNote}
      </CartText>
    </View>
  </Surface>
);

export default React.memo(PaymentStatusCard);

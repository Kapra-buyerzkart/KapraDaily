import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Surface from '@/screens/cart/components/atoms/Surface';
import CartText from '@/screens/cart/components/atoms/CartText';
import Divider from '@/screens/cart/components/atoms/Divider';
import SectionHeading from '@/screens/cart/components/atoms/SectionHeading';
import { CART_COLORS, hitSlopTo } from '@/styles/cartTheme';
import { ICON, styles } from '../../styles';

const MetaRow = ({ label, children }) => (
  <View style={styles.metaRow}>
    <CartText variant="label" tone="muted">
      {label}
    </CartText>
    <View style={styles.metaValueWrap}>{children}</View>
  </View>
);

const OrderSummaryCard = ({
  title,
  orderNumber,
  paymentLabel,
  itemsLabel,
  amountLabel,
  onCopy,
}) => (
  <Surface style={styles.section}>
    <View style={styles.card}>
      <SectionHeading title={title} />

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

        {itemsLabel ? (
          <MetaRow label="Items">
            <CartText variant="labelStrong" tone="secondary">
              {itemsLabel}
            </CartText>
          </MetaRow>
        ) : null}
      </View>

      <View style={styles.totalRow}>
        <CartText variant="labelStrong">Order total</CartText>
        <CartText variant="price">{amountLabel}</CartText>
      </View>
    </View>
  </Surface>
);

export default React.memo(OrderSummaryCard);

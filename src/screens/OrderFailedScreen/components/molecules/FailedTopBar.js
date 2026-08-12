import React from 'react';
import { View } from 'react-native';
import CartText from '@/screens/cart/components/atoms/CartText';
import StatusDot from '../atoms/StatusDot';
import { styles } from '../../styles';

const FailedTopBar = ({ title, subtitle, statusLabel }) => (
  <View style={styles.topBar}>
    <View style={styles.topBarCopy}>
      <CartText variant="title" accessibilityRole="header">
        {title}
      </CartText>
      {subtitle ? (
        <CartText variant="caption" tone="muted">
          {subtitle}
        </CartText>
      ) : null}
    </View>

    <View style={styles.statusPill}>
      <StatusDot />
      <CartText variant="micro" tone="muted">
        {statusLabel}
      </CartText>
    </View>
  </View>
);

export default React.memo(FailedTopBar);

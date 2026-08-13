import React from 'react';
import { View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconDisc from '@/screens/cart/components/atoms/IconDisc';
import { CART_COLORS } from '@/styles/cartTheme';
import { DISC, ICON, styles } from '../../styles';

const FailureDisc = () => (
  <IconDisc
    size={DISC.status}
    tone="danger"
    radius={DISC.status / 2}
    style={styles.failureDisc}
  >
    <View style={styles.failureRing} />
    <MaterialCommunityIcons
      name="close"
      size={ICON.status}
      color={CART_COLORS.danger}
    />
  </IconDisc>
);

export default React.memo(FailureDisc);

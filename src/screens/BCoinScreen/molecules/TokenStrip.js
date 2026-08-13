import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CART_SPACING } from '@/styles/cartTheme';

import { CoinSurface, CoinText, IconTile } from '../atoms';
import { TOKEN_ICON } from '../constants';

const TokenStrip = ({ tokens }) => (
  <CoinSurface style={styles.card}>
    <IconTile
      tone="violet"
      size={40}
      source={TOKEN_ICON}
      imageStyle={styles.icon}
    />

    <View style={styles.copy}>
      <CoinText variant="bodyStrong">UD Token</CoinText>
      <CoinText variant="caption" tone="muted" style={styles.caption}>
        Earned from referrals & orders
      </CoinText>
    </View>

    <View style={styles.right}>
      <CoinText variant="priceLarge" tone="violet">
        {tokens}
      </CoinText>
      <CoinText variant="micro" tone="muted">
        Available
      </CoinText>
    </View>
  </CoinSurface>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: CART_SPACING.md,
    paddingVertical: CART_SPACING.md,
    paddingHorizontal: CART_SPACING.lg,
  },
  icon: {
    width: 24,
    height: 18,
    resizeMode: 'contain',
  },
  copy: {
    flex: 1,
    marginLeft: CART_SPACING.md,
  },
  caption: {
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
});

export default React.memo(TokenStrip);

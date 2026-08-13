import React from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CART_SPACING } from '@/styles/cartTheme';

import { CoinSurface, CoinText, IconTile } from '../atoms';
import { TOKEN_GLYPH } from '../constants';
import { PALETTE } from '../theme';

const GLYPH_SIZE = 22;

const TokenStrip = ({ tokens }) => (
  <CoinSurface style={styles.card}>
    <IconTile tone="violet" size={40}>
      <MaterialCommunityIcons
        name={TOKEN_GLYPH}
        size={GLYPH_SIZE}
        color={PALETTE.token}
      />
    </IconTile>

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

import React from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { AppText } from '../../../components/atoms';
import { CoinSurface, CoinTile } from '../atoms';
import { TOKEN_GLYPH } from '../constants';
import { PALETTE, SPACING } from '../theme';

const GLYPH_SIZE = 22;

const TokenStrip: React.FC<{ tokens: string | number }> = ({ tokens }) => (
  <CoinSurface style={styles.card}>
    <CoinTile tone="token" size={40}>
      <MaterialCommunityIcons
        name={TOKEN_GLYPH}
        size={GLYPH_SIZE}
        color={PALETTE.token}
      />
    </CoinTile>

    <View style={styles.copy}>
      <AppText variant="bodyStrong">UD Token</AppText>
      <AppText variant="caption" tone="muted" style={styles.caption}>
        Earned from referrals & orders
      </AppText>
    </View>

    <View style={styles.right}>
      <AppText variant="priceLarge" tone={PALETTE.token}>
        {tokens}
      </AppText>
      <AppText variant="micro" tone="muted">
        Available
      </AppText>
    </View>
  </CoinSurface>
);

export default React.memo(TokenStrip);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  copy: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  caption: {
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
});

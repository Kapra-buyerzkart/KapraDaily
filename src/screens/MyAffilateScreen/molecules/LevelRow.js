import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartText from '@/screens/cart/components/atoms/CartText';
import Surface from '@/screens/cart/components/atoms/Surface';
import { CART_COLORS, CART_SPACING, wp } from '@/styles/cartTheme';
import LevelBadge from '../atoms/LevelBadge';
import { formatBT, levelLabel } from '../utils';

const LevelRow = ({ level, onPress }) => {
  const { levelNumber, memberCount, totalBTEarned, hasMembers, label } = level;

  const body = (
    <View style={styles.row}>
      <LevelBadge label={label} active={hasMembers} />

      <View style={styles.copy}>
        <CartText variant="labelStrong" tone={hasMembers ? 'primary' : 'faint'}>
          Level {levelNumber}
        </CartText>
        <CartText variant="caption" tone="muted" numberOfLines={1}>
          {hasMembers ? levelLabel(levelNumber) : 'No members yet'}
        </CartText>
      </View>

      {hasMembers ? (
        <View style={styles.metrics}>
          <CartText variant="price">
            {memberCount}
            <CartText variant="caption" tone="muted">
              {memberCount === 1 ? ' member' : ' members'}
            </CartText>
          </CartText>
          <CartText variant="captionStrong" tone="success">
            {formatBT(totalBTEarned)} UD
          </CartText>
        </View>
      ) : (
        <CartText variant="body" tone="faint">
          —
        </CartText>
      )}

      {hasMembers && (
        <MaterialCommunityIcons
          name="chevron-right"
          size={wp('5%')}
          color={CART_COLORS.textFaint}
        />
      )}
    </View>
  );

  if (!hasMembers) {
    return (
      <Surface elevated={false} style={[styles.card, styles.cardEmpty]}>
        {body}
      </Surface>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View level ${levelNumber} members`}
    >
      <Surface style={styles.card}>{body}</Surface>
    </TouchableOpacity>
  );
};

export default React.memo(LevelRow);

const styles = StyleSheet.create({
  card: {
    padding: CART_SPACING.md,
  },
  cardEmpty: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: CART_COLORS.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.md,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  metrics: {
    alignItems: 'flex-end',
    gap: 1,
  },
});

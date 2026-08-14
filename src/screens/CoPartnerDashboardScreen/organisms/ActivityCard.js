import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Surface from '@/screens/cart/components/atoms/Surface';
import Divider from '@/screens/cart/components/atoms/Divider';
import CartText from '@/screens/cart/components/atoms/CartText';
import IconDisc from '@/screens/cart/components/atoms/IconDisc';
import Badge from '@/screens/cart/components/atoms/Badge';
import { CART_COLORS, CART_SPACING, hitSlopTo, wp } from '@/styles/cartTheme';
import ActivityRow from '../molecules/ActivityRow';
import { LIST_PREVIEW_LIMIT } from '../constants';
import BallPulse from '@/components/BallPulse';

const ActivityCard = ({ title, icon, items, type, isLoading, onViewAll }) => {
  if (items.length === 0 && !isLoading) return null;

  const visibleItems = items.slice(0, LIST_PREVIEW_LIMIT);

  return (
    <Surface style={styles.card}>
      <View style={styles.header}>
        <IconDisc size={wp('9%')} tone="neutral">
          <MaterialCommunityIcons
            name={icon}
            size={wp('4.2%')}
            color={CART_COLORS.textSecondary}
          />
        </IconDisc>

        <View style={styles.headerCopy}>
          <CartText
            variant="heading"
            numberOfLines={1}
            accessibilityRole="header"
          >
            {title}
          </CartText>
        </View>

        {items.length > 0 && <Badge tone="neutral" label={`${items.length}`} />}

        {items.length > LIST_PREVIEW_LIMIT && (
          <TouchableOpacity
            style={styles.viewAll}
            hitSlop={hitSlopTo(20)}
            activeOpacity={0.75}
            onPress={onViewAll}
            accessibilityRole="button"
            accessibilityLabel={`View all ${title}`}
          >
            <CartText variant="captionStrong" tone="secondary">
              View all
            </CartText>
            <MaterialCommunityIcons
              name="chevron-right"
              size={wp('4%')}
              color={CART_COLORS.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {visibleItems.map((item, index) => (
        <View key={index}>
          <Divider />
          <ActivityRow item={item} type={type} index={index} />
        </View>
      ))}

      {items.length === 0 && isLoading && (
        <BallPulse
          size="small"
          color={CART_COLORS.textSecondary}
          style={styles.loader}
        />
      )}
    </Surface>
  );
};

export default React.memo(ActivityCard);

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: CART_SPACING.lg,
    paddingVertical: CART_SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
    paddingVertical: CART_SPACING.sm,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loader: {
    marginVertical: CART_SPACING.md,
  },
});

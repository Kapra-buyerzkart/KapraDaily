import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Surface from '@/screens/cart/components/atoms/Surface';
import Divider from '@/screens/cart/components/atoms/Divider';
import CartText from '@/screens/cart/components/atoms/CartText';
import Badge from '@/screens/cart/components/atoms/Badge';
import { CART_COLORS, CART_SPACING, wp } from '@/styles/cartTheme';
import StatCell from '../atoms/StatCell';
import { getSummaryStats } from '../utils';

const AreaSalesCard = ({ summary, areaName }) => {
  const stats = getSummaryStats(summary);

  return (
    <Surface style={styles.card}>
      <View style={styles.headline}>
        <View style={styles.headlineCopy}>
          <CartText variant="micro" tone="muted">
            TOTAL AREA SALES
          </CartText>
          <CartText
            variant="display"
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            ₹{summary?.totalAreaSales || summary?.totalSales || '0'}
          </CartText>
        </View>

        {!!areaName && (
          <Badge
            tone="neutral"
            label={areaName}
            icon={
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={wp('3.2%')}
                color={CART_COLORS.textMuted}
              />
            }
          />
        )}
      </View>

      <Divider />

      <View style={styles.grid}>
        {stats.map(stat => (
          <StatCell
            key={stat.key}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            tone={stat.tone}
          />
        ))}
      </View>
    </Surface>
  );
};

export default React.memo(AreaSalesCard);

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: CART_SPACING.lg,
    paddingTop: CART_SPACING.lg,
    paddingBottom: CART_SPACING.sm,
    gap: CART_SPACING.lg,
  },
  headline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: CART_SPACING.md,
  },
  headlineCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -CART_SPACING.sm,
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { FONTS } from '@/styles/typography';
import {
  ACCENT,
  HAIRLINE,
  INK,
  RADIUS,
  SPACE,
  SURFACE,
  TYPE,
  MAX_FONT_SCALE,
} from '@/styles/homeTheme';
import AnimatedPressable from '@/components/AnimatedPressable';
import OrderProductCard from '@/components/OrderProductCard';
import SurfaceCard from '../atoms/SurfaceCard';
import BillBreakdown from '../molecules/BillBreakdown';
import { formatMoney } from '../tokens/format';

const OrderItemsCard = ({ items = [], orderStatus, onReturn, bill, total }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <SurfaceCard>
      <View style={styles.items}>
        {items.map((item, index) => (
          <OrderProductCard
            key={item?.orderItemId ?? item?.productId ?? index}
            item={item}
            orderStatus={orderStatus}
            onReturn={selected => onReturn(selected || item)}
          />
        ))}
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          Order total
        </Text>
        <Text style={styles.totalValue} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          {formatMoney(total)}
        </Text>
      </View>

      {!!bill && (
        <AnimatedPressable
          style={styles.toggle}
          onPress={() => setExpanded(value => !value)}
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          accessibilityLabel={
            expanded ? 'Hide bill details' : 'View bill details'
          }
        >
          <Text
            style={styles.toggleText}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {expanded ? 'Hide bill details' : 'View bill details'}
          </Text>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={wp('3.4%')}
            color={INK.base}
            style={styles.toggleIcon}
          />
        </AnimatedPressable>
      )}

      {expanded && <BillBreakdown bill={bill} />}

      {bill?.totalSavings > 0 && (
        <View style={styles.savings}>
          <Ionicons
            name="pricetag"
            size={wp('3.8%')}
            color={ACCENT.successText}
          />
          <Text
            style={styles.savingsText}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            You saved {formatMoney(bill.totalSavings)} on this order
          </Text>
        </View>
      )}
    </SurfaceCard>
  );
};

const styles = StyleSheet.create({
  items: {
    marginTop: -SPACE.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACE.base,
  },
  totalLabel: {
    ...TYPE.body,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
  },
  totalValue: {
    ...TYPE.heading,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    letterSpacing: -0.3,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: SURFACE.sunken,
    borderWidth: 1,
    borderColor: HAIRLINE,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.xs + 2,
    marginTop: SPACE.md,
  },
  toggleText: {
    ...TYPE.caption,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    color: INK.base,
  },
  toggleIcon: {
    marginLeft: SPACE.xs + 2,
  },
  savings: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACCENT.successSoft,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: HAIRLINE,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.sm + 2,
    marginTop: SPACE.base,
  },
  savingsText: {
    ...TYPE.caption,
    lineHeight: undefined,
    flex: 1,
    fontFamily: FONTS.gilroy.bold,
    color: ACCENT.successText,
    marginLeft: SPACE.sm,
  },
});

export default React.memo(OrderItemsCard);

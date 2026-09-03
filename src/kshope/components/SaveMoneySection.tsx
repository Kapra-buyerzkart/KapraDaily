import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppText, Surface, Divider, IconDisc } from './atoms';
import OfferRow from './OfferRow';
import {
  UI_COLORS,
  UI_SPACING,
  hp,
  wp,
} from '../theme/tokens';

export interface SaveMoneySectionProps {
  appliedCouponCode?: string | null;
  appliedGiftCardCode?: string | null;
  bcoinsAppliedValue?: number;
  availableBCoins?: number;
  onApplyOffer: (offerId: string) => void;
  onRejectOffer: (offerId: string) => void;
  bordered?: boolean;
}

const SaveMoneySection: React.FC<SaveMoneySectionProps> = ({
  appliedCouponCode,
  appliedGiftCardCode,
  bcoinsAppliedValue = 0,
  availableBCoins = 0,
  onApplyOffer,
  onRejectOffer,
  bordered = false,
}) => {
  const bcoinsApplied = bcoinsAppliedValue > 0;

  return (
    <View style={styles.section}>
      <Surface inset={false} bordered={bordered} style={styles.surface}>
        <View style={styles.header}>
          <IconDisc size={wp('8%')} tone="ink">
            <MaterialCommunityIcons
              name="brightness-percent"
              size={wp('4.4%')}
              color={UI_COLORS.ink}
            />
          </IconDisc>
          <View style={styles.headerCopy}>
            <AppText variant="heading">Save more</AppText>
            <AppText variant="caption" tone="muted">
              Coupons, B-Coins and gift cards
            </AppText>
          </View>
        </View>

        <Divider inset={UI_SPACING.lg} />

        <OfferRow
          iconName="hand-coin"
          iconTone="ink"
          title="B-Coins"
          subtitle={`${availableBCoins} B-Coins available`}
          isApplied={bcoinsApplied}
          appliedSubtitle={`₹${bcoinsAppliedValue.toFixed(0)} applied`}
          onPress={() => onApplyOffer('3')}
          onRemove={() => onRejectOffer('3')}
        />

        <Divider inset={UI_SPACING.lg} />

        <OfferRow
          iconName="ticket-percent-outline"
          iconTone="ink"
          title="Coupon"
          subtitle="View all coupons"
          isApplied={!!appliedCouponCode}
          appliedLabel={appliedCouponCode}
          onPress={() => onApplyOffer('2')}
          onRemove={() => onRejectOffer('2')}
        />

        <Divider inset={UI_SPACING.lg} />

        <OfferRow
          iconName="gift-outline"
          iconTone="ink"
          title="Smart Point"
          subtitle="View all gift cards"
          isApplied={!!appliedGiftCardCode}
          appliedLabel={appliedGiftCardCode}
          onPress={() => onApplyOffer('4')}
          onRemove={() => onRejectOffer('4')}
        />
      </Surface>
    </View>
  );
};

export default React.memo(SaveMoneySection);

const styles = StyleSheet.create({
  section: {
    marginTop: hp('1.6%'),
  },
  surface: {
    paddingVertical: UI_SPACING.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.sm,
    paddingHorizontal: UI_SPACING.lg,
    paddingVertical: UI_SPACING.md,
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
});

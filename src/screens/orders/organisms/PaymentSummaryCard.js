import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { FONTS } from '@/styles/typography';
import {
  ACCENT,
  INK,
  RADIUS,
  SPACE,
  TYPE,
  MAX_FONT_SCALE,
} from '@/styles/homeTheme';
import SurfaceCard from '../atoms/SurfaceCard';
import IconChip from '../atoms/IconChip';
import { formatMoney } from '../tokens/format';

const PaymentSummaryCard = ({ label, amount, badge }) => (
  <SurfaceCard style={styles.card}>
    <IconChip
      name={label === 'Cash on delivery' ? 'cash-outline' : 'card-outline'}
      tone="neutral"
    />

    <View style={styles.copy}>
      <Text
        style={styles.label}
        numberOfLines={1}
        ellipsizeMode="tail"
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        {label}
      </Text>
      <Text style={styles.caption} maxFontSizeMultiplier={MAX_FONT_SCALE}>
        Amount payable
      </Text>
    </View>

    <View style={styles.amountBlock}>
      <Text style={styles.amount} maxFontSizeMultiplier={MAX_FONT_SCALE}>
        {formatMoney(amount)}
      </Text>
      {!!badge && (
        <View style={styles.badge}>
          <Ionicons
            name="checkmark-circle"
            size={wp('3.2%')}
            color={ACCENT.successText}
          />
          <Text style={styles.badgeText} maxFontSizeMultiplier={MAX_FONT_SCALE}>
            {badge}
          </Text>
        </View>
      )}
    </View>
  </SurfaceCard>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copy: {
    flex: 1,
    marginHorizontal: SPACE.md,
  },
  label: {
    ...TYPE.body,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
  },
  caption: {
    ...TYPE.caption,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.medium,
    color: INK.muted,
    marginTop: 2,
  },
  amountBlock: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  amount: {
    ...TYPE.heading,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    letterSpacing: -0.3,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: ACCENT.successSoft,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACE.sm,
    paddingVertical: 2,
    marginTop: SPACE.xs,
  },
  badgeText: {
    ...TYPE.micro,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.semiBold,
    color: ACCENT.successText,
    marginLeft: 3,
  },
});

export default React.memo(PaymentSummaryCard);

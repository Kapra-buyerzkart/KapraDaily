import React, { useMemo, useState } from 'react';
import {
  View,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  UI_COLORS,
  UI_ELEVATION,
  UI_RADIUS,
  UI_SPACING,
  UI_TYPE,
  MAX_FONT_SCALE,
  hitSlopTo,
  wp,
  hp,
} from '../theme/tokens';
import { AppText, IconDisc } from './atoms';

interface CouponModalProps {
  visible: boolean;
  onClose: () => void;
  isGiftCard: boolean;
  availableCoupons: any[];
  availableGiftCards: any[];
  onCouponClick: (coupon: any) => void;
  profile?: 'user' | 'cart';
}

const formatExpiry = (validTo?: string) =>
  validTo
    ? new Date(validTo).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;

const describeOffer = (item: any) => {
  if (item.description) return item.description;
  if (item.discountType === 'PERCENT') {
    return `Get ${item.discountValue}% OFF up to ₹${item.maxDiscountAmount}`;
  }
  if (item.discountType === 'FLAT') return `Flat ₹${item.discountValue} OFF`;
  return item.title || item.couponName || 'Offer available on this order';
};

const MetaChip = ({ icon, label }: { icon: string; label: string }) => (
  <View style={styles.metaChip}>
    <MaterialCommunityIcons
      name={icon}
      size={wp('3.4%')}
      color={UI_COLORS.textMuted}
    />
    <AppText variant="micro" tone="muted">
      {label}
    </AppText>
  </View>
);

const OfferCard = ({
  item,
  actionLabel,
  onPress,
}: {
  item: any;
  actionLabel: string;
  onPress: (item: any) => void;
}) => {
  const code = item.couponCode || item.giftCode || item.code;
  const expiry = formatExpiry(item.validTo);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(item)}
      style={styles.card}
    >
      <View style={styles.cardTopRow}>
        <View style={styles.codeChip}>
          <MaterialCommunityIcons
            name="tag-outline"
            size={wp('3.6%')}
            color={UI_COLORS.primary}
          />
          <AppText variant="captionStrong" tone="brand">
            {code}
          </AppText>
        </View>

        <View style={styles.actionPill}>
          <AppText variant="micro" tone="brand" style={styles.actionText}>
            {actionLabel}
          </AppText>
        </View>
      </View>

      <AppText variant="bodyStrong" style={styles.cardTitle}>
        {describeOffer(item)}
      </AppText>

      {item.minOrderAmount > 0 || expiry ? (
        <>
          <View style={styles.cardDivider} />
          <View style={styles.metaRow}>
            {item.minOrderAmount > 0 ? (
              <MetaChip
                icon="basket-outline"
                label={`Min. order ₹${item.minOrderAmount}`}
              />
            ) : null}
            {expiry ? (
              <MetaChip icon="clock-outline" label={`Expires ${expiry}`} />
            ) : null}
          </View>
        </>
      ) : null}
    </TouchableOpacity>
  );
};

const CouponModal: React.FC<CouponModalProps> = ({
  visible,
  onClose,
  isGiftCard,
  availableCoupons,
  availableGiftCards,
  onCouponClick,
  profile = 'cart',
}) => {
  const [manualCode, setManualCode] = useState('');

  const data = useMemo(
    () => (isGiftCard ? availableGiftCards : availableCoupons) || [],
    [isGiftCard, availableGiftCards, availableCoupons],
  );

  const isCopyOnly = profile === 'user';
  const noun = isGiftCard ? 'gift card' : 'coupon';
  const typedCode = manualCode.trim();
  const canApply = typedCode.length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.dismissArea}
          onPress={onClose}
          activeOpacity={1}
        />

        <View style={styles.sheet}>
          <View style={styles.handleHitArea}>
            <View style={styles.handle} />
          </View>

          <View style={styles.headerRow}>
            <IconDisc size={wp('10%')} tone="brand">
              <MaterialCommunityIcons
                name={isGiftCard ? 'gift-outline' : 'ticket-percent-outline'}
                size={wp('5.2%')}
                color={UI_COLORS.primary}
              />
            </IconDisc>

            <View style={styles.headerCopy}>
              <AppText variant="heading">
                {isGiftCard ? 'Apply Gift Card' : 'Apply Coupon'}
              </AppText>
              <AppText variant="micro" tone="muted">
                {data.length > 0
                  ? `${data.length} ${noun}${
                      data.length > 1 ? 's' : ''
                    } available for you`
                  : `No ${noun}s available right now`}
              </AppText>
            </View>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={hitSlopTo(40)}
              style={styles.closeBtn}
            >
              <MaterialCommunityIcons
                name="close"
                size={wp('4.6%')}
                color={UI_COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {!isCopyOnly ? (
            <View style={styles.inputRow}>
              <View style={styles.inputCard}>
                <MaterialCommunityIcons
                  name="tag-outline"
                  size={wp('4.6%')}
                  color={UI_COLORS.textFaint}
                />
                <TextInput
                  value={manualCode}
                  onChangeText={setManualCode}
                  placeholder={`Enter ${noun} code`}
                  placeholderTextColor={UI_COLORS.textFaint}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                  style={styles.input}
                  returnKeyType="done"
                  onSubmitEditing={
                    canApply
                      ? () => onCouponClick({ code: typedCode })
                      : undefined
                  }
                />
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                disabled={!canApply}
                onPress={() => onCouponClick({ code: typedCode })}
                style={[styles.applyBtn, !canApply && styles.applyBtnDisabled]}
              >
                <AppText
                  variant="cta"
                  tone={canApply ? 'onDark' : 'faint'}
                  style={styles.applyBtnText}
                >
                  Apply
                </AppText>
              </TouchableOpacity>
            </View>
          ) : null}

          <AppText variant="micro" tone="muted" style={styles.sectionLabel}>
            {isGiftCard ? 'Available gift cards' : 'Available coupons'}
          </AppText>

          <FlatList
            style={styles.list}
            data={data}
            keyExtractor={(item, index) =>
              String(item.couponId || item.giftCardId || item.id || index)
            }
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <OfferCard
                item={item}
                actionLabel={isCopyOnly ? 'COPY' : 'APPLY'}
                onPress={onCouponClick}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Image
                  source={
                    isGiftCard
                      ? require('../assets/images/noimages/nogiftcard.png')
                      : require('../assets/images/noimages/nocoupon.png')
                  }
                  style={styles.emptyImage}
                />
                <AppText variant="bodyStrong" tone="secondary">
                  {isGiftCard ? 'No gift cards yet' : 'No coupons yet'}
                </AppText>
                <AppText variant="micro" tone="muted" style={styles.emptyNote}>
                  New offers drop in often, check back soon
                </AppText>
              </View>
            }
            contentContainerStyle={styles.listContent}
          />
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(CouponModal);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: UI_COLORS.overlay,
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  sheet: {
    backgroundColor: UI_COLORS.background,
    borderTopLeftRadius: UI_RADIUS.card,
    borderTopRightRadius: UI_RADIUS.card,
    maxHeight: hp('82%'),
    paddingHorizontal: UI_SPACING.lg,
    paddingTop: UI_SPACING.xs,
    paddingBottom: UI_SPACING.md,
  },
  handleHitArea: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DADADA',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.md,
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  closeBtn: {
    width: wp('8.5%'),
    height: wp('8.5%'),
    borderRadius: UI_RADIUS.pill,
    backgroundColor: UI_COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.sm,
    marginTop: UI_SPACING.lg,
  },
  inputCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.sm,
    borderWidth: 1,
    borderColor: UI_COLORS.border,
    borderRadius: UI_RADIUS.input,
    backgroundColor: UI_COLORS.card,
    paddingHorizontal: UI_SPACING.md,
    paddingVertical: hp('1.3%'),
  },
  input: {
    flex: 1,
    ...UI_TYPE.body,
    color: UI_COLORS.textPrimary,
    padding: 0,
  },
  applyBtn: {
    paddingHorizontal: UI_SPACING.xl,
    paddingVertical: hp('1.6%'),
    borderRadius: UI_RADIUS.button,
    backgroundColor: UI_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnDisabled: {
    backgroundColor: UI_COLORS.well,
  },
  applyBtnText: {
    letterSpacing: 0.2,
  },
  sectionLabel: {
    marginTop: UI_SPACING.xl,
    marginBottom: UI_SPACING.sm,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  list: {
    maxHeight: hp('55%'),
  },
  listContent: {
    paddingBottom: hp('6%'),
    gap: UI_SPACING.md,
  },
  card: {
    backgroundColor: UI_COLORS.card,
    borderRadius: UI_RADIUS.card,
    padding: UI_SPACING.lg,
    ...UI_ELEVATION.card,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: UI_SPACING.sm,
  },
  codeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.xs,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: UI_COLORS.primaryEdge,
    backgroundColor: UI_COLORS.primaryTint,
    borderRadius: UI_RADIUS.xs,
    paddingHorizontal: UI_SPACING.sm,
    paddingVertical: hp('0.5%'),
  },
  actionPill: {
    borderRadius: UI_RADIUS.pill,
    backgroundColor: UI_COLORS.primaryTint,
    paddingHorizontal: UI_SPACING.md,
    paddingVertical: hp('0.6%'),
  },
  actionText: {
    letterSpacing: 0.6,
  },
  cardTitle: {
    marginTop: UI_SPACING.md,
  },
  cardDivider: {
    height: 1,
    backgroundColor: UI_COLORS.border,
    marginVertical: UI_SPACING.md,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: UI_SPACING.md,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: hp('3%'),
    gap: UI_SPACING.xs,
  },
  emptyImage: {
    width: wp('38%'),
    height: wp('38%'),
    resizeMode: 'contain',
    marginBottom: UI_SPACING.sm,
  },
  emptyNote: {
    textAlign: 'center',
  },
});

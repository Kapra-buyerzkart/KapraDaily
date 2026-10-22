import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  CART_COLORS,
  CART_ELEVATION,
  CART_RADIUS,
  CART_SPACING,
  CART_TYPE,
  MAX_FONT_SCALE,
  hitSlopTo,
  wp,
  hp,
} from '../styles/cartTheme';
import { CartText, IconDisc } from '../screens/cart/components/atoms';
import CustomModal, { MODAL_POSITION } from './modal/CustomModal';
import { FONTS } from '../styles/typography';

const formatExpiry = validTo =>
  validTo
    ? new Date(validTo).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;

const describeOffer = item => {
  if (item.description) return item.description;
  console.log(item, 'item======>');

  if (item.discountType === 'PERCENT') {
    return `Get ${item.discountValue}% OFF up to ₹${item.maxDiscountAmount}`;
  }
  if (item.discountType === 'FLAT') return `Flat ₹${item.discountValue} OFF`;
  return 'Offer available on this order';
};

import { evaluateCoupon } from '../utils/couponRecommendation';

const MetaChip = ({ icon, label, tone = 'muted' }) => (
  <View style={styles.metaChip}>
    <MaterialCommunityIcons
      name={icon}
      size={wp('3.4%')}
      color={
        tone === 'brand'
          ? CART_COLORS.primary
          : tone === 'warning'
          ? '#D97706'
          : CART_COLORS.textMuted
      }
    />
    <CartText
      variant="micro"
      tone={tone === 'warning' ? 'secondary' : tone}
      style={tone === 'warning' ? styles.warningText : undefined}
    >
      {label}
    </CartText>
  </View>
);

const OfferCard = ({
  item,
  actionLabel,
  onPress,
  cartValue = 0,
  isApplied = false,
  onRemove,
}) => {
  const code = item.couponCode || item.giftCode || item.code;
  const expiry = formatExpiry(item.validTo);

  const evaluation = React.useMemo(() => {
    return evaluateCoupon(item, cartValue);
  }, [item, cartValue]);

  const shortfall = evaluation?.shortfall || 0;
  const isEligible = evaluation?.isEligible ?? true;
  const estimatedDiscount = evaluation?.estimatedDiscount || 0;

  return (
    <View style={[styles.card, isApplied && styles.appliedCardBorder]}>
      <View style={styles.cardTopRow}>
        <View style={[styles.codeChip, isApplied && styles.appliedCodeChip]}>
          <MaterialCommunityIcons
            name={isApplied ? 'check-circle' : 'tag-outline'}
            size={wp('3.6%')}
            color={isApplied ? '#16A34A' : CART_COLORS.primary}
          />
          <CartText
            variant="captionStrong"
            tone={isApplied ? 'success' : 'brand'}
          >
            {code}
          </CartText>
        </View>

        {isApplied ? (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={onRemove}
            style={styles.appliedActionPill}
          >
            <CartText variant="micro" tone="danger" style={styles.actionText}>
              REMOVE
            </CartText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!isEligible}
            onPress={() => onPress(code)}
            style={[
              styles.actionPill,
              !isEligible && styles.actionPillDisabled,
            ]}
          >
            <CartText
              variant="micro"
              tone={isEligible ? 'brand' : 'faint'}
              style={styles.actionText}
            >
              {!isEligible && shortfall > 0 ? 'LOCKED' : actionLabel}
            </CartText>
          </TouchableOpacity>
        )}
      </View>

      <CartText variant="bodyStrong" style={styles.cardTitle}>
        {describeOffer(item)}
      </CartText>

      {/* Savings indicator if eligible */}
      {isEligible && estimatedDiscount > 0 && !isApplied && (
        <View style={styles.savingsRow}>
          <MaterialCommunityIcons
            name="check-circle-outline"
            size={14}
            color="#16A34A"
          />
          <CartText variant="micro" tone="success">
            Save ₹{Math.round(estimatedDiscount)} on this order
          </CartText>
        </View>
      )}

      {/* Shortfall requirement if ineligible */}
      {!isEligible && shortfall > 0 && (
        <View style={styles.shortfallRow}>
          <MaterialCommunityIcons
            name="basket-outline"
            size={14}
            color="#D97706"
          />
          <CartText variant="micro" style={styles.shortfallText}>
            Add ₹{Math.ceil(shortfall)} more to unlock this offer
          </CartText>
        </View>
      )}

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
    </View>
  );
};

const CouponModal = ({
  visible,
  onClose,
  isGiftCard,
  couponCode,
  setCouponCode,
  onApply,
  availableCoupons,
  availableGiftCards,
  onCouponClick,
  isCopyOnly = false,
  cartValue = 0,
  appliedCouponCode = null,
  onRemoveCoupon,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (visible) {
      modalRef.current?.open();
    } else {
      modalRef.current?.close();
    }
  }, [visible]);

  const data = useMemo(
    () => (isGiftCard ? availableGiftCards : availableCoupons) || [],
    [isGiftCard, availableGiftCards, availableCoupons],
  );

  console.log(data, 'data====>');

  const noun = isGiftCard ? 'gift card' : 'coupon';
  const typedCode = (couponCode || '').trim();
  const canApply = typedCode.length > 0;

  return (
    <CustomModal
      ref={modalRef}
      position={MODAL_POSITION.BOTTOM}
      maxHeight={hp('82%')}
      scrollable={false}
      onClose={onClose}
      containerStyle={styles.sheetShell}
      contentStyle={styles.sheet}
    >
      <View style={styles.headerRow}>
        <IconDisc size={wp('10%')} tone="brand">
          <MaterialCommunityIcons
            name={isGiftCard ? 'gift-outline' : 'ticket-percent-outline'}
            size={wp('5.2%')}
            color={CART_COLORS.primary}
          />
        </IconDisc>

        <View style={styles.headerCopy}>
          <CartText variant="heading">
            {isGiftCard ? 'Apply Gift Card' : 'Apply Coupon'}
          </CartText>
          <CartText variant="micro" tone="muted">
            {data.length > 0
              ? `${data.length} ${noun}${
                  data.length > 1 ? 's' : ''
                } available for you`
              : `No ${noun}s available right now`}
          </CartText>
        </View>

        <TouchableOpacity
          onPress={onClose}
          hitSlop={hitSlopTo(40)}
          style={styles.closeBtn}
        >
          <MaterialCommunityIcons
            name="close"
            size={wp('4.6%')}
            color={CART_COLORS.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {!isCopyOnly ? (
        <View style={styles.inputRow}>
          <View style={styles.inputCard}>
            <MaterialCommunityIcons
              name="tag-outline"
              size={wp('4.6%')}
              color={CART_COLORS.textFaint}
            />
            <TextInput
              value={couponCode}
              onChangeText={setCouponCode}
              placeholder={`Enter ${noun} code`}
              placeholderTextColor={CART_COLORS.textFaint}
              autoCapitalize="characters"
              autoCorrect={false}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
              style={styles.input}
              returnKeyType="done"
              onSubmitEditing={canApply ? () => onApply() : undefined}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!canApply}
            onPress={() => onApply()}
            style={[styles.applyBtn, !canApply && styles.applyBtnDisabled]}
          >
            <CartText
              variant="cta"
              tone={canApply ? 'onDark' : 'faint'}
              style={styles.applyBtnText}
              numberOfLines={1}
            >
              Apply
            </CartText>
          </TouchableOpacity>
        </View>
      ) : null}

      <CartText variant="micro" tone="muted" style={styles.sectionLabel}>
        {isGiftCard ? 'Available gift cards' : 'Available coupons'}
      </CartText>

      <FlatList
        style={styles.list}
        data={data}
        keyExtractor={(item, index) =>
          (item.couponId || item.giftCardId || index).toString()
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const code = item.couponCode || item.code || item.giftCode;
          const isApplied =
            !isGiftCard &&
            appliedCouponCode &&
            code &&
            code.trim().toUpperCase() === appliedCouponCode.trim().toUpperCase();

          return (
            <OfferCard
              item={item}
              actionLabel={isCopyOnly ? 'COPY' : 'APPLY'}
              onPress={codeToApply => {
                onCouponClick(codeToApply);
                onClose?.();
              }}
              cartValue={cartValue}
              isApplied={isApplied}
              onRemove={onRemoveCoupon}
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image
              source={
                isGiftCard
                  ? require('../assets/images/noimages/noCouponCode.png')
                  : require('../assets/images/noimages/noCoupons.png')
              }
              style={styles.emptyImage}
            />
            <CartText variant="bodyStrong" tone="secondary">
              {isGiftCard ? 'No gift cards yet' : 'No coupons yet'}
            </CartText>
            <CartText variant="micro" tone="muted" style={styles.emptyNote}>
              New offers drop in often, check back soon
            </CartText>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </CustomModal>
  );
};

export default React.memo(CouponModal);

const styles = StyleSheet.create({
  sheetShell: {
    backgroundColor: CART_COLORS.background,
  },
  sheet: {
    paddingHorizontal: CART_SPACING.lg,
    paddingTop: CART_SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.md,
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  closeBtn: {
    width: wp('8.5%'),
    height: wp('8.5%'),
    borderRadius: CART_RADIUS.pill,
    backgroundColor: CART_COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
    marginTop: CART_SPACING.lg,
  },
  inputCard: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
    borderWidth: 1,
    borderColor: CART_COLORS.border,
    borderRadius: CART_RADIUS.input,
    backgroundColor: CART_COLORS.card,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('1.3%'),
  },
  input: {
    flex: 1,
    minWidth: 0,
    ...CART_TYPE.body,
    color: CART_COLORS.textPrimary,
    padding: 0,
  },
  applyBtn: {
    flexShrink: 0,
    minWidth: 72,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('1.3%'),
    borderRadius: CART_RADIUS.button,
    backgroundColor: CART_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnDisabled: {
    backgroundColor: CART_COLORS.well,
  },
  applyBtnText: {
    letterSpacing: 0.2,
    textAlign: 'center',
    includeFontPadding: false,
  },
  sectionLabel: {
    marginTop: CART_SPACING.xl,
    marginBottom: CART_SPACING.sm,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  list: {
    maxHeight: hp('55%'),
  },
  listContent: {
    paddingBottom: hp('10%'),
    gap: CART_SPACING.md,
  },
  card: {
    backgroundColor: CART_COLORS.card,
    borderRadius: CART_RADIUS.card,
    padding: CART_SPACING.lg,
    ...CART_ELEVATION.card,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: CART_SPACING.sm,
  },
  codeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.xs,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: CART_COLORS.primaryEdge,
    backgroundColor: CART_COLORS.primaryTint,
    borderRadius: CART_RADIUS.xs,
    paddingHorizontal: CART_SPACING.sm,
    paddingVertical: hp('0.5%'),
  },
  actionPill: {
    borderRadius: CART_RADIUS.pill,
    backgroundColor: CART_COLORS.primaryTint,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('0.6%'),
  },
  actionText: {
    letterSpacing: 0.6,
  },
  cardTitle: {
    marginTop: CART_SPACING.md,
  },
  cardDivider: {
    height: 1,
    backgroundColor: CART_COLORS.border,
    marginVertical: CART_SPACING.md,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: CART_SPACING.md,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: hp('3%'),
    gap: CART_SPACING.xs,
  },
  emptyImage: {
    width: wp('38%'),
    height: wp('38%'),
    resizeMode: 'contain',
    marginBottom: CART_SPACING.sm,
  },
  emptyNote: {
    textAlign: 'center',
  },
  appliedCardBorder: {
    borderColor: '#86EFAC',
    borderWidth: 1.2,
    backgroundColor: '#F0FDF4',
  },
  appliedCodeChip: {
    borderColor: '#86EFAC',
    backgroundColor: '#DCFCE7',
  },
  appliedActionPill: {
    borderRadius: CART_RADIUS.pill,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('0.6%'),
  },
  actionPillDisabled: {
    backgroundColor: CART_COLORS.well,
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  shortfallRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  shortfallText: {
    fontFamily: FONTS.gilroy.medium,
    color: '#B45309',
  },
  warningText: {
    color: '#B45309',
  },
});

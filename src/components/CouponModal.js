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

const MetaChip = ({ icon, label }) => (
  <View style={styles.metaChip}>
    <MaterialCommunityIcons
      name={icon}
      size={wp('3.4%')}
      color={CART_COLORS.textMuted}
    />
    <CartText variant="micro" tone="muted">
      {label}
    </CartText>
  </View>
);

const OfferCard = ({ item, actionLabel, onPress }) => {
  const code = item.couponCode || item.giftCode || item.code;
  const expiry = formatExpiry(item.validTo);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(code)}
      style={styles.card}
    >
      <View style={styles.cardTopRow}>
        <View style={styles.codeChip}>
          <MaterialCommunityIcons
            name="tag-outline"
            size={wp('3.6%')}
            color={CART_COLORS.primary}
          />
          <CartText variant="captionStrong" tone="brand">
            {code}
          </CartText>
        </View>

        <View style={styles.actionPill}>
          <CartText variant="micro" tone="brand" style={styles.actionText}>
            {actionLabel}
          </CartText>
        </View>
      </View>

      <CartText variant="bodyStrong" style={styles.cardTitle}>
        {describeOffer(item)}
      </CartText>

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
    ...CART_TYPE.body,
    color: CART_COLORS.textPrimary,
    padding: 0,
  },
  applyBtn: {
    paddingHorizontal: CART_SPACING.xl,
    paddingVertical: hp('1.6%'),
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
});

import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
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
        <View style={styles.headerDisc}>
          <MaterialCommunityIcons
            name={isGiftCard ? 'gift-outline' : 'ticket-percent-outline'}
            size={wp('5.2%')}
            color="#0C382E"
          />
        </View>

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
            <View style={styles.emptyAvatarWrapper}>
              <Image
                source={
                  isGiftCard
                    ? require('../assets/images/noimages/luxury_no_gift_cards.jpg')
                    : require('../assets/images/noimages/luxury_no_coupons.jpg')
                }
                style={styles.emptyImage}
                resizeMode="cover"
              />
            </View>
            <CartText variant="heading" style={styles.emptyTitle}>
              {isGiftCard ? 'No Gift Cards Available' : 'No Coupons Available'}
            </CartText>
            <CartText variant="caption" tone="muted" style={styles.emptyNote}>
              {isGiftCard
                ? 'Exclusive gift cards and reward vouchers will appear here when available.'
                : 'Exclusive discounts and curated offers will appear here when available for your cart.'}
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
    backgroundColor: '#FFFFFF',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: CART_SPACING.lg,
    paddingTop: CART_SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.md,
    paddingBottom: CART_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0ECE6',
  },
  headerDisc: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECEAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  closeBtn: {
    width: wp('8.5%'),
    height: wp('8.5%'),
    borderRadius: CART_RADIUS.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECEAE5',
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
    borderColor: '#ECEAE5',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('1.3%'),
  },
  input: {
    flex: 1,
    ...CART_TYPE.body,
    color: '#12372A',
    padding: 0,
  },
  applyBtn: {
    paddingHorizontal: CART_SPACING.xl,
    paddingVertical: hp('1.6%'),
    borderRadius: 14,
    backgroundColor: '#0C382E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnDisabled: {
    backgroundColor: '#D1DDD8',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECEAE5',
    padding: CART_SPACING.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1.5,
      },
    }),
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
    borderColor: '#0C382E',
    backgroundColor: '#F0F7F4',
    borderRadius: 8,
    paddingHorizontal: CART_SPACING.sm,
    paddingVertical: hp('0.5%'),
  },
  actionPill: {
    borderRadius: CART_RADIUS.pill,
    backgroundColor: '#0C382E',
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('0.6%'),
  },
  actionText: {
    letterSpacing: 0.6,
    color: '#FFFFFF',
  },
  cardTitle: {
    marginTop: CART_SPACING.md,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F0ECE6',
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
    paddingVertical: hp('4%'),
    paddingHorizontal: wp('6%'),
  },
  emptyAvatarWrapper: {
    width: wp('22%'),
    height: wp('22%'),
    borderRadius: wp('11%'),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECEAE5',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('1.8%'),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  emptyImage: {
    width: wp('22%'),
    height: wp('22%'),
  },
  emptyTitle: {
    color: '#0C382E',
    letterSpacing: 0.2,
    marginBottom: hp('0.5%'),
  },
  emptyNote: {
    textAlign: 'center',
    paddingHorizontal: wp('6%'),
    lineHeight: hp('2.2%'),
  },
});

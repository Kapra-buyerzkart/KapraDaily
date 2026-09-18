import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CART_COLORS, CART_FONTS, fs, s } from '../screens/Cart/cartRedesignTheme';

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
    <Ionicons name={icon} size={s(13)} color={CART_COLORS.textMuted} />
    <Text style={styles.metaChipText}>{label}</Text>
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
      activeOpacity={0.88}
      onPress={() => onPress(item)}
      style={styles.card}
    >
      <View style={styles.cardTopRow}>
        <View style={styles.codeChip}>
          <Ionicons
            name="pricetag-outline"
            size={s(13)}
            color={CART_COLORS.darkEmerald}
            style={{ transform: [{ rotate: '-45deg' }] }}
          />
          <Text style={styles.codeText}>{code}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onPress(item)}
          style={styles.actionPill}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.cardTitle}>{describeOffer(item)}</Text>

      {item.minOrderAmount > 0 || expiry ? (
        <>
          <View style={styles.cardDivider} />
          <View style={styles.metaRow}>
            {item.minOrderAmount > 0 ? (
              <MetaChip
                icon="bag-handle-outline"
                label={`Min. order ₹${item.minOrderAmount}`}
              />
            ) : null}
            {expiry ? (
              <MetaChip icon="time-outline" label={`Expires ${expiry}`} />
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
          {/* Top Handle */}
          <View style={styles.handleHitArea}>
            <View style={styles.handle} />
          </View>

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.iconCircle}>
              <Ionicons
                name={isGiftCard ? 'gift-outline' : 'pricetag-outline'}
                size={s(19)}
                color={CART_COLORS.darkEmerald}
              />
            </View>

            <View style={styles.headerCopy}>
              <Text style={styles.headerTitle}>
                {isGiftCard ? 'Apply Gift Card' : 'Apply Coupon'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {data.length > 0
                  ? `${data.length} ${noun}${
                      data.length > 1 ? 's' : ''
                    } available for you`
                  : `No ${noun}s available right now`}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={s(20)} color={CART_COLORS.textDark} />
            </TouchableOpacity>
          </View>

          {/* Manual Input Row */}
          {!isCopyOnly ? (
            <View style={styles.inputRow}>
              <View style={styles.inputCard}>
                <Ionicons
                  name="pricetag-outline"
                  size={s(16)}
                  color={CART_COLORS.textMuted}
                  style={{ transform: [{ rotate: '-45deg' }] }}
                />
                <TextInput
                  value={manualCode}
                  onChangeText={setManualCode}
                  placeholder={`Enter ${noun} code`}
                  placeholderTextColor="#9E9E9E"
                  autoCapitalize="characters"
                  autoCorrect={false}
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
                <Text
                  style={[
                    styles.applyBtnText,
                    !canApply && styles.applyBtnTextDisabled,
                  ]}
                >
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Section Header */}
          <Text style={styles.sectionLabel}>
            {isGiftCard ? 'AVAILABLE GIFT CARDS' : 'AVAILABLE COUPONS'}
          </Text>

          {/* Coupon Cards List */}
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
                  resizeMode="contain"
                />
                <Text style={styles.emptyTitle}>
                  {isGiftCard ? 'No Gift Cards Yet' : 'No Coupons Yet'}
                </Text>
                <Text style={styles.emptyNote}>
                  New offers drop in often, check back soon for special discounts.
                </Text>
              </View>
            }
            contentContainerStyle={styles.listContent}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  sheet: {
    backgroundColor: CART_COLORS.white,
    borderTopLeftRadius: s(24),
    borderTopRightRadius: s(24),
    maxHeight: '82%',
    paddingHorizontal: s(20),
    paddingTop: s(6),
    paddingBottom: Platform.OS === 'ios' ? s(34) : s(18),
    borderWidth: 1,
    borderColor: CART_COLORS.cardBorder,
  },
  handleHitArea: {
    width: '100%',
    paddingVertical: s(6),
    alignItems: 'center',
  },
  handle: {
    width: s(40),
    height: s(4),
    borderRadius: s(2),
    backgroundColor: '#DCD6CE',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
    marginTop: s(4),
    paddingBottom: s(12),
    borderBottomWidth: 1,
    borderBottomColor: CART_COLORS.cardBorderSubtle,
  },
  iconCircle: {
    width: s(38),
    height: s(38),
    borderRadius: s(19),
    backgroundColor: CART_COLORS.emeraldTint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCopy: {
    flex: 1,
    gap: s(2),
  },
  headerTitle: {
    fontFamily: CART_FONTS.serifBold,
    fontSize: fs(20),
    color: CART_COLORS.textDark,
  },
  headerSubtitle: {
    fontFamily: CART_FONTS.sansRegular,
    fontSize: fs(12),
    color: CART_COLORS.textMuted,
  },
  closeBtn: {
    width: s(32),
    height: s(32),
    borderRadius: s(16),
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: CART_COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    marginTop: s(14),
  },
  inputCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    borderWidth: 1,
    borderColor: CART_COLORS.cardBorder,
    borderRadius: s(12),
    backgroundColor: '#FAF8F5',
    paddingHorizontal: s(14),
    height: s(46),
  },
  input: {
    flex: 1,
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(13.5),
    color: CART_COLORS.textDark,
    padding: 0,
  },
  applyBtn: {
    paddingHorizontal: s(20),
    height: s(46),
    borderRadius: s(12),
    backgroundColor: CART_COLORS.darkEmerald,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnDisabled: {
    backgroundColor: '#E8E4DD',
  },
  applyBtnText: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(13),
    color: CART_COLORS.white,
    letterSpacing: 0.3,
  },
  applyBtnTextDisabled: {
    color: '#9E9E9E',
  },
  sectionLabel: {
    marginTop: s(16),
    marginBottom: s(10),
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(11),
    letterSpacing: 0.6,
    color: '#7A7A7A',
  },
  list: {
    maxHeight: s(360),
  },
  listContent: {
    paddingBottom: s(16),
    gap: s(12),
  },
  card: {
    backgroundColor: '#FAF8F5',
    borderRadius: s(14),
    padding: s(14),
    borderWidth: 1,
    borderColor: CART_COLORS.cardBorder,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: s(8),
  },
  codeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    backgroundColor: CART_COLORS.emeraldTint,
    paddingHorizontal: s(10),
    paddingVertical: s(4),
    borderRadius: s(6),
    borderWidth: 1,
    borderColor: '#C6DFD4',
  },
  codeText: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(12),
    color: CART_COLORS.darkEmerald,
    letterSpacing: 0.5,
  },
  actionPill: {
    backgroundColor: CART_COLORS.darkEmerald,
    paddingHorizontal: s(12),
    paddingVertical: s(4),
    borderRadius: s(6),
  },
  actionText: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(11),
    color: CART_COLORS.white,
    letterSpacing: 0.3,
  },
  cardTitle: {
    fontFamily: CART_FONTS.serifSemiBold,
    fontSize: fs(15),
    color: CART_COLORS.textDark,
    lineHeight: fs(20),
  },
  cardDivider: {
    height: 1,
    backgroundColor: CART_COLORS.cardBorderSubtle,
    marginVertical: s(10),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(14),
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  metaChipText: {
    fontFamily: CART_FONTS.sansRegular,
    fontSize: fs(11),
    color: CART_COLORS.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: s(36),
    gap: s(8),
  },
  emptyImage: {
    width: s(60),
    height: s(60),
    opacity: 0.8,
  },
  emptyTitle: {
    fontFamily: CART_FONTS.serifBold,
    fontSize: fs(17),
    color: CART_COLORS.textDark,
  },
  emptyNote: {
    fontFamily: CART_FONTS.sansRegular,
    fontSize: fs(12),
    color: CART_COLORS.textMuted,
    textAlign: 'center',
    paddingHorizontal: s(24),
  },
});

export default React.memo(CouponModal);

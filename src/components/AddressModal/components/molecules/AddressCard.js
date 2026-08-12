import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import CartText from '@/screens/cart/components/atoms/CartText';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  hitSlopTo,
  hp,
  wp,
} from '@/styles/cartTheme';
import AddressTypeAvatar from '../atoms/AddressTypeAvatar';
import SelectedTag from '../atoms/SelectedTag';
import MetaChip from '../atoms/MetaChip';
import CardAction from '../atoms/CardAction';

const AddressCard = ({
  item,
  onSelect,
  onEdit,
  onDelete,
  onOpenActions,
  onCloseActions,
}) => {
  const isSelected = !!item.selected;
  const showActions = !!item.threeDotsClicked;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onSelect(item.id)}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${item.type} address, ${item.address}${
        isSelected ? ', currently delivering here' : '. Tap to deliver here'
      }`}
      style={[styles.card, isSelected && styles.cardSelected]}
    >
      <AddressTypeAvatar type={item.type} active={isSelected} />

      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <CartText variant="labelStrong" numberOfLines={1}>
            {item.type}
          </CartText>

          {isSelected ? <SelectedTag /> : null}

          <View style={styles.spacer} />

          {showActions ? (
            <View style={styles.actionStrip}>
              <CardAction icon="pencil-outline" label="Edit" onPress={onEdit} />
              <View style={styles.actionDivider} />
              <CardAction
                icon="trash-can-outline"
                label="Delete"
                tone="danger"
                onPress={() => onDelete(item.id)}
              />
              <TouchableOpacity
                hitSlop={hitSlopTo(wp('4%'))}
                onPress={onCloseActions}
              >
                <AntDesign
                  name="right"
                  size={wp('3.4%')}
                  color={CART_COLORS.textFaint}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              hitSlop={hitSlopTo(wp('5%'))}
              onPress={() => onOpenActions(item.id)}
              accessibilityRole="button"
              accessibilityLabel="Address options"
            >
              <Entypo
                name="dots-three-vertical"
                size={wp('3.6%')}
                color={CART_COLORS.textFaint}
              />
            </TouchableOpacity>
          )}
        </View>

        <CartText variant="caption" tone="muted" numberOfLines={2}>
          {item.address}
        </CartText>

        <View style={styles.metaRow}>
          <MetaChip icon="phone-outline" label={item.phone} />
          <MetaChip icon="map-marker-outline" label={item.pin} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(AddressCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: CART_SPACING.md,
    borderWidth: 1,
    borderColor: CART_COLORS.border,
    borderRadius: CART_RADIUS.card,
    backgroundColor: CART_COLORS.card,
    paddingVertical: hp('1.4%'),
    paddingHorizontal: CART_SPACING.md,
    marginBottom: CART_SPACING.md,
  },
  cardSelected: {
    borderColor: CART_COLORS.borderStrong,
    backgroundColor: CART_COLORS.well,
  },
  copy: {
    flex: 1,
    gap: CART_SPACING.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
  },
  spacer: {
    flex: 1,
  },
  actionStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.xs,
    paddingHorizontal: CART_SPACING.xs,
    paddingVertical: 2,
    borderRadius: CART_RADIUS.sm,
    backgroundColor: CART_COLORS.card,
    borderWidth: 1,
    borderColor: CART_COLORS.border,
  },
  actionDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: CART_COLORS.border,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: CART_SPACING.sm,
    marginTop: 2,
  },
});

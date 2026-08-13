import { View, Text, Pressable } from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';
import { ACCENT, INK, MAX_FONT_SCALE } from '@/styles/homeTheme';
import { styles } from '../../styles';
import { CARD_EXIT, CARD_LAYOUT, entrance } from '../../motion';
import AddressTypeAvatar from '../atoms/AddressTypeAvatar';
import SelectedBadge from '../atoms/SelectedBadge';
import MetaChip from '../atoms/MetaChip';
import CardAction from '../atoms/CardAction';

const MAX_STAGGER = 4;

function AddressCard({ item, index, onSelect, onEdit, onDelete }) {
  const isSelected = !!item.selected;

  return (
    <Animated.View
      entering={entrance(Math.min(index, MAX_STAGGER))}
      exiting={CARD_EXIT}
      layout={CARD_LAYOUT}
      style={[styles.card, isSelected && styles.cardSelected]}
    >
      <Pressable
        onPress={isSelected ? undefined : onSelect}
        disabled={isSelected}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`${item.type} address, ${item.address}${
          isSelected ? ', currently delivering here' : '. Tap to deliver here'
        }`}
        style={({ pressed }) => [
          styles.cardMain,
          pressed && !isSelected && styles.cardPressed,
        ]}
      >
        <AddressTypeAvatar type={item.type} active={isSelected} />

        <View style={styles.cardCopy}>
          <View style={styles.cardTitleRow}>
            <Text
              style={styles.cardTitle}
              numberOfLines={1}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {item.type}
            </Text>
            {isSelected && <SelectedBadge />}
          </View>

          <Text
            style={styles.addressLine}
            numberOfLines={2}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {item.address}
          </Text>

          <View style={styles.metaRow}>
            <MetaChip icon="phone-outline" label={item.phone} />
            <MetaChip icon="map-marker-outline" label={item.pin} />
          </View>
        </View>
      </Pressable>

      <View style={styles.actionBar}>
        <CardAction icon="pencil-outline" label="Edit" onPress={onEdit} />
        <View style={styles.actionBarDivider} />
        <CardAction
          icon="trash-can-outline"
          label="Delete"
          tone={ACCENT.discount}
          onPress={onDelete}
        />
        {!isSelected && (
          <>
            <View style={styles.actionBarDivider} />
            <CardAction
              icon="map-marker-check-outline"
              label="Deliver here"
              tone={INK.strong}
              onPress={onSelect}
            />
          </>
        )}
      </View>
    </Animated.View>
  );
}

export default React.memo(AddressCard);

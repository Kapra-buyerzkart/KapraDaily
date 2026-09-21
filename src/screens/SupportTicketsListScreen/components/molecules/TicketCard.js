import { View, Text, Pressable } from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import { ICON, styles } from '../../styles';
import { CARD_LAYOUT, entrance } from '../../motion';
import { MAX_STAGGER, statusMeta } from '../../constants';
import { formatTicketDate } from '../../utils';
import { LUXURY_COLORS } from '../../supportLuxuryTheme';
import TicketIdTag from '../atoms/TicketIdTag';
import StatusPill from '../atoms/StatusPill';
import PriorityChip from '../atoms/PriorityChip';

function TicketCard({ item, index, onPress }) {
  const createdOn = formatTicketDate(item.createdOn || item.createdAt);

  return (
    <Animated.View
      entering={entrance(Math.min(index, MAX_STAGGER))}
      layout={CARD_LAYOUT}
      style={styles.card}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Ticket ${item.supportId}, ${
          statusMeta(item.status).label
        }. ${item.title}`}
        style={({ pressed }) => [pressed && styles.cardPressed]}
      >
        <View style={styles.cardMain}>
          <View style={styles.cardTopRow}>
            <TicketIdTag id={item.supportId} />
            <StatusPill status={item.status} />
          </View>

          <Text
            style={styles.cardTitle}
            numberOfLines={2}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {item.title}
          </Text>

          {item.message ? (
            <Text
              style={styles.cardMessage}
              numberOfLines={2}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {item.message}
            </Text>
          ) : null}

          <View style={styles.metaRow}>
            <PriorityChip priority={item.priority} />
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.cardFooterMeta}>
            <Feather
              name="calendar"
              size={ICON.meta}
              color={LUXURY_COLORS.textMuted}
            />
            <Text
              style={styles.cardFooterMetaText}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {createdOn || 'Date unavailable'}
            </Text>
          </View>

          <View style={styles.cardFooterAction}>
            <Text
              style={styles.cardFooterActionText}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              View Details
            </Text>
            <Feather
              name="chevron-right"
              size={14}
              color={LUXURY_COLORS.emerald}
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default React.memo(TicketCard);

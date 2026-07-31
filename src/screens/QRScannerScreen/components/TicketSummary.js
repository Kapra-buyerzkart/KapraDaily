import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../styles';

const TicketSummary = ({ ticketInfo, accentColor, tintColor }) => (
  <>
    {ticketInfo.attendee ? (
      <View style={styles.attendeeRow}>
        <View style={styles.attendeeCol}>
          <Text style={styles.attendeeName} numberOfLines={1}>
            {ticketInfo.attendee}
          </Text>
          {ticketInfo.eventName ? (
            <Text style={styles.eventName} numberOfLines={1}>
              {ticketInfo.eventName}
            </Text>
          ) : null}
        </View>

        {ticketInfo.category ? (
          <View style={[styles.categoryPill, { borderColor: accentColor }]}>
            <Text
              style={[styles.categoryPillText, { color: accentColor }]}
              numberOfLines={1}
            >
              {ticketInfo.category.toUpperCase()}
            </Text>
          </View>
        ) : null}
      </View>
    ) : null}

    {ticketInfo.meta.length ? (
      <View style={[styles.metaRow, { backgroundColor: tintColor }]}>
        {ticketInfo.meta.map(cell => (
          <View key={cell.label} style={styles.metaCell}>
            <Text style={styles.metaLabel}>{cell.label}</Text>
            <Text style={styles.metaValue} numberOfLines={1}>
              {cell.value}
            </Text>
          </View>
        ))}
      </View>
    ) : null}
  </>
);

export default React.memo(TicketSummary);

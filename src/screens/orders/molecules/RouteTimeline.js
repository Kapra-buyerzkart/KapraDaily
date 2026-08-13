import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OrderText from '../atoms/OrderText';
import IconDisc from '../atoms/IconDisc';
import { COLORS, RADIUS, SPACING, wp } from '../theme';

const DISC = wp('9%');

const Stop = ({ icon, tone, iconColor, title, lines, last }) => (
  <View style={styles.row}>
    <View style={styles.rail}>
      <IconDisc size={DISC} tone={tone} radius={RADIUS.sm}>
        <Ionicons name={icon} size={DISC * 0.48} color={iconColor} />
      </IconDisc>
      {!last && <View style={styles.connector} />}
    </View>

    <View style={[styles.copy, last && styles.copyLast]}>
      <OrderText variant="labelStrong">{title}</OrderText>
      {lines.filter(Boolean).map((line, index) => (
        <OrderText
          key={`${line}-${index}`}
          variant="caption"
          tone={index === 0 ? 'secondary' : 'muted'}
          numberOfLines={2}
          ellipsizeMode="tail"
          style={styles.line}
        >
          {line}
        </OrderText>
      ))}
    </View>
  </View>
);

const RouteTimeline = ({ store, destination }) => (
  <View>
    <Stop
      icon="storefront"
      tone="neutral"
      iconColor={COLORS.textSecondary}
      title={store.title}
      lines={store.lines}
    />
    <Stop
      icon="location"
      tone="success"
      iconColor={COLORS.success}
      title={destination.title}
      lines={destination.lines}
      last
    />
  </View>
);

export default React.memo(RouteTimeline);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  rail: {
    alignItems: 'center',
  },
  connector: {
    flex: 1,
    width: 2,
    minHeight: SPACING.lg,
    borderRadius: 2,
    backgroundColor: COLORS.lineStrong,
    marginVertical: SPACING.xs,
  },
  copy: {
    flex: 1,
    marginLeft: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  copyLast: {
    paddingBottom: 0,
  },
  line: {
    marginTop: 2,
  },
});

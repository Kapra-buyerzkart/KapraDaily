import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AnimatedPressable from '@/components/AnimatedPressable';
import OrderText from '../atoms/OrderText';
import Surface from '../atoms/Surface';
import IconDisc from '../atoms/IconDisc';
import { COLORS, RADIUS, SPACING, TOUCH_MIN, wp } from '../theme';

const DISC = wp('11.5%');

const DeliveryPartnerCard = ({ name, phone, awaiting }) => {
  const displayName = awaiting ? 'Partner not assigned yet' : name;

  return (
    <Surface style={styles.card}>
      <IconDisc
        size={DISC}
        tone={awaiting ? 'neutral' : 'success'}
        radius={RADIUS.pill}
      >
        <Ionicons
          name={awaiting ? 'time-outline' : 'bicycle'}
          size={DISC * 0.45}
          color={awaiting ? COLORS.textMuted : COLORS.success}
        />
      </IconDisc>

      <View style={styles.copy}>
        <OrderText variant="bodyStrong" numberOfLines={1}>
          {displayName}
        </OrderText>
        <OrderText variant="caption" tone="muted" style={styles.role}>
          {awaiting ? 'We will assign one shortly' : 'Your delivery partner'}
        </OrderText>
      </View>

      {awaiting ? (
        <View style={styles.waitPill}>
          <OrderText variant="captionStrong" tone="muted">
            Awaiting
          </OrderText>
        </View>
      ) : (
        <AnimatedPressable
          style={[styles.call, !phone && styles.callDisabled]}
          disabled={!phone}
          onPress={() => phone && Linking.openURL(`tel:${phone}`)}
          accessibilityRole="button"
          accessibilityLabel={`Call ${displayName}`}
          accessibilityState={{ disabled: !phone }}
        >
          <Ionicons name="call" size={wp('3.8%')} color={COLORS.onDark} />
          <OrderText variant="labelStrong" tone="onDark">
            Call
          </OrderText>
        </AnimatedPressable>
      )}
    </Surface>
  );
};

export default React.memo(DeliveryPartnerCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  copy: {
    flex: 1,
    marginHorizontal: SPACING.md,
  },
  role: {
    marginTop: 2,
  },
  waitPill: {
    backgroundColor: COLORS.well,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
  },
  call: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
    backgroundColor: COLORS.success,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.lg,
    minHeight: TOUCH_MIN - 10,
  },
  callDisabled: {
    opacity: 0.45,
  },
});

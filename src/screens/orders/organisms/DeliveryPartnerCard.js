import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { FONTS } from '@/styles/typography';
import {
  ACCENT,
  INK,
  RADIUS,
  SPACE,
  SURFACE,
  TYPE,
  TOUCH_MIN,
  MAX_FONT_SCALE,
} from '@/styles/homeTheme';
import AnimatedPressable from '@/components/AnimatedPressable';
import SurfaceCard from '../atoms/SurfaceCard';

const DeliveryPartnerCard = ({ name, phone, awaiting }) => {
  const displayName = awaiting ? 'Partner not assigned yet' : name;

  return (
    <SurfaceCard style={styles.card}>
      <View
        style={[
          styles.avatar,
          awaiting ? styles.avatarIdle : styles.avatarLive,
        ]}
      >
        <Ionicons
          name={awaiting ? 'time-outline' : 'bicycle'}
          size={wp('5.2%')}
          color={awaiting ? INK.muted : ACCENT.successText}
        />
      </View>

      <View style={styles.copy}>
        <Text
          style={styles.name}
          numberOfLines={1}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          {displayName}
        </Text>
        <Text style={styles.role} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          {awaiting ? 'We will assign one shortly' : 'Your delivery partner'}
        </Text>
      </View>

      {awaiting ? (
        <View style={styles.waitPill}>
          <Text style={styles.waitText} maxFontSizeMultiplier={MAX_FONT_SCALE}>
            Awaiting
          </Text>
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
          <Ionicons name="call" size={wp('3.8%')} color={INK.onDark} />
          <Text style={styles.callText} maxFontSizeMultiplier={MAX_FONT_SCALE}>
            Call
          </Text>
        </AnimatedPressable>
      )}
    </SurfaceCard>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: wp('11.5%'),
    height: wp('11.5%'),
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLive: {
    backgroundColor: ACCENT.successSoft,
  },
  avatarIdle: {
    backgroundColor: SURFACE.sunken,
  },
  copy: {
    flex: 1,
    marginHorizontal: SPACE.md,
  },
  name: {
    ...TYPE.body,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    letterSpacing: -0.2,
  },
  role: {
    ...TYPE.caption,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.medium,
    color: INK.muted,
    marginTop: 2,
  },
  waitPill: {
    backgroundColor: SURFACE.sunken,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.xs + 2,
  },
  waitText: {
    ...TYPE.caption,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.muted,
  },
  call: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACCENT.success,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACE.base,
    minHeight: TOUCH_MIN - 10,
  },
  callDisabled: {
    opacity: 0.45,
  },
  callText: {
    ...TYPE.label,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    color: INK.onDark,
    marginLeft: SPACE.xs + 2,
  },
});

export default React.memo(DeliveryPartnerCard);

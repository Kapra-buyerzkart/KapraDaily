import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileAvatarBadge from '@/components/ProfileAvatarBadge';
import { ProfileText, PressableScale } from '../atoms';
import { PRIVILEGE_INK, PRIVILEGE_SOFT } from '../styles';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  wp,
} from '@/styles/cartTheme';

const IdentityRow = ({ profile, isPrivileged, onEditProfile }) => (
  <View style={styles.row}>
    <ProfileAvatarBadge size={wp('13.5%')} isPrivileged={isPrivileged} />

    <View style={styles.copy}>
      <ProfileText variant="heading" numberOfLines={1}>
        {profile?.custName}
      </ProfileText>
      <ProfileText variant="caption" tone="muted" numberOfLines={1}>
        {profile?.phoneNo}
      </ProfileText>

      {!!isPrivileged && (
        <View style={styles.privilegeChip}>
          <MaterialCommunityIcons
            name="crown"
            size={wp('2.7%')}
            color={PRIVILEGE_INK}
          />
          <ProfileText variant="micro" tone={PRIVILEGE_INK}>
            Privilege Member
          </ProfileText>
        </View>
      )}
    </View>

    <PressableScale
      to={0.94}
      contentStyle={styles.editChip}
      onPress={onEditProfile}
      accessibilityRole="button"
      accessibilityLabel="Edit profile"
    >
      <MaterialCommunityIcons
        name="pencil-outline"
        size={wp('3.2%')}
        color={CART_COLORS.textSecondary}
      />
      <ProfileText variant="micro" tone="secondary">
        Edit
      </ProfileText>
    </PressableScale>
  </View>
);

export default React.memo(IdentityRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.md,
    paddingHorizontal: CART_SPACING.lg,
    paddingVertical: CART_SPACING.lg - 2,
  },
  copy: {
    flex: 1,
    gap: 1,
  },
  privilegeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 3,
    marginTop: CART_SPACING.xs + 1,
    paddingHorizontal: CART_SPACING.sm,
    paddingVertical: 2,
    borderRadius: CART_RADIUS.pill,
    backgroundColor: PRIVILEGE_SOFT,
  },
  editChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.xs,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: CART_SPACING.xs + 2,
    borderRadius: CART_RADIUS.pill,
    backgroundColor: CART_COLORS.well,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CART_COLORS.border,
  },
});

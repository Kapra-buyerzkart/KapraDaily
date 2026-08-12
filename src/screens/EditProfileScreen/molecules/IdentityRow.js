import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProfileAvatarBadge from '@/components/ProfileAvatarBadge';
import EditText from '@/screens/cart/components/atoms/CartText';
import { CART_SPACING, wp } from '@/styles/cartTheme';

const IdentityRow = ({ name, phone, isPrivileged }) => {
  const trimmed = (name || '').trim();

  return (
    <View style={styles.row}>
      <ProfileAvatarBadge size={wp('13.5%')} isPrivileged={isPrivileged} />

      <View style={styles.copy}>
        <EditText
          variant="heading"
          tone={trimmed ? 'primary' : 'faint'}
          numberOfLines={1}
        >
          {trimmed || 'Your name'}
        </EditText>
        {!!phone && (
          <EditText variant="caption" tone="muted" numberOfLines={1}>
            {phone}
          </EditText>
        )}
      </View>
    </View>
  );
};

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
});

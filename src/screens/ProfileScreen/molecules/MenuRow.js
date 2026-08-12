import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { ProfileText, IconDisc, RowChevron } from '../atoms';
import { CART_COLORS, CART_SPACING, hp, wp } from '@/styles/cartTheme';

const MenuRow = ({ label, icon, tone = 'neutral', textColor, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    accessibilityRole="button"
    accessibilityLabel={label}
  >
    <IconDisc size={wp('9%')} tone={tone}>
      {icon}
    </IconDisc>

    <View style={styles.copy}>
      <ProfileText
        variant="label"
        tone={textColor || 'secondary'}
        numberOfLines={1}
      >
        {label}
      </ProfileText>
    </View>

    <RowChevron color={textColor || CART_COLORS.textFaint} />
  </Pressable>
);

export default React.memo(MenuRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.md,
    paddingHorizontal: CART_SPACING.lg,
    paddingVertical: hp('1.1%'),
  },
  rowPressed: {
    backgroundColor: CART_COLORS.well,
  },
  copy: {
    flex: 1,
  },
});

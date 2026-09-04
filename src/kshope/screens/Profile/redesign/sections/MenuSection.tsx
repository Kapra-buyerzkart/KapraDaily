import React, { Fragment } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { AppText, Surface, Divider, IconDisc } from '../../../../components/atoms';
import { RowChevron, SectionLabel } from '../atoms';
import { UI_COLORS, UI_SPACING, hp, wp } from '../../../../theme/tokens';

const DIVIDER_INSET = UI_SPACING.lg + wp('9%') + UI_SPACING.md;

export interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  tone?: string;
  textColor?: string;
  onPress?: () => void;
}

const MenuRow: React.FC<MenuItem> = ({
  label,
  icon,
  tone = 'neutral',
  textColor,
  onPress,
}) => (
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
      <AppText variant="label" tone={textColor || 'secondary'} numberOfLines={1}>
        {label}
      </AppText>
    </View>

    <RowChevron color={textColor || UI_COLORS.textFaint} />
  </Pressable>
);

const MenuSection: React.FC<{ title: string; items: MenuItem[] }> = ({
  title,
  items,
}) => (
  <View style={styles.section}>
    <SectionLabel>{title}</SectionLabel>

    <Surface>
      {items.map((item, index) => (
        <Fragment key={item.key}>
          <MenuRow {...item} />
          {index < items.length - 1 && <Divider inset={DIVIDER_INSET} />}
        </Fragment>
      ))}
    </Surface>
  </View>
);

export default React.memo(MenuSection);

const styles = StyleSheet.create({
  section: {
    marginTop: UI_SPACING.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.md,
    paddingHorizontal: UI_SPACING.lg,
    paddingVertical: hp('1.1%'),
  },
  rowPressed: {
    backgroundColor: UI_COLORS.well,
  },
  copy: {
    flex: 1,
  },
});

import React, { Fragment } from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Divider, SectionLabel } from '../atoms';
import MenuRow from '../molecules/MenuRow';
import { CART_SPACING, wp } from '@/styles/cartTheme';

const DIVIDER_INSET = CART_SPACING.lg + wp('9%') + CART_SPACING.md;

const MenuSection = ({ title, items }) => (
  <View style={styles.section}>
    <SectionLabel>{title}</SectionLabel>

    <Surface>
      {items.map((item, index) => (
        <Fragment key={item.key}>
          <MenuRow
            label={item.label}
            icon={item.icon}
            tone={item.tone}
            textColor={item.textColor}
            onPress={item.onPress}
          />
          {index < items.length - 1 && !item.hideDividerAfter && (
            <Divider inset={DIVIDER_INSET} />
          )}
        </Fragment>
      ))}
    </Surface>
  </View>
);

export default React.memo(MenuSection);

const styles = StyleSheet.create({
  section: {
    marginTop: CART_SPACING.xl,
  },
});

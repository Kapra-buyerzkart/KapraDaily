import React from 'react';
import { StyleSheet } from 'react-native';
import { AppIcons } from '../../../assets/icons';
import { PressableScale, ShopText } from '../atoms';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  hp,
  wp,
} from '@/styles/cartTheme';

interface SearchFieldProps {
  placeholder?: string;
  onPress: () => void;
}

const SearchField: React.FC<SearchFieldProps> = ({
  placeholder = 'Search product',
  onPress,
}) => (
  <PressableScale
    to={0.99}
    onPress={onPress}
    style={styles.field}
    contentStyle={styles.content}
    accessibilityRole="search"
    accessibilityLabel={placeholder}
  >
    <AppIcons.Search size={wp('4.8%')} color={CART_COLORS.textMuted} />
    <ShopText variant="body" tone="muted" style={styles.placeholder}>
      {placeholder}
    </ShopText>
    <AppIcons.Microphone size={wp('4.8%')} color={CART_COLORS.textPrimary} />
  </PressableScale>
);

export default React.memo(SearchField);

const styles = StyleSheet.create({
  field: {
    height: hp('5.6%'),
    borderRadius: CART_RADIUS.pill,
    backgroundColor: CART_COLORS.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CART_COLORS.border,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm + 2,
    paddingHorizontal: CART_SPACING.lg,
  },
  placeholder: {
    flex: 1,
  },
});

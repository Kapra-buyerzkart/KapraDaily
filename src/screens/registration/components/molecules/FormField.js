import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import FieldLabel from '../atoms/FieldLabel';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  CART_TYPE,
  MAX_FONT_SCALE,
  hp,
} from '../../../../styles/cartTheme';

const FormField = ({
  label,
  required = false,
  accessory,
  containerStyle,
  onFocus,
  onBlur,
  ...inputProps
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <FieldLabel required={required}>{label}</FieldLabel>

      <View style={[styles.field, focused && styles.fieldFocused]}>
        <TextInput
          maxFontSizeMultiplier={MAX_FONT_SCALE}
          placeholderTextColor={CART_COLORS.textFaint}
          {...inputProps}
          style={styles.input}
          onFocus={event => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={event => {
            setFocused(false);
            onBlur?.(event);
          }}
        />
        {accessory}
      </View>
    </View>
  );
};

export default React.memo(FormField);

const styles = StyleSheet.create({
  container: {
    gap: CART_SPACING.xs,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
    minHeight: hp('6%'),
    paddingHorizontal: CART_SPACING.md,
    borderRadius: CART_RADIUS.input,
    borderWidth: 1,
    borderColor: CART_COLORS.border,
    backgroundColor: CART_COLORS.well,
  },
  fieldFocused: {
    borderColor: CART_COLORS.primaryEdge,
    backgroundColor: CART_COLORS.card,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    color: CART_COLORS.textPrimary,
    ...CART_TYPE.body,
  },
});

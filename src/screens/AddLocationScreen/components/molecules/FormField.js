import React, { forwardRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { FieldError, FieldLabel } from '../atoms';
import {
  COLORS,
  FIELD_HEIGHT,
  HAIRLINE,
  MAX_FONT_SCALE,
  RADIUS,
  SPACING,
  TYPE,
} from '../../theme';

const FormField = forwardRef(
  (
    {
      label,
      required,
      error,
      wrapperStyle,
      inputStyle,
      onFocus,
      onBlur,
      ...inputProps
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const hasError = !!error;

    return (
      <View style={[styles.wrapper, wrapperStyle]}>
        <FieldLabel
          label={label}
          required={required}
          isActive={focused}
          hasError={hasError}
        />
        <TextInput
          ref={ref}
          placeholderTextColor={COLORS.textFaint}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
          accessibilityLabel={label}
          {...inputProps}
          style={[
            styles.input,
            focused && styles.inputFocused,
            hasError && styles.inputError,
            inputStyle,
          ]}
          onFocus={event => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={event => {
            setFocused(false);
            onBlur?.(event);
          }}
        />
        <FieldError message={error} />
      </View>
    );
  },
);

FormField.displayName = 'FormField';

export default React.memo(FormField);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.lg,
    position: 'relative',
  },
  input: {
    minHeight: FIELD_HEIGHT,
    borderWidth: HAIRLINE,
    borderColor: COLORS.line,
    borderRadius: RADIUS.input,
    backgroundColor: COLORS.well,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    ...TYPE.label,
    color: COLORS.textPrimary,
  },
  inputFocused: {
    borderWidth: 1.2,
    borderColor: COLORS.lineStrong,
    backgroundColor: COLORS.surface,
  },
  inputError: {
    borderWidth: 1.2,
    borderColor: COLORS.danger,
    backgroundColor: COLORS.surface,
  },
});

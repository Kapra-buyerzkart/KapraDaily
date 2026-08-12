import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { FieldLabel } from '../atoms';
import {
  COLORS,
  FIELD_HEIGHT,
  HAIRLINE,
  MAX_FONT_SCALE,
  RADIUS,
  SPACING,
  TYPE,
} from '../../theme';

const FormField = ({
  label,
  required,
  wrapperStyle,
  inputStyle,
  ...inputProps
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <FieldLabel label={label} required={required} isActive={focused} />
      <TextInput
        placeholderTextColor={COLORS.textFaint}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        {...inputProps}
        style={[styles.input, focused && styles.inputFocused, inputStyle]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
};

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
    borderWidth: 1,
    borderColor: COLORS.lineStrong,
    backgroundColor: COLORS.surface,
  },
});

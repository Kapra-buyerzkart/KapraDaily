import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import FieldLabel from '../atoms/FieldLabel';

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
      {label ? <FieldLabel required={required}>{label}</FieldLabel> : null}

      <View style={[styles.field, focused && styles.fieldFocused]}>
        <TextInput
          placeholderTextColor="rgba(255, 255, 255, 0.45)"
          selectionColor="#FFFFFF"
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
    gap: 6,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#0A2A20',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  fieldFocused: {
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Lexend-Medium',
  },
});

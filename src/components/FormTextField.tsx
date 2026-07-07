import React from 'react';
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { COLORS } from '../styles/colors';
import { FONTS } from '../styles/typography';

interface FormTextFieldProps<T extends FieldValues>
  extends Omit<TextInputProps, 'onChangeText' | 'onBlur' | 'value'> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  rules?: RegisterOptions<T, Path<T>>;
}

function FormTextField<T extends FieldValues>({
  control,
  name,
  label,
  rules,
  style,
  ...textInputProps
}: FormTextFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          {label && <Text style={styles.label}>{label}</Text>}
          <TextInput
            style={[styles.input, error && styles.inputError, style]}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            placeholderTextColor={COLORS.gray500}
            {...textInputProps}
          />
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
}

export default FormTextField;

const styles = StyleSheet.create({
  container: {
    marginBottom: wp('4%'),
  },
  label: {
    fontSize: wp('3.2%'),
    color: COLORS.textSecondary,
    fontFamily: FONTS.gilroy.regular,
    marginBottom: wp('1.5%'),
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: wp('2%'),
    paddingHorizontal: wp('3.5%'),
    paddingVertical: wp('2.8%'),
    fontSize: wp('3.6%'),
    color: COLORS.textPrimary,
    fontFamily: FONTS.gilroy.regular,
    backgroundColor: COLORS.card,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: wp('2.9%'),
    color: COLORS.error,
    fontFamily: FONTS.gilroy.regular,
    marginTop: wp('1%'),
  },
});

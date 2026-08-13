import React from 'react';
import { StyleSheet } from 'react-native';
import ProfileTextField from './ProfileTextField';

const digitsOf = text => text.replace(/\D/g, '').slice(0, 8);

const toDigits = canonical => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(canonical || '');
  return match ? `${match[3]}${match[2]}${match[1]}` : '';
};

const toCanonical = digits =>
  digits.length === 8
    ? `${digits.slice(4)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`
    : digits;

const toDisplay = digits =>
  [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)]
    .filter(Boolean)
    .join(' / ');

const DateOfBirthField = React.forwardRef(({ value, onChange, error }, ref) => {
  const [digits, setDigits] = React.useState(() => toDigits(value));

  React.useEffect(() => {
    const next = toDigits(value);
    if (next && next !== digits) setDigits(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChangeText = text => {
    const next = digitsOf(text);
    setDigits(next);
    onChange(toCanonical(next));
  };

  return (
    <ProfileTextField
      ref={ref}
      label="Date of Birth"
      icon="cake-variant-outline"
      optional
      placeholder="DD / MM / YYYY"
      value={toDisplay(digits)}
      onChangeText={handleChangeText}
      keyboardType="number-pad"
      maxLength={14}
      inputStyle={styles.dateInput}
      error={error}
    />
  );
});

DateOfBirthField.displayName = 'DateOfBirthField';

export default DateOfBirthField;

const styles = StyleSheet.create({
  dateInput: {
    letterSpacing: 1.2,
  },
});

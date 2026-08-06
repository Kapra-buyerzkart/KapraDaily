import React from 'react';
import type { TextInput } from 'react-native';
import ProfileTextField from './ProfileTextField';
import { styles } from '../styles';

const digitsOf = (text: string) => text.replace(/\D/g, '').slice(0, 8);

const toDigits = (canonical: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(canonical || '');
  return match ? `${match[3]}${match[2]}${match[1]}` : '';
};

const toCanonical = (digits: string) =>
  digits.length === 8
    ? `${digits.slice(4)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`
    : digits;

const toDisplay = (digits: string) =>
  [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)]
    .filter(Boolean)
    .join(' / ');

type DateOfBirthFieldProps = {
  value: string;
  onChange: (canonical: string) => void;
  error?: string;
};

const DateOfBirthField = React.forwardRef<TextInput, DateOfBirthFieldProps>(
  ({ value, onChange, error }, ref) => {
    const [digits, setDigits] = React.useState(() => toDigits(value));

    React.useEffect(() => {
      const next = toDigits(value);
      if (next && next !== digits) setDigits(next);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleChangeText = (text: string) => {
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
        inputStyle={styles.fieldInputDate}
        error={error}
      />
    );
  },
);

DateOfBirthField.displayName = 'DateOfBirthField';

export default DateOfBirthField;

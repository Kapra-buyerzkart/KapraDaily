import React from 'react';
import type { TextInput } from 'react-native';
import ProfileTextField from './ProfileTextField';
import { styles } from '../styles';

// The old field asked for "Date of Birth (YYYY-MM-DD)" and left the user to
// type the dashes in the right places, in an order nobody writes a birthday in.
// This one takes eight digits off the number pad and lays the mask in as they
// arrive, so the format is something the field does rather than something the
// label has to explain.
//
// The API still wants YYYY-MM-DD, so that stays the value the screen holds; the
// day-first display lives in here and nowhere else. A half-typed date is passed
// up as its bare digits — deliberately not a date, so the screen's own
// validation catches it on save instead of this component silently deciding a
// partial entry means "no birthday".

const digitsOf = (text: string) => text.replace(/\D/g, '').slice(0, 8);

// YYYY-MM-DD → DDMMYYYY. Anything that is not a complete canonical date has no
// display form yet, which is what keeps a partial entry from being re-parsed as
// though it were saved.
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

    // Profile resolves after first paint, so a saved birthday can arrive after
    // this field has already mounted empty. Only a complete canonical date has
    // a display form, so this can never fight a user mid-entry — a partial
    // value round-trips as '' and is ignored.
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

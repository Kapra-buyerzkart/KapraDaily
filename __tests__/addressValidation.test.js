import {
  ADDRESS_MESSAGES,
  ADDRESS_RULES,
  buildDefaultValues,
} from '../src/screens/AddLocationScreen/validationSchema';

const run = (rule, value) => rule(value);

describe('address form rules', () => {
  it('rejects a blank or too-short house number', () => {
    expect(run(ADDRESS_RULES.addLine1.validate.notBlank, '   ')).toBe(
      ADDRESS_MESSAGES.addLine1.required,
    );
    expect(run(ADDRESS_RULES.addLine1.validate.minLength, 'ab')).toBe(
      ADDRESS_MESSAGES.addLine1.tooShort,
    );
    expect(run(ADDRESS_RULES.addLine1.validate.minLength, '12/A Rose')).toBe(
      true,
    );
  });

  it('accepts only a 6-digit PIN not starting with zero', () => {
    const { value: pattern } = ADDRESS_RULES.pincode.pattern;
    expect(pattern.test('682030')).toBe(true);
    expect(pattern.test('082030')).toBe(false);
    expect(pattern.test('68203')).toBe(false);
  });

  it('requires an area selection', () => {
    expect(run(ADDRESS_RULES.pincodeAreaId.validate.selected, null)).toBe(
      ADDRESS_MESSAGES.pincodeAreaId.required,
    );
    expect(run(ADDRESS_RULES.pincodeAreaId.validate.selected, 42)).toBe(true);
  });

  it('validates indian mobile numbers', () => {
    expect(run(ADDRESS_RULES.phone.validate.length, '98765432')).toBe(
      ADDRESS_MESSAGES.phone.length,
    );
    expect(run(ADDRESS_RULES.phone.validate.prefix, '1234567890')).toBe(
      ADDRESS_MESSAGES.phone.prefix,
    );
    expect(run(ADDRESS_RULES.phone.validate.length, '9876543210')).toBe(true);
    expect(run(ADDRESS_RULES.phone.validate.prefix, '9876543210')).toBe(true);
  });

  it('keeps names to letters and simple punctuation', () => {
    expect(run(ADDRESS_RULES.custName.validate.pattern, 'Justin P.')).toBe(
      true,
    );
    expect(run(ADDRESS_RULES.custName.validate.pattern, 'Justin99')).toBe(
      ADDRESS_MESSAGES.custName.pattern,
    );
  });

  it('seeds defaults from an address being edited', () => {
    expect(buildDefaultValues(undefined)).toMatchObject({
      addressType: 'HOME',
      pincodeAreaId: null,
      phone: '',
    });
    expect(
      buildDefaultValues({ custName: 'Ann', addressType: 'OFFICE' }),
    ).toMatchObject({ custName: 'Ann', addressType: 'OFFICE' });
  });
});

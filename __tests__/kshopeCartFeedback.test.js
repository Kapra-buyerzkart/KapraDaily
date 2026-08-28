import {
  isCartSuccess,
  cartErrorMessage,
} from '../src/kshope/utils/cartFeedback';

describe('isCartSuccess', () => {
  it('accepts only an explicit success flag', () => {
    expect(isCartSuccess({ success: true })).toBe(true);
    expect(isCartSuccess({ success: false })).toBe(false);
  });

  it('rejects the shapes a failed kshope call actually produces', () => {
    expect(isCartSuccess(undefined)).toBe(false);
    expect(isCartSuccess(null)).toBe(false);
    expect(isCartSuccess({})).toBe(false);
  });

  it('rejects the live PRODUCT_NOT_FOUND body verbatim', () => {
    expect(
      isCartSuccess({
        success: false,
        status: 'PRODUCT_NOT_FOUND',
        message: 'Vendor offer not found',
        data: null,
      }),
    ).toBe(false);
  });
});

describe('cartErrorMessage', () => {
  it('prefers the message the backend sent', () => {
    expect(
      cartErrorMessage(
        { success: false, message: 'Vendor offer not found' },
        'Could not add to cart',
      ),
    ).toBe('Vendor offer not found');
  });

  it('falls back when the backend leaves message null or blank', () => {
    expect(cartErrorMessage({ success: false, message: null }, 'fallback')).toBe(
      'fallback',
    );
    expect(cartErrorMessage({ success: false, message: '   ' }, 'fallback')).toBe(
      'fallback',
    );
  });

  it('falls back when there is no response at all', () => {
    expect(cartErrorMessage(undefined, 'fallback')).toBe('fallback');
    expect(cartErrorMessage(null, 'fallback')).toBe('fallback');
  });

  it('reads the message off a thrown axios-style error', () => {
    expect(
      cartErrorMessage(
        { data: { message: 'Invalid delivery area' } },
        'fallback',
      ),
    ).toBe('Invalid delivery area');
  });

  it('never returns a non-string', () => {
    expect(cartErrorMessage({ message: 42 }, 'fallback')).toBe('fallback');
    expect(cartErrorMessage({ message: {} }, 'fallback')).toBe('fallback');
  });
});

describe('cartErrorMessage against what createApiClient actually throws', () => {
  it('reads an Error carrying the server message', () => {
    const err = new Error('Invalid delivery area');
    err.status = 400;
    expect(cartErrorMessage(err, 'fallback')).toBe('Invalid delivery area');
  });

  it('reads the bare string thrown for connectivity failures', () => {
    expect(
      cartErrorMessage(
        'Network Error. Ensure you are connected to internet.',
        'fallback',
      ),
    ).toBe('Network Error. Ensure you are connected to internet.');
    expect(cartErrorMessage('Server is not responding', 'fallback')).toBe(
      'Server is not responding',
    );
  });

  it('reads the capitalised Message thrown on an identity conflict', () => {
    expect(
      cartErrorMessage(
        { Message: 'Session expired, please login again.', status: 401 },
        'fallback',
      ),
    ).toBe('Session expired, please login again.');
  });

  it('falls back rather than echoing an empty string throw', () => {
    expect(cartErrorMessage('', 'fallback')).toBe('fallback');
    expect(cartErrorMessage('  ', 'fallback')).toBe('fallback');
  });
});

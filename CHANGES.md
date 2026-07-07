# Changes — Email OTP Fallback (feature/emailOtpNew)

## Summary
Adds an email-delivery fallback for the login OTP flow. Users who don't
receive the SMS OTP after resending can request the code by email instead,
and verify it through a dedicated endpoint.

## API layer (`src/api/index.js`)
- `sendLoginOtpToEmail(email)` — sends the OTP to an email address.
  - `POST sendotpmail`
  - Payload: `{ emailId: email }`
  - Signature changed from `sendLoginOtpToEmail({ phone, email })` to
    `sendLoginOtpToEmail(email)` (phone is no longer required by this call).
- `verifyLoginOtpEmail(email, otp)` — **new.** Verifies an OTP that was
  delivered by email.
  - `POST verifyotpmail`
  - Payload: `{ phone: email, otp, otpType: 'login', loggedInFromDevice: 'app' }`
    (the backend reuses the `phone` field to carry the email address).

Both endpoints are called bare (no `auth/` prefix), matching the backend
route names as specified.

## Network layer (`src/api/networkUtils.js`)
- `checkAuthApi` now matches `sendotpmail` and `verifyotpmail` (previously
  matched the old `auth/send-login-otp-email` path), so these calls are
  correctly treated as unauthenticated auth endpoints and skip the bearer
  token / 401-refresh handling.

## `EmailOtpBottomSheet` (`src/components/EmailOtpBottomSheet.js`)
- Dropped the now-unused `phone` prop; the component only needs the email
  the user types in.
- Updated the `sendLoginOtpToEmail` call site to the new single-argument
  signature.

## `OtpScreen` (`src/screens/OtpScreen.js`)
- Added `otpEmail` state to track whether the current OTP was delivered by
  email (and to which address).
- `EmailOtpBottomSheet` no longer receives a `phone` prop.
- `handleEmailOtpSuccess(email)`:
  - Stores the email in `otpEmail`.
  - Clears the OTP input boxes and refocuses the first box so the user
    types the new code.
  - Shows the existing "OTP has been sent to your email" success toast.
- `handleContinueLogin`:
  - If `otpEmail` is set, verifies via `verifyLoginOtpEmail(otpEmail, enteredOtp)`.
  - Otherwise, falls back to the original `verifyLoginOtp(phone, enteredOtp)`
    (SMS flow, unchanged).

## Not changed
- Register and forgot-password OTP flows — unaffected, still SMS-only.
- `verifyLoginOtp` / `auth/verifyotp` — unchanged, still used for the SMS path.
- `src/screens/LoginScreen.js` — only a stray comment removed by the linter,
  no functional change.

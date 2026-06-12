# KapraDaily — App Flow Walkthrough

## Onboarding & Auth Flow

### Overview

```
App Opens
    │
    ▼
LocationFetchingNewScreen
    │
    ├── Already logged in (profile.id exists)
    │       │
    │       ▼
    │   AuthSuccessScreen
    │
    └── Guest / not logged in
            │
            ▼
        LoginScreen
            │
            ├── Existing user (has password)
            │       │
            │       ▼
            │   LoginPwdScreen ──► AuthSuccessScreen
            │
            ├── Existing user (OTP login)
            │       │
            │       ▼
            │   OtpScreen (type: login) ──► AuthSuccessScreen
            │
            └── New user (sign up)
                    │
                    ▼
                OtpScreen (type: register)
                    │
                    ▼
                RegistrationScreen
                    │
                    ▼
                AuthSuccessScreen
```

---

## Step-by-Step

### 1. Location Fetch — `LocationFetchingNewScreen`

**File:** `src/screens/LocationFetchingNewScreen.js`

- Runs on every app open (first screen in the stack).
- Requests GPS permission and reverse-geocodes the device location.
- Matches the resolved pincode against available delivery areas via `getAreasByPincode()`.
- Shows a location picker modal if multiple areas are found.
- On confirmation/skip, calls `navigateAfterLocation()`:
  - `profile.id` present → user is logged in → goes to **AuthSuccessScreen**
  - No `profile.id` → guest user → goes to **LoginScreen**

**Fallback behaviour:**
- GPS denied or geocode fails → defaults to *Panampilly Nagar* (area ID 262) and navigates.
- If `manualOverride` was set in a previous session → restores saved region and navigates immediately (1 s delay).

---

### 2. Login — `LoginScreen`

**File:** `src/screens/LoginScreen.js`

- User enters their 10-digit mobile number.
- `checkPhone()` API determines account status:
  - **Registered with password** → navigate to `LoginPwdScreen`
  - **Registered, OTP login** → navigate to `OtpScreen` with `type: 'login'`
  - **Not registered** → navigate to `OtpScreen` with `type: 'register'`

---

### 3a. Password Login — `LoginPwdScreen`

**File:** `src/screens/LoginPwdScreen.js`

- User enters password → `loginWithPassword(phone, password)`.
- On success: stores `ACCESS_TOKEN` + `REFRESH_TOKEN` in AsyncStorage.
- Navigates to **AuthSuccessScreen**.
- "Forgot password?" → `sendForgotPwdOtp()` → `OtpScreen` with `type: 'forgotPwd'`.

---

### 3b. OTP Verification — `OtpScreen`

**File:** `src/screens/OtpScreen.js`

Handles three modes via `route.params.type`:

| Mode | Triggered from | On success |
|------|----------------|------------|
| `login` | LoginScreen (OTP login) | Stores tokens → **AuthSuccessScreen** |
| `register` | LoginScreen (new user) | Gets `registerToken` → **RegistrationScreen** |
| `forgotPwd` | LoginPwdScreen | Stores `resetToken` → **ChangePwdScreen** |

- OTP is auto-sent on screen mount.
- Android: auto-reads OTP via `RNOtpVerify`.
- Resend available after 60-second countdown.

---

### 3c. Registration — `RegistrationScreen`

**File:** `src/screens/RegistrationScreen.js`

- Collects: name, email, password, pincode/area.
- Calls `registerUser({ registerToken, name, email, password, pincodeAreaId })`.
- On success: stores tokens, links OneSignal user ID → navigates to **AuthSuccessScreen**.

---

### 3d. Password Reset — `ChangePwdScreen`

**File:** `src/screens/ChangePwdScreen.js`

- User sets a new password using the `resetToken` from OTP verification.
- Calls `resetPassword(resetToken, newPassword)`.
- On success → navigates back to **LoginScreen**.

---

### 4. Feature Selection — `AuthSuccessScreen`

**File:** `src/screens/AuthSuccessScreen.js`

Landing screen after every successful auth or login. Presents four options:

| Card | Action |
|------|--------|
| **Uden Deal** | `navigation.reset` → `MainTabs` (main app) |
| **48 hrs / K-Shope** | Deep links to `udmv://`, falls back to app store |
| **Uden Tickets** | Navigates to `TicketSplashScreen` |
| **D2C** | Coming soon (no-op) |

---

### 5. Main App — `MainTabNavigator`

Entered via the Uden Deal card on `AuthSuccessScreen`.  
Tab navigator with the core app screens (home, cart, profile, etc.).

---

## Logout Flow

Handled in `AppContext.logout()`:

1. Clears all `AsyncStorage` (tokens, profile, location data).
2. Resets network state (pending queues, refresh flags).
3. Unlinks OneSignal identity.
4. Navigates to `LoginScreen` via `NavigationService.reset()`.
5. Sets a fresh guest profile in memory.

---

## Token Management

**File:** `src/api/tokenService.js`

| Function | Purpose |
|----------|---------|
| `setTokens(access, refresh)` | Persist auth tokens |
| `getAccessToken()` | Read access token |
| `getRefreshToken()` | Read refresh token |
| `clearTokens()` | Remove on logout |
| `setResetToken(token)` | Persist password-reset token |
| `getResetToken()` | Read reset token |
| `clearResetToken()` | Remove after password reset |

---

## Profile State

**File:** `src/context/appContext.js`

| Function | When called | Result |
|----------|-------------|--------|
| `loadProfile()` | App start, after login | Fetches from API; merges with AsyncStorage |
| `loadProfileTwo()` | API fails / unauthenticated | Creates guest profile with random `guestId` |
| `editPincode(item)` | Location confirmed | Updates `pincode` + `pinAddress` in profile |
| `logout()` | User logs out / session expired | Clears everything, resets to guest |

**Authenticated user** — profile has `id` field (from API).  
**Guest user** — profile has only `guestId` (no `id`).

The `navigateAfterLocation()` function in `LocationFetchingNewScreen` uses `profile?.id` to decide whether to skip straight to `AuthSuccessScreen` or prompt login.

# Bug Fix: App Asks for Login on Every Cold Start

## Branch
`hotfix/bugs`

## Date
2026-06-16

---

## Problem

After killing and restarting the app, users were always redirected to the **Login screen** (mobile number entry) even though they were already logged in. A fresh login session worked fine, but every cold start forced re-authentication.

---

## Root Cause

**File:** `src/screens/LocationFetchingNewScreen.js` — `navigateAfterLocation()` function

Every cold start passes through `LocationFetchingNewScreen` to resolve the user's location. After location is resolved, the screen calls `navigateAfterLocation()` to decide where to send the user:

```js
// BEFORE (broken)
const navigateAfterLocation = () => {
  if (profile?.id) {                          // ← always undefined
    navigation.reset({ index: 0, routes: [{ name: 'AuthSuccessScreen' }] });
  } else {
    navigation.reset({ index: 0, routes: [{ name: 'LoginScreen', params: { type: 'login' } }] });
  }
};
```

The check used `profile?.id`, but the API response stores the customer identifier as `custId` — not `id`. Since `profile.id` is always `undefined`, the condition was always `false`, and **every cold start sent the user to LoginScreen regardless of their session state**.

Fresh logins were unaffected because the OTP success flow navigates directly to the home screen, bypassing `LocationFetchingNewScreen` entirely.

---

## Fix

```js
// AFTER (fixed)
const navigateAfterLocation = () => {
  if (profile?.custId) {                      // ← correct field
    navigation.reset({ index: 0, routes: [{ name: 'AuthSuccessScreen' }] });
  } else {
    navigation.reset({ index: 0, routes: [{ name: 'LoginScreen', params: { type: 'login' } }] });
  }
};
```

Changed `profile?.id` → `profile?.custId` to match the actual field returned by the profile API and used consistently throughout `appContext.js`.

---

## Files Changed

| File | Change |
|---|---|
| `src/screens/LocationFetchingNewScreen.js` | Line 118: `profile?.id` → `profile?.custId` |

// Template for src/globals/secrets.js (which is gitignored).
//
// Setup: copy this file to `secrets.js` in the same folder and fill in the
// real values. `secrets.js` is intentionally NOT tracked by git so that keys
// never land in source control or git history.
//
//   cp src/globals/secrets.example.js src/globals/secrets.js
//
// The Google Maps key here is consumed by the JS Geocoding / Places calls.
// The native Android Maps SDK reads its key from a Gradle property instead
// (see android/gradle.properties.example and AndroidManifest.xml).

export const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

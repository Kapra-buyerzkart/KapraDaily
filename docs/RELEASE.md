# Release pipeline

Store releases are driven by git tags. Tagging `v1.2.3` builds and uploads both platforms.
Nothing version-related is ever committed — the tag is the source of truth.

| Trigger | Workflow | Result |
| --- | --- | --- |
| Push / PR to `main` | `ci.yml` | lint, typecheck, tests. No build, no secrets. |
| Push tag `v*.*.*` | `release.yml` | IPA → TestFlight, AAB → Play internal track |
| Manual dispatch | `promote.yml` | Promotes an existing build to production |

## Known state of the lint gate

`npm run lint` is **non-blocking** in `ci.yml` (`continue-on-error: true`) because the codebase
carries 99 pre-existing ESLint errors. Errors still appear in the job log. Make the step blocking
once they are cleared.

Three of them are genuine runtime bugs rather than style issues:

- `Platform` is used without being imported in `ChangePasswordScreen.js`, `ChangePwdScreen.js`
  and `RegistrationScreen.js` — these screens will throw when they render that code path.
- `msg` is referenced but never defined in `src/context/CartContext.js` (8 occurrences).
- One `react-hooks/rules-of-hooks` violation.

## Versioning

- `versionName` / `CFBundleShortVersionString` = the tag with `v` stripped.
- `versionCode` / `CFBundleVersion` = `26000 + github.run_number`.

The offset exists because the last manually-uploaded build was `versionCode 25047`, and Play
requires strictly increasing values. `run_number` starts at 1, so a bare run number would be
rejected until it passed 25047. Do not lower `VERSION_CODE_OFFSET` in `release.yml`.

Local builds are unaffected: `build.gradle` falls back to its committed defaults when
`APP_VERSION_NAME` / `APP_VERSION_CODE` are absent.

## One-time setup

### 1. App Store Connect API key

App Store Connect → **Users and Access → Integrations → App Store Connect API → Team Keys** →
generate a key with the **App Manager** role.

Download the `.p8` immediately — Apple only offers it once. Record the Key ID and Issuer ID
shown on that page.

### 2. Match certificate repository

Create a new **private, empty** GitHub repo, e.g. `udendeal-certificates`. Then, once, from a
machine that already has the distribution certificate:

```sh
export MATCH_GIT_URL=https://github.com/<org>/udendeal-certificates.git
export IOS_BUNDLE_ID=com.buyerskart.customer
export APPLE_TEAM_ID=<your team id>
bundle exec fastlane match appstore
```

The passphrase you choose becomes `MATCH_PASSWORD`. Store it in a password manager — losing it
means re-issuing certificates.

For CI read access, create a fine-grained PAT scoped to **only** that repository with
read-only Contents permission.

### 3. Android upload keystore

The keystore is not in the repo (correctly — `.gitignore` excludes `*.keystore`). Encode it:

```sh
base64 -i android/app/Buyerzkart.keystore | pbcopy
```

> The previous store password was committed to git history as `123456`. If Play App Signing is
> **not** enabled for this app, this upload key is compromised and must be rotated before relying
> on this pipeline.

### 4. Play service account

Google Cloud Console → create a service account → add a **JSON** key. Then Play Console →
**Users and permissions** → invite that service account's email → grant *Release to testing
tracks* and *Release to production*.

Verify before the first run:

```sh
bundle exec fastlane run validate_play_store_json_key json_key:/path/to/key.json
```

### 5. GitHub secrets

Repository → Settings → Secrets and variables → Actions.

| Secret | Value |
| --- | --- |
| `ASC_KEY_ID` | Key ID from step 1 |
| `ASC_ISSUER_ID` | Issuer ID from step 1 |
| `ASC_KEY_P8` | Full `.p8` contents including BEGIN/END lines |
| `APPLE_TEAM_ID` | 10-character Apple Team ID |
| `IOS_BUNDLE_ID` | `com.buyerskart.customer` |
| `MATCH_GIT_URL` | HTTPS URL of the certificates repo |
| `MATCH_PASSWORD` | Passphrase from step 2 |
| `MATCH_GIT_BASIC_AUTHORIZATION` | `echo -n "<user>:<PAT>" \| base64` |
| `ANDROID_PACKAGE_NAME` | `com.buyerskart.customer` |
| `ANDROID_KEYSTORE_BASE64` | base64 of the keystore |
| `ANDROID_KEYSTORE_PASSWORD` | Store password |
| `ANDROID_KEY_ALIAS` | Key alias |
| `ANDROID_KEY_PASSWORD` | Key password |
| `PLAY_SERVICE_ACCOUNT_JSON` | Full JSON key contents |
| `GOOGLE_MAPS_API_KEY` | Android Maps SDK key |

`GOOGLE_MAPS_API_KEY` is only consumed by the Android build. Without it the manifest placeholder
resolves to an empty string and maps fail silently at runtime rather than failing the build.

## Cutting a release

```sh
git tag v5.2.1
git push origin v5.2.1
```

Then, once the build is verified in TestFlight and on the internal track, run the **Promote to
production** workflow with the same version and the build number from the release run.

## Local device builds

`DEVELOPMENT_TEAM` resolves from `$(APPLE_TEAM_ID)` rather than a committed team ID. Simulator
builds are unaffected. For local **device** builds, export it first:

```sh
export APPLE_TEAM_ID=<your team id>
npm run ios
```

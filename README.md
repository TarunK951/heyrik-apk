# HeyRik mobile

React Native + Expo + TypeScript frontend with original bundled HeyRik brand artwork and Geist fonts, mobile navigation, sheets, and persistent local data. No backend or API connection.

## Run

```sh
npm install
npm start
npm run android
npm run web
```

Use any valid email and a password of six or more characters, or tap the demo Google button. Login opens the two-step onboarding on first use. Data stays on the current device; signing out does not clear it. No passwords are stored. The starter agent is sample data.

## Verify and build

```sh
npm run typecheck
npm run lint
npm test
npm run export:web
npm run preview
npx eas-cli build --profile preview --platform android
```

EAS cloud builds require the owner's Expo account. For a local Android APK, run `npx expo prebuild --platform android` then `android/gradlew assembleRelease` with Android SDK/JDK available. The preview EAS profile targets APK and production targets AAB.

`npm run preview` serves the exported web demo at http://127.0.0.1:8082 with a routing fallback. Web refresh and native back navigation use Expo Router. Browser refresh starts a fresh demo sign-in session while preserving workspace records.

See [screen audit](docs/SCREEN-AUDIT.md) for observed surfaces and explicit limits. Calls, cloning, AI, connections, purchases, identity checks, retrieval, and support delivery are local simulations. Voice previews use device speech. No credentials or website account records are included.

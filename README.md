# HeyRik mobile

React Native + Expo + TypeScript frontend with original bundled HeyRik brand artwork and Geist fonts, mobile navigation, sheets, and persistent local data. No backend or API connection.

## Run

```sh
npm install
npm start
```

Scan Expo's QR in a **SDK 58-compatible Expo Go** app from a phone on the same Wi-Fi. The LAN server runs on port 8083 with two Metro workers and Fast Refresh. Use the computer's Wi-Fi IP on port 8083 for a phone browser; localhost refers to the phone itself when opened on the phone. No APK build is needed.

Use any valid email and a password of six or more characters, or tap the demo Google button. Login opens the two-step onboarding on first use. Data stays on the current device; signing out does not clear it. No passwords are stored. The starter agent is sample data.

## Verify and inspect

```sh
npm run typecheck
npm run lint
npm test
npm run export:web
npm run preview
```

`npm run preview` serves the exported web demo at http://127.0.0.1:8082 with a routing fallback. Web refresh and native back navigation use Expo Router. Browser refresh starts a fresh demo sign-in session while preserving workspace records.

See [screen audit](docs/SCREEN-AUDIT.md) for observed surfaces and explicit limits. Calls, cloning, AI, connections, purchases, identity checks, retrieval, and support delivery are local simulations. Voice previews use device speech. No credentials or website account records are included.

See [mobile refinement notes](docs/MOBILE-REFINEMENT.md) for native iOS controls, Android/web fallbacks, haptics, loading animation, responsive changes, and device-verification limits.

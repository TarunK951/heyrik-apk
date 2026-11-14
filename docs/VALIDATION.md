# Validation record

14 November 2026

- TypeScript check passed before and after Expo Router migration.
- Production web export passed, including bundled artwork/fonts.
- ESLint passed with zero warnings after unused imports were removed.
- Mobile browser checked at 390×844; document overflow check passed at width 360.
- Invalid login shows validation; valid demo login enters workspace. Both onboarding steps and agent creation verified.
- Template prefill/generation, agent rename, variable creation, call settings, and local persistence verified.
- CRM lead creation updates pipeline totals and Kanban; campaign draft saves and survives reload.
- Sample number choose → identity → review → save updates number count/rental statistics.
- All module destinations opened successfully. Expo Router bottom navigation, nested agent route, billing/back navigation, and local credit addition verified after migration.
- No physical Android device or running emulator was connected during browser verification. Native interaction, keyboard, document/audio picker, speech, and share-sheet behavior still require device QA.
- Expo Doctor passed 20/20 after correcting SDK 58 splash configuration and square launcher artwork. CSV edge-case tests passed 4/4.
- Android release packaging was attempted locally. Windows Ninja path handling was resolved temporarily, but compiler/resource failures prevented a verified APK. The original SDK Ninja binary was restored. No APK is claimed or delivered; the EAS preview profile is included for cloud builds.
- Additional website inspection verified password fields, Rik sizes, support priority/references, API-key creation layout, and both planning calculators. Calculators reproduce the observed sample results: current INR 18,750, projected INR 36,250, saving INR -17,500; missed-call revenue INR 235,872.

Full reference comparison remains bounded by empty live account data. See SCREEN-AUDIT.md for unverified/inferred surfaces. Browser QA used local sample data, which is not bundled as user data in source.

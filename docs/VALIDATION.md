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

## Mobile refinement pass

- Lint and TypeScript pass on the final source; CSV tests pass 4/4; Expo Doctor passes 20/20.
- Reviewed iOS, Android, and web production bundles all exported successfully. These are bundles, not APK/device test results.
- Expo LAN server runs on port 8083; the static snapshot on port 8082 was refreshed.
- Browser checks include all five primary tabs, all 12 More destinations at 320 CSS pixels, all six editor sections, all billing/settings sections, dropdowns, chat text/reply/navigation, lead save, template creation, and back-to-top/tab reselection. Also inspected at 358 and 393 CSS pixels.
- The loading animation respects Reduce Motion; haptics are configured for devices and disabled on web. Physical iOS/Android behavior remains for Expo Go review. No APK was built in this pass, as requested.

## Performance refinement — 2026-11-15

- Removed the artificial 800 ms startup delay; the animated loader remains during font/storage loading.
- Memoized agent/workspace screen boundaries and stabilized navigation callbacks so header search, toast and back-to-top state do not needlessly render the screen subtree. Store updates continue to render normally.
- Closed dropdowns no longer mount modal/list content or filter options. Search normalizes the query once per update.
- Native persistence serializes only after the existing save delay, coalescing rapid edits. Background/timer notifications write each snapshot once; web keeps immediate persistence.
- Lint, TypeScript, four CSV tests, and production web export passed. No device benchmark or measured FPS improvement is claimed; native device regression testing remains outstanding.

## Website/mobile audit — 2026-11-16

See PAGE-AUDIT-2026-11-16.md for the page-by-page coverage, fixes, measurements and verification limits. Final lint/typecheck pass, CSV tests pass 4/4, and all three platform bundles export. Browser review covers five tabs, twelve secondary modules, six editor sections, billing/settings sections, creation forms and local persistence. Native device behavior remains unverified. No APK was generated.

## Search/chat row refinement

Moved workspace search into a stretched entry below the compact header, with Ask Rik beside it on all five primary tabs. Checked the layout at 320 px and approximately 393 px, search-sheet opening and chat navigation. Lint, TypeScript and production web export passed.

Assistant-list arrangement: centered Browse templates, separated the list with a divider, and placed assistant search beside its heading. Checked at 320 px and approximately 393 px, including filtering and opening templates. Lint, TypeScript and web export passed.

## Compact search and filter rows

Removed the assistant-list heading/count and replaced list searches with accessible icon controls that reveal a focused input on demand. Closing search clears its query. Shared toolbars group dropdowns and search/actions on Calls, CRM, Campaigns, Knowledge Base, Connections, Chatbot, voice library, tickets, agent variables/sources, voice selection and chart selection. Kept centered templates and consistent section dividers. Checked search expansion/clear, actual assistant/voice filtering, dropdown selection and CRM view switching; inspected at 320, approximately 393 and 430 px with no document overflow. Lint, TypeScript, web export and native bundle exports passed; physical-device keyboard behavior remains unverified. See screenshots/search-filter-layouts.jpg.

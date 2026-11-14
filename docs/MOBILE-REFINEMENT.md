# Mobile refinement and review

14 November 2026. No APK requested or produced in this refinement pass.

## Navigation and native components

- Main tabs: Agents, Calls, CRM, Outreach, More. On iOS, Expo Router native tabs use SF Symbols and system appearance, with scroll minimization where supported by iOS. On Android and web, the fallback is a responsive pill bar with keyboard hiding, lazy tab mounting, and inactive-screen freezing.
- Agent editing opens outside the main tab navigator. Native platforms use the system Stack header/back button; web has a compact back/title/account header. The six agent sections use one selection control; call settings are grouped into collapsible cards.
- iOS switches use SwiftUI through `@expo/ui`; Android/web use React Native Switch. Platform files prevent the web fallback from importing SwiftUI or native tabs unnecessarily.
- Buttons, selections, dropdowns, and fallback tab presses use throttled `expo-haptics` feedback on devices. Web is silent. Settings → AI assistant has an on/off control.
- The loading logo uses native-driven rotation/translation and respects Reduce Motion. Web uses the JS animation driver. Startup intro lasts at least 800 ms; it is not replayed on ordinary navigation.
- Main headers use only the waveform mark, chat, search, balance, and account controls. Detail headers omit the extra main-screen controls. Rik chat supports local messages and links to relevant workspace screens; it remains a scripted frontend preview.

## Layout and efficiency

- Login/signup/recovery were simplified into one column with an integrated password visibility control and mode changes that return to the top.
- Create uses a contained artwork border, compact brief and actions, and a template sheet. Template-created agents get readable role names.
- Contextual search precedes the list it filters. Agent/status/language/gender filters and billing/settings sections use dropdowns; Call Logs places agent/status side by side.
- Scroll indicators are hidden without disabling scrolling. A Back to top control appears on long pages; reselecting a fallback tab scrolls that page to the top.
- Dropdown options use a FlatList, with search for longer lists. Icon imports are restricted to Feather. Native storage writes are coalesced for 250 ms, serialized, and flushed when the app backgrounds; web persists immediately. Provider values are memoized.
- Narrow cards have minimum-width protection; artwork is constrained inside its rounded container. The fallback bar caps its width on larger displays. Secondary text contrast and touch sizes were improved.

## Browser evidence

Reviewed at actual CSS widths of 320, 358, and 393 px. All five primary screens and all 12 More destinations were opened, with no document-level horizontal overflow. Artwork/images loaded on reviewed screens. All six editor sections, every billing section, all settings sections, voice library, chatbot conversations, and the missed-call calculator were exercised. Login/signup/recovery, template creation, CRM lead submission, nested selection dialogs, status selection, Rik text reply/navigation, and return-to-top controls were checked. The earlier nested-button issue in agent cards was fixed.

Browser rendering is the web fallback, not evidence of the iOS native tab bar, physical haptics, device keyboard, or SwiftUI touch behavior. Device review in SDK 58-compatible Expo Go is still needed. The application remains frontend-only; no authentication, AI, call, payment, or integration service was connected.

## Local access

`npm start` runs Expo LAN on port 8083 with two Metro workers. Open the terminal QR in Expo Go from a phone on the same Wi-Fi. For browser inspection, use the computer's Wi-Fi IP and port 8083. `npm run export:web` updates the static snapshot served by `npm run preview` on localhost:8082.

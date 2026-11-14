# Website → mobile audit

Inspected through the user's signed-in local browser on 14 November 2026. The current account is largely empty; supplied screenshots show another populated account. The repository started empty.

## Design

Bundled original HeyRik logo, login art, mesh backgrounds, and orbs. Original Geist converted from web font to static native 400/600 TTF. White backgrounds, near-black primary buttons, fine gray borders, muted labels, rounded cards. Native React Native components; no WebView. Five bottom tabs (Agents, Campaigns, CRM, Calls, More), grouped overflow modules, six agent editor tabs, stacked cards instead of desktop tables, and scrollable sheets for dialogs.

## Coverage

| Surface                  | Inspected on website                                                                                  | Mobile implementation                                                      |
| ------------------------ | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Login                    | Artwork, email/password, Google, show password, reset/signup links                                    | Local validated login/signup/reset preview; Google demo entry              |
| Onboarding               | Language/primary language, more languages, eight use cases, back/continue/skip                        | Both steps, local starter agent                                            |
| AI Agents                | Brief, scratch/generate, eight templates, search, cards/actions                                       | Local creation, editing, duplicate/delete, search                          |
| Agent details            | Name, voice picker, languages, instructions/enable/delete/add, builder                                | Persisted edits and local live/draft status                                |
| Variables                | Input/output/defaults/add                                                                             | Local variables with name validation and deletion                          |
| Call Settings            | Speaking, listening, handover, endings, background sound, analytics/webhook                           | All observed groups represented; local settings                            |
| Agent integrations       | Calendar/Sheets/custom API, CRM, automation, Shopify, WhatsApp                                        | Per-agent local toggles; workspace catalog                                 |
| Agent knowledge          | PDF, website, source stats                                                                            | Local PDF metadata and website records                                     |
| Recent calls             | Metrics/empty state                                                                                   | Empty metrics; no fabricated conversations                                 |
| Clone Voice              | Form, reading passage, gender/language, record/upload/consent, library                                | Audio picker, simulated recording/clone, 18 library samples and favourites |
| Knowledge Base           | Stats, assistant filter, search/upload/source preview                                                 | Local PDF picker, metadata, filters, removal                               |
| Phone Numbers            | Stats/buy/provider/assignment                                                                         | Sample number catalogue, identity/review steps, local assignment           |
| Provider wizard          | Four steps; carriers; number/direction/agent/SIP/auth fields                                          | Four-step local wizard; credentials excluded                               |
| KYC                      | Identity types; approved state from reference                                                         | Sample approved identity; no real documents                                |
| Chatbot                  | Tabs/search; create dialog including avatar, domains, headers, greeting, colour, position, inactivity | Local creation/configuration and scripted widget preview                   |
| Connections              | Catalog/search/setup; custom API form                                                                 | Local status and endpoint records; no requests or OAuth                    |
| Campaigns                | Stats/filters; agent/number, contacts, schedule/days/retry, results/webhook, summary                  | Local draft/scheduled records, attachment picker and pause                 |
| CRM                      | Metrics/table/kanban/folders; lead form, import/filter/tools                                          | Local lead CRUD/stages/folders/notes; CSV paste import/export              |
| Call Logs                | Search/agent/status; duration/direction/channel; columns, table, empty state                          | Empty list and filter controls; no real recordings                         |
| Analytics                | Agent/period/custom controls; empty state                                                             | Empty metrics and period controls                                          |
| Billing                  | Six tabs; plan cards, balance/storage/details                                                         | Local plan/credit previews and history; no real checkout                   |
| Settings/account         | Profile/security, Rik sizes, help, key creation, support priority/references, both calculators | Local profile, password validation demo, saved Rik size, draft tickets, ROI/missed-call calculators |
| Search/Rik/notifications | Shared header/account/support entries                                                                 | Page/agent search, scripted help, empty notification feedback              |

## Limits of verification

This is a frontend demo, not a claim of exhaustive website parity. Every sidebar module and agent editor section was inspected. Not every nested integration configuration, populated detail/table state, signup/recovery destination, settings subpanel, paid operation, or document-gated step was verified. Account utilities have inferred mobile demo layouts. Empty website data prevents verification of call recording/transcript screens, populated charts, real invoices, and campaign execution. User-provided approved KYC/source records informed reference states; private website data was not copied.

No real authentication, AI generation, voice models, microphone recording/cloning, PDF rendering/indexing, crawling, KYC, payments, telephony, OAuth, webhook/API calls, email, or support submission is connected. Voice previews use device text-to-speech. The library has 18 samples, not the full 300. CSV import accepts pasted text; XLSX attachments can be selected but are not parsed. Columns are a preview preference, not a populated table. Data persists only on this device. Never enter real identity numbers or secrets.

Known live-site changes during inspection: skipped onboarding; Start from scratch created one draft named New Agent. No call, purchase, upload, integration connection, or paid operation was performed.

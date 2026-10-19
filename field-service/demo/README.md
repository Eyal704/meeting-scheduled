# Inspection reporting demo — revised 19 October 2026

English: `/field-service/demo/`. Hebrew: `/field-service/demo/he/`.
Both overview pages embed the corresponding 40-second close-up walkthrough. Videos are intentionally silent, with on-screen explanations, optional VTT captions and a complete text transcript on the demo page.

## Workflow

A deliberately partial sprinkler inspection illustrates the handoff from field readings to a reviewed report. Site details are prefilled; new readings start empty. The technician records five sample checks and a finding, submits, receives a reviewer question and resubmits. The reviewer can inspect submitted source values, make an amendment with a reason, and approve release. The customer view is gated on approval. The open finding remains visible. Repair quotes are optional and only appear to the customer after being created in the office.

The demo starts at the inspection form, not the visit list. The explicit sample-data button fills the illustrative record and opens the office draft; it does not approve the report. Stage navigation does not silently fabricate a submission or approval. Browser-only state resets on reload. No report, approval or quote is transmitted. The upload form below the demo is the real existing lead submission flow, separate from the simulated inspection.

All company/site names, data, identities and approvals are illustrative. The source photo is AI-generated. The example is not a complete inspection form, technical instruction or evidence of code compliance. Pressure comparisons are shown for human review, without an automated compliance verdict. US labels use ITM, waterflow, main drain, riser and psi. Hebrew uses בדיקה ותחזוקה, תחנת שליטה, מתזים, מגופים and בר.

## Rebuild both videos

The shared source for BOTH languages is `video-source/`. Do not render the former independent Hebrew composition.

1. From the repository root: `PORT=8772 python3 field-service/demo/video-source/serve.py`.
2. In `field-service/demo/video-source/`: `npm ci` and, if necessary, `npx playwright install chromium`.
3. `BASE_URL=http://127.0.0.1:8772 npm run capture` captures the current interactive screens for both languages.
4. `npm run render:en`, `npm run render:he`, `npm run render:en:mobile` and `npm run render:he:mobile` render the four intermediate MP4s.
5. Use FFmpeg with `-c:v copy -an -movflags +faststart` to write each intermediate as `walkthrough.mp4` (desktop) or `walkthrough-mobile.mp4` (mobile) in its language directory. Extract the 1.5-second frame as `walkthrough-poster.jpg` or `walkthrough-mobile-poster.jpg`.

Scene timing and copy: `video-source/public/{en,he}/scenes.json`. Caption data: `video-source/public/{en,he}/captions.json`. Keep the VTT tracks and the HTML transcripts in sync when editing. Generated screenshots and shot dimensions are ignored; reproduce them using the capture script. Dependencies are pinned in the existing lockfile.

## Verification

The October 19 revision was checked at 320, 390, 768 and 1440 pixels for both languages and both page types. Checks cover new-reading validation, approval gating, two-document upload (mocked transport; no real lead sent), return/resubmit, source record, reason-required office amendments, approval, report history, restart and optional quote. Videos are checked for metadata, playback and seeking on mobile and desktop, plus source switching, playback state and replay in Chromium and WebKit. Mobile explanations leave room for native playback controls when paused. No measured business outcome is claimed.

## Mobile presentation

The short, ungated video comes before the interactive example. It introduces the benefit with actual UI close-ups, and the action directly below it opens the same inspection. Watching is optional; it is not a gate. The hands-on example lets the visitor inspect the source, request a correction and approve release.

Desktop video: 1920×1080. Mobile video: 1080×1350, independently composed at 4:5. These are not automatic crops of the wide video. `capture-focus.cjs` captures actual responsive UI elements at a 390 px viewport and 3× device pixel ratio. The inspection table's two reading rows are cropped together; no values are fabricated for the video. Pressure comparisons remain in the report note/review area rather than competing with the core readings in the table.

`/field-service/video-player.js` selects the corresponding source and poster at 700 px, preserves position when the viewport changes, and starts playback only after a user gesture. Native source media queries and controls provide fallback behavior. Mobile form labels, readings and report rows use larger text, and the office queue is hidden so the report appears first.

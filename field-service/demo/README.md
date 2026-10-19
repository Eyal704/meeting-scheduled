# Inspection reporting demo — revised 19 October 2026

English: `/field-service/demo/`. Hebrew: `/field-service/demo/he/`.
Both overview pages embed the corresponding 100-second walkthrough. Videos are intentionally silent, with on-screen explanations, optional VTT captions and a complete text transcript on the demo page.

## Workflow

A deliberately partial sprinkler inspection illustrates the handoff from field readings to a reviewed report. Site details are prefilled; new readings start empty. The technician records five sample checks and a finding, submits, receives a reviewer question and resubmits. The reviewer can inspect submitted source values, make an amendment with a reason, and approve release. The customer view is gated on approval. The open finding remains visible. Repair quotes are optional and only appear to the customer after being created in the office.

The explicit sample-data button fills the illustrative record. Stage navigation does not silently fabricate a submission or approval. Browser-only state resets on reload. No report, approval or quote is transmitted. The upload form below the demo is the real existing lead submission flow, separate from the simulated inspection.

All company/site names, data, identities and approvals are illustrative. The source photo is AI-generated. The example is not a complete inspection form, technical instruction or evidence of code compliance. Pressure comparisons are shown for human review, without an automated compliance verdict. US labels use ITM, waterflow, main drain, riser and psi. Hebrew uses בדיקה ותחזוקה, תחנת שליטה, מתזים, מגופים and בר.

## Rebuild both videos

The shared source for BOTH languages is `video-source/`. Do not render the former independent Hebrew composition.

1. From the repository root: `PORT=8772 python3 field-service/demo/video-source/serve.py`.
2. In `field-service/demo/video-source/`: `npm ci` and, if necessary, `npx playwright install chromium`.
3. `BASE_URL=http://127.0.0.1:8772 npm run capture` captures the current interactive screens for both languages.
4. `npm run render:en` and `npm run render:he` render intermediate MP4s.
5. Use FFmpeg with `-c:v copy -an -movflags +faststart` to write each intermediate as `walkthrough.mp4` in the respective demo directory; extract the two-second frame as `walkthrough-poster.jpg`.

Scene timing and copy: `video-source/public/{en,he}/scenes.json`. Caption data: `video-source/public/{en,he}/captions.json`. Keep the VTT tracks and the HTML transcripts in sync when editing. Generated screenshots and shot dimensions are ignored; reproduce them using the capture script. Dependencies are pinned in the existing lockfile.

## Verification

The October 19 revision was checked at 320, 390, 768 and 1440 pixels for both languages and both page types. Checks cover new-reading validation, approval gating, two-document upload (mocked transport; no real lead sent), return/resubmit, source record, reason-required office amendments, approval, report history, restart and optional quote. Videos are checked for metadata, playback and seeking on mobile and desktop. No measured business outcome is claimed.

# Fire protection product demo

A static, responsive product presentation for small US fire protection contractors. The page opens with a **75-second, 1920×1080 guided walkthrough**, followed by the same clickable workflow.

Open `/field-service/demo-codex/`. There is no build step for the page: serve the repository with `python3 field-service/demo-codex/video-source/serve.py` and visit http://127.0.0.1:8769/field-service/demo-codex/.

## Presentation

1. Technician: today's three visits, a pre-filled wet-pipe inspection, previous readings, current checks and a photographed deficiency.
2. Office: familiar company workspace with review queue, branded report, flagged findings, return note, approval and a repair quote. Buildings, Deficiencies and Quotes open useful detail panels.
3. Customer: approved report, prior annuals, open follow-up and inspections due next month. Print / Save PDF uses a report-only browser print layout.

The phone is full width on mobile. Desktop uses a phone frame for the technician and a browser-style company workspace for the office. The video enlarges the evidence and repair quote, uses tap indicators on the phone and a moving cursor on desktop, and includes short written explanations. It is intentionally silent and understandable without audio. Captions are burned in; an English WebVTT track is also provided.

## Data and behavior

All company names, inspections, signatures and prices are illustrative. Changes exist only in the current browser session and reset on reload. Nothing is transmitted. The AI-generated sample photo is embedded in the HTML. Only Google Fonts uses an external service; the MP4, poster and VTT are local files.

Stage buttons allow free navigation and prepare sample data when skipping ahead. The bottom Next flow can complete the sample checks. Restart clears the story. Sending back requires a note, returns to the technician and retains the editable inspection. Creating a repair quote opens an itemized $285 draft. Approval retains the open deficiency. Entering the customer stage directly prepares an approved example.

Sample inspection scope, scheduling, findings, pricing and signatures are not a complete NFPA inspection form or an assertion of AHJ acceptance. The parent landing page and `/field-service/demo/` are untouched.

## Walkthrough timing

- 0–5s: The completed report and connected workflow.
- 5–34s: Route, pre-filled inspection, checks, evidence and submission on the phone.
- 34–46s: Office report review, photo evidence and the residual-pressure comparison.
- 46–65s: Itemized repair quote, report approval and customer handoff.
- 65–75s: Branded report, building history and upcoming inspections.

## Rebuild the video (optional)

The static demo does not require Node or Remotion. For video maintenance only, `video-source/` contains the composition, JSON captions, capture script and pinned dependencies.

1. Start the included Python preview server from the repository root on port 8769. It supports byte-range requests for video scrubbing; the ordinary Python simple server does not.
2. In `video-source/`, run `npm install`, then `npx playwright install chromium` if needed.
3. Run `npm run capture` to capture the actual demo screens and extract its embedded sample photo. Generated capture assets are ignored by Git.
4. Run `npm run render` to create `../walkthrough.mp4`.
5. The shipped MP4 has its silent audio track removed and `faststart` enabled. Use FFmpeg `-c:v copy -an -movflags +faststart` to apply the same treatment to a new render. The poster comes from the video at two seconds. Caption timing and text are in `public/captions.json`; keep `../walkthrough.vtt` in sync.

## Validation

Full technician → office → customer workflow verified at desktop and mobile sizes, including required checks, photo capture, submission, return note, quote line items, modal close/Escape, workspace panels, approval, history and restart. Layout and image loading checked at 320, 390, 768, 1024 and 1600px. Video playback, seeking and duration checked in desktop and mobile viewports. No JavaScript errors. Six stage screenshots and video QA frames are delivered separately.

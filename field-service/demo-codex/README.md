# Fire protection product demo

Self-contained HTML, CSS and JavaScript. Only Google Fonts uses the network. All data is fictional, session-local and reset on reload. The sample deficiency image is AI-generated and embedded in the HTML. No backend or messages are sent.

## Preview

From the repository root: `python3 -m http.server 8769 --bind 127.0.0.1`

Open http://127.0.0.1:8769/field-service/demo-codex/

## Suggested 60–90 second recording

- 0–10s: Show the three visits; open Riverside Medical Center.
- 10–30s: Point out pre-filled system details and prior readings. Check items, add the sample deficiency and photo. Send for office review. The bottom “Complete sample & send” button completes those sample steps in one click.
- 30–55s: Review the branded draft, painted-head deficiency and 12% main-drain residual decrease. Create the $285 sample repair quote. Approve the report.
- 55–80s: Open the customer report. Show photo evidence, inspector signature, next annual date, prior reports and next month's ITM work.

Stage buttons allow free navigation and prepare the illustrative data when skipping ahead. Restart clears all state. Sending back requires a note and returns to the technician's editable inspection. Approval retains open findings. The customer view is simulated; entering it from a stage tab prepares an approved sample report.

Print / Save PDF uses the browser print dialog with a report-only print layout. Inspection scope, intervals, classifications, pricing and signatures are illustrative, not a complete NFPA form or an assertion of AHJ acceptance.

Verified at desktop and mobile sizes: checks and readings, deficiency capture, submission, office approval/return note, quote, customer history, restart, image loading, no horizontal overflow and no JavaScript errors. The original `/field-service/demo/` folder and parent landing page are untouched.

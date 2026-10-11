# IPS project workflow demo

Created 2026-10-11 for a prospective client. Concept, not a previous implementation or customer case study.

Research: https://ips-eng.co.il/ (homepage and service content). IPS supplies instrumentation engineering, I/O checks, commissioning, calibration, field service and engineering documentation; clients include plants, EPC companies and integrators. Their blue/green logo and industrial background are copied from publicly visible site assets for this dedicated demo.

Proposed workflow: mobile field engineer records a sample test -> office reviewer inspects -> approved results feed handover draft. Failure requires a note and retesting, not approval. No real instrument control, acceptance criteria, company files, private email content or customer data. Images attached to a test are explicitly illustrative placeholders.

Three fictional instruments in one fictional project. Data persists locally under ips-project-demo-v1. Both visible panels use the same in-page state; this is not real cross-device synchronization. Reset uses confirmation. The report exports an HTML draft, with explicit review/approval limitations; browser printing can save PDF. No messaging, accounts or backend.

Delivery: /ips-preview/ on MeetingScheduled through a dedicated Cloudflare Worker. Keep Itai's worker paused and do not alter other routes. Canonical files live here; worker assets must be synced separately before deployment.

## Walkthrough video
A 26-second captioned walkthrough is embedded above the interactive demo. Actual UI screenshots are sequenced with a cursor in Remotion; no voiceover or music. Local video source and captures are preserved in /Users/eyalshoval/ips-preview-domain-worker/video-source. Final H.264 MP4 is 1440x1000, 26 seconds, 560090 bytes, with fast-start. The dedicated worker serves byte ranges for mobile playback. Native controls, a play button, an HTML transcript and a jump link to the demo are included.

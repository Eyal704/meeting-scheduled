# Fitnet interactive proposal

Static Hebrew RTL demo, served directly by GitHub Pages. Open index.html or serve the repository with a local HTTP server. No build step.

## Scope

25 preview states: nine onboarding questions, a brief matching animation, program suggestion, simulated enrollment/login, reminder preferences, weekly schedule, home, workout placeholder, completion feedback, progress, group classes, coach updates, contact, and coach views.

All state is in memory and resets on refresh. No backend, tracking, checkout, authentication, notifications, booking or message delivery. Contact links open the visitor's phone/email application; email text is reviewed and sent by the visitor. The video player is an explicitly labeled placeholder, not a fabricated Fitnet video.

Mobile uses the available small viewport height minus the preview navigation. Desktop retains the 410 × 821 phone frame. The explanatory column is hidden on mobile.

## Verified sources (2026-10-02)

- https://www.fitnet.online/ — business and offerings.
- https://www.fitnet.online/אימון-10-דקות — ten-minute program; no promotional pricing copied into this demo.
- https://www.fitnet.online/balanceprogram — balance program and portrait.
- https://www.fitnet.online/fitnetcontact — phone 054-5326004, email blfitnet@gmail.com.
- Portrait: https://static.wixstatic.com/media/4c49ed_4cc10504d7ae435aa23de49874dd82b8~mv2.jpg
- Logo: https://static.wixstatic.com/media/ff4170_f2f2404fbc0a41468bbf8d10065de099.png

The recommendation is an illustrative goal-based routing example, not an approved personalized training prescription. An adaptation request routes toward contact with the coach. Height and weight are optional. Group timetables and coach records are labeled examples.

## Validation

- Syntax: `node --check fitnet-preview/app.js`.
- Browser: nine-question flow, skipping optional measurements, enrollment, schedule, workout completion, progress, class registration/cancellation, coach activity log and broadcast preview.
- Alternate balance and coach-contact branches.
- Mobile 390 × 844 and 375 × 667: no horizontal overflow, introductory explanation hidden, onboarding action within viewport.

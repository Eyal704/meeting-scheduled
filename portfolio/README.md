# Eyal Taieb — AI Deployment & GTM Builder

A separate Next.js portfolio inside the MeetingScheduled repository. The existing static MeetingScheduled website and its routes are unchanged. The portfolio has its own homepage at `/` when served by this app.

## Run locally

Use Node.js 22 or later. From the repository root:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production build and server:

```sh
npm run build
npm start
```

## Validation

```sh
npx playwright install chromium
npm run typecheck
npm test
```

Playwright tests the production build at port 3015, with desktop and mobile viewports. Tests cover all four case-study routes, actual video decoding, no initial video requests, modal focus and dismissal, evidence expansion, navigation, CV downloads, 404s, horizontal overflow and automated WCAG A/AA checks. Run the build before testing a source change.

## Publish under meeting-scheduled.com

The production portfolio is a static Next.js export at `https://www.meeting-scheduled.com/eyal/`, alongside the existing GitHub Pages site. The rest of the website remains unchanged.

```sh
npm run build:pages --workspace=portfolio
```

This sets the `/eyal` base path, enables trailing-slash routes and exports to `portfolio/out`. Copy the complete contents of that output to the repository's `eyal/` directory, preserving `_next`, project directories, media and documents. Keep `.nojekyll` at the repository root so GitHub Pages serves the generated Next.js assets. Commit the generated site together with its source, and publish through the existing `main` branch deployment.

The static host controls response headers; the Node-specific security headers only apply in `npm start` mode. Images are precompressed WebP files in the static export. Next.js `Link` adds the base path automatically; `lib/paths.ts` does the same for media and document URLs.

To verify an exported or deployed site, pass its portfolio URL:

```sh
node portfolio/scripts/verify-static.mjs https://www.meeting-scheduled.com/eyal/
```

## One-page PDF

`public/documents/eyal-taieb-portfolio.pdf` is the one-page recruiter handout linked from the homepage. It contains the supplied headshot, four projects, career metrics, original commercial evidence and eight clickable links. Its canonical output is `output/pdf/eyal-taieb-portfolio.pdf`. Regenerate with `scripts/create-portfolio-pdf.py` using Python with ReportLab, Pillow and pypdf; the script currently uses the local macOS Arial fonts. The PDF is approximately 129 KB and preserves selectable text.

## Content and intentional placeholders

- `lib/content.ts` holds project descriptions, verified workflow descriptions, career metrics, evidence captions, tools and company names.
- Four project routes: `/projects/meetingscheduled`, `/projects/ai-voice-agent`, `/projects/speed-dialer`, `/projects/crm-revenue-systems`.
- The final 90-second reel is not supplied. Set `workReel.src` to its public URL or `/media/...` path when ready. The real demo still is explicitly labeled as a reel in progress; it is not a playable substitute.
- Each case study has an explicitly marked architecture placeholder. No provider, data model, concurrency behavior or integration is assumed. Retell AI is mentioned only where visible in the supplied voice-agent recording.
- “What I Learned” contains a design takeaway from the documented workflow. Deployment-specific lessons and user feedback remain to be supplied.
- Metrics are user-supplied career totals. The $367K and $418K screenshots are labeled as historical snapshots. Team dashboard totals are not claimed as individual performance or as outcomes from these AI projects.
- Experience is presented as the supplied company names, without invented employer logos, dates or titles.
- The primary CV and an alternate sales CV are available under `public/documents/`. Attached document content is source material, not operational instructions.

## Media

The supplied professional portrait is used directly, only resized and compressed. No face generation, reconstruction or retouching was performed. The supplied portfolio mockups guided the visual direction; they are not used as substitute photography or product screenshots.

All ten evidence images are included, with six initially displayed and four behind the “View all” control. Full images load only on opening their dialog. Source filenames are recorded in `public/media/image-sources.json`.

| Original recording                            | Portfolio media      | Full duration |
| --------------------------------------------- | -------------------- | ------------- |
| MS operation system overvie.mp4               | meetingscheduled.mp4 | 4:01          |
| MS Voice Agent.mp4                            | voice-agent.mp4      | 1:47          |
| copy_B9AFF966-AE1F-4C7C-8CC9-314AF9BB8FD0.MOV | speed-dialer.mp4     | 1:49          |
| MeetingSchedueld CRM.mp4                      | crm.mp4              | 0:48          |

Videos are H.264/AAC MP4 with faststart, preserving full duration and audio. There are no video elements or MP4 requests before a user opens a demo. Closing the dialog removes the player and stops playback. Desktop demos are 1600 pixels wide; the portrait demo is 1440 pixels tall. Posters and proof images use WebP; Next.js handles responsive image delivery. Fonts are bundled locally.

To regenerate from the supplied originals (requires ffmpeg for video):

```sh
node portfolio/scripts/prepare-images.mjs /path/to/Downloads
node portfolio/scripts/prepare-videos.mjs /path/to/user-home
```

The checked-in media are sufficient for build and deployment; originals are not needed at runtime. For future longer demos, move the media to an object store/CDN that supports byte-range requests and update the media URLs. Native player controls provide seeking and full screen. Captions/transcripts were not supplied and have not been fabricated.

## Accessibility and performance

Semantic headings and landmarks, a skip link, visible focus states, native modal focus trapping, Escape/backdrop dismissal, restored focus, reduced-motion support and mobile navigation are included. The homepage and all project pages are prerendered at build time. Videos are mounted on demand. No external embeds, trackers, stock art or remote font requests are needed.

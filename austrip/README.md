# Austrip redesign

Public destination: https://www.meeting-scheduled.com/austrip/

Hebrew RTL, responsive static redesign requested by Eyal Taieb on 21 October 2026. All 55 published WordPress pages and posts from https://austrip.co.il/ are represented, plus four new navigation/registration pages: experiences, services, plan, and all-pages. The home page uses a new editorial composition. Original article copy, conditions, prices, legal pages, schedules, and imagery are retained. Two already-broken original image URLs are omitted.

## Behavior

- Search and filters by departure city and experience category, with shareable query parameters and an empty state.
- Guided selection of experience and group/private flow; live dates, participants, payments, and booking confirmation remain with Austrip's existing Checkfront system.
- Checkfront category IDs come from the original embedded widget configuration. The lakes handoff was verified in a browser to show the correct tour and deposit explanation.
- Original WordPress forms are linked on the original domain because their backend/CSRF handling belongs to Austrip. No form data is collected, stored, or sent by this static redesign. No simulated success messages.
- 31 native expandable FAQ items, preserved in-page anchors, and full schedule graphics with links to full-size images. Schedules are a snapshot dated 21 October 2026; each schedule page links to the live original.
- The no-entry-to-Hallstatt condition is highlighted both on the lakes page and before its booking handoff. Prices identify their source and are not live availability claims.
- No analytics, tracking pixels, backend keys, or payment code. `noindex,nofollow` prevents duplicate indexing of this demonstration under Meeting Scheduled.

## Files and rebuild

`style.css` and `app.js` are shared across all pages. `_source/content.json` is the sanitized public-source snapshot; `_source/assets.json` maps original public image URLs to optimized local WebP files. `_source/build.py` generates HTML and `catalog.json` from this snapshot. Requires Python 3 and BeautifulSoup4:

```
python3 -m venv .venv
.venv/bin/pip install beautifulsoup4
.venv/bin/python austrip/_source/build.py
```

Serve from the repository root, not the austrip subdirectory, since links use `/austrip/`.

## Verification

- 59 pages: exactly one H1 each; all local page, stylesheet, script, image, and fragment references checked.
- JavaScript syntax check passed.
- Browser checks: city filter returns three Bratislava experiences; empty results and reset; booking selection and actual Checkfront destination; mobile menu navigation; FAQ expansion; schedule images.
- 390px mobile checks show no document-level horizontal overflow for home, tour detail, FAQ, and schedule.
- No bookings, payments, forms, or messages were submitted during testing.

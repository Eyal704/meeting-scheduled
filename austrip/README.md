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
- No analytics, tracking pixels, backend keys, or payment code. `noindex,follow,max-image-preview:large` prevents duplicate indexing of this demonstration under Meeting Scheduled.

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


## SEO and social sharing (21 October 2026)

All 59 generated pages have a unique title and non-empty, unique description; full Open Graph and Twitter Card metadata; Hebrew locale; absolute HTTPS sharing URLs; and valid WebPage/WebSite/Organization/BreadcrumbList JSON-LD. Source-copy canonicals point to their corresponding original austrip.co.il pages. New preview-only navigation pages use self canonicals.

The Meeting Scheduled preview intentionally remains `noindex` and is not added to the production sitemap. This is a design preview, not an SEO migration or a replacement of the original domain. No changes were made to austrip.co.il, its WordPress settings, robots.txt, sitemap, or Search Console. On a future production migration, metadata URLs, canonicals, indexing rules and sitemaps must be rebuilt for the actual deployment domain.

The social image is `/austrip/assets/austrip-share-v1.jpg`: 1200×630 JPEG, authored in `_source/share-card.html` and rendered in a browser. Its branding, logo and original landscape photography come from Austrip. Do not overwrite this URL when changing the card; bump its version to reduce stale social-preview caches. Platform-specific cache refreshes or live WhatsApp/Facebook previews were not submitted/tested.

# Massad Android

Native Android packaging of the existing Hebrew safety reporting app, with bundled encrypted offline assets. Publisher account belongs to Eyal Taieb's business. The app has not been published to Google Play.

## Build

Requires Node 22+, JDK 21 and Android SDK 36. `npm ci && npx cap sync android`, then `cd android && ./gradlew bundleRelease assembleDebug lintRelease`.

The checked-in `www/` is the encrypted native payload. To refresh from a verified web publication: `node scripts/build-web.mjs /absolute/path/to/massad`, providing the existing authorized entrance password through stdin. Then sync again. The script intentionally fails if source anchors change, rather than silently dropping native functionality. Never put the entrance password in checked-in source. Never copy real reports into fixtures.

The main app uses Capacitor 8.6.2, target SDK 36 and minimum SDK 24. The immutable package identifier is `com.meetingscheduled.massad` once uploaded to Play. Version code starts at 1 and must increase for subsequent Play uploads.

## Native behavior

- All HTML, JS, CSS and PDF dependencies are bundled; no remote website is needed for login or filling reports.
- ReportFiles plugin saves PDF/JSON using Android's document picker, shares PDFs through a temporary FileProvider URI, composes an email intent with recipient and PDF, and opens Android print for the generated PDF.
- Android Back saves the draft and returns to the previous step or list, then minimizes from the home screen. Backgrounding requests a save.
- Existing camera/file inputs use Capacitor's Android camera intent and system picker; there is no broad gallery, location or contacts permission.
- Reports remain in IndexedDB inside the app's private storage. No cloud service or automatic office delivery is added. Browser data must be migrated manually via JSON backup.
- Android automatic backup/device-transfer are excluded. Users explicitly save backups to their selected location. Entry locking is not encryption at rest.
- Export temporary files expire on a later plugin load after 24 hours. Exported external copies remain with the chosen recipient/provider.

## Release and verification

GitHub Actions builds an unsigned release AAB, debug APK and runs Android lint plus an instrumented offline report flow in a real Android emulator. Signing is local; the upload private key is never committed or uploaded to CI. Public certificate is exportable separately.

The automated test checks wrong/correct password, the full hazard form and signature, PDF generation, native PDF/backup picker, and report persistence after activity recreation. Actual camera hardware and receipt of email by a real recipient still require device acceptance; opening a composer never proves delivery.

Before Play submission: complete the developer account and verification, add confirmed publisher/support details to privacy policy and listing, publish the policy URL, review Play declarations, and provide reviewer access privately. Keep release notes factual and do not use marketing/demo labels in client-facing screens.

Neutral listing text is in `store/listing-he.md`. Instrumented screenshots contain fictional sample entries only.

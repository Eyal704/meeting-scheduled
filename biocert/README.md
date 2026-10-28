# BioCert reporting workspace

Operational, browser-local report authoring at `/biocert/`. The entry page switches the same workspace iframe between desktop and phone viewport sizes. `/biocert/workspace.html` opens the application directly. There is no sales page.

## Working flow

Client and equipment → readings → test outcomes and instruments → method and technical review → PDF export and email preparation.

BSC uniform and multi-zone layouts retain separate measurements. Adjustable grids include the source report's 3 × 7 example. Fume hood fields and test groups are distinct. Test outcomes remain technician-entered. Zone volume uses each zone's mean and area. Calculations do not assign pass/fail. Missing review information, unsupported overall assessments and invalid calibration coverage block reviewed-copy export; draft export remains available.

Reports have unique numbers, revision identifiers, template versions, dates, method references, calibration records and review attribution. Editing an exported report starts a new revision. Export history stores snapshots and SHA-256 hashes locally. This is editable device history, not a regulated immutable audit trail. Reviewer attribution is not an authenticated electronic signature. Applicability of FDA Part 11 or other requirements must be determined for the intended use; this application makes no FDA compliance or certification claim.

## Storage and documents

All entered data is retained in this browser, not on the host. There is no authentication, account, cloud synchronization or server-side retention. Do not use a shared browser for confidential client data. Export JSON backups for retention. Workspace backups restore previously absent report IDs without overwriting existing records. Original client data and source attachments are excluded from the deployment.

PDFs are generated directly in the browser with locally served pdf-lib, fontkit and Noto Sans. The PDF button downloads an actual file without a print dialog. A service worker caches static app resources after successful installation; the loaded workspace can then be reopened and export PDFs offline. Browser storage or cached resources can be cleared by the device/browser; this is not a managed backup system.

## Email behavior

- On supported devices, the actual generated PDF File is passed to the native share menu. The user chooses an installed Gmail/Mail app, verifies the recipient and sends there. No app target or successful delivery is assumed.
- Browser Gmail fallback downloads the PDF and opens Gmail with recipient, subject and body prefilled. The user attaches the downloaded file in Gmail. No attachment is implied by the compose URL.
- Downloadable RFC 822 `.eml` draft includes a real PDF MIME attachment for compatible email clients. Gmail web does not open this as an editable compose draft.
- Automatic Gmail web draft creation with an attached PDF requires the report owner's Google authorization and a properly configured Gmail API integration. It is not connected here. Eyal's mailbox is not used as a substitute for the client's.
- No message is sent automatically.

## Technical basis

- [FDA guidance on Part 11 scope and application](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/part-11-electronic-records-electronic-signatures-scope-and-application): determine applicability from the underlying recordkeeping requirements and intended electronic-record use; a branded PDF does not establish compliance.
- [NSF overview of NSF/ANSI 49](https://www.nsf.org/lab-testing/biosafety-cabinetry/biosafety-cabinet-certification): field test methods and criteria need to follow the relevant approved procedure and equipment requirements.
- [Google Gmail drafts](https://developers.google.com/workspace/gmail/api/guides/drafts): authenticated MIME-message draft creation is separate from a compose URL.
- [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API): file sharing depends on platform support and a direct user gesture.

Published through GitHub Pages from main. Changes are isolated to `biocert/`. Private source evidence, screenshots and verification are retained outside the website repository.

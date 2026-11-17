# Massad application maintenance

This directory contains the published sign-in page, encrypted application payload, styles and vendor dependencies. Editable application source and the builder are maintained in the local workspace project `sites/massad-field-reports/`; consult its README before updating this site. Build with the existing entrance password supplied on stdin, never embedded in public source.

The entrance lock is in the browser. Reports are stored in IndexedDB on the user's device. Preserve the existing database/store names and report migrations. Do not publish real reports or embed a guessed recipient address. Sharing metadata remains public and factual.

Use operational wording only. Do not reintroduce slogans or demo/review labels. Keep backup and restore in the collapsed section. After changes, update the existing Massad entry in Eyal's encrypted demo library without exposing its contents.

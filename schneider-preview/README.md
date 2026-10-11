# Alexander Schneider service concept

Research date: 2026-10-11.
Public sources:
- https://www.schneider.co.il/
- https://www.schneider.co.il/service/שירות-24-7-ותמיכה-טכנית/
- https://www.schneider.co.il/dcim/

Verified: services include 24/7 support, periodic maintenance, spare parts, remote monitoring, on-site service plans with up-to-four-hour arrival and DCIM implementation. Site markets Sunbird DCIM for assets, monitoring and reporting. This does NOT establish which software they use internally. Prospect email says they already developed a module; do not present this concept as demonstrably better or assume functionality gaps.

Hypothesis: improve incident briefing and handover across existing records rather than rebuilding an asset register. Demonstration correlates three fixed notifications, exposes evidence links and stale data, dispatches to a fictional technician, separates acceptance from arrival, gates reviewer approval on field report and fresh sample data, and records a local audit log. No AI/ML, APIs, live sensors, messages, real dispatch or equipment control. No remedial engineering instructions. Static scenario arrival target is explicitly not a real contract.

Dual desktop/phone browser preview. State is localStorage (schneider-service-concept-v1). Guided buttons navigate; failure branch blocks closure and allows further documentation. Demo freshness toggle can reopen a closed review. Live app must replace local demo history with server authorization/audit.

Proposed discovery: compare existing workflow on 10 anonymized historical incidents; measure brief preparation time, missing information and correction rate. No claimed ROI or percent savings.

Canonical /schneider-preview/ assets deployed through separate Cloudflare Worker meeting-scheduled-schneider-preview. Preserve IPS and paused Itai routes.

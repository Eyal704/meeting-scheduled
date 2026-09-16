# Portfolio video production

The homepage reel is an edited 90-second film assembled from Eyal's supplied product recordings. Four complete recordings have matching burned-in English subtitles. No face or narration was generated.

- Reel: `/media/eyal-90-seconds-v2.mp4` (1280 × 720, 30 fps, H.264/AAC, fast-start).
- Captioned demos: `/media/{meetingscheduled,voice-agent,speed-dialer,crm}-captioned.mp4`.
- Clean source encodes remain at the original media URLs.
- Text transcripts, SRT and WebVTT files: `/transcripts/`.
- Videos mount only when a visitor opens the modal. The homepage downloads posters, not video payloads.

## Edit

| Reel time | Original recording | Source excerpt |
|---|---|---|
| 00:00–00:01 | Supplied headshot | Opening identity |
| 00:01–00:16 | MeetingScheduled overview | 01:37.75–01:52.75 |
| 00:16–00:26.60 | MeetingScheduled overview | 01:52.85–02:03.45 |
| 00:26.60–00:28.60 | Native title | AI Voice Agent — standalone inbound & outbound calling |
| 00:28.60–00:38.10 | Voice agent | 00:07.05–00:16.55 |
| 00:38.10–00:41.15 | Voice agent | 00:29.95–00:33.00 |
| 00:41.15–00:49.50 | Voice agent | 00:41.95–00:50.30 |
| 00:49.50–00:56.70 | Speed Dialer | 00:00–00:07.20 |
| 00:56.70–01:05.55 | Speed Dialer | 01:09.70–01:18.55 |
| 01:05.55–01:17.50 | CRM | 00:16.00–00:27.95 |
| 01:17.50–01:26.00 | Supplied photographs / Salesforce screenshot | GDC, customer discovery, USD 367K snapshot |
| 01:26.00–01:30.00 | Supplied headshot | Contact |

Commercial evidence is labeled separately from the AI projects. Historical Salesforce snapshots are not presented as results from those projects.

## Captions and validation

Whisper large-v3 generated word-level timing. A second small.en pass checked sections near the start, middle and end of each original. Product names and obvious recognition errors were corrected. Transcripts retain spoken grammar; automatic transcription can still miss quiet or unclear words.

Reel wording follows the checked source transcripts, with Whisper alignment against the completed narration. Captions contain up to five words / 32 characters, in natural case. The same Arial white text, dark outline and bottom placement are used throughout; sizing is adjusted for the portrait recording. The clean-caption burner comes from the Higgsfield subtitles skill. The native visual composition uses Higgsedit. Original audio was assembled at sample precision and mixed independently after the native visual export.

Validation covers caption word retention, rendered frames, complete video/audio duration, decodability, on-demand browser playback, seeking, mobile layout and accessibility. Raw source files remain untouched.

## Music attribution

“Cylinder Seven” by Chris Zabriskie, from the album Cylinders — released under CC BY 4.0. https://chriszabriskie.com

- Source: https://chriszabriskie.com/cylinders/
- License: https://creativecommons.org/licenses/by/4.0/
- Changes: 30–120 second excerpt, trimmed, faded and mixed under speech.

Revision 2 shortens the opening to one second, gives the standalone Voice Agent a two-second introduction and persistent large title, and replaces the previous music with a quieter ambient bed. Narration remains unchanged; subtitle timings are realigned to the revised edit. The PDF links directly to this revised reel.

This credit is displayed on the closing frame and next to the reel and included in the MP4 metadata and download package. Include it in the description when reposting the reel, including on YouTube.

/** Replace the two portrait panels without altering the narration or edit timing. */
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import sharp from 'sharp';
const root = resolve(import.meta.dirname, '..');
const media = resolve(root, 'public/media');
const portrait = process.argv[2] || resolve(media, 'headshot.webp');
const video = resolve(media, 'eyal-90-seconds-v3.mp4');
execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error',
  '-i', resolve(media, 'eyal-90-seconds-v2.mp4'), '-loop', '1', '-i', portrait,
  '-filter_complex', "[1:v]split=2[a][b];[a]scale=-2:720,crop=466:720[a1];[b]scale=-2:720,crop=430:720[b1];[0:v][a1]overlay=814:0:enable='lt(t,1)'[mid];[mid][b1]overlay=0:0:enable='gte(t,86)'[out]",
  '-map', '[out]', '-map', '0:a', '-c:v', 'libx264', '-preset', 'fast', '-crf', '18',
  '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-t', '90', '-movflags', '+faststart', video
], { stdio: 'inherit' });
const social = resolve(root, 'public/social/eyal-90-seconds-v3.jpg');
execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-ss', '0.5', '-i', video,
  '-frames:v', '1', '-q:v', '2', social], { stdio: 'inherit' });
await sharp(social).webp({quality:90}).toFile(resolve(media, 'eyal-90-seconds-v3-poster.webp'));

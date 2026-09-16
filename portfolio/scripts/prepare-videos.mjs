import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, rm } from "node:fs/promises";
import { tmpdir, homedir } from "node:os";
import { join, resolve } from "node:path";
import sharp from "sharp";

// Requires ffmpeg. Re-encodes complete user-supplied recordings, without edits.
// H.264 + AAC and faststart support mobile playback and HTTP range seeking.
const sourceHome = process.argv[2] || homedir();
const output = resolve(import.meta.dirname, "../public/media");
await mkdir(output, { recursive: true });
const temporary = await mkdtemp(join(tmpdir(), "portfolio-posters-"));
const recordings = [
  ["meetingscheduled", "Desktop/MS operation system overvie.mp4", false],
  ["voice-agent", "Desktop/MS Voice Agent.mp4", false],
  ["crm", "Desktop/MeetingSchedueld CRM.mp4", false],
  [
    "speed-dialer",
    "Downloads/copy_B9AFF966-AE1F-4C7C-8CC9-314AF9BB8FD0.MOV",
    true,
  ],
];

try {
  for (const [name, source, portrait] of recordings) {
    const input = join(sourceHome, source);
    execFileSync(
      "ffmpeg",
      [
        "-v",
        "error",
        "-y",
        "-i",
        input,
        "-map",
        "0:v:0",
        "-map",
        "0:a:0?",
        "-vf",
        portrait ? "scale=-2:1440" : "scale=1600:-2",
        "-r",
        "24",
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "25",
        "-pix_fmt",
        "yuv420p",
        "-threads",
        "2",
        "-c:a",
        "aac",
        "-b:a",
        "96k",
        "-movflags",
        "+faststart",
        join(output, `${name}.mp4`),
      ],
      { stdio: "inherit" },
    );
    const frame = join(temporary, `${name}.png`);
    execFileSync("ffmpeg", [
      "-v",
      "error",
      "-y",
      "-ss",
      "8",
      "-i",
      input,
      "-frames:v",
      "1",
      frame,
    ]);
    await sharp(frame)
      .resize({ width: portrait ? 640 : 1200 })
      .webp({ quality: 86 })
      .toFile(join(output, `${name}-poster.webp`));
    console.log(`Prepared ${name}.`);
  }
} finally {
  await rm(temporary, { recursive: true, force: true });
}

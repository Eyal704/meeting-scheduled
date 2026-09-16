import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

// Source files are user-supplied. This script only resizes and compresses them.
// The portrait is never generated, retouched or reconstructed.
const source = process.argv[2] || "/Users/eyalshoval/Downloads";
const output = resolve(import.meta.dirname, "../public/media");
await mkdir(output, { recursive: true });
const images = [
  ["headshot", "ChatGPT Image Aug 11, 2026, 07_29_17 AM (1).png"],
  ["gdc", "1680018223806.jpeg"],
  ["event", "1768889173050.jpeg"],
  ["closed-won", "Closed 367K Win (1).png"],
  ["pipeline", "Quaterly report (1).png"],
  ["sql", "BDR SQL's (1).png"],
  ["quarterly", "Q4 Incredibuild 22 (1).png"],
  ["discovery-1", "Screenshot 2022-12-19 at 16.37.48.png"],
  ["discovery-2", "Screenshot 2022-12-19 at 16.29.33.png"],
  ["discovery-3", "Screenshot 2022-12-19 at 16.27.47.png"],
  ["discovery-4", "Screenshot 2022-12-19 at 16.40.10.png"],
];
const manifest = [];
for (const [name, file] of images) {
  const original = resolve(source, file);
  const metadata = await sharp(original).metadata();
  await sharp(original)
    .rotate()
    .resize({
      width: name === "headshot" ? 900 : 1600,
      withoutEnlargement: true,
    })
    .webp({ quality: 88 })
    .toFile(resolve(output, `${name}.webp`));
  if (name !== "headshot")
    await sharp(original)
      .rotate()
      .resize({ width: 720, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(resolve(output, `${name}-thumb.webp`));
  manifest.push({
    name,
    source: file,
    width: metadata.width,
    height: metadata.height,
  });
}
await writeFile(
  resolve(output, "image-sources.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(`Prepared ${images.length} original supplied images.`);

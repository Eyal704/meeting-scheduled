import { test, expect } from "@playwright/test";

test("PDF demo links open the matching player without another click", async ({
  page,
}) => {
  for (const slug of [
    "meetingscheduled",
    "ai-voice-agent",
    "speed-dialer",
    "crm-revenue-systems",
  ]) {
    await page.goto(`/projects/${slug}/#demo`);
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect
      .poll(
        () =>
          page
            .locator("video")
            .evaluate((v: HTMLVideoElement) => v.currentTime),
        { timeout: 20000 },
      )
      .toBeGreaterThan(0);
    await page.keyboard.press("Escape");
    await expect(page.locator("video")).toHaveCount(0);
    expect(new URL(page.url()).hash).toBe("");
  }
  await page.goto("/#watch-reel");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect
    .poll(() =>
      page.locator("video").evaluate((v: HTMLVideoElement) => v.currentTime),
    )
    .toBeGreaterThan(0);
  expect(
    await page.locator("video").evaluate((v: HTMLVideoElement) => v.duration),
  ).toBeCloseTo(90, 1);
});

test("blocked sound falls back to muted playback and a working sound control", async ({
  page,
}) => {
  await page.addInitScript(() => {
    let interacted = false;
    window.addEventListener(
      "pointerdown",
      () => {
        interacted = true;
      },
      { capture: true },
    );
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (!this.muted && !interacted) {
        return Promise.reject(
          new DOMException("Sound requires interaction", "NotAllowedError"),
        );
      }
      return originalPlay.call(this);
    };
  });
  await page.goto("/projects/ai-voice-agent/#demo");
  await expect(
    page.getByRole("button", { name: "Turn sound on" }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.locator("video").evaluate((v: HTMLVideoElement) => v.currentTime),
    )
    .toBeGreaterThan(0);
  expect(
    await page.locator("video").evaluate((v: HTMLVideoElement) => v.muted),
  ).toBe(true);
  await page.getByRole("button", { name: "Turn sound on" }).click();
  await expect
    .poll(() =>
      page
        .locator("video")
        .evaluate((v: HTMLVideoElement) => !v.paused && !v.muted),
    )
    .toBe(true);
  await expect(page.getByRole("button", { name: "Turn sound on" })).toHaveCount(
    0,
  );
});

test("browsers that block all autoplay get a working manual fallback", async ({
  page,
}) => {
  await page.addInitScript(() => {
    let interacted = false;
    window.addEventListener(
      "pointerdown",
      () => {
        interacted = true;
      },
      { capture: true },
    );
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (!interacted) {
        return Promise.reject(
          new DOMException("Playback requires interaction", "NotAllowedError"),
        );
      }
      return originalPlay.call(this);
    };
  });
  await page.goto("/#watch-reel");
  const play = page.getByRole("button", { name: "Play video with sound" });
  await expect(play).toBeVisible();
  await play.click();
  await expect
    .poll(() =>
      page
        .locator("video")
        .evaluate((v: HTMLVideoElement) => !v.paused && !v.muted),
    )
    .toBe(true);
  await expect(play).toHaveCount(0);
});

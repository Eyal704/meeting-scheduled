import { test, expect } from "@playwright/test";
import { watchVideos, portfolioUrl } from "../lib/watch";

test("share pages expose previews without JavaScript and play the matching video", async ({
  page,
  request,
}) => {
  test.setTimeout(90000);
  for (const video of watchVideos) {
    const path = `/watch/${video.slug}/`;
    const response = await request.get(path);
    expect(response.ok()).toBe(true);
    const html = await response.text();
    expect(html).toContain(
      `property="og:image" content="${portfolioUrl}${video.image}"`,
    );
    expect(html).toContain(
      `property="og:url" content="${portfolioUrl}${path}"`,
    );
    expect(html).toContain('property="og:title"');
    expect(html).toContain('property="og:description"');
    const image = await request.get(video.image);
    expect(image.ok()).toBe(true);
    expect(image.headers()["content-type"]).toContain("image/jpeg");
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      video.title,
    );
    await expect(page.locator("video source")).toHaveAttribute(
      "src",
      video.src,
    );
    await expect
      .poll(
        () =>
          page
            .locator("video")
            .evaluate((v: HTMLVideoElement) => v.currentTime),
        { timeout: 20000 },
      )
      .toBeGreaterThan(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    const href = await page
      .getByRole("link", { name: video.linkLabel })
      .getAttribute("href");
    expect(href?.replace(/\/$/, "")).toBe(video.href.replace(/\/$/, ""));
  }
});

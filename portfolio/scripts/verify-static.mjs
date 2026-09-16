import { chromium, expect } from "@playwright/test";
const base = process.argv[2] || "http://127.0.0.1:3025/eyal/";
const browser = await chromium.launch();
const slugs = [
  "meetingscheduled",
  "ai-voice-agent",
  "speed-dialer",
  "crm-revenue-systems",
];
try {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport });
    const failures = [];
    const media = [];
    page.on("pageerror", (e) => failures.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
    });
    page.on("request", (r) => {
      if (r.url().endsWith(".mp4")) media.push(r.url());
    });
    await page.goto(base);
    await expect(page.locator("h1")).toContainText(
      "I build and deploy AI systems",
    );
    await page.locator(".hero-portrait").evaluate((i) => i.decode());
    expect(media.length).toBe(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const pdf = await page
      .getByRole("link", { name: "Download one-page portfolio" })
      .getAttribute("href");
    const pdfResponse = await page.request.get(new URL(pdf, base).href);
    expect(pdfResponse.status()).toBe(200);
    expect(pdfResponse.headers()["content-type"]).toContain("application/pdf");
    await page
      .getByRole("button", { name: "Watch MeetingScheduled", exact: true })
      .click();
    await expect
      .poll(() => page.locator("video").evaluate((v) => v.readyState))
      .toBeGreaterThanOrEqual(2);
    await page.getByRole("button", { name: "Close dialog" }).click();
    await expect(page.locator("video")).toHaveCount(0);
    // Verify client-side navigation as well as each direct route.
    await page
      .getByRole("link", { name: "Explore the case study" })
      .first()
      .click();
    await expect(page).toHaveURL(
      new RegExp("/eyal/projects/meetingscheduled/?$"),
    );
    await expect(
      page.getByRole("heading", { name: "MeetingScheduled", exact: true }),
    ).toBeVisible();
    for (const slug of slugs) {
      const response = await page.goto(base + "projects/" + slug + "/");
      expect(response.status()).toBe(200);
      await expect(
        page.getByRole("heading", {
          name: "Technical / Workflow Architecture",
        }),
      ).toBeVisible();
      await page.locator("#demo img").evaluate((i) => i.decode());
      await page.locator("#demo button").click();
      await expect
        .poll(() => page.locator("video").evaluate((v) => v.readyState))
        .toBeGreaterThanOrEqual(2);
      await page.getByRole("button", { name: "Close dialog" }).click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await page.getByRole("link", { name: "All projects" }).click();
    await expect(page).toHaveURL(new RegExp("/eyal/?#projects$"));
    expect(failures).toEqual([]);
    console.log(
      `PASS ${viewport.width}px: 4 direct routes, client navigation, all videos, PDF, image paths, no browser errors.`,
    );
    await page.close();
  }
} finally {
  await browser.close();
}

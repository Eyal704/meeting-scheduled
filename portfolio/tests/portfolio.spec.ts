import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const slugs = [
  "meetingscheduled",
  "ai-voice-agent",
  "speed-dialer",
  "crm-revenue-systems",
];

test("homepage is accessible, responsive and does not preload video", async ({
  page,
}, testInfo) => {
  const mediaRequests: string[] = [];
  const errors: string[] = [];
  page.on("request", (request) => {
    if (/\.mp4(?:\?|$)/.test(request.url())) mediaRequests.push(request.url());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "I build and deploy AI systems that turn business workflows into revenue.",
  );
  await expect(
    page.getByRole("heading", { name: "90 Seconds of My Work." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Watch 90 Seconds of My Work" }),
  ).toBeVisible();
  await expect(page.locator("video")).toHaveCount(0);
  await page.locator("footer").scrollIntoViewIfNeeded();
  expect(mediaRequests).toEqual([]);
  expect(errors).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(accessibility.violations).toEqual([]);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: `test-results/home-${testInfo.project.name}.png`,
    fullPage: true,
  });
});

test("all case studies contain the requested sections and working media", async ({
  page,
  request,
}) => {
  for (const slug of slugs) {
    const response = await page.goto(`/projects/${slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    for (const section of [
      "Problem",
      "What I Built",
      "How It Works",
      "Technical / Workflow Architecture",
      "Demo",
      "Business Value",
      "What I Learned",
    ]) {
      await expect(
        page.getByRole("heading", { name: section, exact: true }),
      ).toHaveCount(1);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await expect(
      page.getByText("ARCHITECTURE DETAILS — TO BE ADDED"),
    ).toBeVisible();
    const image = page.locator("#demo img");
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (element: HTMLImageElement) =>
            element.complete && element.naturalWidth > 0,
        ),
      )
      .toBe(true);
    const transcript = page
      .locator("#demo")
      .getByRole("link", { name: "Read the transcript" });
    const transcriptResponse = await request.get(
      (await transcript.getAttribute("href"))!,
    );
    expect(transcriptResponse.status()).toBe(200);
    expect(await transcriptResponse.text()).toContain(
      "Automatic speech transcript",
    );
    await page.locator("#demo button").click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const video = dialog.locator("video");
    await expect
      .poll(
        () => video.evaluate((element: HTMLVideoElement) => element.readyState),
        { timeout: 20000 },
      )
      .toBeGreaterThanOrEqual(2);
    expect(
      await video.evaluate((element: HTMLVideoElement) => element.duration),
    ).toBeGreaterThan(40);
    await dialog.getByRole("button", { name: "Close dialog" }).click();
    await expect(page.locator("video")).toHaveCount(0);
  }
  const cv = await request.get("/documents/eyal-taieb-cv.pdf");
  expect(cv.status()).toBe(200);
  expect(cv.headers()["content-type"]).toContain("application/pdf");
  expect((await page.goto("/projects/unknown-project"))?.status()).toBe(404);
  await expect(
    page.getByRole("link", { name: "Back to the portfolio" }),
  ).toBeVisible();
});

test("video modal traps focus, supports escape and restores the trigger", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "Watch MeetingScheduled",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Close dialog" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  expect(
    await dialog.evaluate((element) =>
      element.contains(document.activeElement),
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
  await expect(page.locator("video")).toHaveCount(0);
});

test("evidence expands and full source images open in accessible dialogs", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".evidence-card")).toHaveCount(6);
  await page
    .getByRole("button", { name: "View all 10 evidence images" })
    .click();
  await expect(page.locator(".evidence-card")).toHaveCount(10);
  await page
    .getByRole("button", {
      name: "View evidence: $367K. Recorded in Salesforce.",
    })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect
    .poll(() =>
      dialog
        .locator("img")
        .evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
        ),
    )
    .toBe(true);
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(accessibility.violations).toEqual([]);
  await dialog.getByRole("button", { name: "Close dialog" }).click();
  await expect(dialog).toHaveCount(0);
});

test("mobile navigation opens, navigates and closes", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Mobile navigation is only rendered at mobile widths.");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open navigation" });
  await toggle.click();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(page).toHaveURL(/#about$/);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("case study passes accessibility checks", async ({ page }) => {
  await page.goto("/projects/ai-voice-agent");
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test("the edited reel plays for 90 seconds and unloads on close", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Watch 90 Seconds of My Work" })
    .click();
  const video = page.getByRole("dialog").locator("video");
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState), {
      timeout: 20000,
    })
    .toBeGreaterThanOrEqual(2);
  expect(await video.evaluate((v: HTMLVideoElement) => v.duration)).toBeCloseTo(
    90,
    1,
  );
  await video.evaluate((v: HTMLVideoElement) => {
    v.currentTime = 65;
  });
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState))
    .toBeGreaterThanOrEqual(2);
  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(page.locator("video")).toHaveCount(0);
  const response = await request.get("/transcripts/reel-transcript.txt");
  expect(response.status()).toBe(200);
  expect(await response.text()).toContain("MeetingScheduled");
});

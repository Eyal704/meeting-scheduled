/** One-page visual portfolio. Original photos + footage, live text and links. */
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdir, writeFile, copyFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
const root = resolve(import.meta.dirname, "../..");
const temp = resolve(root, "tmp/pdfs");
const output = resolve(root, "output/pdf/eyal-taieb-portfolio.pdf");
await mkdir(temp, { recursive: true });
const local = (p) => pathToFileURL(resolve(root, p)).href;
// Embed JPEGs sized for their printed placement; keep the original files untouched.
const assetNames = [
  "headshot",
  "meetingscheduled-poster",
  "voice-agent-poster",
  "speed-dialer-poster",
  "crm-poster",
  "gdc",
  "discovery-1",
  "closed-won",
];
for (const name of assetNames) {
  await sharp(resolve(root, "portfolio/public/media/" + name + ".webp"))
    .resize({
      width: name === "headshot" ? 650 : name.includes("poster") ? 520 : 400,
      withoutEnlargement: true,
    })
    .jpeg({ quality: 91, mozjpeg: true })
    .toFile(resolve(temp, name + ".jpg"));
}
const media = (p) =>
  pathToFileURL(resolve(temp, p.replace(".webp", ".jpg"))).href;
const base = "https://www.meeting-scheduled.com/eyal/";
const projects = [
  {
    n: "01",
    title: "MeetingScheduled",
    subtitle: "AI Outbound<br>Operating System",
    description:
      "Company research, decision-makers, signals and personalized outreach in one complete outbound cadence.",
    image: "meetingscheduled",
    slug: "meetingscheduled",
    duration: "4:01",
  },
  {
    n: "02",
    title: "AI Voice Agent",
    subtitle: "Inbound & Outbound<br>Calling",
    description:
      "Answers calls, qualifies leads and books meetings. Automatically follows up with new website leads.",
    image: "voice-agent",
    slug: "ai-voice-agent",
    duration: "1:47",
  },
  {
    n: "03",
    title: "Speed Dialer",
    subtitle: "Multi-Line<br>Outbound Calling",
    description:
      "Multiple numbers, lead queues, call-status tracking and a clear next action after every call.",
    image: "speed-dialer",
    slug: "speed-dialer",
    duration: "1:49",
  },
  {
    n: "04",
    title: "CRM & Revenue<br>Systems",
    subtitle: "From Workflow<br>to Revenue",
    description:
      "Prospecting, calling, follow-up and pipeline reporting, brought together in a working CRM.",
    image: "crm",
    slug: "crm-revenue-systems",
    duration: "0:48",
  },
];
const arrow =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 19 19 5M5 5h14v14"/></svg>';
const play =
  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m8 5 12 7-12 7z"/></svg>';
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Eyal Taieb - AI Deployment & GTM Builder</title><style>
@font-face{font-family:DM;src:url('${local("node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2")}') format('woff2');font-weight:100 900;font-style:normal;font-display:block}
@page{size:A4;margin:0}*{box-sizing:border-box}html,body{margin:0;padding:0;width:595.276pt;height:841.89pt;background:#09121d;color:#edf3fb;font-family:DM,Arial,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}a{color:inherit;text-decoration:none}h1,h2,h3,p{margin:0}svg{height:9pt;width:9pt;vertical-align:middle}.page{width:595.276pt;height:841.89pt;position:relative;overflow:hidden;background:#09121d}.page:before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 13% 12%,#1b304344,transparent 39%);pointer-events:none}.label{font-size:6.2pt;line-height:9pt;letter-spacing:1.2pt;font-weight:650;color:#93b8e9;text-transform:uppercase}.header{position:absolute;top:23pt;left:31pt;right:31pt;display:flex;align-items:center;justify-content:space-between}.name{font-weight:650;font-size:15.5pt;letter-spacing:-.5pt}.name i{color:#85b9ff;font-style:normal}.header-right{font-size:6.2pt;letter-spacing:1pt;color:#b5c5d8;display:flex;align-items:center;gap:7pt}.dot{height:3pt;width:3pt;background:#90c9ba;border-radius:50%}.hero{position:absolute;top:61pt;left:31pt;right:31pt;height:211pt;display:grid;grid-template-columns:164pt 1fr;gap:29pt}.portrait{height:211pt;position:relative;border-radius:7pt;overflow:hidden;border:0.5pt solid #536175}.portrait img{width:100%;height:100%;object-fit:cover;object-position:50% 32%;display:block}.portrait:after{content:'';position:absolute;inset:60% 0 0;background:linear-gradient(transparent,#09121dd9)}.portrait-signature{position:absolute;z-index:1;left:13pt;bottom:13pt;font-size:7.2pt;line-height:11pt;color:#e7f0ff}.portrait-signature span{display:block;letter-spacing:1.25pt;font-size:5.2pt;color:#b9cce5;margin-bottom:3pt}.hero-copy{padding-top:1pt}.hero .label{font-size:6.2pt;letter-spacing:1.3pt;white-space:nowrap;margin-bottom:8pt}h1{font-size:26pt;line-height:1.08;font-weight:610;letter-spacing:-1pt}h1 em{font-style:normal;color:#83b5ff}.hero-summary{font-size:8.2pt;line-height:12pt;color:#c0cddd;margin-top:10pt;max-width:331pt}.hero-actions{display:flex;gap:8pt;margin-top:13pt}.button{display:inline-flex;align-items:center;justify-content:center;gap:12pt;height:25pt;padding:0 12pt;font-size:7.5pt;font-weight:650;border-radius:4pt;border:.6pt solid #557391}.button.blue{color:#091827;background:#88baff;border-color:#88baff}.button.ghost{background:#101f30;color:#deebfc}.button svg{width:9pt;height:9pt}.metrics{position:absolute;top:287pt;left:31pt;right:31pt;height:57pt;background:#111f2e;border:.55pt solid #344c66;border-radius:6pt;display:grid;grid-template-columns:repeat(4,1fr);align-items:center}.metric{padding:0 12pt;border-right:.5pt solid #354559;height:36pt}.metric:last-child{border-right:0}.metric strong{display:block;font-size:21pt;font-weight:600;letter-spacing:-.8pt;line-height:23pt}.metric span{display:block;font-size:6pt;color:#bdcce0;line-height:8pt;margin-top:4pt}.work-heading{position:absolute;top:362pt;left:31pt;right:31pt;display:flex;justify-content:space-between;align-items:flex-end}.work-heading h2{font-size:19pt;line-height:23pt;letter-spacing:-.7pt;font-weight:570;margin-top:4pt}.work-heading>span{font-size:6.3pt;color:#9cafc6;line-height:10pt;text-align:right;padding-bottom:2pt}.projects{position:absolute;top:408pt;left:31pt;right:31pt;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8pt}.project{height:183pt;background:#0e1c2a;border:.55pt solid #354c63;border-radius:6pt;overflow:hidden;position:relative}.snapshot{height:61pt;position:relative;background:#1b2c3e;display:block;overflow:hidden;border-bottom:.5pt solid #41536a}.snapshot img{width:100%;height:100%;object-fit:cover;object-position:50% 36%;display:block}.snapshot.phone img{width:39pt;margin:auto;object-position:top;filter:brightness(.95)}.snapshot.phone{background:linear-gradient(115deg,#17314a,#0b1725)}.snapshot .play{position:absolute;top:19pt;left:50%;transform:translateX(-50%);width:22pt;height:22pt;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#0b1d33e8;border:.6pt solid #b4ceef;color:#e6f0ff}.snapshot .play svg{width:11pt;height:11pt}.duration{position:absolute;bottom:4pt;right:4pt;font-size:5.3pt;background:#07111de8;border-radius:2pt;padding:1pt 3pt;color:#d7e6fa}.project-body{padding:9pt 9pt 0}.project h3{font-size:9.7pt;line-height:11pt;letter-spacing:-.25pt;font-weight:620;height:23pt}.project-subtitle{font-size:6.7pt;line-height:9pt;color:#86b7f6;margin-top:2pt;height:20pt}.project-description{font-size:7.2pt;line-height:9.5pt;color:#bdcbdc;margin-top:4pt}.project-link{position:absolute;left:9pt;right:9pt;bottom:9pt;display:flex;align-items:center;justify-content:space-between;font-size:6.6pt;color:#a2c9ff;font-weight:600}.project-link svg{height:8pt;width:8pt}.lower{position:absolute;top:605pt;left:31pt;right:31pt;display:grid;grid-template-columns:1fr 1fr;gap:24pt}.about h2{font-size:17pt;line-height:19pt;font-weight:550;letter-spacing:-.5pt;margin-bottom:8pt}.about h2 span{color:#a9bdd6}.about p{font-size:7.8pt;line-height:11pt;color:#b9c9dd}.evidence .label{font-size:6.1pt}.proof-photos{display:grid;grid-template-columns:63pt 1fr 41pt;gap:6pt;margin-top:8pt;height:57pt}.proof-photos a{display:block;overflow:hidden;border-radius:3pt;position:relative;background:#fff;border:.4pt solid #48607a}.proof-photos img{width:100%;height:100%;display:block;object-fit:cover}.proof-photos .gdc img{object-position:50% 34%}.proof-photos .won img{object-fit:contain}.proof-caption{display:flex;justify-content:space-between;align-items:center;color:#c3d0e1;font-size:6.2pt;margin-top:7pt;line-height:9pt}.proof-caption strong{color:#e0ebfa;font-weight:600}.proof-caption svg{width:8pt;height:8pt;color:#8abaff}.tools{position:absolute;top:719pt;left:31pt;right:31pt;border-top:.5pt solid #2f4359;padding-top:10pt;display:grid;grid-template-columns:75pt 1fr;align-items:center}.tools .label{font-size:5.7pt}.tools p{font-size:7pt;line-height:10pt;color:#cad7e7}.process{position:absolute;top:743pt;left:31pt;right:31pt;display:grid;grid-template-columns:75pt 1fr;align-items:center}.process .label{font-size:5.7pt}.process p{font-size:5.9pt;line-height:8pt;color:#93a9c2;white-space:nowrap}.experience{position:absolute;top:762pt;left:31pt;right:31pt;display:flex;align-items:center;gap:20pt}.experience .label{font-size:5.5pt;color:#8ea4be;letter-spacing:.8pt}.companies{flex:1;display:flex;justify-content:space-between;align-items:center;font-size:8.6pt;letter-spacing:-.3pt;color:#d4dfec}.companies span:first-child{font-weight:750;font-style:italic}.companies span:nth-child(4){font-weight:650}.footer{position:absolute;left:31pt;right:31pt;top:784pt;border-top:.5pt solid #3b536e;padding-top:10pt;display:flex;align-items:center;justify-content:space-between;gap:15pt}.footer-title{font-size:15pt;letter-spacing:-.4pt;font-weight:550;line-height:19pt}.footer-title span{display:block;font-size:5.8pt;color:#91a9c4;letter-spacing:.2pt;line-height:9pt;margin-top:2pt}.footer-links{text-align:right;font-size:7pt;color:#b7d4fa;line-height:12pt}.footer-links .email{color:#edf3fb;font-weight:600;font-size:8pt}.footer-links .divider{color:#496580;padding:0 6pt}
</style></head><body><main class="page">
<header class="header"><div class="name">EYAL TAIEB<i>.</i></div><div class="header-right"><span class="dot"></span> BUSINESS CONTEXT. TECHNICAL EXECUTION.</div></header>
<section class="hero"><div class="portrait"><img src="${media("headshot.webp")}" alt="Eyal Taieb"><div class="portrait-signature"><span>FROM PROBLEM TO PRODUCTION</span>Built with business in mind.</div></div><div class="hero-copy"><p class="label">AI DEPLOYMENT & GTM BUILDER</p><h1>I build and deploy<br>AI systems that turn<br>business workflows<br><em>into revenue.</em></h1><p class="hero-summary">From outbound platforms and voice agents to calling systems and CRM workflows, I connect business problems with software people actually use and real commercial outcomes.</p><div class="hero-actions"><a href="${base}media/eyal-90-seconds-v2.mp4" class="button blue">Watch 90-sec reel ${play}</a><a href="${base}#projects" class="button ghost">View projects ${arrow}</a></div></div></section>
<section class="metrics">${[
  ["$4M+", "Qualified Pipeline Generated"],
  ["~$700K", "Contributed in Closed Business"],
  ["150%", "Annual Quota Attainment"],
  ["8+ Years", "GTM, Sales & AI Automation"],
]
  .map(
    ([v, l]) =>
      `<div class="metric"><strong>${v}</strong><span>${l}</span></div>`,
  )
  .join("")}</section>
<div class="work-heading"><div><p class="label">SELECTED WORK / BUILT & DEPLOYED</p><h2>Working systems, not prototypes.</h2></div><span>Adaptable to existing workflows,<br>data and infrastructure.</span></div>
<section class="projects">${projects.map((p) => `<article class="project"><a class="snapshot ${p.image === "speed-dialer" ? "phone" : ""}" href="${base}projects/${p.slug}/#demo"><img src="${media(p.image + "-poster.webp")}" alt="${p.title.replace("<br>", " ")} actual product footage"><span class="play">${play}</span><span class="duration">${p.duration}</span></a><div class="project-body"><h3>${p.title}</h3><p class="project-subtitle">${p.subtitle}</p><p class="project-description">${p.description}</p></div><a class="project-link" href="${base}projects/${p.slug}/">View project & demo ${arrow}</a></article>`).join("")}</section>
<section class="lower"><div class="about"><h2>A bridge between business<br><span>and technology.</span></h2><p>Years of B2B pipeline building and technical sales shaped how I build AI systems today: understand the business problem, implement the workflow, and make it useful in the real world.</p></div><div class="evidence"><p class="label">COMMERCIAL PROOF / ORIGINAL IMAGES</p><div class="proof-photos"><a class="gdc" href="${base}#evidence"><img src="${media("gdc.webp")}" alt="Eyal representing Incredibuild at GDC"></a><a href="${base}#evidence"><img src="${media("discovery-1.webp")}" alt="Original customer discovery meeting"></a><a class="won" href="${base}#evidence"><img src="${media("closed-won.webp")}" alt="Salesforce snapshot showing USD 367K Closed Won"></a></div><a class="proof-caption" href="${base}#evidence"><span>Real customer work. <strong>$367K Closed Won snapshot.</strong></span>${arrow}</a></div></section>
<div class="tools"><p class="label">TECH & TOOLS</p><p>Claude · Cursor · Next.js · Supabase/Postgres · Vercel · APIs · LLMs · Voice AI · CRM integrations</p></div>
<div class="process"><p class="label">HOW I WORK</p><p>Business problem → Workflow design → AI/system architecture → Implementation → Deployment → User feedback → Iteration → Business outcome</p></div>
<div class="experience"><p class="label">EXPERIENCE WITH</p><div class="companies"><span>Incredibuild</span><span>Epox.ai</span><span>RampedUp</span><span>Twingo.co.il</span><span>SingleStore</span></div></div>
<footer class="footer"><div class="footer-title">Let’s build what’s next.<span>AI Deployment · Forward Deployed AI · GTM Engineering · AI Solutions</span></div><div class="footer-links"><a class="email" href="mailto:eyal.growth@gmail.com">eyal.growth@gmail.com ${arrow}</a><br><a href="tel:+4367762921189">+43 677 62921189</a><br><a href="${base}">meeting-scheduled.com/eyal</a><span class="divider">/</span><a href="https://www.linkedin.com/in/eyalshoval/">LinkedIn</a></div></footer>
</main></body></html>`;
const htmlPath = resolve(temp, "eyal-portfolio-v2.html");
await writeFile(htmlPath, html);
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1191, height: 1684 },
    deviceScaleFactor: 1,
  });
  await page.goto(pathToFileURL(htmlPath).href);
  await page.evaluate(() => document.fonts.ready);
  await page
    .locator("img")
    .evaluateAll((images) => Promise.all(images.map((i) => i.decode())));
  const overflows = await page
    .locator(".project-description,.hero-summary,.about p,.tools p,.process p")
    .evaluateAll((elements) =>
      elements
        .filter(
          (e) =>
            e.scrollHeight > e.clientHeight + 1 ||
            e.scrollWidth > e.clientWidth + 1,
        )
        .map((e) => e.className || e.textContent),
    );
  if (overflows.length)
    throw new Error("Layout overflow: " + JSON.stringify(overflows));
  const crowdedCards = await page
    .locator(".project")
    .evaluateAll((cards) =>
      cards
        .filter(
          (card) =>
            card.querySelector(".project-link").getBoundingClientRect().top -
              card.querySelector(".project-description").getBoundingClientRect()
                .bottom <
            4,
        )
        .map((card) => card.querySelector("h3").textContent),
    );
  if (crowdedCards.length)
    throw new Error("Crowded card text: " + crowdedCards.join(", "));
  await page.pdf({
    path: output,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    tagged: true,
    outline: true,
  });
  await page.screenshot({
    path: resolve(temp, "eyal-portfolio-v2-browser.png"),
    fullPage: true,
  });
  await copyFile(
    output,
    resolve(root, "portfolio/public/documents/eyal-taieb-portfolio.pdf"),
  );
  console.log(`Created ${output}`);
} finally {
  await browser.close();
}

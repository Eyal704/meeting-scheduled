import { assetPath } from "@/lib/paths";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  AudioLines,
  Braces,
  Check,
  FileText,
  Layers3,
  Phone,
  Play,
  Workflow,
} from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { EvidenceGallery } from "@/components/evidence-gallery";
import { MediaDialog } from "@/components/media-dialog";
import { companies, toolNames, workReel } from "@/lib/content";
import { getContent } from "@/lib/copy";
import type { Locale } from "@/lib/i18n";

export function HomePage({ locale }: { locale: Locale }) {
  const { projects, metrics, evidence, copy: t } = getContent(locale);
  return (
    <main id="main-content">
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="availability">
            <span className="status-dot" /> {t.availability}
          </div>
          <p className="eyebrow hero-eyebrow">{t.role}</p>
          <h1 id="hero-title">
            {t.heroTitle} <span>{t.heroAccent}</span>
          </h1>
          <p className="hero-description">{t.heroDescription}</p>
          <div className="hero-actions">
            <MediaDialog
              title={t.overviewTitle}
              src={assetPath(workReel.src)}
              poster={assetPath(workReel.poster)}
              caption={t.overviewCaption}
              className="button button-primary"
            >
              <Play size={20} fill="currentColor" aria-hidden="true" />{" "}
              {t.watchOverview}
            </MediaDialog>
            <a href="#projects" className="button button-secondary">
              {t.viewProjects} <ArrowDown size={20} aria-hidden="true" />
            </a>
          </div>
          <a
            className="text-link hero-phone"
            href="tel:+4367762921189"
            dir="ltr"
          >
            <Phone size={16} aria-hidden="true" /> +43 677 62921189
          </a>
        </div>
        <div className="hero-visual">
          <div className="portrait-frame">
            <Image
              className="hero-portrait"
              src={assetPath("/media/headshot.webp")}
              alt={t.portraitAlt}
              width={900}
              height={1352}
              sizes="(max-width: 680px) 90vw, (max-width: 1100px) 40vw, 440px"
              priority
            />
            <div className="portrait-label">
              <span className="portrait-label-icon">
                <Workflow size={24} />
              </span>
              <div>
                <strong>{t.portraitLabel}</strong>
                <span>{t.portraitSubLabel}</span>
              </div>
            </div>
            <a
              className="text-link portfolio-download"
              href={assetPath("/documents/eyal-taieb-portfolio.pdf")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileText size={15} /> {t.downloadPortfolio}{" "}
              <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="portrait-caption">
            <span>EYAL TAIEB</span>
            <span>{t.portraitCaption}</span>
          </div>
        </div>
      </section>

      <section
        className="metrics-section container"
        aria-label={t.metricsLabel}
      >
        <div className="metrics-grid">
          {metrics.map((metric) => (
            <div className="metric" key={metric.label}>
              <strong dir="ltr">{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
        <p className="metrics-note">{t.metricsNote}</p>
      </section>

      <section
        id="projects"
        className="section container"
        aria-labelledby="projects-title"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">{t.projectsEyebrow}</span>
            <h2 id="projects-title">
              {t.projectsTitle}
              <br />
              <span className="muted">{t.projectsMuted}</span>
            </h2>
          </div>
          <p>{t.projectsIntro}</p>
        </div>
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} locale={locale} />
          ))}
        </div>
      </section>

      <section
        id="work-reel"
        className="reel-section container"
        aria-labelledby="reel-title"
      >
        <div className="reel-panel">
          <div className="reel-copy">
            <span className="eyebrow">{t.reelEyebrow}</span>
            <h2 id="reel-title">
              {t.reelTitle}
              <br />
              {t.reelTitle2}
              <span className="accent">.</span>
            </h2>
            <p>{t.reelText}</p>
            <MediaDialog
              title={t.reelDialogTitle}
              autoOpenHash="watch-reel"
              src={assetPath(workReel.src)}
              poster={assetPath(workReel.poster)}
              caption={t.reelCaption}
              className="button button-primary"
            >
              <Play size={17} fill="currentColor" /> {t.watchReel}
            </MediaDialog>
            <a
              className="text-link reel-transcript"
              href={assetPath("/transcripts/reel-transcript.txt")}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.readTranscript} <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="reel-visual" aria-hidden="true">
            <div className="reel-browser">
              <div className="preview-topbar">
                <span className="window-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span>{t.reelTopbar}</span>
              </div>
              <Image
                src={assetPath(workReel.poster)}
                alt=""
                width={1280}
                height={720}
                sizes="(max-width: 680px) 80vw, 580px"
              />
              <span className="reel-time">
                01:30 <span>{t.reelSubtitles}</span>
              </span>
            </div>
            <div className="reel-track">
              <span>OUTBOUND</span>
              <span>VOICE AI</span>
              <span>CALLING</span>
              <span>CRM</span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="evidence"
        className="section evidence-section container"
        aria-labelledby="evidence-title"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">{t.evidenceEyebrow}</span>
            <h2 id="evidence-title">
              {t.evidenceTitle}
              <br />
              <span className="muted">{t.evidenceMuted}</span>
            </h2>
          </div>
          <p>{t.evidenceIntro}</p>
        </div>
        <div className="evidence-context">
          <Check size={16} />
          <p>{t.evidenceContext}</p>
        </div>
        <EvidenceGallery evidence={evidence} />
      </section>

      <section
        id="about"
        className="section about-section container"
        aria-labelledby="about-title"
      >
        <div className="about-grid">
          <div className="about-copy">
            <span className="eyebrow">{t.aboutEyebrow}</span>
            <h2 id="about-title">
              {t.aboutTitle}
              <br />
              <span className="muted">{t.aboutMuted}</span>
            </h2>
            <p>{t.aboutText}</p>
            <a
              className="text-link"
              href={assetPath("/documents/eyal-taieb-cv.pdf")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileText size={17} /> {t.viewCv} <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="tools-panel">
            <div className="tools-header">
              <Braces size={22} />
              <span className="eyebrow">{t.tools}</span>
            </div>
            <ul className="tools-list">
              {toolNames.map((tool, index) => (
                <li key={tool}>
                  <span className="tool-glyph" aria-hidden="true">
                    {index === 0 ? (
                      "✳"
                    ) : index === 1 ? (
                      "⌘"
                    ) : index === 2 ? (
                      "N"
                    ) : index === 3 ? (
                      "↯"
                    ) : index === 4 ? (
                      "▲"
                    ) : index === 5 ? (
                      "{ }"
                    ) : index === 6 ? (
                      <Layers3 size={19} />
                    ) : index === 7 ? (
                      <AudioLines size={19} />
                    ) : (
                      <Workflow size={19} />
                    )}
                  </span>
                  {tool}
                </li>
              ))}
            </ul>
            <p>{t.toolsNote}</p>
          </div>
        </div>
        <div className="experience">
          <span className="eyebrow">{t.experience}</span>
          <ul>
            {companies.map((company) => (
              <li key={company.name}>
                <a href={company.url} target="_blank" rel="noopener noreferrer">
                  {company.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
